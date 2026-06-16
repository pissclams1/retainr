import { useEffect } from 'react'
import AppLaunch from './AppLaunch'
import LaunchAccess from './LaunchAccess'
import StripeCheckoutBridge from './StripeCheckoutBridge'

export default function AppRoot(){
  useEffect(()=>{
    const updateCopy=()=>{
      document.querySelectorAll('.hero .eyebrow').forEach(node=>{node.textContent='Free KDP preflight for independent authors'})
      document.querySelectorAll('.hero h1').forEach(node=>{node.innerHTML='We find and correct<br><span>KDP file problems.</span>'})
      document.querySelectorAll('.hero .lead').forEach(node=>{node.textContent='PublishReady finds KDP problems and corrects supported file errors before you submit. Free checks run first; paid repair orders are delivered by secure link.'})
      document.querySelectorAll('.hero-actions .primary').forEach(node=>{node.textContent='Run Free Preflight →'})
      document.querySelectorAll('.hero-actions .secondary').forEach(node=>{node.textContent='How Pricing Works'})
      document.querySelectorAll('.trust span').forEach((node,index)=>{const copy=['✓ No charge for clean files','✓ Secure repair-order delivery','✓ Pay only for corrections'];if(copy[index])node.textContent=copy[index]})
      document.querySelectorAll('.proof-badge').forEach(node=>{node.textContent='FREE TO CHECK. PAY ONLY TO FIX.'})
      document.querySelectorAll('.hero-proof h3').forEach(node=>{node.textContent='Clear answers before upload day.'})
      document.querySelectorAll('.hero-proof strong').forEach(node=>{node.textContent='Find the problem before it costs time.'})
      document.querySelectorAll('.proof-note').forEach(node=>{
        if(node.textContent.includes('KDP tells you a file failed')||node.textContent.includes('Margin figures remain correction guidance')||node.textContent.includes('Clean files get')){
          node.textContent='PublishReady runs the preflight first. Clean files get a free pass result. Problem files become paid repair orders with secure delivery and automatic expiry.'
        }
      })
      document.querySelectorAll('.checker-heading .eyebrow').forEach(node=>{node.textContent='Free preflight'})
      document.querySelectorAll('.checker-heading h2').forEach(node=>{node.textContent='Check first. Pay only if there is something to fix.'})
      document.querySelectorAll('.checker-heading p').forEach(node=>{node.textContent='Upload the files you already have. PublishReady checks them locally and tells you whether there are KDP issues before you ever reach checkout.'})
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
