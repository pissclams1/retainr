import { useEffect, useState } from 'react'

const END=new Date('2026-06-22T23:59:59-04:00').getTime()
const FORM_ENDPOINT='https://formsubmit.co/ajax/andreas11735@gmail.com'

export default function LaunchAccess(){
  const[open,setOpen]=useState(false)
  const[email,setEmail]=useState(()=>localStorage.getItem('publishready_launch_email')||'')
  const[pending,setPending]=useState(null)
  const[status,setStatus]=useState('')
  const[busy,setBusy]=useState(false)
  const launchActive=Date.now()<=END

  useEffect(()=>{
    const handler=event=>{
      const button=event.target.closest('button')
      if(!button||button.textContent.trim()!=='Download results'||!launchActive||email)return
      event.preventDefault()
      event.stopImmediatePropagation()
      setPending(button)
      setOpen(true)
    }
    document.addEventListener('click',handler,true)
    return()=>document.removeEventListener('click',handler,true)
  },[email,launchActive])

  async function submit(event){
    event.preventDefault()
    if(!email.trim())return
    setBusy(true);setStatus('Unlocking corrections…')
    try{
      const response=await fetch(FORM_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify({email:email.trim(),_subject:'PublishReady launch-week signup',event:'full_correction_report_unlock',timestamp:new Date().toISOString(),_captcha:'false',_template:'table'})})
      if(!response.ok)throw new Error('capture failed')
      localStorage.setItem('publishready_launch_email',email.trim())
      setStatus('Unlocked. Downloading your correction report…')
      setTimeout(()=>{setOpen(false);pending?.click();setPending(null);setBusy(false);setStatus('')},300)
    }catch{
      setStatus('Could not unlock the report. Please try again.')
      setBusy(false)
    }
  }

  return <>
    <div style={{position:'sticky',top:0,zIndex:9999,background:'#111827',color:'#fff',padding:'10px 18px',textAlign:'center',fontWeight:700,fontSize:14}}>{launchActive?<><strong style={{color:'#a7f3d0'}}>Launch Week:</strong> full inspection, correction guidance, and supported repairs are free through June 22. One book package per email.</>:<>Basic inspection remains free. Full correction reports and repairs are available with a paid package.</>}</div>
    {open&&<div role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setOpen(false)}} style={{position:'fixed',inset:0,zIndex:10000,display:'flex',alignItems:'center',justifyContent:'center',padding:20,background:'rgba(15,23,42,.72)'}}><form onSubmit={submit} style={{width:'min(480px,100%)',background:'#fff',borderRadius:18,padding:26,boxShadow:'0 24px 80px rgba(0,0,0,.25)'}}><h2 style={{margin:'0 0 8px'}}>Unlock the full correction report</h2><p style={{color:'#475569'}}>Enter your email to download every detected problem, the required correction, and supported repaired files for this book package.</p><label style={{display:'block',fontWeight:700,marginBottom:8}}>Email</label><input value={email} onChange={e=>setEmail(e.target.value)} type="email" required autoComplete="email" placeholder="you@example.com" style={{width:'100%',boxSizing:'border-box',border:'1px solid #cbd5e1',borderRadius:10,padding:'13px 14px',font:'inherit'}}/><div style={{display:'flex',gap:10,marginTop:16}}><button type="button" onClick={()=>setOpen(false)} className="secondary">Cancel</button><button type="submit" disabled={busy} className="primary" style={{flex:1}}>{busy?'Unlocking…':'Unlock Corrections'}</button></div><div style={{minHeight:22,marginTop:12,fontSize:13,color:status.startsWith('Unlocked')?'#047857':'#b91c1c'}}>{status}</div><small style={{color:'#64748b'}}>No file contents or filenames are sent.</small></form></div>}
  </>
}
