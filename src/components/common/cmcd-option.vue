<script setup>
import { onBeforeMount ,onBeforeUnmount ,ref,onUpdated, inject, nextTick} from 'vue';
import UxSelect from 'ux-select'

const props = defineProps({
        cd: {
            type:String,
        },
        placeholder:{
            type:String,
        }
    })

const Cmmn = inject('Cmmn')
const cmcdOptions = ref([]);

onBeforeMount(async () => {
    cmcdOptions.value = await Cmmn.getCmcd(props.cd);
})

onBeforeUnmount(() => {
    const selectbox = document.querySelector('.ux-select')
    if(selectbox){
        selectbox.remove()
    }
})

const initializeUxSelect = async () => {
      if (cmcdOptions.value.length) {
        //비동기적으로 DOM 업데이트 되니까 다음 업데이트 때 수행
        nextTick(()=> {
        const optSelectBox = document.getElementById("selectCmcdOption");
        
        new UxSelect(optSelectBox, {
          placeholder: props.placeholder,
          isSearchable: true,
        });
      });
    };
}    

onUpdated(() => {
      if (cmcdOptions.value.length) {
        initializeUxSelect();
      }
    });

</script>

<template>
    <select name="system" id="selectCmcdOption" v-if="cmcdOptions.length">
        <option v-for="(code,idx) of cmcdOptions" :key="idx" :value="code.CM_ITM_CD" >{{code.CM_ITM_NM}}</option>
    </select>   
</template>