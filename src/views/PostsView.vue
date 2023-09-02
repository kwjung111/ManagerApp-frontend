
<script setup>
import axios from 'axios';
import Post from '../components/Post.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'

const url = 'http://localhost:3000';
const wsUrl = 'ws://localhost:3000';

const curDt = ref(new Date())

const timer = setInterval(() => {
    curDt.value = new Date()
}, 500)

const posts = ref(null)

onMounted(async () =>
    axios.all([axios.get(`${url}/posts`),
    axios.get(`${url}/memos`),
    ])
        .then((resArr) => {
            const postsData = resArr[0].data.result
            const memosData = resArr[1].data.result
            posts.value = makeTree(postsData,memosData)
        })

)

//post 와 memo를 합쳐서 post 안으로 밀어넣음
function makeTree(posts, memos) {
    return posts.reduce((acc, cur) => {
        let curPost = deepCopy(cur)
        const matchingMemos = memos.filter((memo) => { return memo.BRD_SEQ == cur.BRD_SEQ })
        curPost.memos = matchingMemos
        acc.push(curPost)
        return acc
    }, [])
}

//깊.복
function deepCopy(obj) {
    var clone = {};
    for (var key in obj) {
        if (typeof obj[key] == "object" && obj[key] != null) {
            clone[key] = cloneObject(obj[key]);
        } else {
            clone[key] = obj[key];
        }
    }

    return clone;
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
                <button> add </button>
            </div>
        </div>
    </header>

    <body>
        <div class="container">
            <div class="boxes">
                <div class="box"></div>
                <div class="box-inProg"></div>
                <div class="box-alert"></div>
            </div>
            <table class="post-table">
                <thead>
                    <tr>
                        <th>NO</th>
                        <th>등록일시</th>
                        <th>SR 내용</th>
                        <th>상태</th>
                        <th>경과/조치시간</th>
                        <th>작성자</th>
                        <th>비고</th>
                    </tr>
                </thead>
                <tbody>
                    <Post v-if="posts" :posts="posts" />
                </tbody>
            </table>
        </div>
    </body>
</template>
