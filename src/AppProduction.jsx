import { useRef, useState } from 'react'
import { inspectPaperbackCover, repairPaperbackCover, downloadPdf, requiredPaperbackCoverSize } from './coverEngine'

const options = [
  ['ebook-manuscript','eBook manuscript','Validated EPUB'],
  ['paperback-manuscript','Paperback manuscript','Print-ready interior PDF'],
  ['hardcover-manuscript','Hardcover manuscript','Hardcover interior PDF'],
  ['ebook-cover','eBook cover','Amazon-ready JPG'],
  ['paperback-cover','Paperback cover','Full-wrap cover PDF'],
  ['hardcover-cover','Hardcover cover','Hardcover wrap PDF'],
]

const priceFor = n => n ? Math.min(59, 19 + (n - 1) * 10) : 0
const Check = () => <span className="check">✓</span>

function Logo(){return <div className="logo"><span>P</span><b>PublishReady</b></div>}

function Header({onHome}){return <header className="site-header"><div className="wrap nav"><button className="logo" onClick={onHome}><span>P</span><b>PublishReady</b></button><nav><a href="#checker">Cover Checker</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></nav><a className="primary small" href="#checker">Check My Files</a></div></header>}

function Pricing(){
  const [selected,setSelected]=useState(['ebook-manuscript','ebook-cover'])
  const toggle=id=>setSelected(s=>s.includes(id)?s.filter(x=>x!==id):[...s,id])
  return <section id="pricing" className="configurator wrap"><div className="config-copy"><span className="eyebrow">Transparent pricing</span><h2>Select only what you need.</h2><p>First deliverable $19. Each additional deliverable $10. Complete book capped at $59.</p></div><div className="config-card"><div className="config-groups"><div className="config-group"><h3>Manuscript</h3>{options.slice(0,3).map(([id,label,detail])=><label key={id} className={selected.includes(id)?'option selected':'option'}><input type="checkbox" checked={selected.includes(id)} onChange={()=>toggle(id)}/><span className="box">✓</span><span><b>{label}</b><small>{detail}</small></span></label>)}</div><div className="config-group"><h3>Covers</h3>{options.slice(3).map(([id,label,detail])=><label key={id} className={selected.includes(id)?'option selected':'option'}><input type="checkbox" checked={selected.includes(id)} onChange={()=>toggle(id)}/><span className="box">✓</span><span><b>{label}</b><small>{detail}</small></span></label>)}</div></div><aside className="price-summary"><p>Your publishing package</p><div className="selection-list">{selected.length?selected.map(id=><span key={id}><Check/>{options.find(x=>x[0]===id)[1]}</span>):<small>Select at least one item.</small>}</div><div className="total"><span>Total</span><strong>${priceFor(selected.length)}</strong></div><small>Paid exports open after beta validation.</small><button className="primary wide" disabled>Coming after beta</button></aside></div></section>
}

async function inspectDocx(file){
  if(!window.JSZip) throw new Error('Document reader failed to load.')
  const zip=await window.JSZip.loadAsync(file)
  const entry=zip.file('word/document.xml')
  if(!entry) throw new Error('This is not a valid DOCX file.')
  const xml=await entry.async('string')
  const doc=new DOMParser().parseFromString(xml,'application/xml')
  const paras=[...doc.getElementsByTagNameNS('*','p')]
  let words=0,nonEmpty=0
  const chapters=[]
  paras.forEach(p=>{const text=[...p.getElementsByTagNameNS('*','t')].map(n=>n.textContent).join('').trim();if(!text)return;nonEmpty++;words+=text.split(/\s+/).filter(Boolean).length;const style=p.getElementsByTagNameNS('*','pStyle')[0]?.getAttribute('w:val')||'';if(/heading1|chapter|title/i.test(style)||(/^(chapter|prologue|epilogue|introduction|part)\b/i.test(text)&&text.length<90))chapters.push(text)})
  return {words,paragraphs:nonEmpty,chapters:[...new Set(chapters)]}
}

function CoverChecker(){
  const coverInput=useRef(null),docxInput=useRef(null)
  const [cover,setCover]=useState(null),[docx,setDocx]=useState(null),[busy,setBusy]=useState(false),[error,setError]=useState('')
  const [trim,setTrim]=useState('6x9'),[pages,setPages]=useState(263),[paper,setPaper]=useState('White')
  const [inspection,setInspection]=useState(null),[docxResult,setDocxResult]=useState(null)
  const [repairing,setRepairing]=useState(false)
  const [tw,th]=trim.split('x').map(Number)
  const required=requiredPaperbackCoverSize({trimWidth:tw,trimHeight:th,pageCount:Number(pages),paper})

  async function runCover(file){
    if(!file)return
    setCover(file);setBusy(true);setError('');setInspection(null)
    try{setInspection(await inspectPaperbackCover(file,{trimWidth:tw,trimHeight:th,pageCount:Number(pages),paper}))}catch(e){setError(e.message)}finally{setBusy(false)}
  }

  async function runDocx(file){
    if(!file)return
    setDocx(file);setError('');setDocxResult(null)
    try{setDocxResult(await inspectDocx(file))}catch(e){setError(e.message)}
  }

  async function fix(){
    setRepairing(true);setError('')
    try{const bytes=await repairPaperbackCover(inspection);downloadPdf(bytes,`${cover.name.replace(/\.pdf$/i,'')}-publishready-fixed.pdf`)}catch(e){setError(e.message)}finally{setRepairing(false)}
  }

  return <section id="checker" className="checker wrap"><div className="checker-heading"><span className="eyebrow">Free beta</span><h2>Check the files you already have.</h2><p>Real file inspection. Plain-English results. Automatic repair when the problem is safely fixable.</p></div><div className="checker-layout"><div className="checker-panel"><h3>Paperback cover PDF</h3><div className="form cover-settings"><label>Trim size<select value={trim} onChange={e=>setTrim(e.target.value)}><option value="6x9">6 × 9 in</option><option value="5.5x8.5">5.5 × 8.5 in</option><option value="5x8">5 × 8 in</option></select></label><label>Final page count<input type="number" min="24" value={pages} onChange={e=>setPages(e.target.value)}/></label><label>Paper<select value={paper} onChange={e=>setPaper(e.target.value)}><option>White</option><option>Cream</option></select></label></div><div className="required-size"><span>Required cover size</span><b>{required.width.toFixed(3)} × {required.height.toFixed(3)} in</b><small>Spine: {required.spine.toFixed(3)} in</small></div><button className="drop" onClick={()=>coverInput.current.click()}><input ref={coverInput} hidden type="file" accept="application/pdf,.pdf" onChange={e=>runCover(e.target.files?.[0])}/><strong>{cover?cover.name:'Choose paperback cover PDF'}</strong><span>{cover?'Click to replace':'One-page PDF'}</span></button>{busy&&<p className="status">Inspecting the actual PDF…</p>}{inspection&&<div className={inspection.pass?'result pass':'result fail'}><div className="result-title"><b>{inspection.pass?'PASS — dimensions match':'BLOCKING ISSUE FOUND'}</b><span>{inspection.actual.width.toFixed(3)} × {inspection.actual.height.toFixed(3)} in actual</span></div>{inspection.pass?<p><Check/> The PDF canvas matches the required KDP dimensions within tolerance.</p>:inspection.issues.map(issue=><p key={issue.code}><span className="x">×</span>{issue.message}</p>)}{inspection.canAutoFix&&<><p className="warning">Automatic repair will proportionally enlarge and center the existing cover to the exact canvas. Review the output before submitting because edge content may be cropped.</p><button className="primary" onClick={fix} disabled={repairing}>{repairing?'Repairing…':'Fix Dimensions & Download PDF'}</button></>}</div>}</div><div className="checker-panel"><h3>Manuscript DOCX</h3><p className="muted">The beta analyzes structure locally. It does not upload your manuscript.</p><button className="drop" onClick={()=>docxInput.current.click()}><input ref={docxInput} hidden type="file" accept=".docx" onChange={e=>runDocx(e.target.files?.[0])}/><strong>{docx?docx.name:'Choose manuscript DOCX'}</strong><span>{docx?'Click to replace':'DOCX only'}</span></button>{docxResult&&<div className="docx-results"><div><b>{docxResult.words.toLocaleString()}</b><span>words</span></div><div><b>{docxResult.paragraphs.toLocaleString()}</b><span>paragraphs</span></div><div><b>{docxResult.chapters.length}</b><span>headings detected</span></div><p><Check/> Read successfully in your browser.</p></div>}<div className="beta-scope"><h4>What is real tonight</h4><p><Check/> PDF canvas inspection</p><p><Check/> Exact paperback dimension calculation</p><p><Check/> Downloadable dimension repair</p><p><Check/> Local DOCX structure analysis</p><h4>Not represented as complete</h4><p><span className="x">×</span>Creative cover redesign</p><p><span className="x">×</span>Guaranteed KDP approval</p><p><span className="x">×</span>Final EPUB/interior generation</p></div></div></div>{error&&<p className="error">{error}</p>}</section>
}

function App(){return <><Header onHome={()=>window.scrollTo(0,0)}/><main><section className="hero wrap"><div><span className="eyebrow">Built for independent authors</span><h1>Your book is done.<br/><span>We help you publish it right.</span></h1><p className="lead">Check and correct the files you already have—without waiting days for a canned KDP rejection.</p><div className="hero-actions"><a className="primary" href="#checker">Check My Files →</a><a className="secondary" href="#pricing">See Pricing</a></div><div className="trust"><span>✓ Files stay in your browser</span><span>✓ Exact KDP calculations</span><span>✓ No subscription</span></div></div><div className="hero-proof"><div className="proof-badge">REAL FILE CHECK</div><h3>Accepted cover target</h3><p>6 × 9 paperback · 263 pages · white paper</p><strong>12.842 × 9.250 in</strong><p className="proof-note">PublishReady calculates the target, reads the PDF canvas, reports the exact difference, and repairs safe dimension errors.</p></div></section><CoverChecker/><Pricing/><section id="faq" className="faq wrap"><h2>Questions, answered simply.</h2><details><summary>Is this just ChatGPT advice?<span>+</span></summary><p>No. The checker reads the actual PDF page dimensions and creates a corrected PDF. AI explanation alone is not the product.</p></details><details><summary>Does a passing result guarantee Amazon approval?<span>+</span></summary><p>No. This beta validates dimensions and basic structure. Additional visual safe-zone, barcode, font, transparency, and interior checks are still being added.</p></details><details><summary>Are my files uploaded?<span>+</span></summary><p>No. Current beta processing happens locally in your browser.</p></details></section></main><footer className="wrap"><Logo/><span>© 2026 PublishReady · Beta</span></footer></>}

export default App
