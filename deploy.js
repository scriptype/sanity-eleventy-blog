const glob = require('glob')
const NeoCities = require('neocities')

const api = new NeoCities(process.env.NEOCITIES_USER, process.env.NEOCITIES_PASS)
glob('project/**/*', { ignore: ['project/studio/node_modules', 'project/web/node_modules'] }, (err, paths) => {
  console.log('paths', paths)
})

