<script setup>
import { computed } from 'vue'
import axios from 'axios'
import Cmmn from '../common.js'
import autolinker from 'autolinker'


const url = Cmmn.url;

const props = defineProps({
    memos: {
        type: Object,
    },
    readOnly:{
        type:Boolean
    }
})

const readOnly = props.readOnly || false;

//TODO destructuring 한 값도 갱신되는지 확인필요
const memos = computed(() =>{
    return props.memos
})


//코멘트 삭제
const removeMemo = async (seq) => {
    Cmmn.confirm('코멘트를 삭제하시겠습니까?',
    () => {
        axios.delete(`${url}/memos/${seq}`)
        .then((res) => {
            if (res.data.ok) {
                Cmmn.toastSuccess('삭제되었습니다!')
            }
            else {
                Cmmn.toastError('다시 시도해 주세요')
            }
        })
    })
}

</script>

<template>
    <div v-for="(memo,i) in memos" :key="i" class="memo">
        <p class="col01"><i class="fa-solid fa-reply fa-rotate-180"></i></p>
        <p class="txt-blue col04">{{ memo.WRTR }}</p>
        <p class="txt-left col03">
            <span class="txt-blue"> {{ memo.MEMO_REG_DTM }} </span> : <span class="memo-cntns" v-html="autolinker.link(memo.MEMO_CTNTS)" > </span>
            <button v-if="!readOnly" class="btn-delete-memo" title="코멘트 삭제" @click="removeMemo(memo.MEMO_SEQ)"><i class="fa-solid fa-xmark"></i></button>
        </p>
    </div>
</template>
