import express from 'express'
import defaultPrep from './prep'
import { plural, singular, write, database, defaultOptions } from '../core'
import dynamic from './database'

export default (options, prepFunction) => {
  const opts = Object.assign({}, defaultOptions, options)
  const prep = (prepFunction || defaultPrep)(opts)
  const db = dynamic(opts)
  const router = express.Router()

  function map(req, res, next, singleAction, pluralAction, def) {
    let { type } = res.locals
    let action = type === 'object' ? singular[singleAction] : pluralAction ? plural[pluralAction] : def || undefined

    return action === undefined ? next() : action(req, res, next)
  }

  // prettier-ignore
  router
    .route('/db')
    .get(db.listDatabases)

  router
    .route('/db/:name')
    .post(db.ensureDbExists, db.create)
    .patch(db.ensureDbExists, db.update)

  router
    .route(`/:database/db`)
    .all(prep, opts.onSchema, opts.onInit)
    .head(opts.onRead, database.getKeys)
    .get(opts.onRead, database.getAll)
    .patch(opts.onWrite, database.update, database.getAll)

  router
    .route('/:database/db/:id')
    .all(prep, opts.onSchema, opts.onInit)
    .delete(opts.onDelete, opts.onWrite, database.remove, write, database.getAll)
    .patch(opts.onWrite, database.updateItem, write, database.getAll)

  router
    .route(`/:database/:collection`)
    .all(prep, opts.onInit)
    .get(opts.onRead, (req, res, next) => map(req, res, next, 'get', 'list'))
    .post(opts.onWrite, (req, res, next) => map(req, res, next, 'create', 'create'), write)
    .put(opts.onWrite, (req, res, next) => map(req, res, next, 'update'), write)
    .patch(opts.onWrite, (req, res, next) => map(req, res, next, 'update'), write)

  router
    .route(`/:database/:collection/:id`)
    .all(prep, opts.onInit)
    .get(opts.onRead, plural.single)
    .put(opts.onWrite, plural.update, write)
    .patch(opts.onWrite, plural.update, write)
    .delete(opts.onDelete, opts.onWrite, plural.remove, write)

  router.use((req, res) => {
    let { data } = res.locals
    if (!data) {
      res
        .status(404)
        .json({})
        .end()
    } else if (opts.onRender) {
      opts.onRender(req, res)
    } else res.json(data)
  })

  router.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err)
    }
    console.error(err.stack)
    res.status(500).send(err.stack)
  })

  return router
}
