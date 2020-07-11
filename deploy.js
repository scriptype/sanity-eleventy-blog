const fs = require('fs')
const glob = require('glob')
const NeoCities = require('neocities')

const api = new NeoCities(process.env.NEOCITIES_USER, process.env.NEOCITIES_PASS)
glob('web/_site/**/*', (err, paths) => {
  if (err) {
    throw err
  }
  const filePaths = paths.filter(path => !fs.statSync(path).isDirectory())
  const sitePaths = filePaths.map(path => path.replace(/^web\/_site\//, ''))
  const uploadObjects = sitePaths.map(path => ({
    name: path,
    path: `./web/_site/${path}`
  }))
  api.upload(uploadObjects, console.log)
})

