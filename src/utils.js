import pluralize from 'pluralize'

export function getPage(array, page, perPage) {
  var obj = {}
  var start = (page - 1) * perPage
  var end = page * perPage

  obj.items = array.slice(start, end)
  if (obj.items.length === 0) {
    return obj
  }

  if (page > 1) {
    obj.prev = page - 1
  }

  if (end < array.length) {
    obj.next = page + 1
  }

  if (obj.items.length !== array.length) {
    obj.current = page
    obj.first = 1
    obj.last = Math.ceil(array.length / perPage)
  }

  return obj
}

// Embed function used in GET /name and GET /name/id
export function embed(db, opts, name, resource, e) {
  e &&
    [].concat(e).forEach(externalResource => {
      if (db.get(externalResource).value) {
        const query = {}
        const singularResource = pluralize.singular(name)
        query[`${singularResource}${opts.foreignKeySuffix}`] = resource.id
        resource[externalResource] = db
          .get(externalResource)
          .filter(query)
          .value()
      }
    })
}

// Expand function used in GET /name and GET /name/id
export function expand(db, opts, resource, e) {
  e &&
    [].concat(e).forEach(innerResource => {
      const plural = pluralize(innerResource)
      if (db.get(plural).value()) {
        const prop = `${innerResource}${opts.foreignKeySuffix}`
        if (resource[prop])
          resource[innerResource] =
            db
              .get(plural)
              .getById(resource[prop])
              .value() || null
        else resource[innerResource] = null
      }
    })
}

// helper function for flatten Settings
export function getFlattenSettings(_flatten) {
  return +_flatten === 0
    ? { allowArrays: false }
    : +_flatten === 2
      ? { allowArrays: true, flattenArrays: false }
      : { allowArrays: true, flattenArrays: true } /* default */
}

// Flatten objects to simple key/value pairs
export function flatten(ob, conf) {
  let toReturn = {}
  let o = Object.assign({ allowArrays: true, flattenArrays: true }, conf)
  if (!ob) return null

  function setValue(parent, key, item) {
    if (parent !== undefined) {
      toReturn[`${parent}.${key}`] = item
    } else {
      toReturn[key] = item
    }
  }
  function flat(ob, parent) {
    Object.keys(ob).forEach(key => {
      let item = ob[key]

      if (item == null) {
        setValue(parent, key, item)
        return
      }

      // Exclude arrays from the final result
      if (Array.isArray(item) && o.allowArrays === false) return

      if (Array.isArray(item)) {
        if (o.flattenArrays === true) {
          item.forEach((el, i) => {
            let k = `${parent ? parent + '.' : ''}${key}:${i}`
            if (typeof el === 'object' || Array.isArray(el)) flat(el, k)
            else setValue(undefined, k, el)
          })
        } else {
          setValue(parent, key, item)
        }
      } else if (typeof item === 'object') {
        flat(item, key)
      } else {
        setValue(parent, key, item)
      }
    })
  }

  if (Array.isArray(ob)) {
    return ob.map(x => flatten(x, conf))
  }
  flat(ob)

  return toReturn
}
