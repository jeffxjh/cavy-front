// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css'
import store from './store/index';

// bpmn 相关依赖
import 'bpmn-js/dist/assets/diagram-js.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-codes.css'
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css'

// 左边工具栏以及编辑节点的样式
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'
import Highlight from "@/components/highlight/highlight";


import axios from "axios";
// import TreeTable from 'vue-table-with-tree-grid'
// Vue.component('tree-table', TreeTable)
import TreeTable  from 'vue-table-with-tree-grid'
import * as filters from './common/api/filters'
import * as echarts from 'echarts';
import { resetForm } from "./common/api/utils";
import mixin from './mixin/mixin.js'
Vue.mixin(mixin)
// 全局方法挂载
Vue.prototype.resetForm = resetForm

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.component('tree-table', TreeTable)
Vue.use(TreeTable )
Vue.use(ElementUI);
Vue.use(Highlight);
axios.defaults.timeout = 6000;
axios.defaults.baseURL = process.env.BASE_API;

// 挂在到Vue实例，后面可通过this调用
Vue.prototype.$http = axios
Vue.prototype.$axios = axios;
Vue.prototype.$echarts = echarts;

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
