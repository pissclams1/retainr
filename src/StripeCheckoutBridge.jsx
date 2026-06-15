import { useEffect, useState } from 'react'

const endpoint = 'https://xwtoyifklvdkcvaowjks.supabase.co/functions/v1/publishready-create-checkout'
const ids = {
  'eBook manuscript': 'ebook-manuscript',
  'Paperback manuscript': 'paperback-manuscript',
  'eBook cover': 'ebook-cover',
  'Paperback cover': 'paperback-cover',
}

function currentIssueState(){
  const hasResults=Boolean(document.querySelector('#checker .result, #checker .docx-results, #checker .visual-findings'))
  const hasBlockingIssues=Boolean(document.querySelector('#checker .result.fail, #checker .visual-findings.fail, #checker .error'))
  const hasAutoFix=Boolean([...document.querySelectorAll('#checker button')].some(button=>/Correct, Verify/i.test(button.textContent)))
  return {hasResults,hasBlockingIssues,hasAutoFix}
}

export default function StripeCheckoutBridge(){
  const [status,setStatus]=useState('')
  const [busy,setBusy]=useState(false)
  const [issueState,setIssueState]=useState({hasResults:false,hasBlockingIssues:false,hasAutoFix:false})

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search)
    if(params.get('checkout')==='success')setStatus('Payment received. Your correction package is unlocked.')
    if(params.get('checkout')==='cancelled')setStatus('Checkout cancelled. No charge was made.')

    const sync=()=>{
      const next=currentIssueState()
      setIssueState(next)
      const pricing=document.querySelector('#pricing')
      const heading=pricing?.querySelector('.config-copy h2')
      const copy=pricing?.querySelector('.config-copy p')
      const note=pricing?.querySelector('.price-summary > small')
      const button=pricing?.querySelector('.price-summary .primary.wide')
      if(heading)heading.textContent='Free to check. Pay only to fix.'
      if(copy)copy.textContent='Run the preflight first. If your files are clean, there is nothing to buy. If PublishReady finds blocking issues, unlock corrections and supported repaired files.'
      if(!button||!note)return
      button.setAttribute('href','#checker')
      if(!next.hasResults){
        button.textContent='Run Free Preflight First'
        button.classList.add('outline')
        note.textContent='No charge until PublishReady finds a correction issue.'
        button.removeAttribute('aria-disabled')
      }else if(!next.hasBlockingIssues){
        button.textContent='No Charge Needed'
        button.classList.add('outline')
        button.setAttribute('aria-disabled','true')
        note.textContent='Your uploaded files show no blocking KDP issues. Download the free pass report from the results panel.'
      }else{
        button.textContent=busy?'Opening checkout…':'Unlock Corrections'
        button.classList.remove('outline')
        button.removeAttribute('aria-disabled')
        note.textContent=next.hasAutoFix?'Issues found. Pay to unlock correction workflow and verified repaired files.':'Issues found. Pay to unlock the full correction report and manual fix instructions.'
      }
    }

    const onClick=async event=>{
      const button=event.target.closest?.('#pricing .price-summary .primary.wide')
      if(!button)return
      event.preventDefault()
      const now=currentIssueState()
      if(!now.hasResults){setStatus('Run the free preflight first. Upload your files and let PublishReady check them before checkout.');return}
      if(!now.hasBlockingIssues){setStatus('No charge needed. PublishReady found no blocking issues in the uploaded files.');return}
      if(busy)return
      const items=[...document.querySelectorAll('#pricing .option.selected b')].map(node=>ids[node.textContent.trim()]).filter(Boolean)
      if(!items.length){setStatus('Select at least one deliverable.');return}
      setBusy(true)
      setStatus('')
      try{
        const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items,origin:window.location.origin})})
        const data=await response.json()
        if(!response.ok||!data.url)throw new Error(data.error||'Unable to start checkout.')
        window.location.assign(data.url)
      }catch(error){setStatus(error.message||'Unable to start checkout.');setBusy(false)}
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
      <span>{!issueState.hasResults?'Upload your files first. PublishReady will not send you to checkout until it finds a correction issue.':issueState.hasBlockingIssues?'Blocking issues found. Checkout unlocks corrections, repair output where supported, and the full correction report.':'No blocking issues found. No payment needed.'}</span>
    </div>
    {status?<div role="status" style={{position:'fixed',right:20,bottom:20,zIndex:9999,maxWidth:420,padding:'14px 18px',borderRadius:12,background:'#111827',color:'#fff'}}>{status}</div>:null}
  </>
}
