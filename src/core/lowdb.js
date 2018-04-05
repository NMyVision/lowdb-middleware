import _ from 'lodash'
import lodashId from 'lodash-id'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import MemoryAdapter from 'lowdb/adapters/Memory'
import validateData from './validate-data'
import * as mixins from './mixins'

export default source => {
  // Create database
  let db

  if (_.isObject(source)) {
    db = low(new MemoryAdapter(null))
    db.setState(source)
  } else {
    db = low(new FileSync(source))
  }

  validateData(db.getState())

  // Add lodash-id methods to db
  db._.mixin(lodashId)

  // Add specific mixins
  db._.mixin(mixins)

  return db
}
