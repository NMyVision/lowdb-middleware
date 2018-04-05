import express from 'express'
import { write, delay, plural } from '../core'

const { single, list, create, update, destroy } = plural

export default (db, name, opts) => {
  // Create router
  const router = express.Router()
  router.use(delay)

  const w = write(db)

  function prep(req, res, next) {
    res.locals = { db, name, opts, id: req.params.id }
    return next()
  }

  router.all('*', prep, opts.onInit)

  router
    .route('/')
    .get(opts.onRead, list)
    .post(opts.onWrite, create, w)

  router
    .route('/:id')
    .get(opts.onRead, single)
    .put(opts.onWrite, update, w)
    .patch(opts.onWrite, update, w)
    .delete(opts.onDelete, opts.onWrite, destroy, w)

  return router
}
