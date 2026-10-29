# Voyage 主题壳 — 空房子结构

范围：只反编译主题框架，业务全部搬走。壳 = 房子，业务 = 房里的东西。
壳里必须有的，是主题本身的组件、控件、选项、选项卡、列表、设置项。

## 来源（已验证）
- dex 类：`com.chuanyi.voyage.ui.navigation.ThemeSettingsRoute`（classes6.dex）、
  `ThemeSchemeEditorRoute`（classes7.dex）
- dex 主题库：`com.materialkolor` — DynamicMaterialTheme / DynamicColorScheme /
  DynamicScheme，种子色动态生成 Material3 配色，不是写死 13 套
- resources.arsc 主题文案（原应用字符串，非业务文案）
- 资源表：Theme.Voyage、Theme.Voyage.Starting（760ms、avd_splash_mark）、
  Theme.Voyage.Translucent、Theme.Voyage.Starting.Tint01-13、品牌纸/刃色、
  霞鹜文楷字体

## 1. 主题设置页（ThemeSettings）
- 配色方案列表：13 套 Tint（纸/刃对，昼夜各一套）+ 预设配色 + 自定义配色入口
- 显示模式：跟随系统 / 浅色 / 深色；深色下用纯黑背景（开关）
- 启动画面与图标：启动画面跟随主题（开关）、启动画面使用应用配色与显示模式、
  桌面图标跟随主题（开关）
- 主题色应用：自己的消息使用主题色，关闭时为中性灰（开关，仅主题选项，无消息内容）
- 操作：恢复主题默认值、主题相关设置回到初始状态
- 控件展示：开关、单选、列表项、分割线，全部跟随当前主题

## 2. 主题方案编辑页（ThemeSchemeEditor）
- 配色管理：新建配色、编辑配色、删除配色、预设配色列表
- 配色风格：忠于种子、缤纷，及 MaterialKolor 其他风格（种子色驱动）
- 配色、形状与圆角：圆角大小选项
- 字体：霞鹜文楷、字体大小选项
- 动效：转场动效、背景动效、动效与触感（开关/选项）
- 图标：图标底衬选项
- 所有编辑项只改主题状态，不产生任何业务数据

## 3. 组件展示页（空房子的家具，用来验主题）
- 按钮、卡片、滑块、开关、单选/多选、输入框、选项卡（Tab）、列表、
  Chip、对话框、底部栏，全部用当前 Tint / 显示模式渲染
- 切换 Tint、切换深浅色、切换纯黑、改圆角、改字体大小后，展示页实时跟随

## 4. 主题状态（ThemeStore，只存主题，不存业务）
tint（1-13）、自定义种子色、配色风格、显示模式（跟随系统/浅/深）、
纯黑深色、启动画面跟随主题、桌面图标跟随主题、主题色消息气泡、
圆角、字体大小、动效开关。以上全部持久化，重启后仍生效。

## 5. 完整主题扩展（按 THEME_DEEP_DIVE.md 实施，原值与重建严格区分）

原值（直接从原应用 DEX/ARSC 读出）：
- 13 套 Tint blade/paper、品牌纸/刃色、启动主题与动画、霞鹜文楷文件
- 9 档风格的 Licj0 序号与中文名：0 灵动、1 柔和、2 中性、3 鲜明、4 彩虹、5 缤纷、6 单色、7 忠于种子、8 内容；其中忠于种子 = Fidelity、缤纷 = FruitSalad
- 形状 8 角色名、排版 30 样式结构、7 档形状样式名、色觉模式 9 档名、阴影组与描边等设置项名

算法重建（不是原应用运行时原值，文件头与代码注释均已标注）：
- values/colors_scheme.xml（浅色）与 values-night/colors_scheme.xml（深色）：13 套 Tint × Fidelity/FruitSalad 两档，每档 48 个颜色（含 *_pureblack_surface），共每文件 1344 个颜色；种子 = 白天 blade、对比度 0.0、material-color-utilities（与 MaterialKolor 同源算法）
- 指纹自检通过：Tint01 Fidelity 浅色 primary_container = #A0412E（= 种子），品牌 = #C2513A（= 种子）
- 偏差声明：原应用用 SPEC_2021，本生成库未暴露规格开关，surface 容器系可能有偏差；原应用 §2.4 后处理链（表面色调重建、混色、对比度守卫、纯黑变换）未包含；深色纯黑 surface 为深色 surface 压暗 50% 的重建，不是原纯黑变换，也不是纯 #000000
- 形状基础 dp、排版字号：Material3 库默认值基线，不是 Voyage 原值；7 档形状样式的序号 ↔ 中文名对应未解码，arrays.xml 中的顺序为可配置占位
- 仅 Fidelity（7）与 FruitSalad（5）有完整表；其余 7 档在 UI 中标注“回落忠于种子”，切换时回落到 Fidelity，不得冒充已实现
- 新增：values/themes_scheme.xml（26 个方案主题）、values/shapes.xml、values/typography.xml、values/styles.xml、res/menu/showcase_nav.xml；ThemeStore 扩展（9 档风格默认 7、形状样式、字体族、描边、色觉模式、反转、转场、背景动效、图标底衬、悬浮底栏、液态玻璃、内容取色占位、系统动态色锁定、阴影组）；MainActivity 演示页补齐 9 档风格列表、对话框、开关、列表、导航栏，纯黑时窗口背景取 *_pureblack_surface

View 工程限制、未能实现（原因）：
- 运行时 MaterialKolor 生成：原应用是 Compose 运行时生成，本壳是 View/AppCompat 工程，无 Compose 依赖，故用预生成的静态表等价实现，管线本身（种子 → SPEC_2021 → 后处理 → 动画）未在壳内复刻
- 后处理链、弹簧主题切换动画（animateColorScheme / getDefaultColorSpring）、色觉模式改写矩阵、图标底衬 50 套路径、转场/背景动效时长与插值器：均未解码原值，壳内只保留开关/占位或默认值并标注
- MIUIX 风格线不在壳的目标内，不补

## 不带的东西
小说、音乐、AI 聊天、壁纸、工具箱、账号、广告、支付、消息内容、
歌单、书架等一切业务页面、业务数据、业务网络请求。
