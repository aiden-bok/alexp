import express from 'express'
import http from 'http'

import Config, { applyConfig } from './Config.js'

/**
 * Returns the port to listen on on the `Express` server.
 *
 * @param {Config} config Configuration.
 * @returns {Number|String} Port to listen on `Express` server.
 */
const getPort = (config) => {
  const port = process?.env?.PORT || config.server.port
  return port.constructor.name === 'String' ? port : parseInt(port, 10)
}

/**
 * Create and return `Express` server application.
 *
 * @param {Config} [config] Configuration object to use when creating an 'Express' server application.
 * @returns {Express} `Express` server application instance.
 */
const create = (config) => {
  config = (config && applyConfig(config)) || Config
  // TODO: Logging configuration

  const app = express()
  // TODO: Express settings

  const server = http.createServer(app)
  const port = getPort(config)
  server.listen(port)

  return app
}

/**
 * Server application object using `Express` framework.
 *
 * @namespace
 */
const Server = { create }

export default Server
