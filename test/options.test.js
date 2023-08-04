import { jest } from '@jest/globals'
import request from 'supertest'

jest.useFakeTimers()

import alexp from '../src/index.js'

describe('Test ignore404 option of configuration for server application', () => {
  let app = null

  beforeAll(async () => {
    const option = {
      server: {
        static: 'examples/simple/static'
      }
    }

    app = alexp.server.create(option)
  })

  afterAll(async () => {
    app.server.close()
  })

  test('Should response to request for page not found', () => {
    return request(app)
      .get('/')
      .expect(200)
      .then((response) => {
        expect(response.text.includes('<!DOCTYPE html>')).toBe(true)
      })
  })
})
