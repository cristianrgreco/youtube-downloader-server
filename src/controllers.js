const {logger} = require('./logger')
const {rabbit: {queueName}} = require('./conf')

const createRequest = async (request, rabbitChannel) => {
  const {url, type} = request.payload
  logger.info(`creating request: url ${url}, type ${type}`)
  await rabbitChannel.sendToQueue(queueName, Buffer.from(JSON.stringify({url, type})))
  return 200
}

module.exports = {
  createRequest
}
