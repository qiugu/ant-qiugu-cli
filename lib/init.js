const download = require("download-git-repo")
const inquirer = require("inquirer")
//  模板语言扩展
const handlebars = require("handlebars")
const fs = require("fs")
const path = require('path')
const cwd = process.cwd || process.cwd()
//  加载动画
const ora = require("ora")
const chalk = require("chalk")
const symbols = require("log-symbols")
//  下载的模块的value
const moduleFiles = ['config', 'json', 'views/user', 'tests']

const callback = async (...args) => {
  if (fs.existsSync(args[0])) {
    // 错误提示项目已存在，避免覆盖原有项目
    console.log(symbols.error, chalk.red("Error 项目已存在"));
    return;
  }
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "description",
      message: "请输入项目描述"
    },
    {
      type: "input",
      name: "version",
      message: "请输入项目版本号"
    },
    {
      type: "input",
      name: "author",
      message: "请输入作者名称"
    },
    {
      type: 'checkbox',
      name: 'structure',
      message: '请选择要使用的模块',
      choices: [
        { name: '按需引入ant-design组件', value: 'config' },
        { name: '角色权限json文件', value: 'json' },
        { name: '管理系统登录注册组件', value: 'views/user' },
        { name: '单元测试', value: 'tests' }
      ]
    }
  ])

  if (!answers) {
    return
  }

  // 回答交互之后的回调方法
  download(
    "direct:https://gitee.com/qiuguPro/ant-qiugu-template.git",
    args[0],
    { clone: true },
    err => {
      const spinner = ora(`正在下载模板...`)
      spinner.start()
      if (!err) {
        spinner.succeed('下载完成');
        const meta = {
          name: args[0],
          description: answers.description,
          author: answers.author,
          version: answers.version
        };
        const filePackage = `${args[0]}/package.json`
        if (fs.existsSync(filePackage)) {
          const content = fs.readFileSync(filePackage).toString()
          const result = handlebars.compile(content)(meta)
          fs.writeFileSync(filePackage, result)
        }
        // 根据所选的项，删除未选的模块
        moduleFiles.forEach(item => {
          if (answers.structure.indexOf(item) === -1) {
            if (item === 'tests') {
              deleteFiles(`${args[0]}/${item}`)
            } else {
              deleteFiles(`${args[0]}/src/${item}`)
            }
          }
        })
        console.log(symbols.success, chalk.green(`Successfully ${chalk.cyan(args[0])}初始化完成`))
      } else {
        spinner.fail();
        console.log(symbols.error, chalk.red(`Error: 拉取远程仓库失败${err}`))
      }
    }
  )
}

// 递归删除文件夹及下面的所有文件
function deleteFiles(path) {
  if (fs.existsSync(path)) {
    const files = fs.readdirSync(path)
    files.forEach(file => {
      const childPath = `${path}/${file}`
      if (fs.statSync(childPath).isDirectory()) {
        deleteFiles(childPath)
      } else {
        fs.unlinkSync(childPath)
      }
    })
    fs.rmdirSync(path)
  }
}

module.exports = callback
