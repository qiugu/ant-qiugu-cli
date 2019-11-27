const ora = require('ora')
const chalk = require('chalk')

exports.createSpinner = function(logText) {
  const spinner = ora({
    text: chalk.blue.bold.italic(logText)
  })
  return spinner
}