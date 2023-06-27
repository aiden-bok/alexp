/**
 * Configuration object to use when configuring a server using the `ALExp` library.
 *
 * @namespace
 */
const Config = {
  /**
   * @property {Object} logger Configuration object related to the logger.
   */
  logger: {
    /**
     * @property {Object} file Configuration object for log files.
     */
    file: {
      /**
       * @property {String} date Date pattern string to use for log file names.
       */
      date: 'YYYYMMDD',
      /**
       *@property {String} retention Retention period to retain log files.
       */
      retention: '90d',
      /**
       * @property {String} path Path where log files will be saved.
       */
      path: 'logs',
      /**
       * @property {String} size Maximum size of one log file.
       */
      size: '30m'
    },
    /**
     * @property {Number} level Log output level.
     * |Level |Method  |
     * |-----:|:-------|
     * |     0|error   |
     * |     1|warn    |
     * |     2|info    |
     * |     3|http    |
     * |     4|verbose |
     * |     5|debug   |
     * |     6|silly   |
     */
    level: 3,
    /**
     * @property {Boolean} splat Wether to use string interpolation('%d', '%s') splat for style messages.
     */
    splat: true,
    /**
     * @property {String} timestamp Timestamp format to use when outputting the log output message reception time.
     */
    timestamp: 'YYYY-MM-DD HH:mm:ss.SSS'
  },
  /**
   * @property {Object} server Configuration object related to the server application.
   */
  server: {
    /**
     * @property {Number|String} port Port to listen on the `Express` server.
     */
    port: 80,
    /**
     * @property {Boolean} trustProxy If you have `Express` server application behind proxy, need to set `trust proxy` to true.
     */
    trustProxy: true,
    /**
     * @property {String} viewEngine View engine to use in `Express` server application.
     */
    viewEngine: 'pug',
    /**
     * @property {String|Array} views Path where view pages to be used by `Express` server application are located.
     */
    views: 'views'
  }
}

/**
 * Returns an `ALExp` server configuration object(`Config`) that applied the user-defined configuration object.
 *
 * @param {Config} [custom={}] User-defined configuration.
 * @param {Config} [original=Config] Default configuration.
 * @returns {Config} Custom configuration.
 */
export const applyConfig = (custom = {}, original = Config) => {
  for (const key in original) {
    if (original[key]?.constructor.name === 'Object') {
      custom[key] = applyConfig(custom[key] || {}, original[key])
    } else {
      custom[key] = custom[key] !== undefined ? custom[key] : original[key]
    }
  }

  return custom
}

export default Config
