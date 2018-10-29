import assert from 'assert'
import _ from 'lodash'
import lodashId from 'lodash-id'
import * as mixins from '../../src/core/mixins'

describe('mixins', () => {
  let db

  before(() => {
    _.mixin(lodashId)
    _.mixin(mixins)
  })

  beforeEach(() => {
    db = {
      posts: [{ id: 1, comment: 1 }],
      comments: [
        { id: 1, postId: 1 },
        // Comments below references a post that doesn't exist
        { id: 2, postId: 2 },
        { id: 3, postId: 2 }
      ],
      photos: [{ id: '1' }, { id: '2' }]
    }
  })

  describe('getRemovable', () => {
    it('should return removable documents', () => {
      const expected = [{ name: 'comments', id: 2 }, { name: 'comments', id: 3 }]
      // @ts-ignore
      assert.deepEqual(_.getRemovable(db, { foreignKeySuffix: 'Id' }), expected)
    })

    it('should support custom foreignKeySuffix', () => {
      const expected = [{ name: 'comments', id: 2 }, { name: 'comments', id: 3 }]
      // @ts-ignore
      assert.deepEqual(_.getRemovable(db, { foreignKeySuffix: 'Id' }), expected)
    })
  })

  describe('createId', () => {
    it('should return a new id', () => {
      // @ts-ignore
      assert.equal(_.createId(db.comments), 4)
    })

    it('should return a new uuid', () => {
      // @ts-ignore
      assert.notEqual(_.createId(db.photos), 3)
    })
  })
})
