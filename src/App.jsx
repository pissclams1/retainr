import { useRef, useState } from 'react'

const DELIVERABLES = [
  { id: 'ebook-manuscript', label: 'eBook manuscript', group: 'Manuscript', detail: 'Validated EPUB' },
  { id: 'paperback-manuscript', label: 'Paperback manuscript', group: 'Manuscript', detail: 'Print-ready interior PDF' },
  { id: 'hardcover-manuscript', label: 'Hardcover manuscript', group: 'Manuscript', detail: 'Hardcover interior PDF' },
  { id: 'ebook-cover', label: 'eBook cover', group: 'Covers', detail: 'Amazon-ready JPG' },
  { id: 'paperback-cover', label: 'Paperback cover', group: 'Covers', detail: 'Full-wrap cover PDF' },
  { id: 'hardcover-cover', label: 'Hardcover cover', group: 'Covers', detail: 'Hardcover wrap PDF' },
]

const priceFor = count => count ? Math.min(59, 19 + (count - 1) * 10) : 0
const Check = () => <span className="check">✓</span>

function Logo({ onClick }) {
  return <button className="logo" onClick={onClick}><span>P</span><b>PublishReady</b></button>
}

function Header({ onStart, onHome }) {
  return <header className="site-header"><div className="wrap nav"><Logo onClick={onHome}/><nav><a href="#how">How It Works</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></nav><button className="primary small" onClick={onStart}>Check My Book</button></div></header>
}

function ProductVisual() {
  return <div className="product-window"><div className="window-top"><span/><span/><span/><small>PublishReady</small></div><div className="product-preview"><div className="preview-top"><div><h3>Your book is <em>ready to publish.</em></h3><p>Every selected edition is checked, matched, and organized.</p></div><b>✓ ALL CLEAR</b></div><div className="preview-cards">{['Kindle eBook','Paperback','Hardcover'].map((name,i)=><article key={name}><div className={`format-dot tone-${i}`}>▣</div><h4>{name}</h4><p><Check/> File valid</p><p><Check/> Settings matched</p><p><Check/> Ready to upload</p></article>)}</div><div className="package-summary"><Check/><div><b>Readiness report</b><p>No preventable technical blockers found.</p></div><strong>0 issues</strong></div></div></div>
}

function Configurator({ onContinue, compact=false }) {
  const [selected,setSelected] = useState(['ebook-manuscript','ebook-cover'])
  const toggle = id => setSelected(current => current.includes(id) ? current.filter(x=>x!==id) : [...current,id])
  const price = priceFor(selected.length)
  const group = name => DELIVERABLES.filter(x=>x.group===name)
  return <section id={compact ? undefined : 'pricing'} className={compact ? 'configurator compact' : 'configurator wrap'}>
    {!compact && <div className="config-copy"><span className="eyebrow">One book. One clean package.</span><h2>Pay only for the editions you are publishing.</h2><p>Start at $19. Add any other deliverable for $10. The complete six-file publishing package never costs more than $59.</p></div>}
    <div className="config-card">
      <div className="config-groups">
        {['Manuscript','Covers'].map(name=><div className="config-group" key={name}><h3>{name}</h3>{group(name).map(item=><label className={selected.includes(item.id)?'option selected':'option'} key={item.id}><input type="checkbox" checked={selected.includes(item.id)} onChange={()=>toggle(item.id)}/><span className="box">✓</span><span><b>{item.label}</b><small>{item.detail}</small></span></label>)}</div>)}
      </div>
      <aside className="price-summary"><p>Your publishing package</p><div className="selection-list">{selected.length ? selected.map(id=>{const item=DELIVERABLES.find(x=>x.id===id);return <span key={id}><Check/>{item.label}</span>}) : <small>Select at least one item.</small>}</div><div className="total"><span>Total</span><strong>${price}</strong></div><small>One-time payment · Same-book revisions included</small><button className="primary wide" disabled={!selected.length} onClick={()=>onContinue(selected,price)}>Start My Book →</button></aside>
    </div>
  </section>
}

function Landing({ onStart }) {
  const diy=['Interpret vague rejection messages','Format each edition separately','Calculate trim, gutter, bleed, and spine','Keep interiors and covers synchronized','Repeat the process after every correction']
  const ready=['Upload your source files once','See every blocking issue in plain English','Apply the correct rules to each edition','Keep every selected output synchronized','Receive one organized publishing package']
  return <><Header onStart={()=>onStart()} onHome={()=>window.scrollTo(0,0)}/><main><section className="hero wrap"><div><div className="eyebrow">Publishing compliance for independent authors</div><h1>Your book is finished.<br/><span>Don’t become a publishing technician now.</span></h1><p className="lead">PublishReady turns your manuscript and cover files into one clear publishing project: what is ready, what is wrong, what must change, and the exact files you need for Kindle, paperback, and hardcover.</p><div className="hero-actions"><button className="primary" onClick={()=>onStart()}>Check My Book <b>→</b></button><a className="secondary" href="#how">See How It Works</a></div><div className="trust"><span>✓ Your files stay in your browser</span><span>✓ Plain-English readiness report</span><span>✓ No subscription</span></div></div><ProductVisual/></section><section id="how" className="how"><div className="wrap"><h2>From finished manuscript to publishable book.</h2><div className="steps">{[['1','Upload once','Add your DOCX and choose the editions you need.'],['2','Fix every blocker','PublishReady checks structure, dimensions, settings, and edition conflicts.'],['3','Publish without guessing','Use one organized package and a clear upload guide.']].map(([n,t,d])=><article key={n}><span>{n}</span><div><h3>{t}</h3><p>{d}</p></div></article>)}</div></div></section><section className="contrast wrap"><article><h3 className="red">Without PublishReady</h3>{diy.map(x=><p key={x}><span className="x">×</span>{x}</p>)}</article><article><h3 className="purple">With PublishReady</h3>{ready.map(x=><p key={x}><Check/>{x}</p>)}</article></section><Configurator onContinue={onStart}/><section id="faq" className="faq wrap"><h2>Questions, answered simply.</h2>{[['What does PublishReady actually do?','It creates one publishing-readiness project from your source files. You see the selected outputs, detected manuscript structure, edition settings, preliminary print measurements, and any technical blockers that must be resolved.'],['Does PublishReady publish the book for me?','PublishReady prepares and organizes the technical package and tells you exactly what to upload. You remain in control of your Amazon account, rights, pricing, and final publication.'],['How does pricing work?','Your first selected deliverable is $19. Each additional deliverable is $10. The complete six-file book package is capped at $59.'],['Can I prepare only a cover or only an interior?','Yes. Select any combination of ebook, paperback, and hardcover manuscript or cover files.'],['Do I need to understand KDP terminology?','No. Technical checks are translated into plain English, with the measurements and settings you need shown only when they matter.']].map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</section><section className="last"><div className="wrap"><div><h2>Make KDP someone else’s problem.</h2><p>Upload your book once. Leave with a clear path to publication.</p></div><button className="primary" onClick={()=>onStart()}>Check My Book</button></div></section></main><footer className="wrap"><span>© 2026 PublishReady</span><div><a href="#how">How It Works</a><a href="#faq">FAQ</a></div></footer></>
}

async function readDocx(file) {
  if (!window.JSZip) throw new Error('The document reader did not load. Refresh and try again.')
  const zip = await window.JSZip.loadAsync(file)
  const documentFile = zip.file('word/document.xml')
  if (!documentFile) throw new Error('This does not appear to be a valid Word DOCX file.')
  const xml = await documentFile.async('string')
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  const paras = [...doc.getElementsByTagNameNS('*', 'p')]
  let words = 0, nonEmpty = 0
  const chapters = []
  paras.forEach(p => {
    const text = [...p.getElementsByTagNameNS('*', 't')].map(n => n.textContent).join('').trim()
    if (!text) return
    nonEmpty += 1
    words += text.split(/\s+/).filter(Boolean).length
    const styleNode = p.getElementsByTagNameNS('*', 'pStyle')[0]
    const style = styleNode?.getAttribute('w:val') || styleNode?.getAttribute('val') || ''
    if (/heading1|title|chapter/i.test(style) || (/^(chapter|prologue|epilogue|introduction|part)\b/i.test(text) && text.length < 90)) chapters.push(text)
  })
  const coreProps = {}
  const core = zip.file('docProps/core.xml')
  if (core) {
    const coreXml = await core.async('string')
    const cdoc = new DOMParser().parseFromString(coreXml, 'application/xml')
    ;['title','creator'].forEach(k => { const n = cdoc.getElementsByTagNameNS('*', k)[0]; if (n?.textContent) coreProps[k] = n.textContent })
  }
  return { words, paragraphs: nonEmpty, chapters: [...new Set(chapters)].slice(0,80), coreProps }
}

function Start({ onHome, onReady, initialSelection=[], initialPrice=0 }) {
  const [selection,setSelection] = useState(initialSelection)
  const [price,setPrice] = useState(initialPrice)
  const [step,setStep] = useState(initialSelection.length ? 'upload' : 'configure')
  const input = useRef(null)
  const [file,setFile]=useState(null), [status,setStatus]=useState(''), [error,setError]=useState(''), [data,setData]=useState(null)
  const [title,setTitle]=useState(''), [author,setAuthor]=useState(''), [trim,setTrim]=useState('6 × 9 in'), [paper,setPaper]=useState('White')
  const needsManuscript = selection.some(id=>id.includes('manuscript'))
  async function choose(f) { if(!f)return; setError('');setStatus('Reading your manuscript…');setFile(f);try{const result=await readDocx(f);setData(result);setTitle(result.coreProps.title||f.name.replace(/\.docx$/i,'').replace(/[-_]/g,' '));setAuthor(result.coreProps.creator||'');setStatus('Manuscript read successfully.')}catch(e){setError(e.message);setStatus('')} }
  function continueFromConfig(items,cost){setSelection(items);setPrice(cost);setStep('upload')}
  function go(){if(needsManuscript && (!file||!data))return;onReady({file,data,title:title.trim()||'Untitled Book',author:author.trim()||'Author',trim,paper,selection,price})}
  return <div className="app-page"><Header onHome={onHome} onStart={()=>{}}/><div className="wizard wrap">{step==='configure'?<Configurator compact onContinue={continueFromConfig}/>:<section className="wizard-card"><div className="order-strip"><div><span>Your selection</span><b>{selection.length} deliverable{selection.length!==1?'s':''}</b></div><strong>${price}</strong><button onClick={()=>setStep('configure')}>Change</button></div><div className="wizard-title"><div><h1>{needsManuscript?'Upload your manuscript.':'Upload your cover files.'}</h1><p>{needsManuscript?'Your DOCX is read locally in your browser.':'Cover upload and validation is the next engine milestone.'}</p></div></div>{needsManuscript?<><button className={`drop ${file?'has-file':''}`} onClick={()=>input.current.click()}><input ref={input} hidden type="file" accept=".docx" onChange={e=>choose(e.target.files?.[0])}/><strong>{file?file.name:'Choose your DOCX manuscript'}</strong><span>{file?`${(file.size/1024/1024).toFixed(2)} MB`:'DOCX files only'}</span></button>{status&&<p className="status"><Check/>{status}</p>}{error&&<p className="error">{error}</p>}{data&&<><div className="quick-stats"><div><b>{data.words.toLocaleString()}</b><span>words</span></div><div><b>{data.chapters.length}</b><span>chapters found</span></div><div><b>{data.paragraphs.toLocaleString()}</b><span>paragraphs</span></div></div><div className="form"><label>Book title<input value={title} onChange={e=>setTitle(e.target.value)}/></label><label>Author name<input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Author or pen name"/></label><label>Print size<select value={trim} onChange={e=>setTrim(e.target.value)}><option>6 × 9 in</option><option>5.5 × 8.5 in</option><option>5 × 8 in</option></select></label><label>Paper<select value={paper} onChange={e=>setPaper(e.target.value)}><option>White</option><option>Cream</option></select></label></div></>}</>:<div className="cover-placeholder"><div>▧</div><h3>Cover upload is queued next.</h3><p>The live pricing and selection logic is now in place.</p></div>}<button className="primary wide" disabled={needsManuscript&&!data} onClick={go}>Continue to Readiness →</button></section>}</div></div>
}

function gutterFor(pages){if(pages<=150)return .375;if(pages<=300)return .5;if(pages<=500)return .625;if(pages<=700)return .75;return .875}
function spineFor(pages,paper){return pages*(paper==='Cream'?.0025:.002252)}

function Dashboard({ project, onHome }) {
  const {data,title,author,trim,paper,file,selection,price}=project
  const pages=data?Math.max(24,Math.ceil(data.words/275)+8):0, gutter=pages?gutterFor(pages):0, spine=pages?spineFor(pages,paper):0
  const selectedItems=selection.map(id=>DELIVERABLES.find(x=>x.id===id))
  function download(){const report=`PUBLISHREADY PROJECT REPORT\n\nBook: ${title}\nAuthor: ${author}\nOrder total: $${price}\nSelected files:\n${selectedItems.map(x=>'- '+x.label).join('\n')}\n${data?`\nSource: ${file.name}\nWords: ${data.words.toLocaleString()}\nDetected chapters: ${data.chapters.length}\nEstimated print pages: ${pages}\nTrim: ${trim}\nPaper: ${paper}\nRequired inside gutter: ${gutter.toFixed(3)} in\nPreliminary spine width: ${spine.toFixed(3)} in`:''}`;const blob=new Blob([report],{type:'text/plain'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='publishready-project-report.txt';a.click();URL.revokeObjectURL(a.href)}
  return <div className="dashboard-simple"><Header onHome={onHome} onStart={()=>{}}/><main className="wrap dashboard-main"><div className="dash-top"><div><p className="overline">PROJECT ANALYSIS</p><h1>Your selected package is taking shape.</h1><p>PublishReady has recorded exactly what you need.</p></div><span className="all-clear">${price} TOTAL</span></div><div className="selected-grid">{selectedItems.map(item=><article key={item.id}><Check/><div><h3>{item.label}</h3><p>{item.detail}</p></div><b>Selected</b></article>)}</div>{data&&<section className="preflight"><div className="shield">✓</div><div><h2>Initial manuscript preflight complete</h2><p>{data.words.toLocaleString()} words · {data.chapters.length} headings detected · approximately {pages} print pages</p></div><div className="issue-count"><b>{gutter.toFixed(3)}″</b><span>required gutter</span></div></section>}<section className="next-actions"><h2>Project summary</h2><div><span>1</span><p><b>Selected deliverables</b><small>{selectedItems.map(x=>x.label).join(', ')}</small></p></div><div><span>2</span><p><b>Transparent price</b><small>First item $19 · each additional item $10 · capped at $59</small></p><b>${price}</b></div><div><span>3</span><p><b>Download your project report</b><small>Keep your selection and preliminary KDP measurements.</small></p><button onClick={download}>Download Report</button></div></section></main></div>
}

export default function App(){
  const [view,setView]=useState('landing'),[project,setProject]=useState(null),[selection,setSelection]=useState([]),[price,setPrice]=useState(0)
  const home=()=>{setView('landing');window.scrollTo(0,0)}
  const start=(items=[],cost=0)=>{setSelection(items);setPrice(cost);setView('start');window.scrollTo(0,0)}
  if(view==='start')return <Start onHome={home} initialSelection={selection} initialPrice={price} onReady={p=>{setProject(p);setView('dashboard')}}/>
  if(view==='dashboard')return <Dashboard project={project} onHome={home}/>
  return <Landing onStart={start}/>
}
