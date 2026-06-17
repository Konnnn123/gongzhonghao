/**
 * 全局主题颜色字典
 * 每个主题定义：标题色、高亮文字色、高亮背景色、下划线色
 */

export interface ThemeConfig {
  headingColor: string
  highlightText: string
  highlightBg: string
  underlineColor: string
}

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  knowledge: {
    headingColor: '#2B4A6F',
    highlightText: '#1A3250',
    highlightBg: '#EAEFF4',
    underlineColor: '#849CB5',
  },
  humanity: {
    headingColor: '#7D8D7B',
    highlightText: '#536151',
    highlightBg: '#F1F4F0',
    underlineColor: '#B3BEB1',
  },
  minimalist: {
    headingColor: '#B06A54',
    highlightText: '#8C4E3A',
    highlightBg: '#F7EDEA',
    underlineColor: '#D6BDB6',
  },
}

/** 根据品牌色自动推导主题配置 */
export function deriveThemeConfig(brandColor: string): ThemeConfig {
  const hex = brandColor.replace('#', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  // 高亮背景：88% 白 + 12% 品牌色
  const bgR = Math.round(r * 0.12 + 255 * 0.88)
  const bgG = Math.round(g * 0.12 + 255 * 0.88)
  const bgB = Math.round(b * 0.12 + 255 * 0.88)

  // 高亮文字：加深版品牌色
  const textR = Math.round(r * 0.75)
  const textG = Math.round(g * 0.75)
  const textB = Math.round(b * 0.75)

  // 下划线色：50% 品牌色 + 50% 灰
  const ulR = Math.round(r * 0.5 + 180 * 0.5)
  const ulG = Math.round(g * 0.5 + 180 * 0.5)
  const ulB = Math.round(b * 0.5 + 180 * 0.5)

  const toHex = (n: number) => Math.max(0, Math.min(255, n)).toString(16).padStart(2, '0')

  return {
    headingColor: brandColor,
    highlightText: `#${toHex(textR)}${toHex(textG)}${toHex(textB)}`,
    highlightBg: `#${toHex(bgR)}${toHex(bgG)}${toHex(bgB)}`,
    underlineColor: `#${toHex(ulR)}${toHex(ulG)}${toHex(ulB)}`,
  }
}
