import { createRouter, createWebHistory } from 'vue-router'
import PostsView from '../views/PostsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: {name:'srList'}  //TODO 서비스 추가시 고치기
    },
    
    {
      path:'/srList',
      name: 'srList',
      component : PostsView

    },

    {
      path:'/test',
      name:'test',
      component : () => import('../views/TestView.vue') //code splitting 최적화
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
