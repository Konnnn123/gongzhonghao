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

  // 从 HTML <table style="..."> 中读取 inlineStyle
  parseHTML() {
    return [
      {
        tag: 'table',
        getAttrs: (el: HTMLElement) => ({
          inlineStyle: el.getAttribute('style') || defaultTheme.table,
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return [
      'div',
      { style: 'overflow-x: auto; margin: 20px 0;' },
      ['table', { style: HTMLAttributes.inlineStyle || defaultTheme.table }, ['tbody', 0]],
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

  parseHTML() {
    return [
      {
        tag: 'th',
        getAttrs: (el: HTMLElement) => ({
          inlineStyle: el.getAttribute('style') || defaultTheme.th,
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['th', { style: HTMLAttributes.inlineStyle || defaultTheme.th }, 0]
  },
})

export const WeChatTableCell = TableCell.extend({
  addAttributes() {
    return {
      inlineStyle: { default: defaultTheme.td },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'td',
        getAttrs: (el: HTMLElement) => ({
          inlineStyle: el.getAttribute('style') || defaultTheme.td,
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['td', { style: HTMLAttributes.inlineStyle || defaultTheme.td }, 0]
  },
})
