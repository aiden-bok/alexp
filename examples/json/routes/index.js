import alexp from 'alexp'

import apiRouter from './api/index.js'

// Create a router
const router = new alexp.server.Router()
// Register a router for APIs
router.use('/api', apiRouter)

export default router
