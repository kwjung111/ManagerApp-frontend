<script setup>
import { defineProps,computed } from 'vue';

const props = defineProps({
    isLoading:Boolean,
    loadingCnt:Number,
})

const showSpinner = computed(() =>{
return props.isLoading})

const loadingCnt = computed(() =>{
    return props.loadingCnt
})

</script>

<template>
<div class="loading-wrap" v-show="loadingCnt != 0">
        <div class="loading">
            <span class="first"></span>
            <span class="second"></span>
            <span class="third"></span>
            <span class="forth"></span>
        </div>
    </div>
</template>