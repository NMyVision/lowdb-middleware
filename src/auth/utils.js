import crypto from 'crypto'
import jwt from 'jsonwebtoken'

/** @type {utils.encrypt} */
export function encrypt(value, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(value)
    .digest('hex')
}

/** @type {LowDb.Middleware.Auth.utils.createToken} */
export function createToken(payload, options) {
  let { secret, expiresIn } = options
  return jwt.sign(payload, secret, { expiresIn })
}

/**
 *
 * Synchronously verify given token using a secret or a public key to get a decoded token
 * @export
 * @param {String} token
 * @param {String} secret
 * @returns {String|Object} The decoded token.
 */
export function verifyToken(token, secret) {
  return jwt.verify(token, secret)
}

/**
 * Validate the user, if found return the user object otherwise null
 *
 * @export
 * @param {Object} option
 * @param {string} option.email
 * @param {string} option.password
 * @param {any} getUser
 * @returns {any}
 */
export function verifyCredentials(option, getUser) {
  let { email, password } = option
  let hashedPassword = encrypt(password)
  let user = getUser(email)

  return user && user.password === hashedPassword ? user : null
}
