const EventEmitter = require('events')
const chalk = require('chalk')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const path = require('path')
const execa = require('execa')
const { logWithSpinner, stopSpinner } = require('./util/spinner.js')
const { log, error, done } = require('./util/logger.js')
const { clearConsole } = require('./util/clearConsole.js')
const writeFileTree = require('./util/writeFileTree')
const getPackageJson = require('./util/getPackageJson.js')

module.exports = class Creator extends EventEmitter {
  constructor (name, context) {
    super()

    this.name = name
    this.context = context
  }

  async create (cliOptions = {}) {
    const { context, name } = this
    this.emit('creation', { event: 'creating' })
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'ui',
        message: '请选择使用的ui框架',
        choices: [
          { name: 'Element', value: 'element-ui' },
          { name: 'Ant Design Vue', value: 'ant-design-vue' }
        ]
      }
    ])

    await clearConsole()
    logWithSpinner('⚓', `Running completion hooks`)
    try {
      await fs.copy(path.join(__dirname, 'template'), context)
    } catch (err) {
      error(err)
      process.exit(1)
    }
    stopSpinner()

    const pkg = getPackageJson(context)
    Object.assign(pkg.dependencies, {
      [answers.ui]: answers.ui === 'element-ui' ? "^2.12.0" : "^1.4.8"
    })
    log(`📦  添加package.json依赖项`)
    logWithSpinner(`✨`, `在 ${chalk.yellow(context)} 中创建项目`)
    try {
      await writeFileTree(context, {
        'package.json': JSON.stringify(pkg, null, 2)
      })
    } catch (err) {
      error(err)
      process.exit(1)
    }
    stopSpinner()

    log()
    log(`⚙  正在下载依赖，请等待一会儿...`)
    logWithSpinner('⚓', `Running completion hooks...`)
    try {
      await this.run('npm i')
    } catch (err) {
      error(err)
      process.exit(1)
    }
    stopSpinner()
    done(`🎉  Successfully created project ${chalk.yellow(name)}.`)
  }

  run (command, args) {
    if (!args) {
      [command, ...args] = command.split(/\s+/)
    }
    return execa(command, args, { cwd: this.context })
  }
}