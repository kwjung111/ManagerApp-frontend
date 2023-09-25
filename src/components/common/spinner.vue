<script setup>
import { defineProps,computed } from 'vue';

const props = defineProps({
    isLoading:Boolean
})

const showSpinner = computed(() =>{
    console.log(props.isLoading)
return props.isLoading})

</script>

<template>
<div class="loading-wrap" v-show="showSpinner">
        <div class="loading">
            <span class="first"></span>
            <span class="second"></span>
            <span class="third"></span>
            <span class="forth"></span>
        </div>
    </div>
</template>