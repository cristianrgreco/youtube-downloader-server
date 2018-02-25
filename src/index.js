const Hapi = require('hapi')
const amqplib = require('amqplib')
const socket = require('socket.io')
const conf = require('./conf')
const {logger} = require('./logger')

const startServer = async () => {
  const {server: {host, port}} = conf
  logger.info('starting http server', {host, port})
  const server = new Hapi.Server({port, host, routes: {cors: true}})
  await server.start()
  return server
}

const connectToRabbit = async () => {
  const {rabbit: {url, reconnectDelay}} = conf
  logger.info('connecting to rabbit', {url})

  return new Promise(resolve => {
    const connect = async (attempt = 1) => {
      try {
        logger.debug('connecting to rabbit', {attempt})
        resolve(await amqplib.connect(url))
      } catch (e) {
        setTimeout(() => connect(attempt + 1), reconnectDelay)
      }
    }
    return connect()
  })
}

const publishRequest = async (rabbit, {url, type}) => {
  const requestsChannel = await rabbit.createChannel()
  const requestsQueue = 'requests'

  requestsChannel.assertQueue(requestsQueue, {durable: true})
  requestsChannel.sendToQueue(
    requestsQueue,
    Buffer.from(JSON.stringify({url, type})),
    {
      persistent: true
    }
  )
}

const consumeResponses = async (socketClient, rabbit, {url, type}) => {
  const responseChannel = await rabbit.createChannel()
  const responseExchange = 'responses'
  const key = `${Buffer.from(url).toString('base64')}.${type}`

  responseChannel.assertExchange(responseExchange, 'topic', {durable: false})
  const {queue: responseQueue} = await responseChannel.assertQueue('', {
    exclusive: true
  })
  responseChannel.bindQueue(responseQueue, responseExchange, key)

  logger.info('waiting for response', {responseQueue, key})
  responseChannel.consume(responseQueue, message => {
    const messageContent = JSON.parse(message.content.toString())
    logger.debug('message received', {messageContent})
    responseChannel.ack(message)

    socketClient.emit(key, messageContent)
  })
}

const main = async () => {
  const server = await startServer()
  const rabbit = await connectToRabbit()

  const io = socket.listen(server.listener)
  io.on('connection', client => {
    client.on('request', async ({url, type}) => {
      logger.info('enqueueing request', {url, type})
      await publishRequest(rabbit, {url, type})
      await consumeResponses(client, rabbit, {url, type})
    })
  })
}

main().then(() => logger.info('ready'), e => logger.error(e.stack))
