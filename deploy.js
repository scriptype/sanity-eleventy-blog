const glob = require('glob')
const NeoCities = require('neocities')

const api = new NeoCities(process.env.NEOCITIES_USER, process.env.NEOCITIES_PASS)
glob('web/_site/**/*', (err, paths) => {
  if (err) {
    throw err
  }
  console.log('paths', paths)
})

