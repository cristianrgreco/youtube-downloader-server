module.exports = {
  logLevel: process.env.LOG_LEVEL || 'info',
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 8080
  },
  rabbit: {
    url: process.env.RABBIT_HOST === undefined ? 'amqp://localhost' : `amqp://${process.env.RABBIT_HOST}`,
    queueName: 'requests',
    reconnectAttempts: 10,
    reconnectDelay: 3000
  }
}
