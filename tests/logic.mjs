import assert from 'node:assert/strict'
import { requiredPaperbackCoverSize, spineWidth } from '../src/coverEngine.js'

const accepted = requiredPaperbackCoverSize({ trimWidth: 6, trimHeight: 9, pageCount: 263, paper: 'White' })
assert.equal(accepted.height.toFixed(3), '9.250')
assert.equal(accepted.width.toFixed(3), '12.842')
assert.equal(accepted.spine.toFixed(3), '0.592')

assert.equal(spineWidth(263, 'Cream').toFixed(4), '0.6575')

const priceFor = count => count ? 19 + (count - 1) * 10 : 0
assert.deepEqual([0,1,2,3,4,5,6].map(priceFor), [0,19,29,39,49,59,69])

console.log('PublishReady deterministic logic tests passed.')
