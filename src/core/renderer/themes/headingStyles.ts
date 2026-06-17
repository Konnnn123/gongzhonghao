import type { HeadingStylePreset, TypographyConfig } from '../../../types'

/**
 * 生成标题内联样式
 * 三级标题拉开明显的视觉层次
 */
export function getHeadingStyle(
  preset: HeadingStylePreset,
  level: number,
  typography: TypographyConfig
): string {
  const { brandColor } = typography

  if (level === 1) {
    return getH1Style(preset, brandColor)
  }
  if (level === 2) {
    return getH2Style(preset, brandColor)
  }
  if (level === 3) {
    return getH3Style(preset, brandColor)
  }
  // H4-H6 简化
  return `font-size: 14px; font-weight: 600; color: #1d2129; margin-top: 20px; margin-bottom: 8px;`
}

/**
 * H1 —— 核心大章节
 * 特征：居中 / 底部粗边框 / 大字号 / 深色文字
 */
function getH1Style(preset: HeadingStylePreset, brandColor: string): string {
  switch (preset) {
    case 'block':
      return [
        'font-size: 20px',
        'font-weight: bold',
        'color: #1d2129',
        'text-align: center',
        `border-bottom: 2px solid ${brandColor}`,
        'padding-bottom: 8px',
        'margin-top: 32px',
        'margin-bottom: 20px',
        'line-height: 1.4',
      ].join('; ')
    case 'numbered':
      return [
        'font-size: 20px',
        'font-weight: bold',
        'color: #1d2129',
        'text-align: center',
        `border-bottom: 2px solid ${brandColor}`,
        'padding-bottom: 8px',
        'margin-top: 32px',
        'margin-bottom: 20px',
        'line-height: 1.4',
      ].join('; ')
    case 'centered':
      return [
        'font-size: 20px',
        'font-weight: bold',
        `color: ${brandColor}`,
        'text-align: center',
        `border-bottom: 2px solid ${brandColor}`,
        'padding-bottom: 8px',
        'margin-top: 32px',
        'margin-bottom: 20px',
        'line-height: 1.4',
      ].join('; ')
  }
}

/**
 * H2 —— 小节点 / 子章节
 * 特征：左对齐 / 品牌色文字 / 浅色背景色块 / 圆角
 */
function getH2Style(preset: HeadingStylePreset, brandColor: string): string {
  switch (preset) {
    case 'block':
      return [
        'font-size: 17px',
        'font-weight: bold',
        `color: ${brandColor}`,
        'text-align: left',
        `background-color: ${brandColor}08`,
        'padding: 6px 12px',
        'border-radius: 4px',
        `border-left: 3px solid ${brandColor}`,
        'margin-top: 24px',
        'margin-bottom: 12px',
        'line-height: 1.5',
      ].join('; ')
    case 'numbered':
      return [
        'font-size: 17px',
        'font-weight: bold',
        `color: ${brandColor}`,
        'text-align: left',
        `background-color: ${brandColor}08`,
        'padding: 6px 12px',
        'border-radius: 4px',
        'margin-top: 24px',
        'margin-bottom: 12px',
        'line-height: 1.5',
      ].join('; ')
    case 'centered':
      return [
        'font-size: 17px',
        'font-weight: bold',
        `color: ${brandColor}`,
        'text-align: left',
        `background-color: ${brandColor}08`,
        'padding: 6px 12px',
        'border-radius: 4px',
        'margin-top: 24px',
        'margin-bottom: 12px',
        'line-height: 1.5',
      ].join('; ')
  }
}

/**
 * H3 —— 子论点 / 细分标题
 * 特征：更小字号 / 深色文字 / 简洁 / 左对齐
 */
function getH3Style(preset: HeadingStylePreset, brandColor: string): string {
  switch (preset) {
    case 'block':
      return [
        'font-size: 15px',
        'font-weight: 600',
        'color: #1d2129',
        'text-align: left',
        'margin-top: 20px',
        'margin-bottom: 8px',
        'line-height: 1.5',
      ].join('; ')
    case 'numbered':
      return [
        'font-size: 15px',
        'font-weight: 600',
        `color: ${brandColor}`,
        'text-align: left',
        'margin-top: 20px',
        'margin-bottom: 8px',
        'line-height: 1.5',
      ].join('; ')
    case 'centered':
      return [
        'font-size: 15px',
        'font-weight: 600',
        'color: #1d2129',
        'text-align: left',
        'margin-top: 20px',
        'margin-bottom: 8px',
        'line-height: 1.5',
      ].join('; ')
  }
}
