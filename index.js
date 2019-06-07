'use strict'

const { text } = require('micro')
const { parse } = require('querystring')
const lunchbot = require('./lunchbot')

module.exports = async (req, res) => {
  const type = parse(await text(req)).text

  const message = await lunchbot(type)

  res.writeHead(200, { 'Content-Type': 'application/json' })
  // Create response object and send result back to Slack
  res.end(JSON.stringify({ response_type: 'in_channel', text: message }))
}
