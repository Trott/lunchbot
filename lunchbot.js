'use strict'

if (process.env.NODE_ENV !== 'production') { require('dotenv').config({ quiet: true }) }

const lunchSearchObj = {
  ll: '37.7634643,-122.4591061',
  fsq_category_ids: '4d4b7105d754a06374d81259', // Restaurant
  limit: 50,
  radius: 625
}

const coffeeSearchObj = {
  ll: '37.7634643,-122.4591061',
  fsq_category_ids: '63be6904847c3692a84b9bb6', // Cafe/Coffee/Tea House
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
    const params = new URLSearchParams({
      ll: searchObj.ll,
      fsq_category_ids: searchObj.fsq_category_ids,
      limit: searchObj.limit,
      radius: searchObj.radius
    })
    const url = `https://places-api.foursquare.com/places/search?${params.toString()}`
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.FOURSQUARE_API_KEY}`,
        Accept: 'application/json',
        'X-Places-Api-Version': '2025-06-17',
        'X-Users-Api-Version': '2025-06-17'
      }
    })
    if (!response.ok) throw new Error('Foursquare API error')
    const payload = await response.json()
    const recs = payload.results
    const rec = recs[Math.floor(Math.random() * recs.length)]
    const fsqUrl = 'https://www.foursquare.com/v/'

    if (!rec) {
      return 'Sorry! It looks like something went wrong. Please try again!'
    }

    message = rec.name + ' (' + (rec.location.address || 'No address') + ')\n'
    message += fsqUrl + rec.fsq_place_id
    message += `\n\n${messageTag}`
  } catch (error) {
    console.error(error)
    return 'Sorry! It looks like something went wrong. Please try again!'
  }

  return message
}
