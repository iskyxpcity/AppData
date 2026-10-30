package com.example.voyagetheme

import android.graphics.Color
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.View
import android.widget.EditText
import android.widget.SeekBar
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.appbar.MaterialToolbar
import com.google.android.material.button.MaterialButton

/**
 * Theme scheme editor subpage (ThemeSchemeEditorRoute equivalent, View version).
 * No business content. Editor controls actually work:
 * hue / chroma (saturation) / tone (value) sliders + hex input drive the
 * preview swatches, and Save creates a custom scheme name in ThemeStore.
 * The original editor's exact colour-generation algorithm was not decoded,
 * so preview colours here are HSV-derived, NOT claimed as original values.
 */
class SchemeEditorActivity : AppCompatActivity() {
    private var hue = 200
    private var chroma = 80
    private var tone = 60

    override fun onCreate(savedInstanceState: Bundle?) {
        val tint = ThemeStore.getTint(this)
        val style = ThemeStore.getSchemeStyle(this)
        setTheme(ThemeStore.mainSchemeThemeRes(tint, style))
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_scheme_editor)

        findViewById<MaterialToolbar>(R.id.editorTopBar).apply {
            setNavigationOnClickListener { finish() }
        }
        val hexInput = findViewById<EditText>(R.id.editorHex)
        val previews = listOf(
            R.id.previewPrimary, R.id.previewSecondary, R.id.previewTertiary,
            R.id.previewSurface, R.id.previewContainer
        ).map { findViewById<View>(it) }

        fun refresh() {
            val s = chroma / 100f
            val v = tone / 100f
            val primary = Color.HSVToColor(floatArrayOf(hue.toFloat(), s, v))
            val secondary = Color.HSVToColor(floatArrayOf((hue + 40) % 360f, s, v))
            val tertiary = Color.HSVToColor(floatArrayOf((hue + 80) % 360f, s, v))
            val surface = Color.HSVToColor(floatArrayOf(hue.toFloat(), s * 0.2f, 0.95f))
            val container = Color.HSVToColor(floatArrayOf(hue.toFloat(), s * 0.5f, 0.9f))
            val colors = listOf(primary, secondary, tertiary, surface, container)
            for (i in previews.indices) previews[i].setBackgroundColor(colors[i])
            findViewById<TextView>(R.id.editorPreviewText).text =
                "主色 #%06X · 副色 #%06X · 第三色 #%06X".format(
                    0xFFFFFF and primary, 0xFFFFFF and secondary, 0xFFFFFF and tertiary)
            val hex = "#%06X".format(0xFFFFFF and primary)
            if (hexInput.text.toString() != hex) hexInput.setText(hex)
        }
        fun bindSeek(id: Int, initial: Int, onChange: (Int) -> Unit) {
            findViewById<SeekBar>(id).apply {
                max = if (id == R.id.seekHue) 360 else 100
                progress = initial
                setOnSeekBarChangeListener(object : SeekBar.OnSeekBarChangeListener {
                    override fun onProgressChanged(s: SeekBar?, p: Int, fromUser: Boolean) {
                        if (fromUser) { onChange(p); refresh() }
                    }
                    override fun onStartTrackingTouch(s: SeekBar?) {}
                    override fun onStopTrackingTouch(s: SeekBar?) {}
                })
            }
        }
        bindSeek(R.id.seekHue, hue) { hue = it }
        bindSeek(R.id.seekChroma, chroma) { chroma = it }
        bindSeek(R.id.seekTone, tone) { tone = it }
        hexInput.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) {}
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {}
            override fun afterTextChanged(s: Editable?) {
                val raw = s.toString().trim().removePrefix("#")
                if (raw.length == 6) {
                    try {
                        val c = Color.parseColor("#$raw")
                        val hsv = FloatArray(3)
                        Color.colorToHSV(c, hsv)
                        hue = hsv[0].toInt()
                        chroma = (hsv[1] * 100).toInt()
                        tone = (hsv[2] * 100).toInt()
                        findViewById<SeekBar>(R.id.seekHue).progress = hue
                        findViewById<SeekBar>(R.id.seekChroma).progress = chroma
                        findViewById<SeekBar>(R.id.seekTone).progress = tone
                        refresh()
                    } catch (_: IllegalArgumentException) {
                        // Invalid hex: keep current preview, do not crash
                    }
                }
            }
        })
        findViewById<MaterialButton>(R.id.btnEditorSave).setOnClickListener {
            val n = ThemeStore.getCustomSchemes(this).size + 1
            ThemeStore.addCustomScheme(this, "自定义 %d（H%d）".format(n, hue))
            finish()
        }
        findViewById<MaterialButton>(R.id.btnEditorDelete).setOnClickListener {
            val list = ThemeStore.getCustomSchemes(this)
            if (list.isNotEmpty()) {
                ThemeStore.deleteCustomScheme(this, list.last())
            }
            finish()
        }
        refresh()
    }
}
