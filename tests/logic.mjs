import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { requiredPaperbackCoverSize, spineWidth, isSafeCoverResize } from '../src/coverEngine.js'
import { evaluateInteriorGeometry } from '../src/bookValidators.js'
import { evaluateEbookCover } from '../src/ebookCoverValidator.js'
import { requiredInteriorPageSize, minimumGutter, minimumOutsideMargin, evaluatePageCount } from '../src/printSpecs.js'
import { analyzeTextMargins } from '../src/interiorMarginValidator.js'
import { evaluateFontRecords } from '../src/pdfFontValidator.js'

const fixtures = JSON.parse(await readFile(new URL('./accepted-fixtures.json', import.meta.url), 'utf8'))
const coverFixture = fixtures.paperbackCover
const accepted = requiredPaperbackCoverSize({
  trimWidth: coverFixture.trimWidthInches,
  trimHeight: coverFixture.trimHeightInches,
  pageCount: coverFixture.bookPageCount,
  paper: coverFixture.paper,
})

assert.equal(accepted.height.toFixed(3), coverFixture.heightInches.toFixed(3))
assert.equal(accepted.width.toFixed(3), coverFixture.widthInches.toFixed(3))
assert.equal(accepted.spine.toFixed(3), '0.592')
assert.equal(fixtures.paperbackInterior.pageCount, coverFixture.bookPageCount)
assert.equal(fixtures.paperbackInterior.widthInches, coverFixture.trimWidthInches)
assert.equal(fixtures.paperbackInterior.heightInches, coverFixture.trimHeightInches)
assert.equal(fixtures.epub.hasNavigation, true)
assert.equal(fixtures.epub.missingManifestFiles, 0)
assert.equal(fixtures.ebookCover.widthPixels, 1365)
assert.equal(fixtures.ebookCover.heightPixels, 2048)

assert.equal(spineWidth(263, 'Cream').toFixed(4), '0.6575')
assert.equal(spineWidth(263, 'Groundwood').toFixed(4), '0.6181')
assert.equal(spineWidth(263, 'Color').toFixed(4), '0.6173')
assert.equal(requiredPaperbackCoverSize({pageCount:'',paper:'White'}).spine,0)

assert.equal(isSafeCoverResize(
  { width: accepted.width - 0.02, height: accepted.height - 0.014 },
  accepted,
), true)
assert.equal(isSafeCoverResize(
  { width: accepted.width - 0.20, height: accepted.height },
  accepted,
), false)
assert.equal(isSafeCoverResize(
  { width: accepted.width - 0.02, height: accepted.height + 0.04 },
  accepted,
), false)

assert.deepEqual(requiredInteriorPageSize({trimWidth:6,trimHeight:9,bleed:false}),{width:6,height:9})
assert.deepEqual(requiredInteriorPageSize({trimWidth:6,trimHeight:9,bleed:true}),{width:6.125,height:9.25})
assert.deepEqual([150,151,301,501,701].map(minimumGutter),[0.375,0.5,0.625,0.75,0.875])
assert.deepEqual([minimumOutsideMargin(false),minimumOutsideMargin(true)],[0.25,0.375])
assert.equal(evaluatePageCount(828,{paper:'White'}).pass,true)
assert.equal(evaluatePageCount(829,{paper:'White'}).pass,false)
assert.equal(evaluatePageCount(776,{paper:'Cream'}).pass,true)
assert.equal(evaluatePageCount(777,{paper:'Cream'}).pass,false)

const acceptedInterior=evaluateInteriorGeometry(
  Array.from({length:263},()=>({width:6,height:9})),
  {trimWidth:6,trimHeight:9,expectedPageCount:263},
)
assert.equal(acceptedInterior.pass,true)
assert.equal(acceptedInterior.warnings.length,1)

const acceptedBleedInterior=evaluateInteriorGeometry(
  Array.from({length:264},()=>({width:6.125,height:9.25})),
  {trimWidth:6,trimHeight:9,expectedPageCount:264,bleed:true},
)
assert.equal(acceptedBleedInterior.pass,true)

const wrongBleedInterior=evaluateInteriorGeometry(
  Array.from({length:264},()=>({width:6,height:9})),
  {trimWidth:6,trimHeight:9,expectedPageCount:264,bleed:true},
)
assert.equal(wrongBleedInterior.pass,false)

const mixedInterior=Array.from({length:263},()=>({width:6,height:9}))
mixedInterior[10]={width:5.5,height:8.5}
const mixedResult=evaluateInteriorGeometry(mixedInterior,{trimWidth:6,trimHeight:9,expectedPageCount:263})
assert.equal(mixedResult.pass,false)
assert.equal(mixedResult.inconsistentPages[0],11)

const wrongCount=evaluateInteriorGeometry(
  Array.from({length:262},()=>({width:6,height:9})),
  {trimWidth:6,trimHeight:9,expectedPageCount:263},
)
assert.equal(wrongCount.pass,false)
assert.match(wrongCount.blockers[0],/selected final page count is 263/)

const safeMarginPages=[
  {pdfPage:1,items:[{x:40,y:100,width:300,height:12}]},
  {pdfPage:2,items:[{x:20,y:100,width:300,height:12}]},
]
assert.equal(analyzeTextMargins(safeMarginPages,{trimWidth:6,trimHeight:9,pageCount:200}).pass,true)
const badMarginPages=[{pdfPage:1,items:[{x:10,y:100,width:320,height:12}]}]
const badMargins=analyzeTextMargins(badMarginPages,{trimWidth:6,trimHeight:9,pageCount:200})
assert.equal(badMargins.pass,false)
assert.match(badMargins.blockers[0],/gutter margin/)

assert.equal(evaluateFontRecords([{name:'EmbeddedFont',embedded:true}]).pass,true)
const missingFont=evaluateFontRecords([{name:'MissingFont',embedded:false}])
assert.equal(missingFont.pass,false)
assert.match(missingFont.blockers[0],/not embedded/)

const acceptedEbook=evaluateEbookCover({
  width:fixtures.ebookCover.widthPixels,
  height:fixtures.ebookCover.heightPixels,
  type:'image/jpeg',
})
assert.equal(acceptedEbook.pass,true)
assert.equal(acceptedEbook.ratio.toFixed(4),'0.6665')
assert.equal(evaluateEbookCover({width:800,height:1200,type:'image/jpeg'}).pass,false)
assert.equal(evaluateEbookCover({width:1600,height:1600,type:'image/jpeg'}).pass,false)
assert.equal(evaluateEbookCover({width:1365,height:2048,type:'image/webp'}).pass,false)

const priceFor = count => count ? 19 + (count - 1) * 10 : 0
assert.deepEqual([0,1,2,3,4].map(priceFor), [0,19,29,39,49])

console.log('PublishReady deterministic logic tests passed against accepted KDP fixture metadata.')
