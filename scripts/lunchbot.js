// Description:
//   Get suggestions of places to eat lunch.

if (process.env.NODE_ENV !== 'production') { require('dotenv').load() }

const sampleSize = require('lodash.samplesize')
const foursquare = require('node-foursquare-venues')(process.env.FOURSQUARE_CLIENT_ID, process.env.FOURSQUARE_CLIENT_SECRET)

const searchObj = {
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

module.exports = function (bot) {
  bot.respond(/lunch/i, function (res) {
    return foursquare.venues.search(searchObj, function (error, payload) {
      if (error) return res.send(error)

      const lunchOptions = sampleSize(payload.response.venues, 5)
      const url = 'https://www.foursquare.com/v/'
      var message = ''

      for (var i = 0; i < lunchOptions.length; i++) {
        var cs = lunchOptions[i]
        message = (i + 1) + ': ' + cs.name + ' (' + cs.location.address + ')\n'
        message += url + cs.id
        res.send(message)
      }

      message = 'Please cast your vote by adding a thumb-up or thumb-down reaction to one of the choices above.'
      return res.send(message)
    })
  })

  bot.respond(/decision|decide/i, function (res) {
    return foursquare.venues.search(searchObj, function (error, payload) {
      if (error) return res.send(error)

      const lunchOptions = sampleSize(payload.response.venues, 1)
      const url = 'https://www.foursquare.com/v/'
      var message = ''

      for (var i = 0; i < lunchOptions.length; i++) {
        var cs = lunchOptions[i]
        message = (i + 1) + ': ' + cs.name + ' (' + cs.location.address + ')\n'
        message += url + cs.id
        res.send(message)
      }

      message = 'Enjoy your lunch!'
      return res.send(message)
    })
  })

  bot.respond(/coffee/i, function (res) {
    const coffeeSearchObj = {
      near: '530 Parnassus Avenue San Francisco CA',
      categoryId: [
        '4bf58dd8d48988d1e0931735', // Coffee Shop
        '5665c7b9498e7d8a4f2c0f06' // Corporate Coffee Shop
      ].join(','),
      radius: 300,
      limit: 50
    }
    return foursquare.venues.search(coffeeSearchObj, function (error, payload) {
      if (error) return res.send(error)

      const lunchOptions = sampleSize(payload.response.venues, 1)
      const url = 'https://www.foursquare.com/v/'
      var message = ''

      for (var i = 0; i < lunchOptions.length; i++) {
        var cs = lunchOptions[i]
        message = (i + 1) + ': ' + cs.name + ' (' + cs.location.address + ')\n'
        message += url + cs.id
        res.send(message)
      }

      message = 'Get your coffee on!'
      return res.send(message)
    })
  })
}
