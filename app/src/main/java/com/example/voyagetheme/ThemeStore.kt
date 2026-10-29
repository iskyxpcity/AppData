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
    private const val KEY_SCHEME_STYLE = "scheme_style" // 0=faithful to seed, 1=vibrant
    private const val KEY_CORNER = "corner" // 0=small, 1=medium, 2=large
    private const val KEY_FONT_SIZE = "font_size" // 0=normal, 1=large
    private const val KEY_ANIMATION = "animation"

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
    fun getSchemeStyle(context: Context): Int = getInt(context, KEY_SCHEME_STYLE, 0)
    fun getCorner(context: Context): Int = getInt(context, KEY_CORNER, 1)
    fun getFontSize(context: Context): Int = getInt(context, KEY_FONT_SIZE, 0)
    fun getAnimation(context: Context): Boolean = getBool(context, KEY_ANIMATION, true)

    fun saveDarkMode(context: Context, v: Int) = saveInt(context, KEY_DARK_MODE, v)
    fun savePureBlack(context: Context, v: Boolean) = saveBool(context, KEY_PURE_BLACK, v)
    fun saveSplashFollow(context: Context, v: Boolean) = saveBool(context, KEY_SPLASH_FOLLOW, v)
    fun saveIconFollow(context: Context, v: Boolean) = saveBool(context, KEY_ICON_FOLLOW, v)
    fun saveBubbleTheme(context: Context, v: Boolean) = saveBool(context, KEY_BUBBLE_THEME, v)
    fun saveSchemeStyle(context: Context, v: Int) = saveInt(context, KEY_SCHEME_STYLE, v)
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
