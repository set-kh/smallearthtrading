# SMALL EARTH TRADING Co.,ltd — コーポレートサイト

カンボジア向け輸出入・物流サポートのサービス案内サイトです。
GitHub Pages で公開しています。

**公開URL:** https://set-kh.github.io/smallearthtrading/

## 構成

静的HTMLのみで、ビルド作業は不要です。ファイルを編集してコミットすれば、
数分後に公開サイトへ反映されます。

```
/
├─ index.html                    トップページ
├─ procedure.html                お手続きの流れ
├─ important-matters.html        重要事項説明
├─ faq-more.html                 よくあるご質問（検索機能つき）
├─ 404.html                      存在しないURL用のページ
├─ robots.txt / sitemap.xml      検索エンジン向け
├─ googlebe9db5a5b0420a7d.html   Search Console 所有権確認（削除・移動禁止）
└─ assets/
    ├─ css/style.css             全ページ共通のスタイル
    ├─ js/script.js              全ページ共通のスクリプト
    ├─ img/                      画像・ファビコン・OGP画像
    └─ video/                    動画
```

> **ルート直下のファイルは動かさないでください**
> HTMLファイルのURLは `sitemap.xml` と各ページの canonical で宣言済みです。
> 移動すると検索エンジンからは「別のページ」として扱われ、評価がリセットされます。
> `googlebe9db5a5b0420a7d.html` は移動・削除すると Search Console の所有権が失効します。

画像やCSSを追加するときは `assets/` 配下の該当フォルダに置き、
HTMLからは `assets/img/xxx.jpg` のような相対パスで参照してください。
`404.html` だけは例外で、どの階層で表示されるか分からないため
`/smallearthtrading/assets/img/xxx.jpg` という絶対パスを使っています。

## 日本語 / 英語の切り替えについて

**JavaScript は `<html>` の `lang` 属性を書き替えるだけ**で、実際の表示・非表示は
`style.css` の以下のルールが担当しています。

```css
html[lang="ja"] .lang-en,
html[lang="en"] .lang-ja { display: none; }
```

文章を追加するときは、日本語と英語をそれぞれ `lang-ja` / `lang-en` クラスで囲みます。

```html
<p>
    <span class="lang-ja">日本語の本文</span>
    <span class="lang-en">English text</span>
</p>
```

> **注意**
> HTML 側に `style="display:none;"` を直接書かないでください。
> CSS 側の制御と競合し、切り替えが効かなくなります。

ページタイトルは `<html>` タグの属性で指定します。

```html
<html lang="ja" data-title-ja="ページ名 - SMALL EARTH TRADING Co.,ltd"
                data-title-en="Page Name - SMALL EARTH TRADING Co.,ltd">
```

入力欄の `placeholder` を切り替えたい場合は `data-placeholder-ja` /
`data-placeholder-en` を使います。

## よくある更新作業

### 料金を変更する

`index.html` の `<section id="price-list">` 内を編集します。
金額は料金表の1か所にのみ記載し、お知らせ欄などからは料金表へリンクしてください。
同じ数字を複数箇所に書くと、改定時に片方だけ直し忘れる原因になります。

### お知らせを追加する

`index.html` の `<section id="news">` 内にある `<article class="news-item">`
ブロックを丸ごとコピーし、**新しいものを上に**置いて内容を差し替えます。
目印として `▼ 新しいお知らせは…▲` というコメントを入れてあります。

日付は表示テキストと `<time datetime="YYYY-MM-DD">` の両方を更新してください。

### 便のスケジュール

料金表に記載しているのは原則のサイクルです。
各便の確定日程はお知らせ欄と公式LINEで案内する運用のため、
毎月の日付は料金表側を書き換える必要はありません。

### お申込みフォームのURL

お申込みは Google フォーム `https://forms.gle/Lw5NqFom9Lw9euzAA` に統一しています。
フォームを作り直してURLが変わった場合は、次の箇所をすべて置換してください
（`grep -rn "forms.gle" *.html` で一覧できます）。

- `index.html`: ナビの「お申込み」、ヒーローのボタン、お知らせ、ご利用の流れ、お問い合わせ
- `procedure.html`: ステップ1
- `faq-more.html`: Q12・Q16
- `important-matters.html`: 末尾の同意リンク

### AIアシスタント（Telegram Bot）のリンク

`index.html` の `<section id="ai-assistant">` にある
`<a id="ai-bot-link" data-bot-url="">` の `data-bot-url` に
`https://t.me/＜Bot名＞` を入れると、ボタンが Bot へのリンクになります
（`script.js` が `https://t.me/` で始まる値のときだけ差し替えます）。
空のままの間は「お問い合わせ」の Telegram QR へ誘導します。
公開時は、同セクションの「近日公開」バッジ（`.ai-badge`）とお知らせの文言も更新してください。

### 窓口の移行（LINE → Telegram）

現在は「お申込み＝フォーム、ご相談＝公式LINE（日本語）／Telegram（English）」です。
Telegram への移行が進んだら、次の順で差し替えます。

1. `#ai-assistant` の Bot リンクを有効化（上記）
2. ヒーローの第2ボタン（`.cta-button-secondary`）とお問い合わせの文言を「Telegram」優先に
3. `#line-for-customers` セクション（LINE登録案内の動画）を Telegram 案内に置き換え
4. 最後に LINE の QR（`lineofficial-set.jpg`）を外す

## 動作確認

ローカルでは HTML ファイルをブラウザで直接開けば確認できます。
言語設定は `localStorage` に保存されるため、切り替えの挙動を初期状態から
試したい場合は、開発者ツールのコンソールで以下を実行してください。

```js
localStorage.removeItem('preferredLanguage'); location.reload();
```

## 未対応の課題

- `<img>` に `width` / `height` 属性がなく、読み込み時にレイアウトが動く
- 動画（約3.4MB）に `preload="none"` が未指定
- 画像が JPEG のままで、WebP 化による軽量化の余地がある
- 日英が同一URLに同居しているため、検索エンジン評価上は `/en/` への分離が望ましい

## メタ情報・SEO

各ページの `<head>` に `description`、canonical、OGP、ファビコンを設定しています。
ページを追加したときは、以下もあわせて更新してください。

- 新しいページの `<head>` に同じ形式のメタタグ一式（`description` と canonical、
  `og:title` / `og:description` / `og:url` はページごとに書き換える）
- `sitemap.xml` に `<url>` ブロックを追加し、`lastmod` を更新

SNSでシェアされたときのサムネイルは `og-image.jpg`（1200x630）です。
差し替える場合は同じ寸法で用意してください。

`404.html` は GitHub Pages が自動で使う特別なファイル名です。
このサイトはリポジトリ名がURLに含まれる形で公開されているため、
`404.html` 内のリンクは `/smallearthtrading/` から始まる絶対パスで書いています。
