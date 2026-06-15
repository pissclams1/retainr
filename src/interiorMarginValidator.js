import { minimumGutter, minimumOutsideMargin } from './printSpecs.js'
import { extractPdfTextPages } from './pdfTextExtractor.js'

const PT = 72

export function analyzeTextMargins(pages, settings = {}) {
  const trimWidth = Number(settings.trimWidth || 6)
  const trimHeight = Number(settings.trimHeight || 9)
  const bleed = Boolean(settings.bleed)
  const pageCount = Number(settings.expectedPageCount || pages.length)
  const gutter = minimumGutter(pageCount)
  const outside = minimumOutsideMargin(bleed)
  const bleedPt = bleed ? 0.125 * PT : 0
  const trimWidthPt = trimWidth * PT
  const trimHeightPt = trimHeight * PT
  const tolerance = 2
  const violations = []

  for (const page of pages) {
    const odd = page.pdfPage % 2 === 1
    const trimLeft = bleed && !odd ? bleedPt : 0
    const trimBottom = bleed ? bleedPt : 0
    const trimRight = trimLeft + trimWidthPt
    const trimTop = trimBottom + trimHeightPt
    const leftLimit = odd ? trimLeft + gutter * PT : trimLeft + outside * PT
    const rightLimit = odd ? trimRight - outside * PT : trimRight - gutter * PT
    const bottomLimit = trimBottom + outside * PT
    const topLimit = trimTop - outside * PT

    for (const item of page.items || []) {
      if (!Number.isFinite(item.width) || !Number.isFinite(item.height)) continue
      const left = item.x
      const right = item.x + Math.max(0, item.width)
      const bottom = item.y - Math.max(1, item.height) * 0.25
      const top = item.y + Math.max(1, item.height) * 0.85
      if (left < leftLimit - tolerance) violations.push({ pdfPage: page.pdfPage, edge: odd ? 'gutter' : 'outside', amount: (leftLimit - left) / PT })
      if (right > rightLimit + tolerance) violations.push({ pdfPage: page.pdfPage, edge: odd ? 'outside' : 'gutter', amount: (right - rightLimit) / PT })
      if (bottom < bottomLimit - tolerance) violations.push({ pdfPage: page.pdfPage, edge: 'bottom', amount: (bottomLimit - bottom) / PT })
      if (top > topLimit + tolerance) violations.push({ pdfPage: page.pdfPage, edge: 'top', amount: (top - topLimit) / PT })
    }
  }

  const grouped = new Map()
  for (const violation of violations) {
    const existing = grouped.get(violation.pdfPage) || []
    existing.push(violation)
    grouped.set(violation.pdfPage, existing)
  }
  const blockers = []
  for (const [pdfPage, pageViolations] of grouped) {
    const worst = pageViolations.sort((a, b) => b.amount - a.amount)[0]
    blockers.push(`PDF page ${pdfPage}: text extends ${worst.amount.toFixed(3)} inches into the required ${worst.edge} margin.`)
  }
  const warnings = []
  if (pages.some(page => !(page.items || []).length)) warnings.push('Some pages contain no extractable text, so outlined or rasterized text could not be margin-checked.')
  return { gutter, outside, violationCount: violations.length, violations, blockers, warnings, pass: blockers.length === 0 }
}

export async function inspectInteriorMargins(file, settings = {}) {
  const pages = await extractPdfTextPages(file)
  return analyzeTextMargins(pages, settings)
}
