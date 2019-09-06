#!/usr/bin/env node
// --这种用法是为了防止操作系统用户没有将node装在默认的/usr/bin路径里。当系统看到这一行的时候，
// 首先会到env设置里查找node的安装路径，再调用对应路径下的解释器程序完成操作。
const cmd = require("commander");
const pkg = require("../package.json");
const init = require("../lib/init");

const command = { init };

const exec = (type, ...args) => {
  // config.debug = args[0].debug;
  command[type](...args);
};

cmd
  .usage("<command>")
  .version(pkg.version)
  .description("感谢您使用ant-qg-cli脚手架，麽麽哒！");

cmd
  .command("init")
  .alias("i")
  .description("创建vue模板")
  .action((...args) => {
    exec("init", ...args);
  });

cmd
  .command("help")
  .description("查看帮助")
  .action(() => cmd.help());

//解析命令行
cmd.parse(process.argv);
if (!cmd.args.length || cmd.args.length <= 1) {
  cmd.help();
}
