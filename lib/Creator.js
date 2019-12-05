const EventEmitter = require('events')
const chalk = require('chalk')
const { logWithSpinner, stopSpinner } = require('./util/spinner.js')

module.exports = class Creator extends EventEmitter {
  constructor (name, context) {
    super()

    this.name = name
    this.context = context
  }

  async create (cliOptions = {}) {
    const { context } = this
    logWithSpinner(`✨`, `在 ${chalk.yellow(context)} 中创建项目`)
    this.emit('creation', { event: 'creating' })
  }
}