<script setup>
import { provide ,onBeforeMount ,onMounted } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import axios from 'axios'
import Cmmn from './common';

//전역변수 설정
provide('axios',axios)
provide('Cmmn',Cmmn)


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
})



</script>

<template>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
  <RouterView />
</template>