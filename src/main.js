/* Import Modules */
require('dotenv').config()
const express = require('express')
const RateLimit = require('express-rate-limit')
const bodyParser = require('body-parser')
const path = require('path')
const main = require('./routers/main.js')
const error = require('./routers/404.js')
const sitemap = require('./routers/sitemap.js')
const database = require('./database/index.js')

/* Making Constants */
const app = express()
const port = process.env.PORT

/* Setting up rate limiter: maximum of hundered requests per hour */
const limiter = new RateLimit({
  // 1  Hour
  windowMs: 60 * 60 * 1000,
  max: 1000
})

/* Setting up the Environment */
app.use(limiter)
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true
  })
)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
database()

/* Setting up the Pages */
app.use('/', main)
app.use('/sitemap.xml', sitemap)
app.use('/robots.txt', (req, res) => {
  res.sendFile(path.join(__dirname, 'robots.txt'))
})
app.use('/arc-sw.js', (req, res) => {
  res.sendFile(path.join(__dirname, 'arc-sw.js'))
})
app.get('*', error)

/* Running the server */
app.listen(port, () => {
  console.log(`Website is running at http://localhost:${port}`)
})
