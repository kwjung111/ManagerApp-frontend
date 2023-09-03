<script setup>
import { ref, computed } from 'vue'

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
    <tr v-for="memo in memos">
        <td colspan="2" style="display:hidden"></td>
        <td colspan="1" > <span class="material-symbols-outlined">subdirectory_arrow_right</span> </td>
        <td class="memo-td">{{ memo.MEMO_WRTR }}</td>
        <td class="memo-td" style="text-align:left"> {{ memo.MEMO_REG_DTM }}  :  {{ memo.MEMO_CTNTS }}</td>
    </tr>
</template>
