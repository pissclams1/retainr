const PT=72

export async function inspectInteriorPdf(file,{trimWidth=6,trimHeight=9}={}){
  if(!window.PDFLib) throw new Error('PDF engine failed to load.')
  const pdf=await window.PDFLib.PDFDocument.load(await file.arrayBuffer(),{ignoreEncryption:true})
  const pages=pdf.getPages()
  if(!pages.length) throw new Error('The PDF has no pages.')
  const sizes=pages.map(p=>{const s=p.getSize();return {width:s.width/PT,height:s.height/PT}})
  const first=sizes[0]
  const tolerance=.01
  const inconsistent=sizes.filter(s=>Math.abs(s.width-first.width)>tolerance||Math.abs(s.height-first.height)>tolerance).length
  const trimPass=Math.abs(first.width-trimWidth)<=tolerance&&Math.abs(first.height-trimHeight)<=tolerance
  const issues=[]
  if(!trimPass) issues.push(`Interior pages are ${first.width.toFixed(3)} × ${first.height.toFixed(3)} in, not ${trimWidth.toFixed(3)} × ${trimHeight.toFixed(3)} in.`)
  if(inconsistent) issues.push(`${inconsistent} page${inconsistent===1?' has':'s have'} a different page size.`)
  if(pages.length%2!==0) issues.push('The page count is odd. KDP may add a blank page during printing.')
  return {pageCount:pages.length,actual:first,trimPass,inconsistent,issues,pass:trimPass&&!inconsistent}
}

function text(node,name){return node?.getElementsByTagNameNS('*',name)?.[0]?.textContent?.trim()||''}

export async function inspectEpub(file){
  if(!window.JSZip) throw new Error('EPUB engine failed to load.')
  const zip=await window.JSZip.loadAsync(file)
  const issues=[]
  const mimetype=zip.file('mimetype')?await zip.file('mimetype').async('string'):''
  if(mimetype.trim()!=='application/epub+zip') issues.push('Missing or invalid EPUB mimetype file.')
  const container=zip.file('META-INF/container.xml')
  if(!container) throw new Error('This is not a valid EPUB: META-INF/container.xml is missing.')
  const containerXml=new DOMParser().parseFromString(await container.async('string'),'application/xml')
  const rootfile=containerXml.getElementsByTagNameNS('*','rootfile')[0]
  const opfPath=rootfile?.getAttribute('full-path')
  if(!opfPath||!zip.file(opfPath)) throw new Error('This EPUB does not point to a readable package document.')
  const opfXml=new DOMParser().parseFromString(await zip.file(opfPath).async('string'),'application/xml')
  const title=text(opfXml,'title'),creator=text(opfXml,'creator'),language=text(opfXml,'language'),identifier=text(opfXml,'identifier')
  if(!title) issues.push('Book title metadata is missing.')
  if(!creator) issues.push('Author metadata is missing.')
  if(!language) issues.push('Language metadata is missing.')
  if(!identifier) issues.push('Unique identifier metadata is missing.')
  const manifest=[...opfXml.getElementsByTagNameNS('*','item')]
  const spine=[...opfXml.getElementsByTagNameNS('*','itemref')]
  const navItem=manifest.find(i=>/\bnav\b/.test(i.getAttribute('properties')||''))
  const ncxItem=manifest.find(i=>i.getAttribute('media-type')==='application/x-dtbncx+xml')
  if(!navItem&&!ncxItem) issues.push('No EPUB navigation document was found.')
  const opfDir=opfPath.includes('/')?opfPath.slice(0,opfPath.lastIndexOf('/')+1):''
  const missing=manifest.filter(i=>{const href=i.getAttribute('href');return href&&!zip.file(opfDir+decodeURIComponent(href.split('#')[0]))})
  if(missing.length) issues.push(`${missing.length} manifest file${missing.length===1?' is':'s are'} missing from the EPUB archive.`)
  if(!spine.length) issues.push('The EPUB reading order is empty.')
  return {title,creator,language,identifier,manifestCount:manifest.length,spineCount:spine.length,hasNavigation:Boolean(navItem||ncxItem),missingCount:missing.length,issues,pass:issues.length===0}
}
