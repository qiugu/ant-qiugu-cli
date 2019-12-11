

module.exports = async function getVersions () {
  const local = require(`../../package.json`).version
  return {
    current: local
  }
}