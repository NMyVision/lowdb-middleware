const nextHandler = (req, res, next) => next()

export default {
  foreignKeySuffix: 'Id',
  databaseFolder: 'databases',
  autoCreate: false,
  mapResource: (database, collection) => {},
  onSchema: nextHandler,
  onInit: nextHandler,
  onRead: nextHandler,
  onWrite: nextHandler,
  onDelete: nextHandler,
  onRender: (req, res) => {
    res.jsonp(res.locals.data)
  }
}
