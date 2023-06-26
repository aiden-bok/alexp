import split from 'split'
import winston from 'winston'

import Config, { applyConfig } from './Config.js'

/**
 * Create and return a log format(`winston.Format`) using the passed configuration object.
 *
 * @param {Config} config Logger configuration object to use when creating a `winston.Logger` instance.
 * @returns {winston.Format} Log output format to be used by `winston.Logger`.
 */
const logFormat = (config) => {
  const { combine, printf, splat, timestamp } = winston.format

  const formats = []

  if (config?.logger?.splat !== false) {
    formats.push(splat())
  }

  if (config?.logger?.timestamp?.constructor.name === 'String') {
    formats.push(timestamp({ format: config.logger.timestamp }))
  } else {
    formats.push(timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }))
  }

  formats.push(
    printf(({ level, message, timestamp }) => {
      return `[${timestamp} ${level.toUpperCase()}] ${message}`
    })
  )

  return combine(...formats)
}

/**
 * Create and return log transport objects using the passed configuration object.
 *
 * @param {Config} config Logger configuration object to use when creating a `winston.Logger` instance.
 * @returns {winston.Transports} Configured log transports
 */
const setTransports = (config) => {
  const option = { format: logFormat(config) }

  const transports = []

  // Console logging
  transports.push(new winston.transports.Console({ ...option, level: 'silly' }))

  return transports
}

/**
 * Crreate and return a logger object for server application logs.
 *
 * @param {Config} [config] Logger configuration object to use when creating a `winston.Logger` instance.
 * @returns {winston.Logger} `winston.Logger` instance.
 */
const create = (config) => {
  config = (config && applyConfig(config)) || Config

  const logger = winston.createLogger({ transports: setTransports(config) })
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
