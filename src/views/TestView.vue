<script setup>
import {  inject } from 'vue'

const axios = inject('axios')
const Cmmn = inject('Cmmn')


function eventTest(){
  axios.get(`${Cmmn.url}/test/event`)
  .then((ret)=>{
    console.log(ret)

  });
}

</script>

<template>
  <main>
<p> this is test page!</p>
<button @click="eventTest()">이벤트 테스트</button>
  </main>
</template>
