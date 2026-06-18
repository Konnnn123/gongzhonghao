import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'

/**
 * 微信公众号表格 —— addAttributes 注入法
 *
 * 原则：
 * 1. 用 extend + addAttributes 注入 style 属性（不覆盖 renderHTML）
 * 2. TipTap 自动将 attrs.style 合并到原生 <table>/<th>/<td> 的 style 上
 * 3. 不包裹 <div>，不修改标签结构
 * 4. 保留 this.parent?.() 以防丢失 colspan/rowspan
 */

const NEURO_TABLE_STYLE = 'width: 100%; border-collapse: collapse; font-size: 14px; margin: 20px auto; table-layout: fixed; word-wrap: break-word;'
const NEURO_TH_STYLE = 'border: 1px solid #E4E7ED; padding: 12px 8px; background-color: #2B4A6F; color: #FFFFFF; font-weight: bold; text-align: left;'
const NEURO_TD_STYLE = 'border: 1px solid #E4E7ED; padding: 12px 8px; color: #444444;'

export const WeChatTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: { default: NEURO_TABLE_STYLE },
    }
  },
})

export const WeChatTableRow = TableRow.extend({})

export const WeChatTableHeader = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: { default: NEURO_TH_STYLE },
    }
  },
})

export const WeChatTableCell = TableCell.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: { default: NEURO_TD_STYLE },
    }
  },
})
