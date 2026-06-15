import assert from 'node:assert/strict'
import { analyzePrintedNavigation, numberToken } from '../src/printNavigationValidator.js'

assert.equal(numberToken('did'),null)
assert.equal(numberToken('xiv').value,14)
assert.equal(numberToken('9').value,9)

const makePage=(pdfPage,printed,title='')=>({
  pdfPage,width:432,height:648,
  items:[...(printed?[{text:String(printed),x:214,y:620}]:[]),...(title?[{text:title,x:72,y:540}]:[])],
  text:title,
})
const pages=[
  {pdfPage:1,width:432,height:648,items:[],text:'Title'},
  {pdfPage:2,width:432,height:648,items:[{text:'Contents',x:72,y:560},{text:'Prologue',x:72,y:520},{text:'1',x:360,y:520},{text:'Clarity',x:72,y:490},{text:'9',x:360,y:490}],text:'Contents Prologue 1 Clarity 9'},
  makePage(3,1,'PROLOGUE'),
  ...Array.from({length:7},(_,i)=>makePage(i+4,i+2,'Body')),
  makePage(11,9,'CLARITY'),
]
const good=analyzePrintedNavigation(pages)
assert.equal(good.pass,true)
assert.equal(good.tocEntries.length,2)
assert.equal(good.tocMatched,2)

const jump=pages.map(page=>({...page,items:page.items.map(item=>({...item}))}))
jump[4].items[0].text='7'
const bad=analyzePrintedNavigation(jump)
assert.equal(bad.pass,false)
assert.ok(bad.blockers.some(message=>/jumps|backward|more than one/.test(message)))

console.log('Printed TOC and page-number tests passed.')
