'use strict'

if (process.env.NODE_ENV !== 'production') { require('dotenv').load() }
const foursquare = require('node-foursquare-venues')(process.env.FOURSQUARE_CLIENT_ID, process.env.FOURSQUARE_CLIENT_SECRET)

const search = require('util').promisify(foursquare.venues.search)

const lunchSearchObj = {
  near: '530 Parnassus Avenue San Francisco CA',
  categoryId: [
    '4bf58dd8d48988d142941735', // Asian (Nan King, Soi Gow, New Sandy's, etc.)
    '4bf58dd8d48988d1bd941735', // Salad (Pluto's)
    '4bf58dd8d48988d1c5941735', // Sandwich (Wooly Pig)
    '4bf58dd8d48988d143941735', // Breakfast (Crepevine)
    '4bf58dd8d48988d16c941735', // Burger (Burgermeister)
    '4bf58dd8d48988d1c0941735', // Mediterranean (Taboun)
    '4bf58dd8d48988d1ca941735', // Pizza (KP, Front Room)
    '4bf58dd8d48988d10f941735', // Indian
    '4bf58dd8d48988d1c1941735' // Mexican
  ].join(','),
  radius: 625,
  limit: 50
}

const coffeeSearchObj = {
  near: '530 Parnassus Avenue San Francisco CA',
  categoryId: [
    '4bf58dd8d48988d1e0931735', // Coffee Shop
    '5665c7b9498e7d8a4f2c0f06' // Corporate Coffee Shop
  ].join(','),
  radius: 300,
  limit: 50
}

module.exports = async (searchType) => {
  let message

  let searchObj, messageTag

  // Search for coffee if asked, but otherwise, default to lunch.
  if (/coffee/i.test(searchType)) {
    searchObj = coffeeSearchObj
    messageTag = 'Get your coffee on!'
  } else {
    searchObj = lunchSearchObj
    messageTag = 'Enjoy your lunch!'
  }

  let payload
  payload = await search(searchObj)
  const recs = payload.response.venues
  const rec = recs[Math.floor(Math.random() * recs.length)]
  const url = 'https://www.foursquare.com/v/'

  message = rec.name + ' (' + rec.location.address + ')\n'
  message += url + rec.id

  message += `\n\n${messageTag}`

  return message
}
