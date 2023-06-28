import compression from 'compression'
import timeout from 'connect-timeout'
import cookieParser from 'cookie-parser'
import express from 'express'
import session from 'express-session'
import http from 'http'
import createError from 'http-errors'
import morgan from 'morgan'
import path from 'path'

import Config, { applyConfig } from './Config.js'
import Logger from './Logger.js'

/**
 * Returns the port to listen on on the `Express` server.
 *
 * @param {Config} config Configuration.
 * @returns {Number|String} Port to listen on `Express` server.
 */
const getPort = (config) => {
  const port = process?.env?.PORT || config?.server?.port || 80
  return port.constructor.name === 'String' ? port : parseInt(port, 10)
}

/**
 * Setting the created `Express` server application.
 *
 * @param {Express} app Created `Express` instance.
 * @param {Config} config Configuration object to use when setting an 'Express' server application.
 */
const setExpress = (app, config) => {
  const tag = '[ALExp.Server.setExpress]'
  const cfg = config?.server

  const port = getPort(config)
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
 * Setting the modules to be used in the created `Express` server application.
 *
 * @param {Express} app Created `Express` instance.
 * @param {Config} config Configuration object to use when setting an 'Express' server application.
 */
const useExpress = (app, config) => {
  const tag = '[ALExp.Server.useExpress]'
  const cfg = config?.server

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

  if (config?.logger?.stream && log?.stream) {
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

  if (cfg?.ignore404) {
    app.get('*', (req, res) => {
      res.sendFile('/', { root: cfg?.static })
    })
    log.debug(`${tag} ignore 404`)
  }

  app.use((req, res, next) => {
    next(createError(404))
  })

  app.use((err, req, res) => {
    err?.status !== 404 && log.error(`${tag} Error: %o`, err)

    res.locals.message = err?.message
    res.locals.error = req?.app?.get('env') === 'development' ? err : {}
    res.status(err?.status || 500)
    res.render('error')
  })
}

/**
 * Create and return `Express` server application.
 *
 * @param {Config} [config] Configuration object to use when creating an 'Express' server application.
 * @returns {Express} `Express` server application instance.
 */
const create = (config) => {
  // Apply custom configuration
  config = (config && applyConfig(config)) || Config

  // Logger
  const log = Logger.create(config) || console
  const tag = '[ALExp.Server.create]'
  global.log = log
  log.debug('Configuration for ALExp: %o', config)

  const app = express()
  setExpress(app, config)
  useExpress(app, config)

  const server = http.createServer(app)
  const port = getPort(config)
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
  })

  return app
}

/**
 * Server application object using `Express` framework.
 *
 * @namespace
 */
const Server = { create, Router: express.Router }

export default Server
