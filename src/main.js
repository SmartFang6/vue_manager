import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import http from './utils/http'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'; 
import 'normalize.css/normalize.css';

Vue.use(ElementUI);
Vue.config.productionTip = false
Vue.use(http)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
