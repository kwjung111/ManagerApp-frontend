<script setup>
import {ref, inject} from 'vue'
import cmmn from '../common';

const axios = inject('axios')
const Cmmn = inject('Cmmn')

const url = Cmmn.url;

const postCd = ref(1)
const cntns = ref('')
const inCharge = ref('')


if(localStorage.getItem("ROLE") == "TESTER"){
    inCharge.value = "미담당"
}else {
    inCharge.value = localStorage.getItem("NAME")
}

const toastQueue =  []

const emit = defineEmits(['closeModal'])

const addPost = async () =>{
    if(!validation()) return

    const UID = await Cmmn.getUserIdentifier()

    axios.post(`${url}/posts`,{
        postCd:postCd.value,
        content:cntns.value,
        inCharge:inCharge.value,
        UID:UID
    })
    .then((res) =>{
        if(res.data.ok==true){
            cmmn.toastSuccess('등록 완료!')
            Cmmn.saveNotificationInfo('posts',res.data.result.postSeq)
        }
        else{
            cmmn.toastError('실패했습니다. 접속 상태를 확인해 주세요')
        }
        console.log(res)

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


</script>

<template>
    <div class="modal-overlay">
        <div class="modal" @click.stop=""> <!--이벤트 버블링 방지-->
            <div class="input-wrap">
                <div class="input-group">
                    <span class="input-label"> 긴급여부 </span>
                    <label class="label-radio">
                        <input type="radio" name="postCd" value="1" v-model="postCd">
                        <span > 일반</span>
                    </label>
                    <label class="label-radio">
                        <input type="radio" name="postCd" value="2" v-model="postCd">
                        <span > 긴급</span>
                    </label>
                </div>
                <div class="input-group">
                    <span class="input-label"> 담당자 </span>
                    <label class="label-text">
                        <textarea maxlength="8" v-model="inCharge"></textarea>
                        <span> {{ inCharge?.length || 0 }}/8 자</span>
                    </label>
                </div>
                <div class="input-group">
                    <span class="input-label"> 내용 </span>
                    <label class="label-text">
                        <textarea maxlength="50" v-model="cntns"></textarea>
                        <span> {{ cntns.length }}/50 자</span>
                    </label>
                </div>
                
            </div>
            <div class="modal-btn-wrap">
                <button class="modal-btn btn-common positive" @click="addPost()">등록하기</button>
                <button class="modal-btn btn-common" @click="closeModal()">닫기</button>
            </div>
        </div>
    </div>
</template>
