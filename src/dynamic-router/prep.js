import { lowdb } from '../core'
import { isPlainObject, isArray } from 'lodash'
import fs from 'fs'

const fileExists = async filename => {
  try {
    fs.accessSync(filename, fs.constants.F_OK)
    return true
  } catch (e) {
    return false
  }
}

export default ({ autoCreate = false, databaseFolder }) => (req, res, next) => {
  let db = null
  let type = null
  let { database, collection } = req.params

  try {
    const filename = `${databaseFolder}/db.${database}.json`
    if (!autoCreate && !fileExists(filename)) throw new Error('Database does not exist.')
    db = lowdb(filename)
  } catch (e) {
    return res
      .status(404)
      .json({ error: e })
      .end()
  }
  // if database only has one collection don't require collection to be passed in url
  if (collection === undefined) collection = database
  var coll = db.get(collection).value()
  if (isPlainObject(coll)) {
    type = 'object'
  } else if (isArray(coll)) {
    type = 'array'
  }

  let id = req.params.id

  Object.assign(res.locals, { db, name: collection, type, id })

  next()
}
