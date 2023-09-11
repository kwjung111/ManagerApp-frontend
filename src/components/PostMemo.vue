<script setup>
import { computed } from 'vue'

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
        axios.post(`${url}/removeMemo`, {
            memoSeq: seq
        }).then((res) => {
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
    <tr v-for="memo in memos" class="memo">
        <td colspan="2"></td>
        <td colspan="1"> <span class="material-symbols-outlined txt-gray">subdirectory_arrow_right</span> </td>
        <td class="memo-td txt-blue">{{ memo.MEMO_WRTR }}</td>
        <td colspan="5" class="memo-td txt-left">
            <span class="txt-blue"> {{ memo.MEMO_REG_DTM }} </span> :  {{ memo.MEMO_CTNTS }}
            <button class="btn-delete-memo" title="코멘트 삭제" @click="removeMemo(memo.MEMO_SEQ)">X</button>
        </td>
    </tr>
</template>
