# Voyage Permission List

Version: 7
Last updated: October 22, 2026
Effective date: October 18, 2026

## Overview

This list sets out all the permissions declared in the Android system by the Voyage toolbox (package name `com.cityray.aihrplus.vgjx`), together with the purpose of each permission and when it is requested. This list forms part of the [Privacy Policy](voyage-legal://privacy). This English version is provided for reference only; the Simplified Chinese version prevails.

**The App does not request permissions all at once at startup.** Permissions that require your authorization are requested only when you use the corresponding tool or tap the corresponding action, and their purpose is explained before the request. If you refuse authorization, only the corresponding feature will be unavailable; other features are not affected. You can turn off granted permissions in system settings at any time.

The Android system divides permissions into several categories:

- **Runtime permissions**: requested through a system dialog asking for your consent when they are used;
- **Special permissions**: must be turned on manually by you in system settings;
- **Normal permissions**: granted automatically by the system at installation, do not involve sensitive personal information, and do not trigger a system dialog;
- **Permissions declared by third-party SDKs**: declared in their components by the third-party SDKs integrated into the App.

## 1. Runtime Permissions

### Location (precise location, approximate location)

- System identifier: `android.permission.ACCESS_FINE_LOCATION`, `android.permission.ACCESS_COARSE_LOCATION`
- Purpose: Compass shows coordinates and address; GPS Test reads satellite status; GPS Speedometer measures speed and records trips; Photography Assistant calculates sunrise, sunset and golden hour; Fuel Prices determines your region; Bird Sound Identification selects a regional model; Network Address reads the Wi-Fi network name and scan results; Band Locking reads cell information; Piano scans for Bluetooth devices on Android 11 and below; the location tool in AI Chat (off by default).
- When requested: The first time you use any of the features above. The App does not request background location permission.

### Location in photos and videos

- System identifier: `android.permission.ACCESS_MEDIA_LOCATION`
- Purpose: Live Photo Maker keeps the shooting location of the original photo when generating a Live Photo.
- When requested: The first time you select source material or turn on "Keep shooting location". If you refuse, the Live Photo is still generated, but without the location.

### Physical activity

- System identifier: `android.permission.ACTIVITY_RECOGNITION`
- Purpose: "Start automatically in a vehicle" in Motion Sickness Relief detects whether you have entered a vehicle; Sensor Panel reads the step counter sensor.
- When requested: When you turn on "Start automatically in a vehicle" or view the related sensors.

### Camera

- System identifier: `android.permission.CAMERA`
- Purpose: Heart Rate Monitor, Flicker Detector, Light Meter, Protractor, AR Measure, Photo Counter, Code Scanner, Document Scanner, Food Barcode, Anime Search by Image, Avatar Maker, Hidden Camera Detector, taking photos in AI Chat, and when a built-in web page requests the camera.
- When requested: When you open the camera in any of the tools above. The camera feed is processed only on your device, except for Anime Search by Image (see the Privacy Policy).

### Microphone

- System identifier: `android.permission.RECORD_AUDIO`
- Purpose: Sound Meter, Voice Changer, metronome tempo detection, Bird Sound Identification, Voice Todo, Piano, Cooking Mode, voice input in AI Chat, Live Photo capture, and when a built-in web page requests the microphone.
- When requested: When you start recording in any of the tools above.

### Contacts

- System identifier: `android.permission.READ_CONTACTS`, `android.permission.WRITE_CONTACTS`
- Purpose: "Set as contact photo" in Avatar Gallery writes the avatar to the contact you select; Voice Todo checks by phone number whether a contact already exists and creates new contacts.
- When requested: When you tap the actions above. Other contact information is not read or uploaded.

### Calendar

- System identifier: `android.permission.READ_CALENDAR`, `android.permission.WRITE_CALENDAR`
- Purpose: Voice Todo lists the calendars it can write to, checks for duplicate events, and writes recognized events and reminders.
- When requested: When you tap "Add to calendar".

### Photos and videos

- System identifier: `android.permission.READ_MEDIA_IMAGES`, `android.permission.READ_MEDIA_VIDEO`, `android.permission.READ_MEDIA_VISUAL_USER_SELECTED`
- Purpose: The App's built-in media picker displays images and videos in your photo library; Anime Search by Image lists recent screenshots. You can choose to grant access to only some photos.
- When requested: When you open the built-in media picker. Features that use the system photo picker do not need this permission.

### Storage (Android 12 and below)

- System identifier: `android.permission.READ_EXTERNAL_STORAGE` (Android 12 and below), `android.permission.WRITE_EXTERNAL_STORAGE` (Android 10 and below)
- Purpose: Reading the photo library on older system versions, and saving downloaded and exported files to public directories.
- When requested: The first time you read the photo library or save a file on an older system version.

### Phone state

- System identifier: `android.permission.READ_PHONE_STATE`
- Purpose: SIM Region Changer and Band Locking read the carrier, SIM card and network type; Phone Performance Ranking shows your device's mobile data network type and 5G type.
- When requested: When you use the features above. The App does not read your phone number, IMEI or call content.

### Nearby devices

- System identifier: `android.permission.BLUETOOTH_SCAN`, `android.permission.BLUETOOTH_CONNECT`, `android.permission.NEARBY_WIFI_DEVICES`
- Purpose: Piano scans for and connects to Bluetooth MIDI keyboards; Network Address reads the addresses of paired Bluetooth devices; FTP Server and LAN Share obtain your device's address on the local network. Both the Bluetooth scan permission and the Wi-Fi devices permission are declared as not being used to derive location.
- When requested: When you use the features above.

### Local network

- System identifier: `android.permission.ACCESS_LOCAL_NETWORK`
- Purpose: FTP Server, LAN Share and DLNA casting access devices on the local network.
- When requested: On Android 16 and above, when you start any of the features above.

### Body sensors and heart rate

- System identifier: `android.permission.BODY_SENSORS` (Android 15 and below), `android.permission.health.READ_HEART_RATE`
- Purpose: Sensor Panel reads the device's heart rate sensor.
- When requested: When you view the heart rate sensor in Sensor Panel. The data is displayed only on your device.

### Notifications

- System identifier: `android.permission.POST_NOTIFICATIONS`
- Purpose: Showing download progress, background playback controls, reminders, alarms, to-dos and result notifications from each tool.
- When requested: The first time you use a feature that needs to send notifications.

### Shizuku authorization

- System identifier: `moe.shizuku.manager.permission.API_V23`
- Purpose: On devices without root access, performing operations such as SIM region changing, reading the Android/data directory and app management through Shizuku.
- When requested: When you choose to use Shizuku in the features above; Shizuku shows a dialog to request authorization.

## 2. Special Permissions

### All files access

- System identifier: `android.permission.MANAGE_EXTERNAL_STORAGE`
- Purpose: File Cleaner, whole-storage sharing in LAN Share and FTP Server, M4S Merge, Magnet Download, and yt-dlp downloads.
- When requested: When you actively choose to turn it on in the features above; you are taken to system settings to turn it on manually.

### Usage access

- System identifier: `android.permission.PACKAGE_USAGE_STATS`
- Purpose: File Cleaner Master shows the storage space used by each app; Notification History determines whether a notification may have been recalled.
- When requested: When you tap to turn it on in the features above; you are taken to system settings to turn it on manually.

### Display over other apps (floating windows)

- System identifier: `android.permission.SYSTEM_ALERT_WINDOW`
- Purpose: The floating speed bubble in GPS Speedometer, motion cues in Motion Sickness Relief, the floating buttons of Question Search and Slang Dictionary, and the VALORANT Lineups overlay.
- When requested: When you turn on any of the floating features above.

### Modify system settings

- System identifier: `android.permission.WRITE_SETTINGS`
- Purpose: Setting audio extracted from a video as the ringtone, notification sound or alarm sound.
- When requested: When you tap "Set as ringtone".

### Install unknown apps

- System identifier: `android.permission.REQUEST_INSTALL_PACKAGES`
- Purpose: Installing updates to the App; the package installer installs the packages you select.
- When requested: The first time you install an update or a package.

### Alarms and reminders

- System identifier: `android.permission.SCHEDULE_EXACT_ALARM`
- Purpose: Making reminders fire exactly at the set time, including fake calls, scheduled playback in World Radio and Online Music, to-dos, period tracking, recipes, Photography Assistant, scheduled AI tasks and Codex reset digests.
- When requested: When you set a reminder that needs to fire at an exact time.

### Full-screen notifications

- System identifier: `android.permission.USE_FULL_SCREEN_INTENT`
- Purpose: Showing the full-screen incoming call screen for fake calls when the device is locked.
- When requested: When you set up a fake call.

### Ignore battery optimizations

- System identifier: `android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`
- Purpose: Preventing the system from interrupting background playback in Online Music, Notification History, batch M4S merging and long-running Motion Sickness Relief sessions.
- When requested: When you tap to turn it on in the features above; the system shows a dialog for confirmation.

### Read the list of installed apps

- System identifier: `android.permission.QUERY_ALL_PACKAGES`
- Purpose: App Manager lists all apps on the device; File Cleaner calculates app data; Notification History shows the name and icon of the app that posted a notification; the "List apps" tool in AI Chat; QQ sign-in checks whether QQ is installed.
- When requested: Granted by the system at installation. The App reads the app list only when you use the features above, and the list is used only on your device (when read through AI Chat, it is sent as part of the conversation to the AI service provider you have configured).

### Other system authorizations

The following capabilities are not manifest permissions and must be turned on separately by you in system settings:

- **Accessibility service**: Moments Anti-Fold writes text into WeChat in segments; it works only within WeChat.
- **Input method**: The segmented input keyboard for Moments Anti-Fold.
- **Notification access**: Notification History records notifications from other apps; the content is saved only on your device.
- **Screen recording**: Screen Color Picker, the Question Search floating button and Screenshot Anime Search capture the screen with authorization granted through a system dialog each time you start a capture.
- **Root authorization**: Features such as App Manager, SIM Region Changer and Band Locking are authorized through a dialog from your root manager.

## 3. Normal Permissions

The following permissions are granted automatically by the system at installation and do not involve sensitive personal information:

- Network access: `android.permission.INTERNET`, used to connect to our servers and to the network services used by each tool.
- View network status: `android.permission.ACCESS_NETWORK_STATE`, used to determine whether the network is available and whether it is Wi-Fi.
- Change network connectivity: `android.permission.CHANGE_NETWORK_STATE`, used by Data Consumer to specify mobile data or Wi-Fi.
- View Wi-Fi status: `android.permission.ACCESS_WIFI_STATE`, used by the Network Address tool to read the connected access point.
- Change Wi-Fi status: `android.permission.CHANGE_WIFI_STATE`, used by the Network Address tool to start a Wi-Fi scan.
- Receive multicast: `android.permission.CHANGE_WIFI_MULTICAST_STATE`, used by DLNA casting to discover devices on the local network.
- Bluetooth administration: `android.permission.BLUETOOTH_ADMIN` (Android 11 and below), used by Piano to scan for Bluetooth MIDI keyboards.
- NFC: `android.permission.NFC`, used by NFC tools to read cards.
- Vibration: `android.permission.VIBRATE`, used for haptic feedback, reminders and alarms.
- Prevent sleep: `android.permission.WAKE_LOCK`, used to keep the device running during downloads, playback, alarms and similar processes.
- Run at startup: `android.permission.RECEIVE_BOOT_COMPLETED`, used after a reboot to restore the reminders and alarms you have set, as well as FTP Server and LAN Share if you have enabled them to start at boot.
- Foreground services: `android.permission.FOREGROUND_SERVICE`, together with the following foreground service types: `android.permission.FOREGROUND_SERVICE_DATA_SYNC` (downloads, sync and transcription), `android.permission.FOREGROUND_SERVICE_MEDIA_PROCESSING` (audio and video merging and transcoding), `android.permission.FOREGROUND_SERVICE_MEDIA_PLAYBACK` (background playback), `android.permission.FOREGROUND_SERVICE_MICROPHONE` (background recording), `android.permission.FOREGROUND_SERVICE_LOCATION` (location for the speedometer and compass), `android.permission.FOREGROUND_SERVICE_HEALTH` (Motion Sickness Relief), `android.permission.FOREGROUND_SERVICE_MEDIA_PROJECTION` (screen capture), `android.permission.FOREGROUND_SERVICE_SPECIAL_USE` (fake calls, FTP, LAN Share, Data Consumer, API debugging). A notification is shown in the notification bar while a foreground service is running.
- High sampling rate sensors: `android.permission.HIGH_SAMPLING_RATE_SENSORS`, used by Motion Sickness Relief to read motion sensors at 100 Hz.
- Modify audio settings: `android.permission.MODIFY_AUDIO_SETTINGS`, used for real-time effects in Voice Changer.
- Set wallpaper: `android.permission.SET_WALLPAPER`, used by wallpaper tools to set the image you select as your wallpaper.
- Create home-screen shortcuts: `com.android.launcher.permission.INSTALL_SHORTCUT` (Android 7.1 and earlier), used to add the tools you choose to the home screen.
- Live activity notifications: `android.permission.POST_PROMOTED_NOTIFICATIONS`, used for the countdown notification of the sleep timer in World Radio.
- Biometrics: `android.permission.USE_BIOMETRIC`, used by account security and Notification History to call system authentication. Verification is performed by the system, and the App does not obtain biometric data.
- Request app uninstallation: `android.permission.REQUEST_DELETE_PACKAGES`, used by App Manager to uninstall apps after you confirm.
- Updates without confirmation: `android.permission.UPDATE_PACKAGES_WITHOUT_USER_ACTION`, `android.permission.ENFORCE_UPDATE_OWNERSHIP`, used to reduce confirmation steps when updating apps previously installed by the App.
- Internal communication between ad components: `com.cityray.aihrplus.vgjx.openadsdk.permission.TT_PANGOLIN`, `com.cityray.aihrplus.vgjx.permission.KW_SDK_BROADCAST`; these are signature-level permissions used only for communication between ad components within the App.

## 4. Permissions Declared by Third-Party SDKs

The following permissions are merged into the installation package at build time by the third-party SDKs integrated into the App. **These SDKs are initialized only after you agree to the corresponding service** (the advertising SDKs require your consent to the ad service; for details, see the [Third-Party Information Sharing List](voyage-legal://third-party)).

- `android.permission.REORDER_TASKS`: Tencent Ads (优量汇) SDK, used to switch between ad pages and app pages.
- `android.permission.GET_TASKS`: Pangle (穿山甲) advertising SDK, used to determine whether the app is in the foreground.
- `com.google.android.gms.permission.AD_ID`, `com.asus.msa.SupplementaryDID.ACCESS`, `freemme.permission.msa`: the OAID component and the Pangle advertising SDK, used to read advertising identifiers after you agree to the ad service.
- `com.google.android.c2dm.permission.RECEIVE`: Firebase Cloud Messaging, used to receive push messages on devices with Google Play services.
- `android.permission.USE_FINGERPRINT`: AndroidX Biometric component, used to call fingerprint verification on older system versions.
- `com.cityray.aihrplus.vgjx.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION`: AndroidX component, used to protect the App's internal broadcasts from being received by other apps.

In addition, the advertising SDKs also declare permissions such as location, phone state, reading the list of installed apps and installing apps in their components. **The App does not request these permissions for advertising**, but if you have already granted these permissions for other tools, the advertising SDKs may use them within the scope of your authorization after you agree to the ad service.
