const amqplib = require('amqplib')
const {rabbit} = require('./conf')
const {logger} = require('./logger')

const createChannel = () => new Promise(async (resolve, reject) => {
  const attempt = async (attempts = 1) => {
    try {
      logger.debug(`attempting to connect to rabbit #${attempts}: ${rabbit.url}`)
      const connection = await amqplib.connect(rabbit.url)
      const channel = await connection.createChannel()
      await channel.assertQueue(rabbit.queueName, {durable: false, autoDelete: true})
      return resolve(channel)
    } catch (e) {
      if (attempts > rabbit.reconnectAttempts) {
        return reject(new Error(e))
      } else {
        setTimeout(() => attempt(attempts + 1), 3000)
      }
    }
  }
  return attempt()
})

module.exports = {
  createChannel
}
