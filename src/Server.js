import express from 'express'
import http from 'http'

/**
 * Create and return `Express` server application.
 *
 * @returns {Express} `Express` server application instance.
 */
const create = () => {
  const app = express()
  // TODO: Express settings

  http.createServer(app)

  return app
}

const Server = { create }

export default Server
