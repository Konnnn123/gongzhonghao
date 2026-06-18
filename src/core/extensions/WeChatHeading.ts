import { Node } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'

/**
 * WeChatHeading —— 微信公众号专用标题节点
 *
 * 核心原则：
 * 1. 所有标题用 <section>，不用 <h2>/<h3>
 * 2. 所有 CSS 简写拆开
 * 3. appendTransaction 自动计算 H2 序号
 */

function h2Styles(bc: string, idx: string) {
  return {
    'number-circle': {
      tag: 'section',
      attrs: { style: `margin-top: 28px; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;` },
      children: [
        { tag: 'span', attrs: { style: `display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; background-color: ${bc}; color: #ffffff; border-radius: 50%; font-size: 14px; font-weight: bold;` }, children: [{ type: 'text', text: idx }] },
        { tag: 'span', attrs: { style: `color: #cbd5e1; font-size: 18px; margin-left: 2px; margin-right: 2px;` }, children: [{ type: 'text', text: '/' }] },
        { tag: 'strong', attrs: { style: `font-size: 17px; color: #333333; font-weight: bold;` }, children: [0] },
      ],
    },
    'color-block': {
      tag: 'section',
      attrs: { style: `margin-top: 28px; margin-bottom: 12px;` },
      children: [
        { tag: 'span', attrs: { style: `display: inline-block; background-color: ${bc}; color: #ffffff; font-size: 17px; font-weight: bold; padding-top: 6px; padding-bottom: 6px; padding-left: 16px; padding-right: 16px; border-radius: 4px;` }, children: [0] },
      ],
    },
    'double-line': {
      tag: 'section',
      attrs: { style: `margin-top: 28px; margin-bottom: 12px; text-align: center;` },
      children: [
        { tag: 'section', attrs: { style: `display: inline-block; border-top-width: 2px; border-top-style: solid; border-top-color: #333333; border-bottom-width: 1px; border-bottom-style: solid; border-bottom-color: #cccccc; padding-top: 6px; padding-bottom: 6px; padding-left: 20px; padding-right: 20px;` }, children: [
          { tag: 'strong', attrs: { style: `font-size: 18px; color: #333333; font-weight: bold; letter-spacing: 1px;` }, children: [0] },
        ]},
      ],
    },
    'number-guide': {
      tag: 'section',
      attrs: { style: `margin-top: 28px; margin-bottom: 12px; display: flex; align-items: baseline; border-bottom-width: 2px; border-bottom-style: solid; border-bottom-color: ${bc}; padding-bottom: 2px;` },
      children: [
        { tag: 'span', attrs: { style: `font-size: 24px; font-weight: 900; color: ${bc}; opacity: 0.3; font-style: italic; margin-right: 8px;` }, children: [{ type: 'text', text: idx }] },
        { tag: 'strong', attrs: { style: `font-size: 18px; color: ${bc}; font-weight: bold;` }, children: [0] },
      ],
    },
    'brand-bg': {
      tag: 'section',
      attrs: { style: `margin-top: 28px; margin-bottom: 12px; font-size: 17px; font-weight: bold; color: ${bc}; background-color: ${bc}10; padding-top: 6px; padding-bottom: 6px; padding-left: 12px; padding-right: 12px; border-radius: 4px; line-height: 1.5;` },
      children: [0],
    },
    'bottom-line': {
      tag: 'section',
      attrs: { style: `margin-top: 28px; margin-bottom: 12px; font-size: 17px; font-weight: bold; color: #333333; border-bottom-width: 2px; border-bottom-style: solid; border-bottom-color: ${bc}; padding-bottom: 6px; line-height: 1.5;` },
      children: [0],
    },
  }
}

function h3Styles(bc: string) {
  return {
    'left-bar': {
      tag: 'section',
      attrs: { style: `margin-top: 20px; margin-bottom: 10px; font-size: 16px; font-weight: 600; color: ${bc}; padding-top: 6px; padding-bottom: 6px; padding-left: 10px; padding-right: 10px; border-left-width: 4px; border-left-style: solid; border-left-color: ${bc}; background-color: ${bc}0D; border-radius: 0px 4px 4px 0px; line-height: 1.5;` },
      children: [0],
    },
    'capsule': {
      tag: 'section',
      attrs: { style: `margin-top: 20px; margin-bottom: 10px; display: inline-flex; align-items: center;` },
      children: [
        { tag: 'span', attrs: { style: `display: inline-block; border-width: 1px; border-style: solid; border-color: ${bc}; color: ${bc}; font-size: 14px; padding-top: 2px; padding-bottom: 2px; padding-left: 10px; padding-right: 10px; border-radius: 12px; margin-right: 8px;` }, children: [{ type: 'text', text: '要点' }] },
        { tag: 'strong', attrs: { style: `font-size: 16px; color: #333333; font-weight: bold;` }, children: [0] },
      ],
    },
    'solid-block': {
      tag: 'section',
      attrs: { style: `margin-top: 25px; margin-bottom: 10px; display: flex; align-items: center;` },
      children: [
        { tag: 'span', attrs: { style: `display: inline-block; width: 6px; height: 16px; background-color: ${bc}; margin-right: 8px; border-radius: 2px;` }, children: [] },
        { tag: 'strong', attrs: { style: `font-size: 16px; color: #333333; font-weight: bold;` }, children: [0] },
      ],
    },
    'dashed-underline': {
      tag: 'section',
      attrs: { style: `margin-top: 20px; margin-bottom: 10px; font-size: 16px; font-weight: bold; color: #555555; border-bottom-width: 1px; border-bottom-style: dashed; border-bottom-color: ${bc}; padding-bottom: 4px; display: inline-block;` },
      children: [0],
    },
    'plain-bold': {
      tag: 'section',
      attrs: { style: `margin-top: 20px; margin-bottom: 10px; font-size: 16px; font-weight: 700; color: #1d2129; line-height: 1.5;` },
      children: [0],
    },
    'brand-text': {
      tag: 'section',
      attrs: { style: `margin-top: 20px; margin-bottom: 10px; font-size: 16px; font-weight: 600; color: ${bc}; line-height: 1.5;` },
      children: [0],
    },
  }
}

function buildRenderNode(node: any): any {
  if (node === 0 || node?.type === 0) return 0
  if (typeof node === 'string' || node?.type === 'text') return node?.text ?? node
  if (node?.tag) {
    return [node.tag, node.attrs || {}, ...(node.children || []).map(buildRenderNode)]
  }
  return node
}

const autoNumberPlugin = new Plugin({
  key: new PluginKey('autoNumberWechatHeading'),
  appendTransaction: (transactions, _oldState, newState) => {
    if (!transactions.some((tr: any) => tr.docChanged)) return null

    let tr = newState.tr
    let modified = false
    let h2Counter = 1

    newState.doc.descendants((node: any, pos: number) => {
      // 【免疫隔离】：表格内的节点绝对不碰
      if (node.type.name === 'table' || node.type.name === 'tableCell' || node.type.name === 'tableHeader') {
        return false // 返回 false 阻止递归进入表格内部
      }

      if (node.type.name === 'wechatHeading' && node.attrs.headingLevel === 2) {
        if (node.attrs.index !== h2Counter) {
          tr = tr.setNodeMarkup(pos, undefined, { ...node.attrs, index: h2Counter })
          modified = true
        }
        h2Counter++
      }
    })

    return modified ? tr : null
  },
})

export const WeChatHeading = Node.create({
  name: 'wechatHeading',
  group: 'block',
  content: 'inline*',
  defining: true,

  addAttributes() {
    return {
      headingLevel: {
        default: 2,
        parseHTML: (el: HTMLElement) => {
          const wx = el.getAttribute('data-wx-level')
          if (wx) return parseInt(wx)
          const tag = el.tagName?.toLowerCase()
          if (tag === 'h1') return 1
          if (tag === 'h3') return 3
          return 2
        },
      },
      themeStyle: {
        default: 'bottom-line',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-wx-style') || 'bottom-line',
      },
      brandColor: {
        default: '#2B4A6F',
        parseHTML: (el: HTMLElement) => el.getAttribute('data-wx-color') || '#2B4A6F',
      },
      index: {
        default: 1,
        parseHTML: (el: HTMLElement) => parseInt(el.getAttribute('data-wx-index') || '1'),
      },
    }
  },

  parseHTML() {
    return [
      { tag: 'div[data-wechat-heading]' },
      { tag: 'h1', getAttrs: () => ({ headingLevel: 1, themeStyle: 'bottom-line' }) },
      { tag: 'h2', getAttrs: () => ({ headingLevel: 2, themeStyle: 'bottom-line' }) },
      { tag: 'h3', getAttrs: () => ({ headingLevel: 3, themeStyle: 'plain-bold' }) },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const level = Number(HTMLAttributes.headingLevel) || 2
    const style = HTMLAttributes.themeStyle || 'bottom-line'
    const bc = HTMLAttributes.brandColor || '#2B4A6F'
    const idx = String(HTMLAttributes.index || 1).padStart(2, '0')

    const pool = level === 2 ? h2Styles(bc, idx) : h3Styles(bc)
    const template = (pool as any)[style]

    if (!template) {
      const fontSize = level === 2 ? '17px' : '16px'
      const fontWeight = level === 2 ? 'bold' : '600'
      return ['section', { style: `font-size: ${fontSize}; font-weight: ${fontWeight}; color: #333333; margin-top: 20px; margin-bottom: 10px; line-height: 1.5;` }, 0]
    }

    return [template.tag, template.attrs, ...template.children.map(buildRenderNode)]
  },

  addProseMirrorPlugins() {
    return [autoNumberPlugin]
  },

  addCommands() {
    return {
      setWeChatHeading: (attrs: { headingLevel: number; themeStyle: string; brandColor?: string }) =>
        ({ commands }: any) => commands.setNode(this.name, attrs),
    } as any
  },
})
