# Voyage 权限申请清单

版本：7
更新日期：2026 年 10 月 22 日
生效日期：2026 年 10 月 19 日

## 说明

本清单列出 Voyage 工具箱（安装包名 `com.cityray.aihrplus.vgjx`）在 Android 系统中声明的全部权限，以及每项权限的使用目的和申请时机。本清单是[《隐私政策》](voyage-legal://privacy)的组成部分。

**本应用不会在启动时集中申请权限。** 需要用户授权的权限，只会在您使用对应工具、点按对应操作时申请，并在申请前说明用途。您拒绝授权只会导致对应功能无法使用，不影响其他功能。您可以随时在系统设置中关闭已授予的权限。

Android 系统将权限分为几类：

- **运行时权限**：使用时由系统弹窗请求您的同意；
- **特殊权限**：需要您在系统设置中手动开启；
- **普通权限**：安装时由系统自动授予，不涉及敏感个人信息，系统不会弹窗；
- **第三方 SDK 声明的权限**：由本应用集成的第三方 SDK 在其组件中声明。

## 一、运行时权限

### 位置（精确位置、大致位置）

- 系统标识：`android.permission.ACCESS_FINE_LOCATION`、`android.permission.ACCESS_COARSE_LOCATION`
- 使用目的：指南针显示坐标与地址；GPS 测试读取卫星状态；GPS 速度表测速和记录行程；摄影辅助计算日出日落和黄金时刻；油价查询判断所在地区；鸟鸣识别选择地区模型；网络地址读取 Wi-Fi 名称与扫描结果；锁频读取小区信息；Android 11 及以下的钢琴蓝牙扫描；AI 对话的位置工具（默认关闭）。
- 申请时机：您首次使用上述功能时。本应用不申请后台定位权限。

### 照片与视频中的位置

- 系统标识：`android.permission.ACCESS_MEDIA_LOCATION`
- 使用目的：Live Photo 合成时保留原照片的拍摄地点。
- 申请时机：您首次选择素材或开启「保留拍摄地点」时。拒绝后照常合成，只是不写入地点。

### 身体活动

- 系统标识：`android.permission.ACTIVITY_RECOGNITION`
- 使用目的：防晕车「上车自动开启」识别您是否进入交通工具；传感器面板读取计步传感器。
- 申请时机：您开启「上车自动开启」或查看相关传感器时。

### 相机

- 系统标识：`android.permission.CAMERA`
- 使用目的：心率检测、频闪检测、测光、量角器、AR 测量、拍照计数、扫码、文档扫描、食品条码、以图搜番、头像制作、摄像头探测、AI 对话拍照，以及内置网页请求使用相机时。
- 申请时机：您在上述工具中打开相机时。画面只在本机处理，以图搜番除外（见隐私政策）。

### 麦克风

- 系统标识：`android.permission.RECORD_AUDIO`
- 使用目的：噪音计、变声器、节拍器测速、鸟鸣识别、录音待办、钢琴、做菜模式、AI 对话语音输入、Live Photo 拍摄，以及内置网页请求使用麦克风时。
- 申请时机：您在上述工具中开始录音时。

### 通讯录

- 系统标识：`android.permission.READ_CONTACTS`、`android.permission.WRITE_CONTACTS`
- 使用目的：头像大全「设为联系人头像」写入您选定联系人的头像；录音待办按号码检查联系人是否已存在并新建联系人。
- 申请时机：您点按上述操作时。不读取、不上传其他联系人信息。

### 日历

- 系统标识：`android.permission.READ_CALENDAR`、`android.permission.WRITE_CALENDAR`
- 使用目的：录音待办列出可写入的日历、检查重复日程，并写入识别出的日程与提醒。
- 申请时机：您点按「写入日历」时。

### 照片和视频

- 系统标识：`android.permission.READ_MEDIA_IMAGES`、`android.permission.READ_MEDIA_VIDEO`、`android.permission.READ_MEDIA_VISUAL_USER_SELECTED`
- 使用目的：本应用内置的媒体选择器展示相册中的图片和视频；以图搜番列出最近的截图。您可以选择只授权部分照片。
- 申请时机：您打开内置媒体选择器时。使用系统照片选择器的功能不需要此权限。

### 存储空间（Android 12 及以下）

- 系统标识：`android.permission.READ_EXTERNAL_STORAGE`（Android 12 及以下）、`android.permission.WRITE_EXTERNAL_STORAGE`（Android 10 及以下）
- 使用目的：在旧版本系统上读取相册，以及把下载、导出的文件保存到公共目录。
- 申请时机：您在旧版本系统上首次读取相册或保存文件时。

### 电话状态

- 系统标识：`android.permission.READ_PHONE_STATE`
- 使用目的：SIM 改区和锁频读取运营商、SIM 卡与网络制式；手机性能排行显示本机的数据网络制式和 5G 类型。
- 申请时机：您使用上述功能时。本应用不读取您的手机号码、IMEI 或通话内容。

### 附近的设备

- 系统标识：`android.permission.BLUETOOTH_SCAN`、`android.permission.BLUETOOTH_CONNECT`、`android.permission.NEARBY_WIFI_DEVICES`
- 使用目的：钢琴扫描并连接蓝牙 MIDI 键盘；网络地址读取已配对蓝牙设备的地址；FTP 服务与局域网共享获取本机在局域网中的地址。蓝牙扫描和 Wi-Fi 设备权限均声明为不用于推断位置。
- 申请时机：您使用上述功能时。

### 本地网络

- 系统标识：`android.permission.ACCESS_LOCAL_NETWORK`
- 使用目的：FTP 服务、局域网共享和 DLNA 投屏访问局域网中的设备。
- 申请时机：Android 16 及以上，您启动上述功能时。

### 身体传感器与心率

- 系统标识：`android.permission.BODY_SENSORS`（Android 15 及以下）、`android.permission.health.READ_HEART_RATE`
- 使用目的：传感器面板读取设备的心率传感器。
- 申请时机：您在传感器面板中查看心率传感器时。数据只在本机显示。

### 通知

- 系统标识：`android.permission.POST_NOTIFICATIONS`
- 使用目的：显示下载进度、后台播放控制、提醒、闹钟、待办和各工具的结果通知。
- 申请时机：您首次使用需要发送通知的功能时。

### Shizuku 授权

- 系统标识：`moe.shizuku.manager.permission.API_V23`
- 使用目的：在没有 Root 的设备上，通过 Shizuku 执行 SIM 改区、读取 Android/data 目录和应用管理等操作。
- 申请时机：您在上述功能中选择使用 Shizuku 时，由 Shizuku 弹窗请求授权。

## 二、特殊权限

### 所有文件访问权限

- 系统标识：`android.permission.MANAGE_EXTERNAL_STORAGE`
- 使用目的：文件清理、局域网共享与 FTP 服务的整盘共享、M4S 合并、磁力下载、yt-dlp 下载。
- 申请时机：您在上述功能中主动选择开启时，跳转系统设置由您手动开启。

### 使用情况访问权限

- 系统标识：`android.permission.PACKAGE_USAGE_STATS`
- 使用目的：文件清理大师显示各应用占用的空间；通知历史判断通知是否疑似被撤回。
- 申请时机：您在上述功能中点按开启时，跳转系统设置由您手动开启。

### 显示在其他应用上层（悬浮窗）

- 系统标识：`android.permission.SYSTEM_ALERT_WINDOW`
- 使用目的：GPS 速度表悬浮速度球、防晕车运动提示、搜题与黑话悬浮球、无畏契约点位悬浮层。
- 申请时机：您开启上述悬浮功能时。

### 修改系统设置

- 系统标识：`android.permission.WRITE_SETTINGS`
- 使用目的：视频提取音频后把音频设为来电铃声、通知提示音或闹钟铃声。
- 申请时机：您点按「设为铃声」时。

### 安装未知应用

- 系统标识：`android.permission.REQUEST_INSTALL_PACKAGES`
- 使用目的：安装本应用的更新；安装包安装器安装您选择的安装包。
- 申请时机：您首次安装更新或安装包时。

### 闹钟与提醒

- 系统标识：`android.permission.SCHEDULE_EXACT_ALARM`
- 使用目的：模拟来电、全球电台与在线听歌的定时播放、待办、经期、菜谱、摄影辅助、AI 定时任务、Codex 重置摘要等提醒在设定时间准时触发。
- 申请时机：您设置需要准时触发的提醒时。

### 全屏通知

- 系统标识：`android.permission.USE_FULL_SCREEN_INTENT`
- 使用目的：模拟来电在锁屏时显示全屏来电界面。
- 申请时机：您设置模拟来电时。

### 忽略电池优化

- 系统标识：`android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`
- 使用目的：在线听歌后台播放、通知历史、M4S 批量合并、防晕车长时间运行时不被系统中断。
- 申请时机：您在上述功能中点按开启时，由系统弹窗确认。

### 读取已安装应用列表

- 系统标识：`android.permission.QUERY_ALL_PACKAGES`
- 使用目的：应用管理列出设备上的全部应用；文件清理统计应用数据；通知历史显示通知来源应用的名称和图标；AI 对话的「列出应用」工具；QQ 登录判断是否安装了 QQ。
- 申请时机：安装时由系统授予。本应用只在您使用上述功能时读取应用列表，列表只在本机使用（通过 AI 对话读取时会作为对话内容发送给您配置的 AI 服务商）。

### 其他系统授权

以下能力不属于清单权限，需要您在系统设置中单独开启：

- **无障碍服务**：朋友圈防折叠在微信中分段写入文案，只作用于微信。
- **输入法**：朋友圈防折叠的分段输入键盘。
- **通知使用权**：通知历史记录其他应用的通知，内容只保存在本机。
- **屏幕录制**：屏幕取色器、搜题悬浮球、截屏识番在您每次发起时由系统弹窗授权截取屏幕。
- **Root 授权**：应用管理、SIM 改区、锁频等功能由 Root 管理器弹窗授权。

## 三、普通权限

以下权限由系统在安装时自动授予，不涉及敏感个人信息：

- 访问网络：`android.permission.INTERNET`，用于连接我们的服务器和各工具使用的网络服务。
- 查看网络状态：`android.permission.ACCESS_NETWORK_STATE`，用于判断网络是否可用、是否为 Wi-Fi。
- 更改网络连接：`android.permission.CHANGE_NETWORK_STATE`，用于流量消耗器指定使用移动数据或 Wi-Fi。
- 查看 Wi-Fi 状态：`android.permission.ACCESS_WIFI_STATE`，用于网络地址工具读取已连接的接入点。
- 更改 Wi-Fi 状态：`android.permission.CHANGE_WIFI_STATE`，用于网络地址工具发起 Wi-Fi 扫描。
- 接收组播：`android.permission.CHANGE_WIFI_MULTICAST_STATE`，用于 DLNA 投屏发现局域网中的设备。
- 蓝牙管理：`android.permission.BLUETOOTH_ADMIN`（Android 11 及以下），用于钢琴扫描蓝牙 MIDI 键盘。
- NFC：`android.permission.NFC`，用于 NFC 工具读取卡片。
- 振动：`android.permission.VIBRATE`，用于触感反馈、提醒和闹钟。
- 防止休眠：`android.permission.WAKE_LOCK`，用于下载、播放、闹钟等过程中保持设备运行。
- 开机启动：`android.permission.RECEIVE_BOOT_COMPLETED`，用于重启后恢复您设置的提醒、闹钟，以及您开启了开机自启的 FTP 服务与局域网共享。
- 前台服务：`android.permission.FOREGROUND_SERVICE`，以及以下前台服务类型：`android.permission.FOREGROUND_SERVICE_DATA_SYNC`（下载、同步与转写）、`android.permission.FOREGROUND_SERVICE_MEDIA_PROCESSING`（音视频合并与转码）、`android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK`（后台播放）、`android.permission.FOREGROUND_SERVICE_MICROPHONE`（后台录音）、`android.permission.FOREGROUND_SERVICE_LOCATION`（速度表与指南针定位）、`android.permission.FOREGROUND_SERVICE_HEALTH`（防晕车）、`android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION`（屏幕截取）、`android.permission.FOREGROUND_SERVICE_SPECIAL_USE`（模拟来电、FTP、局域网共享、流量消耗器、接口调试）。前台服务运行时会在通知栏显示。
- 高采样率传感器：`android.permission.HIGH_SAMPLING_RATE_SENSORS`，用于防晕车以 100 Hz 读取运动传感器。
- 修改音频设置：`android.permission.MODIFY_AUDIO_SETTINGS`，用于变声器的实时音效。
- 设置壁纸：`android.permission.SET_WALLPAPER`，用于壁纸工具把您选择的图片设为壁纸。
- 创建桌面快捷方式：`com.android.launcher.permission.INSTALL_SHORTCUT`（Android 7.1 及以下），用于把您选择的工具添加到桌面。
- 实时活动通知：`android.permission.POST_PROMOTED_NOTIFICATIONS`，用于全球电台睡眠定时的倒计时通知。
- 生物识别：`android.permission.USE_BIOMETRIC`，用于账号安全和通知历史调用系统身份验证。验证由系统完成，本应用不获取生物特征数据。
- 请求卸载应用：`android.permission.REQUEST_DELETE_PACKAGES`，用于应用管理在您确认后卸载应用。
- 免确认更新：`android.permission.UPDATE_PACKAGES_WITHOUT_USER_ACTION`、`android.permission.ENFORCE_UPDATE_OWNERSHIP`，用于更新本应用曾经安装过的应用时减少确认步骤。
- 广告组件内部通信：`com.cityray.aihrplus.vgjx.openadsdk.permission.TT_PANGOLIN`、`com.cityray.aihrplus.vgjx.permission.KW_SDK_BROADCAST`，为签名级权限，只用于本应用内的广告组件之间通信。

## 四、第三方 SDK 声明的权限

以下权限由本应用集成的第三方 SDK 在构建时合并到安装包中。**这些 SDK 只在您同意相应服务后才会初始化**（广告 SDK 需要您同意广告服务，详见[《第三方信息共享清单》](voyage-legal://third-party)）。

- `android.permission.REORDER_TASKS`：腾讯优量汇广告 SDK，用于在广告页面和应用页面之间切换。
- `android.permission.GET_TASKS`：穿山甲广告 SDK，用于判断应用是否在前台。
- `com.google.android.gms.permission.AD_ID`、`com.asus.msa.SupplementaryDID.ACCESS`、`freemme.permission.msa`：OAID 组件与穿山甲广告 SDK，用于在您同意广告服务后读取广告标识符。
- `com.google.android.c2dm.permission.RECEIVE`：Firebase Cloud Messaging，用于在安装了 Google Play 服务的设备上接收推送消息。
- `android.permission.USE_FINGERPRINT`：AndroidX 生物识别组件，在旧版本系统上调用指纹验证。
- `com.cityray.aihrplus.vgjx.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`：AndroidX 组件，用于保护本应用内部的广播不被其他应用接收。

此外，广告 SDK 也在其组件中声明了位置、电话状态、读取已安装应用列表、安装应用等权限。**本应用不会为广告申请这些权限**，但如果您已为其他工具授予了这些权限，广告 SDK 在您同意广告服务后可能在授权范围内使用。
