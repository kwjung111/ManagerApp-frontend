<script setup>
import {ref} from 'vue'

const props = defineProps({
    memos : {
        type : Object,
    }
})

const memos = ref(props.memos)

</script>

<template>
    <template v-for="memo in memos">
    <tr>
        <td colspan="7" class="comment-cell">
            <table class="comment-table">
                <tbody>
                    <!-- Example comment -->
                    <tr>
                        <td>{{memo.MEMO_WRTR}}</td>
                        <td>{{memo.MEMO_REG_DTM}}</td>
                        <td>{{memo.MEMO_CTNTS}}</td>
                    </tr>
                </tbody>
            </table>
        </td>
    </tr>
    </template>
</template>
