# Script Master

英語学習支援Webアプリケーション - 好きな英文から単語を抽出し、ゲーム感覚で学習できます。

## 概要

Script Masterは、ユーザーが提供した英文（記事、スクリプト、SNS投稿など）から重要な単語を自動的に抽出し、
クイズやカルタ形式のゲームで楽しく学習できる、Svelteベースのシングルページアプリケーションです。

### 主な機能

- 📝 **単語抽出**: 英文から名詞・動詞・形容詞を自動抽出
- 📚 **マイ単語帳**: 抽出した単語をローカルストレージに保存・管理
- 🎮 **ゲーム学習**: 
  - 4択クイズ形式
  - 単語カルタ形式
- 🌐 **自動翻訳**: 抽出した単語を日本語に翻訳
- 💾 **オフライン対応**: ローカルストレージによるデータ永続化

## 技術スタック

- **フレームワーク**: [SvelteKit](https://kit.svelte.dev/) v2
- **言語**: TypeScript
- **スタイリング**: TailwindCSS
- **NLP**: [compromise.js](https://github.com/spencermountain/compromise)
- **翻訳API**: MyMemory Translation API
- **辞書API**: Free Dictionary API

## セットアップ

### 前提条件

- Node.js 18.x 以上
- npm または pnpm

### インストール手順

1. リポジトリをクローン

```bash
git clone https://github.com/hirachika/script-master.git
cd script-master
```

2. frontendディレクトリに移動して依存関係をインストール

```bash
cd frontend
npm install
```

3. 環境変数の設定（オプション）

デフォルトの設定で動作しますが、カスタマイズしたい場合は`.env`ファイルを作成します。

```bash
cp .env.example .env
# .envファイルを編集してAPI設定をカスタマイズ
```

`.env.example`に記載されている設定項目：
- `PUBLIC_TRANSLATION_API_URL`: 翻訳APIのURL
- `PUBLIC_DICTIONARY_API_URL`: 辞書APIのURL
- `PUBLIC_API_TIMEOUT`: APIタイムアウト（ミリ秒）
- `PUBLIC_API_RETRY_COUNT`: APIリトライ回数
- `PUBLIC_API_RETRY_DELAY`: リトライ間隔（ミリ秒）

4. 開発サーバーを起動

```bash
npm run dev
```

5. ブラウザで http://localhost:5173 を開く

## プロジェクト構造

```
script-master/
├── frontend/               # SvelteKitアプリケーション
│   ├── src/
│   │   ├── lib/
│   │   │   ├── components/  # UIコンポーネント
│   │   │   ├── stores/      # Svelteストア（状態管理）
│   │   │   └── utils/       # ユーティリティ関数（NLP、クイズロジック等）
│   │   └── routes/          # ページコンポーネント（ファイルベースルーティング）
│   ├── static/              # 静的アセット
│   └── package.json
├── .gitignore
└── README.md
```

## ビルド

プロダクションビルドを作成：

```bash
cd frontend
npm run build
```

ビルドされたアプリのプレビュー：

```bash
npm run preview
```

## デプロイ

SvelteKitアプリケーションは、以下のプラットフォームにデプロイ可能です：

- [Vercel](https://vercel.com/)
- [Netlify](https://www.netlify.com/)
- [Cloudflare Pages](https://pages.cloudflare.com/)

デプロイ前に、適切な[アダプター](https://kit.svelte.dev/docs/adapters)を設定してください。

## ライセンス

このプロジェクトはプライベートリポジトリです。

## 作成者

hirachika
