import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/view/login'
import Layout from '@/page/layout'
import Centre from '@/page/centre'
import Order from '@/page/order'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Layout',
      component: Layout,
      children: [{
        path: '/',
        name: 'Centre',
        component: Centre
      }, {
        path: 'order',
        name: 'Order',
        component: Order
      }]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    }
  ]
})
