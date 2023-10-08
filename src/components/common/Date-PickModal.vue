<script setup>
import {ref, inject} from 'vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import cmmn from '../../common';

const Cmmn = inject('Cmmn')

const props = defineProps({
    fromDate: {
        type: String,
    },
    toDate:{
        type:String
    }
})


const fromDate = ref(props.fromDate);
const toDate  = ref(props.toDate);

const toastQueue =  []

const emit = defineEmits(['closeModal'],['selectDate'])

const closeModal = () =>{
    Cmmn.removeAllToast(toastQueue)
    emit('closeModal')
}

const selectDate = () =>{
    if(!validation()){
        return
    }

    const fromDateYMD = Cmmn.convertToYMD(fromDate.value)
    const toDateYMD = Cmmn.convertToYMD(toDate.value)

    emit('selectDate',
        { fromDate: fromDateYMD,
          toDate:toDateYMD})
    emit('closeModal')
}

const validation = () =>{
    if(checkfromDate() && 
    checktoDate()){
        return true;
    }else{
        return false;
    }
}

const checkfromDate = () =>{
    if(!fromDate.value){ 
        toastQueue.push(cmmn.toastAlert('시작 날짜를 입력해주세요'))
        return false;
    }
    
    return true;
}

const checktoDate= () =>{
    if(!toDate.value){ 
        toastQueue.push(cmmn.toastAlert('끝 날짜를 입력해주세요'))
        return false;
    }

    if(fromDate.value > toDate.value){
        toastQueue.push(cmmn.toastAlert('날짜를 다시 확인해주세요'))
        return false;
    }
    
    return true; 
}


</script>

<template>
    <div class="modal-overlay">
        <div class="modal" @click.stop=""> <!--이벤트 버블링 방지-->
            <div class="input-wrap">
                <div class="input-group">
                    <VueDatePicker v-model="fromDate" :enable-time-picker="false"></VueDatePicker>
                </div>
                <div class="input-group">
                    <VueDatePicker v-model="toDate" :enable-time-picker="false" ></VueDatePicker>
                    </div>
            </div>
            <div class="modal-btn-wrap">
                <button class="modal-btn btn-common positive" @click="selectDate()">확인</button>
                <button class="modal-btn btn-common" @click="closeModal()">취소</button>
            </div>
        </div>
    </div>
</template>
