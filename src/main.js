'use strict'
/* Import Modules */
import dotenv from 'dotenv'
import express from 'express'
import RateLimit from 'express-rate-limit'
import bodyParser from 'body-parser'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import main from './routers/main.js'
dotenv.config()

/* Making Constants */
const app = express()
const port = process.env.PORT
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const MongoDBURl = process.env.MONGODB_URL

/* Setting up rate limiter: maximum of hundered requests per hour */
const limiter = new RateLimit({
  // 1  Hour
  windowMs: 60 * 60 * 1000,
  max: 100
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

/* Setting up the Pages */
app.get('/', main)

const dbOptions = {
  useNewUrlParser: true,
  autoIndex: false,
  poolSize: 5,
  connectTimeoutMS: 10000,
  family: 4,
  useUnifiedTopology: true,
  useFindAndModify: false
}
mongoose.connect(MongoDBURl, dbOptions)
mongoose.set('useFindAndModify', false)
mongoose.Promise = global.Promise
mongoose.connection.on('connected', () => {
  console.log('Mongoose connection successfully opened', 'ready')
})
mongoose.connection.on('err', (err) => {
  console.log(`Mongoose connection error: \n ${err.stack}`)
})
mongoose.connection.on('disconnected', () => {
  console.log('Mongoose disconnected')
})

/* Running the server */
app.listen(port, () => {
  console.log(`Website is running at http://localhost:${port}`)
})
