const { connect, connection } = require('mongoose')
const config = require('../config')
const MongoURL = config.MongoDB.URL

module.exports = database => {
  connect(MongoURL, {
    useNewUrlParser: true,
    autoIndex: false,
    poolSize: 5,
    connectTimeoutMS: 10000,
    family: 4,
    useUnifiedTopology: true,
    useFindAndModify: false
  })

  connection.on('connected', () => {
    console.log('Mongoose connection successfully opened')
  })
  connection.on('err', (err) => {
    console.log(`Mongoose connection error: \n ${err.stack}`)
  })
  connection.on('disconnected', () => {
    console.log('Mongoose disconnected')
  })
}
