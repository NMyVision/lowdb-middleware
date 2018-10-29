import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)
const readDir = promisify(fs.readdir)
const access = promisify(fs.access)
const ROOT = path.join(process.cwd(), 'databases')

const exists = async filename => {
  try {
    await access(filename, fs.constants.F_OK)
    return true
  } catch (e) {
    return false
  }
}

export const listDatabases = async (req, res) => {
  function extract(name) {
    const offset = 3 // db.
    const index = name.lastIndexOf('.')
    return name.substr(offset, index - offset)
  }

  const files = await readDir(ROOT)
  const results = files.map(extract)
  return res
    .status(200)
    .json(results)
    .end()
}

export const ensureDbExists = async (req, res, next) => {
  const name = req.params.name
  const filename = path.join(ROOT, `db.${name}.json`)

  res.locals.name = name
  res.locals.filename = filename
  res.locals.databaseExists = await exists(filename)
  next()
}

export const create = async (req, res) => {
  const { name, filename, databaseExists } = res.locals

  if (databaseExists) {
    return res
      .status(406)
      .json({ status: 'error', message: `database '${name}' already exists.` })
      .end()
  }

  await writeFileAsync(filename, JSON.stringify(req.body, null, 2))

  return res.status(200).end()
}

export const update = async (req, res) => {
  let code = 200
  let data = {}
  const { name, filename, databaseExists } = res.locals
  if (!databaseExists) {
    code = 406
    data = {
      status: 'error',
      message: `database '${name}' does not exists.`
    }
  } else {
    let content = JSON.parse(await readFileAsync(filename, 'utf8'))
    let result = Object.assign({}, content, req.body)
    await writeFileAsync(filename, JSON.stringify(result, null, 2))
  }
  return res
    .status(code)
    .json(data)
    .end()
}
