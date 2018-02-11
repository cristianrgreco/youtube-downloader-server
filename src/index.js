const Hapi = require('hapi')
const {logger} = require('./logger')
const {createChannel} = require('./rabbit')

const {
  rabbit: {queueName: rabbitQueueName},
  server: {port, host}
} = require('./conf');

(async () => {
  logger.info('connecting to rabbit')
  const rabbitChannel = await createChannel()

  logger.info(`starting http server: ${host}:${port}`)
  const server = new Hapi.Server({port, host, routes: {cors: true}})

  server.route({
    method: 'POST',
    path: '/request/{url}',
    handler: async request => {
      const url = request.params.url
      logger.info(`submitting url: ${url}`)
      await rabbitChannel.sendToQueue(rabbitQueueName, Buffer.from(url))
      return 200
    }
  })

  server.start(err => {
    if (err) {
      throw err
    }
    logger.info(`Listening on port: ${port}`)
  })
})()
