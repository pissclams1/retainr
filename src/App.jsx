import { useRef, useState } from 'react'

const Check = () => <span className="check">✓</span>
const Icon = ({ children }) => <span className="icon">{children}</span>

function Logo({ onClick }) {
  return <button className="logo" onClick={onClick}><span>P</span><b>PublishReady</b></button>
}

function Header({ onStart, onHome }) {
  return <header className="site-header"><div className="wrap nav"><Logo onClick={onHome}/><nav><a href="#how">How It Works</a><a href="#pricing">Pricing</a><a href="#faq">FAQ</a></nav><button className="primary small" onClick={onStart}>Prepare My Book</button></div></header>
}

function ProductVisual() {
  const cards = [['▣','Kindle eBook','EPUB'],['▤','Paperback','PDF'],['▥','Hardcover','PDF']]
  return <div className="product-window"><div className="window-top"><span/><span/><span/><small>PublishReady</small></div><div className="product-body"><aside><div className="mini-brand"><b>P</b> PublishReady</div><strong>Dashboard</strong><span>Manuscript</span><span>Book appearance</span><span>Ebook</span><span>Paperback</span><span>Hardcover</span><span>Cover package</span></aside><main><div className="product-heading"><div><h3>Your book is <em>ready to publish.</em></h3><p>Everything is checked and organized for KDP.</p></div><b>✓ ALL CLEAR</b></div><div className="output-grid">{cards.map(([i,t,f])=><article key={t}><Icon>{i}</Icon><h4>{t}</h4><small>{f}</small><p><Check/> File valid</p><p><Check/> Settings matched</p><p><Check/> Ready to upload</p></article>)}</div><div className="package-summary"><Check/><div><b>Package Summary</b><p>No blocking issues found.</p></div><strong>0 issues</strong></div></main></div></div>
}

function Landing({ onStart }) {
  const diy=['Decode KDP requirements','Format every edition separately','Calculate gutter, bleed, trim and spine','Bounce between templates and previewers','Lose hours to trial and error']
  const ready=['Import one finished manuscript','Keep every edition synchronized','Apply the correct KDP rules automatically','Get exact cover and upload settings','Receive one clean publishing package']
  return <><Header onStart={onStart} onHome={()=>window.scrollTo(0,0)}/><main><section className="hero wrap"><div><div className="eyebrow">Built for independent authors</div><h1>Your book is done.<br/><span>We help you publish it right.</span></h1><p className="lead">Turn one finished manuscript into KDP-ready ebook, paperback, and hardcover files—without learning Amazon's technical rules.</p><div className="hero-actions"><button className="primary" onClick={onStart}>Prepare My Book <b>→</b></button><a className="secondary" href="#how">See How It Works</a></div><div className="trust"><span>✓ One manuscript</span><span>✓ Every format</span><span>✓ No publishing jargon</span></div></div><ProductVisual/></section><section id="how" className="how"><div className="wrap"><h2>Three simple steps.</h2><div className="steps">{[['1','⇧','Import your manuscript','Drop in your finished DOCX.'],['2','✓','Review your package','We check the book and every output.'],['3','↥','Upload with confidence','Use the exact files and settings we give you.']].map(([n,i,t,d])=><article key={n}><span>{n}</span><Icon>{i}</Icon><div><h3>{t}</h3><p>{d}</p></div></article>)}</div></div></section><section className="contrast wrap"><article><h3 className="red">Doing it yourself</h3>{diy.map(x=><p key={x}><span className="x">×</span>{x}</p>)}</article><article><h3 className="purple">With PublishReady</h3>{ready.map(x=><p key={x}><Check/>{x}</p>)}</article></section><section id="pricing" className="pricing wrap"><div className="price-copy"><h2>Simple pricing for finished books.</h2><p>No subscription required.</p></div><article className="price"><div><span>Single Book</span><h3>$99</h3><small>One-time payment</small></div><ul><li><Check/> Kindle, paperback & hardcover</li><li><Check/> Validation and preflight</li><li><Check/> Cover sizing and checks</li><li><Check/> Exact KDP upload guide</li></ul><button className="primary outline" onClick={onStart}>Prepare My Book</button></article><article className="price featured"><b className="badge">BEST VALUE</b><div><span>Unlimited</span><h3>$249</h3><small>One-time payment</small></div><ul><li><Check/> Unlimited personal books</li><li><Check/> Everything in Single Book</li><li><Check/> One year of updates</li><li><Check/> Priority support</li></ul><button className="primary" onClick={onStart}>Choose Unlimited</button></article></section><section id="faq" className="faq wrap"><h2>Questions, answered simply.</h2>{[['Do I need to understand KDP?','No. PublishReady is designed so you never have to learn trim, gutter, bleed, spine math, EPUB validation, or Amazon file jargon.'],['What books work best?','Novels, memoirs, biographies, business books, essays, and ordinary text-heavy nonfiction.'],['Is my manuscript private?','Yes. The browser demo reads your DOCX locally. The production Mac app keeps the complete manuscript workflow on your computer.']].map(([q,a])=><details key={q}><summary>{q}<span>+</span></summary><p>{a}</p></details>)}</section><section className="last"><div className="wrap"><div><h2>Stop wrestling with KDP.</h2><p>Your manuscript is finished. Let PublishReady handle the technical part.</p></div><button className="primary" onClick={onStart}>Prepare My Book</button></div></section></main><footer className="wrap"><span>© 2026 PublishReady</span><div><a href="#faq">FAQ</a><a href="mailto:support@publishready.app">Support</a></div></footer></>
}

async function readDocx(file) {
  if (!window.JSZip) throw new Error('The document reader did not load. Refresh and try again.')
  const zip = await window.JSZip.loadAsync(file)
  const documentFile = zip.file('word/document.xml')
  if (!documentFile) throw new Error('This does not appear to be a valid Word DOCX file.')
  const xml = await documentFile.async('string')
  const doc = new DOMParser().parseFromString(xml, 'application/xml')
  const paras = [...doc.getElementsByTagNameNS('*', 'p')]
  let words = 0
  let nonEmpty = 0
  const chapters = []
  paras.forEach(p => {
    const text = [...p.getElementsByTagNameNS('*', 't')].map(n => n.textContent).join('').trim()
    if (!text) return
    nonEmpty += 1
    words += text.split(/\s+/).filter(Boolean).length
    const styleNode = p.getElementsByTagNameNS('*', 'pStyle')[0]
    const style = styleNode?.getAttribute('w:val') || styleNode?.getAttribute('val') || ''
    const looksLikeChapter = /^(chapter|prologue|epilogue|introduction|part)\b/i.test(text) && text.length < 90
    if (/heading1|title|chapter/i.test(style) || looksLikeChapter) chapters.push(text)
  })
  const coreProps = {}
  const core = zip.file('docProps/core.xml')
  if (core) {
    const coreXml = await core.async('string')
    const cdoc = new DOMParser().parseFromString(coreXml, 'application/xml')
    ;['title','creator','subject'].forEach(k => { const n = cdoc.getElementsByTagNameNS('*', k)[0]; if (n?.textContent) coreProps[k] = n.textContent })
  }
  return { words, paragraphs: nonEmpty, chapters: [...new Set(chapters)].slice(0, 80), coreProps }
}

function gutterFor(pages) { if (pages <= 150) return .375; if (pages <= 300) return .5; if (pages <= 500) return .625; if (pages <= 700) return .75; return .875 }
function spineFor(pages, paper) { return pages * (paper === 'Cream' ? .0025 : .002252) }

function Start({ onHome, onReady }) {
  const input = useRef(null)
  const [file,setFile]=useState(null), [status,setStatus]=useState(''), [error,setError]=useState(''), [data,setData]=useState(null)
  const [title,setTitle]=useState(''), [author,setAuthor]=useState(''), [trim,setTrim]=useState('6 × 9 in'), [paper,setPaper]=useState('White')
  async function choose(f) {
    if (!f) return
    setError(''); setStatus('Reading your manuscript…'); setFile(f)
    try { const result=await readDocx(f); setData(result); setTitle(result.coreProps.title || f.name.replace(/\.docx$/i,'').replace(/[-_]/g,' ')); setAuthor(result.coreProps.creator || ''); setStatus('Manuscript read successfully.') }
    catch(e) { setError(e.message); setStatus('') }
  }
  function go() { if(file && data && title.trim()) onReady({file,data,title:title.trim(),author:author.trim()||'Author',trim,paper}) }
  return <div className="app-page"><Header onHome={onHome} onStart={()=>{}}/><div className="wizard wrap"><div className="progress"><b>1</b><span>Manuscript</span><i/><b>2</b><span>Book details</span><i/><b>3</b><span>Ready</span></div><section className="wizard-card"><div className="wizard-title"><Icon>⇧</Icon><div><h1>Start with your finished manuscript.</h1><p>Your DOCX is read locally in your browser. It is not uploaded.</p></div></div><button className={`drop ${file?'has-file':''}`} onClick={()=>input.current.click()}><input ref={input} hidden type="file" accept=".docx" onChange={e=>choose(e.target.files?.[0])}/><strong>{file?file.name:'Choose your DOCX manuscript'}</strong><span>{file?`${(file.size/1024/1024).toFixed(2)} MB`:'DOCX files only'}</span></button>{status&&<p className="status"><Check/>{status}</p>}{error&&<p className="error">{error}</p>}{data&&<><div className="quick-stats"><div><b>{data.words.toLocaleString()}</b><span>words</span></div><div><b>{data.chapters.length}</b><span>chapters found</span></div><div><b>{data.paragraphs.toLocaleString()}</b><span>paragraphs</span></div></div><div className="form"><label>Book title<input value={title} onChange={e=>setTitle(e.target.value)}/></label><label>Author name<input value={author} onChange={e=>setAuthor(e.target.value)} placeholder="Author or pen name"/></label><label>Print size<select value={trim} onChange={e=>setTrim(e.target.value)}><option>6 × 9 in</option><option>5.5 × 8.5 in</option><option>5 × 8 in</option></select></label><label>Paper<select value={paper} onChange={e=>setPaper(e.target.value)}><option>White</option><option>Cream</option></select></label></div><button className="primary wide" onClick={go}>Prepare My Book →</button></>}</section></div></div>
}

function Dashboard({ project, onHome }) {
  const {data,title,author,trim,paper,file}=project
  const pages=Math.max(24,Math.ceil(data.words/275)+8), gutter=gutterFor(pages), spine=spineFor(pages,paper), chapterStatus=data.chapters.length>0
  const formats=[{name:'Kindle eBook',kind:'EPUB',tone:'violet',items:[['Manuscript readable','Ready'],['Chapter structure',chapterStatus?'Ready':'Review'],['Navigation source',chapterStatus?'Ready':'Review']]},{name:'Paperback',kind:'PDF',tone:'blue',items:[['Estimated pages',pages],['Required gutter',`${gutter.toFixed(3)} in`],['Trim size',trim]]},{name:'Hardcover',kind:'PDF',tone:'orange',items:[['Estimated pages',pages],['Required gutter',`${gutter.toFixed(3)} in`],['Interior source','Ready']]},{name:'Cover Package',kind:'PDF + JPG',tone:'green',items:[['Spine estimate',`${spine.toFixed(3)} in`],['Paper',paper],['Final after layout','Required']]}]
  function download() {
    const report=`PUBLISHREADY PROJECT REPORT\n\nBook: ${title}\nAuthor: ${author}\nSource: ${file.name}\nWords: ${data.words.toLocaleString()}\nDetected chapters: ${data.chapters.length}\nEstimated print pages: ${pages}\nTrim: ${trim}\nPaper: ${paper}\nRequired inside gutter: ${gutter.toFixed(3)} in\nPreliminary spine width: ${spine.toFixed(3)} in\n\nCHAPTERS DETECTED\n${data.chapters.map((c,i)=>`${i+1}. ${c}`).join('\n')||'No chapter headings confidently detected.'}`
    const blob=new Blob([report],{type:'text/plain'}), a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=`${title.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}-publishready-report.txt`; a.click(); URL.revokeObjectURL(a.href)
  }
  return <div className="dashboard"><aside><Logo onClick={onHome}/><div className="book-chip"><div>▥</div><p><b>{title}</b><span>{author}</span></p></div>{['Dashboard','Manuscript','Book Appearance','Ebook','Paperback','Hardcover','Cover Package','Export & Upload'].map((x,i)=><button className={i===0?'active':''} key={x}>{x}</button>)}</aside><main><div className="dash-top"><div><p className="overline">PROJECT ANALYSIS</p><h1>Your book package is taking shape.</h1><p>We read the manuscript and calculated the first KDP requirements.</p></div><span className="all-clear">✓ MANUSCRIPT READ</span></div><div className="cards">{formats.map(f=><article key={f.name}><div className={`format-symbol ${f.tone}`}>▣</div><div className="card-head"><h3>{f.name}</h3><small>{f.kind}</small></div>{f.items.map(([a,b])=><p key={a}><Check/>{a}<b>{b}</b></p>)}</article>)}</div><section className="preflight"><div className="shield">✓</div><div><h2>Initial preflight complete</h2><p>Your source file is readable. Final EPUB and print files still need to be generated.</p></div><div className="issue-count"><b>{chapterStatus?1:2}</b><span>items to review</span></div></section><section className="next-actions"><h2>What happens next</h2><div><span>1</span><p><b>Confirm the detected structure</b><small>{data.chapters.length} chapter or section headings were found.</small></p><button>Review</button></div><div><span>2</span><p><b>Generate each publishing format</b><small>EPUB, paperback PDF, hardcover PDF, and exact cover sizes.</small></p><button disabled>Engine in progress</button></div><div><span>3</span><p><b>Download your project analysis</b><small>Keep the measurements and detected structure from this DOCX.</small></p><button onClick={download}>Download Report</button></div></section></main></div>
}

export default function App() {
  const [view,setView]=useState('landing'), [project,setProject]=useState(null)
  const home=()=>{setView('landing');window.scrollTo(0,0)}
  if(view==='start') return <Start onHome={home} onReady={p=>{setProject(p);setView('dashboard')}}/>
  if(view==='dashboard') return <Dashboard project={project} onHome={home}/>
  return <Landing onStart={()=>{setView('start');window.scrollTo(0,0)}}/>
}
