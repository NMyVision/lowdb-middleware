import express from 'express'
import { delay, write, singular } from '../core'

const { get, create, update } = singular

export default (db, name, opts) => {
  const router = express.Router()
  router.use(delay)

  function prep(req, res, next) {
    Object.assign(res.locals, { db, name })
    return next()
  }

  router
    .route('/')
    .all(prep, opts.onInit)
    .get(opts.onRead, get)
    .post(opts.onWrite, create, write)
    .put(opts.onWrite, update, write)
    .patch(opts.onWrite, update, write)

  return router
}
