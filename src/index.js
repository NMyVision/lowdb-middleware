import express from 'express'
import defaults from './defaults'
import rewriter from './rewriter'
import bodyParser from './body-parser'
import router from './router'

export default {
  create: () => express().set('json spaces', 2),
  defaults,
  rewriter,
  bodyParser,
  router
}
