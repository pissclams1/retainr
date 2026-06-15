export async function inspectEbookCover(file){
  if(!file) throw new Error('Choose an image file.')
  const url=URL.createObjectURL(file)
  try{
    const image=await new Promise((resolve,reject)=>{
      const img=new Image()
      img.onload=()=>resolve(img)
      img.onerror=()=>reject(new Error('The cover image could not be read.'))
      img.src=url
    })
    const width=image.naturalWidth
    const height=image.naturalHeight
    const ratio=width/height
    const issues=[]
    if(!['image/jpeg','image/png'].includes(file.type)) issues.push('Use a JPEG or PNG cover image.')
    if(width<1000||height<1600) issues.push(`The image is ${width} × ${height} pixels. Use a larger source image.`)
    if(ratio<0.60||ratio>0.75) issues.push(`The cover aspect ratio is ${ratio.toFixed(3)}, outside the expected portrait range.`)
    return {width,height,ratio,type:file.type,size:file.size,issues,pass:issues.length===0}
  } finally {
    URL.revokeObjectURL(url)
  }
}
