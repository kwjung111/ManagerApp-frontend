<script setup>
import { ref,computed } from 'vue'
import axios from 'axios'
import Cmmn from '../common.js'
import PostMemo from './PostMemo.vue';


//TODO 컴포넌트 바깥에서 v-for 사용하게 리팩토링

const url = Cmmn.url;

const props = defineProps({
    posts: {
        type: Object,
    },
    lastRefreshTime:{
        type:Date
    },
    postFilter:{
        type:Number
    }
})

const emit = defineEmits(['addMemo'])

const addMemo = (seq) =>{
    emit('addMemo',{
        postSeq : seq
    })
}

const posts = computed(() =>{
 return props.posts})

const postFilter = computed(() => {
    return props.postFilter
})

const lastRefreshTime = computed(() =>{
    console.log(props)
return props.lastRefreshTime})

//타이머 구현 start
let curTime 
const elapsedTime = ref(0)

setInterval(()=>{
    curTime = new Date()
    elapsedTime.value = Number(Math.floor((curTime - lastRefreshTime.value)/1000))
},500)


const getElapsedTime = (postTime) => {
    let secSum = Number(Cmmn.convertHmsToSec(postTime)) + Number(elapsedTime.value)
    return Cmmn.convertSecToHms(secSum)
}


 //상태 변환 및 경과시간 업데이트
const toggleState = (seq) => {
    axios.post(`${url}/changePrgState`, {
        postSeq : seq
    }).
    then((res) => {
        console.log(res)
        if(res.data.ok){
            //
        }
        else{
            alert(`다시 시도해 주세요`)
        }
    })

}

const checkPostProgressState = (code) => {
    if (code == 1) {
        return '처리 중'
    }
    else if (code == 0) {
        return '완료'
    }
}

const removePost = (seq) => {
    if (confirm(`NO.${seq} 게시물을 정말로 삭제하시겠습니까?`)) {
        axios.delete(`${url}/posts/${seq}`).then((res) => {
            console.log(res)
            if (res.data.ok) {
                alert('삭제되었습니다!')
            }
            else {
                alert('다시 시도해 주세요')
            }
        })
    }
}

//게시글 필터링
const actingFilter = computed(() => {
    return posts.value.filter((p) => p.BRD_PRGSS_TF == 1)
})
const emergencyFilter = computed(() => {
    return posts.value.filter((p) => p.BRD_PRGSS_TF == 1 && p.BRD_POST_CD == 2)
})

const filteredList = computed(() => {
    if(postFilter.value == 1){
        return actingFilter.value
    }
    else if(postFilter.value == 2){
        return emergencyFilter.value
    }
    else{
        return posts.value
    }
})


</script>

<template>
    <template v-for="(post, i) in filteredList" :key="i">
        <li :class="{emergency: post.BRD_POST_CD == 2}">
            <div class="list-wrap">
                <p class="col01">{{ post.BRD_SEQ }}</p>
                <p class="col02">{{ post.BRD_REG_DTM.slice(0,-3) }}</p>
                <p class="col03 txt-left title">
                    <span class="material-symbols-outlined" v-if="post.BRD_POST_CD == 2">crisis_alert</span> <!--google icon-->
                    {{ post.BRD_CTNTS }}
                </p>
                <p class="status col04" :class="{ active :post.BRD_PRGSS_TF}"  @dblclick="toggleState(post.BRD_SEQ)">{{ checkPostProgressState(post.BRD_PRGSS_TF) }}</p>
                <p class="col05" v-if="post.BRD_PRGSS_TF"> {{ getElapsedTime(post.BRD_ELAPSED_TIME)  }}</p>
                <p class="col05" v-else>{{ post.BRD_ELAPSED_TIME}}</p>
                <p class="col06">{{ post.BRD_WRTR }}</p>
                <div class="col07">
                    <span class="material-symbols-outlined btn-etc btn-addmemo" @click="addMemo(post.BRD_SEQ)" title="코멘트 등록">note_add</span>
                    <span class="material-symbols-outlined btn-etc btn-delete" @click="removePost(post.BRD_SEQ)" title="삭제">delete</span>
                </div>
            </div>
            <PostMemo v-if="post.memos?.length" :memos="post.memos" />
        </li>
    </template>
</template>
