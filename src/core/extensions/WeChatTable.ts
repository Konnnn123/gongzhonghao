import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { mergeAttributes } from '@tiptap/core'
import { TABLE_THEMES } from '../themes/themeConfigs'

/**
 * 微信公众号表格扩展 —— 安全继承法
 *
 * 核心原则：
 * 1. addAttributes 用 this.parent?.() 保留原生 colspan/rowspan 等属性
 * 2. renderHTML 用 mergeAttributes 合并结构和样式
 * 3. 不覆盖 parseHTML（让 TipTap 原生解析接管）
 */

const defaultTheme = TABLE_THEMES.knowledge

export const WeChatTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      inlineStyle: { default: defaultTheme.table },
    }
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return [
      'div',
      { style: 'overflow-x: auto; margin: 20px 0; width: 100%;' },
      ['table', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
        style: HTMLAttributes.inlineStyle,
      }), ['tbody', 0]],
    ]
  },
})

export const WeChatTableRow = TableRow.extend({
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['tr', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes), 0]
  },
})

export const WeChatTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      inlineStyle: { default: defaultTheme.th },
    }
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['th', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      style: HTMLAttributes.inlineStyle,
    }), 0]
  },
})

export const WeChatTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      inlineStyle: { default: defaultTheme.td },
    }
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['td', mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
      style: HTMLAttributes.inlineStyle,
    }), 0]
  },
})
