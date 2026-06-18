import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'
import { mergeAttributes } from '@tiptap/core'

/**
 * WeChatTable —— 基于 class 的主题切换方案
 *
 * 1. 通过 theme 属性控制 CSS class（table-theme-knowledge/humanity/minimalist）
 * 2. renderHTML 输出 ['table', { class, ... }, 0]（0 = 内容占位，不写死 tbody）
 * 3. CSS 接管所有视觉样式
 */

export const CustomTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      theme: {
        default: 'knowledge',
        parseHTML: (el: HTMLElement) => {
          const cls = el.className
          if (cls.includes('table-theme-humanity')) return 'humanity'
          if (cls.includes('table-theme-minimalist')) return 'minimalist'
          return 'knowledge'
        },
        renderHTML: (attrs: Record<string, any>) => ({
          class: `neuro-table table-theme-${attrs.theme || 'knowledge'}`,
        }),
      },
    }
  },

  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['table', mergeAttributes(HTMLAttributes), 0]
  },
})

export const CustomTableRow = TableRow.extend({})
export const CustomTableHeader = TableHeader.extend({})
export const CustomTableCell = TableCell.extend({})
