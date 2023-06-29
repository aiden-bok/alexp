import alexp from 'alexp'

// Create `Express` server application instance
const app = alexp.server.create()
log.info(`app: %o`, app.name)

// Create a router for "/api" URL
const api = new alexp.server.Router()
api.get('/api', (req, res) => {
  res.render('index', { title: 'ALExp setRouter example - API' })
})
app.setRouter(api)
