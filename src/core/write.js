export default source => {
  return (req, res, next) => {
    let db = source || res.locals.db
    db.write()
    next()
  }
}
