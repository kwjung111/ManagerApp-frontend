<script setup>
import {ref} from 'vue'
import PostMemo from './PostMemo.vue';

const props = defineProps({
    posts : {
        type : Object,
    }
})

const posts = ref(props.posts)

console.log(posts.value)
</script>

<template>
    <template v-for="post in posts">
    <tr>
        <td>{{post.BRD_SEQ}}</td>
        <td>{{post.BRD_REG_DTM}}</td>
        <td>{{post.BRD_CTNTS}}</td>
        <td>{{post.BRD_PRGSS_TF}}</td>
        <td v-if="post.BRD_ACT_TOT_TIME != null">{{post.BRD_ACT_TOT_TIME}}</td>
        <td v-else>대기중</td>
        <td>{{post.BRD_WRTR}}</td>
        <td>
            <span class="icon">&#x2605;</span>
            <span class="icon">&#x2665;</span>
        </td>
    </tr> 
    <PostMemo v-if="post.memos.length" :memos="post.memos"/>
    </template>
</template>
