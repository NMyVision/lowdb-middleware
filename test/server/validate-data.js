import assert from 'assert'
import validateData from '../../src/core/validate-data'

describe('validateData', () => {
  it('should throw an error if data contains /', () => {
    assert.throws(() => validateData({ 'a/b': [] }), /found \//)
  })

  it('should throw an error if data is an array', () => {
    assert.throws(() => validateData([]), /must be an object/)
  })

  it("shouldn't throw an error", () => {
    assert.doesNotThrow(() => validateData({ a: [] }))
  })
})
