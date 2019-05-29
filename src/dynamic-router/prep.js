import { lowdb } from '../core'
import { isPlainObject, isArray } from 'lodash'

export default ({ autoCreate = false, databaseFolder = 'databases' }) => (req, res, next) => {
  let db = null
  let type = null
  let { database, collection } = req.params

  try {
    const filename = `${databaseFolder}/db.${database}.json`
    db = lowdb(filename, autoCreate)
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message })
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
