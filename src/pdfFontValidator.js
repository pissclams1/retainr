const unique = values => [...new Set(values)]

export function evaluateFontRecords(records = []) {
  const byName = new Map()
  for (const record of records) {
    const key = record.name || record.ref || 'Unknown font'
    const previous = byName.get(key)
    if (!previous || (!previous.embedded && record.embedded)) byName.set(key, record)
  }
  const fonts = [...byName.values()]
  const blockers = fonts.filter(font => font.embedded === false).map(font => `Font “${font.name || 'Unknown'}” is not embedded in the interior PDF.`)
  const warnings = fonts.filter(font => font.embedded == null).map(font => `Embedding could not be confirmed for font “${font.name || 'Unknown'}”.`)
  return { fonts, blockers: unique(blockers), warnings: unique(warnings), pass: blockers.length === 0 }
}

const cleanName = value => String(value || '').replace(/^\//, '')

export function inspectPdfFonts(pdf) {
  const PDFName = window.PDFLib?.PDFName
  const PDFDict = window.PDFLib?.PDFDict
  const PDFArray = window.PDFLib?.PDFArray
  if (!PDFName || !PDFDict) return { fonts: [], blockers: [], warnings: ['Font embedding could not be inspected because the PDF object reader was unavailable.'], pass: true }
  const records = []
  const resolve = value => {
    if (!value) return null
    try { return pdf.context.lookup(value) } catch { return value }
  }

  for (const [ref, object] of pdf.context.enumerateIndirectObjects()) {
    if (!(object instanceof PDFDict)) continue
    if (cleanName(object.get(PDFName.of('Type'))) !== 'Font') continue
    const subtype = cleanName(object.get(PDFName.of('Subtype')))
    const name = cleanName(object.get(PDFName.of('BaseFont'))) || `Font ${String(ref)}`
    let descriptor = resolve(object.get(PDFName.of('FontDescriptor')))
    if (!descriptor && subtype === 'Type0') {
      const descendants = resolve(object.get(PDFName.of('DescendantFonts')))
      if (descendants instanceof PDFArray && descendants.size() > 0) {
        const descendant = resolve(descendants.get(0))
        if (descendant instanceof PDFDict) descriptor = resolve(descendant.get(PDFName.of('FontDescriptor')))
      }
    }
    let embedded = null
    if (subtype === 'Type3') embedded = true
    else if (descriptor instanceof PDFDict) embedded = Boolean(descriptor.get(PDFName.of('FontFile')) || descriptor.get(PDFName.of('FontFile2')) || descriptor.get(PDFName.of('FontFile3')))
    else embedded = false
    records.push({ ref: String(ref), name, subtype, embedded })
  }

  if (!records.length) return { fonts: [], blockers: [], warnings: ['No PDF font resources were found. Text may be outlined or rasterized.'], pass: true }
  return evaluateFontRecords(records)
}
