import { createRouter, createWebHashHistory } from 'vue-router'
import axios from 'axios'
import cmmn from '../common.js'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
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
      //자동 로그인 로직
      beforeEnter: (to, from, next) => {
        if (!cmmn.getCookie('jwt')) {
          next()
        } 
        else 
        {
          axios.get(`${cmmn.url}/auth/chkToken`).then((res) => {
            if (res.data.ok == true) {
              if (res.data.result.code == '00') {
                next({ name: 'srList' })
              } else {
                next()
              }
            } else {
              next()
              cmmn.toastError('서버와 통신 실패. 접속 상태를 확인해 주세요')
            }
          })
        }
      },
    },

    {
      path: '/srList',
      name: 'srList',
      component: () => import('../views/Posts/PostsView.vue'),
    },

    {
      path: '/srListAll',
      name: 'srListAll',
      component: () => import('../views/Posts/PostsView-All.vue'),
    },

    {
      path: '/Schedule',
      name: 'Schedule',
      component: () => import('../views/ScheduleView-Personal-Calendar.vue') //code splitting 최적화
    },

    {
      path: '/ScheduleAll',
      name: 'ScheduleAll',
      component: () => import('../views/ScheduleView-All.vue') //code splitting 최적화
    },
    {
      path: '/Meetings',
      name: 'Meetings',
      component: () => import('../views/Meetings/MeetingsView-List.vue') //code splitting 최적화
    },
    {
      path: '/Projects',
      name: 'Projects',
      component: () => import('../views/Projects/ProjectsView.vue') //code splitting 최적화
    },
    {
      path: '/ProjectsAll',
      name: 'ProjectsAll',
      component: () => import('../views/Projects/ProjectsView-All.vue') //code splitting 최적화
    },

    //테스트용 페이지
    {
      path: '/test',
      name: 'test',
      component: () => import('../views/TestView.vue') //code splitting 최적화
    },
    { 
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: () =>import('../views/NotFoundView.vue') }

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
  ],
})
export default router
