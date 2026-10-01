const ALLOWED_ORIGIN = "https://wani-neco-san.github.io";
const TEXT_MODEL = "gpt-6.1-sol";
const IMAGE_MODEL = "gpt-image-2.5-sunburst";

function cors(origin) {
  const allowed = origin === ALLOWED_ORIGIN ? origin : ALLOWED_ORIGIN;
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin",
  };
}

function json(data, status = 200, origin = "") {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...cors(origin),
    },
  });
}

async function openai(path, apiKey, body) {
  const res = await fetch(`https://api.openai.com/v1${path}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = { raw: text }; }

  if (!res.ok) {
    const message = data?.error?.message || `OpenAI API error (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.detail = data?.error?.code || data?.error?.type || null;
    throw err;
  }
  return data;
}

function responseText(data) {
  if (typeof data?.output_text === "string" && data.output_text.trim()) return data.output_text;
  for (const item of data?.output || []) {
    if (item?.type !== "message") continue;
    for (const part of item?.content || []) {
      if ((part?.type === "output_text" || part?.type === "text") && typeof part.text === "string") {
        return part.text;
      }
    }
  }
  return "";
}

function pageLayoutInstruction(index) {
  if (index === 0) {
    return `\n\n【最優先レイアウト】\nこれは記事の先頭誌面です。誌面上部の約25％を、後から病院名・広報タイトル等のヘッダーを差し込むための完全な白紙予約領域にしてください。その領域には文字、線、枠、背景色、キャラクター、アイコン、装飾、ページ番号を一切置かないでください。白紙領域の下から通常の誌面を開始してください。`;
  }
  return `\n\n【最優先レイアウト】\nこれは記事の継続誌面です。上部25％のヘッダー差し込み用空白を絶対に作らないでください。上端から通常の誌面余白で開始してください。先頭誌面の大きな上部空白を引き継がないでください。`;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      if (origin && origin !== ALLOWED_ORIGIN) return new Response(null, { status: 403 });
      return new Response(null, { status: 204, headers: cors(origin) });
    }

    const url = new URL(request.url);
    if (request.method !== "POST" || url.pathname !== "/generate") {
      return json({ ok: false, error: "Not found" }, 404, origin);
    }

    if (origin && origin !== ALLOWED_ORIGIN) {
      return json({ ok: false, error: "Origin not allowed" }, 403, origin);
    }

    if (!env.OPENAI_API_KEY) {
      return json({ ok: false, error: "OPENAI_API_KEY is not configured" }, 500, origin);
    }

    try {
      const body = await request.json();
      const masterPrompt = String(body?.masterPrompt || "").trim();
      const pages = Math.max(1, Math.min(6, Number(body?.pages || 2)));

      if (!masterPrompt) return json({ ok: false, error: "原稿用プロンプトが空です。" }, 400, origin);
      if (masterPrompt.length > 60000) return json({ ok: false, error: "入力が長すぎます。" }, 400, origin);

      const schema = {
        type: "object",
        additionalProperties: false,
        properties: {
          article_master: { type: "string" },
          pages: {
            type: "array",
            minItems: 1,
            maxItems: 6,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                page_number: { type: "integer" },
                title: { type: "string" },
                image_prompt: { type: "string" },
              },
              required: ["page_number", "title", "image_prompt"],
            },
          },
          sources: {
            type: "array",
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                title: { type: "string" },
                url: { type: "string" },
              },
              required: ["title", "url"],
            },
          },
        },
        required: ["article_master", "pages", "sources"],
      };

      const planningInput = `${masterPrompt}\n\n==================================================\nAPI自動生成用の追加指示【最優先】\n==================================================\nこの依頼を調査・編集し、指定ページ数 ${pages} 枚の院内広報として完成させてください。必要な場合はWeb検索を使い、入力されたURL・一次情報・最新情報を確認してください。\n\n最終出力はJSONスキーマに従います。\n・article_master：完成した記事全体と各ページの確定原稿を、人が確認できる形でまとめる。\n・pages：必ずちょうど ${pages} 件。page_number は1から連番。\n・各 image_prompt：そのページ1枚だけを画像生成モデルへ渡せば完成誌面を描ける、自己完結した日本語プロンプトにする。確定した見出し・本文・数字・表・出典表記を省略せず含める。\n・画像内に表示する日本語の文章は、image_prompt 内で引用符などを使い、正確な文言として明示する。画像生成時に新しい事実や文章を追加させない。\n・各ページは1枚のA4縦誌面。複数ページを1画像に並べない。ページ番号を入れない。\n・共通デザインDNAと、そのページに使う珍しい動物・動作も image_prompt に含める。\n・sources：実際に確認・使用した主要な出典。URLを推測で作らない。\n`;

      const planResponse = await openai("/responses", env.OPENAI_API_KEY, {
        model: TEXT_MODEL,
        reasoning: { effort: "high" },
        tools: [{ type: "web_search" }],
        tool_choice: "auto",
        input: planningInput,
        store: false,
        max_output_tokens: 24000,
        text: {
          format: {
            type: "json_schema",
            name: "medical_info_pr_plan",
            strict: true,
            schema,
          },
        },
      });

      const raw = responseText(planResponse);
      if (!raw) throw new Error("原稿生成結果を取得できませんでした。");

      let plan;
      try { plan = JSON.parse(raw); }
      catch { throw new Error("原稿生成結果のJSON解析に失敗しました。"); }

      if (!Array.isArray(plan.pages) || plan.pages.length !== pages) {
        throw new Error(`ページ分割が指定枚数（${pages}枚）になりませんでした。`);
      }

      const images = [];
      for (let i = 0; i < plan.pages.length; i++) {
        const p = plan.pages[i];
        const finalPrompt = `${p.image_prompt}\n\n${pageLayoutInstruction(i)}\n\n【画像生成の固定条件】\nCREATE EXACTLY ONE SINGLE FLAT PORTRAIT A4 CANVAS. RETURN EXACTLY ONE FINAL IMAGE. THE IMAGE CONTAINS EXACTLY ONE PHYSICAL SHEET. DO NOT CREATE MULTIPLE DESIGN VARIATIONS. DO NOT ADD PAGE NUMBERS. Render only the finalized Japanese copy specified in this prompt. Do not invent new facts, numbers, labels, contact information, logos, QR codes, hospital names, or copy.`;

        const imageResponse = await openai("/images/generations", env.OPENAI_API_KEY, {
          model: IMAGE_MODEL,
          prompt: finalPrompt,
          size: "1024x1536",
          quality: "medium",
          output_format: "png",
          n: 1,
        });

        const b64 = imageResponse?.data?.[0]?.b64_json;
        if (!b64) throw new Error(`${i + 1}枚目の画像データを取得できませんでした。`);

        images.push({
          page: i + 1,
          title: String(p.title || `${i + 1}枚目`),
          mime: "image/png",
          data: b64,
        });
      }

      return json({
        ok: true,
        text_model: TEXT_MODEL,
        image_model: IMAGE_MODEL,
        master: plan.article_master,
        sources: plan.sources || [],
        images,
      }, 200, origin);
    } catch (err) {
      return json({
        ok: false,
        error: err?.message || "生成中にエラーが発生しました。",
        code: err?.detail || null,
      }, err?.status && err.status < 500 ? err.status : 500, origin);
    }
  },
};
