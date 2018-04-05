import express from 'express'
import { delay, write, singular } from '../core'

const { get, create, update } = singular

export default (db, name, opts) => {
  const router = express.Router()
  router.use(delay)

  const w = write(db)

  function prep(req, res, next) {
    res.locals = { db, name }
    return next()
  }

  router
    .route('/')
    .all(prep, opts.onInit)
    .get(opts.onRead, get)
    .post(opts.onWrite, create, w)
    .put(opts.onWrite, update, w)
    .patch(opts.onWrite, update, w)

  return router
}
