import Vue from "vue";
import Router from "vue-router";
import User from "@/page/user";
import Order from "@/page/order";
import Main from "@/page/main";
import System from "@/page/system";
import File from "@/page/file";
import Login from "@/page/login";
import Layout from "@/components/layout";
import Centre from "@/components/centre";

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "Layout",
      component: Layout,
      children: [
        {
          path: "/",
          name: "Centre",
          component: Centre
        },
        {
          path: "order",
          name: "Order",
          component: Order
        },
        {
          path: "/main",
          name: "Main",
          component: Main
        },
        {
          path: "/order",
          name: "Login",
          component: Login
        },
        {
          path: "/user",
          name: "User",
          component: User
        },
        {
          path: "/system",
          name: "System",
          component: System,
          children: [

          ]
        },
        {
          path: "/system/file",
          name: "File",
          component: File
        }
      ]
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    }
  ]
});
