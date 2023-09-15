<script setup>
import {ref,computed} from 'vue'
import axios from 'axios'
import Cmmn from '../common.js'

const url = Cmmn.url;
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

const emit = defineEmits(['closeModal'])

const addMemo = () =>{
    console.log(cntns.value, wrtr.value)
    if(!validation()) return
    axios.post(`${url}/memos`,{
        postSeq:postSeq.value,
        content:cntns.value,
        writer:wrtr.value,
    })
    .then((res) =>{
        console.log(res)
        if(res.data.ok == true){
        alert('등록 완료!')
        }else{
            alert('등록 실패')
        }
        Cmmn.setCookie(wrtrCookieKey,wrtr.value)
        closeModal()
    })


}

const closeModal = () =>{
    emit('closeModal')
}

const validation = () =>{
    if(checkcntns() && 
    checkWrtr()){
        return true;
    }
}

const checkWrtr = () =>{
    if(wrtr.value) return true;
    alert('작성자를 입력해주세요')
    return false;
}

const checkcntns = () =>{
    if(cntns.value )return true;
    alert('내용을 입력해주세요')
    return false;   
}

Cmmn.applyCookieVal(wrtrCookieKey,wrtr)

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
         <div class="input-group">
             <span class="input-label" > 작성자 </span>
            <label class="label-text">
                <input type="text" maxlength="5" size="40" v-model="wrtr"/>
            </label>
        </div>
    </div>
        <div class="modal-btn-wrap">
        <button class="modal-btn btn-common" @click="addMemo()">등록하기</button>
        <button class="modal-btn btn-common" @click="closeModal()">닫기</button>
        </div>
        </div>
    </div>
</template>
