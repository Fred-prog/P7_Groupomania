import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'



// Importer Bootstrap un fichier CSS BootstrapVue (l'ordre est important) 
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


Vue.config.productionTip = false

const moment = require('moment') // Gère l'affichage des dates avec vue-moment
require('moment/locale/fr')
Vue.use(require('vue-moment'), {
  moment
});



// Rendre BootstrapVue disponible tout au long de votre projet 
Vue.use(BootstrapVue)
// Installer éventuellement le plugin de composants d'icônes BootstrapVue 
Vue.use(IconsPlugin)





new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
