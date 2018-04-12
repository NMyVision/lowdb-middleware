export default {
  foreignKeySuffix: 'Id',
  DatabaseFolder: 'databases',
  mapResource(database, collection) {},
  onSchema(req, res, next) {
    next()
  },
  onInit(req, res, next) {
    next()
  },
  onRead(req, res, next) {
    next()
  },
  onWrite(req, res, next) {
    next()
  },
  onDelete(req, res, next) {
    next()
  },
  onRender(req, res) {
    res.jsonp(res.locals.data)
  }
}
