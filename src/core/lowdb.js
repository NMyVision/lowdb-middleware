import _ from 'lodash'
import lodashId from 'lodash-id'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import MemoryAdapter from 'lowdb/adapters/Memory'
import validateData from './validate-data'
import * as mixins from './mixins'
import fs from 'graceful-fs'

export default (source, autoGenerate = false) => {
  // Create database
  let db = null

  if (_.isObject(source)) {
    db = low(new MemoryAdapter(null))
    db.setState(source)
  } else if (fs.existsSync(source) || autoGenerate) {
    db = low(new FileSync(source))
  }

  if (db === null) throw new Error(`Unable to find database ${source}.`)

  validateData(db.getState())

  // Add lodash-id methods to db
  db._.mixin(lodashId)

  // Add specific mixins
  db._.mixin(mixins)

  return db
}
