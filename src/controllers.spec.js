const {createRequest} = require('./controllers')
const {rabbit: {queueName}} = require('./conf')

test('enqueues a HTTP request and returns 200 OK', async () => {
  const request = {payload: {url: 'http://youtube.com', type: 'audio'}}
  const rabbitChannel = {sendToQueue: jest.fn()}

  expect(await createRequest(request, rabbitChannel)).toBe(200)
  expect(rabbitChannel.sendToQueue).toHaveBeenCalledWith(
    queueName,
    Buffer.from(JSON.stringify({url: request.payload.url, type: request.payload.type}))
  )
})
