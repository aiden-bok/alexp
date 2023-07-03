import alexp from 'alexp'

import router from './router/index.js'

// Create `Express` server application instance
const app = alexp.server.create()
// Router settings
app.setRouter(router)
