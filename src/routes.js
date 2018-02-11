const {logger} = require('./logger')
const {rabbit: {queueName}} = require('./conf')

const submitRequest = async (request, rabbitChannel) => {
  const url = request.params.url
  logger.info(`submitting url: ${url}`)
  await rabbitChannel.sendToQueue(queueName, Buffer.from(url))
  return 200
}

module.exports = {
  submitRequest
}
