/**
 * 全局主题颜色字典
 * 每个主题定义：标题色、高亮文字色、高亮背景色、下划线色
 */

export interface ThemeConfig {
  headingColor: string
  highlightText: string
  highlightBg: string
  underlineColor: string
  tableTheme: string
}

export interface TableThemeConfig {
  table: string
  th: string
  td: string
}

export const TABLE_THEMES: Record<string, TableThemeConfig> = {
  knowledge: {
    table: 'width: 100%; border-collapse: collapse; font-size: 14px; margin: 20px auto; table-layout: fixed; word-wrap: break-word;',
    th: 'border: 1px solid #E4E7ED; padding: 12px 8px; background-color: #F5F7FA; color: #2B4A6F; font-weight: bold; text-align: left;',
    td: 'border: 1px solid #E4E7ED; padding: 12px 8px; color: #555555;',
  },
  humanity: {
    table: 'width: 100%; border-collapse: collapse; font-size: 14px; margin: 20px auto; table-layout: fixed; word-wrap: break-word; border-top: 2px solid #7D8D7B; border-bottom: 2px solid #7D8D7B;',
    th: 'padding: 12px 8px; border-bottom: 1px solid #7D8D7B; color: #7D8D7B; font-weight: bold; text-align: left;',
    td: 'padding: 12px 8px; border-bottom: 1px dashed #EAEAEA; color: #555555;',
  },
  minimalist: {
    table: 'width: 100%; border-collapse: collapse; font-size: 14px; margin: 20px auto; table-layout: fixed; word-wrap: break-word; border: 1px solid #F0F0F0;',
    th: 'padding: 12px 8px; background-color: #B06A54; color: #FFFFFF; font-weight: bold; text-align: left; border: none;',
    td: 'padding: 12px 8px; border-bottom: 1px solid #F0F0F0; color: #333333;',
  },
}

export const THEME_CONFIGS: Record<string, ThemeConfig> = {
  knowledge: {
    headingColor: '#2B4A6F',
    highlightText: '#1A3250',
    highlightBg: '#EAEFF4',
    underlineColor: '#849CB5',
    tableTheme: 'knowledge',
  },
  humanity: {
    headingColor: '#7D8D7B',
    highlightText: '#536151',
    highlightBg: '#F1F4F0',
    underlineColor: '#B3BEB1',
    tableTheme: 'humanity',
  },
  minimalist: {
    headingColor: '#B06A54',
    highlightText: '#8C4E3A',
    highlightBg: '#F7EDEA',
    underlineColor: '#D6BDB6',
    tableTheme: 'minimalist',
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

  // 根据品牌色推导表格主题
  const tableTheme = brandColor === '#2B4A6F' ? 'knowledge'
    : brandColor === '#7D8D7B' ? 'humanity'
    : brandColor === '#B06A54' ? 'minimalist'
    : 'knowledge'

  return {
    headingColor: brandColor,
    highlightText: `#${toHex(textR)}${toHex(textG)}${toHex(textB)}`,
    highlightBg: `#${toHex(bgR)}${toHex(bgG)}${toHex(bgB)}`,
    underlineColor: `#${toHex(ulR)}${toHex(ulG)}${toHex(ulB)}`,
    tableTheme,
  }
}
