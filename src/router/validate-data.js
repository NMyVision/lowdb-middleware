import _ from 'lodash'

function validateKey(key) {
  if (key.indexOf('/') !== -1) {
    const msg = [
      `Oops, found / character in database property '${key}'.`,
      '',
      "/ aren't supported, if you want to tweak default routes, see",
      'https://github.com/typicode/json-server/#add-custom-routes'
    ].join('\n')
    throw new Error(msg)
  }
}

export default obj => {
  if (_.isPlainObject(obj)) {
    Object.keys(obj).forEach(validateKey)
  } else {
    throw new Error(
      `Data must be an object. Found ${typeof obj}.` + 'See https://github.com/typicode/json-server for example.'
    )
  }
}
