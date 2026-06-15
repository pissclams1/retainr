const PT=72

export async function inspectInteriorPdf(file,{trimWidth=6,trimHeight=9,expectedPageCount=null}={}){
  if(!window.PDFLib) throw new Error('PDF engine failed to load.')
  const pdf=await window.PDFLib.PDFDocument.load(await file.arrayBuffer(),{ignoreEncryption:true})
  const pages=pdf.getPages()
  if(!pages.length) throw new Error('The PDF has no pages.')
  const sizes=pages.map(p=>{const s=p.getSize();return {width:s.width/PT,height:s.height/PT}})
  const first=sizes[0]
  const tolerance=.01
  const inconsistentPages=[]
  sizes.forEach((s,index)=>{if(Math.abs(s.width-first.width)>tolerance||Math.abs(s.height-first.height)>tolerance)inconsistentPages.push(index+1)})
  const trimPass=Math.abs(first.width-trimWidth)<=tolerance&&Math.abs(first.height-trimHeight)<=tolerance
  const blockers=[]
  const warnings=[]
  if(!trimPass) blockers.push(`Interior pages are ${first.width.toFixed(3)} × ${first.height.toFixed(3)} in, not ${trimWidth.toFixed(3)} × ${trimHeight.toFixed(3)} in.`)
  if(inconsistentPages.length) blockers.push(`${inconsistentPages.length} page${inconsistentPages.length===1?' has':'s have'} a different page size. First affected page: ${inconsistentPages[0]}.`)
  const expected=Number(expectedPageCount)
  if(Number.isFinite(expected)&&expected>0&&pages.length!==expected) blockers.push(`The PDF contains ${pages.length} pages, but the selected final page count is ${expected}.`)
  if(pages.length%2!==0) warnings.push('The page count is odd. KDP may add a blank page during printing; confirm the final preview still looks intentional.')
  return {pageCount:pages.length,expectedPageCount:Number.isFinite(expected)&&expected>0?expected:null,actual:first,trimPass,inconsistent:inconsistentPages.length,inconsistentPages,blockers,warnings,issues:blockers,pass:blockers.length===0}
}

function parseXml(source,label){
  const xml=new DOMParser().parseFromString(source,'application/xml')
  if(xml.getElementsByTagName('parsererror').length) throw new Error(`${label} is malformed XML.`)
  return xml
}
function text(node,name){return node?.getElementsByTagNameNS('*',name)?.[0]?.textContent?.trim()||''}
function archivePath(base,href){
  const clean=(href||'').split('#')[0]
  if(!clean)return ''
  try{return base+decodeURIComponent(clean)}catch{return base+clean}
}

export async function inspectEpub(file){
  if(!window.JSZip) throw new Error('EPUB engine failed to load.')
  const zip=await window.JSZip.loadAsync(file)
  const blockers=[]
  const warnings=[]
  const mimetype=zip.file('mimetype')?await zip.file('mimetype').async('string'):''
  if(mimetype.trim()!=='application/epub+zip') blockers.push('Missing or invalid EPUB mimetype file.')
  const container=zip.file('META-INF/container.xml')
  if(!container) throw new Error('This is not a valid EPUB: META-INF/container.xml is missing.')
  const containerXml=parseXml(await container.async('string'),'META-INF/container.xml')
  const rootfile=containerXml.getElementsByTagNameNS('*','rootfile')[0]
  const opfPath=rootfile?.getAttribute('full-path')
  if(!opfPath||!zip.file(opfPath)) throw new Error('This EPUB does not point to a readable package document.')
  const opfXml=parseXml(await zip.file(opfPath).async('string'),'The EPUB package document')
  const title=text(opfXml,'title'),creator=text(opfXml,'creator'),language=text(opfXml,'language'),identifier=text(opfXml,'identifier')
  if(!title) blockers.push('Book title metadata is missing.')
  if(!creator) blockers.push('Author metadata is missing.')
  if(!language) blockers.push('Language metadata is missing.')
  if(!identifier) blockers.push('Unique identifier metadata is missing.')
  const manifest=[...opfXml.getElementsByTagNameNS('*','item')]
  const spine=[...opfXml.getElementsByTagNameNS('*','itemref')]
  const navItem=manifest.find(i=>/\bnav\b/.test(i.getAttribute('properties')||''))
  const ncxItem=manifest.find(i=>i.getAttribute('media-type')==='application/x-dtbncx+xml')
  if(!navItem&&!ncxItem) blockers.push('No EPUB navigation document was found.')
  const opfDir=opfPath.includes('/')?opfPath.slice(0,opfPath.lastIndexOf('/')+1):''
  const missing=manifest.filter(i=>{const path=archivePath(opfDir,i.getAttribute('href'));return path&&!zip.file(path)})
  if(missing.length) blockers.push(`${missing.length} manifest file${missing.length===1?' is':'s are'} missing from the EPUB archive.`)
  if(!spine.length) blockers.push('The EPUB reading order is empty.')
  const manifestIds=new Set(manifest.map(i=>i.getAttribute('id')).filter(Boolean))
  const brokenSpine=spine.filter(i=>!manifestIds.has(i.getAttribute('idref')))
  if(brokenSpine.length) blockers.push(`${brokenSpine.length} reading-order reference${brokenSpine.length===1?' points':'s point'} to a missing manifest item.`)
  const ids=manifest.map(i=>i.getAttribute('id')).filter(Boolean)
  if(new Set(ids).size!==ids.length) blockers.push('The EPUB manifest contains duplicate item IDs.')
  const hrefs=manifest.map(i=>i.getAttribute('href')).filter(Boolean)
  if(new Set(hrefs).size!==hrefs.length) warnings.push('The EPUB manifest contains duplicate file paths. Review the package before publishing.')
  return {title,creator,language,identifier,manifestCount:manifest.length,spineCount:spine.length,hasNavigation:Boolean(navItem||ncxItem),missingCount:missing.length,brokenSpineCount:brokenSpine.length,blockers,warnings,issues:blockers,pass:blockers.length===0}
}
