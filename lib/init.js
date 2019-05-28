const download = require("download-git-repo");
const inquirer = require("inquirer");
//  模板语言扩展
const handlebars = require("handlebars");
const fs = require("fs");
//  加载动画
const ora = require("ora");
const chalk = require("chalk");
const symbols = require("log-symbols");

module.exports = (...args) => {
  if (fs.existsSync(args[0])) {
    // 错误提示项目已存在，避免覆盖原有项目
    console.log(symbols.error, chalk.red("项目已存在"));
    return;
  }
  inquirer
    .prompt([
      {
        type: "input",
        name: "description",
        message: "请输入项目描述"
      },
      {
        type: "input",
        name: "author",
        message: "请输入作者名称"
      }
    ])
    .then(answers => {
      download(
        "direct:https://github.com/qiugu/ant-qiugu-template.git",
        args[0],
        { clone: true },
        err => {
          const spinner = ora("正在下载模板...");
          spinner.start();
          if (!err) {
            spinner.succeed();
            const meta = {
              name: args[0],
              description: answers.description,
              author: answers.author
            };
            const fileName = `${args[0]}/package.json`;
            if (fs.existsSync(fileName)) {
              const content = fs.readFileSync(fileName).toString();
              const result = handlebars.compile(content)(meta);
              fs.writeFileSync(fileName, result);
            }
            console.log(symbols.success, chalk.green("项目初始化完成"));
          } else {
            spinner.fail();
            console.log(symbols.error, chalk.red(`拉取远程仓库失败${err}`));
          }
        }
      );
    });
}
