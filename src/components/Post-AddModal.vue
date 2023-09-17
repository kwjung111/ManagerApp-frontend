<script setup>
import {ref, inject} from 'vue'
import cmmn from '../common';

const axios = inject('axios')
const Cmmn = inject('Cmmn')

const url = Cmmn.url;
const wrtrCookieKey = 'writerName';

const postCd = ref(1)
const cntns = ref('')
const wrtr = ref('')

const emit = defineEmits(['closeModal'])


const addPost = async () =>{
    console.log(postCd.value, cntns.value, wrtr.value)
    if(!validation()) return

    const UID = await cmmn.getUserIdentifier()

    axios.post(`${url}/posts`,{
        postCd:postCd.value,
        content:cntns.value,
        writer:wrtr.value,
        UID:UID
    })
    .then((res) =>{
        if(res.data.ok==true){
            alert('등록 완료!')
        }
        else{
            alert('실패했습니다. 접속 상태를 확인해 주세요')
        }

        //작성자 쿠키 저장
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
                    <span class="input-label"> 입력값 </span>
                    <label class="label-radio">
                        <input type="radio" name="radio-group" value="1" v-model="postCd">
                        <span > 일반</span>
                    </label>
                    <label class="label-radio">
                        <input type="radio" name="radio-group" value="2" v-model="postCd">
                        <span > 긴급</span>
                    </label>
                </div>
                <div class="input-group">
                    <span class="input-label"> 내용 </span>
                    <label class="label-text">
                        <textarea maxlength="50" v-model="cntns"></textarea>
                        <span> {{ cntns.length }}/50 자</span>
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
                <button class="modal-btn btn-common" @click="addPost()">등록하기</button>
                <button class="modal-btn btn-common" @click="closeModal()">닫기</button>
            </div>
        </div>
    </div>
</template>
