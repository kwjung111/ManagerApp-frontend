<script setup>
import {ref, inject} from 'vue'

const axios = inject('axios')
const Cmmn = inject('Cmmn')

const url = Cmmn.url;

const scheduleCd = ref(1)
const cntnts = ref('')
const fromDt = ref('')
const toDt = ref('')

const toastQueue =  []

const emit = defineEmits(['closeModal'])

const setUserSchedule = async () =>{
    if(!validation()) return

    axios.post(`${url}/setUserSchedule`,{

    })
    .then((res) =>{
        if(res.data.ok==true){
            Cmmn.toastSuccess('등록 완료!')
            Cmmn.saveNotificationInfo('posts',res.data.result.postSeq)
        }
        else{
            Cmmn.toastError('실패했습니다. 접속 상태를 확인해 주세요')
        }

    })
}

const closeModal = () =>{
    Cmmn.removeAllToast(toastQueue)
    emit('closeModal')
}

const validation = () =>{
    if(checkcntns()){
        return true;
    }
}

const checkcntns = () =>{
    if(cntnts.value )return true;
    toastQueue.push(Cmmn.toastAlert('내용을 입력해주세요'))
    return false;   
}

</script>

<template>
    <div class="modal-overlay">
        <div class="modal" @click.stop=""> <!--이벤트 버블링 방지-->
            <div class="input-wrap">
                <div class="input-group">
                    <span class="input-label"> 입력값 </span>
                    <label class="label-radio">
                        <input type="radio" name="postCd" value="1" v-model="scheduleCd">
                        <span > 당일</span>
                    </label>
                    <label class="label-radio">
                        <input type="radio" name="postCd" value="2" v-model="scheduleCd">
                        <span > 일자 선택</span>
                    </label>
                </div>
                <div class="input-group">
                    <span class="input-label"> 내용 </span>
                    <label class="label-text">
                        <textarea maxlength="50" v-model="cntnts"></textarea>
                        <span> {{ cntnts.length }}/50 자</span>
                    </label>
                </div>
            </div>
            <div class="modal-btn-wrap">
                <button class="modal-btn btn-common positive" @click="setUserSchedule()">등록하기</button>
                <button class="modal-btn btn-common" @click="closeModal()">닫기</button>
            </div>
        </div>
    </div>
</template>
