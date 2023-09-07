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


</script>

<template>
    <tr v-for="memo in memos" class="memo">
        <td colspan="2"></td>
        <td colspan="1"> <span class="material-symbols-outlined txt-gray">subdirectory_arrow_right</span> </td>
        <td class="memo-td txt-blue">{{ memo.MEMO_WRTR }}</td>
        <td colspan="5" class="memo-td txt-left"> <span class="txt-blue"> {{ memo.MEMO_REG_DTM }} </span> :  {{ memo.MEMO_CTNTS }}</td>
    </tr>
</template>
