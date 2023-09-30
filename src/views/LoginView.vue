<script setup>
import { ref,inject,} from 'vue'
import {useRouter,useRoute} from 'vue-router'
import cmmn from '../common';

const axios = inject('axios')
const Cmmn = inject('Cmmn')
const url = Cmmn.url;
const router =useRouter();

const id = ref('')
const pwd = ref('')
const failMsg = ref('')
const isSignUp = ref(false)


//회원가입 폼
const signUpId = ref('')
const signUpPwd = ref('')
const signUpNm = ref('')
const signUpEmail = ref('')

function doLogin(){
    const idVal = id.value
    const pwdVal = pwd.value

axios.post(`${url}/auth/login`,{
    id:idVal,
    pwd : pwdVal
}).then((res) => {      
    if(res.data.ok == true){
        if(res.data.result.code == "00"){
            Cmmn.toastSuccess('로그인 성공!')
        router.push('/srList')  //로그인 성공 시 리디렉션
        }
        else if(res.data.result.code == "01"){
            console.log('id failure')
            failMsg.value = "id failure"
        }
        else if(res.data.result.code =="02"){
            console.log('pwd failure')
            failMsg.value = "pwd failure"
        }   
    }else{
        Cmmn.toastError('실패했습니다. 접속 상태를 확인해 주세요')
    }
})
}
function signUpVisible(){
    isSignUp.value = !isSignUp.value;
    /*
    axios.post(`${url}/auth/signUp`,{
        id:'test2',
        pwd:'test2',
        email:'kwjung@businessinsight.co.kr',
        name: '정강욱'  
    }).then((ret) => {
        console.log(ret)
    })*/

}
function signUp(){
    
    let param = {
        id : signUpId.value,
        pwd :signUpPwd.value,
        name:signUpNm.value,
        email : signUpEmail.value
    }
    console.log(param)
    /*
    axios.post(`${url}/auth/signUp`,{
        id:'test2',
        pwd:'test2',
        email:'kwjung@businessinsight.co.kr',
        name: '정강욱'  
    }).then((ret) => {
        console.log(ret)
    })*/

}
function idChk(id){
    axios.get(`${url}/auth/checkId/${id}`)
    .then((ret) =>{
        console.log(ret.data.result)
        if(!ret.data.result){   //있으면 true 반환
            cmmn.toastSuccess('사용 가능한 id 입니다.')
        }else{
            cmmn.toastAlert('이미 가입된 id 입니다.')
        }
})
}
</script>

<template>
    <div class="login-container2">
      <p> Login Page!!</p>
      <div class="input-group2">
        <label for="userId">id</label>
        <input id="userId" type="text" v-model="id">
      </div>
      <div class="input-group2">
        <label for="userPwd">password</label>
        <input id="userPwd" type="text" v-model="pwd">
      </div>
      <button @click="doLogin()">제출</button>
      <button @click="signUpVisible()">회원가입</button>
      
      <section v-if="failMsg">
        <p class="error-message">{{ failMsg }}</p>
      </section>
      
      <section v-if="isSignUp" class="signup-section">
        <div class="input-group2">
          <label for="signUpUserId">id:</label>
          <input id="signUpUserId" type="text" v-model="signUpId">
          <button @click="idChk(signUpId)">중복확인</button>
        </div>
        <div class="input-group2">
          <label for="signUpUserPwd">pwd:</label>
          <input id="signUpUserPwd" type="text" v-model="signUpPwd">
        </div>
        <div class="input-group2">
          <label for="signUpUserName">name:</label>
          <input id="signUpUserName" type="text" v-model="signUpNm">
        </div>
        <div class="input-group2">
          <label for="signUpUserEmail">email:</label>
          <input id="signUpUserEmail" type="text" v-model="signUpEmail">
        </div>
        <button @click="signUp()">가입하기</button>
      </section>
    </div>
  </template>
  
  <style>
  .login-container2 {
    width: 300px;
    margin: 0 auto;
  }
  
  .input-group2 {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
  }
  
  
  .error-message {
    color: red;
    margin-top: 10px;
  }
  
  .signup-section {
    margin-top: 20px;
  }
  </style>