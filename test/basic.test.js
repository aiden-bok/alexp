import { jest } from '@jest/globals'
import request from 'supertest'

jest.useFakeTimers()

import alexp from '../src/index.js'

describe('Test default configuration server application', () => {
  beforeAll(async () => {})

  afterAll(async () => {})

  const app = alexp.server.create()
  app.get('/', (req, res) => {
    res.send('Welcome')
  })

  test('Should response to root path request', () => {
    return request(app)
      .get('/')
      .expect(200)
      .then((response) => {
        expect(response.text).toEqual('Welcome')
      })
  })

  test('Should 404 error to not found request', () => {
    return request(app)
      .get('/test')
      .expect(404)
      .then((response) => {
        expect(response.error).toEqual(new Error('cannot GET /test (404)'))
        expect(response.clientError).toBe(true)
        expect(response.serverError).toBe(false)
      })
  })
})
