const init = require('../../lib/init')
const cmd = require('commander')
const command = { init }

test('init commander exec', () => {
  expect(cmd.action(command['init']())).toBe({})
})