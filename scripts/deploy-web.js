const NeoCities = require('neocities')

const { deploySite } = require('./helpers')

const api = new NeoCities(process.env.NEOCITIES_USER, process.env.NEOCITIES_PASS)

deploySite(api)
  .then(console.log)
  .catch(err => {
    throw err
  })
