import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { TABLE_THEMES } from '../themes/themeConfigs'

/**
 * 微信公众号表格扩展
 * 所有样式通过 inlineStyle 属性注入，不依赖 CSS class
 */

const defaultTheme = TABLE_THEMES.knowledge

export const WeChatTable = Table.extend({
  addAttributes() {
    return {
      inlineStyle: { default: defaultTheme.table },
    }
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return [
      'div',
      { style: 'overflow-x: auto; margin: 20px 0;' },
      ['table', { style: HTMLAttributes.inlineStyle }, ['tbody', 0]],
    ]
  },
})

export const WeChatTableRow = TableRow.extend({
  renderHTML() {
    return ['tr', 0]
  },
})

export const WeChatTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      inlineStyle: { default: defaultTheme.th },
    }
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['th', { style: HTMLAttributes.inlineStyle }, 0]
  },
})

export const WeChatTableCell = TableCell.extend({
  addAttributes() {
    return {
      inlineStyle: { default: defaultTheme.td },
    }
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['td', { style: HTMLAttributes.inlineStyle }, 0]
  },
})
