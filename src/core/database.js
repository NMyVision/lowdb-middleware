import { merge } from 'lodash'

export function getAll(req, res) {
  let { db } = res.locals
  res.jsonp(db.getState())
}

export function getKeys(req, res) {
  let { db } = res.locals
  res.setHeader('X-Keys', Object.keys(db.getState()).join())
  res.end()
}

export function update(req, res, next) {
  let { db } = res.locals
  let source = db.getState()
  db.setState(merge(source, req.body))
  db.write()
  return next()
}

export function updateItem(req, res, next) {
  let { db } = res.locals
  let name = req.params.id
  let source = db.getState()
  source[name] = req.body
  db.setState(source)
  db.write()
  return next()
}

export function remove(req, res, next) {
  let { db } = res.locals
  let name = req.params.id
  let source = db.getState()
  delete source[name]
  return next()
}
