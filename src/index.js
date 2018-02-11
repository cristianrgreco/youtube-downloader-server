const Hapi = require('hapi')
const {logger} = require('./logger')
const {server: {port, host}} = require('./conf')

const server = new Hapi.Server({port, host, routes: {cors: true}})

server.route({
  method: 'GET',
  path: '/',
  handler: () => 'Hello World!'
})

server.start(err => {
  if (err) {
    throw err
  }
  logger.info('Listening on port: %d', port)
})
