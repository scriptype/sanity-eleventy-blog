const NeoCities = require('neocities')

const { deploySite, deployStudio } = require('./helpers')

const api = new NeoCities(process.env.NEOCITIES_USER, process.env.NEOCITIES_PASS)

Promise.resolve()
  .then(() => deploySite(api))
  .then(() => deployStudio(api))
  .then(console.log)
  .catch(err => {
    throw err
  })
