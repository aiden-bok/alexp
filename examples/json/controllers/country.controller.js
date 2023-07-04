/**
 * Response list of countries in JSON format.
 *
 * @param {Express.Request} req `Request` of `Express` server application.
 * @param {Express.Response} res `Response` of `Express` server application.
 */
const list = async (req, res) => {
  res.json({
    code: 200,
    message: 'success',
    data: [
      {
        code2: 'US',
        code3: 'USA',
        currency: 'USD'
      },
      {
        code2: 'KO',
        code3: 'KOR',
        currency: 'KRW'
      }
    ]
  })
}

/**
 * @module countryController Controllers for related to country.
 */
const countryController = { list }

export { countryController }
