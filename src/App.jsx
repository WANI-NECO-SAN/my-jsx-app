import { useState, useRef, useCallback, useEffect } from "react";

// ---- CHAR DATA (compact) ----
const RACE=[{id:"A1",ja:"人間（男性）",en:"human male"},{id:"A2",ja:"人間（女性）",en:"human female"},{id:"A3",ja:"人間（子供）",en:"human child"},{id:"A4",ja:"老人♂",en:"elderly human male"},{id:"A5",ja:"老人♀",en:"elderly human female"},{id:"A6",ja:"エルフ♂",en:"male elf with pointed ears"},{id:"A7",ja:"エルフ♀",en:"female elf with pointed ears"},{id:"A8",ja:"ドワーフ♂",en:"male dwarf, short and stocky"},{id:"A9",ja:"ドワーフ♀",en:"female dwarf, short and sturdy"},{id:"A10",ja:"獣人（狼）",en:"male wolf beastkin with wolf ears and tail"},{id:"A11",ja:"獣人（猫）",en:"female cat beastkin with cat ears and tail"},{id:"A12",ja:"悪魔",en:"demon with small horns and sharp teeth"},{id:"A13",ja:"天使",en:"angel with small wings"},{id:"A14",ja:"アンデッド",en:"skeleton undead"},{id:"A15",ja:"ゴブリン",en:"small green goblin"},{id:"A16",ja:"オーク",en:"large green orc with tusks"},{id:"A17",ja:"スライム人型",en:"humanoid slime, translucent body"},{id:"A18",ja:"ゴーレム",en:"mechanical golem with glowing eyes"},{id:"A19",ja:"竜人",en:"dragonkin with scales and small wings"},{id:"A20",ja:"妖精",en:"tiny fairy with butterfly wings"}];
const ROLE=[{id:"B1",ja:"剣士",en:"warrior fighter"},{id:"B2",ja:"騎士",en:"armored knight"},{id:"B3",ja:"魔法使い",en:"wizard mage"},{id:"B4",ja:"僧侶",en:"priest healer"},{id:"B5",ja:"弓使い",en:"archer ranger"},{id:"B6",ja:"盗賊",en:"rogue thief"},{id:"B7",ja:"忍者",en:"ninja assassin"},{id:"B8",ja:"侍",en:"samurai"},{id:"B9",ja:"吟遊詩人",en:"bard musician"},{id:"B10",ja:"錬金術師",en:"alchemist"},{id:"B11",ja:"村人",en:"villager farmer"},{id:"B12",ja:"商人",en:"merchant shopkeeper"},{id:"B13",ja:"王様/女王",en:"king / queen with crown"},{id:"B14",ja:"貴族",en:"noble aristocrat"},{id:"B15",ja:"鍛冶屋",en:"blacksmith"},{id:"B16",ja:"料理人",en:"cook chef"},{id:"B17",ja:"学者",en:"scholar librarian"},{id:"B18",ja:"海賊",en:"pirate"},{id:"B19",ja:"傭兵",en:"mercenary"},{id:"B20",ja:"魔王/ボス",en:"dark lord boss character"}];
const HAIR=[{id:"C1",ja:"短髪",en:"short straight hair"},{id:"C2",ja:"短髪ツンツン",en:"short spiky hair"},{id:"C3",ja:"ミディアム",en:"medium length straight hair"},{id:"C4",ja:"ミディアム波",en:"medium length wavy hair"},{id:"C5",ja:"ロング",en:"long straight hair"},{id:"C6",ja:"ロング波",en:"long wavy hair"},{id:"C7",ja:"ツインテール",en:"long twin tails"},{id:"C8",ja:"ポニーテール",en:"ponytail"},{id:"C9",ja:"お団子",en:"hair bun"},{id:"C10",ja:"三つ編み",en:"braided hair"},{id:"C11",ja:"モヒカン",en:"mohawk"},{id:"C12",ja:"坊主",en:"bald / shaved head"},{id:"C13",ja:"アフロ",en:"afro hair"},{id:"C14",ja:"オールバック",en:"slicked back hair"},{id:"C15",ja:"ボブカット",en:"bob cut"},{id:"C16",ja:"ドレッド",en:"dreadlocks"},{id:"C17",ja:"フード",en:"hidden under hood"},{id:"C18",ja:"兜",en:"hidden under helmet"},{id:"C19",ja:"白髭（老人）",en:"long white beard"},{id:"C20",ja:"炎の髪",en:"flaming hair made of fire"}];
const HAIR_COLOR=[{id:"D1",ja:"黒",en:"black"},{id:"D2",ja:"茶",en:"brown"},{id:"D3",ja:"金",en:"blonde"},{id:"D4",ja:"赤",en:"red"},{id:"D5",ja:"白/銀",en:"white / silver"},{id:"D6",ja:"青",en:"blue"},{id:"D7",ja:"緑",en:"green"},{id:"D8",ja:"紫",en:"purple"},{id:"D9",ja:"ピンク",en:"pink"},{id:"D10",ja:"オレンジ",en:"orange"},{id:"D11",ja:"グレー",en:"gray"},{id:"D12",ja:"水色",en:"light blue"}];
const OUTFIT=[{id:"E1",ja:"重装鎧",en:"full plate heavy armor"},{id:"E2",ja:"軽装鎧",en:"light leather armor"},{id:"E3",ja:"ローブ",en:"long wizard robe"},{id:"E4",ja:"法衣",en:"priest vestments with holy symbols"},{id:"E5",ja:"忍者装束",en:"ninja outfit, dark wrappings"},{id:"E6",ja:"侍の着物",en:"samurai kimono with armor plates"},{id:"E7",ja:"村人の服",en:"simple villager clothes, tunic and pants"},{id:"E8",ja:"商人の服",en:"merchant outfit with apron and pouches"},{id:"E9",ja:"王族衣装",en:"royal outfit with cape and gold trim"},{id:"E10",ja:"貴族ドレス",en:"noble formal dress / suit"},{id:"E11",ja:"海賊の服",en:"pirate outfit with bandana and vest"},{id:"E12",ja:"民族衣装",en:"ethnic tribal outfit with patterns"},{id:"E13",ja:"ゴシック",en:"gothic dark fantasy outfit"},{id:"E14",ja:"鍛冶エプロン",en:"blacksmith leather apron, bare arms"},{id:"E15",ja:"料理人",en:"chef outfit with hat"},{id:"E16",ja:"ボロボロ",en:"tattered ragged clothes"},{id:"E17",ja:"マント+フード",en:"hooded cloak over simple clothes"},{id:"E18",ja:"スチームパンク",en:"steampunk outfit with goggles and gears"},{id:"E19",ja:"学者の服",en:"scholar outfit with glasses and books"},{id:"E20",ja:"なし(モンスター)",en:"no clothes (for monsters)"}];
const WEAPON=[{id:"F1",ja:"長剣",en:"longsword"},{id:"F2",ja:"大剣",en:"greatsword held with both hands"},{id:"F3",ja:"ダガー",en:"dagger"},{id:"F4",ja:"刀",en:"katana"},{id:"F5",ja:"槍",en:"spear / lance"},{id:"F6",ja:"斧",en:"battle axe"},{id:"F7",ja:"大斧",en:"large two-handed axe"},{id:"F8",ja:"ハンマー",en:"war hammer / mace"},{id:"F9",ja:"弓",en:"bow with quiver of arrows"},{id:"F10",ja:"クロスボウ",en:"crossbow"},{id:"F11",ja:"魔法の杖",en:"magic staff with crystal on top"},{id:"F12",ja:"魔導書",en:"spellbook, floating open book"},{id:"F13",ja:"盾+剣",en:"sword and shield"},{id:"F14",ja:"双剣",en:"dual wielding two swords"},{id:"F15",ja:"鎌",en:"scythe"},{id:"F16",ja:"鞭",en:"whip"},{id:"F17",ja:"爪/格闘",en:"claw gauntlets / bare fists"},{id:"F18",ja:"楽器",en:"lute musical instrument"},{id:"F19",ja:"素手",en:"no weapon, empty hands"},{id:"F20",ja:"薬瓶",en:"holding potion bottles"}];
const ACCESSORY=[{id:"G1",ja:"なし",en:""},{id:"G2",ja:"角",en:"ram horns"},{id:"G3",ja:"翼",en:"small wings on back"},{id:"G4",ja:"尻尾",en:"tail"},{id:"G5",ja:"眼帯",en:"eye patch"},{id:"G6",ja:"傷跡",en:"facial scar"},{id:"G7",ja:"メガネ",en:"glasses"},{id:"G8",ja:"王冠",en:"crown / tiara"},{id:"G9",ja:"魔女帽子",en:"witch hat"},{id:"G10",ja:"はちまき",en:"headband"},{id:"G11",ja:"ピアス",en:"earrings"},{id:"G12",ja:"仮面",en:"mask covering face"},{id:"G13",ja:"マフラー",en:"scarf"},{id:"G14",ja:"タトゥー",en:"tattoos / glowing markings"},{id:"G15",ja:"光る目",en:"glowing eyes"},{id:"G16",ja:"エルフ耳",en:"long pointed elf ears"},{id:"G17",ja:"立派なヒゲ",en:"large impressive beard"},{id:"G18",ja:"そばかす",en:"freckles"},{id:"G19",ja:"リュック",en:"large backpack"},{id:"G20",ja:"肩にペット",en:"small pet animal on shoulder"}];
const BUILD=[{id:"H1",ja:"標準",en:"average build"},{id:"H2",ja:"筋肉質",en:"muscular strong build"},{id:"H3",ja:"細身",en:"slim slender build"},{id:"H4",ja:"小柄",en:"small petite build"},{id:"H5",ja:"大柄",en:"large tall imposing build"},{id:"H6",ja:"太め",en:"heavy round build"},{id:"H7",ja:"子供体型",en:"child-sized proportions"},{id:"H8",ja:"極小",en:"tiny creature-sized"}];
const MONSTER=[{id:"M1",ja:"スライム",en:"round slime monster, bouncy jelly body"},{id:"M2",ja:"コウモリ",en:"bat creature with large wings"},{id:"M3",ja:"狼",en:"wild wolf, fierce and snarling"},{id:"M4",ja:"スケルトン",en:"skeleton warrior with bones visible"},{id:"M5",ja:"ゾンビ",en:"zombie with rotting flesh"},{id:"M6",ja:"ゴースト",en:"ghost, translucent floating spirit"},{id:"M7",ja:"ゴブリン兵",en:"goblin soldier with crude weapon"},{id:"M8",ja:"オーク戦士",en:"orc warrior, large and muscular"},{id:"M9",ja:"小型ドラゴン",en:"small dragon, wingless whelp"},{id:"M10",ja:"大型ドラゴン",en:"large dragon with wings and fire breath"},{id:"M11",ja:"大蜘蛛",en:"giant spider"},{id:"M12",ja:"ミミック",en:"mimic, treasure chest with teeth and tongue"},{id:"M13",ja:"トレント",en:"treant, living tree monster"},{id:"M14",ja:"ガーゴイル",en:"gargoyle, stone creature with wings"},{id:"M15",ja:"キノコ",en:"mushroom creature, walking fungus"},{id:"M16",ja:"目玉",en:"floating eyeball monster, single large eye"},{id:"M17",ja:"デスナイト",en:"death knight, dark armored undead"},{id:"M18",ja:"リッチ",en:"lich, skeletal mage with dark robes"},{id:"M19",ja:"ワーム",en:"giant worm, segmented body"},{id:"M20",ja:"エレメンタル",en:"elemental creature made of fire / ice / rock"}];
const ANIMATIONS=[
  {id:"idle",ja:"🧍 待機",frames:4,desc:"Standing naturally, sword at side, normal posture|Slight inhale, chest rising very slightly, hair shifting gently|Full inhale, chest at highest, subtle upward shift of shoulders|Exhaling, chest lowering back, returning toward Frame 1 posture",note:"Movement should be very subtle - only slight breathing motion.\nFeet remain planted on the same ground line in all frames."},
  {id:"walk",ja:"🚶 歩行",frames:6,desc:"Right foot forward on ground, left foot behind, left arm forward, right arm back|Right foot flat on ground, body centered, left foot lifting off, arms at sides|Left foot swinging forward past right foot, weight shifting, arms switching|Left foot forward on ground, right foot behind, right arm forward, left arm back|Left foot flat on ground, body centered, right foot lifting off, arms at sides|Right foot swinging forward past left foot, weight shifting, arms switching",note:"The character's feet should touch the same ground line in all frames."},
  {id:"run",ja:"🏃 走行",frames:8,desc:"Right foot stretched far forward, left foot stretched far behind, wide stride|Right foot on ground directly below body, left foot swinging forward, arms switching|Both feet off ground, body airborne, right arm forward, left arm back|Left foot reaching forward in air, right foot trailing behind|Left foot landing on ground, right arm forward, body leaning forward|Left foot pushing off, right foot swinging forward, arms switching|Both feet off ground, body airborne, left arm forward, right arm back|Right foot reaching forward, returning to Frame 1 position",note:"Hair and skirt should flow backward.\nLeg positions MUST be visibly different between frames."},
  {id:"attack",ja:"⚔️ 攻撃",frames:6,desc:"Battle ready stance, slight crouch, sword held at side|Wind up, sword raised high behind head with both hands, body twisted back|Swing begins, sword arcing forward overhead, body rotating forward aggressively|Full slash moment, sword extended far forward at maximum reach|Follow through, sword past target swinging downward, body leaning forward with momentum|Recovery, pulling back to ready stance, sword returning to side",note:"DO NOT draw any slash effects, trails, or impact effects. Body animation only."},
  {id:"jump",ja:"🦵 ジャンプ",frames:6,desc:"Deep crouch, knees bent low, arms pulled back|Legs pushing off ground, body starting to rise, arms swinging upward|Fully airborne and rising, legs tucked slightly, arms reaching up|Peak of jump, body fully stretched out, arms spread wide|Falling down, body tilting forward, legs extending downward|Landing impact, knees deeply bent absorbing shock, arms out for balance",note:"Vertical position MUST change between frames."},
  {id:"slide",ja:"🏊 スライド",frames:4,desc:"Transitioning from run into slide, body lowering|Full slide pose, body very low, legs extended far forward|Still sliding but decelerating, body starting to rise|Recovery push up, returning to standing",note:"Body height MUST be dramatically lower in Frames 2-3."},
  {id:"dash",ja:"⚡ ダッシュ斬り",frames:6,desc:"Deep crouch, sword pulled back behind body|Launching forward explosively, sword still behind|Mid-dash, body low and nearly horizontal, sword starting to swing forward|Slash moment, sword cutting horizontally at full extension|Past the target, body still carrying momentum, skidding|Braking, feet dragging, returning to upright posture",note:"DO NOT draw speed lines or slash trails. Body animation only."},
  {id:"magic",ja:"✨ 魔法",frames:6,desc:"Standing, free hand beginning to raise|Both arms rising upward, hands open, hair starting to float|Arms raised high, palms facing outward, hair floating upward|Peak of casting, arms extended forward, hair fully floating|Release pose, arms pushing sharply forward|Recovery, arms lowering, hair settling back down",note:"DO NOT draw any magic effects. Body animation ONLY."},
  {id:"hurt",ja:"💥 被ダメ",frames:4,desc:"Impact moment, body jolting sharply backward|Knockback, body leaning far back, hair thrown forward|Nearly falling, one knee dropping toward ground|Catching self, pushing back up with determined expression",note:"DO NOT draw hit flash or impact effects."},
  {id:"death",ja:"💀 死亡",frames:5,desc:"Heavy hit impact, body recoiling sharply|Losing balance, falling backward, sword dropping|Mid-fall, body nearly horizontal, completely limp|Hitting the ground on back|Lying flat on ground, completely still",note:"Character MUST go from standing to completely flat."},
  {id:"guard",ja:"🛡️ 防御",frames:3,desc:"Transitioning to guard, sword rising to defensive position|Full guard stance, sword held vertically, knees bent|Blocking impact, body pushed back slightly",note:"Frame 2 should look like a solid defensive wall."},
  {id:"walljump",ja:"🧗 壁ジャンプ",frames:4,desc:"Sliding down wall, body pressed against left side|Pushing off wall, legs extending|Airborne after wall kick, flipping in air|Peak of wall jump, arms spread",note:"Face LEFT in Frames 1-2, RIGHT in Frames 3-4."},
  {id:"fall",ja:"⬇️ 落下",frames:3,desc:"Just started falling, body upright, legs dangling|Mid-fall, hair blown strongly upward|Fast fall, body stretched downward, hair fully upward",note:"Hair MUST point increasingly upward."},
];
const FIXES=[
  {id:"layout",ja:"📐 配置が不均等",icon:"📐",desc:"フレームがバラバラ",en:"The frames are not evenly spaced. Please redraw with a strict grid layout.\nAll frames must be exactly the same width and height in one horizontal row."},
  {id:"count",ja:"🔢 フレーム数が違う",icon:"🔢",desc:"指定と異なる数",en:"I need exactly [NUMBER] frames. Please redraw with exactly [NUMBER] frames in one horizontal row.",hasInput:true,inputLabel:"正しい数",inputKey:"frameCount"},
  {id:"stiff",ja:"🤖 手足が動いていない",icon:"🤖",desc:"全フレーム同じポーズ",en:"The arms and legs look identical in every frame.\nPlease redraw with DRAMATICALLY different limb positions in each frame.\nExaggerate the movement."},
  {id:"crossing",ja:"🦵 足が交差しない",icon:"🦵",desc:"歩行で足の交差がない",en:"CRITICAL: In crossing frames, both feet must be DIRECTLY UNDER the body, close together, one leg in FRONT overlapping the other BEHIND.\nThis crossing frame is the MOST IMPORTANT frame in the walk cycle."},
  {id:"inconsistent",ja:"🎭 デザインがブレる",icon:"🎭",desc:"見た目が変わる",en:"Keep the EXACT same character in every frame:\n- Same proportions, clothing, colors, hair\nOnly the pose should change."},
  {id:"extras",ja:"🏷️ 余計な装飾",icon:"🏷️",desc:"ラベルや番号が入る",en:"Remove all extra elements.\nNo title, no frame numbers, no labels, no borders.\nJust character frames on white background."},
  {id:"size",ja:"📏 サイズ不統一",icon:"📏",desc:"キャラの大きさが違う",en:"Character size is inconsistent.\nPlease redraw with the same head height and body size in every frame."},
  {id:"direction",ja:"↔️ 向きが変わる",icon:"↔️",desc:"左右反転してしまう",en:"Character should face RIGHT in ALL frames consistently."},
  {id:"robot",ja:"🦿 動きが硬い",icon:"🦿",desc:"ぎこちない",en:"Add secondary motion: hair bounce, clothing swing, body tilt.\nMake it feel alive."},
  {id:"effect",ja:"💫 エフェクトはみ出し",icon:"💫",desc:"魔法等がフレーム外に",en:"Redraw WITHOUT any visual effects.\nNo magic, no slash trails, no particles.\nBody animation ONLY."},
  {id:"ground",ja:"📌 接地面がずれる",icon:"📌",desc:"足元がガタつく",en:"All frames must share the same ground line.\nFeet should touch the same height in every frame."},
];
const PRESETS=[
  {name:"主人公♂",s:{race:0,role:0,hair:1,hairColor:1,outfit:1,weapon:0,acc:[0],build:0}},
  {name:"主人公♀",s:{race:1,role:0,hair:5,hairColor:2,outfit:1,weapon:0,acc:[0],build:2}},
  {name:"魔法使い♀",s:{race:6,role:2,hair:4,hairColor:7,outfit:2,weapon:10,acc:[15],build:2}},
  {name:"忍者♂",s:{race:0,role:6,hair:16,hairColor:0,outfit:4,weapon:2,acc:[11],build:2}},
  {name:"村人♂",s:{race:0,role:10,hair:0,hairColor:1,outfit:6,weapon:18,acc:[0],build:0}},
  {name:"王様",s:{race:3,role:12,hair:18,hairColor:10,outfit:8,weapon:18,acc:[7],build:5}},
  {name:"魔王",s:{race:11,role:19,hair:13,hairColor:4,outfit:12,weapon:14,acc:[1,14],build:4}},
  {name:"猫盗賊♀",s:{race:10,role:5,hair:7,hairColor:8,outfit:16,weapon:2,acc:[3],build:2}},
];

// ---- Responsive hook ----
function useIsPC() {
  const [pc, setPc] = useState(window.innerWidth >= 768);
  useEffect(() => {
    const h = () => setPc(window.innerWidth >= 768);
    window.addEventListener("resize", h);
    return () => window.removeEventListener("resize", h);
  }, []);
  return pc;
}

// ==========================================
//  MAIN APP
// ==========================================
export default function App() {
  const [tool, setTool] = useState("char");
  const isPC = useIsPC();
  return (
    <div style={{ minHeight:"100dvh", background:"#0a0a12", color:"#e0e0e0", fontFamily:"'SF Mono','Menlo','Courier New',monospace", display:"flex", flexDirection:"column", WebkitTapHighlightColor:"transparent" }}>
      {/* Top Nav */}
      <div style={{ display:"flex", justifyContent:"center", background:"linear-gradient(135deg,#0f0f1a,#1a0a2e)", borderBottom:"2px solid #2a1a4e", flexShrink:0 }}>
        <div style={{ display:"flex", width:"100%", maxWidth:"900px" }}>
          <button onClick={()=>setTool("char")} style={{ flex:1, padding:"14px 0", background:"none", border:"none", borderBottom:tool==="char"?"3px solid #ffb86b":"3px solid transparent", color:tool==="char"?"#ffb86b":"#555", fontSize:"13px", fontWeight:"900", cursor:"pointer", fontFamily:"inherit" }}>
            🧙 CHAR FORGE
          </button>
          <button onClick={()=>setTool("sprite")} style={{ flex:1, padding:"14px 0", background:"none", border:"none", borderBottom:tool==="sprite"?"3px solid #c44dff":"3px solid transparent", color:tool==="sprite"?"#c44dff":"#555", fontSize:"13px", fontWeight:"900", cursor:"pointer", fontFamily:"inherit" }}>
            ⚔ SPRITE FORGE
          </button>
        </div>
      </div>
      {tool==="char" ? <CharForge isPC={isPC}/> : <SpriteForge isPC={isPC}/>}
    </div>
  );
}

// ==========================================
//  CHAR FORGE
// ==========================================
function CharForge({isPC}) {
  const [page, setPage] = useState("char");
  const [mode, setMode] = useState("character");
  const [sel, setSel] = useState({race:0,role:0,hair:0,hairColor:0,outfit:0,weapon:0,acc:[0],build:0,monster:0});
  const [selAnims, setSelAnims] = useState([]);
  const [copied, setCopied] = useState(null);
  const [expandedAnim, setExpandedAnim] = useState(null);
  const [expandedFix, setExpandedFix] = useState(null);
  const [fixInputs, setFixInputs] = useState({frameCount:"8"});

  const up=(k,v)=>setSel(p=>({...p,[k]:v}));
  const toggleAcc=(i)=>setSel(p=>{if(i===0) return {...p,acc:[0]}; let a=p.acc.filter(x=>x!==0); a=a.includes(i)?a.filter(x=>x!==i):[...a,i]; return {...p,acc:a.length?a:[0]};});
  const toggleAnim=(id)=>setSelAnims(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);

  const charDesc=useCallback(()=>{if(mode==="monster") return MONSTER[sel.monster].en; const r=RACE[sel.race],ro=ROLE[sel.role],h=HAIR[sel.hair],hc=HAIR_COLOR[sel.hairColor],o=OUTFIT[sel.outfit],w=WEAPON[sel.weapon],b=BUILD[sel.build]; const acc=sel.acc.map(i=>ACCESSORY[i].en).filter(Boolean).join(", "); return `${r.en}, ${b.en}, ${ro.en}, ${h.en}, ${hc.en} hair, wearing ${o.en}, holding ${w.en}${acc?`, with ${acc}`:""}`;},[mode,sel]);
  const charJa=useCallback(()=>{if(mode==="monster") return MONSTER[sel.monster].ja; const p=[RACE[sel.race].ja,ROLE[sel.role].ja,HAIR[sel.hair].ja,HAIR_COLOR[sel.hairColor].ja,OUTFIT[sel.outfit].ja,WEAPON[sel.weapon].ja,BUILD[sel.build].ja]; const acc=sel.acc.map(i=>ACCESSORY[i].ja).filter(a=>a!=="なし"); if(acc.length) p.push(acc.join(",")); return p.join(" / ");},[mode,sel]);
  const buildRef=useCallback(()=>{if(mode==="monster") return `A 2D pixel art character reference sheet.\nMonster: ${MONSTER[sel.monster].en}.\nSide view on plain white background.\n32x32 pixel art style, retro game aesthetic, clean outlines, limited color palette.\nMenacing appearance suitable for a metroidvania action game enemy.`; return `A 2D pixel art character reference sheet.\nCharacter: ${charDesc()}.\nFully clothed, conservative design, no skin exposure.\nFront view and side view on plain white background.\n32x32 pixel art style, retro game aesthetic, clean outlines, limited color palette.`;},[mode,sel,charDesc]);
  const buildAnimPrompt=useCallback((anim)=>{const fl=anim.desc.split("|").map((d,i)=>`Frame ${i+1}: ${d.trim()}`).join("\n"); return `Using this same character, create a ${anim.id} animation sprite sheet.\n${anim.frames} frames in a single horizontal row, equal frame size.\nSide view facing right. Same pixel art style. White background.\nNo extra elements, no title, no labels.\n\n${fl}\n\n${anim.note}`;},[]);
  const buildAllAnims=useCallback(()=>selAnims.map(id=>{const a=ANIMATIONS.find(x=>x.id===id); return `=== ${a.ja}（${a.frames}f） ===\n\n${buildAnimPrompt(a)}`;}).join("\n\n---\n\n"),[selAnims,buildAnimPrompt]);
  const buildFixPrompt=useCallback((fix)=>{let t=fix.en; if(fix.hasInput&&fix.inputKey) t=t.replace(/\[NUMBER\]/g,fixInputs[fix.inputKey]||"8"); return t;},[fixInputs]);
  const doCopy=(text,tag)=>{navigator.clipboard.writeText(text).catch(()=>{const ta=document.createElement("textarea");ta.value=text;document.body.appendChild(ta);ta.select();document.execCommand("copy");document.body.removeChild(ta);}); setCopied(tag); setTimeout(()=>setCopied(null),2000);};

  const MW = isPC ? "520px" : "100%";

  return (
    <div style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden", alignItems:"center"}}>
      {/* Sub Tabs */}
      <div style={{display:"flex", borderBottom:"1px solid #1a1a30", background:"#0d0d18", flexShrink:0, width:"100%", justifyContent:"center"}}>
        <div style={{display:"flex", width:"100%", maxWidth:"900px"}}>
          {[{id:"char",l:"① キャラ"},{id:"anim",l:"② アニメ"},{id:"fix",l:"③ 修正"}].map(t=>(
            <button key={t.id} onClick={()=>setPage(t.id)} style={{flex:1, padding:"9px 0", background:"none", border:"none", borderBottom:page===t.id?"2px solid #ffb86b":"2px solid transparent", color:page===t.id?"#ffb86b":"#666", fontSize:"11px", fontFamily:"inherit", cursor:"pointer", fontWeight:"bold"}}>{t.l}</button>
          ))}
        </div>
      </div>

      <div style={{flex:1, overflow:"auto", width:"100%", display:"flex", justifyContent:"center"}}>
        <div style={{width:"100%", maxWidth:MW}}>
          {/* CHAR */}
          {page==="char" && (
            <div style={{padding:"12px", display:"flex", flexDirection:"column", gap:"12px"}}>
              <div style={{display:"flex", gap:"8px"}}>
                <MBtn active={mode==="character"} onClick={()=>setMode("character")} color="#ffb86b">👤 キャラ</MBtn>
                <MBtn active={mode==="monster"} onClick={()=>setMode("monster")} color="#ff6b6b">🐉 モンスター</MBtn>
              </div>
              {mode==="character"?(
                <>
                  <Sec title="⚡ クイック" color="#ffb86b"><div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{PRESETS.map((p,i)=>(<CChip key={i} active={false} onClick={()=>{setSel(prev=>({...prev,...p.s}));setMode("character");}}>{p.name}</CChip>))}</div></Sec>
                  <Sec title="A. 種族" color="#c44dff"><CChips items={RACE} sel={sel.race} onSel={i=>up("race",i)}/></Sec>
                  <Sec title="B. 役割" color="#6bbaff"><CChips items={ROLE} sel={sel.role} onSel={i=>up("role",i)}/></Sec>
                  <Sec title="C. 髪型" color="#4dff88"><CChips items={HAIR} sel={sel.hair} onSel={i=>up("hair",i)}/></Sec>
                  <Sec title="D. 髪色" color="#ff6b9d"><CChips items={HAIR_COLOR} sel={sel.hairColor} onSel={i=>up("hairColor",i)}/></Sec>
                  <Sec title="E. 服装" color="#ffb86b"><CChips items={OUTFIT} sel={sel.outfit} onSel={i=>up("outfit",i)}/></Sec>
                  <Sec title="F. 武器" color="#c44dff"><CChips items={WEAPON} sel={sel.weapon} onSel={i=>up("weapon",i)}/></Sec>
                  <Sec title="G. 特徴（複数OK）" color="#6bbaff"><CChips items={ACCESSORY} sel={sel.acc} onSel={toggleAcc} multi/></Sec>
                  <Sec title="H. 体格" color="#4dff88"><CChips items={BUILD} sel={sel.build} onSel={i=>up("build",i)}/></Sec>
                </>
              ):(
                <Sec title="M. モンスター" color="#ff6b6b"><CChips items={MONSTER} sel={sel.monster} onSel={i=>up("monster",i)}/></Sec>
              )}
              <SumBox label="現在のキャラクター" text={charJa()}/>
            </div>
          )}
          {/* ANIM */}
          {page==="anim" && (
            <div style={{padding:"12px", display:"flex", flexDirection:"column", gap:"10px"}}>
              <SumBox label="対象キャラクター" text={charJa()} small/>
              <div style={{display:"flex", gap:"6px"}}><ABtn color="#4dff88" onClick={()=>setSelAnims(ANIMATIONS.map(a=>a.id))}>全選択</ABtn><ABtn color="#ff6b6b" onClick={()=>setSelAnims([])}>全解除</ABtn></div>
              {ANIMATIONS.map(anim=>{const on=selAnims.includes(anim.id), exp=expandedAnim===anim.id; return (
                <div key={anim.id}>
                  <div style={{display:"flex", alignItems:"center", gap:"8px", background:on?"#c44dff15":"#111", border:on?"2px solid #c44dff":"2px solid #1a1a30", borderRadius:exp?"8px 8px 0 0":"8px", padding:"10px 12px", cursor:"pointer"}} onClick={()=>toggleAnim(anim.id)}>
                    <CBox on={on}/>
                    <div style={{flex:1}}><div style={{fontSize:"12px", color:on?"#e0e0e0":"#888"}}>{anim.ja}</div><div style={{fontSize:"10px", color:"#555"}}>{anim.frames}f</div></div>
                    <button onClick={e=>{e.stopPropagation();setExpandedAnim(exp?null:anim.id);}} style={{background:"none", border:"1px solid #333", borderRadius:"4px", color:"#888", fontSize:"10px", padding:"2px 6px", cursor:"pointer", fontFamily:"inherit"}}>{exp?"閉":"詳細"}</button>
                    {on&&<button onClick={e=>{e.stopPropagation();doCopy(buildAnimPrompt(anim),anim.id);}} style={{background:copied===anim.id?"#4dff8833":"#c44dff22", border:`1px solid ${copied===anim.id?"#4dff88":"#c44dff"}`, borderRadius:"6px", color:copied===anim.id?"#4dff88":"#c44dff", fontSize:"10px", padding:"4px 8px", cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap"}}>{copied===anim.id?"✓":"コピー"}</button>}
                  </div>
                  {exp&&<div style={{background:"#0a0a14", border:"1px solid #1a1a30", borderTop:"none", borderRadius:"0 0 8px 8px", padding:"10px", fontSize:"10px", color:"#999", lineHeight:1.8, whiteSpace:"pre-wrap"}}>{buildAnimPrompt(anim)}</div>}
                </div>
              );})}
            </div>
          )}
          {/* FIX */}
          {page==="fix" && (
            <div style={{padding:"12px", display:"flex", flexDirection:"column", gap:"8px"}}>
              <div style={{fontSize:"11px", color:"#888", padding:"8px", background:"#0f0f1a", borderRadius:"8px", border:"1px solid #1a1a30"}}>症状を選んでコピー → 問題画像と一緒にChatGPTに送信</div>
              {FIXES.map(fix=>{const exp=expandedFix===fix.id; return (
                <div key={fix.id}>
                  <div style={{display:"flex", alignItems:"center", gap:"10px", background:"#111", border:exp?"2px solid #ff6b6b":"2px solid #1a1a30", borderRadius:exp?"10px 10px 0 0":"10px", padding:"12px", cursor:"pointer"}} onClick={()=>setExpandedFix(exp?null:fix.id)}>
                    <span style={{fontSize:"16px"}}>{fix.icon}</span>
                    <div style={{flex:1}}><div style={{fontSize:"12px", color:"#e0e0e0", fontWeight:"bold"}}>{fix.ja}</div><div style={{fontSize:"10px", color:"#666"}}>{fix.desc}</div></div>
                    <span style={{color:"#555"}}>{exp?"▼":"▶"}</span>
                  </div>
                  {exp&&(
                    <div style={{background:"#0a0a14", border:"2px solid #ff6b6b", borderTop:"none", borderRadius:"0 0 10px 10px", padding:"12px", display:"flex", flexDirection:"column", gap:"8px"}}>
                      {fix.hasInput&&<div style={{display:"flex", alignItems:"center", gap:"8px"}}><span style={{fontSize:"11px", color:"#888"}}>{fix.inputLabel}:</span><input type="number" value={fixInputs[fix.inputKey]||""} onChange={e=>setFixInputs(p=>({...p,[fix.inputKey]:e.target.value}))} style={{width:"60px", padding:"6px", borderRadius:"6px", border:"1px solid #2a1a4e", background:"#111", color:"#e0e0e0", fontSize:"14px", fontFamily:"inherit", textAlign:"center"}}/></div>}
                      <div style={{fontSize:"10px", color:"#999", lineHeight:1.8, whiteSpace:"pre-wrap", background:"#08080f", borderRadius:"6px", padding:"10px"}}>{buildFixPrompt(fix)}</div>
                      <button onClick={()=>doCopy(buildFixPrompt(fix),"fix_"+fix.id)} style={{width:"100%", padding:"10px", borderRadius:"8px", background:copied===("fix_"+fix.id)?"#4dff8833":"#ff6b6b22", border:`1px solid ${copied===("fix_"+fix.id)?"#4dff88":"#ff6b6b"}`, color:copied===("fix_"+fix.id)?"#4dff88":"#ff6b6b", fontSize:"12px", fontWeight:"bold", cursor:"pointer", fontFamily:"inherit"}}>{copied===("fix_"+fix.id)?"✓ コピーしました！":"📋 コピー"}</button>
                    </div>
                  )}
                </div>
              );})}
            </div>
          )}
        </div>
      </div>

      {/* Bottom */}
      <div style={{padding:"10px 16px", borderTop:"2px solid #2a1a4e", background:"#0d0d18", flexShrink:0, width:"100%", display:"flex", justifyContent:"center", paddingBottom:"max(10px,env(safe-area-inset-bottom))"}}>
        <div style={{width:"100%", maxWidth:MW}}>
          {page==="char"&&<CopyBtn onClick={()=>doCopy(buildRef(),"ref")} copied={copied==="ref"} label="📋 リファレンスをコピー" done="✓ コピーしました！" color="#ffb86b"/>}
          {page==="anim"&&<CopyBtn onClick={()=>selAnims.length&&doCopy(buildAllAnims(),"all")} copied={copied==="all"} label={`📋 ${selAnims.length}件をまとめてコピー`} done="✓ コピーしました！" color="#c44dff" disabled={!selAnims.length}/>}
          {page==="fix"&&<div style={{textAlign:"center", fontSize:"10px", color:"#555"}}>↑ 症状を選んで個別にコピー</div>}
        </div>
      </div>
    </div>
  );
}

// ==========================================
//  SPRITE FORGE
// ==========================================
function SpriteForge({isPC}) {
  const [image, setImage] = useState(null);
  const [frames, setFrames] = useState([]);
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [fps, setFps] = useState(8);
  const [zoom, setZoom] = useState(3);
  const [bgColor, setBgColor] = useState("#1a1a2e");
  const [selectedFrames, setSelectedFrames] = useState([]);
  const [flipH, setFlipH] = useState(false);
  const [tab, setTab] = useState("preview");
  const [splitMode, setSplitMode] = useState("auto");
  const [detecting, setDetecting] = useState(false);
  const [detectedRegions, setDetectedRegions] = useState([]);
  const [threshold, setThreshold] = useState(240);
  const [minSize, setMinSize] = useState(20);
  const [anchor, setAnchor] = useState("bottom");
  const [cols, setCols] = useState(4);
  const [rows, setRows] = useState(1);
  const animRef = useRef(null);
  const fileRef = useRef(null);
  const lastTimeRef = useRef(0);

  // Auto-detect
  const autoDetect = useCallback((img, thresh, minSz) => {
    const c = document.createElement("canvas"); c.width=img.width; c.height=img.height;
    const ctx=c.getContext("2d"); ctx.drawImage(img,0,0);
    const id=ctx.getImageData(0,0,img.width,img.height); const d=id.data;
    const w=img.width, h=img.height, mask=new Uint8Array(w*h);
    for(let i=0;i<w*h;i++){const r=d[i*4],g=d[i*4+1],b=d[i*4+2],a=d[i*4+3]; if(a>20&&(r<thresh||g<thresh||b<thresh)) mask[i]=1;}
    const vis=new Uint8Array(w*h), regions=[];
    const ff=(sx,sy)=>{const st=[[sx,sy]]; let mnX=sx,mxX=sx,mnY=sy,mxY=sy,pc=0; while(st.length){const[x,y]=st.pop(); const idx=y*w+x; if(x<0||x>=w||y<0||y>=h||vis[idx]||!mask[idx]) continue; vis[idx]=1; pc++; mnX=Math.min(mnX,x); mxX=Math.max(mxX,x); mnY=Math.min(mnY,y); mxY=Math.max(mxY,y); st.push([x+1,y],[x-1,y],[x,y+1],[x,y-1]);} return {minX:mnX,minY:mnY,maxX:mxX,maxY:mxY,pc};};
    for(let y=0;y<h;y+=2) for(let x=0;x<w;x+=2){const idx=y*w+x; if(mask[idx]&&!vis[idx]){const r=ff(x,y); if(r.maxX-r.minX>=minSz&&r.maxY-r.minY>=minSz&&r.pc>minSz*minSz*0.1) regions.push(r);}}
    const merged=[],used=new Set(),GAP=5; regions.sort((a,b)=>a.minX-b.minX);
    for(let i=0;i<regions.length;i++){if(used.has(i))continue; let{minX,minY,maxX,maxY}=regions[i]; used.add(i); let ch=true; while(ch){ch=false; for(let j=0;j<regions.length;j++){if(used.has(j))continue; const r=regions[j]; if(r.minX<=maxX+GAP&&r.maxX>=minX-GAP&&r.minY<=maxY+GAP&&r.maxY>=minY-GAP){minX=Math.min(minX,r.minX);minY=Math.min(minY,r.minY);maxX=Math.max(maxX,r.maxX);maxY=Math.max(maxY,r.maxY);used.add(j);ch=true;}}} merged.push({minX,minY,maxX,maxY,w:maxX-minX+1,h:maxY-minY+1});}
    merged.sort((a,b)=>a.minX-b.minX); return merged;
  },[]);

  const computeCX = useCallback((img,region)=>{const c=document.createElement("canvas");c.width=region.w;c.height=region.h;const ctx=c.getContext("2d");ctx.drawImage(img,region.minX,region.minY,region.w,region.h,0,0,region.w,region.h);const id=ctx.getImageData(0,0,region.w,region.h);const d=id.data;let sx=0,cnt=0;for(let y=0;y<region.h;y++)for(let x=0;x<region.w;x++){const i=(y*region.w+x)*4;if(d[i+3]>20&&(d[i]<240||d[i+1]<240||d[i+2]<240)){sx+=x;cnt++;}}return cnt>0?sx/cnt:region.w/2;},[]);

  const genFrames = useCallback((img,regions,anc)=>{if(!regions.length)return[];const maxH=Math.max(...regions.map(r=>r.h));const cxs=regions.map(r=>computeCX(img,r));const maxCX=Math.max(...cxs),maxR=Math.max(...regions.map((r,i)=>r.w-cxs[i]));const pad=4,fW=Math.ceil(maxCX+maxR)+pad*2,fH=maxH+pad*2;return regions.map((region,idx)=>{const cv=document.createElement("canvas");cv.width=fW;cv.height=fH;const ctx=cv.getContext("2d");const oX=pad+Math.floor(maxCX-cxs[idx]);let oY;if(anc==="bottom")oY=fH-pad-region.h;else if(anc==="top")oY=pad;else oY=pad+Math.floor((maxH-region.h)/2);ctx.drawImage(img,region.minX,region.minY,region.w,region.h,oX,oY,region.w,region.h);return{dataUrl:cv.toDataURL(),w:fW,h:fH,index:idx};});},[computeCX]);

  const handleUpload = useCallback((e)=>{const file=e.target.files?.[0]; if(!file) return; const reader=new FileReader(); reader.onload=(ev)=>{const img=new Image(); img.onload=()=>{setImage(img); setFrames([]); setSelectedFrames([]); setCurrentFrame(0); setIsPlaying(false); setTab("preview"); setDetecting(true); setTimeout(()=>{const r=autoDetect(img,240,20); setDetectedRegions(r); if(r.length){setSplitMode("auto"); const f=genFrames(img,r,"bottom"); setFrames(f); setSelectedFrames(f.map((_,i)=>i));} setDetecting(false);},50);}; img.src=ev.target.result;}; reader.readAsDataURL(file);},[autoDetect,genFrames]);

  const gridSplit = useCallback(()=>{if(!image) return; const fw=Math.floor(image.width/cols),fh=Math.floor(image.height/rows),nf=[]; for(let r=0;r<rows;r++) for(let c=0;c<cols;c++){const cv=document.createElement("canvas");cv.width=fw;cv.height=fh;cv.getContext("2d").drawImage(image,c*fw,r*fh,fw,fh,0,0,fw,fh);nf.push({dataUrl:cv.toDataURL(),w:fw,h:fh,index:r*cols+c});} setFrames(nf); setSelectedFrames(nf.map((_,i)=>i)); setCurrentFrame(0);},[image,cols,rows]);

  const rerun = useCallback(()=>{if(!image)return; setDetecting(true); setTimeout(()=>{const r=autoDetect(image,threshold,minSize); setDetectedRegions(r); const f=genFrames(image,r,anchor); setFrames(f); setSelectedFrames(f.map((_,i)=>i)); setCurrentFrame(0); setDetecting(false);},50);},[image,threshold,minSize,anchor,autoDetect,genFrames]);

  useEffect(()=>{if(!image||splitMode!=="auto"||!detectedRegions.length)return; const f=genFrames(image,detectedRegions,anchor); setFrames(f); setSelectedFrames(f.map((_,i)=>i));},[anchor]);
  useEffect(()=>{if(!image||splitMode!=="grid")return; gridSplit();},[image,cols,rows,splitMode]);
  useEffect(()=>{if(!isPlaying||!selectedFrames.length){if(animRef.current)cancelAnimationFrame(animRef.current);return;} const iv=1000/fps;let fi=0;const anim=(ts)=>{if(ts-lastTimeRef.current>=iv){lastTimeRef.current=ts;setCurrentFrame(selectedFrames[fi]);fi=(fi+1)%selectedFrames.length;}animRef.current=requestAnimationFrame(anim);};animRef.current=requestAnimationFrame(anim);return()=>{if(animRef.current)cancelAnimationFrame(animRef.current);};},[isPlaying,fps,selectedFrames]);

  const toggleFrame=(i)=>setSelectedFrames(p=>p.includes(i)?p.filter(x=>x!==i):[...p,i].sort((a,b)=>a-b));

  // Export
  const makeTransparent=(cv)=>{const ctx=cv.getContext("2d");const id=ctx.getImageData(0,0,cv.width,cv.height);const d=id.data;for(let i=0;i<d.length;i+=4){if(d[i]>=240&&d[i+1]>=240&&d[i+2]>=240)d[i+3]=0;}ctx.putImageData(id,0,0);};
  const exportSheet=useCallback(async()=>{if(!frames.length||!selectedFrames.length)return;const fw=frames[0].w,fh=frames[0].h;const ec=Math.min(selectedFrames.length,8),er=Math.ceil(selectedFrames.length/ec);const cv=document.createElement("canvas");cv.width=ec*fw;cv.height=er*fh;const ctx=cv.getContext("2d");for(let i=0;i<selectedFrames.length;i++){const img=await new Promise(res=>{const im=new Image();im.onload=()=>res(im);im.src=frames[selectedFrames[i]].dataUrl;});ctx.drawImage(img,(i%ec)*fw,Math.floor(i/ec)*fh);}makeTransparent(cv);const link=document.createElement("a");link.download="spritesheet.png";link.href=cv.toDataURL("image/png");link.click();},[frames,selectedFrames]);
  const exportIndividual=useCallback(async()=>{if(!frames.length||!selectedFrames.length)return;for(let i=0;i<selectedFrames.length;i++){const img=await new Promise(res=>{const im=new Image();im.onload=()=>res(im);im.src=frames[selectedFrames[i]].dataUrl;});const cv=document.createElement("canvas");cv.width=img.width;cv.height=img.height;cv.getContext("2d").drawImage(img,0,0);makeTransparent(cv);const link=document.createElement("a");link.download=`frame_${String(i).padStart(3,"0")}.png`;link.href=cv.toDataURL("image/png");link.click();await new Promise(r=>setTimeout(r,150));}},[frames,selectedFrames]);

  const af = frames[currentFrame];

  // No image
  if(!image){
    return (
      <div style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"24px", gap:"16px"}}>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{display:"none"}}/>
        <div onClick={()=>fileRef.current?.click()} style={{width:"min(320px,80vw)", padding:"40px 20px", border:"2px dashed #2a1a4e", borderRadius:"16px", display:"flex", flexDirection:"column", alignItems:"center", gap:"12px", cursor:"pointer"}}>
          <div style={{fontSize:"48px"}}>🖼</div>
          <div style={{fontSize:"14px", color:"#aaa"}}>スプライトシートをアップロード</div>
          <div style={{fontSize:"11px", color:"#555"}}>タップで選択 / ドラッグ＆ドロップ</div>
        </div>
      </div>
    );
  }

  // Preview area component
  const PreviewArea = () => (
    <div style={{display:"flex", flexDirection:"column", flex:1, minHeight:0}}>
      <div style={{flex:1, display:"flex", alignItems:"flex-end", justifyContent:"center", padding:"12px", minHeight:"200px"}}>
        {detecting?<div style={{color:"#c44dff"}}>🔍 検出中...</div>:af?(
          <div style={{background:bgColor, borderRadius:"12px", border:"1px solid #1a1a30", padding:"8px", display:"flex", alignItems:"flex-end", justifyContent:"center", width:isPC?"100%":"min(280px,78vw)", maxWidth:"400px", aspectRatio:"1", position:"relative"}}>
            {anchor==="bottom"&&<div style={{position:"absolute", bottom:"8px", left:"8px", right:"8px", borderBottom:"1px dashed #ffffff22"}}/>}
            <img src={af.dataUrl} style={{width:af.w*zoom, height:af.h*zoom, imageRendering:"pixelated", transform:flipH?"scaleX(-1)":"none", maxWidth:"95%", maxHeight:"95%", objectFit:"contain"}} alt=""/>
          </div>
        ):<div style={{color:"#555"}}>フレームなし</div>}
      </div>
      {/* Controls */}
      <div style={{padding:"10px 12px", background:"#0d0d18", borderTop:"1px solid #1a1a30", display:"flex", flexDirection:"column", gap:"6px", flexShrink:0}}>
        <div style={{display:"flex", gap:"8px"}}>
          <Btn onClick={()=>setIsPlaying(!isPlaying)} color={isPlaying?"#ff6b6b":"#4dff88"} full>{isPlaying?"⏹ 停止":"▶ 再生"}</Btn>
          <Btn onClick={()=>setFlipH(!flipH)} color={flipH?"#ffb86b":"#555"}>↔</Btn>
        </div>
        <Slider label="FPS" value={fps} onChange={setFps} min={1} max={30} display={fps}/>
        <Slider label="拡大" value={zoom} onChange={setZoom} min={1} max={10} display={`×${zoom}`}/>
      </div>
      {/* Frame strip */}
      <div style={{borderTop:"1px solid #1a1a30", padding:"8px 12px", overflowX:"auto", display:"flex", gap:"6px", flexShrink:0, alignItems:"flex-end"}}>
        {frames.map((f,i)=>(
          <div key={i} onClick={()=>{toggleFrame(i);if(!isPlaying)setCurrentFrame(i);}} style={{flexShrink:0, padding:"3px", borderRadius:"4px", cursor:"pointer", border:currentFrame===i?"2px solid #c44dff":selectedFrames.includes(i)?"2px solid #4dff8866":"2px solid #222", opacity:selectedFrames.includes(i)?1:0.25, background:bgColor}}>
            <img src={f.dataUrl} style={{width:Math.min(f.w*1.5,44), height:Math.min(f.h*1.5,44), imageRendering:"pixelated", display:"block"}} alt=""/>
          </div>
        ))}
      </div>
    </div>
  );

  // Side panel component
  const SidePanel = () => (
    <div style={{display:"flex", flexDirection:"column", gap:"14px", padding:"14px", overflow:"auto", ...(isPC?{width:"300px", borderLeft:"1px solid #1a1a30", flexShrink:0}:{})}}>
      <Sec title="📌 アンカー" color="#4dff88">
        <div style={{display:"flex", gap:"6px"}}>
          {[{id:"bottom",l:"⬇ 足元"},{id:"center",l:"◎ 中央"},{id:"top",l:"⬆ 頭"}].map(a=>(
            <button key={a.id} onClick={()=>setAnchor(a.id)} style={{flex:1, padding:"8px 4px", borderRadius:"8px", cursor:"pointer", background:anchor===a.id?"#4dff8818":"#111", border:anchor===a.id?"2px solid #4dff88":"2px solid #222", color:anchor===a.id?"#4dff88":"#888", fontSize:"11px", fontWeight:"bold", fontFamily:"inherit"}}>{a.l}</button>
          ))}
        </div>
      </Sec>
      <Sec title="🔍 分割" color="#c44dff">
        <div style={{display:"flex", gap:"8px"}}>
          <Btn onClick={()=>{setSplitMode("auto");rerun();}} color={splitMode==="auto"?"#4dff88":"#666"} full>✨ 自動</Btn>
          <Btn onClick={()=>setSplitMode("grid")} color={splitMode==="grid"?"#6bbaff":"#666"} full>🔲 グリッド</Btn>
        </div>
        {splitMode==="auto"&&<div style={{display:"flex", flexDirection:"column", gap:"6px", marginTop:"6px"}}><Slider label="感度" value={threshold} onChange={setThreshold} min={180} max={254} display={threshold}/><Slider label="最小" value={minSize} onChange={setMinSize} min={5} max={100} display={`${minSize}px`}/><Btn onClick={rerun} color="#4dff88" full>🔄 再検出（{detectedRegions.length}体）</Btn></div>}
        {splitMode==="grid"&&<div style={{marginTop:"6px"}}><div style={{display:"flex",gap:"12px"}}><div style={{flex:1}}><div style={{fontSize:"10px",color:"#888",marginBottom:"2px"}}>列</div><Stepper value={cols} onChange={setCols} min={1} max={32}/></div><div style={{flex:1}}><div style={{fontSize:"10px",color:"#888",marginBottom:"2px"}}>行</div><Stepper value={rows} onChange={setRows} min={1} max={32}/></div></div></div>}
      </Sec>
      <Sec title="🎨 背景色" color="#ff6b9d">
        <div style={{display:"flex", gap:"6px", flexWrap:"wrap"}}>
          {["#1a1a2e","#000000","#ffffff","#282c34","#1e3a1e","#ff00ff"].map(c=>(
            <div key={c} onClick={()=>setBgColor(c)} style={{width:"32px", height:"32px", background:c, borderRadius:"6px", border:bgColor===c?"3px solid #c44dff":"3px solid #333", cursor:"pointer"}}/>
          ))}
        </div>
      </Sec>
      <Sec title="💾 保存" color="#6bbaff">
        <div style={{fontSize:"11px", color:"#888", marginBottom:"6px"}}>選択: {selectedFrames.length}/{frames.length}f</div>
        <div style={{display:"flex", flexDirection:"column", gap:"8px"}}>
          <Btn onClick={exportSheet} color="#6bbaff" full disabled={!selectedFrames.length}>📄 スプライトシート（透過PNG）</Btn>
          <Btn onClick={exportIndividual} color="#ffb86b" full disabled={!selectedFrames.length}>🖼 個別フレーム（透過PNG）</Btn>
        </div>
        {af&&<div style={{fontSize:"10px", color:"#666", marginTop:"6px", lineHeight:1.6}}>
          サイズ: {af.w}×{af.h}px | ピボット: {anchor==="bottom"?"(0.5, 1.0)":"(0.5, 0.5)"}
        </div>}
      </Sec>
    </div>
  );

  // Mobile: tabs, PC: split layout
  if(isPC) {
    return (
      <div style={{flex:1, display:"flex", overflow:"hidden"}}>
        <div style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden"}}>
          {/* Info bar */}
          <div style={{padding:"6px 12px", background:"#0d0d18", borderBottom:"1px solid #1a1a30", display:"flex", alignItems:"center", gap:"8px", flexShrink:0, fontSize:"10px", color:"#555"}}>
            <span>{image.width}×{image.height} | {frames.length}f | {anchor==="bottom"?"足元固定":anchor==="top"?"頭固定":"中央"}</span>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{display:"none"}}/>
            <button onClick={()=>fileRef.current?.click()} style={{marginLeft:"auto", background:"none", border:"1px solid #2a1a4e", color:"#c44dff", borderRadius:"4px", padding:"2px 8px", fontSize:"10px", cursor:"pointer", fontFamily:"inherit"}}>画像変更</button>
          </div>
          <PreviewArea/>
        </div>
        <SidePanel/>
      </div>
    );
  }

  // Mobile: tabbed
  return (
    <div style={{flex:1, display:"flex", flexDirection:"column", overflow:"hidden"}}>
      <div style={{padding:"6px 12px", background:"#0d0d18", borderBottom:"1px solid #1a1a30", display:"flex", alignItems:"center", gap:"8px", flexShrink:0, fontSize:"10px", color:"#555"}}>
        <span>{image.width}×{image.height} | {frames.length}f</span>
        <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} style={{display:"none"}}/>
        <button onClick={()=>fileRef.current?.click()} style={{marginLeft:"auto", background:"none", border:"1px solid #2a1a4e", color:"#c44dff", borderRadius:"4px", padding:"2px 8px", fontSize:"10px", cursor:"pointer", fontFamily:"inherit"}}>変更</button>
      </div>
      <div style={{display:"flex", borderBottom:"1px solid #1a1a30", background:"#0d0d18", flexShrink:0}}>
        {[{id:"preview",l:"▶ プレビュー"},{id:"settings",l:"⚙ 設定/保存"}].map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1, padding:"9px 0", background:"none", border:"none", borderBottom:tab===t.id?"2px solid #c44dff":"2px solid transparent", color:tab===t.id?"#c44dff":"#666", fontSize:"11px", fontFamily:"inherit", cursor:"pointer"}}>{t.l}</button>
        ))}
      </div>
      {tab==="preview"&&<PreviewArea/>}
      {tab==="settings"&&<div style={{flex:1, overflow:"auto"}}><SidePanel/></div>}
    </div>
  );
}

// ==========================================
//  SHARED COMPONENTS
// ==========================================
function MBtn({active,onClick,color,children}){return(<button onClick={onClick} style={{flex:1,padding:"10px",borderRadius:"8px",background:active?`${color}18`:"#111",border:active?`2px solid ${color}`:"2px solid #1a1a30",color:active?color:"#666",fontSize:"12px",fontFamily:"inherit",cursor:"pointer",fontWeight:"bold"}}>{children}</button>);}
function Sec({title,color,children}){return(<div><div style={{fontSize:"12px",fontWeight:"bold",color,marginBottom:"6px"}}>{title}</div>{children}</div>);}
function CChips({items,sel,onSel,multi=false}){const isSel=(i)=>multi?(Array.isArray(sel)&&sel.includes(i)):sel===i;return(<div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>{items.map((item,i)=>(<CChip key={item.id} active={isSel(i)} onClick={()=>onSel(i)}><span style={{fontSize:"8px",color:"#555",marginRight:"3px"}}>{item.id}</span>{item.ja}</CChip>))}</div>);}
function CChip({active,onClick,children}){return(<button onClick={onClick} style={{padding:"6px 9px",borderRadius:"7px",fontSize:"11px",background:active?"#c44dff20":"#111",border:active?"2px solid #c44dff":"2px solid #1a1a30",color:active?"#e0e0e0":"#777",cursor:"pointer",fontFamily:"inherit",transition:"all 0.12s",WebkitTapHighlightColor:"transparent"}}>{children}</button>);}
function ABtn({color,onClick,children}){return(<button onClick={onClick} style={{padding:"8px 14px",borderRadius:"8px",fontSize:"11px",fontWeight:"bold",background:`${color}15`,border:`1px solid ${color}`,color,cursor:"pointer",fontFamily:"inherit"}}>{children}</button>);}
function CBox({on}){return(<div style={{width:"20px",height:"20px",borderRadius:"4px",border:on?"2px solid #c44dff":"2px solid #444",background:on?"#c44dff":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"12px",color:"#fff",flexShrink:0}}>{on&&"✓"}</div>);}
function SumBox({label,text,small}){return(<div style={{background:"#0f0f1a",border:"1px solid #1a1a30",borderRadius:"10px",padding:small?"10px":"12px"}}><div style={{fontSize:"10px",color:"#666",marginBottom:"2px"}}>{label}</div><div style={{fontSize:small?"11px":"12px",color:"#ffb86b",lineHeight:1.6}}>{text}</div></div>);}
function Btn({onClick,color="#c44dff",full=false,disabled=false,children}){return(<button onClick={onClick} disabled={disabled} style={{background:disabled?"#181818":`${color}18`,border:`1px solid ${disabled?"#2a2a2a":color}`,color:disabled?"#444":color,padding:"12px 14px",borderRadius:"10px",cursor:disabled?"not-allowed":"pointer",fontSize:"13px",fontWeight:"bold",fontFamily:"inherit",width:full?"100%":"auto",transition:"all 0.15s",WebkitTapHighlightColor:"transparent"}}>{children}</button>);}
function CopyBtn({onClick,copied,label,done,color,disabled}){return(<button onClick={onClick} disabled={disabled} style={{width:"100%",padding:"14px",background:disabled?"#222":copied?"linear-gradient(135deg,#4dff88,#33cc66)":`linear-gradient(135deg,${color},${color}cc)`,border:"none",borderRadius:"12px",color:disabled?"#555":"#fff",fontSize:"14px",fontWeight:"900",cursor:disabled?"not-allowed":"pointer",fontFamily:"inherit",transition:"all 0.3s"}}>{copied?done:label}</button>);}
function Slider({label,value,onChange,min,max,display}){return(<div style={{display:"flex",alignItems:"center",gap:"10px"}}><span style={{fontSize:"11px",color:"#888",minWidth:"32px"}}>{label}</span><input type="range" min={min} max={max} value={value} onChange={e=>onChange(Number(e.target.value))} style={{flex:1,accentColor:"#c44dff"}}/><span style={{fontSize:"12px",color:"#ccc",minWidth:"36px",textAlign:"right",fontWeight:"bold"}}>{display}</span></div>);}
function Stepper({value,onChange,min,max}){const s={width:"36px",height:"36px",background:"#1a1a30",border:"1px solid #2a1a4e",color:"#c44dff",borderRadius:"8px",cursor:"pointer",fontSize:"18px",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"inherit"};return(<div style={{display:"flex",alignItems:"center",gap:"8px"}}><button onClick={()=>onChange(Math.max(min,value-1))} style={s}>−</button><span style={{minWidth:"24px",textAlign:"center",fontSize:"16px",fontWeight:"bold"}}>{value}</span><button onClick={()=>onChange(Math.min(max,value+1))} style={s}>+</button></div>);}