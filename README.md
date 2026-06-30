# 低圧幹線計算アプリ Web v3.1.1 final

## 概要
低圧動力幹線計算・低圧電灯幹線計算の概略選定を行うPWAです。GitHub Pagesにそのまま配置できます。

## 主な反映内容

- メインUI文言を「低圧幹線計算 / 任意計算 / 技術資料」に整理
- 電圧を手動入力化し、3φ3W、3φ4W、1φ3W、1φ2Wに対応
- 負荷一覧から換算kW、換算kVA、換算電流を集計
- 推奨主幹、最小主幹、既設主幹の結果ページを分離
- 推奨ケーブルは推奨開閉器容量に連動
- 既設指定時は既設主幹・既設ケーブルの良否を判定
- 開閉器裕度をAおよびkW換算で表示
- CVD、CVQ、CV-1C、CV-2Cを選択肢に追加
- ケーブル概算質量kg/m、総質量kgを表示
- 配管占有率、参考配管、参考ラック幅を表示
- 保存データは10件まで保持
- CSV、Excel互換HTML、PDF印刷出力に対応
- メーカー名・商品名は表示しない方針
- 技術資料にラック支持、耐震、接地、絶縁、確認事項を追記

## ファイル構成

```text
index.html
styles.css
app.js
manifest.webmanifest
sw.js
icon.svg
icons/icon-192.png
icons/icon-512.png
404.html
.nojekyll
README.md
DATA_NOTES.md
app_meta.json
```

## GitHub Pages公開

1. リポジトリ直下に全ファイルを配置
2. GitHub Pagesを `main` / root で有効化
3. iPhone Safariで公開URLを開く
4. 共有メニューから「ホーム画面に追加」

## 注意
本アプリは施工検討用の概算補助です。最終判断は設計図書、内線規程、電気設備技術基準、メーカー資料、主任技術者・設計者・電力会社協議結果を優先してください。
