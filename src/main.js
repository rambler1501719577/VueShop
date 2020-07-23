import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
/* 全局样式表 */
import '@/styles/global.css'
/* 图标库 */
import '@/assets/fonts/iconfont.css'
import request from '@/plugins/request';

Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.prototype.$http = request;

new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
