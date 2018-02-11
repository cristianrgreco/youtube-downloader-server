const Hapi = require('hapi')
const {logger} = require('./logger')
const {createChannel} = require('./rabbit')
const {submitRequest} = require('./routes')
const {server: {port, host}} = require('./conf');

(async () => {
  logger.info('connecting to rabbit')
  const rabbitChannel = await createChannel()

  logger.info(`starting http server: ${host}:${port}`)
  const server = new Hapi.Server({port, host, routes: {cors: true}})

  server.route({
    method: 'POST',
    path: '/request/{url}',
    handler: request => submitRequest(request, rabbitChannel)
  })

  server.start(err => {
    if (err) {
      throw err
    }
    logger.info(`Listening on port: ${port}`)
  })
})()
