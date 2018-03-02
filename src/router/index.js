import express from 'express'
import methodOverride from 'method-override'
import _ from 'lodash'
import lodashId from 'lodash-id'
import low from 'lowdb'
import FileSync from 'lowdb/adapters/FileSync'
import MemoryAdapter from 'lowdb/adapters/Memory'
import bodyParser from '../body-parser'
import validateData from './validate-data'
import plural from './plural'
import nested from './nested'
import singular from './singular'
import * as mixins from '../mixins'

export default (source, opts = { foreignKeySuffix: 'Id' }) => {
  // Create router
  const router = express.Router()

  // Add middlewares
  router.use(methodOverride())
  router.use(bodyParser)

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

  // Expose database
  router['db'] = db

  // Expose render
  router['render'] = (req, res) => {
    res.jsonp(res.locals.data)
  }

  // GET /db
  router.get('/db', (req, res) => {
    res.jsonp(db.getState())
  })

  // Handle /:parent/:parentId/:resource
  router.use(nested(opts))

  // Create routes
  db
    .forEach((value, key) => {
      if (_.isPlainObject(value)) {
        router.use(`/${key}`, singular(db, key))
        return
      }

      if (_.isArray(value)) {
        router.use(`/${key}`, plural(db, key, opts))
        return
      }

      const msg =
        `Type of "${key}" (${typeof value}) ${_.isObject(source) ? '' : `in ${source}`} is not supported. ` +
        `Use objects or arrays of objects.`

      throw new Error(msg)
    })
    .value()

  router.use((req, res) => {
    if (!res.locals.data) {
      res.status(404)
      res.locals.data = {}
    }

    router['render'](req, res)
  })

  router.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send(err.stack)
  })

  return router
}
