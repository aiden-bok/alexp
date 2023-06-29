import compression from 'compression'
import timeout from 'connect-timeout'
import cookieParser from 'cookie-parser'
import express from 'express'
import session from 'express-session'
import http from 'http'
import createError from 'http-errors'
import morgan from 'morgan'
import path from 'path'

import { applyConfig, config } from './config.js'
import logger from './logger.js'

/**
 * Returns the port to listen on on the `Express` server.
 *
 * @param {config} custom Configuration.
 * @returns {Number|String} Port to listen on `Express` server.
 */
const getPort = (custom) => {
  const port = process?.env?.PORT || custom?.server?.port || 80
  return port.constructor.name === 'String' ? port : parseInt(port, 10)
}

/**
 * Setting the created `Express` server application.
 *
 * @param {Express} app Created `Express` instance.
 * @param {config} custom Configuration object to use when setting an 'Express' server application.
 */
const setExpress = (app, custom) => {
  const tag = '[alexp.server.setExpress]'
  const cfg = custom?.server

  const port = getPort(custom)
  app.set('port', port)
  log.debug(`${tag} set port: ${port}`)

  app.set('trust proxy', cfg?.trustProxy)
  log.debug(`${tag} set trust proxy: ${cfg?.trustProxy}`)

  cfg?.viewEngine && app.set('view engine', cfg.viewEngine)
  log.debug(`${tag} set view engine: ${cfg?.viewEngine}`)

  cfg?.views && app.set('views', path.resolve(cfg.views))
  log.debug(`${tag} set views: ${path.resolve(cfg?.views)}`)
}

/**
 * Set the `Router` to be used in th `Express` server application.
 *
 * @param {Express} app Created `Express` instance.
 * @param {config} custom Configuration object to use when setting an 'Express' server application.
 */
const setRouter = (app, custom) => {
  const tag = '[alexp.server.setRouter]'
  const cfg = custom?.server

  if (cfg?.router) {
    app.use('/', cfg.router)
    log.debug(`${tag} use router: ${cfg.router}`)
  }

  /**
   * Set the `Router` to be used in th `Express` server application.
   *
   * @param {Express.Router} router  `Router` instance to use on `Express` server application instance.
   */
  app.setRouter = (router) => {
    app.use('/', router)
    log.debug(`${tag} use router: ${router}`)
  }
}

/**
 * Setting the modules to be used in the created `Express` server application.
 *
 * @param {Express} app Created `Express` instance.
 * @param {config} custom Configuration object to use when setting an 'Express' server application.
 */
const useExpress = (app, custom) => {
  const tag = '[alexp.server.useExpress]'
  const cfg = custom?.server

  if (cfg?.useCompression !== false) {
    app.use(compression())
    log.debug(`${tag} use compression`)
  }

  if (cfg?.useCookieParser !== false) {
    app.use(cookieParser())
    log.debug(`${tag} use cookieParser`)
  }

  if (cfg?.useReqJSON !== false) {
    app.use(express.json())
    log.debug(`${tag} use express.json`)
  }

  if (cfg?.useURLEncodeExtended !== false) {
    app.use(express.urlencoded({ extended: true }))
    log.debug(`${tag} use express.urlencoded extended`)
  }

  if (custom?.logger?.stream && log?.stream) {
    app.use(morgan('combined', { stream: log.stream }))
    log.debug(`${tag} use morgan with stream`)
  } else {
    app.use(morgan('combined'))
    log.debug(`${tag} use morgan`)
  }

  cfg?.session && app.use(session(cfg.session))
  log.debug(`${tag} session configuration: %o`, cfg?.session)

  cfg?.timeout && app.use(timeout(cfg.timeout))
  log.debug(`${tag} use timeout: %o`, cfg?.timeout)

  cfg?.static && app.use(express.static(path.resolve(cfg.static)))
  log.debug(`${tag} use static: %o`, path.resolve(cfg?.static))
}

/**
 * Create and return `Express` server application.
 *
 * @param {config} [custom] Configuration object to use when creating an 'Express' server application.
 * @returns {Express} `Express` server application instance.
 */
const create = (custom) => {
  // Apply custom configuration
  custom = (custom && applyConfig(custom)) || config

  // Logger
  const log = logger.create(custom) || console
  const tag = '[alexp.server.create]'
  global.log = log

  log.info(`${'='.repeat(80)}`)
  log.debug('Configuration for alexp: %o', custom)

  const app = express()
  setExpress(app, custom)
  useExpress(app, custom)
  setRouter(app, custom)

  const server = http.createServer(app)
  const port = getPort(custom)
  const bind = typeof port === 'string' ? `namepipe ${port}` : `${port} port`
  server.listen(port)

  // Error handler
  server.on('error', (error) => {
    const tagError = `${tag} Server error`
    if (error?.syscall !== 'listen') {
      log.error(`${tagError} message: ${error.message}`)
      log.error(`${tagError}: %o`, error)
      throw error
    }

    switch (error?.code) {
      case 'EACCESS':
        log.error(`${tagError}: ${bind} requires elevated privileges.`)
        process.exit()
        break
      case 'EADDRINUSE':
        log.error(`${tagError}: ${bind} is already in use.`)
        process.exit()
        break
      default:
        error?.message && log.error(`${tagError}: ${error.message}`)
        log.error(`${tagError}: %o`, error)
        throw error
    }
  })

  // Listening handler
  server.on('listening', () => {
    log.info(`${tag} Listen on ${bind}`)
    log.info(`${'='.repeat(80)}`)
  })

  log.debug(`${'-'.repeat(79)}`)

  return app
}

/**
 * Server application object using `Express` framework.
 *
 * @namespace
 */
const server = { create, Router: express.Router }

export default server
