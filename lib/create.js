const inquirer = require("inquirer")
const fs = require("fs-extra")
const path = require('path')
const chalk = require("chalk")
const { error } = require('./util/logger.js')
const validateProjectName = require('validate-npm-package-name')
const Creator = require('./Creator.js')

async function create (projectName, options) {
  const cwd = options.cwd || process.cwd()
  const targetDir = path.resolve(cwd, projectName || '.')
  const inCurrent = projectName === '.'
  const name = inCurrent ? path.relative('../', cwd) : projectName

  const result = validateProjectName(name)
  // validate project name
  if (!result.validForNewPackages) {
    console.error(chalk.red(`Invalid project name: "${projectName}"`))
    result.errors && result.errors.forEach(err => {
      console.error(chalk.red.dim('Error: ' + err))
    })
    result.warnings && result.warnings.forEach(warn => {
      console.error(chalk.red.dim('Warning: ' + warn))
    })
    process.exit(1)
  }

  // check if the directory exist
  if (fs.existsSync(targetDir)) {
    if (options.force) {
      await fs.remove(targetDir)
    } else {
      if (inCurrent) {
        const { ok } = await inquirer.prompt([
          {
            name: 'ok',
            type: 'confirm',
            message: '是否在当前目录下生成项目？'
          }
        ])
        if (!ok) {
          return
        }
      } else {
        const { action } = await inquirer.prompt([
          {
            name: 'action',
            type: 'list',
            message: `目标文件夹${chalk.cyan(targetDir)}已经存在，请选择一个选项执行`,
            choices: [
              { name: '覆盖当前项目', value: 'overwrite' },
              { name: '合并项目', value: 'merge' },
              { name: '取消', value: false }
            ]
          }
        ])
        if (!action) {
          return
        } else if (action === 'overwrite') {
          console.log(`\n移除 ${chalk.cyan(targetDir)}...`)
          await fs.remove(targetDir)
        }
      }
    }
  }

  const creator = new Creator(name, targetDir)
  creator.create(options)
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false)
    error(err)
  })
}
