export function timeFix () {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9
    ? '早上好'
    : hour <= 11
      ? '上午好'
      : hour <= 13
        ? '中午好'
        : hour < 20
          ? '下午好'
          : '晚上好'
}
export function welcome () {
  const arr = [
    '休息一会儿吧',
    '准备吃什么呢?',
    '要不要打一把 DOTA',
    '我猜你可能累了'
  ]
  const index = Math.floor(Math.random() * arr.length)
  return arr[index]
}
export function handleScrollHeader (callback) {
  let timer = 0

  let beforeScrollTop = window.pageYOffset
  callback = callback || function () { }
  window.addEventListener(
    'scroll',
    event => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        let direction = 'up'
        const afterScrollTop = window.pageYOffset
        const delta = afterScrollTop - beforeScrollTop
        if (delta === 0) {
          return false
        }
        direction = delta > 0 ? 'down' : 'up'
        // eslint-disable-next-line standard/no-callback-literal
        callback({ direction, currentTop: afterScrollTop })
        beforeScrollTop = afterScrollTop
      }, 10)
    },
    false
  )
}
export function triggerWindowResizeEvent () {
  const event = document.createEvent('HTMLEvents')
  event.initEvent('resize', true, true)
  event.eventType = 'message'
  window.dispatchEvent(event)
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate (id = '', timeout = 1500) {
  if (id === '') {
    return
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id))
  }, timeout)
}

export function unique (arr) {
  return Array.from(new Set(arr))
}

/**
 * 对象数组，去重ID并合并相同键对应的值
 */
export function uniqueArrAndConcat (arr) {
  const hash = {}
  return arr.reduce((preVal, curVal) => {
    if (hash[curVal.permissionId]) {
      preVal.forEach((item) => {
        if (item.permissionId === curVal.permissionId) {
          item.actionList = unique(item.actionList.concat(curVal.actionList))
        }
      })
    } else {
      hash[curVal.permissionId] = true && preVal.push(curVal)
    }
    return preVal
  }, [])
}
