import alexp from 'alexp'

import countryRouter from './country.router.js'

// Create a router for APIs
const apiRouter = new alexp.server.Router()
apiRouter.get('/', (req, res) => {
  res.render('index', { title: 'ALExp JSON example - API' })
})
// Register a router for country
apiRouter.use('/country', countryRouter)

export default apiRouter
