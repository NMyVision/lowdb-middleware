import bodyParser from 'body-parser'

// prettier-ignore
export default [
  bodyParser.json({ limit: '10mb' }), 
  bodyParser.urlencoded({ extended: false })
]
