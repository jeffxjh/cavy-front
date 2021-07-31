import Vue from "vue";
import Router from "vue-router";
import User from "@/page/user";
import Order from "@/page/order";
import Main from "@/page/main";
import System from "@/page/system";
import File from "@/page/file";
import Login from "@/page/login";
import Questionanswer from "@/page/questionanswer";
import Questionform from "@/page/form/questionform";
import Websocket from "@/page/websocket";
import Layout from "@/components/layout";
import Centre from "@/components/centre";

Vue.use(Router);

const routes = [
  {
    path: "/index",
    name: "Layout",
    component: Layout,
    children: [
      {
        path: "/",
        name: "Centre",
        component: Centre
      },
      {
        path: "/order",
        name: "Order",
        component: Order
      },
      {
        path: "/main",
        name: "Main",
        component: Main
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
        children: []
      },
      {
        path: "/system/file",
        name: "File",
        component: File
      }
      ,
      {
        path: "/message/websocket",
        name: "Websocket",
        component: Websocket
      },
      {
        path: "/questionanswer",
        name: "Questionanswer",
        component: Questionanswer
      },
      {
        path: "/form/questionform",
        name: "Questionform",
        component: Questionform
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  }
];

const router = new Router({
  routes
});

// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作 next('/login')强制跳转login
router.beforeEach((to, from, next) => {
  // 访问登录页，放行
  if (to.path === "/login") {
    if (window.localStorage.getItem("token")) {
      next("/index");
    }
    return next();
  }
  console.info("localStorage.token", localStorage.token);
  // 获取token
  // const tokenStr = window.sessionStorage.getItem("token");
  const tokenStr = window.localStorage.getItem("token");

  // 没有token, 强制跳转到登录页
  if (!tokenStr) return next("/login");
  next();
});

export default router;
