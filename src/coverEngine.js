const POINTS_PER_INCH = 72
const BLEED = 0.125
const MAX_SAFE_RESIZE_INCHES = 0.05
const MAX_RATIO_DRIFT = 0.002

export function spineWidth(pageCount, paper = 'White') {
  const pages = Number(pageCount)
  if (!Number.isFinite(pages) || pages <= 0) throw new Error('Enter a valid page count.')
  return pages * (paper === 'Cream' ? 0.0025 : 0.002252)
}

export function requiredPaperbackCoverSize({ trimWidth = 6, trimHeight = 9, pageCount, paper = 'White' }) {
  const spine = spineWidth(pageCount, paper)
  return {
    width: trimWidth * 2 + spine + BLEED * 2,
    height: trimHeight + BLEED * 2,
    spine,
    bleed: BLEED,
  }
}

export function isSafeCoverResize(actual, required) {
  const widthDelta = Math.abs(actual.width - required.width)
  const heightDelta = Math.abs(actual.height - required.height)
  const widthScale = required.width / actual.width
  const heightScale = required.height / actual.height
  return widthDelta <= MAX_SAFE_RESIZE_INCHES
    && heightDelta <= MAX_SAFE_RESIZE_INCHES
    && Math.abs(widthScale - heightScale) <= MAX_RATIO_DRIFT
}

export async function inspectPaperbackCover(file, settings) {
  if (!window.PDFLib) throw new Error('The PDF inspection engine did not load. Refresh and try again.')
  const bytes = await file.arrayBuffer()
  const pdf = await window.PDFLib.PDFDocument.load(bytes, { ignoreEncryption: true })
  const pages = pdf.getPages()
  if (pages.length !== 1) throw new Error(`A print cover must be one PDF page. This file has ${pages.length}.`)

  const { width: widthPt, height: heightPt } = pages[0].getSize()
  const actual = { width: widthPt / POINTS_PER_INCH, height: heightPt / POINTS_PER_INCH }
  const required = requiredPaperbackCoverSize(settings)
  const delta = { width: actual.width - required.width, height: actual.height - required.height }
  const tolerance = 0.005
  const dimensionPass = Math.abs(delta.width) <= tolerance && Math.abs(delta.height) <= tolerance
  const safeResize = !dimensionPass && isSafeCoverResize(actual, required)

  const issues = []
  if (Math.abs(delta.width) > tolerance) {
    issues.push({
      code: 'COVER_WIDTH',
      severity: 'blocking',
      message: delta.width < 0
        ? `The cover is ${Math.abs(delta.width).toFixed(3)} inches too narrow.`
        : `The cover is ${Math.abs(delta.width).toFixed(3)} inches too wide.`,
      fixable: safeResize,
    })
  }
  if (Math.abs(delta.height) > tolerance) {
    issues.push({
      code: 'COVER_HEIGHT',
      severity: 'blocking',
      message: delta.height < 0
        ? `The cover is ${Math.abs(delta.height).toFixed(3)} inches too short.`
        : `The cover is ${Math.abs(delta.height).toFixed(3)} inches too tall.`,
      fixable: safeResize,
    })
  }

  return {
    bytes,
    actual,
    required,
    delta,
    pageCount: pages.length,
    pass: dimensionPass,
    issues,
    canAutoFix: safeResize,
  }
}

export async function repairPaperbackCover(inspection) {
  if (!inspection?.canAutoFix) throw new Error('This cover cannot be repaired safely without redesign or manual review.')
  if (!window.PDFLib) throw new Error('The PDF repair engine did not load.')
  const { PDFDocument } = window.PDFLib
  const source = await PDFDocument.load(inspection.bytes)
  const output = await PDFDocument.create()
  const [embedded] = await output.embedPdf(source, [0])

  const targetWidth = inspection.required.width * POINTS_PER_INCH
  const targetHeight = inspection.required.height * POINTS_PER_INCH
  const page = output.addPage([targetWidth, targetHeight])

  const sourceWidth = inspection.actual.width * POINTS_PER_INCH
  const sourceHeight = inspection.actual.height * POINTS_PER_INCH
  const scale = targetWidth / sourceWidth
  const drawWidth = sourceWidth * scale
  const drawHeight = sourceHeight * scale

  page.drawPage(embedded, {
    x: (targetWidth - drawWidth) / 2,
    y: (targetHeight - drawHeight) / 2,
    width: drawWidth,
    height: drawHeight,
  })

  return output.save()
}

export function downloadPdf(bytes, filename) {
  const blob = new Blob([bytes], { type: 'application/pdf' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
