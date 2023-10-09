<script setup>
import Post from '../../components/Post.vue'
import HamburgerBtn from '../../components/common/Hamburger-btn.vue'
import DatePickModal from '../../components/common/Date-PickModal.vue';
import { ref, onMounted, onBeforeMount, computed, inject } from 'vue'


const axios = inject('axios')
const Cmmn = inject('Cmmn')

const url = Cmmn.url

const curDt = ref(new Date())
const isActive = ref(false)
const lastRefreshTime = ref(new Date())           //타이머 구현을 위해 마지막 refresh 시간을 받음

const posts = ref(null)
const postSeqForMemo = ref(null)                  //메모를 삽입할 게시물번호

const fromDate = ref(Cmmn.getCurMonthYMD())
const toDate = ref(Cmmn.getTodayYMD())

const datepickModalVisible = ref(false)

onBeforeMount(() => {
     refresh()
})

const refresh = async () => {

    const queryParams = {
        fromDate : fromDate.value,
        toDate : toDate.value,
    }
    axios.get(`${url}/posts/byMonth`,{params:queryParams},
    )
        .then((res) => {
            console.log(res)
            posts.value = res.data.result
        })

}


function toggleDatePickModal() {
    datepickModalVisible.value = !datepickModalVisible.value
}

function selectDate(data){
    fromDate.value = data.fromDate
    toDate.value = data.toDate
    refresh();
}



</script>

<template>
    <header>
        <div class="header-container">
            <div class="header-title">
                <h1> SR LIST </h1>
                <h2>완료 게시물</h2>
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
                <div class="box"><button class="box-text" @click="toggleDatePickModal()"> 완료된 게시물 수
                    <br>클릭해서 기간 변경
                        <span class=strong>{{ posts?.length || 0 }}</span></button> </div>
            </div>
            <div class="table-wrap">
                <div class="post-table">
                    <ul class="table-head">
                        <li class="col01">NO</li>
                        <li class="col02">등록일시</li>
                        <li class="col03">SR 내용</li>
                        <li class="col04">상태</li>
                        <li class="col05">조치시간</li>
                        <li class="col06">작성자</li>
                        <li class="col07">비고</li>
                    </ul>
                    <div class="table-body" v-if="posts?.length">
                        <ol>
                            <Post v-for="(post, i) of posts" :key="i" :post="post" :lastRefreshTime="lastRefreshTime" :modifyOnly=true @doRefresh="refresh"/>
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
