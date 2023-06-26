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
     * @property {Boolean} [splat=true] Wether to use string interpolation('%d', '%s') splat for style messages.
     */
    splat: true,
    /**
     * @property {String} [timestamp='YYYY-MM-DD HH:mm:ss.SSS'] Timestamp format to use when outputting the log output message reception time.
     */
    timestamp: 'YYYY-MM-DD HH:mm:ss.SSS'
  },
  /**
   * @property {Object} server Configuration object related to the server application.
   */
  server: {
    /**
     * @property {Number} port Port to listen on the `Express` server.
     */
    port: 80
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
