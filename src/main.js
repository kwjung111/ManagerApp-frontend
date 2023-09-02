import './assets/common.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'

const app = createApp(App)

//전역 변수 선언 start

app.config.globalProperties.axios = axios;

//전역변수 선언 end

app.use(createPinia())
app.use(router)
//렌더링 시작점
app.mount('#app')
