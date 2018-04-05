import getFullURL from './get-full-url'

export function get(req, res, next) {
  let { db, name } = res.locals
  res.locals.data = db.get(name).value()
  next()
}

export function create(req, res, next) {
  let { db, name } = res.locals
  db.set(name, req.body).value()
  res.locals.data = db.get(name).value()

  res.setHeader('Access-Control-Expose-Headers', 'Location')
  res.location(`${getFullURL(req)}`)

  res.status(201)
  next()
}

export function update(req, res, next) {
  let { db, name } = res.locals
  if (req.method === 'PUT') {
    db.set(name, req.body).value()
  } else {
    db
      .get(name)
      .assign(req.body)
      .value()
  }

  res.locals.data = db.get(name).value()
  next()
}
