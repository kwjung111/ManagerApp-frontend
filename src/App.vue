<script setup>
import { provide ,onBeforeMount ,onMounted, ref } from 'vue'
import {  RouterView,useRouter } from 'vue-router'
import axios from 'axios'
import Cmmn from './common';
import spinner from './components/common/spinner.vue';
import websock from './ws.js'

//전역변수 설정
provide('axios',axios)
provide('Cmmn',Cmmn)
provide('websock',websock)

const loadingCnt = ref(0)
const router = useRouter();
let isAlertShown = false; // 알림 표시 여부
let debounceTimer = null; // 알림 - 디바운스 패턴 적용을 위한 변수




onMounted(() => {

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
//새로고침 시 웹소켓 재연결
if (localStorage.getItem('wsReConnect') === "true") {
  console.log('리프레시 감지됨. 웹소켓 재연결..')
  websock.connectWs();
}
});

onBeforeMount(() => {
  /*
  const eventSource = new EventSource('http://localhost:3000/events');
    eventSource.onmessage = (event) => {
      console.log(event)
    };
*/

//axios configuration
axios.interceptors.request.use(function(config){    //로딩바 있는 기본 axios
  loadingCnt.value++;
  config.withCredentials = true; //쿠키 관련 설정
 
  const cookie = document.cookie

  let token
  if(cookie){
    token = Cmmn.getCookie('jwt');
  }

  if (token) {
        config.headers.authorization = `${token}`;
  }
    
  return config
},
function(error){
  return Promise.reject(error);
})
})

axios.interceptors.response.use(
  (response) => {
    loadingCnt.value--;
    return response;
  },
  (error) => {
    loadingCnt.value--;
    if (error.response && error.response.status === 400) {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {showAlertAndRedirect(`API 요청이 유효하지 않습니다 : ${error.response.data?.message}`)}, 500);
    }
    else if (error.response && error.response.status === 403) {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {showAlertAndRedirect('토큰이 만료되었습니다. 재 로그인 해 주세요.')}, 500);
      forcedExit()
    }else if( error.response && error.response.status === 401){
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {showAlertAndRedirect('유효하지 않은 토큰입니다.')}, 500); 
      forcedExit()
    }else if( error.response && error.response.status === 500){
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {showAlertAndRedirect('서버 에러. 관리자에게 문의해주세요.')}, 500); 
    }
    return Promise.reject(error);
  }
);

function showAlertAndRedirect(msg){
  if (!isAlertShown) {
    isAlertShown = true;
    Cmmn.toastError(msg)
    router.push('/login').finally(() => {
      isAlertShown = false;
    });
  }
}

//토큰 만료시
function forcedExit(){
  websock.disconnect()
  localStorage.setItem('wsReConnect', false);
}

const axiosNoSpinner = axios.create({                 //로딩바 없는 axios에 사용
}) 

provide('axiosNoSpinner',axiosNoSpinner)

</script>

<template>
  <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined" rel="stylesheet" />
  <RouterView />
  <spinner :loadingCnt="loadingCnt"></spinner>
</template>