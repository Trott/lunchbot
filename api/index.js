'use strict'

const lunchbot = require('../lunchbot')

module.exports = async (req, res) => {
  const type = req.body

  let message, responseType
  try {
    message = await lunchbot(type)
    responseType = 'in_channel'
  } catch (e) {
    message = e.message
    responseType = 'ephemeral'
  }
  res.writeHead(200, { 'Content-Type': 'application/json' })
  // Create response object and send result back to Slack
  res.end(JSON.stringify({ response_type: responseType, text: message }))
}
