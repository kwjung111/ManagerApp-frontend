<script setup>
import { ref,computed, inject } from 'vue'
import PostMemo from './PostMemo.vue'
import PostPatch from './Post-PatchModal.vue'


const axios = inject('axios')
const Cmmn = inject('Cmmn')

const url = Cmmn.url;

const pagePath = '/srList'        

//modifyOnly -> 삭제 불가, 수정만 가능
const props = defineProps({
    post: {
        type: Object,
    },
    lastRefreshTime:{
        type:Date
    },
    modifyOnly:{
        type:Boolean
    }
})

const emit = defineEmits(['addMemo', 'doRefresh'])

const addMemo = (seq) =>{
    emit('addMemo',{
        postSeq : seq
    })
}

const modifyOnly = props.modifyOnly || false;

const post = computed(() =>{
 return props.post})


//타이머 구현 start
let curTime 
const elapsedTime = ref(0)

setInterval(()=>{
    curTime = new Date()
    elapsedTime.value = Number(Math.floor((curTime - props.lastRefreshTime)/1000))
},500)


const getElapsedTime = (postTime) => {
    let secSum = Number(Cmmn.convertHmsToSec(postTime)) + Number(elapsedTime.value)
    return Cmmn.convertSecToHms(secSum)
}

const getTimerClass = (code) => {      //상태 클래스 부여
    if(code == 1){
        return 'active'
    }
    else if(code == 2){
        return 'pending'
    }
    else if(code == 0 ){
        return ''
    }
}

const getShouldTimerMove = (code) =>{
    if(code == 1){
        return true
    }
    if(code == 0 || code == 2){     //완료, 대기중
        return false
    }
}

const postprgText = (code) => {
    if (code == 1) {
        return '처리 중'
    }
    else if (code == 0) {
        return '완료'
    }
    else if(code == 2){
        return '대기 중'
    }
}

const removePost = (seq,no) => {
    Cmmn.confirm(`NO.${no} 게시물을 정말로 삭제하시겠습니까?`,
    () => {
        axios.delete(`${url}/posts/${seq}`).then((res) => {
            console.log(res)
            if (res.data.ok) {
                Cmmn.toastSuccess('삭제되었습니다!')
            }
            else {
                Cmmn.toastError('다시 시도해 주세요')
            }
        })
    })
}
const postPatchModalVisible = ref(false)
function togglePostPatchModal() {
    postPatchModalVisible.value = !postPatchModalVisible.value;
}

const doRefresh = () => {
    emit('doRefresh')
}

</script>

<template>
        <li :class="{emergency: post.BRD_POST_CD == 2}">
            <!--<router-link :to="{ path:pagePath, hash:`#${post.BRD_SEQ}`}"></router-link> --><!-- anchor 이동을 위해 삽입-->
            <div class="list-wrap" :id="post.BRD_SEQ" tabindex="-1">    <!--anchor 이동을 위한 id, tabindex-->
                <p class="col01">{{ post.BRD_NO }}</p>
                <p class="col02">{{ post.BRD_REG_DTM.slice(5,-3) }}</p>
                <p class="col03 txt-left title">
                    <span class="material-symbols-outlined" v-if="post.BRD_POST_CD == 2">crisis_alert</span> <!--google icon-->
                    {{ post.BRD_CTNTS }}
                </p>
                <div class="status col04" :class="getTimerClass(post.BRD_PRGSS_TF)" @click="togglePostPatchModal()">
                    <span>{{ postprgText(post.BRD_PRGSS_TF) }}</span>   <!--상태 텍스트-->
                    <div v-if="post.BRD_PRGSS_TF == 2" class="pending-pop">   <!--대기중 사유 레이어-->
                        <p>{{post.BRD_RSN_PNDNG}}</p>
                    </div>
                </div>
                <!--<p class="status col04" :class="{ active :post.BRD_PRGSS_TF}" @dblclick="toggleState(post.BRD_SEQ)">{{ postprgText(post.BRD_PRGSS_TF) }}</p>-->
                <p class="col05" v-if="getShouldTimerMove(post.BRD_PRGSS_TF)"> {{ getElapsedTime(post.BRD_ELAPSED_TIME)  }}</p>
                <p class="col05" v-else>{{ post.BRD_ELAPSED_TIME}}</p>
                <p class="col06">{{ post.BRD_IN_CHRG || post.WRTR_NM  }}</p> 
                <div class="col07">
                    <span v-if="!modifyOnly" class="btn-etc btn-addmemo" @click="addMemo(post.BRD_SEQ)" title="코멘트 등록"><i class="fa-solid fa-comment-medical"></i></span>
                    <span v-if="!modifyOnly" class="btn-etc btn-delete" @click="removePost(post.BRD_SEQ,post.BRD_NO)" title="삭제"><i class="fa-regular fa-trash-can"></i></span>
                </div>
            </div>
            <PostMemo v-if="post.memos?.length" :memos="post.memos"  :readOnly="modifyOnly"/>
            <template v-if="postPatchModalVisible">
                <div class="modal-bg">
                    <PostPatch @closeModal="togglePostPatchModal" @postPatched="doRefresh" :postSeq="post.BRD_SEQ" />
                </div>
            </template>
        </li>
</template>

<style>
</style>
