import alexp from 'alexp'

import api from './api/index.js'

// Create a router
const router = new alexp.server.Router()
// Register a router for APIs
router.use('/api', api)

export default router
