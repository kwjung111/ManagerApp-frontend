<script setup>
import {useRouter} from 'vue-router'
import { ref,inject } from 'vue';

const axios = inject('axios')
const Cmmn = inject('Cmmn')
const websock = inject('websock')

const router = useRouter();

const hbgActive = ref(false);

function toggleGNB() {
    hbgActive.value = !hbgActive.value
}


//로그아웃
function logout() {
    axios.get(`${Cmmn.url}/auth/logout`)
    .then((ret)=>{
        if(ret.data.ok == true){
            websock.disconnect()    //웹소켓 해제
            deregisterSW()
            router.push('/login').then(
                Cmmn.toastSuccess('로그아웃 성공!')
            )
        }else{
            Cmmn.toastError('서버와 통신에 실패하였습니다.')
        }
    })
    }

//서비스워커 해제
async function deregisterSW(){
if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          for (let registration of registrations) {
            registration.unregister().then(() => {
              console.log('서비스 워커 해제됨');
            });
          }
        });
      }
    }

</script>

<template>
    <div class="header-gnb">
                <a @click="toggleGNB()" :class="{active : hbgActive}"    class="btn-gnb" :title="[hbgActive ? '메뉴 닫기' : '메뉴 열기']">
                    <span></span>
                    <span></span>
                    <span></span>
                </a>
    <div class="gnb">
        <ul class="gnb-ul">
            <li @click="toggleGNB()"><router-link to="/srList"><i class="fa-regular fa-calendar"></i>SR-LIST</router-link></li>
            <li @click="toggleGNB()"><router-link to="/srListAll"><i class="fa-regular fa-calendar"></i>SR-완료된 게시물</router-link></li>
            <!--<li @click="toggleGNB()"><router-link to="/Projects"><i class="fa-regular fa-calendar"></i>프로젝트</router-link></li>-->
            <!--<li @click="toggleGNB()"><router-link to="/ProjectsAll"><i class="fa-regular fa-calendar"></i>완료된 프로젝트</router-link></li>-->
            <!-- <li @click="toggleGNB()"><router-link to="/Meetings"><i class="fa-regular fa-calendar"></i>미팅/회의</router-link></li> -->
            <!-- <li><router-link to="/ScheduleAll"><i class="fa-regular fa-calendar"></i>직원 스케줄</router-link></li> -->
            <!-- <li><a href="" title=""><i class="fa-regular fa-folder"></i>Knowledge Share</a></li>-->
            <li @click="logout()"><a title='로그아웃하기'><i class="fa-regular fa-folder"></i>로그아웃</a></li>
            <!--<li><router-link to="/test"><i class="fa-regular fa-calendar"></i>테스트</router-link></li>-->
        </ul>
    </div>
</div>
</template>