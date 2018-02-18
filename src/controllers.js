const {logger} = require('./logger')
const {rabbit: {queueName}} = require('./conf')

const enqueueRequest = async (request, rabbitChannel) => {
  const {url, type} = request.payload
  logger.info(`enqueueing request: url ${url}, type ${type}`)
  await rabbitChannel.sendToQueue(queueName, Buffer.from(JSON.stringify({url, type})))
  return 200
}

module.exports = {
  enqueueRequest
}
