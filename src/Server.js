import express from 'express'
import http from 'http'

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
  const tag = `[ALExp.Server.create]`
  global.log = log
  log.debug(`Configuration for ALExp: %o`, config)

  const app = express()
  // TODO: Express settings

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
const Server = { create }

export default Server
