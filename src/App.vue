<script setup>
import { provide ,onBeforeMount ,onMounted, ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios'
import Cmmn from './common';
import spinner from './components/common/spinner.vue';

//전역변수 설정
provide('axios',axios)

provide('Cmmn',Cmmn)

const isLoading = ref(false)

//TODO 로그인 구현시 삭제
/*
if(localStorage.getItem('userKey') == null){
  axios.get(`${Cmmn.url}/identifier`)
  .then((res) => {
    localStorage.setItem('userKey',res.data) 
  })
}
*/

//서비스워커 등록
const registerServiceWorker = async () => {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register("/sw.js");
      if (registration.installing) {
        console.log("Service worker : installing");
      } else if (registration.waiting) {
        console.log("Service worker : installed");
      } else if (registration.active) {
        console.log("Service worker : active");
      }
      return registration
    } catch (error) {
      console.error(`Registration failed with ${error}`);
    }
  }
};


onMounted(() => {

  registerServiceWorker()
/*.then((registration) => {
      //TODO 웹 푸시 관련 코드임
    if (Notification.permission != 'granted') {
        Notification.requestPermission((result) => {
          if (result == 'granted') {
            registration.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: ''
            })
          }
        });
      }
    })
}) */
Notification.requestPermission();
})

onBeforeMount(() => {
  /*
  const eventSource = new EventSource('http://localhost:3000/events');
    eventSource.onmessage = (event) => {
      console.log(event)
    };
*/

//axios configuration
axios.interceptors.request.use(function(config){    //로딩바 있는 기본 axios
  isLoading.value= true;
  return config
},
function(error){
  return Promise.reject(error);
})
})

axios.interceptors.response.use(
  (response) => {
    isLoading.value= false;
    return response;
  },
  (error) => {
    isLoading.value= false;
    return Promise.reject(error);
  }
);

const axiosNoSpinner = axios.create({                 //로딩바 없는 axios에 사용
}) 

provide('axiosNoSpinner',axiosNoSpinner)

</script>

<template>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
  <RouterView />
  <spinner :isLoading="isLoading"></spinner>
</template>