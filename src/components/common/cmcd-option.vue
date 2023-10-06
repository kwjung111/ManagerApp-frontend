<script setup>

/*required 
  cd            = 공통코드 번호
  @changeOptEvt = selectBox 의 값이 바뀔때 이벤트
  placeholder   = 기본 placeholder 텍스트. 
*/

import { onBeforeMount, onBeforeUnmount, ref, inject, watch } from 'vue';
// mport UxSelect from 'ux-select'
import { v4 as uuidv4 } from 'uuid'

const props = defineProps({
    cd: {
        type: String,
    },
    placeholder: {
        type: String,
    },
    selected: {
        type: Number
    }
})

const emit = defineEmits(['changeOptEvt'])

const Cmmn = inject('Cmmn')
const cmcdOptions = ref([]);
const elmId = uuidv4();
const selectedVal = ref('')
//let selectInitiated = false;      ux-select 관련 코드
//let uxSelectBox

const changeOpt = (selectedVal) => {
    emit(`changeOptEvt`, selectedVal)
}


onBeforeMount(async () => {
    cmcdOptions.value = await Cmmn.getCmcd(props.cd);
})

onBeforeUnmount(() => {
})

/* ux-select 관련 코드

const initializeUxSelect = async () => {
    if (cmcdOptions.value.length) {
        //비동기적으로 DOM 업데이트 되니까 다음 업데이트 때 수행
        
        //nextTick(()=> {
        const optSelectBox = document.getElementById(elmId);
        uxSelectBox = new UxSelect(optSelectBox, {
          placeholder: props.placeholder,
          isSearchable: true,
        });
        
        selectInitiated = true;
        });
    };
}


onUpdated(() => {
      if (cmcdOptions.value.length && !selectInitiated) {
        initializeUxSelect();
      }
    });
*/

watch(() => props.selected, (newValue) => {
    console.log(selectedVal.value)
    selectedVal.value = newValue;
});


</script>

<template>
    <select name="system" :id="elmId" v-if="cmcdOptions.length" v-model="selectedVal" @change="changeOpt(selectedVal)">
        <option value="" disabled selected >{{ props.placeholder}}</option>
        <option v-for="(code, idx) of cmcdOptions" :key="idx" :value="code.CM_ITM_CD">{{ code.CM_ITM_NM }}</option>
    </select>
</template>

<style>
select option[value=""][disabled] {
	        display: none;
        }

</style>