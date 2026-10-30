package com.example.voyagetheme

import android.content.Context
import android.graphics.Color
import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter
import android.graphics.Paint
import android.graphics.drawable.GradientDrawable
import android.util.TypedValue
import android.view.View
import android.widget.SeekBar
import androidx.appcompat.widget.SwitchCompat
import com.google.android.material.button.MaterialButton
import com.google.android.material.card.MaterialCardView
import com.google.android.material.shape.CornerFamily
import com.google.android.material.shape.ShapeAppearanceModel

/**
 * Functional effects for theme controls that were previously "record only".
 * Colour-vision matrices are standard simulation matrices, NOT the original
 * Voyage matrix (which was not decoded). Switch/slider/shape drawings are
 * View approximations of the original Compose drawings, NOT 1:1 copies.
 */
object ThemeEffects {
    fun resolveColor(context: Context, attr: Int): Int {
        val tv = TypedValue()
        context.theme.resolveAttribute(attr, tv, true)
        return tv.data
    }

    fun applyColorVision(decorView: View, colorBlind: Int, invert: Boolean) {
        if (colorBlind == 0 && !invert) {
            decorView.setLayerType(View.LAYER_TYPE_NONE, null)
            return
        }
        val m = ColorMatrix()
        if (invert) {
            m.set(floatArrayOf(
                -1f, 0f, 0f, 0f, 255f,
                0f, -1f, 0f, 0f, 255f,
                0f, 0f, -1f, 0f, 255f,
                0f, 0f, 0f, 1f, 0f
            ))
        }
        // Standard colour-vision-deficiency simulation matrices (approx).
        val sim: FloatArray? = when (colorBlind) {
            1 -> floatArrayOf(0.567f, 0.433f, 0f, 0f, 0f, 0.558f, 0.442f, 0f, 0f, 0f, 0f, 0.242f, 0.758f, 0f, 0f, 0f, 0f, 0f, 1f, 0f) // protanopia
            2 -> floatArrayOf(0.817f, 0.183f, 0f, 0f, 0f, 0.333f, 0.667f, 0f, 0f, 0f, 0f, 0.125f, 0.875f, 0f, 0f, 0f, 0f, 0f, 1f, 0f) // protanomaly
            3 -> floatArrayOf(0.625f, 0.375f, 0f, 0f, 0f, 0.7f, 0.3f, 0f, 0f, 0f, 0f, 0.3f, 0.7f, 0f, 0f, 0f, 0f, 0f, 1f, 0f) // deuteranopia
            4 -> floatArrayOf(0.8f, 0.2f, 0f, 0f, 0f, 0.258f, 0.742f, 0f, 0f, 0f, 0f, 0.142f, 0.858f, 0f, 0f, 0f, 0f, 0f, 1f, 0f) // deuteranomaly
            5 -> floatArrayOf(0.95f, 0.05f, 0f, 0f, 0f, 0f, 0.433f, 0.567f, 0f, 0f, 0f, 0.475f, 0.525f, 0f, 0f, 0f, 0f, 0f, 1f, 0f) // tritanopia
            6 -> floatArrayOf(0.967f, 0.033f, 0f, 0f, 0f, 0f, 0.733f, 0.267f, 0f, 0f, 0f, 0.183f, 0.817f, 0f, 0f, 0f, 0f, 0f, 1f, 0f) // tritanomaly
            7 -> floatArrayOf(0.299f, 0.587f, 0.114f, 0f, 0f, 0.299f, 0.587f, 0.114f, 0f, 0f, 0.299f, 0.587f, 0.114f, 0f, 0f, 0f, 0f, 0f, 1f, 0f) // achromatopsia
            8 -> floatArrayOf(0.618f, 0.320f, 0.062f, 0f, 0f, 0.163f, 0.775f, 0.062f, 0f, 0f, 0.163f, 0.320f, 0.516f, 0f, 0f, 0f, 0f, 0f, 1f, 0f) // achromatomaly
            else -> null
        }
        if (sim != null) {
            val cm = ColorMatrix(sim)
            if (invert) m.postConcat(cm) else m.set(cm)
        }
        val paint = Paint()
        paint.colorFilter = ColorMatrixColorFilter(m)
        decorView.setLayerType(View.LAYER_TYPE_HARDWARE, paint)
    }

    private fun pill(color: Int, radiusDp: Float, context: Context): GradientDrawable {
        val d = GradientDrawable()
        d.shape = GradientDrawable.RECTANGLE
        d.cornerRadius = radiusDp * context.resources.displayMetrics.density
        d.setColor(color)
        return d
    }

    fun applySwitchStyle(switch: SwitchCompat, style: Int, context: Context) {
        val primary = resolveColor(context, com.google.android.material.R.attr.colorPrimary)
        val onPrimary = resolveColor(context, com.google.android.material.R.attr.colorOnPrimary)
        val outline = resolveColor(context, com.google.android.material.R.attr.colorOutline)
        val density = context.resources.displayMetrics.density
        when (style) {
            1 -> { // Cupertino: white thumb, pill track
                switch.thumbDrawable = pill(Color.WHITE, 16f, context)
                switch.trackDrawable = pill(primary, 16f, context)
            }
            2 -> { // Fluent: rounded-rect thumb/track
                switch.thumbDrawable = pill(onPrimary, 4f, context)
                switch.trackDrawable = pill(primary, 4f, context)
            }
            3 -> { // HyperOS: larger thumb
                val thumb = pill(onPrimary, 16f, context)
                thumb.setSize((28 * density).toInt(), (28 * density).toInt())
                switch.thumbDrawable = thumb
                switch.trackDrawable = pill(primary, 16f, context)
            }
            4 -> { // Liquid Glass: translucent track
                val track = pill(primary, 16f, context)
                track.alpha = 128
                switch.trackDrawable = track
                switch.thumbDrawable = pill(Color.WHITE, 16f, context)
            }
            6 -> { // One UI: pill, larger thumb
                val thumb = pill(onPrimary, 16f, context)
                thumb.setSize((26 * density).toInt(), (26 * density).toInt())
                switch.thumbDrawable = thumb
                switch.trackDrawable = pill(primary, 16f, context)
            }
            else -> { // Compose / Material You / Fluent fallback / Pixel: pill + circle thumb
                switch.thumbDrawable = pill(onPrimary, 16f, context)
                switch.trackDrawable = pill(primary, 16f, context)
            }
        }
        // Keep outline visible when off via track tint fallback is not possible
        // with a plain drawable; the drawable colours above are the on-state.
        @Suppress("UNUSED_VARIABLE") val unused = outline
    }

    fun applySliderStyle(slider: SeekBar, style: Int, context: Context) {
        val primary = resolveColor(context, com.google.android.material.R.attr.colorPrimary)
        val secondary = resolveColor(context, com.google.android.material.R.attr.colorSecondary)
        val density = context.resources.displayMetrics.density
        when (style) {
            0 -> { // Fancy: large thumb
                val thumb = pill(primary, 16f, context)
                thumb.setSize((28 * density).toInt(), (28 * density).toInt())
                slider.thumb = thumb
                slider.progressTintList = android.content.res.ColorStateList.valueOf(primary)
            }
            1 -> { // HyperOS: rounded-rect thumb
                slider.thumb = pill(primary, 4f, context)
                slider.progressTintList = android.content.res.ColorStateList.valueOf(primary)
            }
            2 -> { // Material 2: small thumb, secondary colour
                val thumb = pill(secondary, 16f, context)
                thumb.setSize((16 * density).toInt(), (16 * density).toInt())
                slider.thumb = thumb
                slider.progressTintList = android.content.res.ColorStateList.valueOf(secondary)
            }
            else -> { // Material You: circle thumb, primary
                slider.thumb = pill(primary, 16f, context)
                slider.progressTintList = android.content.res.ColorStateList.valueOf(primary)
            }
        }
    }

    fun applyShapeStyle(card: MaterialCardView, button: MaterialButton, style: Int, context: Context) {
        val density = context.resources.displayMetrics.density
        val radius = 16f * density
        val builder = ShapeAppearanceModel.builder()
        when (style) {
            1 -> builder.setAllCorners(CornerFamily.CUT, radius) // 切角
            2 -> builder.setAllCorners(CornerFamily.ROUNDED, radius) // 超椭圆近似为圆角
            3 -> builder.setAllCorners(CornerFamily.ROUNDED, radius * 1.5f) // 平滑近似为大圆角
            4 -> builder.setAllCorners(CornerFamily.ROUNDED, radius) // 波浪近似为圆角
            5 -> builder.setAllCorners(CornerFamily.CUT, radius * 0.5f) // 内凹近似为小切角
            6 -> builder.setAllCorners(CornerFamily.CUT, radius * 0.5f) // 缺口近似为小切角
            else -> builder.setAllCorners(CornerFamily.ROUNDED, radius) // 圆角
        }
        val model = builder.build()
        card.shapeAppearanceModel = model
        button.shapeAppearanceModel = model
    }

    fun applyIconShapePreview(view: View, shape: Int, context: Context) {
        val paper = resolveColor(context, com.google.android.material.R.attr.colorSurface)
        val density = context.resources.displayMetrics.density
        if (shape == -1) {
            view.background = null
            return
        }
        val radius = when {
            shape == 50 -> 24f
            shape in 0..9 -> (4 + shape * 3).toFloat()
            else -> 16f
        }
        val d = GradientDrawable()
        d.shape = GradientDrawable.RECTANGLE
        d.cornerRadius = radius * density
        d.setColor(paper)
        d.setStroke((1 * density).toInt(), resolveColor(context, com.google.android.material.R.attr.colorOutline))
        view.background = d
    }
}
