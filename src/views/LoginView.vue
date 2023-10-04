<script setup>
import { ref,inject,computed} from 'vue'
import {useRouter} from 'vue-router'
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
const usableId = ref(false)
const emailSent = ref(false)

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
            failMsg.value = "일치하는 ID가 없습니다"
        }
        else if(res.data.result.code =="02"){
            failMsg.value = "비밀번호가 일치하지 않습니다"
        }else if(res.data.result.code =="03"){
            failMsg.value = "인증이 필요한 계정입니다."
        }
    }else{
        Cmmn.toastError('실패했습니다. 접속 상태를 확인해 주세요')
    }
})
}
function signUpVisible(){
    isSignUp.value = !isSignUp.value;
}
function signUp(){
    
    let param = {
        id : signUpId.value,
        pwd :signUpPwd.value,
        name:signUpNm.value,
        email : signUpEmail.value
    }
    
    axios.post(`${url}/auth/signUp`,param)
    .then((ret) => {
        if(ret.data.ok == true){
            id.value = signUpId.value
            pwd.value =signUpPwd.value
            isSignUp.value = false;
            usableId.value = false;
            signUpId.value = ''
            signUpPwd.value = ''
            signUpNm.value = ''
            signUpEmail.value = ''
        }
        else{
          cmmn.toastError('유효성 검사에 실패했습니다.')
        }
    })

    axios.post(`${url}/auth/sendMailForSignUp`,{id:signUpId.value,email:signUpEmail.value}).then((ret) => {
        emailSent.value = true
        cmmn.toastSuccess('가입 성공. 이메일로 인증 링크가 발송되었습니다.')
    })

}
function idChk(id){
    if(id.length < 5){
        cmmn.toastAlert('id는 5자 이상이어야 합니다.')
        return;
    }
    axios.get(`${url}/auth/checkId/${id}`)
    .then((ret) =>{
        console.log(ret.data.result)
        if(!ret.data.result){   //있으면 true 반환
            cmmn.toastSuccess('사용 가능한 id 입니다.')
            usableId.value = true
        }else{
            cmmn.toastAlert('이미 가입된 id 입니다.')
        }
})
}

const signUpAble = computed(() => {
    return (usableId.value && 
    (signUpPwd.value.length >=   5) &&
    signUpNm.value && signUpEmail.value) 
})

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
      <button @click="doLogin()">로그인</button>
      <button @click="signUpVisible()">회원가입</button>
      
      <section v-if="failMsg">
        <p class="error-message">{{ failMsg }}</p>
      </section>
      <section v-if="emailSent">
        <p>이메일로 인증 링크가 발송되었습니다.
            <br> 인증 후 로그인 해 주세요!
            <br> 인증 링크는 3분동안만 유효합니다.</p>
      </section>
      <section v-if="isSignUp" class="signup-section">
        <p>아이디,비밀번호는 일단 5자 이상으로 입력해주세요.</p>
        <div class="input-group2">
          <label for="signUpUserId">id:</label>
          <input :disabled="usableId" id="signUpUserId" type="text" v-model="signUpId">
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
          <input id="signUpUserEmail" type="text" v-model="signUpEmail">@businessinsight.co.kr
        </div>
        <button :disabled="!signUpAble" @click="signUp()">가입하기</button>
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