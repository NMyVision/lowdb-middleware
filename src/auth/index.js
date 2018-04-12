import express from 'express'
import methodOverride from 'method-override'
import bodyParser from '../body-parser'
import { delay, lowdb, plural, write } from '../core'
import { verifyToken, createToken, verifyCredentials } from './utils'

export default function auth(source, opts) {
  const o = Object.assign(opts, { name: 'users', usernameKey: 'username' })
  const router = express.Router()
  const name = opts.name || 'users'
  delay(opts.delay)

  // Add middlewares
  router.use(methodOverride())
  router.use(bodyParser)

  // Create database
  let db = lowdb(source)

  let handleAuth = (req, res, next) => {
    try {
      console.log('Auth middleware...', req.url, req.method, req.body, res.locals)

      if (res.locals.bypass) {
        console.log(':: bypass ::')
        next()
        return
      }

      if (req.headers.authorization === undefined || req.headers.authorization.split(' ')[0] !== 'Bearer') {
        res.locals.error = 'Bad authorization header'
        res.locals.isAuthenticated = null
        throw new Error('No token')
      } else {
        let payload = verifyToken(req.headers.authorization.split(' ')[1], o.secret)
        res.locals.user = req.user
        res.locals.payload = payload
        res.locals.isAuthenticated = true
      }
    } catch (err) {
      console.log('auth error', res.locals.authRequired)
      res.locals.isAuthenticated = false
      res.locals.error = 'Token is invalid or missing.'
      if (res.locals.authRequired) {
        res.status(401).json({ type: 'error', error: res.locals.error })
        return
      }
    }

    next()
  }

  let requireAuth = (req, res, next) => {
    handleAuth(req, res, next)

    return next()
  }

  let handleLogin = (req, res) => {
    const { email, password } = req.body
    let user = verifyCredentials({ email, password }, GetUser)
    if (!user) {
      const status = 403
      const message = 'Incorrect email or password'
      res.status(status).json({ type: 'error', status, message })
      return
    }
    const u = { id: user.id, email: user.email, name: user.name }
    const accessToken = createToken(u, { secret: o.secret, expiresIn: '1h' })
    res.status(200).json({ type: 'success', user: u, token: accessToken })
  }

  function GetUser(value) {
    let result = db
      .get(o.name)
      .find(x => x[o.usernameKey].toString().toLowerCase() === value.toLowerCase())
      .value()
    return result
  }

  function UpdateUser() {}

  function Register(req, res, next) {
    let username = res.params[opts.usernameKey]
    let password = res.params.password
    console.log(username, password)

    next()
  }

  function prep(req, res, next) {
    res.locals = { db, name, opts }
    return next()
  }

  router.all('*', prep)

  router
    .get('/me', requireAuth, GetUser)

    .get('/signin', handleLogin)
    .get('/register', Register, plural.create, write)
    .post('/:id', requireAuth, UpdateUser, plural.update, write)
    .patch('/:id', requireAuth, UpdateUser, plural.update, write)
    .delete('/:id', requireAuth, plural.remove, write)
  return router
}
