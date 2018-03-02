import express from 'express'
import pluralize from 'pluralize'
import delay from './delay'

export default opts => {
  const router = express.Router()
  router.use(delay)

  // Rewrite URL (/:resource/:id/:nested -> /:nested) and request query
  function get(req, res, next) {
    const prop = pluralize.singular(req.params.resource)
    req.query[`${prop}${opts.foreignKeySuffix}`] = req.params.id
    req.url = `/${req.params.nested}`
    next()
  }

  // Rewrite URL (/:resource/:id/:nested -> /:nested) and request body
  function post(req, res, next) {
    const prop = pluralize.singular(req.params.resource)
    req.body[`${prop}${opts.foreignKeySuffix}`] = req.params.id
    req.url = `/${req.params.nested}`
    next()
  }

  // prettier-ignore
  return router
    .get("/:resource/:id/:nested", get)
    .post("/:resource/:id/:nested", post)
}
