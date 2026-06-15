import { useEffect, useState } from 'react'

const endpoint = 'https://xwtoyifklvdkcvaowjks.supabase.co/functions/v1/publishready-create-checkout'
const ids = {
  'eBook manuscript': 'ebook-manuscript',
  'Paperback manuscript': 'paperback-manuscript',
  'eBook cover': 'ebook-cover',
  'Paperback cover': 'paperback-cover',
}

export default function StripeCheckoutBridge(){
  const [status,setStatus]=useState('')
  const [busy,setBusy]=useState(false)

  useEffect(()=>{
    const params=new URLSearchParams(window.location.search)
    if(params.get('checkout')==='success')setStatus('Payment received. Your order is confirmed.')
    if(params.get('checkout')==='cancelled')setStatus('Checkout cancelled. No charge was made.')

    const sync=()=>{
      const note=document.querySelector('#pricing .price-summary > small')
      if(note)note.textContent='One-time payment. Secure checkout powered by Stripe.'
      const button=document.querySelector('#pricing .price-summary .primary.wide')
      if(button){button.textContent=busy?'Opening checkout…':'Continue to Checkout';button.setAttribute('href','#pricing')}
    }

    const onClick=async event=>{
      const button=event.target.closest?.('#pricing .price-summary .primary.wide')
      if(!button)return
      event.preventDefault()
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

  return status?<div role="status" style={{position:'fixed',right:20,bottom:20,zIndex:9999,maxWidth:420,padding:'14px 18px',borderRadius:12,background:'#111827',color:'#fff'}}>{status}</div>:null
}
