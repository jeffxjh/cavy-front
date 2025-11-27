import Vue from 'vue';
import Router from 'vue-router';
import User from '@/page/user';
import Order from '@/page/order';
import Main from '@/page/main';
import System from '@/page/system';
import Dict from '@/page/dict';
import File from '@/page/file';
import Knowledge from '@/page/knowledge';
import Article from '@/page/article';
import Category from '@/page/category';
import Label from '@/page/label';
import Power from '@/page/power';
import Role from '@/page/role';
import Menu from '@/page/menu';
import Task from '@/page/task';
import Login from '@/page/login';
import Questionanswer from '@/page/questionanswer';
import Questionform from '@/page/form/questionform';
import Dictform from '@/page/form/dictform';
import Userform from '@/page/form/userform';
import Taskform from '@/page/form/taskform';
import Websocket from '@/page/websocket';
import Layout from '@/components/layout';
import Centre from '@/components/centre';
import Home from '@/view/home/home';
import Workflow from '@/page/workflow/workflow';
import Bussiness from '@/page/workflow/bussiness/bussiness';
import ModelConfig from '@/page/workflow/modelConfig';
import Demo from '@/page/workflow/bussiness/demo';
import taskList from '@/page/workflow/taskList';
import DefinitionList from '@/page/workflow/definitionList';
import DefinitionForm from '@/page/workflow/definitionForm';
import WorkflowDashboard from '@/page/workflow/dashboard';

Vue.use(Router);

const routes = [
    {
        path: '/index',
        name: 'Layout',
        component: Layout,
        children: [
            {
                path: '/workflow',
                name: 'Workflow',
                component: Workflow,
                children: [
                    {
                        path: '/workflow/dashboard',
                        name: 'WorkflowDashboard',
                        component: WorkflowDashboard,
                        meta: { title: '工作台' },
                    },
                    {
                        path: '/workflow/taskList',
                        name: 'taskList',
                        component: taskList,
                        meta: { title: '代办任务' },
                    },
                    {
                        path: '/workflow/modelConfig',
                        name: 'ModelConfig',
                        component: ModelConfig,
                        meta: { title: '流程模型' },
                    },
                    {
                        path: '/workflow/definitionList',
                        name: 'DefinitionList',
                        component: DefinitionList,
                        meta: { title: '流程模型列表' },
                    },
                    {
                        path: '/workflow/definitionForm',
                        name: 'DefinitionForm',
                        component: DefinitionForm,
                        meta: { title: '流程模型表单' },
                    },
                    {
                        path: '/workflow/bussiness',
                        name: 'Bussiness',
                        component: Bussiness,
                        children: [
                            {
                                path: '/workflow/bussiness/demo',
                                name: 'Demo',
                                component: Demo,
                                meta: { title: '业务流程示例', name: 'DEMO' },
                            },
                        ],
                    },
                ],
            },
            {
                path: '/',
                name: 'Centre',
                component: Centre,
                meta: {
                    title: 'Centre',
                },
            },
            {
                path: '/order',
                name: 'Order',
                component: Order,
                meta: { title: '订单' },
            },
            {
                path: '/main',
                name: 'Main',
                component: Main,
                meta: { title: '主页' },
            },
            {
                path: '/task',
                name: 'Task',
                component: Task,
                meta: { title: '任务管理' },
            },
            ,
            {
                path: '/form/taskform',
                name: 'Taskform',
                component: Taskform,
                meta: { title: '任务表单' },
            },
            {
                path: '/power',
                name: 'Power',
                component: Power,
                children: [
                    {
                        path: '/power/menu',
                        name: 'Menu',
                        component: Menu,
                        meta: { title: '菜单管理' },
                    },
                    {
                        path: '/power/user',
                        name: 'User',
                        component: User,
                        meta: { title: '用户管理' },
                    },
                ],
            },
            {
                path: '/power/role',
                name: 'Role',
                component: Role,
                meta: { title: '角色管理' },
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
                path: '/knowledge',
                name: 'Knowledge',
                component: Knowledge,
                children: [],
                meta: { title: '知识管理' },
            },
            {
                path: '/knowledge/category',
                name: 'Category',
                component: Category,
                meta: { title: '知识类型' },
            },
            {
                path: '/knowledge/article',
                name: 'Article',
                component: Article,
                meta: { title: '知识文章' },
            },
            {
                path: '/knowledge/label',
                name: 'LabelLabel',
                component: Label,
                meta: { title: '知识标签' },
            },
            {
                path: '/system',
                name: 'System',
                component: System,
                children: [
                    {
                        path: '/system/dict',
                        name: 'Dict',
                        component: Dict,
                        meta: { title: '字典列表' },
                    },
                    {
                        path: '/system/file',
                        name: 'File',
                        component: File,
                        meta: { title: '文件表单' },
                    },
                    {
                        path: '/form/dictform',
                        name: 'Dictform',
                        component: Dictform,
                        meta: { title: '字典表单' },
                    },
                ],
                meta: { title: '系统管理' },
            },
            {
                path: '/favour',
                name: 'Favour',
                component: () => import('@/page/favour/favour.vue'),
                children: [
                    {
                        path: '/favour/relative',
                        name: 'Relative',
                        component: () => import('@/page/favour/relative.vue'),
                    },
                    {
                        path: '/favour/record',
                        name: 'Record',
                        component: () => import('@/page/favour/record.vue'),
                    },
                ],
            },
            {
                path: '/message/websocket',
                name: 'Websocket',
                component: Websocket,
                meta: { title: 'websocket' },
            },
            {
                path: '/questionanswer',
                name: 'Questionanswer',
                component: Questionanswer,
                meta: { title: '问答' },
            },
            {
                path: '/form/questionform',
                name: 'Questionform',
                component: Questionform,
                meta: { title: '问题表单' },
            },
            {
                path: '/form/userform',
                name: 'Userform',
                component: Userform,
                meta: { title: '用户表单' },
            },
            {
                path: '/form/roleform',
                name: 'RoleForm',
                component: () => import('@/page/form/roleform.vue'),
                meta: { title: '角色表单' },
            },
        ],
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
        meta: { title: '登录' },
    },
    // {
    //   path: "/",
    //   redirect:'/index',
    //   name: "Layout",
    //   component: Layout
    // }
    // ,
    {
        path: '/home',
        name: 'Home',
        component: Home,
        meta: { title: 'home' },
    },
];

const router = new Router({
    routes,
});

// 挂载路由导航守卫,to表示将要访问的路径，from表示从哪里来，next是下一个要做的操作 next('/login')强制跳转login
router.beforeEach((to, from, next) => {
    // 如果路由没有定义 meta，默认设置为需要认证
    if (to.meta === undefined) {
        to.meta = {};
    }

    // 如果 requiresAuth 未定义，默认设为 true
    if (to.meta.requiresAuth === undefined) {
        to.meta.requiresAuth = true;
    }
    // 访问登录页，放行
    if (to.path === '/login') {
        if (window.localStorage.getItem('token')) {
            next('/index');
        }
        return next();
    }
    // 检查登录状态
    if (to.meta.requiresAuth && window.localStorage.getItem('token') == null) {
        next({
            path: '/login',
            query: { redirect: to.fullPath },
        });
    } else {
        next();
    }
    //默认访问页 推到首页或者登录页
    if (to.path === '/' || to.path === '/index') {
        if (window.localStorage.getItem('token')) {
            next('/index');
        }
        return next('/login');
    }
    // console.info("localStorage.token", localStorage.token);
    // 获取token
    // const tokenStr = window.sessionStorage.getItem("token");
    const tokenStr = window.localStorage.getItem('token');

    // 没有token, 强制跳转到登录页
    if (!tokenStr) return next('/login');
    next();
});

export default router;
