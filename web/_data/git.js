const { execSync } = require('child_process')

module.exports = function() {
  const getLastCommit = "git log --oneline | head -n 1"
  const lastCommit = execSync(getLastCommit, { encoding: 'utf-8' })
  const hash = lastCommit.split(' ')[0]
  const message = lastCommit.replace(`${hash} `, '').replace(/\n$/, '')
  return {
    hash,
    message
  }
}
