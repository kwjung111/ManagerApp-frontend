<script setup>
import {inject,ref,computed} from 'vue'

const axios = inject('axios')
const cmmn = inject('Cmmn')

const url = cmmn.url;
const wrtrCookieKey = 'writerName';

const props = defineProps({
    postSeq: {
        type: Number
    }
})

const postSeq = computed(() => {
    return props.postSeq
})
const cntns = ref('')
const wrtr = ref('')

const toastQueue =  []

const emit = defineEmits(['closeModal'])

const addMemo = async () =>{
    if(!validation()) return

    const UID = await cmmn.getUserIdentifier();

    axios.post(`${url}/memos`,{
        postSeq:postSeq.value,
        content:cntns.value,
        writer:wrtr.value,
        UID:UID,
    })
    .then((res) =>{
        if(res.data.ok == true){
            cmmn.toastSuccess('등록 완료!')
            cmmn.saveNotificationInfo('posts',res.data.result.postSeq)
        }else{
            cmmn.toastError('등록 실패')
        }
        cmmn.setCookie(wrtrCookieKey,wrtr.value)
        closeModal()
    })


}

const closeModal = () =>{
    cmmn.removeAllToast(toastQueue)
    emit('closeModal')
}

const validation = () =>{
    if(checkcntns()){
        return true;
    }
}

const checkcntns = () =>{
    if(cntns.value )return true;
    toastQueue.push(cmmn.toastAlert('내용을 입력해주세요'))
    return false;   
}

cmmn.applyCookieVal(wrtrCookieKey,wrtr)

</script>

<template>
    <div class="modal-overlay">
        <div class="modal" @click.stop=""> <!--이벤트 버블링 방지-->
           <div class="input-wrap">
                <div class="input-group">
                    <span class="input-label"> 내용 </span>
                    <label class="label-text">
                        <textarea maxlength="100" v-model="cntns"></textarea>
                        <span> {{ cntns.length }}/100 자</span>
                    </label>
                </div>
            </div>
            <div class="modal-btn-wrap">
                <button class="modal-btn btn-common positive" @click="addMemo()">등록하기</button>
                <button class="modal-btn btn-common" @click="closeModal()">닫기</button>
            </div>
        </div>
    </div>
</template>
