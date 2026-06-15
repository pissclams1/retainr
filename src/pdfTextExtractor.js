export async function extractPdfTextPages(file) {
  if (!window.pdfjsLib) throw new Error('The PDF text inspection engine did not load.')
  const bytes = new Uint8Array(await file.arrayBuffer())
  const pdf = await window.pdfjsLib.getDocument({ data: bytes }).promise
  const pages = []
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
    const page = await pdf.getPage(pageNumber)
    const viewport = page.getViewport({ scale: 1 })
    const content = await page.getTextContent()
    const items = content.items
      .filter(item => item.str?.trim())
      .map(item => ({
        text: item.str.trim(),
        x: Number(item.transform?.[4] || 0),
        y: Number(item.transform?.[5] || 0),
        width: Number(item.width || 0),
        height: Math.abs(Number(item.height || item.transform?.[3] || 0)),
        fontName: item.fontName || '',
      }))
    pages.push({
      pdfPage: pageNumber,
      width: viewport.width,
      height: viewport.height,
      items,
      text: items.map(item => item.text).join(' '),
    })
  }
  return pages
}
