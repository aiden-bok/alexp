import express from 'express'
import http from 'http'

import Config from './Config.js'

/**
 * Returns an `ALExp` server configuration object(`Config`) that applied the user-defined configuration object.
 *
 * @param {Config} [custom={}] User-defined configuration.
 * @param {Config} [original=Config] Default configuration.
 * @returns {Config} Custom configuration.
 */
const applyConfig = (custom = {}, original = Config) => {
  for (const key in original) {
    if (original[key]?.constructor.name === 'Object') {
      custom[key] = applyConfig(custom[key] || {}, original[key])
    } else {
      custom[key] = custom[key] !== undefined ? custom[key] : original[key]
    }
  }

  return custom
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

  http.createServer(app)

  return app
}

const Server = { create }

export default Server
