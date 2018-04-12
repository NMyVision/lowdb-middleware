export default (req, res, next) => {
  let db = res.locals.db
  db.write()
  next()
}
