<script setup>
import Post from '../../components/Post.vue'
import PostAddModal from '../../components/Post-AddModal.vue'
import MemoAddModal from '../../components/Memo-AddModal.vue'
import HamburgerBtn from '../../components/common/Hamburger-btn.vue'
import { ref, onMounted, onUnmounted, computed, inject } from 'vue'
import eventMapper from '../../eventHandler';

const axios = inject('axios')
const Cmmn = inject('Cmmn')

const url = Cmmn.url;
const wsUrl = Cmmn.wsUrl;
let ws = null;                                   //웹소켓 객체
let reConnect = true;                            //웹소켓 재접속 여부

const curDt = ref(Cmmn.getNowYMD())
const isActive = ref(false)

//현재 시각 타이머
const timer = setInterval(() => {
    curDt.value = Cmmn.getNowYMD()
}, 500)

const initialCnt = {                              //게시물 박스 카운트 초기화
    recentPost: 0,
    acting: 0,
    pending: 0,
    emergency: 0,
}

const posts = ref(null)
const notFinPosts = ref(null)                     //미처리 게시물들
const postsCount = ref(initialCnt)
const postSeqForMemo = ref(null)                  //메모를 삽입할 게시물번호
const postAddModalVisible = ref(false)
const memoAddModalVisible = ref(false)
const lastRefreshTime = ref(new Date())           //타이머 구현을 위해 마지막 refresh 시간을 받음
const postFilter = ref(0)                         //0 최근 1주일 접수, 1 처리중, 2 긴급 , 3 처리대기중

let connectState = true;



onMounted(() => {
    ws = connectWs() //웹소켓 연결시 리프레시 수행
})

const refresh = async () => {
    lastRefreshTime.value = new Date()
    axios.all([
        axios.get(`${url}/posts/tree`),     //게시물
        axios.get(`${url}/posts/Count`),    //게시물수
        axios.get(`${url}/posts/notFin`)    //미처리 게시물 
    ])
        .then((resArr) => {
            const postsData = resArr[0].data.result
            const postsCountData = resArr[1].data.result[0]
            const notFinPostsData = resArr[2].data.result

            posts.value = [...postsData,...notFinPostsData]// 1주일내 + 미처리
            postsCount.value = postsCountData
            notFinPosts.value = notFinPostsData


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

            refresh();
            eventMapper(evtData)
        }
    }


    ws.onclose = async (e) => {
        if (connectState == true) {
            console.log('서버와의 연결이 종료되었습니다.')
            connectState = false;
        }
        if (reConnect == true) {
            setTimeout(() => {
                console.log('reconnecting to server...')
                connectWs();
            }, 1000)
        }
    }
    return ws
};

onUnmounted(() => {
    reConnect = false;
    if(ws){
        ws.close();
    }
})


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
const pendingFilter = (() => {
    return posts.value.filter((p) => p.BRD_PRGSS_TF == 2)
})

const filteredList = computed(() => {
    if (postFilter.value == 1) {
        return actingFilter()
    }
    else if (postFilter.value == 2) {
        return emergencyFilter()
    }
    else if (postFilter.value == 3) {
        return pendingFilter()
    }
    else {
        return posts.value
    }
})


</script>

<template>
    <header>
        <div class="header-container">
            <div class="header-title">
                <h1> SR LIST </h1>
                <h2 v-if="postFilter == 0">전체</h2>
                <h2 v-if="postFilter == 1">처리 중</h2>
                <h2 v-if="postFilter == 2">긴급 처리 중</h2>
                <h2 v-if="postFilter == 3">처리 대기 중</h2>
            </div>
            <div class="header-date">
                <p>{{ curDt }}</p>
            </div>
            <HamburgerBtn></HamburgerBtn>
        </div>
        <div class="btn-post-wrap">
            <button class="btn-post btn-common positive" @click="togglePostAddModal()" title="신규 SR 등록">
                <i class="fa-pen-to-square"></i>
            </button>
        </div>
    </header>

    <section>
        <div class="container">
            <div class="sidebar">
                <div class="box"><button class="box-text" @click="changeFilter(0)" :class="{ active: postFilter == 0 }">최근
                        1주일
                        접수<span class=strong>{{ postsCount?.recentPost }}</span></button> </div>
                <div class="box inProg"><button class="box-text" @click="changeFilter(1)"
                        :class="{ active: postFilter == 1 }">처리 중<span class=strong>{{ postsCount?.acting
                        }}</span></button></div>
                <div class="box delay"><button class="box-text" @click="changeFilter(3)"
                        :class="{ active: postFilter == 3 }">처리 대기 중<span class="strong">{{ postsCount?.pending
                        }}</span></button></div>
                <div class="box alert"><button class="box-text" @click="changeFilter(2)"
                        :class="{ active: postFilter == 2 }">긴급 처리 중<span class="strong">{{ postsCount?.emergency
                        }}</span></button></div>
                        <p> 1주일 내 미완료 <br>{{ notFinPosts?.length }}건</p>
            </div>
            <div class="table-wrap">
                <div class="post-table">
                    <ul class="table-head">
                        <li class="col01">NO</li>
                        <li class="col02">등록일시</li>
                        <li class="col03">SR 내용</li>
                        <li class="col04">상태</li>
                        <li class="col05">경과/조치시간</li>
                        <li class="col06">담당자</li>
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
                <div class="modal-bg">
                    <PostAddModal @closeModal="togglePostAddModal" />
                </div>
            </template>
            <template v-if="memoAddModalVisible">
                <div class="modal-bg">
                    <MemoAddModal :postSeq="postSeqForMemo" @closeModal="toggleMemoAddModal" />
                </div>
            </template>
            <!-- 구간 end -->
        </div>
    </section>
</template>
