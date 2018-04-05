import express from 'express'
import methodOverride from 'method-override'
import _ from 'lodash'
import bodyParser from '../body-parser'
import lowdb from '../core/lowdb'
import plural from './plural'
import nested from './nested'
import singular from './singular'
import database from './database'

const defaultOptions = {
  foreignKeySuffix: 'Id',
  onSchema(req, res, next) {
    next()
  },
  onInit(req, res, next) {
    next()
  },
  onRead(req, res, next) {
    next()
  },
  onWrite(req, res, next) {
    next()
  },
  onDelete(req, res, next) {
    next()
  },
  onRender(req, res) {
    res.jsonp(res.locals.data)
  }
}

export default (source, options) => {
  // Merge with default values
  let opts = Object.assign(defaultOptions, options)

  // Create router
  const router = express.Router()

  // Add middlewares
  router.use(methodOverride())
  router.use(bodyParser)

  let db = lowdb(source)

  // Expose database
  router['db'] = db

  // Handle /db
  router.use(database(db, opts))

  // Handle /:parent/:parentId/:resource
  router.use(nested(opts))

  // Create routes
  db
    .forEach((value, key) => {
      if (_.isPlainObject(value)) {
        router.use(`/${key}`, singular(db, key, opts))
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

    opts.onRender(req, res)
  })

  router.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send(err.stack)
  })

  return router
}
