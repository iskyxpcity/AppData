# Voyage 權限申請清單

版本：7
更新日期：2026 年 10 月 22 日
生效日期：2026 年 10 月 19 日

## 說明

本清單列出 Voyage 工具箱（套件名稱 `com.cityray.aihrplus.vgjx`）在 Android 系統中宣告的全部權限，以及每項權限的使用目的和申請時機。本清單是[《隱私政策》](voyage-legal://privacy)的組成部分。

**本應用程式不會在啟動時集中申請權限。** 需要使用者授權的權限，只會在您使用對應工具、點按對應操作時申請，並在申請前說明用途。您拒絕授權只會導致對應功能無法使用，不影響其他功能。您可以隨時在系統設定中關閉已授予的權限。

Android 系統將權限分為幾類：

- **執行時權限**：使用時由系統彈窗請求您的同意；
- **特殊權限**：需要您在系統設定中手動開啟；
- **普通權限**：安裝時由系統自動授予，不涉及敏感個人資訊，系統不會彈窗；
- **第三方 SDK 宣告的權限**：由本應用程式整合的第三方 SDK 在其元件中宣告。

## 一、執行時權限

### 位置（精確位置、大致位置）

- 系統標識：`android.permission.ACCESS_FINE_LOCATION`、`android.permission.ACCESS_COARSE_LOCATION`
- 使用目的：指南針顯示座標與地址；GPS 測試讀取衛星狀態；GPS 速度表測速和記錄行程；攝影輔助計算日出日落和黃金時刻；油價查詢判斷所在地區；鳥鳴識別選擇地區模型；網路位址讀取 Wi-Fi 名稱與掃描結果；鎖頻讀取基地台資訊；Android 11 及以下的鋼琴藍牙掃描；AI 對話的位置工具（預設關閉）。
- 申請時機：您首次使用上述功能時。本應用程式不申請背景定位權限。

### 照片與影片中的位置

- 系統標識：`android.permission.ACCESS_MEDIA_LOCATION`
- 使用目的：Live Photo 合成時保留原照片的拍攝地點。
- 申請時機：您首次選擇素材或開啟「保留拍攝地點」時。拒絕後照常合成，只是不寫入地點。

### 身體活動

- 系統標識：`android.permission.ACTIVITY_RECOGNITION`
- 使用目的：防暈車「上車自動開啟」識別您是否進入交通工具；感測器面板讀取計步感測器。
- 申請時機：您開啟「上車自動開啟」或檢視相關感測器時。

### 相機

- 系統標識：`android.permission.CAMERA`
- 使用目的：心率檢測、頻閃檢測、測光、量角器、AR 測量、拍照計數、掃碼、文件掃描、食品條碼、以圖搜番、頭像製作、攝影機探測、AI 對話拍照，以及內建網頁請求使用相機時。
- 申請時機：您在上述工具中開啟相機時。畫面只在本機處理，以圖搜番除外（見隱私政策）。

### 麥克風

- 系統標識：`android.permission.RECORD_AUDIO`
- 使用目的：噪音計、變聲器、節拍器測速、鳥鳴識別、錄音待辦、鋼琴、做菜模式、AI 對話語音輸入、Live Photo 拍攝，以及內建網頁請求使用麥克風時。
- 申請時機：您在上述工具中開始錄音時。

### 通訊錄

- 系統標識：`android.permission.READ_CONTACTS`、`android.permission.WRITE_CONTACTS`
- 使用目的：頭像大全「設為聯絡人頭像」寫入您選定聯絡人的頭像；錄音待辦按號碼檢查聯絡人是否已存在並新建聯絡人。
- 申請時機：您點按上述操作時。不讀取、不上傳其他聯絡人資訊。

### 日曆

- 系統標識：`android.permission.READ_CALENDAR`、`android.permission.WRITE_CALENDAR`
- 使用目的：錄音待辦列出可寫入的日曆、檢查重複日程，並寫入識別出的日程與提醒。
- 申請時機：您點按「寫入日曆」時。

### 照片和影片

- 系統標識：`android.permission.READ_MEDIA_IMAGES`、`android.permission.READ_MEDIA_VIDEO`、`android.permission.READ_MEDIA_VISUAL_USER_SELECTED`
- 使用目的：本應用程式內建的媒體選擇器展示相簿中的圖片和影片；以圖搜番列出最近的截圖。您可以選擇只授權部分照片。
- 申請時機：您開啟內建媒體選擇器時。使用系統照片選擇器的功能不需要此權限。

### 儲存空間（Android 12 及以下）

- 系統標識：`android.permission.READ_EXTERNAL_STORAGE`（Android 12 及以下）、`android.permission.WRITE_EXTERNAL_STORAGE`（Android 10 及以下）
- 使用目的：在舊版本系統上讀取相簿，以及把下載、匯出的檔案儲存到公共目錄。
- 申請時機：您在舊版本系統上首次讀取相簿或儲存檔案時。

### 電話狀態

- 系統標識：`android.permission.READ_PHONE_STATE`
- 使用目的：SIM 改區和鎖頻讀取電信業者、SIM 卡與網路制式；手機效能排行顯示本機的行動數據網路制式和 5G 類型。
- 申請時機：您使用上述功能時。本應用程式不讀取您的手機號碼、IMEI 或通話內容。

### 附近的裝置

- 系統標識：`android.permission.BLUETOOTH_SCAN`、`android.permission.BLUETOOTH_CONNECT`、`android.permission.NEARBY_WIFI_DEVICES`
- 使用目的：鋼琴掃描並連線藍牙 MIDI 鍵盤；網路位址讀取已配對藍牙裝置的位址；FTP 服務與區域網路共享取得本機在區域網路中的位址。藍牙掃描和 Wi-Fi 裝置權限均宣告為不用於推斷位置。
- 申請時機：您使用上述功能時。

### 本地網路

- 系統標識：`android.permission.ACCESS_LOCAL_NETWORK`
- 使用目的：FTP 服務、區域網路共享和 DLNA 投放存取區域網路中的裝置。
- 申請時機：Android 16 及以上，您啟動上述功能時。

### 身體感測器與心率

- 系統標識：`android.permission.BODY_SENSORS`（Android 15 及以下）、`android.permission.health.READ_HEART_RATE`
- 使用目的：感測器面板讀取裝置的心率感測器。
- 申請時機：您在感測器面板中檢視心率感測器時。資料只在本機顯示。

### 通知

- 系統標識：`android.permission.POST_NOTIFICATIONS`
- 使用目的：顯示下載進度、背景播放控制、提醒、鬧鐘、待辦和各工具的結果通知。
- 申請時機：您首次使用需要傳送通知的功能時。

### Shizuku 授權

- 系統標識：`moe.shizuku.manager.permission.API_V23`
- 使用目的：在沒有 Root 的裝置上，透過 Shizuku 執行 SIM 改區、讀取 Android/data 目錄和應用管理等操作。
- 申請時機：您在上述功能中選擇使用 Shizuku 時，由 Shizuku 彈窗請求授權。

## 二、特殊權限

### 所有檔案存取權限

- 系統標識：`android.permission.MANAGE_EXTERNAL_STORAGE`
- 使用目的：檔案清理、區域網路共享與 FTP 服務的全磁碟共享、M4S 合併、磁力下載、yt-dlp 下載。
- 申請時機：您在上述功能中主動選擇開啟時，跳轉系統設定由您手動開啟。

### 使用情況存取權限

- 系統標識：`android.permission.PACKAGE_USAGE_STATS`
- 使用目的：檔案清理大師顯示各應用程式佔用的空間；通知歷史判斷通知是否疑似被撤回。
- 申請時機：您在上述功能中點按開啟時，跳轉系統設定由您手動開啟。

### 顯示在其他應用程式上層（懸浮窗）

- 系統標識：`android.permission.SYSTEM_ALERT_WINDOW`
- 使用目的：GPS 速度表懸浮速度球、防暈車運動提示、搜題與黑話懸浮球、無畏契約點位懸浮層。
- 申請時機：您開啟上述懸浮功能時。

### 修改系統設定

- 系統標識：`android.permission.WRITE_SETTINGS`
- 使用目的：影片提取音訊後把音訊設為來電鈴聲、通知提示音或鬧鐘鈴聲。
- 申請時機：您點按「設為鈴聲」時。

### 安裝未知應用程式

- 系統標識：`android.permission.REQUEST_INSTALL_PACKAGES`
- 使用目的：安裝本應用程式的更新；安裝包安裝器安裝您選擇的安裝包。
- 申請時機：您首次安裝更新或安裝包時。

### 鬧鐘與提醒

- 系統標識：`android.permission.SCHEDULE_EXACT_ALARM`
- 使用目的：模擬來電、全球電臺與線上聽歌的定時播放、待辦、經期、食譜、攝影輔助、AI 定時任務、Codex 重置摘要等提醒在設定時間準時觸發。
- 申請時機：您設定需要準時觸發的提醒時。

### 全螢幕通知

- 系統標識：`android.permission.USE_FULL_SCREEN_INTENT`
- 使用目的：模擬來電在螢幕鎖定時顯示全螢幕來電介面。
- 申請時機：您設定模擬來電時。

### 忽略電池最佳化

- 系統標識：`android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`
- 使用目的：線上聽歌背景播放、通知歷史、M4S 批次合併、防暈車長時間執行時不被系統中斷。
- 申請時機：您在上述功能中點按開啟時，由系統彈窗確認。

### 讀取已安裝應用程式清單

- 系統標識：`android.permission.QUERY_ALL_PACKAGES`
- 使用目的：應用管理列出裝置上的全部應用程式；檔案清理統計應用程式資料；通知歷史顯示通知來源應用程式的名稱和圖示；AI 對話的「列出應用」工具；QQ 登入判斷是否安裝了 QQ。
- 申請時機：安裝時由系統授予。本應用程式只在您使用上述功能時讀取應用程式清單，清單只在本機使用（透過 AI 對話讀取時會作為對話內容傳送給您配置的 AI 服務商）。

### 其他系統授權

以下能力不屬於清單權限，需要您在系統設定中單獨開啟：

- **無障礙服務**：朋友圈防摺疊在微信中分段寫入文案，只作用於微信。
- **輸入法**：朋友圈防摺疊的分段輸入鍵盤。
- **通知使用權**：通知歷史記錄其他應用程式的通知，內容只儲存在本機。
- **螢幕錄製**：螢幕取色器、搜題懸浮球、截圖識番在您每次發起時由系統彈窗授權擷取螢幕。
- **Root 授權**：應用管理、SIM 改區、鎖頻等功能由 Root 管理器彈窗授權。

## 三、普通權限

以下權限由系統在安裝時自動授予，不涉及敏感個人資訊：

- 存取網路：`android.permission.INTERNET`，用於連線我們的伺服器和各工具使用的網路服務。
- 檢視網路狀態：`android.permission.ACCESS_NETWORK_STATE`，用於判斷網路是否可用、是否為 Wi-Fi。
- 更改網路連線：`android.permission.CHANGE_NETWORK_STATE`，用於流量消耗器指定使用行動數據或 Wi-Fi。
- 檢視 Wi-Fi 狀態：`android.permission.ACCESS_WIFI_STATE`，用於網路位址工具讀取已連線的接入點。
- 更改 Wi-Fi 狀態：`android.permission.CHANGE_WIFI_STATE`，用於網路位址工具發起 Wi-Fi 掃描。
- 接收組播：`android.permission.CHANGE_WIFI_MULTICAST_STATE`，用於 DLNA 投放發現區域網路中的裝置。
- 藍牙管理：`android.permission.BLUETOOTH_ADMIN`（Android 11 及以下），用於鋼琴掃描藍牙 MIDI 鍵盤。
- NFC：`android.permission.NFC`，用於 NFC 工具讀取卡片。
- 振動：`android.permission.VIBRATE`，用於觸感回饋、提醒和鬧鐘。
- 防止休眠：`android.permission.WAKE_LOCK`，用於下載、播放、鬧鐘等過程中保持裝置執行。
- 開機啟動：`android.permission.RECEIVE_BOOT_COMPLETED`，用於重啟後恢復您設定的提醒、鬧鐘，以及您開啟了開機自啟的 FTP 服務與區域網路共享。
- 前景服務：`android.permission.FOREGROUND_SERVICE`，以及以下前景服務類型：`android.permission.FOREGROUND_SERVICE_DATA_SYNC`（下載、同步與轉寫）、`android.permission.FOREGROUND_SERVICE_MEDIA_PROCESSING`（影音合併與轉碼）、`android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK`（背景播放）、`android.permission.FOREGROUND_SERVICE_MICROPHONE`（背景錄音）、`android.permission.FOREGROUND_SERVICE_LOCATION`（速度表與指南針定位）、`android.permission.FOREGROUND_SERVICE_HEALTH`（防暈車）、`android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION`（螢幕擷取）、`android.permission.FOREGROUND_SERVICE_SPECIAL_USE`（模擬來電、FTP、區域網路共享、流量消耗器、介面除錯）。前景服務執行時會在通知列顯示。
- 高取樣率感測器：`android.permission.HIGH_SAMPLING_RATE_SENSORS`，用於防暈車以 100 Hz 讀取運動感測器。
- 修改音訊設定：`android.permission.MODIFY_AUDIO_SETTINGS`，用於變聲器的即時音效。
- 設定桌布：`android.permission.SET_WALLPAPER`，用於桌布工具把您選擇的圖片設為桌布。
- 建立桌面捷徑：`com.android.launcher.permission.INSTALL_SHORTCUT`（Android 7.1 及以下），用於把您選擇的工具新增到桌面。
- 即時活動通知：`android.permission.POST_PROMOTED_NOTIFICATIONS`，用於全球電臺睡眠定時的倒計時通知。
- 生物識別：`android.permission.USE_BIOMETRIC`，用於帳號安全和通知歷史呼叫系統身份驗證。驗證由系統完成，本應用程式不取得生物特徵資料。
- 請求解除安裝應用程式：`android.permission.REQUEST_DELETE_PACKAGES`，用於應用管理在您確認後解除安裝應用程式。
- 免確認更新：`android.permission.UPDATE_PACKAGES_WITHOUT_USER_ACTION`、`android.permission.ENFORCE_UPDATE_OWNERSHIP`，用於更新本應用程式曾經安裝過的應用程式時減少確認步驟。
- 廣告元件內部通訊：`com.cityray.aihrplus.vgjx.openadsdk.permission.TT_PANGOLIN`、`com.cityray.aihrplus.vgjx.permission.KW_SDK_BROADCAST`，為簽名級權限，只用於本應用程式內的廣告元件之間通訊。

## 四、第三方 SDK 宣告的權限

以下權限由本應用程式整合的第三方 SDK 在建置時合併到安裝包中。**這些 SDK 只在您同意相應服務後才會初始化**（廣告 SDK 需要您同意廣告服務，詳見[《第三方資訊共享清單》](voyage-legal://third-party)）。

- `android.permission.REORDER_TASKS`：騰訊優量匯廣告 SDK，用於在廣告頁面和應用程式頁面之間切換。
- `android.permission.GET_TASKS`：穿山甲廣告 SDK，用於判斷應用程式是否在前景。
- `com.google.android.gms.permission.AD_ID`、`com.asus.msa.SupplementaryDID.ACCESS`、`freemme.permission.msa`：OAID 元件與穿山甲廣告 SDK，用於在您同意廣告服務後讀取廣告識別碼。
- `com.google.android.c2dm.permission.RECEIVE`：Firebase Cloud Messaging，用於在安裝了 Google Play 服務的裝置上接收推播訊息。
- `android.permission.USE_FINGERPRINT`：AndroidX 生物識別元件，在舊版本系統上呼叫指紋驗證。
- `com.cityray.aihrplus.vgjx.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`：AndroidX 元件，用於保護本應用程式內部的廣播不被其他應用程式接收。

此外，廣告 SDK 也在其元件中宣告了位置、電話狀態、讀取已安裝應用程式清單、安裝應用程式等權限。**本應用程式不會為廣告申請這些權限**，但如果您已為其他工具授予了這些權限，廣告 SDK 在您同意廣告服務後可能在授權範圍內使用。
