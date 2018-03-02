import express from 'express'
import rewrite from 'express-urlrewrite'

export default routes => {
  const router = express.Router()

  router.get('/__rules', (req, res) => {
    res.json(routes)
  })

  Object.keys(routes).forEach(key => {
    // @ts-ignore
    router.use(rewrite(key, routes[key]))
  })

  return router
}
