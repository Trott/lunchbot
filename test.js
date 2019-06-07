'use strict'

const lunchbot = require('./lunchbot');

(async () => {
  console.log(await lunchbot())
})();

(async () => {
  console.log(await lunchbot('coffee'))
})()
