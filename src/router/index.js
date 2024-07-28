import Vue from "vue";
import Router from "vue-router";
import User from "@/page/user";
import Order from "@/page/order";
import Main from "@/page/main";
import System from "@/page/system";
import File from "@/page/file";
import Knowledge from "@/page/knowledge";
import Article from "@/page/article";
import Category from "@/page/category";
import Label from "@/page/label";
import Power from "@/page/power";
import Role from "@/page/role";
import Menu from "@/page/menu";
import Task from "@/page/task";
import Login from "@/page/login";
import Questionanswer from "@/page/questionanswer";
import Questionform from "@/page/form/questionform";
import Userform from "@/page/form/userform";
import Taskform from "@/page/form/taskform";
import Websocket from "@/page/websocket";
import Layout from "@/components/layout";
import Centre from "@/components/centre";
import Home from "@/view/home/home";

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
        path: "/task",
        name: "Task",
        component: Task
      },
      ,
      {
        path: "/form/taskform",
        name: "Taskform",
        component: Taskform
      },
      {
        path: "/power",
        name: "Power",
        component: Power,
        children: [
          {
            path: "/power/menu",
            name: "Menu",
            component: Menu
          },
          {
            path: "/power/user",
            name: "User",
            component: User
          },
        ]
      },
      {
        path: "/power/role",
        name: "Role",
        component: Role
      },
      // {
      //   path: "/power/menu",
      //   name: "Menu",
      //   component: Menu
      // },
      // {
      //   path: "/power/user",
      //   name: "User",
      //   component: User
      // },
      {
        path: "/knowledge",
        name: "Knowledge",
        component: Knowledge,
        children: []
      },
      {
        path: "/knowledge/category",
        name: "Category",
        component: Category
      },
      {
        path: "/knowledge/article",
        name: "Article",
        component: Article
      },  
      {
        path: "/knowledge/label",
        name: "LabelLabel",
        component: Label
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
      },
      {
        path: "/form/userform",
        name: "Userform",
        component: Userform
      }
    ]
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  }
  ,
  // {
  //   path: "/",
  //   redirect:'/index',
  //   name: "Layout",
  //   component: Layout
  // }
  // ,
  {
    path: "/home",
    name: "Home",
    component: Home
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
  //默认访问页 推到首页或者登录页
  if (to.path === "/") {
    if (window.localStorage.getItem("token")) {
      next("/index");
    }
    return next("/login");
  }
  // console.info("localStorage.token", localStorage.token);
  // 获取token
  // const tokenStr = window.sessionStorage.getItem("token");
  const tokenStr = window.localStorage.getItem("token");

  // 没有token, 强制跳转到登录页
  if (!tokenStr) return next("/login");
  next();
});

export default router;
