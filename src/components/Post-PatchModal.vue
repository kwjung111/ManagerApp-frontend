<script setup>
import {ref,onMounted} from 'vue'
import axios from 'axios'
import Cmmn from '../common.js'
import UxSelect from 'ux-select'

const url = Cmmn.url;
const wrtrCookieKey = 'writerName';

const postCd = ref(1)
const cntns = ref('')
const wrtr = ref('')

const postStatus = ref(1)
const postCate = ref(1)
const postAfter = ref(1)

const emit = defineEmits(['closeModal'])


const addPost = () =>{
    console.log(postCd.value, cntns.value, wrtr.value)
    if(!validation()) return
    axios.post(`${url}/posts`,{
        postCd:postCd.value,
        content:cntns.value,
        writer:wrtr.value,
    })
    .then((res) =>{
        if(res.data.ok==true){
        console.log(res.data.ok)
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


//ux-select Code



//const myUxSelect = 


/*
onMounted(() =>{
    const selectBoxElm = document.getElementById("selectSys")
new UxSelect(selectBoxElm,{
    placeholder : "시스템 구분",
});
})
*/

Cmmn.applyCookieVal(wrtrCookieKey,wrtr)

</script>

<template>
    <div class="modal-overlay">
        <div class="modal" @click.stop=""> <!--이벤트 버블링 방지-->
            <div class="input-wrap">
                <div class="input-group">
                    <span class="input-label"> 긴급여부 </span>
                    <label class="label-radio">
                        <input type="radio" name="postCd" value="1" v-model="postCd">
                        <span>일반</span>
                    </label>
                    <label class="label-radio">
                        <input type="radio" name="postCd" value="2" v-model="postCd">
                        <span>긴급</span>
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
                    <span class="input-label"> 작성자 </span>
                    <label class="label-text">
                        <input type="text" maxlength="5" size="40" v-model="wrtr"/>
                    </label>
                </div>
                <div class="input-group input-status">
                    <span class="input-label"> 상태 </span>
                    <label class="label-radio">
                        <input type="radio" name="postStatus" value="1" v-model="postStatus">
                        <span>처리 중</span>
                    </label>
                    <label class="label-radio">
                        <input type="radio" name="postStatus" value="2" v-model="postStatus">
                        <span>처리 대기 중</span>
                    </label>
                    <label class="label-radio">
                        <input type="radio" name="postStatus" value="3" v-model="postStatus">
                        <span>완료</span>
                    </label>
                </div>
                <div class="input-group">
                    <span class="input-label"> 대기사유 </span>
                    <label class="label-text">
                        <textarea maxlength="50" :disabled="postStatus != 2"></textarea>
                        <span> {{ cntns.length }}/50 자</span>
                    </label>
                </div>
                <div class="input-clear" :class="{show : postStatus == 3}">
                    <div class="input-group">
                        <span class="input-label"> 시스템 구분 </span>
                        <!-- <label for="system">시스템 구분</label> -->
                        <select name="system" id="selectSys">
                            <option  value="0">영업 관리 시스템(매장용)</option>
                            <option  value="1">토마토 RI 집계</option>
                            <option value="2">Web POP</option>
                            <option value="3">관리자 App</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <span class="input-label"> 유형 </span>
                        <label class="label-radio">
                            <input type="radio" name="postCate" value="1" v-model="postCate">
                            <span>SR</span>
                        </label>
                        <label class="label-radio">
                            <input type="radio" name="postCate" value="2" v-model="postCate">
                            <span>장애/에러</span>
                        </label>
                    </div>
                    <div class="input-group">
                        <span class="input-label"> 상세 유형 </span>
                        <div v-if="postCate == 1">
                            <label for="cateSR">상세 유형 - SR</label>
                            <select name="cateSR" id="cateSR">
                                <option value="0">...</option>
                                <option value="1">...</option>
                                <option value="2">...</option>
                                <option value="3">...</option>
                            </select>
                        </div>
                        <div v-if="postCate == 2">
                            <label for="cateErr">상세 유형 - 장애/에러</label>
                            <select name="cateErr" id="cateErr">
                                <option value="0">...</option>
                                <option value="1">...</option>
                                <option value="2">...</option>
                                <option value="3">...</option>
                            </select>
                        </div>
                    </div>
                    <div class="input-group">
                        <span class="input-label"> 후속 조치 </span>
                        <label class="label-radio">
                            <input type="radio" name="postAfter" value="1" v-model="postAfter">
                            <span>없음</span>
                        </label>
                        <label class="label-radio">
                            <input type="radio" name="postAfter" value="2" v-model="postAfter">
                            <span>개선 과제 등록</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="modal-btn-wrap">
                <button class="modal-btn btn-common" @click="addPost()">등록하기</button>
                <button class="modal-btn btn-common" @click="closeModal()">닫기</button>
            </div>
        </div>
    </div>
</template>

