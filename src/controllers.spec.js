const {createRequest} = require('./controllers')
const {rabbit: {queueName}} = require('./conf')

test('enqueues a HTTP request and returns 200 OK', async () => {
  const payload = {url: 'http://youtube.com', type: 'audio'}
  const request = {payload}
  const rabbitChannel = {sendToQueue: jest.fn()}

  expect(await createRequest(request, rabbitChannel)).toBe(200)
  expect(rabbitChannel.sendToQueue).toHaveBeenCalledWith(
    queueName,
    Buffer.from(JSON.stringify(payload))
  )
})
