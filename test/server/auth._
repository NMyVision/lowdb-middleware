import request from 'supertest'
import * as ldm from '../../src'
import authHandler from '../../src/auth'

describe('Server', () => {
  let server
  let router
  let db
  let ao // auth options
  // let token

  beforeEach(() => {
    db = {}

    // @ts-ignore
    db.users = {
      name: 'John Foo',
      username: 'foo',
      email: 'foo@example.com'
    }

    ao = {
      usernameKey: 'username',
      passwordKey: 'password',
      secret: 'SuperSecret'
    }

    server = ldm.create()
    router = authHandler(db, ao)
    server.use(router)
  })
  /*
  describe('GET /signin', () => {
    let { password, username } = db.users[0]

    it('should respond with corresponding resource', () =>
      request(server)
        .post('/signin')
        .send({ password, username })
        .expect(db.user)
        .expect(200))
  })

  describe('GET /me', () => {
    it('should respond with corresponding resource', () =>
      request(server)
        .get('/user')
        .expect(db.user)
        .expect(200))
  })

  describe('POST /login', () => {
    it('should create resource', () => {
      const user = { name: 'bar' }
      return request(server)
        .post('/user')
        .send(user)
        .expect(user)
        .expect(201)
    })
  })
*/
  describe('POST /register', () => {
    it('should create resource', () => {
      const user = { name: 'bar' }
      return request(server)
        .post('/user')
        .send(user)
        .expect(user)
        .expect(201)
    })
  })
})
