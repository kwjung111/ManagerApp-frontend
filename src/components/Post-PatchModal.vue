<script setup>
import {ref,onMounted,onBeforeUnmount,onBeforeMount, inject, computed} from 'vue'
import UxSelect from 'ux-select'
import cmcdOption from './common/cmcd-option.vue';

const axios = inject('axios')
const Cmmn = inject('Cmmn')

const url = Cmmn.url;
const wrtrCookieKey = 'writerName';

const postCd = ref(1)
const afterCd = ref(1)
const cntns = ref('')
const wrtr = ref('')
const delayCntns = ref('')

const postStatus = ref(1)
const postCate = ref(1)
const postAfter = ref(1)
const cmcdSys = ref([])

const emit = defineEmits(['closeModal'])


const addPost = async() =>{
    console.log(postCd.value, cntns.value, wrtr.value)
    if(!validation()) return

    const UID = await Cmmn.getUserIdentifier();

    axios.post(`${url}/posts`,{
        postCd:postCd.value,
        content:cntns.value,
        writer:wrtr.value,
        UID:UID,
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
                        <span> {{ delayCntns.length }}/50 자</span>
                    </label>
                </div>
                <div class="input-clear" :class="{show : postStatus == 3}">
                    <div class="input-group">
                        <span class="input-label"> 시스템 구분 </span>
                        <div class="label-text sel01">
                            <!--<select name="system" id="selectSys">
                                <option value="1">영업 관리 시스템(매장용)</option>
                                <option value="2">영업 관리 시스템(대리점용)</option>
                                <option value="3">영업 관리 시스템(RI)</option>
                                <option value="4">토마토 RI 집계</option>
                                <option value="5">Web POP</option>
                                <option value="6">관리자 App</option>
                                <option value="7">안드로이드 H/T</option>
                                <option value="8">일반 H/T</option>
                                <option value="9">토마토 App</option>
                                <option value="10">B2B Supply</option>
                                <option value="11">B2B Trade(P/C)</option>
                                <option value="12">B2B Trade(Mobile)</option>
                                <option value="13">일반 POS</option>
                                <option value="14">kiosk POS</option>
                                <option value="15">인프라-운영계(AWS)</option>
                                <option value="16">인프라-개발계</option>
                                <option value="17">ESL</option>
                            </select>
                            -->
                            <cmcdOption :cd="'01'" :placeholder="'시스템 구분'"></cmcdOption>
                        </div>
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
                        <!--<div class="label-text selectbox" :class="{on : postCate == 1}">
                            <select name="cateSR" id="cateSR">
                                <option value="1" data-ux-select-group="Data Check">Data Check - Data 이상</option>
                                <option value="2" data-ux-select-group="Data Check">Data Check - Data 조회/확인</option>
                                <option value="3" data-ux-select-group="Data 수정">Data 수정 - Data 가공(요청)</option>
                                <option value="4" data-ux-select-group="Data 수정">Data 수정 - 사용자 오류</option>
                                <option value="5" data-ux-select-group="Data 수정">Data 수정 - 시스템 오류</option>
                                <option value="6" data-ux-select-group="Data 수정">Data 수정 - 타시스템 오류</option>
                                <option value="7" data-ux-select-group="Data 수정">Data 수정 - 테스트/지원</option>
                                <option value="8" data-ux-select-group="Data 이행">Data 이행 - 신규점 재이행</option>
                                <option value="9" data-ux-select-group="Data 이행">Data 이행 - 신규점 초기 이행</option>
                                <option value="10" data-ux-select-group="Data 추출">Data 추출 - 기존</option>
                                <option value="11" data-ux-select-group="Data 추출">Data 추출 - 기존변형</option>
                                <option value="12" data-ux-select-group="Data 추출">Data 추출 - 신규</option>
                                <option value="13" data-ux-select-group="문의">문의 - 사용법 - 장비/Tool</option>
                                <option value="14" data-ux-select-group="문의">문의 - 사용법 - 프로그램 화면</option>
                                <option value="15" data-ux-select-group="문의">문의 - 장애/오류 - 시스템</option>
                                <option value="16" data-ux-select-group="문의">문의 - 장애/오류 - 장비</option>
                                <option value="17" data-ux-select-group="문의">문의 - 장애/오류 - 프로그램</option>
                                <option value="18" data-ux-select-group="문의">문의 - 프로세스 - 기존 프로세스</option>
                                <option value="19" data-ux-select-group="문의">문의 - 프로세스 - 신규 프로세스</option>
                                <option value="20" data-ux-select-group="업무지원">업무지원 - 문서작성</option>
                                <option value="21" data-ux-select-group="업무지원">업무지원 - 조사/모니터링</option>
                                <option value="22" data-ux-select-group="프로그램 변경/추가">프로그램 변경/추가 - 기능/프로세스 개선</option>
                                <option value="23" data-ux-select-group="프로그램 변경/추가">프로그램 변경/추가 - 신규 프로그램</option>
                                <option value="24" data-ux-select-group="프로그램 변경/추가">프로그램 변경/추가 - 오류 개선</option>
                                <option value="25" data-ux-select-group="프로그램 실행">프로그램 실행 - 배치</option>
                                <option value="26" data-ux-select-group="프로그램 실행">프로그램 실행 - 일반화면</option>
                            </select>
                        </div> -->
                        <div class="label-text selectbox sel02" :class="{on : postCate == 1}">
                            <cmcdOption :cd="'02'" :placeholder="'상세 유형 - SR'"></cmcdOption>
                        </div>
                        <div class="label-text selectbox sel03" :class="{on : postCate == 2}">
                            <cmcdOption :cd="'03'" :placeholder="'상세 유형 - 장애/에러'"></cmcdOption>
                        </div>
                        <!--<div class="label-text selectbox" :class="{on : postCate == 2}">
                            <select name="cateErr" id="cateErr">
                                <option value="1">API/IRT</option>
                                <option value="2">DBMS</option>
                                <option value="3">Server</option>
                                <option value="4">네트워크</option>
                                <option value="5">배치 프로그램</option>
                                <option value="6">화면 프로그램</option>
                            </select>
                        </div>-->
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
                <div class="input-after" :class="{show : postAfter == 2 && postStatus == 3}">
                    <div class="input-group">
                        <span class="input-label"> 입력값 </span>
                        <label class="label-radio">
                            <input type="radio" name="afterCd" value="1" v-model="afterCd">
                            <span > 일반</span>
                        </label>
                        <label class="label-radio">
                            <input type="radio" name="afterCd" value="2" v-model="afterCd">
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
            </div>
            <div class="modal-btn-wrap">
                <button class="modal-btn btn-common" v-if="postStatus != 3" @click="changePost()">수정하기</button>
                <button class="modal-btn btn-common" v-else @click="addPost()">등록하기</button>
                <button class="modal-btn btn-common" @click="closeModal()">닫기</button>
            </div>
        </div>
    </div>
</template>

