<script setup>

/*required 
  cd            = 공통코드 번호
  @changeOptEvt = selectBox 의 값이 바뀔때 이벤트
  placeholder   = 기본 placeholder 텍스트. 
*/

import { onBeforeMount, ref, inject, watch } from 'vue';
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
const isActive = ref(false)
const changeOpt = (selectedVal) => {
    emit(`changeOptEvt`, selectedVal)
}

onBeforeMount(async () => {
    cmcdOptions.value = await Cmmn.getCmcd(props.cd);
})

watch(() => props.selected, (newValue) => {
    selectedVal.value = newValue;
});

function toggleSelect() {
    isActive.value = !isActive.value
    console.log(selectedVal.value)
}

function selectOption(e) {
    isActive.value = !isActive.value
    const selectedEl = e.target
    const text = selectedEl.innerText
    const label = e.target.parentElement.previousSibling.querySelector('span')
    const clickedValue = e.target.getAttribute('data-value')
    label.innerText = text
    selectedVal.value = clickedValue
}

</script>

<template>
    <select  v-if="cmcdOptions.length" v-model="selectedVal" @change="changeOpt(selectedVal)">
        <option v-for="(code, idx) of cmcdOptions" :key="idx" :value="code.CM_ITM_CD">{{ code.CM_ITM_NM }}</option>
    </select>
    <div class="selectbox" :id="elmId">
        <div class="label" @click="toggleSelect" :class="{active : isActive}">
            <span>{{ props.placeholder }}</span>
            <i class="fa-solid fa-caret-down"></i>
        </div>
        <ul class="select-list">
            <li class="option" @click="selectOption" v-for="(code, idx) of cmcdOptions" :key="idx" :data-value="code.CM_ITM_CD">{{ code.CM_ITM_NM }}</li>
        </ul>
    </div>
</template>