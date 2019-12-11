const chalk = require('chalk')
const getVersions = require('./getVersions')
const { clearConsole } = require('./logger.js')

exports.generateTitle = async function () {
  const { current, lastest, error } = await getVersions()
  return chalk.bold.blue(`QG VUE CLI v${current}`)
}

exports.clearConsole = async function clearConsoleWithTitle () {
  const title = await exports.generateTitle()
  clearConsole(title)
}