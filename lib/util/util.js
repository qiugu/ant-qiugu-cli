const fs = require('fs')
// 递归删除文件夹及下面的所有文件
exports.deleteFiles = function deleteFiles (path) {
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