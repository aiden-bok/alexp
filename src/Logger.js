import fs from 'fs'
import path, { basename } from 'path'
import split from 'split'
import winston from 'winston'

import Config, { applyConfig } from './Config.js'
import { fileURLToPath } from 'url'

/**
 * Create and return a log format(`winston.Format`) using the passed configuration object.
 *
 * @param {Config} config Logger configuration object to use when creating a `winston.Logger` instance.
 * @returns {winston.Format} Log output format to be used by `winston.Logger`.
 */
const logFormat = (config) => {
  const { combine, printf, splat, timestamp } = winston.format
  const cfg = config?.logger
  const formats = []

  if (cfg?.splat !== false) {
    formats.push(splat())
  }

  let format = 'YYYY-MM-DD HH:mm:ss.SSS'
  if (cfg?.timestamp?.constructor.name === 'String') {
    format = config.logger.timestamp
  }
  formats.push(timestamp({ format }))

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
  let option = { format: logFormat(config) }
  const cfg = config?.logger

  // Log file name
  let datePattern = 'YYYYMMDD'
  if (cfg?.file?.date?.constructor.name === 'String') {
    datePattern = cfg.file.date
  }
  option = { ...option, datePattern }

  // Log file path
  const urlCurrent = fileURLToPath(import.meta.url)
  const pathBase = path.dirname(urlCurrent)
  let dirname = path.resolve(`${pathBase}/logs`)
  if (cfg?.file?.path?.constructor.name === 'String') {
    if (cfg.file.path.indexOf('/') === 0) {
      dirname = path.resolve(`${cfg.file.path}`)
    } else {
      dirname = path.resolve(`${pathBase}/${cfg.file.path}`)
    }
  }
  !fs.existsSync(dirname) && fs.mkdirSync(dirname)
  option = { ...option, dirname }

  // Log file retention period
  let maxFiles = '90d'
  if (cfg?.file?.retention?.constructor.name === 'String') {
    maxFiles = cfg.file.retention
  }
  option = { ...option, maxFiles }

  // Log file maximum size
  let maxSize = '30m'
  if (cfg?.file?.size?.constructor.name === 'String') {
    maxSize = cfg.file.size
  }
  option = { ...option, maxSize }

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
