<script setup>
import { ref, onMounted, computed, inject } from 'vue'
import HamburgerBtn from '../components/common/Hamburger-btn.vue';

const axios = inject('axios')
const Cmmn = inject('Cmmn')

const curDt = ref(new Date())
const scheduleFilter = ref(0)

const timer = setInterval(() => {
    curDt.value = new Date()
}, 500)

const toggleScheduleModal = () => {
    console.log("modal mock")
}

const changeFilter = (stateCd) =>{
    if(scheduleFilter.value !== 0 && scheduleFilter.value == stateCd){
        scheduleFilter.value = 0;
    }else{
        scheduleFilter.value = stateCd;
    }
    console.log(scheduleFilter.value,'changed')
}

</script>

<template>
    <header>
        <div class="header-container">
            <div class="header-title">
                <h1> 개인 스케줄</h1>
                <h2 v-if="scheduleFilter == 0">진행중</h2>
                <h2 v-if="scheduleFilter == 1">미도래</h2>
                <h2 v-if="scheduleFilter == 2">최근 3개월</h2>
            </div>
            <div class="header-date">
                <p>{{ curDt }}</p>
            </div>
            <HamburgerBtn></HamburgerBtn>
        </div>
        <div class="btn-post-wrap">
            <button class="btn-post btn-common positive" @click="toggleScheduleModal()" title="신규 개인스케줄 등록">
                <i class="fa-pen-to-square"></i>
            </button>
        </div>
    </header>

    <section>
        <div class="container">
            <div class="sidebar">
                    <div class="box" @click=changeFilter(0)> <button class="box-text" :class="{ active: scheduleFilter == 0 }">진행중
                    <span class="strong"> 수정</span></button></div>
                    <div class="box" @click=changeFilter(1)> <button class="box-text" :class="{ active: scheduleFilter == 1 }">미도래
                    <span class="strong"> 수정</span></button></div>
                    <div class="box" @click=changeFilter(2)> <button class="box-text" :class="{ active: scheduleFilter == 2 }">최근 3개월
                    <span class="strong"> 수정</span></button></div>
            </div>
            <div class="table-wrap">
                <div class="post-table">
                    <ul class="table-head">
                        <li class="col01">NO</li>
                        <li class="col02">스케줄 내용</li>
                        <li class="col03">기간</li>
                        <li class="col04">등록 일시</li>
                        <li class="col07">비고</li>
                    </ul>
                    <div class="table-body">
                        <ol>
                            <p> mock </p>
                        </ol>
                    </div>
                    <!--
                    <div class="table-body" v-else>
                        <p class="no-db">아직 등록된 게시물이 없습니다 ! !</p>
                    </div>-->
                </div>
            </div>
            <!-- 리팩토링 필요 구간 start-->
            <!--
            <template v-if="postAddModalVisible">
                <div class="modal-bg">
                    <PostAddModal @closeModal="togglePostAddModal" />
                </div>
            </template>
            <template v-if="memoAddModalVisible">
                <div class="modal-bg">
                    <MemoAddModal :postSeq="postSeqForMemo" @closeModal="toggleMemoAddModal" />
                </div>
        </template>
        -->
        <!-- 구간 end -->
    </div>
</section>
</template>
