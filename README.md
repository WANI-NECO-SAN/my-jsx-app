# DOTCRAFT｜AIドット絵プロンプト生成＆スプライト整形ツール  
**AI Sprite Prompt Generator & Sprite Sheet Tool**

![demo](assets/dotcraft_demo.gif)

👉 **ブラウザで試す**  
https://wani-neco-san.github.io/my-jsx-app/

DOTCRAFTは、  
**AIでドット絵を作るためのプロンプト生成** と  
**スプライト画像をゲーム用に整形するツール**です。  

DOTCRAFT is a browser-based tool for  
generating **AI sprite prompts** and preparing **game-ready sprite sheets**.

インストール不要・ブラウザのみで動作します。  
No installation required. Works fully in browser.

---

# 📚 目次 / Table of Contents

- [特徴 / Features](#-特徴--features)
- [使い方 / Usage](#-使い方--usage)
- [利用シーン / Use Cases](#-利用シーン--use-cases)
- [公開方針 / Repository Policy](#-公開方針--repository-policy)
- [技術構成 / Tech Stack](#-技術構成--tech-stack)
- [作者 / Author](#-作者--author)

---

# ✨ 特徴 / Features

## 🎨 CharForge（キャラ生成プロンプト）
- 種族・職業・装備をクリック選択  
- AI画像生成用プロンプトを自動生成  
- アニメーション仕様も文章化  

👉 **AIに貼る文章を自動作成**

Character / monster prompt generator with click-based UI.  
Automatically generates ready-to-use prompts including animation specs.

---

## 🎞 SpriteForge（スプライト整形）
- スプライト自動分割  
- 行列検出  
- フレームサイズ統一  
- アニメーションプレビュー  
- PNG書き出し  

👉 **ゲーム素材に即変換**

Split sprite sheets, align frames, preview animation, and export PNG.

---

## 🩹 修正プロンプト生成 / Fix Prompt Generator

AI生成でよくある問題：

- フレーム数が違う  
- サイズがバラバラ  
- 背景透過されない  
- 色が変わる  

👉 **症状を選ぶだけで修正プロンプト生成**

Generate correction prompts for common AI sprite errors.

---

# 🚀 使い方 / Usage

## ① キャラを作る / Create Character Prompt
1. デモを開く / Open the demo  
2. キャラ設定を選択 / Select options  
3. 「リファレンスコピー」 / Click Copy  
4. AIへ貼る / Paste into image AI  

---

## ② アニメーションを作る / Generate Animation Prompt
1. 「アニメ」タブを開く / Open Animation tab  
2. 動作を選択 / Choose motion  
3. コピーしてAIへ / Copy & paste into AI  

---

## ③ 生成ミスを修正 / Fix Generation Errors
1. 「修正」を開く / Open Fix  
2. 症状を選択 / Select issue  
3. コピーしてAIへ / Copy & send to AI  

---

## ④ スプライトを整形 / Prepare Sprite Sheet
1. 画像アップロード / Upload image  
2. 自動検出 or 手動分割 / Auto-detect or split manually  
3. プレビュー確認 / Preview animation  
4. 保存 / Export PNG  

---

# 🎮 利用シーン / Use Cases

- RPGゲーム制作 / RPG development  
- AIドット絵素材生成 / AI sprite generation  
- インディーゲーム開発 / Indie game dev  
- 同キャラの複数アニメ生成 / Multi-animation creation  
- JRPG風素材量産 / JRPG-style asset production  

---

# 📦 公開方針 / Repository Policy

このリポジトリは **配布用distのみ公開** しています。  
開発ソースは非公開リポジトリで管理しています。  

This repository contains **distribution files only (dist build)**.  
Development source code is managed in a private repository.

---

# 🛠 技術構成 / Tech Stack
- React / JSX  
- Browser only  
- GitHub Pages hosting  

---

# 👤 作者 / Author
WANI-NECO-SAN
