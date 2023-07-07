import { jest } from '@jest/globals'
import request from 'supertest'

jest.useFakeTimers()

import alexp from '../src/index.js'

describe('Test for router of server application', () => {
  let app = null

  beforeAll(async () => {
    app = alexp.server.create()

    const api = new alexp.server.Router()
    api.get('/test', (req, res) => {
      res.send('Route for test')
    })
    app.setRouter(api)
  })

  afterAll(async () => {
    app.server.close()
  })

  test('Should response to test router request', () => {
    return request(app)
      .get('/test')
      .expect(200)
      .then((response) => {
        expect(response.text).toEqual('Route for test')
      })
  })
})
