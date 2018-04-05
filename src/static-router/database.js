import express from 'express'
import { merge } from 'lodash'
import { write } from '../core'

export default (db, opts) => {
  const router = express.Router()
  const w = write(db)

  function prep(req, res, next) {
    res.locals = { db, isRoot: true, id: req.params.id }
    return next()
  }

  function getAll(req, res) {
    res.jsonp(db.getState())
  }

  function getKeys(req, res) {
    res.setHeader('X-Keys', Object.keys(db.getState()).join())
    res.end()
  }

  function update(req, res, next) {
    let source = db.getState()
    res.locals.db = merge(source, req.body)
    return next()
  }

  function remove(req, res, next) {
    let name = req.params.name
    let source = db.getState()
    delete source[name]
    return next()
  }

  router
    .route('/db')
    .all(prep, opts.onSchema, opts.onInit)
    .head(opts.onRead, getKeys)
    .get(opts.onRead, getAll)
    .post(opts.onWrite, update, w, getAll)

  router
    .route('/db/:id')
    .all(prep, opts.onSchema, opts.onInit)
    .delete(opts.onDelete, remove, w, getAll)

  return router
}
