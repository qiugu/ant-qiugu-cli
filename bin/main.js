#!/usr/bin/env node
// --这种用法是为了防止操作系统用户没有将node装在默认的/usr/bin路径里。当系统看到这一行的时候，
// 首先会到env设置里查找node的安装路径，再调用对应路径下的解释器程序完成操作。
const program = require('commander')
const semver = require('semver')
const chalk = require('chalk')
const minimist = require('minimist')
const requiredVersion = require('../package.json').engines.node

function checkNodeVersion (wanted, id) {
  if (!semver.satisfies(process.version, wanted)) {
    console.error(chalk.red(`您使用的Node版本是${process.version}，但是${id}要求的Node版本是${wanted}，请升级您的Node版本`))
    process.exit(1)
  }
}

// check Node version
checkNodeVersion(requiredVersion, 'qg-vue-cli')

program
  .usage('<command> [options]')
  .version(`qg-cli-vue ${require('../package.json').version}`)
  .description('感谢您使用qg-vue-cli脚手架，麽麽哒！')

program
  .command('create <app-name>')
  .alias('i')
  .description('创建vue模板')
  .option('-f --force', '如果创建的项目文件夹已经存在是否强制覆盖')
  .action((name, cmd) => {
    const options = resolveArgs(cmd)
    if (minimist(process.argv.slice(3))._.length > 1) {
      console.log(chalk.yellow('\n Info: 您输入了超过一个的参数，只有第一个会被当做项目的名称，其他的参数将会被忽略'))
    }
    require('../lib/create')(name, options)
  })

program
  .arguments('<arguments>')
  .action(cmd => {
    program.outputHelp()
    console.log(`未知的命令 ${chalk.yellow(cmd)}.`)
  })

program.on('--help', () => {
  console.log()
  console.log(` 运行${chalk.cyan(`qg <command> --help`)} 来查看指定命令的用法.`)
  console.log()
})
program.commands.forEach(c => c.on('--help', () => console.log()))

// if args length less than 1
program.parse(process.argv)
if (!process.argv.slice(2).length) {
  program.outputHelp()
}

function camelize (str) {
  return str.replace(/-(\w)/g, (_, c) => c ? c.toUpperCase() : '')
}

// parse commander options from cmd
function resolveArgs (cmd) {
  const args = {}
  cmd.options.forEach(o => {
    const key = camelize(o.long.replace(/^--/, ''))

    if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
      args[key] = cmd[key]
    }
  })
  return args
}
