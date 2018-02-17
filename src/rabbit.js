const amqplib = require('amqplib')
const {logger} = require('./logger')
const {rabbit: {url, queueName, reconnectDelay}} = require('./conf')

const createChannel = () => new Promise(async resolve => {
  const attempt = async (attempts = 1) => {
    try {
      logger.debug(`attempting to connect to rabbit #${attempts}: ${url}`)
      const connection = await amqplib.connect(url)
      const channel = await connection.createChannel()
      await channel.assertQueue(queueName, {durable: false, autoDelete: true})
      return resolve(channel)
    } catch (e) {
      setTimeout(() => attempt(attempts + 1), reconnectDelay)
    }
  }
  return attempt()
})

module.exports = {
  createChannel
}
