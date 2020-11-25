const path = require('path')
const moment = require('moment')
const spawn = require('./spawn')
const config = {
  url: 'git@github.com:youmengme/leetcode.git',
  branch: 'master'
}
module.exports = (() => {
  function push(repo) {
    return git('add', '-A').then(() => {
      console.log('git files added successfully')
      return git('commit', '-m', `files updated ${moment().format('YYYY-MM-DD HH:mm:ss')}`).catch(() => {
        console.log('Do nothing. It\'s OK if nothing to commit.')
      }).then(() => {
        console.log('git files committed successfully')
      })
    }).then(() => {
      return git('push', '-u', repo.url, 'HEAD:' + repo.branch, '--force').then(() => {
        console.info('git push successful')
      })
    })
  }

  function git(...args) {
    return spawn('git', args, {
      cwd: path.join(__dirname, './'),
      verbose: false,
      stdio: 'inherit'
    })
  }

  return push(config).then(() => {
  })
})()
