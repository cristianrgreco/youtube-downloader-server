const {LOG_LEVEL, HOST, PORT, RABBIT_HOST, RABBIT_PORT, RABBIT_USER, RABBIT_PASS} = process.env

module.exports = {
  logLevel: LOG_LEVEL || 'info',
  server: {
    host: HOST || '0.0.0.0',
    port: PORT || 8080
  },
  rabbit: {
    url:
      RABBIT_HOST === undefined
        ? 'amqp://localhost'
        : `amqp://${RABBIT_USER}:${RABBIT_PASS}@${RABBIT_HOST}:${RABBIT_PORT}`,
    reconnectDelay: 3000
  }
}
