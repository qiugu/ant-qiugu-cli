const download = require("download-git-repo")
const inquirer = require("inquirer")
const handlebars = require("handlebars")
const fs = require("fs-extra")
const path = require('path')
const chalk = require("chalk")
const symbols = require("log-symbols")
const moduleFiles = ['json', 'views/user', 'tests']
const { deleteFiles } = require('./util/util.js')
const { logWithSpinner, stopSpinner } = require('./util/spinner.js')
const { info, done, error } = require('./util/logger.js')
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
  // const answers = await inquirer.prompt([
  //   {
  //     type: "input",
  //     name: "description",
  //     message: chalk.bold.yellow('请输入项目描述')
  //   },
  //   {
  //     type: "input",
  //     name: "version",
  //     message: chalk.bold.yellow('请输入项目版本号')
  //   },
  //   {
  //     type: "input",
  //     name: "author",
  //     message: chalk.bold.yellow('请输入作者名称')
  //   },
  //   {
  //     type: 'list',
  //     name: 'ui',
  //     message: chalk.bold.yellow('请选择使用的ui框架'),
  //     choices: [
  //       { name: 'Element', value: 'element-ui' },
  //       { name: 'Ant Design Vue', value: 'ant-design-vue' }
  //     ]
  //   },
  //   {
  //     type: 'checkbox',
  //     name: 'structure',
  //     message: chalk.bold.yellow('请选择要使用的模块'),
  //     choices: [
  //       { name: '角色权限json文件', value: 'json' },
  //       { name: '管理系统登录注册组件', value: 'views/user' },
  //       { name: '单元测试', value: 'tests' }
  //     ]
  //   }
  // ])

  // if (!answers) {
  //   return
  // }

  // answer callback
  // download(
  //   "direct:https://gitee.com/qiuguPro/ant-qiugu-template.git",
  //   projectName,
  //   { clone: true },
  //   err => {
  //     if (!err) {
  //       const meta = {
  //         name: projectName,
  //         description: answers.description,
  //         author: answers.author,
  //         version: answers.version
  //       };
  //       const filePackage = `${projectName}/package.json`
  //       if (fs.existsSync(filePackage)) {
  //         const content = fs.readFileSync(filePackage).toString()
  //         const result = handlebars.compile(content)(meta)
  //         fs.writeFileSync(filePackage, result)
  //       }
  //       // delete answers modules
  //       moduleFiles.forEach(item => {
  //         if (answers.structure.indexOf(item) === -1) {
  //           if (item === 'tests') {
  //             deleteFiles(`${projectName}/${item}`)
  //           } else {
  //             deleteFiles(`${projectName}/src/${item}`)
  //           }
  //         }
  //       })
  //       stopSpinner(false)
  //       done(`Successfully ${chalk.cyan.bold(projectName)} 项目创建成功`);
  //     } else {
  //       stopSpinner(false)
  //       error(`Error: 拉取远程仓库失败${err}`)
  //     }
  //   }
  // )
  const creator = new Creator(name, targetDir)
  creator.create(options)
}

module.exports = (...args) => {
  return create(...args).catch(err => {
    stopSpinner(false)
    error(err)
  })
}
