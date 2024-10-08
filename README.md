# 成語你比我猜 (Idiom; you gesture, I guess)

## <a id='feature'>特色</a>

猜成語遊戲、成語詞典、書籤功能、網址分享、離線瀏覽、佈景主題切換、字型調整、跨平台、無廣告、開放原始碼。

## 說明

成語你比我猜 (Idiom; you gesture, I guess)，簡寫 ygig，是一款成語遊戲 + 成語詞典的 app。

遊戲部分：可作為聚會遊戲。玩法是出題者，點擊遊戲開始，會隨機由離線成語資料抓題，並依設定答題時間一題題切換。每題成語，出題者不可說出其中任何一字，只能用比手畫腳方式讓答題者猜是什麽成語。如果在限時內，答題者猜中某題成語，出題者請按綠色勾。若答題者放棄，出題者可按紅色叉跳過或等答題逾時。所有題目完成後，最後會顯示分數，與每題答題狀況。

另外有些成語用字較生僻，建議在玩時可以自行判定相似成語為答對。

* <a id='shareAppLink'>網址分享</a>
  1. 用瀏覽器開啟此 app 並開啟某成語資訊後，可複製其網址分享給別人開啟。
  2. App 內建"分享此頁"功能，可複製某成語連結至作業系統剪貼簿或產生 QR code，可分享給其他人。

* 離線瀏覽
* <a id='shortcuts'>App 捷徑</a>
  1. Windows, Android 的 Chrome 使用者，滑鼠右鍵或長按 app 圖示，可存取 app 功能捷徑，目前有：成語詞典。

* <a id='report'>App 異常回報</a>

  App 設定頁的異常回報鈕使用方法為：執行會造成 app 異常的步驟後，再至設定頁按下異常回報鈕，即會自動產生一封 E-mail，包含異常的記錄，發送此 E-mail 給我們即可。

程式碼為開放 (MIT License)，可自由下載修改、重新發佈。

## 支援平台
已在這些環境作過安裝、測試:
* Windows 11 + Chrome
* Android 9 + Chrome
* macOS 12 + Chrome
* iPad Pro + Safari
* iPhone 8 + Safari
* Ubuntu Linux 22 + Snap Store app

非上述環境仍可嘗試使用此 app。若有<a href='#knownIssues'>已知問題</a>未描述的問題，可用<a href='#report'>異常回報</a>功能。

建議 OS 與 Chrome、Safari 保持在最新版，以取得最佳 app 體驗。

## <a id='install'>安裝</a>

此 app 目前有2種取得、安裝方式：

  1. Chrome, Safari 網頁瀏覽器。
  2. App 商店。

### <a id='web-app'>從瀏覽器開啟/安裝</a>
請用 Chrome (Windows, macOS, Linux, Android 使用者)、Safari (iOS 使用者)瀏覽器開啟以下網址：

https://myhpwa.github.io/ygig

或：

<a href='https://myhpwa.github.io/ygig' target='_blank'>
<img width="auto" height='60px' src='https://user-images.githubusercontent.com/9122190/28998409-c5bf7362-7a00-11e7-9b63-db56694522e7.png'/>
</a>

此 progressive web app (PWA)，可不安裝直接在網頁瀏覽器執行，或安裝至手機、平板、筆電、桌機。建議安裝，以避免瀏覽器定期清除快取，導致書籤資料不見！

#### Windows, macOS, Linux, Android - 使用 Chrome 安裝
使用 Chrome 瀏覧器（建議最新版）開啟上述 PWA 網址後，網址列會出現一個加號，如圖所示：

<img src='https://github.com/MrMYHuang/ygig/raw/main/docs/images/ChromeInstall.png' width='50%' />

點擊它，以完成安裝。安裝完後會在桌面出現"你比我猜" app圖示。

#### iOS - 使用 Safari安裝
1. 使用 Safari 開啟 web app 網址，再點擊下方中間的"分享"圖示：

<img src='https://github.com/MrMYHuang/ygig/raw/main/docs/images/Safari/OpenAppUrl.png' width='50%' />

2. 滑動頁面至下方，點選"加入主畫面" (Add to Home Screen)：

<img src='https://github.com/MrMYHuang/ygig/raw/main/docs/images/Safari/AddToHomeScreen.png' width='50%' />

3. App 安裝完，出現在主畫面的圖示：

<img src='https://github.com/MrMYHuang/ygig/raw/main/docs/images/Safari/AppIcon.png' width='50%' />

### <a id='storeApp'>從 App 商店安裝</a>
#### iOS 14.0+ - 使用 App Store
<a href='https://apps.apple.com/app/id1634551497' target='_blank'>
<img width="auto" height='60px' src='https://github.com/MrMYHuang/ygig/raw/main/docs/images/Download_on_the_App_Store_Badge_CNTC_RGB_blk_100217.svg'/>
</a>

#### macOS 10.11+ - 使用 Apple App Store
<a href='https://apps.apple.com/app/id1634551497' target='_blank'>
<img width="auto" height='60px' src='https://github.com/MrMYHuang/ygig/raw/main/docs/images/Download_on_the_Mac_App_Store_Badge_CNTC_RGB_blk_100217.svg'/>
</a>

#### Android 6.0+ - 使用 Google Play Store
<a href='https://play.google.com/store/apps/details?id=io.github.myhpwa.ygig' target='_blank'>
<img width="auto" height='60px' alt='Google Play立即下載' src='https://github.com/MrMYHuang/ygig/raw/main/docs/images/zh-tw_badge_web_generic.png'/>
</a>

#### Windows 10+ - 使用 Microsoft Store
<a href='https://www.microsoft.com/store/apps/9PHK9WGRCL9Z' target='_blank'>
<img width="auto" height='60px' src='https://developer.microsoft.com/store/badges/images/Chinese-Traditional_get-it-from-MS.png' alt='Chinese Traditional badge'/>
</a>

#### Linux - 使用 Snap Store
<a href='https://snapcraft.io/ygig' target='_blank'>
<img width="auto" height='60px' src='https://github.com/MrMYHuang/ygig/raw/main/docs/images/[TW]-snap-store-black@2x.png' />
</a>

## <a id='history'>版本歷史</a>
* Snap apps 1.1.0:
  * [修正] Snap 版匯入／匯出存取權限問題.
  * [優化] 升級至 Electron 31.4.0。

* PWA 1.0.6:
  * [修正] iOS 啟動 app 後卡在載入中。

* PWA 1.0.5:
  * [修正] 更新離線資料後，更新日期未更新的問題。

* PWA 1.0.4:
  * [修正] Chrome 瀏覽器開啟自動中翻英後，app 功能異常的 bug。

* PWA 1.0.3:
  * [修正] iOS Safari 初始化會閃退的問題。

* PWA 1.0.2:
  * [修正] 書籤無法開啟。

* PWA 1.0.0:
  * 第1版。

## <a id='privacyPolicy'>隱私政策聲明</a>

此 app 無收集使用者個人資訊，也無收集匿名資訊。

## 第三方軟體版權聲明

1. 成語典 ( https://language.moe.gov.tw/001/Upload/Files/site_content/M0001/respub/dict_idiomsdict_download.html )

    此 app 使用《成語典》。此開放資料採「創用CC-姓名標示- 禁止改作 3.0 臺灣授權條款」釋出。
