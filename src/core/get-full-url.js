import url from 'url'

export default req => {
  const root = url.format({
    protocol: req.protocol,
    host: req.get('host')
  })

  return `${root}${req.originalUrl}`
}
