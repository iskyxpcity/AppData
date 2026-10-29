# Voyage 原应用完整主题 · 深挖报告

> 来源：`~/workspace/voyage_extract/repo/voyage/`（已解包的原应用，14 个 dex、resources.arsc、混淆代码）。
> 方法：androguard（日志已关闭的脚本模式）扫描全部 14 个 dex + dexdump 反向调用者扫描 + resources.arsc 字符串/颜色解析。
> 本报告只写主题，不含业务内容（小说、音乐、AI 聊天、壁纸、工具箱等均不展开）。

## 证据等级说明（全文通用）

| 标记 | 含义 |
|---|---|
| ✅ 原值 | 直接从原应用 DEX 字节码或 resources.arsc 读出的值/名字/映射 |
| 🔁 算法重建 | 按原应用所用算法（MaterialKolor 动态方案）重新算出的等价值，不是原应用运行时的截图值 |
| 🤔 推断 | 有较强间接证据，但未从代码常量处直接读出，壳里实现时须按“可替换默认值”对待 |
| ❌ 未挖到 | 在本次扫描中没有找到原值，报告明确写出，不编造 |

---

## 1. 主题代码定位

### 1.1 Voyage 自己的主题入口（✅ 原值：类名/方法名）

原应用没有一个叫 `VoyageTheme` 的明文类。主题是通过**混淆短名类 + 引用关系**实现的，关键节点如下：

| 作用 | 类 / 方法 | 所在 dex | 证据 |
|---|---|---|---|
| 主题根 composable（整应用包一层） | `Lccj0;` 的方法 `o(...)` | classes.dex | 该方法内依次做：读主题状态 → 生成 ColorScheme → 做动画 → 设系统栏 → 生成 Shapes/Typography → 调 `Lz1i;-><init>(ColorScheme, …)`（即 MaterialTheme 包装） |
| 主题状态（设置页持久化的数据） | `Lycj0;`（`l(...)` 为 copy 方法，25 个参数） | classes.dex / classes6 | 字段包括：显示模式 `Lvbj0;`、种子方案 `Lsbj0;`、风格 `Licj0;`、圆角缩放 `F`、形状样式 `Ljdj0;`、字体/字号、动效开关、色觉模式 `Lfrc;` 等 |
| 种子方案记录 | `Lsbj0;`：`(int index, Integer ×5)` | classes6 | 字段 `l` 为序号，`I/O/o/ll/lI` 为 5 个可空整数；`I()` 方法把 6 个字段拼成字符串（用于持久化） |
| 主题运行时状态 | `Lx3o0;`：`(Z Z Lsbj0; Licj0; D D Z Z Lfrc;)` | classes.dex | `l()` 返回 `max(两个 double)`，即**生效对比度**；字段含种子方案、风格、对比度、深色/纯黑等开关 |
| 方案生成入口 | `Lrtc;` 的 `ll(J Z Lnp50; D)Ljtc;`、`Il(Context, Lx3o0;)Ljtc;`、`II(Context, Lx3o0;)J`、`l(Ljtc; …)Ljtc;`、`lo(Licj0;)Lnp50;` | classes.dex | 见 §2 |
| 色彩辅助函数 | `Ltuc;`：`l(J J F)J`（按比例混色）、`lO(J Z)Lbrc;`（按对比度 ≥ 3.0 选色调）、`I(J J)D`（对比度比值）、`ll(Lsbj0; Licj0;)Lsbj0;` | classes6 | `Ltuc;<clinit>` 内含色调表：浅色方向 10–22，深色方向 96–98 |
| 系统栏跟随 | `Lccj0;` 的 `I(Activity, View, Z, I, Z, …)` 与 `l(Z, J, …)` | classes.dex | 见 §4.3 |

### 1.2 MaterialKolor（✅ 原值：类名/方法名）

| 作用 | 类 / 方法 | 所在 dex |
|---|---|---|
| 动态主题入口 | `com.materialkolor.ktx.DynamicMaterialThemeKt.DynamicMaterialTheme(…)`、带种子变体 `DynamicMaterialTheme-0OstJqQ` / `-bLGS3X0` | classes10 |
| 灵动主题入口 | `DynamicMaterialExpressiveThemeKt.DynamicMaterialExpressiveTheme(…)` 及其变体 | classes10 |
| 主题状态 | `DynamicMaterialThemeStateKt.rememberDynamicMaterialThemeState-CdFb-wI` / `-UQznLDA` | classes10 |
| 动态方案生成 | `DynamicColorSchemeKt.dynamicColorScheme-N98v4SY` / `-onzyBm0`、`rememberDynamicColorScheme-*`、`toColorScheme(…)` | classes10 |
| 方案/色板 | `DynamicSchemeKt.DynamicScheme-dtSySfE`、`toDynamicScheme-KTwxG1Y`、`CorePaletteKt`、`TonalPaletteKt`、`DynamicColorKt`、`MaterialDynamicColorsKt`、`TemperatureKt`、`ContrastKt`、`BlendKt`、`HarmonizeKt`、`ImageBitmapKt`（`rememberThemeColor(s)` / `themeColor(s)`，即内容取色） | classes10 / classes2 / classes5 / classes9 |
| 颜色动画 | `ColorSchemeKt.animateColorScheme`、`ColorKt.getDefaultColorSpring`（弹簧动画）、`darken` / `lighten`、`fixIfDisliked` / `isDisliked`、`toTonalPalette` | classes.dex / classes10 |

调用关系（反向扫描，✅ 原值）：

- `Lvaj;`（classes9）→ `DynamicMaterialTheme`（带状态版）：这是 Voyage 的**普通主题包装 lambda**（编译器生成的 Compose `Function2`，不是手写类名）。
- `Ltaj;`（classes8）→ `DynamicMaterialExpressiveTheme`（带状态版）：这是 Voyage 的**灵动主题包装 lambda**。
- `Lvaj;` 的实例化点：`Lgbz;.OI`、`Lfl60;.l`、`Liwv0;.O`、`Lsrv0;.o`；`Ltaj;` 的实例化点：`Lvjw0;.lI`、`Ljm00;.ll`、`Lxz20;.lI`、`Ljpn0;.Ol`、`Lvhw0;.O`。
- `Ltuc;`（classes6）→ `DynamicColorSchemeKt.toColorScheme$default`；`Lgkh;`（classes6）→ `DynamicColorKt.getColor`；`Lja00;` / `Ly4w0;`（classes7）→ `animateColorScheme`；`Lrtc;`（classes.dex）→ `dynamicColorScheme$default`；`Lccj0;`（classes.dex）→ `animateColorScheme`。
- 路由入口（✅ 原值）：`Lcom/chuanyi/voyage/ui/navigation/ThemeSettingsRoute;`（classes6）、`ThemeSchemeEditorRoute;`（classes7）。这是全 dex 中仅有的两个明文 Voyage 主题类名。

类型解码（✅ 原值，极易搞反，特此写明）：

| 混淆类 | 真实类型 | 证据 |
|---|---|---|
| `Ljtc;` | **ColorScheme** | 构造函数取 **50 个 long 颜色参数**（Material3 Expressive / 2025 规格的角色集，含 surfaceBright、surfaceDim 等新角色）；`l(Ljtc; J×50 …)` 为 copy 方法 |
| `Lahe0;` | **Shapes** | `toString()` 为 `Shapes(extraSmall=, small=, medium=, large=, largeIncreased=, extraLarge=, extralargeIncreased=, extraExtraLarge=)`，8 个 `Lvne;`（CornerSize）字段 |
| `Ldal0;` | **Typography** | 30 个 `Lhaj0;`（TextStyle）字段；`toString()` 顺序为 displayLarge/Medium/Small、headlineLarge/Medium/Small、titleLarge/Medium/Small、bodyLarge/Medium/Small、labelLarge/Medium/Small，之后是对应的 `*Emphasized` 变体 |
| `Lxaj;` | **DynamicMaterialThemeState** | 构造函数 `(J Z Z Lnp50; D Lcuc; Lhbj; Lbrc×6 Function2;)`：种子、深色、动画开关、风格、对比度、规格、平台、6 个色板 State |
| `Lbrc;` | 色板包装（单个 long 颜色字段 `l`） | 构造 `(J)` |
| `Lnp50;` | **PaletteStyle**（见 §2.2） | `<clinit>` 声明顺序见下 |
| `Lcuc;` | **ColorSpec** 枚举 | `SPEC_2021`（字段 `O`，序号 0）、`SPEC_2025`（字段 `o`，序号 1） |
| `Libj;` | DynamicScheme | `DynamicScheme-dtSySfE` 的返回值 |
| `Lxvo;` | HCT | 字段为 hue/chroma/tone 的 double |

### 1.3 MaterialKolor 版本（❌ 未挖到）

DEX 中**没有** MaterialKolor 的版本号字符串；jadx 元数据只写 `MaterialKolor:material-kolor`、Kotlin 元数据版本 2.4.0。本报告**不宣称**具体版本号。壳里应直接依赖 MaterialKolor 库本身（与原应用同算法），而不是抄版本号。

---

## 2. 完整 ColorScheme

### 2.1 生成算法（✅ 原值：调用链）

```
用户主题状态 Lycj0
  → 运行时状态 Lx3o0（种子方案 Lsbj0 + 风格 Licj0 + 对比度 = max(两个 double)）
  → Lrtc.Il(Context, Lx3o0) → ColorScheme Ljtc
      ├─ Lrtc.II(Context, Lx3o0) → 种子色 long
      │    ├─ 系统动态色分支（SDK ≥ 31/34 时从主题 2131953302 取系统色）
      │    └─ 否则取 Lsbj0.O() 的 int 种子色
      ├─ Lrtc.ll(seed, isDark, variant, contrast) → dynamicColorScheme
      │    └─ DynamicColorSchemeKt.dynamicColorScheme-N98v4SY$default：
      │         6 个色板（primary/secondary/tertiary/neutral/neutralVariant/error）全部传 null/0，
      │         即由种子色自动推导；spec = Lrtc.l（见下）；platform/transform = null
      └─ Lrtc.l(ColorScheme, …) → 后处理（见 §2.4）
  → Lshw0.lI(ColorScheme, Z, Z)（两个布尔开关，作用未解码，见 §2.4）
  → ColorSchemeKt.animateColorScheme（主题切换时颜色弹簧动画，见 §4.1）
  → 交给 Lccj0.o 的 MaterialTheme 包装（Lz1i）
```

**默认规格（✅ 原值）：`Lrtc;<clinit>` 置 `Lrtc.l = Lcuc.O`，即 `SPEC_2021`。** 原应用默认按 2021 规格生成方案，不是 2025 规格。壳里若用 MaterialKolor，必须显式指定 `SPEC_2021`，否则 surface 容器色调等角色会与原应用有系统性偏差。

**种子色（🤔 强推断，未从常量处直接读出）：Tint 的 blade 色。** 理由：① 13 套 Tint 在资源层只有 blade/paper 两组颜色，blade 是每套唯一的深色强调色；② 品牌色同样以 blade（`#FFC2513A`）为标识色；③ 方案编辑器提供色相/彩度/明度（`theme_editor_hue` / `chroma` / `tone`）和色值（`theme_editor_hex`）编辑，即用户编辑的是“一个种子色”。但 `Lsbj0` 的 5 个整数中哪一个是种子、其余 4 个是何种覆盖色，**未解码**（见 §5），所以“种子 = blade”在报告中定为强推断而非原值。

**对比度（✅ 原值：机制）：** 生效对比度 = `Lx3o0.l()` = `max(两个 double)`；另有系统对比度分支 `Lrtc.lI(Context)`：SDK ≥ 34 时读 `UiModeManager.getContrast()` 并钳制到 0–1。也就是说原应用的对比度同时受“用户设置”和“系统无障碍对比度”影响。

### 2.2 配色风格：9 种，中文名与算法的完整对应（✅ 原值）

`Licj0`（Voyage 自己的风格枚举，9 值，名字经 `Li6t0.lO(J)` 加密，DEX 中读不出中文名）→ `Lnp50`（MaterialKolor PaletteStyle）的映射，是从 `Lrtc.lo` 的 packed-switch 原始字节解出的：

- switch 标识 `0x0100`、大小 9、首键 0、目标偏移 `[0x20, 0x1d, 0x1a, 0x17, 0x14, 0x11, 0x0e, 0x0b, 0x08]`，switch 位于代码单元 `0x000f`；
- `Lnp50` 的 `<clinit>` 声明顺序：0 `l` = TonalSpot、1 `I` = Neutral、2 `O` = Vibrant、3 `ll` = Rainbow、4 `lI` = FruitSalad、5 `lO` = Monochrome、6 `lo` = Fidelity、7 `Il` = Content——注意：这是**该 dex 的声明顺序**，与公开 MaterialKolor 文档的枚举书写顺序不同，本报告以 dex 为准；
- 逐项解码后 `Licj0` 序号 → MaterialKolor 风格，再对照 resources.arsc 的中文字符串（`settings_palette_style_*`，简体中文值）：

| Licj0 序号 | MaterialKolor PaletteStyle | 设置页中文名（✅ 原值，ARSC） | 风格特点（算法含义） |
|---|---|---|---|
| 0 | Expressive | 灵动 | 高对比、多色扩展 |
| 1 | TonalSpot | 柔和 | 默认柔和算法 |
| 2 | Neutral | 中性 | 低彩度 |
| 3 | Vibrant | 鲜明 | 高彩度 |
| 4 | Rainbow | 彩虹 | 彩虹色扩展 |
| 5 | FruitSalad | **缤纷** | 多色、水果沙拉式对比 |
| 6 | Monochrome | 单色 | 单色 |
| 7 | Fidelity | **忠于种子** | 容器色贴近种子本身，见 §2.3 的 `primary_container = 种子色` 特征 |
| 8 | Content | 内容 | 内容取色相关 |

**关键纠正：** 壳里现有的“0 = 忠于种子、1 = 缤纷”只是壳自己的两档开关，**不是**原应用的风格枚举。原应用有 9 档；其中：

- **“忠于种子” = Fidelity（`Licj0` 序号 7）**，不是 TonalSpot；
- **“缤纷” = FruitSalad（`Licj0` 序号 5）**，不是 Vibrant。

此前若按“TonalSpot / Vibrant”去实现这两档，算出的 primary/secondary/tertiary 会系统性偏离原应用（对比见 §2.3 末尾的风格对照表）。

### 2.3 方案样本（🔁 算法重建，非原值）

**重建方法（必须先读，否则会误把下表当原值）：**

- 工具：`material-color-utilities`（Python 版，与 MaterialKolor 同源的 Google 动态取色算法），`theme_from_argb_color(seed, contrast_level=0.0, variant)`；
- 种子：浅色/深色共用**白天 blade**（与原应用“一个种子 + isDark 开关”一致）；深色表的种子**不是**夜间 blade（夜间 blade/paper 只是启动画面与图标预览用的两组颜色，见 §2.5）；
- 对比度 0.0（原应用默认档；系统对比度分支会再调整）；
- **偏差声明：** 该 Python 库的当前版本未标注其默认规格，原应用用 `SPEC_2021`；因此下表的 primary/secondary/tertiary 大方向可信，**surface 容器系（surface_container_*、surface_dim/bright）的具体色调可能与原应用 SPEC_2021 的输出有偏差**。壳里正确的做法是运行时调用 MaterialKolor（SPEC_2021）生成，而不是把下表硬编码成静态 colors.xml。
- 原应用的后处理（§2.4：表面色调重建、混色、对比度守卫、纯黑）**未包含**在下表中；下表是“MaterialKolor 裸输出”，深色/纯黑档的最终 surface 还要经过后处理。

**品牌色（种子 `#FFC2513A`，Fidelity，🔁 重建）：**

| 角色 | 浅色 | 深色 |
|---|---|---|
| primary | #a13925 | #ffb4a4 |
| on_primary | #ffffff | #640c00 |
| primary_container | #c2513a | #c2513a |
| on_primary_container | #fffcff | #fffcff |
| secondary | #884f43 | #feb5a5 |
| on_secondary | #ffffff | #502319 |
| secondary_container | #feb5a5 | #6e3b30 |
| on_secondary_container | #7a4438 | #eea798 |
| tertiary | #944600 | #ffb689 |
| on_tertiary | #ffffff | #512300 |
| tertiary_container | #ba5900 | #ba5900 |
| on_tertiary_container | #fffbff | #fffbff |
| error | #ba1a1a | #ffb4ab |
| on_error | #ffffff | #690005 |
| error_container | #ffdad6 | #93000a |
| on_error_container | #93000a | #ffdad6 |
| surface | #fff8f6 | #1b110f |
| on_surface | #241917 | #f3deda |
| surface_variant | #fbdcd5 | #57423d |
| on_surface_variant | #57423d | #dec0ba |
| surface_dim | #ead5d1 | #1b110f |
| surface_bright | #fff8f6 | #433633 |
| surface_container | #ffe9e5 | #281d1b |
| surface_container_low | #fff0ee | #241917 |
| surface_container_high | #f9e4df | #332725 |
| surface_container_highest | #f3deda | #3f322f |
| surface_container_lowest | #ffffff | #160c0a |
| inverse_surface | #3a2d2b | #f3deda |
| inverse_on_surface | #ffede9 | #3a2d2b |
| inverse_primary | #ffb4a4 | #a43b26 |
| outline | #8b716c | #a68b85 |
| outline_variant | #dec0ba | #57423d |

**Tint01（种子 `#FFA0412E`，Fidelity，🔁 重建）：**

| 角色 | 浅色 | 深色 |
|---|---|---|
| primary | #812a19 | #ffb4a5 |
| on_primary | #ffffff | #611305 |
| primary_container | #a0412e | #a0412e |
| on_primary_container | #ffcfc5 | #ffcfc5 |
| secondary | #845147 | #f9b7a9 |
| on_secondary | #ffffff | #4e251c |
| secondary_container | #ffbcae | #6b3d33 |
| on_secondary_container | #7a493f | #e9a99c |
| tertiary | #763500 | #ffb68a |
| on_tertiary | #ffffff | #522300 |
| tertiary_container | #9a4801 | #9a4801 |
| on_tertiary_container | #ffd1b7 | #ffd1b7 |
| error | #ba1a1a | #ffb4ab |
| on_error | #ffffff | #690005 |
| error_container | #ffdad6 | #93000a |
| on_error_container | #93000a | #ffdad6 |
| surface | #fff8f6 | #1a110f |
| on_surface | #231917 | #f2deda |
| surface_variant | #fadcd6 | #56423e |
| on_surface_variant | #56423e | #ddc0bb |
| surface_dim | #e9d6d2 | #1a110f |
| surface_bright | #fff8f6 | #423634 |
| surface_container | #fdeae6 | #271d1b |
| surface_container_low | #fff0ee | #231917 |
| surface_container_high | #f7e4e0 | #322725 |
| surface_container_highest | #f2deda | #3e3230 |
| surface_container_lowest | #ffffff | #150c0a |
| inverse_surface | #392e2b | #f2deda |
| inverse_on_surface | #ffede9 | #392e2b |
| inverse_primary | #ffb4a5 | #9f402d |
| outline | #89726d | #a48b86 |
| outline_variant | #ddc0bb | #56423e |

**Tint13（灰，种子 `#FF555555`，Fidelity，🔁 重建）：**

| 角色 | 浅色 | 深色 |
|---|---|---|
| primary | #3e3e3e | #c8c6c6 |
| on_primary | #ffffff | #303030 |
| primary_container | #555555 | #555555 |
| on_primary_container | #cbcac9 | #cbcac9 |
| secondary | #5f5e5e | #c8c6c5 |
| on_secondary | #ffffff | #313030 |
| secondary_container | #e2dfde | #474746 |
| on_secondary_container | #636262 | #b7b4b4 |
| tertiary | #3e3e3f | #c7c6c7 |
| on_tertiary | #ffffff | #303031 |
| tertiary_container | #555556 | #555556 |
| on_tertiary_container | #cbcacb | #cbcacb |
| error | #ba1a1a | #ffb4ab |
| on_error | #ffffff | #690005 |
| error_container | #ffdad6 | #93000a |
| on_error_container | #93000a | #ffdad6 |
| surface | #fcf8f8 | #141313 |
| on_surface | #1c1b1b | #e5e2e1 |
| surface_variant | #e0e3e3 | #444748 |
| on_surface_variant | #444748 | #c4c7c7 |
| surface_dim | #ddd9d8 | #141313 |
| surface_bright | #fcf8f8 | #3a3939 |
| surface_container | #f1edec | #201f1f |
| surface_container_low | #f7f3f2 | #1c1b1b |
| surface_container_high | #ebe7e7 | #2a2a2a |
| surface_container_highest | #e5e2e1 | #353434 |
| surface_container_lowest | #ffffff | #0e0e0e |
| inverse_surface | #313030 | #e5e2e1 |
| inverse_on_surface | #f4f0ef | #313030 |
| inverse_primary | #c8c6c6 | #5e5e5e |
| outline | #747878 | #8e9192 |
| outline_variant | #c4c7c7 | #444748 |

**风格对照（Tint01，🔁 重建，同一颗种子换风格时 primary/secondary/tertiary 的变化）：**

| 风格 | 浅色 primary / secondary / tertiary / surface | 深色 primary / secondary / tertiary / surface |
|---|---|---|
| TonalSpot（柔和） | #904b3d / #775750 / #6e5c2e / #fff8f6 | #ffb4a5 / #e7bdb4 / #dcc48c / #1a1110 |
| Vibrant（鲜明） | #b91e00 / #80543b / #825521 / #fff8f6 | #ffb4a5 / #f3ba9c / #f7bb7e / #1e100d |
| Expressive（灵动） | #445c99 / #57633a / #3c6842 / #fff8f6 | #b2c5ff / #bfcc9b / #a2d2a4 / #1c110c |
| Fidelity（忠于种子） | #812a19 / #845147 / #763500 / #fff8f6 | #ffb4a5 / #f9b7a9 / #ffb68a / #1a110f |
| FruitSalad（缤纷） | #8e437d / #834c74 / #904b3d / #fff8f6 | #fface7 / #f6b2e0 / #ffb4a5 / #1e100d |

注意 Fidelity 的特征：浅色/深色的 `primary_container` 与 `tertiary_container` 直接等于种子色本身（Tint01 为 `#a0412e`，品牌为 `#c2513a`，Tint13 为 `#555555`），这是“忠于种子”的算法指纹，壳里可用它自检风格映射是否正确。

### 2.4 深色与纯黑的后处理（✅ 原值：机制；❌ 未完全解码：角色对应）

`Lrtc.l(ColorScheme, …)`（约 1000 条指令，**只部分解码**，不得当作已完全还原）：

1. **表面色调重建分支（✅ 原值：色调数值）：** 取方案 surface 的 HCT（`Ljtc.Oo`），经 `Lrtc.IO(HCT, tone, double)` 在色调 **97、99、82、100、94、91、88、85** 处重建一组 surface 相关角色。这是深色档 surface 偏离 MaterialKolor 裸输出的主要来源，也是纯黑分支的候选位置——但**具体哪个色调对应哪个 surface 角色（surface / surface_container / surface_dim 等），未逐项标定**。
2. **混色分支（✅ 原值：系数）：** 经 `Lrtc.lO(long, float)` 对不同角色做混色，解出的系数为 **0.3f、0.1f、0.5f、0.2f**（常量 `1050253722`、`1036831949`、`1056964608`、`1045220557`）。角色与系数的配对未逐项标定。
3. **对比度守卫分支（✅ 原值：掩码常量）：** 经 `Lrtc.o(J J J J)Z` 判断角色对的对比度是否达标，不达标则互换，掩码常量含 `-4`、`-13`、`-97`、`-385`、`-1537`、`-6145`、`-12582913`、`-50331649`。
4. **纯黑分支（🤔 推断，未证实）：** 方法末尾调用 `Lh7t0.lOO(ColorScheme, Lfrc;)`，并在条件分支下调用 `Lh7t0.lOl(ColorScheme;)`；后者是纯黑变换的最可能候选，但**未证实**。另在 `Lccj0.o` 中，`Lrtc.Il` 生成的方案还会经过 `Lshw0.lI(ColorScheme, Z, Z)`，两个布尔参数的作用**未解码**（可能是深色/纯黑开关，也可能是其他开关，不得断言）。
5. **色觉模式（✅ 原值：存在性 + 选项名）：** `Lfrc;` 为色觉模式类型；ARSC 选项：关闭、全色盲、全色弱、红色盲、红色弱、绿色盲、绿色弱、蓝色盲、蓝色弱（`theme_color_blind_*`）。色觉模式参与 `Lx3o0` 与 `Lh7t0.lOO` 的参数，说明它在方案生成后还会改写颜色——具体改写矩阵**未挖到**。

结论：深色/纯黑**不是**“把 surface 换成 `#000000`”那么简单。原应用的做法是：MaterialKolor 深色方案 → 表面色调重建（97/99/82/100/94/91/88/85）→ 混色 → 对比度守卫 →（疑似）纯黑变换。壳里若只做 `values-night` 静态色，会丢掉这一整条后处理链。

### 2.5 Tint blade/paper 与启动画面的关系（✅ 原值）

13 套 Tint 的白天/夜间 blade/paper（已在壳 `values/colors.xml` 与 `values-night/colors.xml` 中，✅ 原值，摘录首尾两套作对照）：

| 套 | 白天 blade / paper | 夜间 blade / paper |
|---|---|---|
| Tint01 | `#FFA0412E` / `#FFFDF4F2` | `#FFF9AF9F` / `#FF181211` |
| Tint13（灰） | `#FF555555` / `#FFF7F7F7` | `#FFD1D1D1` / `#FF141414` |
| 品牌 | `#FFC2513A` / `#FFF4EFE9` | `#FFE07A5F` / `#FF1C1714` |

另有**另一组** `launch_tint_XX_icon_blade/paper`（启动器图标预览用），数值与上表**略有不同**，两组不得混用。启动画面本身（`Theme.Voyage.Starting.TintXX.Light/.Dark`）用的是上表的 blade/paper，见已交付的壳与 `VOYAGE_THEME.md`。

---

## 3. 形状与字体排版

### 3.1 Shapes：不是固定 dp，是“基础形状 × 样式 × 缩放”（✅ 原值：机制）

`Lccj0.o` 生成 Shapes 的真实流程：

```
基础 Shapes = Lmfe0.l（静态单例，Material3 默认形状）
形状样式 Ljdj0 + 圆角缩放 F（来自 Lycj0.lI()，即设置项“圆角大小”）
  → Lyge0 = Lmeu0.ll(Ljdj0, F)
  → 8 个角色逐一变换：Lmfe0.l(CornerSize, Lyge0)
  → 新 Lahe0（8 个 CornerSize）
```

- `Ljdj0`（classes5）为枚举，**7 个值**（字段 `l/I/O/o/ll/lI/lO`），与 ARSC 的 7 个形状样式名对应（`theme_shape_*`，✅ 原值）：**圆角、切角、超椭圆、平滑、波浪、内凹、缺口**。但 7 个枚举值的**序号与中文名的对应关系未解码**（名字不在 DEX 明文里），壳里不得按猜测的顺序硬编码，必须以设置页实际呈现的顺序为准或做成可配置映射。
- `Lmeu0.ll` 的实现是按 `Ljdj0` 序号 switch，返回 7 个 CornerSize 工厂之一：`Lrge0;` / `Ltge0;` / `Lwge0;` / `Luge0;` / `Lvge0;` / `Lqge0;` / `Lsge0;`，每个只持有一个 float `F`（圆角缩放），即**样式决定形状类型，F 决定大小**。
- 基础 Shapes 的 8 个角色（✅ 原值，来自 `Lahe0.toString()`）：extraSmall、small、medium、large、largeIncreased、extraLarge、extralargeIncreased、extraExtraLarge。这是 Material3 Expressive 的 8 角色形状体系，不是旧版 5 角色。
- 基础 dp 值（🤔 推断，取自 Material3 库默认值，**不是** Voyage 的定制值）：extraSmall 4dp、small 8dp、medium 12dp、large 16dp、extraLarge 28dp；largeIncreased、extralargeIncreased、extraExtraLarge 为 Expressive 新增档，须以壳所用 Material3 版本的库值为准。Voyage 的定制不在“基础 dp”里，而在“样式 × 缩放”的变换里——所以壳里抄一组静态圆角值是错的，必须实现“基础形状 + 样式 + 缩放”三层。

### 3.2 Typography：30 个样式，字体族 + 字号缩放（✅ 原值：机制；❌ 未挖到：具体 sp/字重/行高）

`Lccj0.o` 生成 Typography 的流程：

```
基础 Typography = Lz7l0.l（静态单例，Material3 默认排版）
30 个 TextStyle 逐一变换：Lsa30（参数：字体族对象 + 布尔开关）
  → 新 Ldal0（30 个 TextStyle）
```

- 30 个样式 = 15 个角色 + 各自的 Emphasized 变体（✅ 原值，见 §1.2 的 `Ldal0` 字段顺序）：displayLarge/Medium/Small、headlineLarge/Medium/Small、titleLarge/Medium/Small、bodyLarge/Medium/Small、labelLarge/Medium/Small，及 displayLargeEmphasized … labelSmallEmphasized。
- 字体族注册（✅ 原值）：`Lgmm` 的 `<clinit>` 含字符串 `FontFamily.SansSerif`、`FontFamily.Serif`、`FontFamily.Monospace`、`FontFamily.Cursive`；设置页字体选项（✅ 原值，ARSC）：`settings_font_family_title` = 字体，选项含 默认、衬线，另有 `settings_font_scale_title` = 字体大小（缩放因子）。即原应用的字体机制是“**字体族选择 + 字号缩放**”，不是为每个角色手写一套 sp。
- 每个角色的**具体 sp、字重、行高数值（❌ 未挖到）**：基础 Typography 的默认构造函数（`Ldal0.<init>()`）是用 `Lhjh0.Oo(I)J` / `OO(D)J` 等 helper 从默认值算出的，数值常量未逐项解码；且 `Lsa30` 的变换细节（缩放是否作用于字号、行高是否等比、布尔开关的含义）也未完全解码。**不得**把 Material3 默认排版数值直接说成 Voyage 的原值；壳里应先以 Material3 默认排版为基线，再接“字体族 + 缩放”变换，并标注为重建。
- 霞鹜文楷（🤔 推断 + ❌ 未挖到绑定方式）：原应用 assets 唯一字体文件为 `assets/fonts/LXGWWenKaiGB-Regular.ttf`（约 25 MB，霞鹜文楷 GB，OFL）。但 DEX 字符串中**没有**该文件名或路径，ARSC 中也没有 font 资源项，因此字体族与该文件的**具体绑定方式（资源 ID / 文件加载 / 默认字体族替换）未追踪到**。壳里现有的“res/font + fontFamily”做法是合理的重建，不是已证实的原绑定方式。

### 3.3 组件级样式（❌ 未挖到原值，机制已确认）

Button、Card、Switch、Slider、Dialog、NavigationBar、List、Chip 等组件在 Voyage 里**没有**逐组件手写的圆角/高度/颜色/阴影常量（本次扫描未发现任何 per-component 样式表）。机制上它们是：

1. **Compose Material3 默认组件**（颜色取动态 ColorScheme 角色，形状取 §3.1 的 Shapes，排版取 §3.2 的 Typography）；
2. **叠加两层 Voyage 设置**（✅ 原值，ARSC 设置项名）：
   - 界面风格：`theme_design_material3_subtitle` = “Google Material You 设计，可自定义形状、开关与滑条样式、阴影和描边”；另有 MIUIX 风格（HyperOS 风格界面，开关、滑条、按钮、对话框、顶栏与列表改用 MIUIX 组件）——**壳的目标是 Material3 线，MIUIX 线不在本次任务范围内**，不得把 MIUIX 组件样式抄进壳；
   - 阴影开关组：`theme_group_shadows` = 阴影，下设 顶栏、按钮、容器、悬浮按钮、滑条、开关（`theme_shadow_*`）；
   - 描边粗细：`theme_border_width_title` = 描边粗细；
   - 导航栏：悬浮底栏（`theme_floating_nav_bar_title`，底部导航栏悬浮在页面之上，仅窄屏底部导航生效）、液态玻璃（`theme_liquid_glass_title`，需 Android 13+，需先开悬浮底栏，悬浮底栏折射并模糊后面内容，按住选中项可左右拖动切换）。

因此组件样式的正确还原方式不是“抄数值”，而是：**动态 ColorScheme + 变换后 Shapes/Typography + 阴影/描边开关**，再在组件展示页逐项与原应用对照。任何“Voyage 的 Button 圆角是 X dp”之类的具体数值，在本次扫描中**均未找到**，不得写入壳当作原值。

---

## 4. 动效与图标

### 4.1 主题切换动效（✅ 原值：机制）

- `ColorSchemeKt.animateColorScheme` 在三处被调用：`Lccj0.o`（主题根）、`Lja00;`、`Ly4w0;`（classes7）。即**主题色变化时不是跳变，而是动画过渡**。
- 动画弹簧来自 `ColorKt.getDefaultColorSpring`（`Lja8;` 调用）。弹簧的具体刚度/阻尼数值**未解码**，不得编造。
- 另有 `ColorKt.darken` / `lighten`、`fixIfDisliked` / `isDisliked`：对“用户不喜欢”的颜色做修正（MaterialKolor 的 dislike 修正），属于方案生成的一部分，不是界面动效。

### 4.2 启动动画（✅ 原值，已在壳中）

- `Theme.Voyage.Starting`：父主题 `Theme.SplashScreen`，`postSplashScreenTheme = Theme.Voyage`，动画图标 `drawable/avd_splash_mark`，时长 **760 ms**，背景 `color/splash_background`。
- 图标：108×108 视口、288dp、四叶风车（`blades` 组，轴心 54,54，`pin` 圆半径 2.8）；动画 `splash_blades_spin`：旋转 **−540° → 0°（760 ms）**，缩放 **0.86 → 1（420 ms）**。
- 着色版 `avd_splash_mark_tinted`：叶片用 `?attr/launchTintBlade`，圆点用 `?attr/launchTintPaper`。

### 4.3 转场动效、背景动效、图标底衬、系统栏跟随

**转场动效（✅ 原值：选项名；❌ 未挖到：时长/插值器）：**

- ARSC：`settings_navigation_motion_title` = 转场动效，选项 `settings_navigation_motion_expressive` = 灵动、`settings_navigation_motion_reduced` = 简化。另有 `music_ambient` = 背景动效（该字符串属音乐相关上下文，主题设置里的“背景动效”对应字符串在本次扫描中未单独定位，不得混淆）。
- 转场动效在代码里的具体实现（时长、easing、页面切换动画类型）**未定位**，不得编造数值。

**背景动效（❌ 未挖到）：** 除字符串名外，未在主题代码路径中找到背景动效的实现参数。

**图标底衬（✅ 原值：选项名 + 机制线索）：**

- ARSC：`theme_icon_shape_title` = 图标底衬，选项 `theme_icon_shape_none` = 无、`theme_icon_shape_random` = 随机。结合 AlohaOneUI 侧的已知信息（图标形状预设 0–49、Random = 50、None = −1）可知原应用的图标底衬是一套**形状预设体系**，但原应用的 50 套形状路径数据（vector path）在本次扫描中**未挖出**——它们不在主题根 `Lccj0.o` 里，应在启动器图标生成代码中，需另行专项扫描。壳里现阶段不得声称已还原图标底衬。
- 另有 `theme_icon_follows_title` = 桌面图标跟随主题（副标题：退到后台后生效，部分桌面会移动图标位置）、`theme_launch_follows_title` = 启动画面跟随主题。两者在壳的 ThemeStore 中已有开关（`icon_follow_theme`、`splash_follow_theme`），与原应用对应。

**状态栏 / 导航栏颜色跟随（✅ 原值：机制，角色未解码）：**

- `Lccj0.I(Activity, View, Z, I, Z, …)`：用 `WindowInsetsControllerCompat.setAppearanceLightStatusBars(Z)` / `setAppearanceLightNavigationBars(Z)` 设浅色栏图标，`Window.setNavigationBarContrastEnforced(Z)`、`setNavigationBarColor(I)`、`setNavigationBarDividerColor(I)`、`setBackgroundDrawable(ColorDrawable)` 设导航栏色与背景。
- `Lccj0.l(Z, J, …)`：在主题根中被调用，传入的 long 参数取自 `ColorScheme` 的 `OI` 字段（即方案中的某一个颜色角色，**字段到角色的映射未解码**，不得说成 surface 或 background）。
- 结论：原应用的系统栏是**跟随动态方案颜色**的，不是固定色；壳里应实现“系统栏颜色 = 当前方案的同一角色色 + 浅色/深色图标切换”，并以 `Lccj0.I/l` 的调用结构为准。

**其他主题设置项（✅ 原值，ARSC，壳里缺失的须补进 §5 清单）：**

- 显示模式：跟随系统 / 浅色 / 深色（`settings_theme_mode_*`）；深色下用纯黑背景（`settings_pure_black_subtitle`，注意：该字符串在 ARSC 中是 subtitle 项，壳里已有 `pure_black` 开关与之对应）。
- 主题色消息气泡（`ai_accent_bubble`）：是否用主题色渲染消息气泡，壳里已有 `bubble_theme_color` 开关。
- 恢复主题默认值（`settings_reset_theme_title`，副标题：主题相关设置回到初始状态），壳里已有 `resetToDefaults()`。
- 内容取色（`theme_content_colors_title`，副标题：播放与阅读页面按封面配色）：即 MaterialKolor 的 `ImageBitmapKt.rememberThemeColor(s)` / `themeColor(s)`（见 §1.2），壳是“空房子”，无内容页面，此项在壳里应只保留开关/占位，不得引入业务页面。
- 反转颜色（`theme_invert_title`）、色觉模式（见 §2.4）、系统动态色开启时不可用（`theme_dynamic_locked`，即跟随系统壁纸取色时锁定手动方案选择）。

---

## 5. 结论：现有壳缺什么（按优先级排序）

### P0 —— 没有这些，就不是完整主题

1. **运行时动态方案生成，而不是静态 colors.xml。**
   现有壳把 13 套 Tint 的 blade/paper 映射到 `colorPrimary` / `colorSurface`，丢掉了 secondary、tertiary、surfaceVariant、outline、error 及全部 on* 角色和 surface 容器系。下一步：在壳中引入 MaterialKolor（或等价动态取色实现），按 `Lrtc.ll` 的结构实现 `seed（Tint blade）+ isDark + variant + contrast + SPEC_2021 → ColorScheme`，并在主题根复刻 `Lccj0.o` 的调用顺序（生成 → 后处理 → 动画 → 系统栏 → Shapes/Typography）。
2. **9 档配色风格，修正两档映射。**
   壳现有 `scheme_style` 只有 0/1 两档，且含义与原应用不符。下一步：扩展为 9 档（序号与 §2.2 的 `Licj0` 序号一致），并确保“忠于种子 = Fidelity（序号 7）”、“缤纷 = FruitSalad（序号 5）”；用 §2.3 的 Fidelity 指纹（`primary_container = 种子色`）做自检。
3. **深色/纯黑后处理链。**
   现有壳只有 `values-night` 静态色。下一步：实现 §2.4 的表面色调重建（97/99/82/100/94/91/88/85）、混色（0.3/0.1/0.5/0.2）、对比度守卫，并把纯黑分支（`Lh7t0.lOl` 候选）与 `Lshw0.lI` 的两个布尔开关的含义作为待解码项单独攻关，不得先以“surface = #000000”冒充。

### P1 —— 形状与排版体系

4. **Shapes 三层结构。**
   新增 `Shapes` 生成代码：基础 8 角色（Material3 Expressive）→ 形状样式（7 档：圆角/切角/超椭圆/平滑/波浪/内凹/缺口，序号与中文名对应关系待标定）→ 圆角缩放（设置项“圆角大小”）。废弃“每套 Tint 一组静态圆角”的思路。
5. **Typography 三层结构。**
   新增 `Typography` 生成代码：基础 30 样式（15 角色 + Emphasized）→ 字体族选择（默认/衬线/等宽等，`Lgmm` 注册表）→ 字号缩放（设置项“字体大小”）。霞鹜文楷文件继续随壳附带，但须标注其绑定方式为重建（见 §3.2）。
6. **组件展示页升级。**
   现有展示页只有卡片/滑条/Chip/按钮。下一步：按原应用设置分组补齐展示项——按钮、卡片、开关、滑条、对话框、导航栏（普通 + 悬浮底栏）、列表、Chip，并接阴影开关组（顶栏/按钮/容器/悬浮按钮/滑条/开关）与描边粗细开关；颜色全部取动态方案角色，形状全部取变换后 Shapes，不得再写死颜色。

### P2 —— 动效、系统栏、图标与设置项补齐

7. **主题切换颜色动画。**
   接入 `animateColorScheme` + 默认弹簧（`getDefaultColorSpring`），使 Tint/风格/深色切换时颜色平滑过渡；弹簧参数待解码前先用 MaterialKolor 默认值并标注。
8. **系统栏跟随。**
   按 `Lccj0.I/l` 实现：系统栏颜色取当前方案的同一角色色（角色待标定，见 §4.3），浅色/深色图标随深色模式切换，导航栏对比度强制与分隔线颜色一并处理。
9. **设置项补齐（只补主题项，不补业务项）。**
   按 §4.3 末尾的清单补：转场动效（灵动/简化）、背景动效（占位开关，参数待挖）、图标底衬（无/随机/形状预设，预设路径数据待专项扫描）、桌面图标跟随主题、启动画面跟随主题、主题色消息气泡、反转颜色、色觉模式（9 档）、内容取色（开关占位）、系统动态色锁定提示、恢复主题默认值。MIUIX 风格线不在壳的目标内，不补。
10. **启动与图标。**
    已有启动动画（760 ms）与 13 套 Tint 启动主题保持不动；新增“启动画面跟随主题 / 桌面图标跟随主题”与图标底衬的联动逻辑时，不得改动 `Theme.Voyage.Starting.TintXX` 的 blade/paper 原值。

### 写入壳的文件清单（下一步实施时）

| 文件（壳内） | 内容 |
|---|---|
| `app/src/main/java/com/example/voyagetheme/ThemeEngine.kt`（新增） | 种子 → MaterialKolor（SPEC_2021）→ ColorScheme → 后处理 → 动画的主题根，复刻 `Lccj0.o` 结构 |
| `app/src/main/java/com/example/voyagetheme/ThemeShapes.kt`（新增） | 基础 8 角色 Shapes + 7 档样式 + 圆角缩放 |
| `app/src/main/java/com/example/voyagetheme/ThemeTypography.kt`（新增） | 基础 30 样式 + 字体族 + 字号缩放 |
| `app/src/main/java/com/example/voyagetheme/ThemeStore.kt`（扩展，现有文件） | 风格由 2 档扩为 9 档；新增形状样式、阴影组、描边、色觉模式、反转、转场、图标底衬等键（键名须与原应用设置项一一对应，见 §4.3） |
| `app/src/main/res/values/themes.xml`（扩展） | 保留 13 套 Tint 启动主题；新增动态方案的 Material3 主题骨架（颜色角色不再写死，改由运行时方案填充；XML 侧只保留启动/窗口相关属性） |
| `app/src/main/res/values-night/colors.xml`（保留 + 标注） | 保留 Tint blade/paper 夜值与启动夜值；明确标注：夜间动态方案色**不**由此文件决定，由运行时生成 + 后处理决定 |
| `app/src/main/res/values/arrays.xml`（扩展） | 9 档风格、7 档形状、色觉模式等选项数组（中文名取 §2.2 / §3.1 / §2.4 的 ARSC 原值） |

---

## 6. 确实挖不到原值、只能重建的部分（诚实清单）

| 部分 | 状态 | 原因 |
|---|---|---|
| MaterialKolor 具体版本号 | ❌ 未挖到 | DEX 无版本字符串 |
| `Lsbj0` 5 个整数的各自含义（种子外 4 个） | ❌ 未挖到 | 构造点在编辑器 lambda 中，字段语义未标定 |
| `Lrtc.l` 后处理的角色→色调/系数逐项配对 | ❌ 未挖到 | 方法约 1000 条指令，只解出色调集与系数集，未逐项标定 |
| 纯黑变换的最终形态（`Lh7t0.lOl` 是否即纯黑） | 🤔 推断，未证实 | 有候选调用，无角色级证实 |
| `Lshw0.lI` 两个布尔参数的含义 | ❌ 未挖到 | 未解码 |
| 每个 Typography 角色的 sp/字重/行高原值 | ❌ 未挖到 | 默认构造用 helper 计算，常量未逐项解码 |
| `Lsa30` 变换细节（字号/行高是否等比、布尔开关含义） | ❌ 未挖到 | 未完全解码 |
| 霞鹜文楷与字体族的绑定方式 | ❌ 未挖到 | DEX 无文件名，ARSC 无 font 资源 |
| 7 档形状样式的枚举序号 ↔ 中文名对应 | ❌ 未挖到 | 枚举名经加密，ARSC 只有名字集合 |
| 转场动效、背景动效的时长/插值器/类型 | ❌ 未挖到 | 只定位到选项字符串，未定位实现参数 |
| 图标底衬 50 套形状的路径数据 | ❌ 未挖到 | 不在主题根路径中，需专项扫描启动器图标生成代码 |
| 组件级圆角/高度/阴影的具体数值 | ❌ 未挖到 | 原应用无 per-component 样式表，组件取动态方案 + Shapes + 开关 |
| 色觉模式的改写矩阵 | ❌ 未挖到 | 只确认 `Lfrc` 参与方案后处理 |
| `ColorScheme.OI` 字段对应的角色名 | ❌ 未挖到 | 系统栏跟随取该字段，字段→角色映射未解码 |
| 动态方案的“原应用运行时截图值” | 🔁 只能重建 | 未在真机上运行原应用；§2.3 的表是算法重建，且未含后处理，须标注 |

**给壳的总体建议：** 不要把本报告 §2.3 的重建表硬编码成静态主题——那会重蹈“只抠了颜色”的覆辙。正确的壳是**复刻原应用的生成管线**：种子（Tint blade）→ MaterialKolor（SPEC_2021、9 档风格、对比度）→ 后处理（表面色调重建/混色/对比度守卫/纯黑）→ 动画 → Shapes（样式×缩放）/Typography（字体族×缩放）→ 组件（动态角色 + 阴影/描边开关）。只有管线对了，13 套 Tint × 9 档风格 × 浅色/深色/纯黑 × 对比度的全部组合才都会对；抄静态色表永远只能对其中几格。
