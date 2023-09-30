import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: {name:'login'}  //메인 : SR LIST
    },

    {
      path: '/login',
      name: 'login',
      component : () => import('../views/LoginView.vue')
    },
    
    {
      path:'/srList',
      name: 'srList',
      component : () => import('../views/PostsView.vue')

    },

    {
      path:'/Schedule',
      name:'Schedule',
      component : () => import('../views/ScheduleView-Personal.vue') //code splitting 최적화
    },

    {
      path:'/ScheduleAll',
      name:'ScheduleAll',
      component : () => import('../views/ScheduleView-All.vue') //code splitting 최적화
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
