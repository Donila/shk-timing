import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuetify from 'vuetify';
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/dist/vuetify.min.css'
import i18n from '@/plugins/i18n'

Vue.use(Vuetify);

Vue.config.productionTip = false

new Vue({
  router,
  data: store,
  iconfont: 'mdi',
  i18n: i18n,
  render: h => h(App)
}).$mount('#app')
