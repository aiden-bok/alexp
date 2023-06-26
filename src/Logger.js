import split from 'split'
import winston from 'winston'

import Config, { applyConfig } from './Config.js'

/**
 * Crreate and return a logger object for server application logs.
 *
 * @param {Config} [config] Configuration object for logger.
 * @returns {winston.Logger} `winston` Logger instance.
 */
const create = (config) => {
  config = (config && applyConfig(config)) || Config

  const logger = winston.createLogger({})
  logger.stream = split().on('data', (message) => {
    logger.http(message)
  })

  return logger
}

/**
 * Logger object for managing server logs using the `winston` framework.
 *
 * @namespace Logger
 */
const Logger = { create }

export default Logger
