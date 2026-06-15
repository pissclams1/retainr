const PT=72
const identity=[1,0,0,1,0,0]
const multiply=(a,b)=>[
  a[0]*b[0]+a[2]*b[1],
  a[1]*b[0]+a[3]*b[1],
  a[0]*b[2]+a[2]*b[3],
  a[1]*b[2]+a[3]*b[3],
  a[0]*b[4]+a[2]*b[5]+a[4],
  a[1]*b[4]+a[3]*b[5]+a[5],
]

export function evaluateImageRecords(records=[]){
  const blockers=[]
  const warnings=[]
  for(const image of records){
    const dpi=Math.min(image.dpiX,image.dpiY)
    if(!Number.isFinite(dpi))continue
    if(dpi<150)blockers.push(`PDF page ${image.pdfPage}: an image is approximately ${Math.round(dpi)} DPI at its printed size; use at least 300 DPI.`)
    else if(dpi<300)warnings.push(`PDF page ${image.pdfPage}: an image is approximately ${Math.round(dpi)} DPI at its printed size; 300 DPI is recommended.`)
  }
  return {images:records,blockers:[...new Set(blockers)],warnings:[...new Set(warnings)],pass:blockers.length===0}
}

const getObject=(store,name)=>new Promise(resolve=>{
  try{
    const ready=store.get(name)
    if(ready)resolve(ready)
    else store.get(name,resolve)
  }catch{resolve(null)}
})

export async function inspectPdfImages(file){
  if(!window.pdfjsLib)return {images:[],blockers:[],warnings:['Image resolution could not be inspected because the PDF engine was unavailable.'],pass:true}
  const bytes=new Uint8Array(await file.arrayBuffer())
  const pdf=await window.pdfjsLib.getDocument({data:bytes}).promise
  const OPS=window.pdfjsLib.OPS
  const records=[]
  for(let pageNumber=1;pageNumber<=pdf.numPages;pageNumber++){
    const page=await pdf.getPage(pageNumber)
    const list=await page.getOperatorList()
    let ctm=identity
    const stack=[]
    for(let i=0;i<list.fnArray.length;i++){
      const fn=list.fnArray[i],args=list.argsArray[i]||[]
      if(fn===OPS.save)stack.push(ctm.slice())
      else if(fn===OPS.restore)ctm=stack.pop()||identity
      else if(fn===OPS.transform)ctm=multiply(ctm,args)
      else if(fn===OPS.paintImageXObject||fn===OPS.paintJpegXObject){
        const image=await getObject(page.objs,args[0])
        if(!image?.width||!image?.height)continue
        const widthPt=Math.hypot(ctm[0],ctm[1])
        const heightPt=Math.hypot(ctm[2],ctm[3])
        if(widthPt<=0||heightPt<=0)continue
        records.push({pdfPage:pageNumber,widthPixels:image.width,heightPixels:image.height,widthInches:widthPt/PT,heightInches:heightPt/PT,dpiX:image.width/(widthPt/PT),dpiY:image.height/(heightPt/PT)})
      }
    }
  }
  return evaluateImageRecords(records)
}
