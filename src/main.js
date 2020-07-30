import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import TreeTable from 'vue-table-with-tree-grid';
import 'element-ui/lib/theme-chalk/index.css'
/* 全局样式表 */
import '@/styles/global.css'
/* 图标库 */
import '@/assets/fonts/iconfont.css'
import request from '@/plugins/request'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$http = request
// 全局注册
Vue.component('tree-table', TreeTable)

new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
