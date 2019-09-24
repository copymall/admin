import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n

import './permission'
import './icons'

import '@/styles/index.scss' // global css

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  store,
  router,
}).$mount('#app')
