function linesFor(name,file,result){
  if(!file||!result)return []
  const lines=[`\n${name}`,`File: ${file.name}`,`Status: ${result.pass?'PASS':'ISSUES FOUND'}`]
  if(result.actual)lines.push(`Actual size: ${result.actual.width.toFixed(3)} × ${result.actual.height.toFixed(3)} in`)
  if(result.required)lines.push(`Required size: ${result.required.width.toFixed(3)} × ${result.required.height.toFixed(3)} in`)
  if(result.pageCount)lines.push(`Pages: ${result.pageCount}`)
  if(result.expectedPageCount)lines.push(`Selected final page count: ${result.expectedPageCount}`)
  if(result.width&&result.height)lines.push(`Image: ${result.width} × ${result.height} px`)
  if(result.title)lines.push(`Title: ${result.title}`)
  if(result.creator)lines.push(`Creator: ${result.creator}`)
  if(result.spineCount)lines.push(`Reading-order items: ${result.spineCount}`)
  if(result.words)lines.push(`Words: ${result.words}`)
  const issues=result.blockers||result.issues||[]
  if(issues.length){lines.push('Issues:');for(const issue of issues)lines.push(`- ${typeof issue==='string'?issue:issue.message}`)}
  const warnings=result.warnings||[]
  if(warnings.length){lines.push('Advisories:');for(const warning of warnings)lines.push(`- ${warning}`)}
  return lines
}

export function downloadPreflightReport({settings,cover,coverResult,interior,interiorResult,epub,epubResult,docx,docxResult,ebookCover,ebookCoverResult}){
  const output=[
    'PUBLISHREADY PREFLIGHT REPORT',
    `Generated: ${new Date().toLocaleString()}`,
    `Trim: ${settings.trim}`,
    `Page count: ${settings.pages}`,
    `Paper / ink: ${settings.paper}`,
    `Interior bleed: ${settings.bleed?'Full bleed':'No bleed'}`,
    ...linesFor('Paperback cover PDF',cover,coverResult),
    ...linesFor('Print interior PDF',interior,interiorResult),
    ...linesFor('Kindle EPUB',epub,epubResult),
    ...linesFor('Manuscript DOCX',docx,docxResult),
    ...linesFor('eBook cover image',ebookCover,ebookCoverResult),
    '\nThis beta report is a technical preflight, not a guarantee of KDP acceptance.'
  ].join('\n')
  const blob=new Blob([output],{type:'text/plain'})
  const url=URL.createObjectURL(blob)
  const a=document.createElement('a')
  a.href=url
  a.download='publishready-preflight-report.txt'
  a.click()
  setTimeout(()=>URL.revokeObjectURL(url),500)
}
