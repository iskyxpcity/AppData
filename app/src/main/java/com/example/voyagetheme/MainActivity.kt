package com.example.voyagetheme

import android.content.res.ColorStateList
import android.os.Bundle
import android.view.View
import android.widget.LinearLayout
import android.widget.SeekBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.app.AppCompatDelegate
import androidx.appcompat.widget.SwitchCompat
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView
import com.google.android.material.chip.Chip

/**
 * Theme shell only. No business content.
 * Three tabs, all theme-only:
 *  - 主题设置：13 Tint + 显示模式 + 启动/图标跟随 + 恢复默认
 *  - 方案编辑：预设/新建配色（演示列表）、配色风格、圆角、字体、动效
 *  - 组件展示：按钮、卡片、滑块、开关、Chip、列表项，全部跟随当前主题
 * Launch-isolation: SplashScreen library call removed, Tint main theme
 * is set before super.onCreate().
 */
class MainActivity : AppCompatActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        val tint = ThemeStore.getTint(this)
        val style = ThemeStore.getSchemeStyle(this)
        setTheme(ThemeStore.mainSchemeThemeRes(tint, style))
        when (ThemeStore.getDarkMode(this)) {
            1 -> AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
            2 -> AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
            else -> AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM)
        }
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val styleName = ThemeStore.schemeStyleName(style)
        val styleNote = if (ThemeStore.isSchemeImplemented(style)) "" else "（回落到忠于种子，完整表待补）"
        findViewById<TextView>(R.id.currentTint).text =
            "当前 Tint：%02d · 风格：%s%s".format(tint, styleName, styleNote)
        // Pure-black: window background = reconstructed near-black surface
        // (colors_scheme.xml *_pureblack_surface), NOT plain #000000 and
        // NOT the unconfirmed original pure-black transform.
        if (ThemeStore.getPureBlack(this)) {
            val prefix = if (style == 5) "fruitsalad" else "fidelity"
            val resName = "scheme_${prefix}_t%02d_pureblack_surface".format(tint)
            val resId = resources.getIdentifier(resName, "color", packageName)
            if (resId != 0) {
                window.decorView.setBackgroundColor(
                    resources.getColor(resId, theme)
                )
            }
        }

        val sectionTheme = findViewById<View>(R.id.sectionTheme)
        val sectionScheme = findViewById<View>(R.id.sectionScheme)
        val sectionComponents = findViewById<View>(R.id.sectionComponents)
        fun show(section: View) {
            sectionTheme.visibility = View.GONE
            sectionScheme.visibility = View.GONE
            sectionComponents.visibility = View.GONE
            section.visibility = View.VISIBLE
        }
        findViewById<MaterialButton>(R.id.tabTheme).setOnClickListener { show(sectionTheme) }
        findViewById<MaterialButton>(R.id.tabScheme).setOnClickListener { show(sectionScheme) }
        findViewById<MaterialButton>(R.id.tabComponents).setOnClickListener { show(sectionComponents) }

        // Tint list
        val tintList = findViewById<LinearLayout>(R.id.tintList)
        val blades = resources.obtainTypedArray(R.array.tint_blades)
        val papers = resources.obtainTypedArray(R.array.tint_papers)
        try {
            for (i in 1..13) {
                val button = MaterialButton(this).apply {
                    text = "Tint %02d".format(i)
                    textSize = 16f
                    backgroundTintList = ColorStateList.valueOf(blades.getColor(i - 1, 0))
                    setTextColor(papers.getColor(i - 1, 0))
                    setOnClickListener {
                        ThemeStore.saveTint(this@MainActivity, i)
                        recreate()
                    }
                }
                tintList.addView(button, LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { topMargin = 16 })
            }
        } finally {
            blades.recycle()
            papers.recycle()
        }

        // Theme settings switches
        fun bindSwitch(id: Int, value: Boolean, onChange: (Boolean) -> Unit) {
            findViewById<SwitchCompat>(id).apply {
                isChecked = value
                setOnCheckedChangeListener { _, checked -> onChange(checked) }
            }
        }
        bindSwitch(R.id.switchPureBlack, ThemeStore.getPureBlack(this)) {
            ThemeStore.savePureBlack(this, it); recreate()
        }
        bindSwitch(R.id.switchSplashFollow, ThemeStore.getSplashFollow(this)) {
            ThemeStore.saveSplashFollow(this, it)
        }
        bindSwitch(R.id.switchIconFollow, ThemeStore.getIconFollow(this)) {
            ThemeStore.saveIconFollow(this, it)
        }
        bindSwitch(R.id.switchBubble, ThemeStore.getBubbleTheme(this)) {
            ThemeStore.saveBubbleTheme(this, it)
        }
        bindSwitch(R.id.switchAnimation, ThemeStore.getAnimation(this)) {
            ThemeStore.saveAnimation(this, it)
        }
        findViewById<MaterialButton>(R.id.btnResetTheme).setOnClickListener {
            ThemeStore.resetToDefaults(this); recreate()
        }
        // Display mode buttons
        findViewById<MaterialButton>(R.id.btnModeFollow).setOnClickListener {
            ThemeStore.saveDarkMode(this, 0); recreate()
        }
        findViewById<MaterialButton>(R.id.btnModeLight).setOnClickListener {
            ThemeStore.saveDarkMode(this, 1); recreate()
        }
        findViewById<MaterialButton>(R.id.btnModeDark).setOnClickListener {
            ThemeStore.saveDarkMode(this, 2); recreate()
        }
        // Scheme style buttons (corrected Licj0 mapping, §2.2):
        // 忠于种子 = Fidelity 7, 缤纷 = FruitSalad 5 (NOT old 0/1).
        findViewById<MaterialButton>(R.id.btnStyleFaithful).setOnClickListener {
            ThemeStore.saveSchemeStyle(this, 7); recreate()
        }
        findViewById<MaterialButton>(R.id.btnStyleVibrant).setOnClickListener {
            ThemeStore.saveSchemeStyle(this, 5); recreate()
        }
        // Full 9-style list: implemented styles switch for real, others
        // are labelled as fallback and switch to Fidelity via ThemeStore.
        val styleList = findViewById<LinearLayout>(R.id.styleList)
        val styleNames = resources.getStringArray(R.array.scheme_styles)
        for (i in 0..8) {
            val label = if (ThemeStore.isSchemeImplemented(i)) styleNames[i]
                else "%s（回落忠于种子）".format(styleNames[i])
            val button = MaterialButton(this).apply {
                text = label
                textSize = 15f
                setOnClickListener {
                    ThemeStore.saveSchemeStyle(this@MainActivity, i); recreate()
                }
            }
            styleList.addView(button, LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply { topMargin = 12 })
        }
        // Component showcase: slider + chip + card follow theme automatically
        findViewById<SeekBar>(R.id.showcaseSlider).setOnSeekBarChangeListener(
            object : SeekBar.OnSeekBarChangeListener {
                override fun onProgressChanged(s: SeekBar?, p: Int, fromUser: Boolean) {}
                override fun onStartTrackingTouch(s: SeekBar?) {}
                override fun onStopTrackingTouch(s: SeekBar?) {}
            }
        )
        findViewById<Chip>(R.id.showcaseChip).setOnClickListener {}
        findViewById<MaterialCardView>(R.id.showcaseCard).setOnClickListener {}
        findViewById<MaterialButton>(R.id.showcaseDialogButton).setOnClickListener {
            androidx.appcompat.app.AlertDialog.Builder(this)
                .setTitle("对话框示例")
                .setMessage("颜色取当前方案角色，形状取当前形状体系。")
                .setPositiveButton("确定", null)
                .show()
        }
        findViewById<com.google.android.material.bottomnavigation.BottomNavigationView>(R.id.showcaseNavBar)
            .setOnItemSelectedListener { true }
        // Component state line: switch / slider / shape styles (ARSC names)
        findViewById<TextView>(R.id.componentState).text =
            "开关：%s · 滑条：%s · 形状：%s".format(
                ThemeStore.switchStyleName(ThemeStore.getSwitchStyle(this)),
                ThemeStore.sliderStyleName(ThemeStore.getSliderStyle(this)),
                ThemeStore.shapeStyleName(ThemeStore.getShapeStyle(this))
            )
        // Style lists: switch (8), slider (4), shape (7)
        fun buildList(id: Int, names: Array<String>, current: Int, onPick: (Int) -> Unit) {
            val list = findViewById<LinearLayout>(id)
            for (i in names.indices) {
                val button = MaterialButton(this).apply {
                    text = if (i == current) "%s（当前）".format(names[i]) else names[i]
                    textSize = 15f
                    setOnClickListener { onPick(i); recreate() }
                }
                list.addView(button, LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { topMargin = 12 })
            }
        }
        buildList(R.id.switchStyleList, resources.getStringArray(R.array.switch_styles),
            ThemeStore.getSwitchStyle(this)) { ThemeStore.saveSwitchStyle(this, it) }
        buildList(R.id.sliderStyleList, resources.getStringArray(R.array.slider_styles),
            ThemeStore.getSliderStyle(this)) { ThemeStore.saveSliderStyle(this, it) }
        buildList(R.id.shapeStyleList, resources.getStringArray(R.array.shape_styles),
            ThemeStore.getShapeStyle(this)) { ThemeStore.saveShapeStyle(this, it) }
        // Shadows: 6 switches from theme_group_shadows, applied as elevation
        fun dp(v: Float) = v * resources.displayMetrics.density
        fun applyShadows() {
            findViewById<View>(R.id.showcaseTopBar).elevation =
                if (ThemeStore.shadowTopbar(this)) dp(4f) else 0f
            findViewById<View>(R.id.primaryButton).elevation =
                if (ThemeStore.shadowButton(this)) dp(2f) else 0f
            findViewById<MaterialCardView>(R.id.showcaseCard).cardElevation =
                if (ThemeStore.shadowContainer(this)) dp(2f) else 0f
            findViewById<View>(R.id.showcaseFab).elevation =
                if (ThemeStore.shadowFab(this)) dp(6f) else 0f
            findViewById<View>(R.id.showcaseSlider).elevation =
                if (ThemeStore.shadowSlider(this)) dp(2f) else 0f
            findViewById<View>(R.id.showcaseSwitch).elevation =
                if (ThemeStore.shadowSwitch(this)) dp(2f) else 0f
        }
        applyShadows()
        bindSwitch(R.id.shadowTopBar, ThemeStore.shadowTopbar(this)) {
            ThemeStore.saveShadow(this, "shadow_topbar", it); applyShadows()
        }
        bindSwitch(R.id.shadowButton, ThemeStore.shadowButton(this)) {
            ThemeStore.saveShadow(this, "shadow_button", it); applyShadows()
        }
        bindSwitch(R.id.shadowContainer, ThemeStore.shadowContainer(this)) {
            ThemeStore.saveShadow(this, "shadow_container", it); applyShadows()
        }
        bindSwitch(R.id.shadowFab, ThemeStore.shadowFab(this)) {
            ThemeStore.saveShadow(this, "shadow_fab", it); applyShadows()
        }
        bindSwitch(R.id.shadowSlider, ThemeStore.shadowSlider(this)) {
            ThemeStore.saveShadow(this, "shadow_slider", it); applyShadows()
        }
        bindSwitch(R.id.shadowSwitch, ThemeStore.shadowSwitch(this)) {
            ThemeStore.saveShadow(this, "shadow_switch", it); applyShadows()
        }
        // Navigation bar: floating + liquid glass (liquid needs floating first)
        val navBar = findViewById<com.google.android.material.bottomnavigation.BottomNavigationView>(R.id.showcaseNavBar)
        fun applyNavBar() {
            val floating = ThemeStore.getFloatingNav(this)
            val liquid = floating && ThemeStore.getLiquidGlass(this)
            val params = navBar.layoutParams as LinearLayout.LayoutParams
            params.setMargins(if (floating) dp(16f).toInt() else 0, 0, if (floating) dp(16f).toInt() else 0, 0)
            navBar.layoutParams = params
            navBar.elevation = if (floating) dp(8f) else 0f
            // View shell approximation of liquid glass: translucent bar.
            // True refraction + blur is a Compose / Android 13 effect and
            // is NOT reproduced here.
            navBar.alpha = if (liquid) 0.85f else 1f
            findViewById<SwitchCompat>(R.id.switchLiquidGlass).isEnabled = floating
        }
        applyNavBar()
        bindSwitch(R.id.switchFloatingNav, ThemeStore.getFloatingNav(this)) {
            ThemeStore.saveFloatingNav(this, it)
            if (!it) ThemeStore.saveLiquidGlass(this, false)
            applyNavBar()
        }
        bindSwitch(R.id.switchLiquidGlass, ThemeStore.getLiquidGlass(this)) {
            ThemeStore.saveLiquidGlass(this, it); applyNavBar()
        }
        // Grouped settings: design / corner / border
        findViewById<MaterialButton>(R.id.btnDesignMaterial3).setOnClickListener {
            ThemeStore.saveDesign(this, 0); recreate()
        }
        findViewById<MaterialButton>(R.id.btnDesignMiuix).setOnClickListener {
            ThemeStore.saveDesign(this, 1); recreate()
        }
        findViewById<TextView>(R.id.currentTint).text =
            "当前 Tint：%02d · 风格：%s%s · 界面：%s".format(
                tint, styleName, styleNote, ThemeStore.designName(ThemeStore.getDesign(this)))
        findViewById<MaterialButton>(R.id.btnCornerSmall).setOnClickListener {
            ThemeStore.saveCorner(this, 0); recreate()
        }
        findViewById<MaterialButton>(R.id.btnCornerMedium).setOnClickListener {
            ThemeStore.saveCorner(this, 1); recreate()
        }
        findViewById<MaterialButton>(R.id.btnCornerLarge).setOnClickListener {
            ThemeStore.saveCorner(this, 2); recreate()
        }
        findViewById<MaterialButton>(R.id.btnBorderThin).setOnClickListener {
            ThemeStore.saveBorderWidth(this, 0); recreate()
        }
        findViewById<MaterialButton>(R.id.btnBorderMedium).setOnClickListener {
            ThemeStore.saveBorderWidth(this, 1); recreate()
        }
        findViewById<MaterialButton>(R.id.btnBorderThick).setOnClickListener {
            ThemeStore.saveBorderWidth(this, 2); recreate()
        }
        // Icon shape: -1 none, 50 random, 0..9 presets shown (original has 0..49)
        fun iconShapeLabel(v: Int): String = when (v) {
            -1 -> "无"; 50 -> "随机"; else -> "预设 %d".format(v)
        }
        findViewById<TextView>(R.id.iconShapeState).text =
            "图标底衬：%s".format(iconShapeLabel(ThemeStore.getIconShape(this)))
        findViewById<MaterialButton>(R.id.btnIconNone).setOnClickListener {
            ThemeStore.saveIconShape(this, -1); recreate()
        }
        findViewById<MaterialButton>(R.id.btnIconRandom).setOnClickListener {
            ThemeStore.saveIconShape(this, 50); recreate()
        }
        buildList(R.id.iconShapeList, Array(10) { "预设 %d".format(it) },
            ThemeStore.getIconShape(this).takeIf { it in 0..9 } ?: -2) {
            ThemeStore.saveIconShape(this, it)
        }
        // Colour assistance: 9 modes + invert / content / dynamic-locked
        buildList(R.id.colorBlindList, resources.getStringArray(R.array.color_blind_modes),
            ThemeStore.getColorBlind(this)) { ThemeStore.saveColorBlind(this, it) }
        bindSwitch(R.id.switchInvert, ThemeStore.getInvertColors(this)) {
            ThemeStore.saveInvertColors(this, it)
        }
        bindSwitch(R.id.switchContentColors, ThemeStore.getContentColors(this)) {
            ThemeStore.saveContentColors(this, it)
        }
        bindSwitch(R.id.switchDynamicLocked, ThemeStore.getDynamicLocked(this)) {
            ThemeStore.saveDynamicLocked(this, it)
        }
        // Scheme editor: new / delete custom schemes, preset list
        findViewById<MaterialButton>(R.id.btnSchemeNew).setOnClickListener {
            val n = ThemeStore.getCustomSchemes(this).size + 1
            ThemeStore.addCustomScheme(this, "自定义 %d".format(n)); recreate()
        }
        val customList = findViewById<LinearLayout>(R.id.customSchemeList)
        for (name in ThemeStore.getCustomSchemes(this)) {
            val button = MaterialButton(this).apply {
                text = "%s（点此删除）".format(name)
                textSize = 15f
                setOnClickListener {
                    ThemeStore.deleteCustomScheme(this@MainActivity, name); recreate()
                }
            }
            customList.addView(button, LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.WRAP_CONTENT
            ).apply { topMargin = 12 })
        }
        val presetList = findViewById<LinearLayout>(R.id.presetSchemeList)
        val presetBlades = resources.obtainTypedArray(R.array.tint_blades)
        val presetPapers = resources.obtainTypedArray(R.array.tint_papers)
        try {
            for (i in 1..13) {
                val button = MaterialButton(this).apply {
                    text = "预设 Tint %02d".format(i)
                    textSize = 15f
                    backgroundTintList = ColorStateList.valueOf(presetBlades.getColor(i - 1, 0))
                    setTextColor(presetPapers.getColor(i - 1, 0))
                    setOnClickListener {
                        ThemeStore.saveTint(this@MainActivity, i); recreate()
                    }
                }
                presetList.addView(button, LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
                ).apply { topMargin = 12 })
            }
        } finally {
            presetBlades.recycle(); presetPapers.recycle()
        }
        show(sectionTheme)
    }
}
