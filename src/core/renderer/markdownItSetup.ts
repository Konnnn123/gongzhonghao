import MarkdownIt from 'markdown-it'
import type { HeadingStylePreset, HighlightStylePreset, TypographyConfig } from '../../types'
import { getHeadingStyle } from './themes/headingStyles'

interface RenderOptions {
  typography: TypographyConfig
  headingStyle: HeadingStylePreset
  highlightStyle: HighlightStylePreset
  images?: Record<string, string>  // 占位符ID → Base64 data URL
}

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: false,
})

// ─── 预处理 ────────────────────────────────────────────

function preprocessMarkdown(raw: string, images?: Record<string, string>): string {
  let text = raw

  // 1. 替换图片占位符 img:xxx → 真实 Base64 data URL
  if (images) {
    text = text.replace(/!\[([^\]]*)\]\(img:([^)]+)\)/g, (_, alt, id) => {
      const src = images[id] || ''
      return src ? `![${alt}](${src})` : `![${alt}]()`
    })
  }

  // 2. ==text== → <mark-accent>text</mark-accent>
  text = text.replace(/==(.*?)==/g, '<mark-accent>$1</mark-accent>')

  return text
}

// ─── 主渲染入口 ────────────────────────────────────────

export function renderMarkdownFull(markdown: string, options: RenderOptions): string {
  const { typography, headingStyle, highlightStyle, images } = options

  // 1. 预处理
  const processed = preprocessMarkdown(markdown, images)

  // 2. markdown-it 渲染
  let html = md.render(processed)

  // 3. 文章结构大纲
  html = processOutline(html, typography)

  // 4. 各类标记
  html = processAccentMarks(html, typography)
  html = processUnderlineTags(html, typography)
  html = processMarkTags(html, typography)
  html = processBoldHighlights(html, typography)

  // 5. 标题
  html = processHeadings(html, headingStyle, typography)

  // 6. 基础元素
  html = processParagraphs(html, typography)
  html = processBlockquotes(html, typography)
  html = processCode(html, typography)
  html = processLists(html, typography)
  html = processHr(html)
  html = processImages(html)
  html = processTables(html, typography)

  return html
}

// ─── 文章结构大纲 ─────────────────────────────────────

function processOutline(html: string, typography: TypographyConfig): string {
  const { brandColor } = typography
  const outlinePattern = /^([\s\S]*?)(<hr\s*\/?>|<h2)/
  const match = html.match(outlinePattern)
  if (!match) return html

  const [, beforeContent] = match
  if (!beforeContent.includes('<li>')) return html

  const styledOutline = beforeContent
    .replace(/<li style="[^"]*">/g, `<li style="font-size: 13px; color: #666; margin-bottom: 4px; line-height: 1.6; list-style: none; padding-left: 0;">`)
    .replace(/<ul style="[^"]*">/g, `<ul style="margin: 8px 0 16px 0; padding-left: 0; list-style: none;">`)

  const outlineHeader = `<p style="font-size: 12px; color: ${brandColor}; font-weight: 600; margin-bottom: 4px; letter-spacing: 0.5px;">📑 文章结构</p>`

  return html.replace(beforeContent, outlineHeader + styledOutline)
}

// ─── 各类标记处理 ─────────────────────────────────────

function processAccentMarks(html: string, typography: TypographyConfig): string {
  return html.replace(/<mark-accent>([\s\S]*?)<\/mark-accent>/g, (_, text) => {
    return `<span style="color: ${typography.brandColor}; font-weight: 500; opacity: 0.85;">${text}</span>`
  })
}

function processUnderlineTags(html: string, typography: TypographyConfig): string {
  const { brandColor } = typography
  return html.replace(/<u>([\s\S]*?)<\/u>/g, (_, text) => {
    return `<span style="border-bottom: 2px solid ${brandColor}; padding-bottom: 1px; color: #333;">${text}</span>`
  })
}

function processMarkTags(html: string, typography: TypographyConfig): string {
  const { brandColor } = typography
  return html.replace(/<mark>([\s\S]*?)<\/mark>/g, (_, text) => {
    return `<span style="background-color: ${brandColor}20; padding: 2px 6px; border-radius: 3px; color: #1d2129; font-weight: 500;">${text}</span>`
  })
}

function processBoldHighlights(html: string, typography: TypographyConfig): string {
  return html.replace(/<strong>([\s\S]*?)<\/strong>/g, (_, text) => {
    return `<strong style="color: ${typography.brandColor}; font-weight: 700;">${text}</strong>`
  })
}

// ─── 标题 ─────────────────────────────────────────────

function processHeadings(
  html: string,
  preset: HeadingStylePreset,
  typography: TypographyConfig
): string {
  const counter = { h2: 1 }

  html = html.replace(/<h1([^>]*)>([\s\S]*?)<\/h1>/g, (_, attrs, content) => {
    const style = getHeadingStyle(preset, 1, typography)
    return `<h1${attrs} style="${style}">${content}</h1>`
  })

  html = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (_, attrs, content) => {
    const style = getHeadingStyle(preset, 2, typography)
    let finalContent = content
    if (preset === 'numbered') {
      finalContent = `<span style="color: #86909c; font-size: 14px; margin-right: 4px;">${String(counter.h2++).padStart(2, '0')} / </span>${content}`
    }
    return `<h2${attrs} style="${style}">${finalContent}</h2>`
  })

  html = html.replace(/<h3([^>]*)>([\s\S]*?)<\/h3>/g, (_, attrs, content) => {
    const style = getHeadingStyle(preset, 3, typography)
    return `<h3${attrs} style="${style}">${content}</h3>`
  })

  html = html.replace(/<h([4-6])([^>]*)>([\s\S]*?)<\/h[4-6]>/g, (_, level, attrs, content) => {
    const style = getHeadingStyle(preset, parseInt(level), typography)
    return `<h${level}${attrs} style="${style}">${content}</h${level}>`
  })

  return html
}

// ─── 基础元素 ─────────────────────────────────────────

function processParagraphs(html: string, typography: TypographyConfig): string {
  const { fontSize, lineHeight, paragraphSpacing, textAlign, fontFamily } = typography
  const pStyle = `font-size: ${fontSize}px; line-height: ${lineHeight}; margin-bottom: ${paragraphSpacing}px; text-align: ${textAlign}; font-family: ${fontFamily}; color: #333;`
  return html.replace(/<p([^>]*)>/g, (_, attrs) => `<p${attrs} style="${pStyle}">`)
}

function processBlockquotes(html: string, typography: TypographyConfig): string {
  const bqStyle = `border-left: 3px solid ${typography.brandColor}40; padding: 8px 16px; margin: 16px 0; background: ${typography.brandColor}08; color: #666; font-size: 14px; line-height: ${typography.lineHeight};`
  return html.replace(/<blockquote>/g, `<blockquote style="${bqStyle}">`)
}

function processCode(html: string, _typography: TypographyConfig): string {
  html = html.replace(
    /<code>/g,
    `<code style="background: #f2f3f5; padding: 2px 6px; border-radius: 3px; font-size: 13px; color: #c41d7f; font-family: 'JetBrains Mono', 'Fira Code', monospace;">`
  )
  const preStyle = `background: #f7f8fa; border: 1px solid #e5e6eb; border-radius: 6px; padding: 16px; margin: 16px 0; overflow-x: auto; font-size: 13px; line-height: 1.6; font-family: 'JetBrains Mono', 'Fira Code', monospace; color: #1d2129;`
  html = html.replace(/<pre>/g, `<pre style="${preStyle}">`)
  return html
}

function processLists(html: string, typography: TypographyConfig): string {
  const ulStyle = `margin: 12px 0; padding-left: 24px; font-size: ${typography.fontSize}px; line-height: ${typography.lineHeight}; color: #333;`
  const olStyle = ulStyle
  const liStyle = `margin-bottom: 6px;`
  html = html.replace(/<ul>/g, `<ul style="${ulStyle}">`)
  html = html.replace(/<ol>/g, `<ol style="${olStyle}">`)
  html = html.replace(/<li>/g, `<li style="${liStyle}">`)
  return html
}

function processHr(html: string): string {
  return html.replace(
    /<hr\s*\/?>/g,
    `<hr style="border: none; border-top: 1px solid #e5e6eb; margin: 24px 0;" />`
  )
}

function processImages(html: string): string {
  return html.replace(
    /<img([^>]*)>/g,
    (_, attrs) => `<img${attrs} style="max-width: 100%; height: auto; border-radius: 4px; margin: 12px 0;">`
  )
}

function processTables(html: string, typography: TypographyConfig): string {
  const tableStyle = `width: 100%; border-collapse: collapse; margin: 16px 0; font-size: ${typography.fontSize}px;`
  const thStyle = `border: 1px solid #e5e6eb; padding: 8px 12px; background: #f7f8fa; font-weight: 600; text-align: left;`
  const tdStyle = `border: 1px solid #e5e6eb; padding: 8px 12px;`
  html = html.replace(/<table>/g, `<table style="${tableStyle}">`)
  html = html.replace(/<th>/g, `<th style="${thStyle}">`)
  html = html.replace(/<td>/g, `<td style="${tdStyle}">`)
  return html
}
