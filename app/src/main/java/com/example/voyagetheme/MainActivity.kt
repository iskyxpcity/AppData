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
        setTheme(ThemeStore.mainThemeRes(tint))
        when (ThemeStore.getDarkMode(this)) {
            1 -> AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_NO)
            2 -> AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_YES)
            else -> AppCompatDelegate.setDefaultNightMode(AppCompatDelegate.MODE_NIGHT_FOLLOW_SYSTEM)
        }
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        findViewById<TextView>(R.id.currentTint).text =
            "当前 Tint：%02d".format(tint)

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
        // Scheme style buttons
        findViewById<MaterialButton>(R.id.btnStyleFaithful).setOnClickListener {
            ThemeStore.saveSchemeStyle(this, 0)
        }
        findViewById<MaterialButton>(R.id.btnStyleVibrant).setOnClickListener {
            ThemeStore.saveSchemeStyle(this, 1)
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
        show(sectionTheme)
    }
}
