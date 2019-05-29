import path from 'path'
import fs from 'fs'
import { promisify } from 'util'

const writeFileAsync = promisify(fs.writeFile)
const readFileAsync = promisify(fs.readFile)
const renameAsync = promisify(fs.rename)
const readDir = promisify(fs.readdir)
const access = promisify(fs.access)

const readJsonAsync = async filename => {
  const json = await readFileAsync(filename, 'utf8')
  return JSON.parse(json)
}

const writeJsonAsync = async (filename, content) => {
  await writeFileAsync(filename, JSON.stringify(content, null, 2))
}

const exists = async filename => {
  try {
    await access(filename, fs.constants.F_OK)
    return true
  } catch (e) {
    return false
  }
}

export default options => {
  const ROOT = path.join(process.cwd(), options.databaseFolder)

  const ensureDbExists = (raiseError = false) => async (req, res, next) => {
    const name = req.params.name
    const filename = path.join(ROOT, `db.${name}.json`)
    const databaseExists = await exists(filename)

    if (!databaseExists && raiseError) {
      return res
        .status(404)
        .json({ status: 'error', message: `database '${name}' does not exists.` })
        .end()
    }

    res.locals.name = name
    res.locals.filename = filename
    res.locals.databaseExists = databaseExists

    next()
  }

  const listDatabases = async (req, res) => {
    function extract(name) {
      const offset = 3 // db.
      const index = name.lastIndexOf('.')
      return name.substr(offset, index - offset)
    }

    const files = await readDir(ROOT)
    const results = files.filter(x => x.startsWith('db.')).map(extract)
    return res
      .status(200)
      .json(results)
      .end()
  }

  const create = async (req, res) => {
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

  const rename = async (req, res, next) => {
    const { name, filename } = res.locals
    const newname = req.query.name
    if (newname) {
      const newfilename = path.join(ROOT, `db.${newname}.json`)
      await renameAsync(filename, newfilename)

      return res
        .status(200)
        .json({ status: 'success', message: `database '${name}' renamed to '${newname}'.` })
        .end()
    }
    next()
  }

  const retrieve = async (req, res, next) => {
    const { name, filename } = res.locals
    const results = await readJsonAsync(filename)
    const payload = {
      name: name,
      collections: Object.keys(results)
    }
    return res
      .status(200)
      .json(payload)
      .end()
  }

  const update = async (req, res) => {
    const { filename } = res.locals

    let content = await readJsonAsync(filename)
    let result = Object.assign({}, content, req.body)
    await writeJsonAsync(filename, result)

    return res
      .status(200)
      .json({})
      .end()
  }

  return {
    ensureDbExists,
    listDatabases,
    create,
    rename,
    retrieve,
    update
  }
}
