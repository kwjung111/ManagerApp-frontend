<script setup>
import {ref, computed, inject, watch} from 'vue'
import cmcdOption from './common/cmcd-option.vue';
import cmmn from '../common';

const axios = inject('axios')
const Cmmn = inject('Cmmn')

const url = Cmmn.url;

const postCd = ref(1)            //긴급여부
const cntns = ref('')            //게시물내용
const postStatus = ref(1)        //게시물 진행상태
const pendingCntns = ref('')     //대기사유
const sysTp = ref(null)          //시스템 구분
const postCtg = ref(1)           //SR유형
const srTpDtl = ref(null)        //SR-상세코드              -- 두 상세코드는 같은 컬럼을 공유
const errTpDtl = ref(null)       //에러-상세코드            -- 두 상세코드는 같은 컬럼을 공유
const followUp = ref(0)          //후속과제여부              -- DB에 들어가는 값은 아님
const followUpCd = ref(1)        //후속게시물 긴급여부      
const followUpCntns = ref ('')   //후속게시물 내용
const followUpPostNo = ref(null) //후속게시물 번호

const dataLoaded = ref(false)    //데이터 로딩 여부.

const props = defineProps({
    postSeq : Number,
})
const postSeq = props.postSeq;

let writer;

const toastQueue =[]

const emit = defineEmits(['closeModal', 'postPatched'])

axios.get(`${url}/posts/${postSeq}`,)
    .then((res) =>{
        if(res.data.ok == true){
        const [data] = res.data.result 
        
        postCd.value = data.BRD_POST_CD
        cntns.value = data.BRD_CTNTS || ''
        writer = data.WRTR_NM; 
        postStatus.value = data.BRD_PRGSS_TF
        pendingCntns.value = data.BRD_RSN_PNDNG || ''
        sysTp.value = data.BRD_END_SYS_TP 
        postCtg.value = data.BRD_END_CTG  || 1
        if(postCtg.value == 1)
        {
            srTpDtl.value = data.BRD_END_CTG_DTL
        }else if(postCtg.value == 2)
        {
            errTpDtl.value = data.BRD_END_CTG_DTL
        }
        if(data.FOLLOWUP_POST_BRD_NO != null){
            followUpPostNo.value = data.FOLLOWUP_POST_BRD_NO
            followUp.value = 2     // 후속 게시물번호 있음
        }
        dataLoaded.value = true
    }
    else{
        cmmn.toastError('실패했습니다. 접속 상태를 확인해 주세요')
        closeModal()
    }
    })


const changePost = async() =>{

    const UID = await Cmmn.getUserIdentifier();

    axios.patch(`${url}/posts/chgPost`,{
        postSeq:postSeq
        ,postCd:postCd.value
        ,cntns:cntns.value
        ,prgCd:postStatus.value
        ,rsnPndg:pendingCntns.value
        ,UID:UID
    })
    .then((res) =>{
        if(res.data.ok==true){
            cmmn.toastSuccess('수정 완료!')
            emit('postPatched')
            closeModal()
        }
        else{
            cmmn.toastError('실패했습니다. 접속 상태를 확인해 주세요')
        }

    })
}

const endPost = async () =>{

    const UID = await Cmmn.getUserIdentifier();

    let postCtgDtl

    if(postCtg.value == 1){
        postCtgDtl = srTpDtl
    }else if(postCtg.value == 2){
        postCtgDtl = errTpDtl
    }

    axios.patch(`${url}/posts/clsPost`,{
        postSeq:postSeq
        ,postCd:postCd.value
        ,cntns:cntns.value
        ,prgCd:'0'              //완료
        ,sysTp:sysTp.value
        ,postCtg:postCtg.value
        ,postCtgDtl:postCtgDtl.value
        ,followUp:followUp.value
        ,followUpCd:followUpCd.value
        ,followUpCntns:followUpCntns.value
        ,UID:UID
    })
    .then((res) =>{
        if(res.data.ok==true){
        cmmn.toastSuccess('수정 완료!')
            if(res.data.result[0].insertId){  //후속게시물 알림등록
                Cmmn.saveNotificationInfo('posts',res.data.result[0].insertId) 
            }
            closeModal()
        }
        else{
            cmmn.toastError('실패했습니다. 접속 상태를 확인해 주세요')
        }
    })
}



const changePostByModalStat = (statCd)=>{
    if(!validationByModalStat(statCd)) return

    if(statCd == 1){
        changePost()
    }else if(statCd == 2 || statCd ==3){
        endPost()
    }
}

const validationByModalStat = (statCd)=>{
    if(statCd ==1){
        return validation()
    }else if(statCd ==2){
        return validationWithoutImprove()
    }
    else if(statCd == 3){
        return validationWithImprove()
    }
}

const closeModal = () =>{
    cmmn.removeAllToast(toastQueue)
    emit('closeModal')
}

//TODO validaiton 공통코드 작성
const validation = () =>{
    if(!checkcntns()) return false;

    if(postStatus.value == 2){
        if(!checkPndTxt()) return false;
    }
    return true;
}

const validationWithoutImprove = () => {
    if(!validation()) return false
    if(!checkSysTp()) return false
    if(!checkpostCtg()) return false
    if(postCtg.value == 1){
        if(!checkSrTpDtl()) return false
    }else if(postCtg.value == 2){
        if(!checkErrTpDtl()) return false
    }
    return true;
}

const validationWithImprove = () => {
    if(!validationWithoutImprove())  return false
    if(!checkfollowUpCd()) return false
    if(!checkfollowUpCntns()) return false
    return true;
}


const checkcntns = () =>{
    if(cntns.value)return true;
    toastQueue.push(cmmn.toastAlert('내용을 입력해주세요'))
    return false;   
}

const checkPndTxt = () =>{
    if(pendingCntns.value) return true;
    toastQueue.push(cmmn.toastAlert('대기사유를 입력해주세요'))
    return false;
}


const checkSysTp = () =>{
    if(sysTp.value) return true;
    toastQueue.push(cmmn.toastAlert('시스템 구분을 선택해주세요'))
    return false;
}

const checkpostCtg = () =>{
    if(postCtg.value) return true;
    toastQueue.push(cmmn.toastAlert('SR유형을 선택해주세요'))
    return false;
}

const checkSrTpDtl= () =>{
    if(srTpDtl.value) return true;
    toastQueue.push(cmmn.toastAlert('SR유형을 선택해주세요'))
    return false;
}

const checkErrTpDtl = () =>{
    if(errTpDtl.value) return true;
    toastQueue.push(cmmn.toastAlert('에러 유형을 선택해주세요'))
    return false;
}

const checkfollowUpCd = () =>{
    if(followUpCd.value) return true;
    toastQueue.push(cmmn.toastAlert('후속게시물 유형을 선택해주세요'))
    return false;
}

const checkfollowUpCntns = () =>{
    if(followUpCntns.value) return true;
    toastQueue.push(cmmn.toastAlert('후속게시물 내용을 입력해주세요'))
    return false;
}

const displayBtnText = (statCd) => {
    if(statCd != 0){
        return "수정하기"
    }else return "등록하기"
}  

//모달의 상태
const modalStat = computed(() => {
    if(postStatus.value != 0){
        return 1;       //1단계
    }else if(followUp.value == 0 || followUp.value == 2){
        return 2;       //2단계
    }else{
        return 3;       //3단계
    }
})


//UI/UX 관련 코드
watch(() => postStatus.value ,(newVal) =>{   //1단계 모달스탯일 경우 
    if(newVal != 3 && followUp.value !=2){
        followUp.value = 0                  //상태 리셋
    }
})

//common selectbox 이벤트
const changeSysTp = (val) => {
    sysTp.value = val
}

const changeSrTpDtl = (val) => {
    console.log(val)
    srTpDtl.value = val
}

const changeErrTpDtl = (val) => {
    errTpDtl.value = val
}


</script>

<template>
    <div class="modal-overlay">
        <div class="modal" @click.stop="" v-show="dataLoaded"> <!--이벤트 버블링 방지-->
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
                        {{ writer}}
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
                        <input type="radio" name="postStatus" value="0" v-model="postStatus">
                        <span>완료</span>
                    </label>
                </div>
                <div class="input-group">
                    <span class="input-label"> 대기사유 </span>
                    <label class="label-text">
                        <textarea maxlength="50" :disabled="postStatus != 2" v-model="pendingCntns"></textarea>
                        <span> {{ pendingCntns.length }}/50 자</span>
                    </label>
                </div>
                <div class="input-clear" :class="{show : postStatus == 0}">
                    <div class="input-group">
                        <span class="input-label"> 시스템 구분 </span>
                        <div class="label-text">
                            <cmcdOption :selectorID="'select01'" :cd="'1'" :placeholder="'--시스템 구분 선택--'" :selected="sysTp" @changeOptEvt="changeSysTp"></cmcdOption>
                        </div>
                    </div>
                    <div class="input-group">
                        <span class="input-label"> 유형 </span>
                        <label class="label-radio">
                            <input type="radio" name="postCtg" value="1" v-model="postCtg">
                            <span>SR</span>
                        </label>
                        <label class="label-radio">
                            <input type="radio" name="postCtg" value="2" v-model="postCtg">
                            <span>장애/에러</span>
                        </label>
                    </div>
                    <div class="input-group">
                        <span class="input-label"> 상세 유형 </span>
                        <div class="label-text" v-show="postCtg == 1"> <!-- v-show 와 v-if의 차이 -->
                            <cmcdOption :selectorID="'select02'" :cd="'2'" :placeholder="'--상세 유형(SR) 선택--'" :selected="srTpDtl" @changeOptEvt="changeSrTpDtl"></cmcdOption>
                        </div>
                        <div class="label-text" v-show="postCtg == 2">
                            <cmcdOption :selectorID="'select03'" :cd="'3'" :placeholder="'--상세 유형(장애/에러) 선택--'" :selected="errTpDtl" @changeOptEvt="changeErrTpDtl"></cmcdOption>
                        </div>
                    </div>
                    <div class="input-group">
                        <span class="input-label"> 후속 조치 </span>
                        <label class="label-radio" v-show="followUp!=2"> 
                            <input type="radio" name="followUp" value="0" v-model="followUp">
                            <span>없음</span>
                        </label>
                        <label class="label-radio" v-show="followUp!=2">
                            <input type="radio" name="followUp" value="1" v-model="followUp">
                            <span>개선 과제 등록</span>
                        </label>
                        <label class="label-radio" v-show="followUp == 2">
                            <input type="radio" name="followUp" value="2" v-model="followUp">
                            <span>후속과제 번호 : {{followUpPostNo}}</span>
                        </label>
                    </div>
                </div>
                <div class="input-after" :class="{show : followUp == 1 && postStatus == 0}">
                    <div class="input-group">
                        <span class="input-label"> 후-긴급여부 </span>
                        <label class="label-radio">
                            <input type="radio" name="followUpCd" value="1" v-model="followUpCd">
                            <span > 일반</span>
                        </label>
                        <label class="label-radio">
                            <input type="radio" name="followUpCd" value="2" v-model="followUpCd">
                            <span > 긴급</span>
                        </label>
                    </div>
                    <div class="input-group">
                        <span class="input-label"> 후-내용 </span>
                        <label class="label-text">
                            <textarea maxlength="50" v-model="followUpCntns"></textarea>
                            <span> {{ followUpCntns.length }}/50 자</span>
                        </label>
                    </div>
                    <!--
                    <div class="input-group">
                        <span class="input-label" > 작성자 </span>
                        <label class="label-text">
                            <input type="text" maxlength="5" size="40" v-model="AfterWrtr"/>
                        </label>
                    </div>
                -->
                </div>
            </div>
            <div class="modal-btn-wrap">
                <button class="modal-btn btn-common positive" @click="changePostByModalStat(modalStat)">{{ displayBtnText(postStatus) }}</button>
                <button class="modal-btn btn-common" @click="closeModal()">닫기</button>
            </div>
        </div>
    </div>
</template>

