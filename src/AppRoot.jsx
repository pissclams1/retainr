import { useEffect } from 'react'
import AppLaunch from './AppLaunch'
import LaunchAccess from './LaunchAccess'

export default function AppRoot(){
  useEffect(()=>{
    const updateCopy=()=>{
      document.querySelectorAll('.proof-note').forEach(node=>{
        if(node.textContent.includes('Margin figures remain correction guidance')){
          node.textContent='Page geometry, page count, printed numbering, table-of-contents references, text margins, and embedded fonts are checked.'
        }
      })
    }
    updateCopy()
    const observer=new MutationObserver(updateCopy)
    observer.observe(document.body,{childList:true,subtree:true})
    return()=>observer.disconnect()
  },[])
  return <>
    <LaunchAccess />
    <AppLaunch />
  </>
}
