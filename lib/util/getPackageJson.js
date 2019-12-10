const fs = require('fs')
const path = require('path')

module.exports = function getPackageJson (projectPath) {
  const packagePath = path.join(projectPath, 'package.json')

  let packageJson
  try {
    packageJson = fs.readFileSync(packagePath, 'utf8')
  } catch (err) {
    throw new Error(`${packagePath} 不存在`)
  }

  try {
    packageJson = JSON.parse(packageJson)
  } catch (err) {
    throw new Error('package.json 文件出错了')
  }

  return packageJson
}