import { Extension } from '@tiptap/core'

/**
 * TableStyleExtension —— 旁路属性注入
 *
 * 不修改任何原生表格节点，只通过 addGlobalAttributes
 * 给 table/tableHeader/tableCell 强行开一个 inlineStyle 属性
 * 然后在 renderHTML 中将 inlineStyle 转为 style="..." 输出
 */

const DEFAULT_TABLE_STYLE = 'width: 100%; border-collapse: collapse; font-size: 14px; margin: 20px auto; table-layout: fixed; word-wrap: break-word;'
const DEFAULT_TH_STYLE = 'border: 1px solid #E4E7ED; padding: 12px 8px; background-color: #2B4A6F; color: #FFFFFF; font-weight: bold; text-align: left;'
const DEFAULT_TD_STYLE = 'border: 1px solid #E4E7ED; padding: 12px 8px; color: #444444;'

export const TableStyleExtension = Extension.create({
  name: 'tableStyleExtension',

  addGlobalAttributes() {
    return [
      {
        types: ['table'],
        attributes: {
          inlineStyle: {
            default: DEFAULT_TABLE_STYLE,
            parseHTML: (el: HTMLElement) => el.getAttribute('style'),
            renderHTML: (attrs: Record<string, any>) => {
              if (!attrs.inlineStyle) return {}
              return { style: attrs.inlineStyle }
            },
          },
        },
      },
      {
        types: ['tableHeader'],
        attributes: {
          inlineStyle: {
            default: DEFAULT_TH_STYLE,
            parseHTML: (el: HTMLElement) => el.getAttribute('style'),
            renderHTML: (attrs: Record<string, any>) => {
              if (!attrs.inlineStyle) return {}
              return { style: attrs.inlineStyle }
            },
          },
        },
      },
      {
        types: ['tableCell'],
        attributes: {
          inlineStyle: {
            default: DEFAULT_TD_STYLE,
            parseHTML: (el: HTMLElement) => el.getAttribute('style'),
            renderHTML: (attrs: Record<string, any>) => {
              if (!attrs.inlineStyle) return {}
              return { style: attrs.inlineStyle }
            },
          },
        },
      },
    ]
  },
})
