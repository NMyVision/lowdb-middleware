import express from 'express'
import { write, delay, plural } from '../core'

const { single, list, create, update, remove } = plural

export default (db, name, opts) => {
  // Create router
  const router = express.Router()
  router.use(delay)

  function prep(req, res, next) {
    Object.assign(res.locals, { db, name, opts, id: req.params.id })
    return next()
  }

  router.all('*', prep, opts.onInit)

  router
    .route('/')
    .get(opts.onRead, list)
    .post(opts.onWrite, create, write)

  router
    .route('/:id')
    .get(opts.onRead, single)
    .put(opts.onWrite, update, write)
    .patch(opts.onWrite, update, write)
    .delete(opts.onDelete, opts.onWrite, remove, write)

  return router
}
