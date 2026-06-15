export function requiredInteriorPageSize({trimWidth=6,trimHeight=9,bleed=false}={}){
  return bleed
    ? {width:trimWidth+0.125,height:trimHeight+0.25}
    : {width:trimWidth,height:trimHeight}
}

export function minimumGutter(pageCount){
  const pages=Number(pageCount)
  if(!Number.isFinite(pages)||pages<24) throw new Error('KDP print books require at least 24 pages.')
  if(pages<=150)return 0.375
  if(pages<=300)return 0.5
  if(pages<=500)return 0.625
  if(pages<=700)return 0.75
  if(pages<=828)return 0.875
  throw new Error('The selected page count exceeds the supported KDP paperback range.')
}

export function minimumOutsideMargin(bleed=false){
  return bleed?0.375:0.25
}

export function pageCountRange({paper='White',ink='Black'}={}){
  if(ink==='Standard color')return {min:72,max:600}
  if(paper==='Cream')return {min:24,max:776}
  if(paper==='Groundwood')return {min:24,max:812}
  return {min:24,max:828}
}

export function evaluatePageCount(pageCount,settings={}){
  const pages=Number(pageCount)
  const range=pageCountRange(settings)
  const issues=[]
  if(!Number.isFinite(pages))issues.push('Enter a valid page count.')
  else if(pages<range.min||pages>range.max)issues.push(`This print option supports ${range.min}–${range.max} pages.`)
  return {pageCount:pages,range,issues,pass:issues.length===0}
}
