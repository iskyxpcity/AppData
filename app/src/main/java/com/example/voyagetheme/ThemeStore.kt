package com.example.voyagetheme

import android.content.Context

/**
 * Theme-only store. It remembers theme state only: Tint, display mode,
 * scheme style, corner, font, animation and follow-theme switches.
 * No business data, no network, no other app state.
 * Empty-house shell: every setting below is a theme setting, nothing
 * else is stored here.
 */
object ThemeStore {
    private const val PREFS = "voyage_theme"
    private const val KEY_TINT = "tint"
    private const val KEY_DARK_MODE = "dark_mode" // 0=follow system, 1=light, 2=dark
    private const val KEY_PURE_BLACK = "pure_black"
    private const val KEY_SPLASH_FOLLOW = "splash_follow_theme"
    private const val KEY_ICON_FOLLOW = "icon_follow_theme"
    private const val KEY_BUBBLE_THEME = "bubble_theme_color"
    // Scheme style: Licj0 numbers per THEME_DEEP_DIVE.md §2.2 (ORIGINAL mapping):
    // 0=灵动 Expressive, 1=柔和 TonalSpot, 2=中性 Neutral, 3=鲜明 Vibrant,
    // 4=彩虹 Rainbow, 5=缤纷 FruitSalad, 6=单色 Monochrome,
    // 7=忠于种子 Fidelity (DEFAULT), 8=内容 Content.
    // Only 7 and 5 have complete generated tables (colors_scheme.xml);
    // other numbers fall back to Fidelity in mainSchemeThemeRes, and the
    // UI labels them as fallback — they are NOT claimed as implemented.
    private const val KEY_SCHEME_STYLE = "scheme_style"
    private const val KEY_CORNER = "corner" // 0=small, 1=medium, 2=large
    private const val KEY_FONT_SIZE = "font_size" // 0=normal, 1=large
    private const val KEY_ANIMATION = "animation"
    // New keys from THEME_DEEP_DIVE.md §3/§4.3. Values are theme-only.
    // Shape-style number <-> name mapping was NOT decoded; stored number
    // is a configurable placeholder, not a claimed original mapping.
    private const val KEY_SHAPE_STYLE = "shape_style" // 0..6, shell order in arrays.xml, default 0 (rounded)
    private const val KEY_DESIGN = "design" // 0=Material 3, 1=MIUIX (shell records only, MIUIX rendering not in scope)
    private const val KEY_CUSTOM_SCHEMES = "custom_schemes" // comma-separated demo scheme names, theme shell only
    private const val KEY_SWITCH_STYLE = "switch_style" // 0..7, ARSC names, shell default 5 (Material You)
    private const val KEY_SLIDER_STYLE = "slider_style" // 0..3, ARSC names, shell default 3 (Material You)
    private const val KEY_FONT_FAMILY = "font_family" // 0=default (LXGW), 1=serif
    private const val KEY_BORDER_WIDTH = "border_width" // 0=thin, 1=medium, 2=thick
    private const val KEY_COLOR_BLIND = "color_blind" // 0=off, 1..8 per arrays
    private const val KEY_INVERT_COLORS = "invert_colors"
    private const val KEY_TRANSITION_MOTION = "transition_motion" // 0=expressive, 1=reduced
    private const val KEY_BACKGROUND_MOTION = "background_motion"
    private const val KEY_ICON_SHAPE = "icon_shape" // -1=none, 0..49 presets, 50=random
    private const val KEY_FLOATING_NAV = "floating_nav"
    private const val KEY_LIQUID_GLASS = "liquid_glass"
    private const val KEY_CONTENT_COLORS = "content_colors" // placeholder only, no content pages
    private const val KEY_DYNAMIC_LOCKED = "dynamic_locked" // system dynamic colour locks manual choice
    private const val KEY_SHADOW_TOPBAR = "shadow_topbar"
    private const val KEY_SHADOW_BUTTON = "shadow_button"
    private const val KEY_SHADOW_CONTAINER = "shadow_container"
    private const val KEY_SHADOW_FAB = "shadow_fab"
    private const val KEY_SHADOW_SLIDER = "shadow_slider"
    private const val KEY_SHADOW_SWITCH = "shadow_switch"

    private fun prefs(context: Context) =
        context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)

    fun getTint(context: Context): Int =
        prefs(context).getInt(KEY_TINT, 1).coerceIn(1, 13)

    fun saveTint(context: Context, tint: Int) {
        prefs(context).edit().putInt(KEY_TINT, tint.coerceIn(1, 13)).apply()
    }

    fun getInt(context: Context, key: String, def: Int): Int =
        prefs(context).getInt(key, def)

    fun saveInt(context: Context, key: String, value: Int) {
        prefs(context).edit().putInt(key, value).apply()
    }

    fun getBool(context: Context, key: String, def: Boolean): Boolean =
        prefs(context).getBoolean(key, def)

    fun saveBool(context: Context, key: String, value: Boolean) {
        prefs(context).edit().putBoolean(key, value).apply()
    }

    fun getDarkMode(context: Context): Int = getInt(context, KEY_DARK_MODE, 0)
    fun getPureBlack(context: Context): Boolean = getBool(context, KEY_PURE_BLACK, false)
    fun getSplashFollow(context: Context): Boolean = getBool(context, KEY_SPLASH_FOLLOW, true)
    fun getIconFollow(context: Context): Boolean = getBool(context, KEY_ICON_FOLLOW, true)
    fun getBubbleTheme(context: Context): Boolean = getBool(context, KEY_BUBBLE_THEME, true)
    fun getSchemeStyle(context: Context): Int = getInt(context, KEY_SCHEME_STYLE, 7)
    fun getCorner(context: Context): Int = getInt(context, KEY_CORNER, 1)
    fun getFontSize(context: Context): Int = getInt(context, KEY_FONT_SIZE, 0)
    fun getAnimation(context: Context): Boolean = getBool(context, KEY_ANIMATION, true)

    fun saveDarkMode(context: Context, v: Int) = saveInt(context, KEY_DARK_MODE, v)
    fun savePureBlack(context: Context, v: Boolean) = saveBool(context, KEY_PURE_BLACK, v)
    fun saveSplashFollow(context: Context, v: Boolean) = saveBool(context, KEY_SPLASH_FOLLOW, v)
    fun saveIconFollow(context: Context, v: Boolean) = saveBool(context, KEY_ICON_FOLLOW, v)
    fun saveBubbleTheme(context: Context, v: Boolean) = saveBool(context, KEY_BUBBLE_THEME, v)
    fun saveSchemeStyle(context: Context, v: Int) = saveInt(context, KEY_SCHEME_STYLE, v.coerceIn(0, 8))
    fun getShapeStyle(context: Context): Int = getInt(context, KEY_SHAPE_STYLE, 0)
    fun saveShapeStyle(context: Context, v: Int) = saveInt(context, KEY_SHAPE_STYLE, v.coerceIn(0, 6))
    fun getSwitchStyle(context: Context): Int = getInt(context, KEY_SWITCH_STYLE, 5)
    fun saveSwitchStyle(context: Context, v: Int) = saveInt(context, KEY_SWITCH_STYLE, v.coerceIn(0, 7))
    fun getSliderStyle(context: Context): Int = getInt(context, KEY_SLIDER_STYLE, 3)
    fun saveSliderStyle(context: Context, v: Int) = saveInt(context, KEY_SLIDER_STYLE, v.coerceIn(0, 3))
    fun switchStyleName(style: Int): String = listOf("Compose", "Cupertino", "Fluent", "HyperOS", "液态玻璃", "Material You", "One UI", "Pixel")[style.coerceIn(0, 7)]
    fun sliderStyleName(style: Int): String = listOf("灵动", "HyperOS", "Material 2", "Material You")[style.coerceIn(0, 3)]
    fun shapeStyleName(style: Int): String = listOf("圆角", "切角", "超椭圆", "平滑", "波浪", "内凹", "缺口")[style.coerceIn(0, 6)]
    fun getDesign(context: Context): Int = getInt(context, KEY_DESIGN, 0)
    fun saveDesign(context: Context, v: Int) = saveInt(context, KEY_DESIGN, v.coerceIn(0, 1))
    fun designName(design: Int): String = if (design == 1) "MIUIX（仅记录，壳内仍为 Material 3）" else "Material 3"
    fun getCustomSchemes(context: Context): List<String> {
        val raw = prefs(context).getString(KEY_CUSTOM_SCHEMES, "") ?: ""
        return raw.split(",").filter { it.isNotBlank() }
    }
    fun addCustomScheme(context: Context, name: String) {
        val list = getCustomSchemes(context) + name
        prefs(context).edit().putString(KEY_CUSTOM_SCHEMES, list.joinToString(",")).apply()
    }
    fun deleteCustomScheme(context: Context, name: String) {
        val list = getCustomSchemes(context) - name
        prefs(context).edit().putString(KEY_CUSTOM_SCHEMES, list.joinToString(",")).apply()
    }
    fun getFontFamily(context: Context): Int = getInt(context, KEY_FONT_FAMILY, 0)
    fun saveFontFamily(context: Context, v: Int) = saveInt(context, KEY_FONT_FAMILY, v)
    fun getBorderWidth(context: Context): Int = getInt(context, KEY_BORDER_WIDTH, 1)
    fun saveBorderWidth(context: Context, v: Int) = saveInt(context, KEY_BORDER_WIDTH, v)
    fun getColorBlind(context: Context): Int = getInt(context, KEY_COLOR_BLIND, 0)
    fun saveColorBlind(context: Context, v: Int) = saveInt(context, KEY_COLOR_BLIND, v.coerceIn(0, 8))
    fun getInvertColors(context: Context): Boolean = getBool(context, KEY_INVERT_COLORS, false)
    fun saveInvertColors(context: Context, v: Boolean) = saveBool(context, KEY_INVERT_COLORS, v)
    fun getTransitionMotion(context: Context): Int = getInt(context, KEY_TRANSITION_MOTION, 0)
    fun saveTransitionMotion(context: Context, v: Int) = saveInt(context, KEY_TRANSITION_MOTION, v)
    fun getBackgroundMotion(context: Context): Boolean = getBool(context, KEY_BACKGROUND_MOTION, false)
    fun saveBackgroundMotion(context: Context, v: Boolean) = saveBool(context, KEY_BACKGROUND_MOTION, v)
    fun getIconShape(context: Context): Int = getInt(context, KEY_ICON_SHAPE, -1)
    fun saveIconShape(context: Context, v: Int) = saveInt(context, KEY_ICON_SHAPE, v)
    fun getFloatingNav(context: Context): Boolean = getBool(context, KEY_FLOATING_NAV, false)
    fun saveFloatingNav(context: Context, v: Boolean) = saveBool(context, KEY_FLOATING_NAV, v)
    fun getLiquidGlass(context: Context): Boolean = getBool(context, KEY_LIQUID_GLASS, false)
    fun saveLiquidGlass(context: Context, v: Boolean) = saveBool(context, KEY_LIQUID_GLASS, v)
    fun getContentColors(context: Context): Boolean = getBool(context, KEY_CONTENT_COLORS, false)
    fun saveContentColors(context: Context, v: Boolean) = saveBool(context, KEY_CONTENT_COLORS, v)
    fun getDynamicLocked(context: Context): Boolean = getBool(context, KEY_DYNAMIC_LOCKED, false)
    fun saveDynamicLocked(context: Context, v: Boolean) = saveBool(context, KEY_DYNAMIC_LOCKED, v)
    fun getShadow(context: Context, key: String): Boolean = getBool(context, key, true)
    fun saveShadow(context: Context, key: String, v: Boolean) = saveBool(context, key, v)
    fun shadowTopbar(context: Context) = getShadow(context, KEY_SHADOW_TOPBAR)
    fun shadowButton(context: Context) = getShadow(context, KEY_SHADOW_BUTTON)
    fun shadowContainer(context: Context) = getShadow(context, KEY_SHADOW_CONTAINER)
    fun shadowFab(context: Context) = getShadow(context, KEY_SHADOW_FAB)
    fun shadowSlider(context: Context) = getShadow(context, KEY_SHADOW_SLIDER)
    fun shadowSwitch(context: Context) = getShadow(context, KEY_SHADOW_SWITCH)

    fun schemeStyleName(style: Int): String = when (style.coerceIn(0, 8)) {
        0 -> "灵动"
        1 -> "柔和"
        2 -> "中性"
        3 -> "鲜明"
        4 -> "彩虹"
        5 -> "缤纷"
        6 -> "单色"
        7 -> "忠于种子"
        else -> "内容"
    }

    /** True only for styles with a complete generated table. Others fall back. */
    fun isSchemeImplemented(style: Int): Boolean = style == 7 || style == 5

    /**
     * Scheme theme for a Tint x style. Implemented: 7 Fidelity, 5 FruitSalad.
     * All other Licj0 styles fall back to Fidelity and are labelled as
     * fallback in the UI — their tables are not yet generated, and this
     * fallback must not be presented as those styles being implemented.
     * The View project cannot reproduce the original Compose runtime
     * pipeline (MaterialKolor SPEC_2021 generation + §2.4 post-processing
     * + animateColorScheme); these static themes are the generated-table
     * equivalent, see colors_scheme.xml header.
     */
    fun mainSchemeThemeRes(tint: Int, style: Int): Int {
        val t = tint.coerceIn(1, 13)
        return when (style) {
            5 -> when (t) {
                1 -> R.style.Theme_Voyage_Tint01_FruitSalad
                2 -> R.style.Theme_Voyage_Tint02_FruitSalad
                3 -> R.style.Theme_Voyage_Tint03_FruitSalad
                4 -> R.style.Theme_Voyage_Tint04_FruitSalad
                5 -> R.style.Theme_Voyage_Tint05_FruitSalad
                6 -> R.style.Theme_Voyage_Tint06_FruitSalad
                7 -> R.style.Theme_Voyage_Tint07_FruitSalad
                8 -> R.style.Theme_Voyage_Tint08_FruitSalad
                9 -> R.style.Theme_Voyage_Tint09_FruitSalad
                10 -> R.style.Theme_Voyage_Tint10_FruitSalad
                11 -> R.style.Theme_Voyage_Tint11_FruitSalad
                12 -> R.style.Theme_Voyage_Tint12_FruitSalad
                else -> R.style.Theme_Voyage_Tint13_FruitSalad
            }
            else -> when (t) { // Fidelity, including fallback for 0,1,2,3,4,6,8
                1 -> R.style.Theme_Voyage_Tint01_Fidelity
                2 -> R.style.Theme_Voyage_Tint02_Fidelity
                3 -> R.style.Theme_Voyage_Tint03_Fidelity
                4 -> R.style.Theme_Voyage_Tint04_Fidelity
                5 -> R.style.Theme_Voyage_Tint05_Fidelity
                6 -> R.style.Theme_Voyage_Tint06_Fidelity
                7 -> R.style.Theme_Voyage_Tint07_Fidelity
                8 -> R.style.Theme_Voyage_Tint08_Fidelity
                9 -> R.style.Theme_Voyage_Tint09_Fidelity
                10 -> R.style.Theme_Voyage_Tint10_Fidelity
                11 -> R.style.Theme_Voyage_Tint11_Fidelity
                12 -> R.style.Theme_Voyage_Tint12_Fidelity
                else -> R.style.Theme_Voyage_Tint13_Fidelity
            }
        }
    }
    fun saveCorner(context: Context, v: Int) = saveInt(context, KEY_CORNER, v)
    fun saveFontSize(context: Context, v: Int) = saveInt(context, KEY_FONT_SIZE, v)
    fun saveAnimation(context: Context, v: Boolean) = saveBool(context, KEY_ANIMATION, v)

    fun resetToDefaults(context: Context) {
        prefs(context).edit().clear().apply()
    }

    fun mainThemeRes(tint: Int): Int = when (tint.coerceIn(1, 13)) {
        1 -> R.style.Theme_Voyage_Tint01
        2 -> R.style.Theme_Voyage_Tint02
        3 -> R.style.Theme_Voyage_Tint03
        4 -> R.style.Theme_Voyage_Tint04
        5 -> R.style.Theme_Voyage_Tint05
        6 -> R.style.Theme_Voyage_Tint06
        7 -> R.style.Theme_Voyage_Tint07
        8 -> R.style.Theme_Voyage_Tint08
        9 -> R.style.Theme_Voyage_Tint09
        10 -> R.style.Theme_Voyage_Tint10
        11 -> R.style.Theme_Voyage_Tint11
        12 -> R.style.Theme_Voyage_Tint12
        else -> R.style.Theme_Voyage_Tint13
    }

    fun startingThemeRes(tint: Int): Int = when (tint.coerceIn(1, 13)) {
        1 -> R.style.Theme_Voyage_Starting_Tint01
        2 -> R.style.Theme_Voyage_Starting_Tint02
        3 -> R.style.Theme_Voyage_Starting_Tint03
        4 -> R.style.Theme_Voyage_Starting_Tint04
        5 -> R.style.Theme_Voyage_Starting_Tint05
        6 -> R.style.Theme_Voyage_Starting_Tint06
        7 -> R.style.Theme_Voyage_Starting_Tint07
        8 -> R.style.Theme_Voyage_Starting_Tint08
        9 -> R.style.Theme_Voyage_Starting_Tint09
        10 -> R.style.Theme_Voyage_Starting_Tint10
        11 -> R.style.Theme_Voyage_Starting_Tint11
        12 -> R.style.Theme_Voyage_Starting_Tint12
        else -> R.style.Theme_Voyage_Starting_Tint13
    }
}
