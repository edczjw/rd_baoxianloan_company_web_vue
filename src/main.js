// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import animate from 'animate.css'
//引入vuex
import store from './store'

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(animate)
Vue.prototype.$axios = axios
router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
});

if (module.hot) {
  module.hot.accept();
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  axios,
  store,
  components: { App },
  template: '<App/>'
})
