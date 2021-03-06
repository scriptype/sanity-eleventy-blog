const fs = require('fs')
const glob = require('glob')

const deploySite = (api) => {
  return new Promise((resolve, reject) => {
    glob('web/_site/**/*', (err, paths) => {
      if (err) {
        return reject(err)
      }
      const filePaths = paths.filter(path => !fs.statSync(path).isDirectory())
      const sitePaths = filePaths.map(path => path.replace(/^web\/_site\//, ''))
      const uploadObjects = sitePaths.map(path => ({
        name: path,
        path: `./web/_site/${path}`
      }))
      api.upload(uploadObjects, resolve)
    })
  })
}

const deployStudio = (api) => {
  return new Promise((resolve, reject) => {
    glob('studio/dist/**/*', (err, paths) => {
      if (err) {
        return reject(err)
      }
      const filePaths = paths.filter(path => !fs.statSync(path).isDirectory())
      const sitePaths = filePaths.map(path => path.replace(/^studio\/dist\//, ''))
      const uploadObjects = sitePaths.map(path => ({
        name: `studio/${path}`,
        path: `./studio/dist/${path}`
      }))
      api.upload(uploadObjects, resolve)
    })
  })
}

module.exports = {
  deploySite,
  deployStudio
}
