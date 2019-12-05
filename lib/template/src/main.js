import 'core-js'
import Vue from 'vue'
import router from '@/router'
import store from '@/store'
import App from './App.vue'

import { VueAxios } from './utils/request'

Vue.config.productionTip = false
Vue.use(VueAxios)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
