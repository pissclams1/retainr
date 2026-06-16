import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const base='https://xwtoyifklvdkcvaowjks.supabase.co'
const supabase=createClient(base,'sb_publishable_x4jmIPJmAr5gIJkSrGxJAw_ydhhtXzY')
const checkoutEndpoint=`${base}/functions/v1/publishready-create-checkout`
const orderEndpoint=`${base}/functions/v1/publishready-create-order`
const confirmEndpoint=`${base}/functions/v1/publishready-confirm-payment`
const statusEndpoint=`${base}/functions/v1/publishready-order-status`
const ids={'eBook manuscript':'ebook-manuscript','Paperback manuscript':'paperback-manuscript','eBook cover':'ebook-cover','Paperback cover':'paperback-cover'}

function currentIssueState(){
  const hasResults=Boolean(document.querySelector('#checker .result, #checker .docx-results, #checker .visual-findings'))
  const hasBlockingIssues=Boolean(document.querySelector('#checker .result.fail, #checker .visual-findings.fail, #checker .error'))
  const hasAutoFix=Boolean([...document.querySelectorAll('#checker button')].some(button=>/Correct, Verify/i.test(button.textContent)))
  return {hasResults,hasBlockingIssues,hasAutoFix}
}
function selectedItems(){return [...document.querySelectorAll('#pricing .option.selected b')].map(node=>ids[node.textContent.trim()]).filter(Boolean)}
function issueSummary(){return [...document.querySelectorAll('#checker .result.fail p, #checker .visual-findings.fail p, #checker .error')].map(node=>node.textContent.trim()).filter(Boolean).slice(0,25)}
function checkedFiles(items){
  const out=[]
  document.querySelectorAll('#checker .checker-panel').forEach(panel=>{
    const title=panel.querySelector('h3')?.textContent||''
    const file=panel.querySelector('input[type=file]')?.files?.[0]
    if(!file)return
    let deliverable=''
    if(/Paperback cover/i.test(title))deliverable='paperback-cover'
    if(/Paperback interior/i.test(title))deliverable='paperback-manuscript'
    if(/Kindle EPUB/i.test(title))deliverable='ebook-manuscript'
    if(/Manuscript DOCX/i.test(title))deliverable='manuscript-docx'
    if(/eBook cover/i.test(title))deliverable='ebook-cover'
    if(deliverable&&(items.includes(deliverable)||deliverable==='manuscript-docx'))out.push({file,deliverable})
  })
  return out
}
async function postJson(url,body){
  const res=await fetch(url,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)})
  const data=await res.json().catch(()=>({}))
  if(!res.ok)throw new Error(data.error||'Request failed.')
  return data
}
function ensureEmailUi(){
  const summary=document.querySelector('#pricing .price-summary')
  if(!summary||summary.querySelector('.publishready-email'))return
  const label=document.createElement('label')
  label.className='publishready-email'
  label.innerHTML='<span>Email for repair order</span><input type="email" placeholder="you@example.com" autocomplete="email" />'
  const total=summary.querySelector('.total')
  summary.insertBefore(label,total)
}
function emailValue(){return document.querySelector('#pricing .publishready-email input')?.value?.trim()||''}

export default function StripeCheckoutBridge(){
  const[status,setStatus]=useState('')
  const[busy,setBusy]=useState(false)
  const[issueState,setIssueState]=useState({hasResults:false,hasBlockingIssues:false,hasAutoFix:false})

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search)
    const success=params.get('checkout')==='success'
    const cancelled=params.get('checkout')==='cancelled'
    const orderId=params.get('order_id')||''
    const sessionId=params.get('session_id')||''
    const token=params.get('token')||''
    if(cancelled)setStatus('Checkout cancelled. No charge was made.')
    if(success&&orderId&&sessionId){
      setStatus('Payment received. Confirming repair order…')
      postJson(confirmEndpoint,{orderId,sessionId}).then(()=>setStatus('Payment confirmed. Your files are in the repair queue.')).catch(error=>setStatus(error.message))
    }
    if(orderId&&token){
      postJson(statusEndpoint,{orderId,token}).then(data=>{
        if(data.links?.length)setStatus(`Your corrected files are ready: ${data.links.map(link=>link.filename).join(', ')}`)
        else if(data.order?.status)setStatus(`Order status: ${data.order.status}`)
      }).catch(()=>{})
    }

    const sync=()=>{
      const next=currentIssueState();setIssueState(next);ensureEmailUi()
      const pricing=document.querySelector('#pricing')
      const heading=pricing?.querySelector('.config-copy h2')
      const copy=pricing?.querySelector('.config-copy p')
      const note=pricing?.querySelector('.price-summary > small')
      const button=pricing?.querySelector('.price-summary .primary.wide')
      if(heading)heading.textContent='Free to check. Pay only to fix.'
      if(copy)copy.textContent='Run the preflight first. Clean files do not pay. If PublishReady finds issues, submit a paid repair order and receive corrected files by secure link.'
      if(!button||!note)return
      button.setAttribute('href','#checker')
      if(!next.hasResults){button.textContent='Run Free Preflight First';button.classList.add('outline');note.textContent='No charge until PublishReady finds a correction issue.';button.removeAttribute('aria-disabled')}
      else if(!next.hasBlockingIssues){button.textContent='No Charge Needed';button.classList.add('outline');button.setAttribute('aria-disabled','true');note.textContent='No blocking issues found. There is nothing to buy.'}
      else{button.textContent=busy?'Creating repair order…':'Submit Repair Order';button.classList.remove('outline');button.removeAttribute('aria-disabled');note.textContent='Issues found. Pay to submit files for repair. Corrected files are delivered by secure link.'}
    }

    const onClick=async event=>{
      const button=event.target.closest?.('#pricing .price-summary .primary.wide')
      if(!button)return
      event.preventDefault()
      const now=currentIssueState()
      if(!now.hasResults){setStatus('Run the free preflight first.');return}
      if(!now.hasBlockingIssues){setStatus('No charge needed. PublishReady found no blocking issues.');return}
      if(busy)return
      const email=emailValue()
      if(!/^\S+@\S+\.\S+$/.test(email)){setStatus('Enter an email address for the repair order.');document.querySelector('#pricing .publishready-email input')?.focus();return}
      const items=selectedItems()
      if(!items.length){setStatus('Select at least one deliverable.');return}
      const files=checkedFiles(items)
      if(!files.length){setStatus('Upload the files you want repaired before checkout.');return}
      setBusy(true);setStatus('Creating private repair order…')
      try{
        const order=await postJson(orderEndpoint,{email,items,issueSummary:issueSummary(),files:files.map(({file,deliverable})=>({name:file.name,type:file.type||'application/octet-stream',size:file.size,deliverable}))})
        setStatus('Uploading files securely…')
        for(const target of order.uploadTargets){
          const match=files.find(({file})=>file.name.replace(/[^a-zA-Z0-9._-]+/g,'-').replace(/-+/g,'-').slice(0,120)===target.name)
          if(!match)continue
          const {error}=await supabase.storage.from('publishready-orders').uploadToSignedUrl(target.path,target.token,match.file,{contentType:match.file.type||'application/octet-stream',upsert:true})
          if(error)throw error
        }
        setStatus('Opening secure checkout…')
        const checkout=await postJson(checkoutEndpoint,{orderId:order.orderId,origin:window.location.origin})
        window.location.assign(checkout.url)
      }catch(error){setStatus(error.message||'Unable to create repair order.');setBusy(false)}
    }
    sync()
    document.addEventListener('click',onClick,true)
    const observer=new MutationObserver(sync)
    observer.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class']})
    return()=>{document.removeEventListener('click',onClick,true);observer.disconnect()}
  },[busy])

  return <>
    <div className={`charge-policy ${issueState.hasResults&&!issueState.hasBlockingIssues?'clean':issueState.hasBlockingIssues?'issues':''}`}>
      <b>Free to check. Pay only to fix.</b>
      <span>{!issueState.hasResults?'Upload files first. Repair checkout is locked until PublishReady finds an issue.':issueState.hasBlockingIssues?'Issues found. Paid repair stores files privately and delivers corrected files by secure link.':'No blocking issues found. No payment needed.'}</span>
    </div>
    {status?<div role="status" style={{position:'fixed',right:20,bottom:20,zIndex:9999,maxWidth:460,padding:'14px 18px',borderRadius:12,background:'#111827',color:'#fff'}}>{status}</div>:null}
  </>
}
