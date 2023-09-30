<script setup>
import { ref } from 'vue';

const hbgActive = ref(false);

function toggleGNB() {
    hbgActive.value = !hbgActive.value
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
            <li><router-link to="/srList"><i class="fa-regular fa-calendar"></i>SR LIST</router-link></li>
            <li><router-link to="/Schedule"><i class="fa-regular fa-calendar"></i>개인 스케줄</router-link></li>
            <li><router-link to="/ScheduleAll"><i class="fa-regular fa-calendar"></i>직원 스케줄</router-link></li>
            <li><router-link to="/login"><i class="fa-regular fa-calendar"></i>로그인 테스트</router-link></li>
            <li><a href="" title=""><i class="fa-regular fa-folder"></i>Knowledge Share</a></li>
        </ul>
    </div>
</div>
</template>