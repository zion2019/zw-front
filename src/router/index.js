import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/Home.vue';
import Learning from '../pages/Learning.vue';
import TopicEdit from '../pages/topic/TopicEdit.vue';
import TopicList from '../pages/topic/TopicList.vue';
import PointEdit from '../pages/point/PointEdit.vue';
import PointImport from '../pages/point/PointImport.vue';
import PointList from '../pages/point/PointList.vue';
import TaskEdit from '../pages/task/TaskEdit.vue';
import TaskList from '../pages/task/TaskList.vue';
import TaskHandle from '../pages/task/TaskHandle.vue';
import PracticeList from '../pages/practice/PracticeList.vue';
import Practice from '../pages/practice/Practice.vue';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import BillIndex from '../pages/bill/BillIndex.vue';
import BillEdit from '../pages/bill/BillEdit.vue';
import BillStats from '../pages/bill/BillStats.vue';
import BillCategoryList from "@/pages/bill/BillCategoryList.vue";
import BillCategoryEdit from "@/pages/bill/BillCategoryEdit.vue";

const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/learning',
      name: 'Learning',
      component: Learning
    },
    {
        path: '/bill',
        name: 'Bill',
        component: BillIndex
    },
    {
        path: '/bill/edit',
        name: 'BillEdit',
        component: BillEdit
    },
    {
        path: '/bill/category/list',
        name: 'BillCategoryList',
        component: BillCategoryList
    },
    {
        path: '/bill/category/edit',
        name: 'BillCategoryEdit',
        component: BillCategoryEdit
    },
    {
        path: '/bill/stats',
        name: 'BillStats',
        component: BillStats
    },
    {
      path: '/topic',
      name: 'TopicEdit',
      component: TopicEdit,
      props: true
    },
    {
      path: '/topic/list',
      name: 'TopicList',
      component: TopicList
    },
    {
      path: '/point/list',
      name: 'PointList',
      component: PointList,
      props: true
    },
    {
      path: '/point',
      name: 'PointEdit',
      component: PointEdit,
      props: true
    },
    {
      path: '/point/import',
      name: 'PointImport',
      component: PointImport,
      props: true
    },
    {
      path: '/task',
      name: 'TaskEdit',
      component: TaskEdit,
      props: true
    },
    {
      path: '/practice',
      name: 'Practice',
      component: Practice
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/practice/list',
      name: 'PracticeList',
      component: PracticeList
    },
    {
      path: '/task/list',
      name: 'TaskList',
      component: TaskList
    },
    {
      path: '/task/handle',
      name: 'TaskHandle',
      component: TaskHandle
    },
  ];
  

  const router = createRouter({
    history: createWebHistory(),
    routes
  });
  
  export default router;