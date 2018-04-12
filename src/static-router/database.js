import express from 'express'
import { write, database, defaultOptions } from '../core'

const { getAll, getKeys, update, updateItem, remove } = database

export default (db, options) => {
  let opts = Object.assign({}, defaultOptions, options)

  const router = express.Router()

  function prep(req, res, next) {
    Object.assign(res.locals, { db, isRoot: true, id: req.params.id })
    return next()
  }

  router
    .route('/db')
    .all(prep, opts.onSchema, opts.onInit)
    .head(opts.onRead, getKeys)
    .get(opts.onRead, getAll)
    .patch(opts.onWrite, update, write, getAll)

  router
    .route('/db/:id')
    .all(prep, opts.onSchema, opts.onInit)
    .delete(opts.onDelete, remove, write, getAll)
    .patch(opts.onWrite, updateItem, write, getAll)

  return router
}
