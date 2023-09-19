<script setup>
import { ref,computed, inject } from 'vue'
import PostMemo from './PostMemo.vue'
import PostPatch from './Post-PatchModal.vue'


const axios = inject('axios')
const Cmmn = inject('Cmmn')

const url = Cmmn.url;

const pagePath = '/srList'        

const props = defineProps({
    post: {
        type: Object,
    },
    lastRefreshTime:{
        type:Date
    },
})

const emit = defineEmits(['addMemo'])

const addMemo = (seq) =>{
    emit('addMemo',{
        postSeq : seq
    })
}

/*
const patchPost = (seq) =>{
    emit('patchPost',{
        postSeq : seq
    })

}
*/

const post = computed(() =>{
 return props.post})



const lastRefreshTime = computed(() =>{
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
const toggleState = async (seq) => {

    const UID = await Cmmn.getUserIdentifier();
    
    axios.patch(`${url}/posts/prgState`, {
        postSeq:seq,
        UID:UID
    }).
    then((res) => {
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
const postPatchModalVisible = ref(false)
function togglePostPatchModal() {
    postPatchModalVisible.value = !postPatchModalVisible.value;
}


</script>

<template>
        <li :class="{emergency: post.BRD_POST_CD == 2}">
            <router-link :to="{ path:pagePath, hash:`#${post.BRD_SEQ}`}"></router-link> <!-- anchor 이동을 위해 삽입-->
            <div class="list-wrap" :id="post.BRD_SEQ" tabindex="-1">    <!--anchor 이동을 위한 id, tabindex-->
                <p class="col01">{{ post.BRD_SEQ }}</p>
                <p class="col02">{{ post.BRD_REG_DTM.slice(0,-3) }}</p>
                <p class="col03 txt-left title">
                    <span class="material-symbols-outlined" v-if="post.BRD_POST_CD == 2">crisis_alert</span> <!--google icon-->
                    {{ post.BRD_CTNTS }}
                </p>
                <p class="status col04" :class="{ active :post.BRD_PRGSS_TF}" @click="togglePostPatchModal()" @dblclick="patchPost(post.BRD_SEQ)">{{ checkPostProgressState(post.BRD_PRGSS_TF) }}</p>
                <!--<p class="status col04" :class="{ active :post.BRD_PRGSS_TF}" @dblclick="toggleState(post.BRD_SEQ)">{{ checkPostProgressState(post.BRD_PRGSS_TF) }}</p>-->
                <p class="col05" v-if="post.BRD_PRGSS_TF"> {{ getElapsedTime(post.BRD_ELAPSED_TIME)  }}</p>
                <p class="col05" v-else>{{ post.BRD_ELAPSED_TIME}}</p>
                <p class="col06">{{ post.BRD_WRTR }}</p>
                <div class="col07">
                    <span class="material-symbols-outlined btn-etc btn-addmemo" @click="addMemo(post.BRD_SEQ)" title="코멘트 등록">note_add</span>
                    <span class="material-symbols-outlined btn-etc btn-delete" @click="removePost(post.BRD_SEQ)" title="삭제">delete</span>
                </div>
            </div>
            <PostMemo v-if="post.memos?.length" :memos="post.memos" />
            <template v-if="postPatchModalVisible">
                <div @click="togglePostPatchModal()" class="modal-bg">
                    <PostPatch @closeModal="togglePostPatchModal" />
                </div>
            </template>
        </li>
</template>
