import alexp from 'alexp'

// Create a router for APIs
const api = new alexp.server.Router()
api.get('/', (req, res) => {
  res.render('index', { title: 'ALExp JSON example - API' })
})

export default api
