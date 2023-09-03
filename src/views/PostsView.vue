
<script setup>
import axios from 'axios';
import Post from '../components/Post.vue'
import PostAddModal from '../components/PostAddModal.vue'
import cmmn from '../common.js'
import MemoAddModal from '../components/MemoAddModal.vue'
import { ref, onMounted } from 'vue'

const url = 'http://localhost:3000';
const wsUrl = 'ws://localhost:3000';

const curDt = ref(new Date())

const timer = setInterval(() => {
    curDt.value = new Date()
}, 500)


const posts = ref(null)
const postsCount = ref(null)
const postSeqForMemo = ref(null)           //메모를 삽입할 게시물번호
const postAddModalVisible = ref(false)
const memoAddModalVisible = ref(false)

let connectState = true;

onMounted(() => {
    connectWs() //웹소켓 연결시 리프레시 수행
})

const refresh = async () => {
    axios.all([
        axios.get(`${url}/posts`),          //게시물
        axios.get(`${url}/memos`),          //댓글
        axios.get(`${url}/postsCount`),    //게시물수
    ])
        .then((resArr) => {
            const postsData = resArr[0].data.result
            const memosData = resArr[1].data.result
            const postsCountData = resArr[2].data.result[0]

            posts.value = makeTree(postsData, memosData)
            postsCount.value = postsCountData
        })

}



//post 와 memo를 합쳐서 post 안으로 밀어넣음
function makeTree(posts, memos) {
    return posts.reduce((acc, cur) => {
        let curPost = cmmn.deepCopy(cur)
        const matchingMemos = memos.filter((memo) => { return memo.BRD_SEQ == cur.BRD_SEQ })
        curPost.memos = matchingMemos
        acc.push(curPost)
        return acc
    }, [])
}


/*
const Timer = setInterval(() =>{
    updatePostsTime()
},1000)
*/   

//정확한 실행을 보장하지 않기 떄문에 서버와 동기화 필요.
//date 객체 생성, 현재를 0으로 하고 date 객체와 동기화 하는 식으로..?
//이렇게 갱신하게 되면 메모가 없어지게 된다.
function updatePostsTime(){
    posts.value = posts.value.reduce((acc,cur) => {
        let curPost = cmmn.deepCopy(cur)
        if(curPost.BRD_PRGSS_TF == true){
            let arrTime = curPost.BRD_ELAPSED_TIME.split(':')
            let hr = Number(arrTime[0])
            let min = Number(arrTime[1])
            let sec =  Number(arrTime[2])
            let sTot = Number(hr*3600 + min*60 +sec)

            sTot++
            
            curPost.BRD_ELAPSED_TIME = cmmn.formatSecondsAsTime(sTot)
        }
        acc.push(curPost)
        return acc
    },[])
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
        if (data.type == "message") {
            let msgData = data.data
            console.log("server message :", msgData.content);
        }
        else if (data.type == "event") {
            let evtData = data.data
            console.log("server event : ", evtData.event)

            //어떤 이벤트인지 보고 리프레시
            refresh();
        }
    };

    ws.onclose = async (e) => {
        if(connectState == true){
            alert('서버와의 연결이 종료되었습니다.')
            connectState = false;
        }
        setTimeout(() => {
        console.log('reconnecting to server...')
        connectWs();
    },1000)}

}

function togglePostAddModal() {
    postAddModalVisible.value = !postAddModalVisible.value;
}

function toggleMemoAddModal(data=null){
    postSeqForMemo.value = data?.postSeq
    memoAddModalVisible.value = !memoAddModalVisible.value
}



</script>

<template>
    <header>
        <div class="header-container">
            <div class="item">
                <p> SR LIST </p>
            </div>
            <div class="item">
                <p>{{ curDt }}</p>
            </div>
            <div class="item">
                <button @click="togglePostAddModal()">
                    <span class="material-symbols-outlined">
                        add_box
                    </span>
                </button>
            </div>
        </div>
    </header>

    <body>
        <div class="container">
            <div class="boxes">
                <div class="box"><span class="box-text">최근 1주일 접수 <br><span class=strong>{{ postsCount?.recentPost }}
                        </span></span> </div>
                <div class="box inProg"><span class="box-text">처리 중<br><span class=strong>{{ postsCount?.acting
                }}</span></span></div>
                <div class="box alert"><span class="box-text">긴급 처리 중<br><span class="strong">{{ postsCount?.emergency
                }}</span></span></div>
            </div>
            <table class="post-table">
                <thead>
                    <tr>
                        <th>NO</th>
                        <th>등록일시</th>
                        <th colspan="3">SR 내용</th>
                        <th>상태</th>
                        <th>경과/조치시간</th>
                        <th>작성자</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody v-if="posts?.length">
                    <Post v-if="posts" :posts="posts" @addMemo="toggleMemoAddModal"/>
                </tbody>
                <tbody v-else>
                    <p> 아직 등록된 게시물이 없습니다!</p>
                </tbody>
            </table>
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
    </body>
</template>
