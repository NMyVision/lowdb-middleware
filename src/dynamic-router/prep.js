import { lowdb } from '../core'
import { isPlainObject, isArray } from 'lodash'

export default opts => (req, res, next) => {
  let db = null
  let type = null
  let { database, collection } = req.params

  try {
    db = lowdb(`${opts.DatabaseFolder}/db.${database}.json`)
  } catch (e) {
    return res
      .status(404)
      .json({ error: e })
      .end()
  }

  if (collection) {
    var coll = db.get(collection).value()
    if (isPlainObject(coll)) {
      type = 'object'
    } else if (isArray(coll)) {
      type = 'array'
    }
  }

  let id = req.params.id

  Object.assign(res.locals, { db, name: collection, type, id })

  next()
}
