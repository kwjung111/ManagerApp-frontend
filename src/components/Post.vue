<script setup>
import { ref,computed } from 'vue'
import axios from 'axios'
import cmmn from '../common.js'
import PostMemo from './PostMemo.vue';

const url = 'http://localhost:3000';

const props = defineProps({
    posts: {
        type: Object,
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


 //상태 변환 및 경과시간 업데이트
const toggleState = (seq) => {
    axios.post(`${url}/changePrgState`, {
        postSeq : seq
    }).
    then((res) => {
        console.log(res)
        if(res.data.ok){
            alert('게시물 상태가 변경되었습니다')
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
        axios.post(`${url}/remove`, {
            postSeq: seq
        }).then((res) => {
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
</script>

<template>
    <template v-for="post in posts">
        <tr :class="{emergency: post.BRD_POST_CD == 2}">
            <td>{{ post.BRD_SEQ }}</td>
            <td>{{ post.BRD_REG_DTM }}</td>
            <td colspan="3" style="text-align:left">
                <span class="material-symbols-outlined" v-if="post.BRD_POST_CD == 2">crisis_alert</span> <!--google icon-->
                {{ post.BRD_CTNTS }}
            </td>
            <td @click="toggleState(post.BRD_SEQ)">{{ checkPostProgressState(post.BRD_PRGSS_TF) }}</td>
            <td >{{ post.BRD_ELAPSED_TIME }}</td>
            <td>{{ post.BRD_WRTR }}</td>
            <td>
              <span class="material-symbols-outlined" @click="addMemo(post.BRD_SEQ)">note_add</span>
              <span class="material-symbols-outlined" @click="removePost(post.BRD_SEQ)">delete</span>
            </td>
        </tr>
        <PostMemo v-if="post.memos.length" :memos="post.memos" />
    </template>
</template>
