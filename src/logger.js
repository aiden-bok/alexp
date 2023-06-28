import fs from 'fs'
import path from 'path'
import split from 'split'
import winston from 'winston'
import winstonDaily from 'winston-daily-rotate-file'

import { applyConfig, config } from './config.js'

/**
 * @constant {Array} LEVELS List of log levels.
 */
const LEVELS = ['error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly']

/**
 * Create and return a log format(`winston.Format`) using the passed configuration object.
 *
 * @param {config} custom Logger configuration object to use when creating a `winston.Logger` instance.
 * @returns {winston.Format} Log output format to be used by `winston.Logger`.
 */
const logFormat = (custom) => {
  const { combine, printf, splat, timestamp } = winston.format
  const cfg = custom?.logger
  const formats = []

  if (cfg?.splat !== false) {
    formats.push(splat())
  }

  let format = 'YYYY-MM-DD HH:mm:ss.SSS'
  if (cfg?.timestamp?.constructor.name === 'String') {
    format = cfg.timestamp
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
 * @param {config} custom Logger configuration object to use when creating a `winston.Logger` instance.
 * @returns {winston.Transports} Configured log transports
 */
const setTransports = (custom) => {
  let option = { format: logFormat(custom) }
  const cfg = custom?.logger

  // Log file name
  let datePattern = 'YYYYMMDD'
  if (cfg?.file?.date?.constructor.name === 'String') {
    datePattern = cfg.file.date
  }
  option = { ...option, datePattern }

  // Log file path
  let dirname = path.resolve(`logs`)
  if (cfg?.file?.path?.constructor.name === 'String') {
    dirname = path.resolve(cfg.file.path)
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

  // Log level
  let level = 3
  if (!isNaN(cfg?.level)) {
    level = cfg.level > 6 ? 6 : cfg.level < 0 ? 0 : cfg.level
  }

  // Log transports
  const transports = []
  for (let i = 0; i <= level; i++) {
    transports.push(
      new winstonDaily({
        ...option,
        filename: `%DATE%-${LEVELS[i]}.log`,
        level: LEVELS[i]
      })
    )
  }

  // Console logging
  transports.push(new winston.transports.Console({ ...option, level: 'silly' }))

  return transports
}

/**
 * Crreate and return a logger object for server application logs.
 *
 * @param {config} [custom] Logger configuration object to use when creating a `winston.Logger` instance.
 * @returns {winston.Logger} `winston.Logger` instance.
 */
const create = (custom) => {
  custom = (custom && applyConfig(custom)) || config

  const logger = winston.createLogger({ transports: setTransports(custom) })
  logger.stream = split().on('data', (message) => {
    logger.http(message)
  })

  return logger
}

/**
 * Logger object for managing server logs using the `winston` framework.
 *
 * @namespace logger
 */
const logger = { create }

export default logger
