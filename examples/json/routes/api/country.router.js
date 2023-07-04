import alexp from 'alexp'

import { countryController } from '../../controllers/index.js'

// Create a router for country
const countryRouter = new alexp.server.Router()
// Router for country list
countryRouter.get('/', countryController.list)

export default countryRouter
