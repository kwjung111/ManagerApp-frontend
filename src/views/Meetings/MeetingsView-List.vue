<script setup>
import Post from '../../components/Post.vue'
import PostAddModal from '../../components/Post-AddModal.vue'
import MemoAddModal from '../../components/Memo-AddModal.vue'
import HamburgerBtn from '../../components/common/Hamburger-btn.vue'
import { ref, onMounted, inject } from 'vue'

const axios = inject('axios')
const Cmmn = inject('Cmmn')

const url = Cmmn.url;

const meetings = ref(null)
const postAddModalVisible = ref(false)
const memoAddModalVisible = ref(false)


onMounted(() => {
})


</script>

<template>
    <header>
        <div class="header-container">
            <div class="header-title">
                <h1> 미팅/회의 </h1>
                <h2>완료 게시물 </h2>
            </div>
            <div class="header-date">
                <p>{{ fromDate}} ~ {{ toDate}} </p>
            </div>
            <HamburgerBtn></HamburgerBtn>
        </div>
    </header>
    <section>
        <div class="container">
            <div class="sidebar">
                <div class="box"><button class="box-text" @click="toggleDatePickModal()"> 진행중
                        <span class=strong>{{ posts?.length || 0 }}</span></button> </div>
            </div>
            <div class="table-wrap">
                <div class="post-table">
                    <ul class="table-head">
                        <li class="col01">NO</li>
                        <li class="col02">등록일시</li>
                        <li class="col03">내용/상세</li>
                        <li class="col04">상태</li>
                        <li class="col05">시작시간</li>
                        <li class="col06">작성자/참여자</li>
                        <li class="col07">비고</li>
                    </ul>
                    <div class="table-body" v-if="posts?.length">
                        <ol>
                            <!-- <Post v-for="(post, i) of posts" :key="i" :post="post" :lastRefreshTime="lastRefreshTime" :modifyOnly=true @doRefresh="refresh"/> -->
                        </ol>
                    </div>
                    <div class="table-body" v-else>
                        <p class="no-db"> 조건에 해당하는 게시물이 없습니다 ! !</p>
                    </div>
                </div>
            </div>
            <template v-if="datepickModalVisible" >
                <div class="modal-bg">
            <DatePickModal :fromDate="fromDate" :toDate="toDate" @closeModal="toggleDatePickModal" @selectDate="selectDate"></DatePickModal>
        </div>
        </template>
        </div>
    </section>
</template>
