import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import { directive } from './utils/directive'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
import axios from 'axios'
axios.defaults.withCredentials=true
Vue.prototype.$axios=axios


import '@/icons' // icon
import '@/permission' // permission control

import Treeselect from '@riophae/vue-treeselect'
// import the styles
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import 'default-passive-events'
Vue.component('Treeselect',Treeselect)

Vue.use(ElementUI, { locale })
directive()
Vue.config.productionTip = false;
// Vue.prototype.baseUrl='http://yw.bsoft.com.cn:8888/bimp/'
Vue.prototype.baseUrl='http://10.0.22.85:8081/bimp/'
Vue.prototype.permissions = [];//当前用户权限
Vue.prototype.sysConfig = {};//当前配置

//判断是否包含权限
Vue.prototype.hasPermission = function (permissionCode) {
    if (!!permissionCode) {
        let permissions = store.getters.permissions;
        for (let i = 0; i < permissions.length; i++) {
            if (permissions[i] == permissionCode) {
                return true;
            }
        }
    }
    return false;
};


new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
