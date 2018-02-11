module.exports = {
  logLevel: process.env.LOG_LEVEL || 'info',
  server: {
    host: process.env.HOST || '0.0.0.0',
    port: process.env.PORT || 3000
  }
}
