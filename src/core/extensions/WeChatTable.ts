import { Table } from '@tiptap/extension-table'
import { TableRow } from '@tiptap/extension-table-row'
import { TableHeader } from '@tiptap/extension-table-header'
import { TableCell } from '@tiptap/extension-table-cell'

/**
 * 微信公众号表格扩展 —— 属性注入法（品牌化默认样式）
 *
 * 铁律：
 * 1. 不包裹 <div>，保持原生 Schema 完整
 * 2. 通过 addAttributes 注入 style，TipTap 自动合并到原生标签
 * 3. 任何新进入的表格（导入/粘贴/新建）都自带品牌样式
 */

const NEURO_TABLE_STYLE = 'width: 100%; border-collapse: collapse; font-size: 14px; margin: 20px auto; table-layout: fixed;'
const NEURO_TH_STYLE = 'border: 1px solid #E4E7ED; padding: 12px 8px; background-color: #2B4A6F; color: #FFFFFF; font-weight: bold; text-align: left;'
const NEURO_TD_STYLE = 'border: 1px solid #E4E7ED; padding: 12px 8px; color: #444444;'

export const WeChatTable = Table.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      style: { default: NEURO_TABLE_STYLE },
    }
  },
  renderHTML({ HTMLAttributes }: { HTMLAttributes: Record<string, any> }) {
    return ['table', HTMLAttributes, ['tbody', 0]]
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
