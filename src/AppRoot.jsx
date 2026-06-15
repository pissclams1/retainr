import { useEffect } from 'react'
import AppLaunch from './AppLaunch'
import LaunchAccess from './LaunchAccess'
import StripeCheckoutBridge from './StripeCheckoutBridge'

export default function AppRoot(){
  useEffect(()=>{
    const updateCopy=()=>{
      document.querySelectorAll('.hero .eyebrow').forEach(node=>{node.textContent='Free KDP preflight for independent authors'})
      document.querySelectorAll('.hero h1').forEach(node=>{node.innerHTML='Free to check.<br><span>Pay only to fix.</span>'})
      document.querySelectorAll('.hero .lead').forEach(node=>{node.textContent='Upload your KDP files before paying. If they look clean, PublishReady tells you they look publish-ready and there is nothing to buy. If blocking issues appear, pay to unlock corrections and supported repaired files.'})
      document.querySelectorAll('.hero-actions .primary').forEach(node=>{node.textContent='Run Free Preflight →'})
      document.querySelectorAll('.hero-actions .secondary').forEach(node=>{node.textContent='How Pricing Works'})
      document.querySelectorAll('.trust span').forEach((node,index)=>{const copy=['✓ No charge for clean files','✓ Files stay local','✓ Pay only for corrections'];if(copy[index])node.textContent=copy[index]})
      document.querySelectorAll('.proof-badge').forEach(node=>{node.textContent='FAIR DIAGNOSTIC MODEL'})
      document.querySelectorAll('.hero-proof h3').forEach(node=>{node.textContent='No toll booth. No fake urgency.'})
      document.querySelectorAll('.hero-proof strong').forEach(node=>{node.textContent='Only pay when there is a fix.'})
      document.querySelectorAll('.proof-note').forEach(node=>{
        if(node.textContent.includes('KDP tells you a file failed')||node.textContent.includes('Margin figures remain correction guidance')){
          node.textContent='PublishReady runs the preflight first. Clean files get a free pass result. Problem files get exact correction guidance and supported repairs after checkout.'
        }
      })
      document.querySelectorAll('.checker-heading .eyebrow').forEach(node=>{node.textContent='Free preflight'})
      document.querySelectorAll('.checker-heading h2').forEach(node=>{node.textContent='Check first. Pay only if there is something to fix.'})
      document.querySelectorAll('.checker-heading p').forEach(node=>{node.textContent='Upload the files you already have. PublishReady checks them locally and tells you whether there are blocking KDP issues before you ever reach checkout.'})
    }
    updateCopy()
    const observer=new MutationObserver(updateCopy)
    observer.observe(document.body,{childList:true,subtree:true})
    return()=>observer.disconnect()
  },[])
  return <>
    <LaunchAccess />
    <StripeCheckoutBridge />
    <AppLaunch />
  </>
}
