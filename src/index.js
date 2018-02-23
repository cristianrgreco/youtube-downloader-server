const Hapi = require('hapi')
const {logger} = require('./logger')
const {createChannel} = require('./rabbit')
const {createRequest} = require('./controllers')
const {server: {port, host}} = require('./conf');

(async () => {
  logger.log('info', 'connecting to rabbit')
  const rabbitChannel = await createChannel()
  logger.log('info', 'connected to rabbit')

  logger.log('info', 'starting http server', {host, port})
  const server = new Hapi.Server({port, host, routes: {cors: true}})

  server.route({
    method: 'POST',
    path: '/request',
    handler: request => createRequest(request, rabbitChannel)
  })

  await server.start()
  logger.log('info', 'started http server')
})()
