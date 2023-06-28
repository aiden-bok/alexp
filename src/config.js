/**
 * Configuration object to use when configuring a server using the `alexp` library.
 *
 * @namespace
 */
export const config = {
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
     * @property {Boolean} stream Whether to log `request` and `respnose` using `morgan` middleware.
     */
    stream: true,
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
     * @property {Boolean} ignore404 Whether to ignore 404(Not Found) errors and use default pages.
     */
    ignore404: false,
    /**
     * @property {Number|String} port Port to listen on the `Express` server.
     */
    port: 80,
    /**
     * @property {Object} session Configuration object for `Express` server application `session`.
     */
    session: {
      /**
       * @property {Object} cookie Configuration object for `Express` server application `cookie` of `session`.
       */
      cookie: {
        /**
         * @property {String} domain Domain to which `cookie` will be applied.
         * By Default, no domain is set, and most clients will consider the `cookie` to apply to only current domain.
         */
        domain: undefined,
        /**
         * @property {Boolean} httpOnly Whether to allow cookies to be sent only via HTTP and not client JavaScript, to protect against cross-site scripting (XSS) attacks.
         */
        httpOnly: true,
        /**
         * @property {Number} maxAge Specifies the number(in milliseconds) to use when calculating expires attribute of `cookie`.
         */
        maxAge: undefined,
        /**
         * @property {String} path Path for the `cookie`.
         */
        path: '/',
        /**
         * @property {Boolean} secure Whether to set the cookie to be used only on HTTPS.
         */
        secure: false
      },
      /**
       * @property {Boolean} resave Whether forces the `session` to be saved back to the `session` store, even if `session` was never modified during the `request`.
       */
      resave: false,
      /**
       * @property {Boolean} saveUninitialized Whether forces a `session` that is "uninitialized" to be saved to store.
       */
      saveUninitialized: true,
      /**
       * @property {String} secret Secret string used to sign `session` cookie.
       */
      secret: 'ALExp-^#!@'
    },
    /**
     * @property {String} static Path for static files.
     */
    static: 'static',
    /**
     * @property {String} timeout Time(milliseconds) to use for request timeout.
     * Time can be specified as string allowed by th `ms` module.
     */
    timeout: '10s',
    /**
     * @property {Boolean} trustProxy If you have `Express` server application behind proxy, need to set `trust proxy` to true.
     */
    trustProxy: true,
    /**
     * @property {Boolean} useCompression Whether to enable `response` compression for `request`.
     */
    useCompression: true,
    /**
     * @property {Boolean} useCookieParser Whether to use `cookie-parser` library for `request` cookie parsing.
     */
    useCookieParser: true,
    /**
     * @property {Boolean} useJSON Whether to parse `request` into JSON format based on `body-parser`.
     */
    useJSON: true,
    /**
     * @property {Boolean} useURLEncodeExtended Whether to use URL query string data parsing as `qs` library.
     * If `true`, `qs` library that allows JSON nesting is used to analyze `reauest` query string.
     * If `false`, `querystring` library is used to analyze `reauest` query string.
     */
    useURLEncodeExtended: true,
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
 * Returns an `alexp` server configuration object(`config`) that applied the user-defined configuration object.
 *
 * @param {config} [custom={}] User-defined configuration.
 * @param {config} [original=config] Default configuration.
 * @returns {config} Custom configuration.
 */
export const applyConfig = (custom = {}, original = config) => {
  for (const key in original) {
    if (original[key]?.constructor.name === 'Object') {
      if (custom[key]?.constructor.name === 'Object') {
        custom[key] = applyConfig(custom[key] || {}, original[key])
      } else {
        custom[key] = original[key]
      }
    } else {
      custom[key] = custom[key] !== undefined ? custom[key] : original[key]
    }
  }

  return custom
}
