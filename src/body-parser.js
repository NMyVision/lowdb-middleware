const bodyParser = require('body-parser')

// prettier-ignore
module.exports = [
  bodyParser.json({ limit: '10mb', extended: false }), 
  bodyParser.urlencoded({ extended: false })
]
