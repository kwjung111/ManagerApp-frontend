
<script setup>
import Post from '../components/Post.vue'
import PostAddModal from '../components/Post-AddModal.vue'
import MemoAddModal from '../components/Memo-AddModal.vue'
import { ref, onMounted, computed, inject } from 'vue'
import cmmn from '../common';
import eventMapper from '../eventHandler';

const axios = inject('axios')
const Cmmn = inject('Cmmn')

const url = Cmmn.url;
const wsUrl = Cmmn.wsUrl;

const curDt = ref(new Date())

//현재 시각 타이머
const timer = setInterval(() => {
    curDt.value = new Date()
}, 500)


const posts = ref(null)
const postsCount = ref(null)
const postSeqForMemo = ref(null)                  //메모를 삽입할 게시물번호
const postAddModalVisible = ref(false)
const memoAddModalVisible = ref(false)
const lastRefreshTime = ref(new Date())           //타이머 구현을 위해 마지막 refresh 시간을 받음
const postFilter = ref(0)                         //0 최근 1주일 접수, 1 처리중, 2 긴급

let connectState = true;


onMounted(() => {
    connectWs() //웹소켓 연결시 리프레시 수행
})

const refresh = async () => {
    axios.all([
        axios.get(`${url}/postTree`),          //게시물
        axios.get(`${url}/postsCount`),    //게시물수
        //TODO 리프레시 시간: 서버 시간 기준으로 바꾼다.
    ])
        .then((resArr) => {
            const postsData = resArr[0].data.result
            const postsCountData = resArr[1].data.result[0]

            posts.value = postsData
            postsCount.value = postsCountData

            //TODO timer 관련 동작은 별도 스레드로 빼기
            lastRefreshTime.value = new Date()
        })

}


//웹소켓 연결
function connectWs() {

    let ws;

    /*
    const reconnectTimer = setInterval(() => {
        console.log('reconnecting to server...')
        connectWs()
    }, 3000);
    */

    ws = new WebSocket(wsUrl)

    ws.onopen = async () => {
        console.log('연결되었습니다')
        connectState = true;
        refresh()
    }

    ws.onmessage = async (event) => {
        const data = JSON.parse(event.data)
        if (data.type === "message") {
            let msgData = data.data
            console.log("server message :", msgData);
        }
        else if (data.type === "event") {
            let evtData = data.data
            console.log("server event : ", evtData)

            //이벤트가 오면 무조건 리프레시 TODO 분기처리.
            refresh();
            
            eventMapper(evtData)
        }
    }


ws.onclose = async (e) => {
    if (connectState == true) {
        console.log('서버와의 연결이 종료되었습니다.')
        connectState = false;
    }
    setTimeout(() => {
        console.log('reconnecting to server...')
        connectWs();
    }, 1000)
}
};




function togglePostAddModal() {
    postAddModalVisible.value = !postAddModalVisible.value;
}

function toggleMemoAddModal(data = null) {
    postSeqForMemo.value = data?.postSeq
    memoAddModalVisible.value = !memoAddModalVisible.value
}

function changeFilter(stateCd) {
    if (postFilter.value != 0 && postFilter.value == stateCd) {
        postFilter.value = 0
    }
    else {
        postFilter.value = stateCd
    }
}



//게시글 필터링
const actingFilter = (() => {
    return posts.value.filter((p) => p.BRD_PRGSS_TF == 1)
})
const emergencyFilter = (() => {
    return posts.value.filter((p) => p.BRD_PRGSS_TF == 1 && p.BRD_POST_CD == 2)
})

const filteredList = computed(() => {
    if (postFilter.value == 1) {
        return actingFilter()
    }
    else if (postFilter.value == 2) {
        return emergencyFilter()
    }
    else {
        return posts.value
    }
})


</script>

<template>
    <header>
        <div class="header-container">
            <div class="item">
                <h1> SR LIST </h1>
                <h2 v-if="postFilter == 0">전체</h2>
                <h2 v-if="postFilter == 1">처리 중</h2>
                <h2 v-if="postFilter == 2">긴급 처리 중</h2>
            </div>
            <div class="item">
                <p>{{ curDt }}</p>
            </div>
            <div class="item">
                <button class="post-add btn-common" @click="togglePostAddModal()" title="신규 SR 등록">
                    <span class="material-symbols-outlined">
                        add_box
                    </span>
                </button>
            </div>
        </div>
    </header>

    <section>
        <div class="container">
            <div class="sidebar">
                <div class="box"><button class="box-text" @click="changeFilter(0)" :class="{ active: postFilter == 0 }">최근 1주일
                        접수 <br><span class=strong>{{ postsCount?.recentPost }}</span></button> </div>
                <div class="box inProg"><button class="box-text" @click="changeFilter(1)"
                        :class="{ active: postFilter == 1 }">처리 중<br><span class=strong>{{ postsCount?.acting
                        }}</span></button></div>
                <div class="box alert"><button class="box-text" @click="changeFilter(2)"
                        :class="{ active: postFilter == 2 }">긴급 처리 중<br><span class="strong">{{ postsCount?.emergency
                        }}</span></button></div>
            </div>
            <div class="table-wrap">
                <div class="post-table">
                    <ul class="table-head">
                        <li class="col01">NO</li>
                        <li class="col02">등록일시</li>
                        <li class="col03">SR 내용</li>
                        <li class="col04">상태</li>
                        <li class="col05">경과/조치시간</li>
                        <li class="col06">작성자</li>
                        <li class="col07">비고</li>
                    </ul>
                    <div class="table-body" v-if="filteredList?.length">
                        <ol>
                            <Post v-for="(post, i) of filteredList" :key="i" :post="post" :lastRefreshTime="lastRefreshTime"
                                @addMemo="toggleMemoAddModal" />
                        </ol>
                    </div>
                    <div class="table-body" v-else>
                        <p class="no-db">아직 등록된 게시물이 없습니다 ! !</p>
                    </div>
                </div>
            </div>
            <!-- 리팩토링 필요 구간 start-->
            <template v-if="postAddModalVisible">
                <div @click="togglePostAddModal()" class="modal-bg">
                    <PostAddModal @closeModal="togglePostAddModal" />
                </div>
            </template>
            <template v-if="memoAddModalVisible">
                <div @click="toggleMemoAddModal()" class="modal-bg">
                    <MemoAddModal :postSeq="postSeqForMemo" @closeModal="toggleMemoAddModal" />
                </div>
        </template>
        <!-- 구간 end -->
    </div>
</section></template>
