function romanToNumber(value){
  const roman=value.toUpperCase()
  if(!/^[IVXLCDM]+$/.test(roman))return null
  const map={I:1,V:5,X:10,L:50,C:100,D:500,M:1000}
  let total=0
  for(let i=0;i<roman.length;i++)total+=(map[roman[i]]<(map[roman[i+1]]||0))?-map[roman[i]]:map[roman[i]]
  return total
}

function numberToken(value){
  const clean=value.trim().replace(/[–—-]/g,'').trim()
  if(/^\d{1,4}$/.test(clean))return {style:'arabic',value:Number(clean),label:clean}
  if(/^[ivxlcdm]{1,10}$/i.test(clean))return {style:'roman',value:romanToNumber(clean),label:clean}
  return null
}

function normalize(value){return value.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim()}

export function analyzePrintedNavigation(pages){
  const blockers=[]
  const warnings=[]
  const labels=[]
  for(const page of pages){
    const candidates=page.items
      .map(item=>({...item,token:numberToken(item.text)}))
      .filter(item=>item.token&&(item.y<=page.height*.16||item.y>=page.height*.84))
      .sort((a,b)=>{
        const ae=Math.min(a.y,page.height-a.y)
        const be=Math.min(b.y,page.height-b.y)
        return ae-be
      })
    if(candidates[0])labels.push({pdfPage:page.pdfPage,...candidates[0].token})
  }

  const arabic=labels.filter(label=>label.style==='arabic')
  let sequenceStart=-1
  for(let i=0;i<arabic.length;i++){
    if(arabic[i].value===1){sequenceStart=i;break}
  }
  const body=sequenceStart>=0?arabic.slice(sequenceStart):arabic
  for(let i=1;i<body.length;i++){
    const previous=body[i-1],current=body[i]
    if(current.pdfPage!==previous.pdfPage+1)warnings.push(`No extractable page number was found on PDF page ${previous.pdfPage+1}.`)
    if(current.value===previous.value)blockers.push(`Printed page number ${current.value} is duplicated on consecutive pages.`)
    else if(current.value<previous.value)blockers.push(`Printed page numbering moves backward from ${previous.value} to ${current.value} on PDF page ${current.pdfPage}.`)
    else if(current.value>previous.value+1)blockers.push(`Printed page numbering jumps from ${previous.value} to ${current.value} on PDF page ${current.pdfPage}.`)
  }
  if(!arabic.some(label=>label.value===1))warnings.push('No extractable printed page 1 was found. Confirm where body numbering begins.')
  if(body.length&&body.length<Math.max(3,Math.floor((pages.length-body[0].pdfPage+1)*.6)))warnings.push('Printed page numbers were not detected consistently through the body. This can indicate missing numbers or outlined/rasterized text.')

  const labelMap=new Map(arabic.map(label=>[label.value,label.pdfPage]))
  const tocPages=pages.filter(page=>page.pdfPage<=20&&/\b(contents|table of contents)\b/i.test(page.text))
  const tocEntries=[]
  for(const page of tocPages){
    const lines=new Map()
    for(const item of page.items){
      const key=Math.round(item.y/3)*3
      lines.set(key,[...(lines.get(key)||[]),item])
    }
    for(const items of lines.values()){
      const line=items.sort((a,b)=>a.x-b.x).map(item=>item.text).join(' ').replace(/\s+/g,' ').trim()
      const match=line.match(/^(.*?)(\d{1,4})\s*$/)
      if(match&&!/^\s*(contents|table of contents)\s*$/i.test(line))tocEntries.push({title:match[1].replace(/[.·\s]+$/,'').trim(),target:Number(match[2]),sourcePdfPage:page.pdfPage})
    }
  }
  if(!tocPages.length)warnings.push('No extractable table of contents heading was found in the first 20 pages.')
  else if(!tocEntries.length)warnings.push('A contents page was found, but its page references could not be extracted reliably.')

  for(let i=1;i<tocEntries.length;i++){
    if(tocEntries[i].target<tocEntries[i-1].target)blockers.push(`The table of contents moves backward from page ${tocEntries[i-1].target} to ${tocEntries[i].target}.`)
  }
  const duplicateTargets=tocEntries.filter((entry,index)=>tocEntries.findIndex(other=>other.target===entry.target)!==index)
  if(duplicateTargets.length)warnings.push('The table of contents contains repeated page references. Confirm that the entries are intentional.')

  let checkedTargets=0,matchedTargets=0
  for(const entry of tocEntries){
    const pdfPage=labelMap.get(entry.target)
    if(!pdfPage){
      blockers.push(`The table of contents points to printed page ${entry.target}, but that page number was not found in the PDF.`)
      continue
    }
    const targetPage=pages[pdfPage-1]
    const title=normalize(entry.title).replace(/^\d+\s*/,'')
    if(title.length>=4){
      checkedTargets++
      const targetText=normalize(targetPage?.text||'')
      const words=title.split(' ').filter(Boolean).slice(0,4)
      if(words.length&&words.every(word=>targetText.includes(word)))matchedTargets++
      else warnings.push(`Contents entry “${entry.title}” points to page ${entry.target}, but its heading was not confirmed on that page.`)
    }
  }

  return {
    labels,
    bodyLabelCount:body.length,
    tocFound:tocPages.length>0,
    tocEntries,
    tocChecked:checkedTargets,
    tocMatched:matchedTargets,
    blockers:[...new Set(blockers)],
    warnings:[...new Set(warnings)],
    pass:blockers.length===0,
  }
}

export async function inspectPrintedNavigation(file){
  if(!window.pdfjsLib)throw new Error('The page-number inspection engine did not load.')
  const bytes=new Uint8Array(await file.arrayBuffer())
  const pdf=await window.pdfjsLib.getDocument({data:bytes}).promise
  const pages=[]
  for(let pageNumber=1;pageNumber<=pdf.numPages;pageNumber++){
    const page=await pdf.getPage(pageNumber)
    const viewport=page.getViewport({scale:1})
    const content=await page.getTextContent()
    const items=content.items.filter(item=>item.str?.trim()).map(item=>({text:item.str.trim(),x:item.transform[4],y:item.transform[5]}))
    pages.push({pdfPage:pageNumber,width:viewport.width,height:viewport.height,items,text:items.map(item=>item.text).join(' ')})
  }
  return analyzePrintedNavigation(pages)
}
