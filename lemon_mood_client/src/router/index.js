import Vue from 'vue'
import Router from 'vue-router'
import NotFound from '@/pages/404.vue'
import Introduction from '@/pages/Introduction.vue'
import Login from '@/pages/Login.vue'
import Main from '@/pages/Main.vue'
import Home from '@/pages/home/Home.vue'
import LogMood from  '@/pages/log/LogMood.vue'
import Calendar from  '@/pages/calendar/Calendar.vue'
import Setting from '@/pages/setting/Setting.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
      path: '/',
      name: 'Introduction',
      component: Introduction
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
      children:[
        {
          path: 'home',
          name: 'Home',
          component: Home
        },
        {
          path: 'log',
          name: 'LogMood',
          component: LogMood
        },
        {
          path: 'calendar',
          name: 'Calendar',
          component: Calendar
        },
        {
          path: 'setting',
          name: 'Setting',
          component: Setting
        },
      ],
      redirect:'/main/home'
    },
    {
      path: '/404',
      name: 'NotFound',
      component: NotFound
    },
    {
      path: '*',
      redirect: {
        path: '/404'
      }
    }
  ]
})
