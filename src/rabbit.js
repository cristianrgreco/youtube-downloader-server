const amqplib = require('amqplib')
const {rabbit: {url, queueName, reconnectAttempts, reconnectDelay}} = require('./conf')
const {logger} = require('./logger')

const createChannel = () => new Promise(async (resolve, reject) => {
  const attempt = async (attempts = 1) => {
    try {
      logger.debug(`attempting to connect to rabbit #${attempts}: ${url}`)
      const connection = await amqplib.connect(url)
      const channel = await connection.createChannel()
      await channel.assertQueue(queueName, {durable: false, autoDelete: true})
      return resolve(channel)
    } catch (e) {
      if (attempts > reconnectAttempts) {
        return reject(new Error(e))
      } else {
        setTimeout(() => attempt(attempts + 1), reconnectDelay)
      }
    }
  }
  return attempt()
})

module.exports = {
  createChannel
}
