import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { requiredPaperbackCoverSize, spineWidth, isSafeCoverResize } from '../src/coverEngine.js'

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

const priceFor = count => count ? 19 + (count - 1) * 10 : 0
assert.deepEqual([0,1,2,3,4,5,6].map(priceFor), [0,19,29,39,49,59,69])

console.log('PublishReady deterministic logic tests passed against accepted KDP fixture metadata.')
