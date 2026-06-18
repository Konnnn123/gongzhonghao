import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'

/**
 * 微信公众号表格扩展 —— 属性注入法
 *
 * 铁律：绝不修改原生 HTML 标签结构（不包裹 <div>）
 * 只通过 addAttributes 的 renderHTML 注入 style 属性
 */

const DEFAULT_TABLE_STYLE = 'width: 100%; border-collapse: collapse; font-size: 14px; margin: 20px auto; table-layout: fixed; word-wrap: break-word;'
const DEFAULT_TH_STYLE = 'border: 1px solid #E4E7ED; padding: 12px 8px; background-color: #F5F7FA; color: #2B4A6F; font-weight: bold; text-align: left;'
const DEFAULT_TD_STYLE = 'border: 1px solid #E4E7ED; padding: 12px 8px; color: #555555;'

export const WeChatTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      inlineStyle: {
        default: DEFAULT_TABLE_STYLE,
        parseHTML: (el: HTMLElement) => el.getAttribute('style'),
        renderHTML: (attrs: Record<string, any>) =>
          attrs.inlineStyle ? { style: attrs.inlineStyle } : {},
      },
    }
  },
})

export const WeChatTableRow = TableRow.extend({})

export const WeChatTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      inlineStyle: {
        default: DEFAULT_TH_STYLE,
        parseHTML: (el: HTMLElement) => el.getAttribute('style'),
        renderHTML: (attrs: Record<string, any>) =>
          attrs.inlineStyle ? { style: attrs.inlineStyle } : {},
      },
    }
  },
})

export const WeChatTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      inlineStyle: {
        default: DEFAULT_TD_STYLE,
        parseHTML: (el: HTMLElement) => el.getAttribute('style'),
        renderHTML: (attrs: Record<string, any>) =>
          attrs.inlineStyle ? { style: attrs.inlineStyle } : {},
      },
    }
  },
})
