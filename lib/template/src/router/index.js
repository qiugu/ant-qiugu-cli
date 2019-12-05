import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

import VueStorage from 'vue-ls'
import { BaseRouter } from './router'
import { ACCESS_TOKEN } from '@/store/mutation-types'

Vue.use(Router)
Vue.use(VueStorage, {
  namespace: 'credit__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local' // storage name session, local, memory
})

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: BaseRouter
})
const whiteList = ['login', 'home', 'company', 'base'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  if (Vue.ls.get(ACCESS_TOKEN)) {
    /* has token */
    if (to.path === '/user/login') {
      next({ path: '/home' })
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => {
          const roles = res.result.role
          store.dispatch('GenerateRoutes', { roles }).then(() => {
            // 动态路由添加
            router.addRoutes(store.getters.addRouters)
          })
          next({ path: to.path })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.includes(to.name)) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next({ path: '/user/login', query: { redirect: to.fullPath } })
    }
  }
})
/**
 * Action 权限指令
 * 指令用法：
 *  - 在需要控制 action 级别权限的组件上使用 v-action:[method] , 如下：
 *    <i-button v-action:add >添加用户</a-button>
 *    <a-button v-action:delete>删除用户</a-button>
 *    <a v-action:edit @click="edit(record)">修改</a>
 *
 *  - 当前用户没有权限时，组件上使用了该指令则会被隐藏
 *  - 当后台权限跟 pro 提供的模式不同时，只需要针对这里的权限过滤进行修改即可
 *
 *  @see https://github.com/sendya/ant-design-pro-vue/pull/53
 */
const action = Vue.directive('action', {
  bind: function (el, binding, vnode) {
    const actionName = binding.arg
    const roles = store.getters.roles
    const elVal = vnode.context.$route.meta.permission
    const permissionId = (elVal instanceof String && [elVal]) || elVal
    roles.permissions.forEach(p => {
      if (!permissionId.includes(p.permissionId)) {
        return
      }
      if (p.actionList && !p.actionList.includes(actionName)) {
        (el.parentNode && el.parentNode.removeChild(el)) || (el.style.display = 'none')
      }
    })
  }
})

export { action }
export default router
