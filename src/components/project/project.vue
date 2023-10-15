<script setup>
import { ref,computed, inject } from 'vue'

const axios = inject('axios')
const Cmmn = inject('Cmmn')

const url = Cmmn.url;

//modifyOnly -> 삭제 불가, 수정만 가능
const props = defineProps({
    project: {
        type: Object,
    },
    modifyOnly:{
        type:Boolean
    }
})

const emit = defineEmits(['doRefresh'])

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

const prjPrgText = (code) => {
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
        <li>
            <!--<router-link :to="{ path:pagePath, hash:`#${post.BRD_SEQ}`}"></router-link> --><!-- anchor 이동을 위해 삽입-->
            <div class="list-wrap" :id="project.PRJ_SEQ" tabindex="-1">    <!--anchor 이동을 위한 id, tabindex-->
                <p class="col01">{{ project.PRJ_NO }}</p>
                <p class="col02">{{ project.PRJ_REG_DTM.slice(5,-3) }}</p>
                <p class="col03 txt-left title">
                    <span class="material-symbols-outlined"></span>
                    {{ project.PRJ_CNTNTS }}
                </p>
                <div class="status col04" :class="getTimerClass(project.PRJ_PRGSS_CD)" @click="togglePostPatchModal()">
                    <span>{{ prjPrgText(project.PRJ_PRGSS_CD) }}</span>   <!--상태 텍스트-->
                    <!--  대기중 사유 레이어
                    <div v-if="post.BRD_PRGSS_TF == 2" class="pending-pop">  
                        <p>{{post.BRD_RSN_PNDNG}}</p>
                    </div>
                    -->
                </div>
                <!--<p class="status col04" :class="{ active :post.BRD_PRGSS_TF}" @dblclick="toggleState(post.BRD_SEQ)">{{ postprgText(post.BRD_PRGSS_TF) }}</p>-->
                <p class="col05"> 진척률 </p>
                <p class="col06">{{ project.PRJ_IN_CHRG  }}</p> 
                <div class="col07">
                    <!--
                    <span v-if="!modifyOnly" class="btn-etc btn-addmemo" @click="addMemo(post.BRD_SEQ)" title="코멘트 등록"><i class="fa-solid fa-comment-medical"></i></span>
                    <span v-if="!modifyOnly" class="btn-etc btn-delete" @click="removePost(post.BRD_SEQ,post.BRD_NO)" title="삭제"><i class="fa-regular fa-trash-can"></i></span>
                    -->
                </div>
            </div>
            <!--
            <template v-if="postPatchModalVisible">
                <div class="modal-bg">
                    <PostPatch @closeModal="togglePostPatchModal" @postPatched="doRefresh" :postSeq="post.BRD_SEQ" />
                </div>
            </template>
        -->
        </li>
</template>

<style>
</style>
