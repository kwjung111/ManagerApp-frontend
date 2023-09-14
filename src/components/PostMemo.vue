<script setup>
import { computed } from 'vue'
import axios from 'axios'
import Cmmn from '../common.js'

const url = Cmmn.url;

const props = defineProps({
    memos: {
        type: Object,
    }
})

//TODO destructuring 한 값도 갱신되는지 확인필요
const memos = computed(() =>{
    return props.memos
})

//코멘트 삭제
const removeMemo = (seq) => {
    if (confirm(`코멘트를 삭제하시겠습니까?`)) {
        axios.delete(`${url}/memos/${seq}`)
        .then((res) => {
            console.log(res)
            if (res.data.ok) {
                alert('삭제되었습니다!')
            }
            else {
                alert('다시 시도해 주세요')
            }
        })
    }
}

</script>

<template>
    <div v-for="memo in memos" class="memo">
        <p class="col01 arrow"> <span class="material-symbols-outlined txt-gray">subdirectory_arrow_right</span></p>
        <p class="txt-blue col04">{{ memo.MEMO_WRTR }}</p>
        <p class="txt-left col03">
            <span class="txt-blue"> {{ memo.MEMO_REG_DTM }} </span> : <span class="memo-cntns"> {{ memo.MEMO_CTNTS }} </span>
            <button class="btn-delete-memo" title="코멘트 삭제" @click="removeMemo(memo.MEMO_SEQ)">X</button>
        </p>
    </div>
</template>
