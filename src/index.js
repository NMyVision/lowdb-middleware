import express from 'express'
import defaults from './defaults'
import rewriter from './rewriter'
import bodyParser from './body-parser'
import staticRouter from './static-router'
import dynamicRouter from './dynamic-router'
import * as core from './core'

const create = () => express().set('json spaces', 2)

export default { create, defaults, rewriter, bodyParser, staticRouter, dynamicRouter, core }
