# Voyage Privacy Policy

Version: 7
Last updated: October 22, 2026
Effective date: October 18, 2026

## Introduction

Welcome to the Voyage toolbox (hereinafter "the App" or "Voyage"). The App is operated by an individual developer (brand name: Chuanyi Technology / 川意科技) (hereinafter "we" or "us"). The Android package name of the App is `com.cityray.aihrplus.vgjx`.

We understand how important your personal information is to you. We will process your personal information in accordance with the requirements of the Personal Information Protection Law of the People's Republic of China (《中华人民共和国个人信息保护法》), the Cybersecurity Law of the People's Republic of China (《中华人民共和国网络安全法》), the Data Security Law of the People's Republic of China (《中华人民共和国数据安全法》) and the relevant national standards, following the principles of lawfulness, legitimacy, necessity and good faith.

This Policy explains how we collect, use, store, share and protect your personal information when you use the App, and the rights you have. Before using the App, please read this Policy carefully and make sure you fully understand it, **especially the terms marked in bold**. By tapping "Agree", you confirm that you have read and agree to this Policy; if you do not agree, you may tap "Disagree" and exit the App.

This Policy, together with the following documents, makes up the complete rules for processing personal information. Please read them as well:

- [User Agreement](voyage-legal://terms)
- [Permission List](voyage-legal://permissions)
- [Third-Party Information Sharing List](voyage-legal://third-party)

This Policy covers the following:

1. How we collect and use your personal information
2. Device identifiers and similar technologies
3. How we entrust the processing of, share, transfer and publicly disclose your personal information
4. How we store your personal information
5. How we protect your personal information
6. Your rights
7. Protection of minors' personal information
8. Updates to this Policy
9. How to contact us

## 1. How We Collect and Use Your Personal Information

### (1) Basic Principles

The App is a comprehensive toolbox made up of more than a hundred independent tools. **The vast majority of tools run entirely on your device, and their results are saved only on your device, where we cannot access them.** Information leaves your device only in the following situations:

- You use features that require our servers, such as accounts, membership, points, app updates and announcements;
- The tool you are using itself needs to connect to a third-party service (for example, checking the weather, parsing a link, or calling an AI model you have configured yourself);
- After you agree to the ad service, the advertising SDKs process the relevant information in accordance with their own rules.
- Unless you have turned off usage statistics, the Umeng+ Analytics SDK, the Umeng+ Application Performance Monitoring SDK and Firebase (Google Analytics, Crashlytics, Performance Monitoring) process usage, crash and performance information as described in this Policy.

We process information only to the extent necessary to provide a feature. **For sensitive personal information (such as precise location, biometric-related information, contacts and location history), we will obtain your separate consent when you use the corresponding feature and request authorization through the system permission dialog.** If you refuse authorization, only the corresponding feature will be unavailable; other features are not affected.

### (2) Information Required for App Operation and Security

**1. Basic information in network requests.** When the App communicates with our servers, the servers receive your IP address, the time of the request, and a User-Agent containing the system version and the App version. This information is used to keep network communication working, defend against attacks and troubleshoot problems.

**2. Device information.** To identify devices, protect account security and measure version distribution, the App includes the following device information when it accesses our servers: the device identifier (see Part 2), device model, device name, manufacturer, brand, device codename, operating system name and version, and App version number.

**3. Update checks.** Whether or not you are signed in, the App asks our servers whether a new version is available. When doing so, it provides the App version number, processor architecture, system version, device identifier, device model, and language and region. When you download, install or ignore an update, or when an update fails to install, the App reports the corresponding event so that we can measure the update success rate.

**4. Announcements and notifications.** The App retrieves announcements, notifications and carousel content from our servers. Read status is saved on your device.

**5. Crash records.** When the App crashes, it records on your device the error message at the time of the crash, the call stack, device model, system version, memory status and a recent excerpt of the system log, which you can view in "About → Crash center". **Crash records are not uploaded without your consent.** A record leaves your device in three cases: (1) you choose to export it and send it to someone through system sharing; (2) on the page shown after a crash you tap "Send this report" and confirm again, in which case that one report (the error message and call stack, app version, device model, system version and processor architecture, memory status, actions before the crash and a system log excerpt) is sent to our servers together with your IP address, without your account information, and only the report you confirmed is sent; (3) once you agree to this Policy and have not turned off usage statistics, the App reports to Firebase Crashlytics, once, up to 20 crash records kept on your device from the 30 days before you agreed.

**6. Usage statistics.** After you agree to this Policy, the App uses the Umeng+ Analytics SDK to count launches, usage time, pages visited and tools opened, and processes device identifiers, device and network information, and the app version and channel; after you sign in, this also includes your account number. This information is used to understand how features are used and how versions are distributed, and to improve the product. **It is not used for ad recommendations.** The App also uses the Umeng+ Application Performance Monitoring SDK to collect crashes, freezes (ANR), stutters, startup time, memory usage and network request performance, in order to find and fix faults. The App processes the same kinds of information through Google's Firebase (Google Analytics for Firebase, Firebase Crashlytics and Firebase Performance Monitoring); **this information is processed by Google on servers outside the People's Republic of China, and advertising ID collection is turned off.** On devices with Google Play services, the App receives push messages through Firebase Cloud Messaging; the push token is kept only on your device and by Google. You can turn this off at any time in "Settings → Privacy → Usage statistics". For details, see the [Third-Party Information Sharing List](voyage-legal://third-party).

### (3) Account Services

An account is not required to use the App. You can use the vast majority of tools without registering. If you choose to register or sign in, we will process the following information:

**1. Registration and sign-in.** Depending on the methods enabled by the server, you need to provide an account name and password, or a mobile phone number and an SMS verification code, and you may fill in a nickname, an invitation code and other profile fields shown on the registration page. **Your mobile phone number is used for sign-in, password recovery and account security verification.** Passwords are stored using irreversible bcrypt hashing, so we cannot know your original password. You may also need to complete a graphic CAPTCHA when signing in.

**2. QQ sign-in.** When you choose QQ sign-in, the App uses the Tencent QQ Connect SDK to launch QQ authorization, and sends the OpenID and access token returned by QQ to our servers to complete sign-in or account linking. Our servers use the token to verify your identity with Tencent and read your QQ nickname and avatar, which are shown to you when linking accounts, used as the nickname and avatar of a newly registered account, and filled in when your profile has none; they never overwrite information you have set.

**3. Google sign-in.** When you choose Google sign-in, the App uses Android Credential Manager and Google Play services to show the Google account chooser, and sends the identity token (ID Token) issued by Google to our servers. After verifying the token, our servers read your Google account identifier, name, profile picture URL and email address (only when Google confirms the address is verified) from it, and use them to create, sign in to or link your Voyage account, and to fill in your nickname and avatar when your profile has none. **We do not request access to your Google contacts, Drive, Gmail or any other Google service data, do not use information obtained from Google for advertising, and do not sell or transfer it to third parties.** You can unlink Google at any time in "Account security → Third-party accounts", and you can revoke the App's access in your Google Account settings.

**4. Other sign-in methods.** You can use a passkey, or scan a QR code to sign in on another device. Passkey verification is performed by the system; we receive only the public key and the signature result, and do not receive your fingerprint, face or other biometric information.

**4. Account security.** When you enable two-step verification, we store the authenticator secret and verification data for your recovery codes. Before you enable or disable two-step verification, the App calls the system's biometric or screen lock verification. **Verification is performed by the system, and the App does not obtain any biometric data.** We record your sign-in history and sign-in sessions (including sign-in time, IP address, the approximate location and network carrier inferred from the IP address, and device information) to identify abnormal sign-ins and manage security risks.

**5. Profile.** You may voluntarily fill in or change your avatar, nickname, email address, birthday, bio and contact information. When you upload an avatar, we store the image you choose.

**6. Online status.** After you sign in, the App maintains a real-time connection with the server to receive messages, announcements and changes in account status. Based on this connection, the server counts the number of users online and determines your online status.

**7. Check-ins, points, membership and invitations.** When you use check-ins (including automatic check-ins you enable), points, experience and levels, the points store, membership, redemption codes and invitations, we record the corresponding operation records, point changes and invitation relationships. Some operations include the device identifier to prevent abuse.

**8. Paid services.** When you purchase membership or other services, we create an order and record the product, amount, payment channel, order status and payment time. **Payment is completed on a third-party payment page, and we do not collect sensitive payment information such as your bank card number or payment account password.**

**9. Cloud sync.** After you turn on cloud sync for favorite features, we store the list of tools you have added to favorites.

### (4) Ad Service

The App offers free access to some features through rewarded video ads, and shows one splash ad on the launch screen when it is started from the home screen (not shown to ad-free members). **The ad service requires your separate consent, which is independent of your consent to this Policy.** Only after you agree will the App initialize the Apex advertising SDK and the SDKs of its partner channels. These SDKs may process device identifiers (such as OAID and Android ID), device and network information, app information, ad interaction records, and information within the scope of permissions you have already granted to other features, such as location and phone state, for ad delivery, performance measurement and anti-fraud purposes. **Once you agree, the advertising SDKs enable personalized ad recommendations.** To apply the display frequency of the splash ad and the ad-free membership rule, the App reports the outcome of each splash ad (shown, clicked, failed or timed out, and the loading and display durations) to our server, and keeps the latest ad-free membership verdict and display count on the device under a cryptographic signature.

If you decline the ad service, you can only use basic services, and other features will be unavailable. You can change your choice at any time in "About → Ad services"; after you sign in, your choice is saved to your account. For the names of the SDKs and their processing rules, see the [Third-Party Information Sharing List](voyage-legal://third-party).

### (5) Personal Information Involved in Individual Tools

The following tools process the corresponding information only when you actively use them. Tools not listed do not process personal information, or only process content you enter on your device.

**1. Location.** Tools such as Compass, GPS Test, GPS Speedometer, Photography Assistant, Fuel Prices, Bird Sound Identification, Network Address, and Band Locking and Cell Info obtain your location after you grant permission. **Among them, Compass uses the AMap Location SDK to obtain your location and address; Photography Assistant, weather and sunrise/sunset calculations, road name and speed limit lookups in the speedometer, and region detection in Fuel Prices send coordinates to the corresponding public services (see the third-party list) to obtain results.** After you start recording a trip, GPS Speedometer saves the trip route on your device. The App does not request background location permission; features that need continuous location keep running through a foreground service after you leave the page, and show a notification in the notification bar.

**2. Camera.** Tools such as Heart Rate Monitor, Flicker Detector, Light Meter, Protractor, AR Measure, Photo Counter, Code Scanner, Document Scanner, Food Barcode, Avatar Maker and Hidden Camera Detector use the camera after you grant permission. **The camera feed is processed only on your device and is neither saved nor uploaded.** The exception is Anime Search by Image: the image you select or take is uploaded to trace.moe or AnimeTrace to identify the anime.

**3. Microphone.** Tools such as Sound Meter, Voice Changer, metronome tempo detection, Bird Sound Identification, Voice Todo, Piano and Cooking Mode use the microphone after you grant permission. **Recordings are recognized and analyzed on your device by default.** Voice Todo offers optional cloud recognition and cloud large language models; only after you actively select them in settings are audio and transcribed text sent to the service provider you have configured. Voice input in AI Chat uses the system speech recognition service and is processed by the provider of that system recognition service.

**4. Photos, files and storage.** The App's built-in media picker reads images and videos in your photo library after you grant permission. Features such as File Cleaner, LAN Share, FTP Server, M4S Merge and Magnet Download access storage after you grant permission. **Live Photo Maker reads the shooting location in your photos after you agree, and uses it only to write it into the generated result.** Image Hosting and Smart Cutout upload the images you select to the corresponding services.

**5. Contacts and calendar.** "Set as contact photo" in Avatar Gallery reads the contact you select in the system picker and writes the avatar to it. Voice Todo checks by phone number whether a contact already exists, creates new contacts, and writes recognized events to the system calendar. **These operations take place only when you tap them, and do not read or upload other contacts or events.**

**6. Clipboard.** To make it easier for you to paste links or tracking numbers, **the following tools read the clipboard automatically: Question Search (each time you return to the page), Music Parser, Package Tracking, Apple Serial Number Lookup (when you open the tool), and Video Parser (on Android versions below 12, it reads the content when you open the tool; on Android 12 and above, it only checks whether the clipboard contains text without reading the content).** The floating buttons and quick settings tiles of Slang Dictionary and Question Search read the clipboard when you tap them. Content read from the clipboard is recognized only on your device, and is sent to the corresponding service only after you confirm the query. Other tools read the clipboard only when you tap "Paste".

**7. List of installed apps.** App Manager, File Cleaner, Notification History and the "List apps" tool in AI Chat read the list of apps installed on your device. **This list is used only on your device.** When it is read through AI Chat, the result is sent as part of the conversation to the AI service provider you have configured.

**8. Notification content.** After you turn on "Notification access" in system settings, Notification History records notifications posted by other apps (including titles and body text) so that you can view notifications that have been recalled or cleared. **Notification content is saved only on your device; you can set a retention period and clear it at any time.**

**9. Accessibility service and input method.** After you turn on the accessibility service and the App's input method, Moments Anti-Fold writes the text you prepared into WeChat in segments. **The accessibility service works only within WeChat, and does not collect or upload page content.** When you choose to have AI rewrite your text, the text is sent to the AI service provider you have configured.

**10. Phone state, Wi-Fi and Bluetooth.** SIM Region Changer, Band Locking and Phone Performance Ranking read the carrier, network type, SIM card and cell information after you grant permission. The Network Address tool reads the name of the connected Wi-Fi network, its BSSID, scan results and the addresses of paired Bluetooth devices, and when you look up a vendor, it sends the MAC address being looked up to maclookup.app. Piano scans for nearby Bluetooth MIDI keyboards. **This information is not sent to us.**

**11. Health and motion data.** Heart Rate Monitor measures your fingertip pulse with the camera; Sensor Panel reads the heart rate sensor after you grant permission; and after you turn on "Start automatically in a vehicle", Motion Sickness Relief uses Google Play services to detect whether you have entered a vehicle. **Health-related data is processed and stored only on your device.**

**12. AI Chat.** AI Chat uses the model service providers you configure yourself (such as OpenAI, Anthropic, Google Gemini, DeepSeek, Alibaba Cloud Model Studio (阿里云百炼), Volcano Engine Ark (火山方舟), Zhipu AI (智谱), Moonshot AI (月之暗面), SiliconFlow (硅基流动), OpenRouter, or a compatible endpoint you enter) as well as MCP servers. **Your conversation content, attachments and tool call results are sent directly to the service providers you configure, without passing through our servers.** The built-in tools of AI Chat can read the clipboard, installed apps, device information and files, execute commands, search the web or send network requests; you can turn each of them off individually in settings. The tool that reads your location is off by default. Your API keys are encrypted with the system keystore and saved on your device.

**13. Third-party platform accounts.** Features such as Cloud Drives, video parsing accounts, Online Audiobooks, VALORANT Stats, Chinese Chess and AI Watermark Parser require you to sign in to the corresponding platform. **Your account credentials or sign-in cookies are saved only on your device (sensitive credentials are encrypted with the system keystore) and are sent only to the corresponding platform itself.** Files uploaded to a cloud drive are processed by the corresponding cloud drive provider.

**14. Content parsing, search and online resources.** Tools such as Video Parser, Music Parser, Online Video, Online Novels, Online Comics, Online Audiobooks, Online Music, Question Search and Magnet Search send the links or keywords you enter directly to the corresponding third-party websites or APIs, and these websites receive your IP address and the content of the request. **We do not collect your search history or viewing history; the related history is saved only on your device.**

**15. Root and Shizuku.** Features such as App Manager, SIM Region Changer, Band Locking and reading Android/data perform operations with elevated privileges only after you explicitly grant authorization through a root manager or Shizuku.

**16. Web sign-in and the built-in browser.** Web pages inside the App may request camera, microphone or location permission, and your consent is obtained for every request. Cookies created by web sign-in are saved on your device to keep you signed in to the corresponding websites.

### (6) Exceptions to Obtaining Consent

Under laws and regulations, we may process your personal information without your consent in the following situations:

1. Where it is necessary for the conclusion or performance of a contract to which you are a party;
2. Where it is necessary for the performance of statutory duties or statutory obligations;
3. Where it is necessary to respond to a public health emergency, or to protect the life, health and property of natural persons in an emergency;
4. Where personal information is processed within a reasonable scope for news reporting, public opinion supervision or similar activities carried out in the public interest;
5. Where personal information that you have disclosed yourself, or that has otherwise been lawfully disclosed, is processed within a reasonable scope;
6. Other situations provided for by laws and administrative regulations.

## 2. Device Identifiers and Similar Technologies

**1. Device identifier.** When the App accesses our servers for the first time, it generates a device identifier, saves it on your device, and keeps it unchanged afterwards. It is generated in the following order: if an Open Anonymous Device Identifier (OAID) has already been obtained through the ad service, the OAID is used; otherwise, the Android ID is used; if neither can be obtained, a randomly generated identifier is used. **The device identifier is used only to distinguish your device, protect account security and measure version distribution. We do not use it to build an advertising profile of you.** The device identifier may change after you uninstall and reinstall the App or clear its data.

**2. Local storage.** The App uses databases, preferences and cache files to save your settings, tool data and sign-in status on your device. Account sign-in credentials are encrypted with the system keystore.

**3. Cookies.** Web pages inside the App save cookies as required by the websites. We do not use cookies to track your activity in other apps or websites.

## 3. How We Entrust the Processing of, Share, Transfer and Publicly Disclose Your Personal Information

### (1) Entrusted Processing

Our servers are hosted by a cloud service provider, and Cloudflare provides network acceleration and security protection. We require entrusted parties to process your personal information in accordance with our requirements and this Policy, and to take appropriate security measures.

### (2) Sharing

**We do not sell your personal information.** We do not share your personal information with any third party except in the following situations:

1. With your prior explicit consent;
2. Processing that is necessary for the third-party SDKs integrated into the App to provide their functions; for details, see the [Third-Party Information Sharing List](voyage-legal://third-party);
3. Where a tool you actively use needs to send information to a third-party service; for details, see Part 1 of this Policy and the third-party list;
4. Where required by laws and regulations, litigation, arbitration, or mandatory requirements of administrative or judicial authorities.

We carry out necessary assessments of third-party SDKs, and update the third-party list when an SDK version is updated or a new SDK is added.

### (3) Transfer

We do not transfer your personal information to any third party, except in the following situations:

1. With your prior explicit consent;
2. Where personal information needs to be transferred due to a merger, division, dissolution, declaration of bankruptcy or similar reason, we will inform you of the recipient's name and contact information and require the recipient to continue to fulfill the obligations set out in this Policy; if the recipient changes the original purpose or method of processing, it shall obtain your consent again.

### (4) Public Disclosure

We will publicly disclose your personal information only with your separate consent, or as compelled by laws, regulations or judicial procedures.

## 4. How We Store Your Personal Information

**1. Storage location.** Our servers are hosted by a cloud service provider and accessed through Cloudflare's global network. **Your account information and device information may be stored on, or processed through, servers outside the People's Republic of China.** By agreeing to this Policy, you agree to the cross-border processing described above. We protect your information with measures such as encrypted transmission and access control, and, where required by laws and regulations, will complete the applicable procedures such as a security assessment for outbound data transfer, certification, or standard contracts.

**2. Retention period.** We retain your personal information only for the shortest period necessary to achieve the purposes of processing:

- Account information is retained for as long as your account exists. After you delete your account, we will delete or anonymize it within 15 business days, unless otherwise provided by laws and regulations;
- Sign-in records and sign-in locations inferred from IP addresses are retained for 6 months;
- Orders and transaction records are retained for the periods required by laws such as the E-Commerce Law of the People's Republic of China (《中华人民共和国电子商务法》);
- Network logs are retained for no less than 6 months as required by the Cybersecurity Law of the People's Republic of China (《中华人民共和国网络安全法》);
- Data on your device stays on your device and is deleted when you delete it, clear the App's data or uninstall the App.

**3. Cessation of operations.** If the App ceases operations, we will notify you by announcement or other means at least 30 days in advance, stop collecting personal information, and delete or anonymize your personal information within a reasonable period.

## 5. How We Protect Your Personal Information

1. All communication between the App and our servers is encrypted with HTTPS, and requests are signed or end-to-end encrypted according to the server configuration;
2. Account passwords are stored using irreversible bcrypt hashing;
3. Sign-in credentials, cloud drive credentials and AI keys saved on your device are encrypted with the Android system keystore;
4. We strictly limit the personnel who can access personal information, and log such access;
5. We provide account security features such as two-step verification, sign-in alerts and session management.

No internet environment is 100% secure. If a personal information security incident occurs, we will, as required by laws and regulations, promptly inform you of the basic facts and possible impact of the incident, the measures we have taken or will take, and suggestions on how you can protect yourself and reduce the risks, and will report the incident to the regulatory authorities.

## 6. Your Rights

### (1) Access, Copying and Correction

After you sign in, you can go to your profile page from the "Me" page to view and change your avatar, nickname, email address, mobile phone number, birthday, bio and other information, and manage your password and two-step verification on the account security page. To view your sign-in records, obtain a copy of your personal information, or correct information you cannot change yourself, please contact us using the methods in Part 9.

### (2) Deletion

You can delete data on your device yourself within each tool, or clear the App's data in system settings or uninstall the App to delete all data on your device. You may ask us to delete your personal information in the following situations: the purpose of processing has been achieved or cannot be achieved; we stop providing the service; you withdraw your consent; or we process your personal information in violation of laws, regulations or our agreement.

### (3) Withdrawal of Consent

- **System permissions:** You can turn off any of the App's permissions in system settings at any time;
- **Ad service:** You can withdraw your consent to the ad service in "About → Ad services";
- **Usage statistics:** You can turn this off in "Settings → Privacy → Usage statistics"; once it is off, the App no longer initializes the Umeng+ Analytics SDK or the Umeng+ Application Performance Monitoring SDK, and Firebase stops collecting statistics, crash and performance data;
- **This Policy:** You can withdraw your consent in "About → Withdraw privacy consent". After you withdraw consent, the App will exit, and you will need to agree again the next time you open it in order to continue using it.

Withdrawal of consent does not affect personal information processing carried out based on your consent before the withdrawal.

### (4) Account Deletion

**You can apply to delete your account by sending an email to mikucyll@gmail.com. Please include your account name or the mobile phone number linked to your account in the email.** To protect account security, we may ask you to verify your identity through the linked mobile phone number or other means. We will complete the deletion within 15 business days after verifying your identity. After deletion, your account information, membership benefits, points and virtual items will be deleted and cannot be recovered, except for information that must be retained under laws and regulations.

### (5) Responding to Your Requests

We will reply within 15 business days after receiving your request and verifying your identity. In principle, we do not charge for reasonable requests. We may refuse, with an explanation, requests that are repeated without good reason, require excessive technical means, pose risks to the legitimate rights and interests of others, or are highly impractical.

## 7. Protection of Minors' Personal Information

**Our services are mainly intended for adults. If you are a minor under the age of 18, please read this Policy accompanied by a parent or other guardian, and use the App only after obtaining your guardian's consent. Children under the age of 14 may use the App only after their guardian has read and agreed to this Policy.**

If we discover that we have collected personal information of a child under the age of 14 without prior consent from a guardian, we will delete the relevant information as soon as possible. Guardians with any questions may contact us using the methods in Part 9.

## 8. Updates to This Policy

We may revise this Policy from time to time. **We will not reduce your rights under this Policy without your explicit consent.** When this Policy changes materially (for example, when the purpose of processing, the method of processing, the types of personal information or the recipients of shared information change, or when the way you exercise your rights changes), we will notify you with a dialog when you launch the App, and the new policy will apply after you agree to it again.

You can view the latest version of this Policy in "About → Privacy Policy". The Simplified Chinese version of this Policy prevails; versions in other languages are for reference only.

## 9. How to Contact Us

If you have any questions, comments or suggestions about this Policy, or need to exercise your rights regarding your personal information, please contact us by the following means:

- Operator: an individual developer (brand name: Chuanyi Technology / 川意科技)
- Email: mikucyll@gmail.com

We will reply within 15 business days after receiving your email and verifying your identity. If you are not satisfied with our reply, or believe that our processing of personal information has harmed your legitimate rights and interests, you may file a complaint or report with regulatory authorities such as the cyberspace administration, industry and information technology, public security, and market regulation authorities, or bring a lawsuit before the people's court with jurisdiction at the defendant's place of domicile.
