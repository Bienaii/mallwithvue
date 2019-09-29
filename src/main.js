import Vue from 'vue'
import App from './App.vue'
import router from './router'

Vue.config.productionTip = false

//向Vue原型注册 事件总线 $bus ,Vue实例是可以作为事件总线的
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')
