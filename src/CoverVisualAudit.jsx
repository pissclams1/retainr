import { useEffect, useRef, useState } from 'react'

const INCH=72
const SAFE=.25
const BLEED=.125
const BARCODE={width:2,height:1.2,edge:.25}
function overlap(a,b){return a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y}

export default function CoverVisualAudit({file,trimWidth,trimHeight,spine}){
  const canvasRef=useRef(null)
  const[status,setStatus]=useState('')
  const[issues,setIssues]=useState([])
  const[summary,setSummary]=useState(null)

  useEffect(()=>{
    if(!file)return
    let cancelled=false
    async function run(){
      setStatus('Rendering visual audit…');setIssues([]);setSummary(null)
      try{
        if(!window.pdfjsLib)throw new Error('Visual PDF engine did not load.')
        const data=new Uint8Array(await file.arrayBuffer())
        const pdf=await window.pdfjsLib.getDocument({data}).promise
        const page=await pdf.getPage(1)
        const base=page.getViewport({scale:1})
        const scale=Math.min(2,900/base.width)
        const viewport=page.getViewport({scale})
        const canvas=canvasRef.current
        canvas.width=Math.round(viewport.width);canvas.height=Math.round(viewport.height)
        const ctx=canvas.getContext('2d')
        await page.render({canvasContext:ctx,viewport}).promise
        const text=await page.getTextContent()
        const pageWidth=base.width/INCH,pageHeight=base.height/INCH
        const spineLeft=BLEED+trimWidth
        const spineRight=spineLeft+spine
        const frontLeft=spineRight
        const safeBoxes={
          back:{x:BLEED+SAFE,y:BLEED+SAFE,w:trimWidth-SAFE*2,h:trimHeight-SAFE*2},
          front:{x:frontLeft+SAFE,y:BLEED+SAFE,w:trimWidth-SAFE*2,h:trimHeight-SAFE*2},
          spine:{x:spineLeft+Math.min(SAFE/2,spine*.15),y:BLEED+SAFE,w:Math.max(0,spine-Math.min(SAFE,spine*.3)),h:trimHeight-SAFE*2},
          barcode:{x:BLEED+trimWidth-BARCODE.edge-BARCODE.width,y:pageHeight-BLEED-BARCODE.edge-BARCODE.height,w:BARCODE.width,h:BARCODE.height},
        }
        const found=[]
        for(const item of text.items){
          const m=window.pdfjsLib.Util.transform(base.transform,item.transform)
          const x=m[4]/INCH
          const fontHeight=Math.hypot(m[2],m[3])/INCH
          const y=(base.height-m[5])/INCH-fontHeight
          const box={x,y,w:(item.width||0)/INCH,h:Math.max(fontHeight,.01),text:(item.str||'').trim()}
          if(!box.text)continue
          const region=box.x<spineLeft?'back':box.x>spineRight?'front':'spine'
          const safe=safeBoxes[region]
          if(safe&&(box.x<safe.x||box.x+box.w>safe.x+safe.w||box.y<safe.y||box.y+box.h>safe.y+safe.h))found.push({code:'SAFE_ZONE',message:`“${box.text.slice(0,45)}” may be outside the ${region} safe zone.`})
          if(region==='back'&&overlap(box,safeBoxes.barcode))found.push({code:'BARCODE',message:`“${box.text.slice(0,45)}” overlaps the reserved barcode area.`})
        }
        const unique=[...new Map(found.map(i=>[i.code+i.message,i])).values()]
        if(cancelled)return
        drawGuides(ctx,scale,{trimWidth,trimHeight,spine,pageHeight})
        setIssues(unique);setSummary({textItems:text.items.length,pageWidth,pageHeight});setStatus('')
      }catch(e){if(!cancelled)setStatus(e.message)}
    }
    run();return()=>{cancelled=true}
  },[file,trimWidth,trimHeight,spine])

  function drawGuides(ctx,scale,{trimWidth,trimHeight,spine,pageHeight}){
    const px=inches=>inches*INCH*scale
    const h=px(pageHeight)
    ctx.save();ctx.lineWidth=2;ctx.setLineDash([8,6])
    ctx.strokeStyle='rgba(220,38,38,.9)';ctx.strokeRect(px(BLEED),px(BLEED),px(trimWidth*2+spine),px(trimHeight))
    ctx.strokeStyle='rgba(109,40,217,.95)';ctx.beginPath();ctx.moveTo(px(trimWidth+BLEED),0);ctx.lineTo(px(trimWidth+BLEED),h);ctx.moveTo(px(trimWidth+BLEED+spine),0);ctx.lineTo(px(trimWidth+BLEED+spine),h);ctx.stroke()
    ctx.strokeStyle='rgba(22,163,74,.95)';ctx.strokeRect(px(BLEED+SAFE),px(BLEED+SAFE),px(trimWidth-SAFE*2),px(trimHeight-SAFE*2));ctx.strokeRect(px(BLEED+trimWidth+spine+SAFE),px(BLEED+SAFE),px(trimWidth-SAFE*2),px(trimHeight-SAFE*2))
    ctx.strokeStyle='rgba(234,88,12,.95)';ctx.strokeRect(px(BLEED+trimWidth-BARCODE.edge-BARCODE.width),px(pageHeight-BLEED-BARCODE.edge-BARCODE.height),px(BARCODE.width),px(BARCODE.height))
    ctx.restore()
  }

  if(!file)return null
  return <div className="visual-audit"><div className="visual-legend"><span className="trim">Trim</span><span className="safe">Safe zone</span><span className="spine">Spine</span><span className="barcode">Barcode reserve</span></div><canvas ref={canvasRef}/>{status&&<p className="status">{status}</p>}{summary&&<div className={issues.length?'visual-findings fail':'visual-findings pass'}><b>{issues.length?`${issues.length} possible visual collision${issues.length===1?'':'s'}`:'No extracted text collisions found'}</b><small>{summary.textItems} text objects inspected. Rasterized text cannot be automatically located.</small>{issues.slice(0,8).map((i,n)=><p key={n}><span className="x">×</span>{i.message}</p>)}{issues.length>8&&<p>Plus {issues.length-8} more possible collisions.</p>}</div>}</div>
}
