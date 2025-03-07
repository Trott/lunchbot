'use strict'

if (process.env.NODE_ENV !== 'production') { require('dotenv').config() }
const fsqDevelopers = require('@api/fsq-developers')

const lunchSearchObj = {
  ll: '37.7634643,-122.4591061',
  categories: [
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
  limit: 50,
  radius: 625
}

const coffeeSearchObj = {
  ll: '37.7634643,-122.4591061',
  categories: [
    '4bf58dd8d48988d1e0931735', // Coffee Shop
    '5665c7b9498e7d8a4f2c0f06' // Corporate Coffee Shop
  ].join(','),
  limit: 50,
  radius: 300
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

  try {
    fsqDevelopers.auth(process.env.FOURSQUARE_API_KEY)
    const payload = await fsqDevelopers.placeSearch(searchObj)
    const recs = payload.data.results
    const rec = recs[Math.floor(Math.random() * recs.length)]
    const url = 'https://www.foursquare.com/v/'

    if (!rec) {
      return 'Sorry! It looks like something went wrong. Please try again!'
    }

    message = rec.name + ' (' + rec.location.address + ')\n'
    message += url + rec.fsq_id

    message += `\n\n${messageTag}`
  } catch (error) {
    console.error(error)
    return 'Sorry! It looks like something went wrong. Please try again!'
  }

  return message
}
