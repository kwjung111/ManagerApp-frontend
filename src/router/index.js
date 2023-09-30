import { createRouter, createWebHistory } from 'vue-router'
import axios from 'axios'
import cmmn from '../common.js'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'login' } //메인 : SR LIST
    },

    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      beforeEnter: (to, from, next) => {
        axios.get(`${cmmn.url}/auth/chkToken`).then((res) => {
          if (res.data.ok == true) {
            if (res.data.result.code == '00') {
              next({name:'srList'});
            }else{
              next();
            }
          } else {
            next();
            cmmn.toastError('서버와 통신 실패. 접속 상태를 확인해 주세요')
          }
        })
      }
    },

    {
      path: '/srList',
      name: 'srList',
      component: () => import('../views/PostsView.vue')
    },

    {
      path: '/Schedule',
      name: 'Schedule',
      component: () => import('../views/ScheduleView-Personal.vue') //code splitting 최적화
    },

    {
      path: '/ScheduleAll',
      name: 'ScheduleAll',
      component: () => import('../views/ScheduleView-All.vue') //code splitting 최적화
    }

    /*
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
    */
  ]
})

export default router
