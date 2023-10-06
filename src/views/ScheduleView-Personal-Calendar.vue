<script setup>
import { ref, onMounted, computed, inject } from 'vue'
import HamburgerBtn from '../components/common/Hamburger-btn.vue';
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin, {Draggable} from '@fullcalendar/interaction'

const axios = inject('axios')
const Cmmn = inject('Cmmn')


const calendarOptions = {
    plugins:[ dayGridPlugin,interactionPlugin],
    initialView: 'dayGridMonth',
    dateClick: handleClick,
    events:[
        {title: 'event 1', date:'2023-10-07'}
    ],
    
}


function handleClick(arg){
    console.log(arg)
}

</script>

<template>
    <header>
        <div class="header-container">
            <div class="header-title">
                <h1> 개인 스케줄</h1>
                
            </div>
            <div class="header-date">
                <p>{{ curDt }}</p>
            </div>
            <HamburgerBtn></HamburgerBtn>
        </div>
        <div class="btn-post-wrap">
            <button class="btn-post btn-common positive" @click="toggleScheduleAddModal()" title="신규 개인스케줄 등록">
                <i class="fa-pen-to-square"></i>
            </button>
        </div>
    </header>

    <section>
        <div class="container">
           <FullCalendar :options="calendarOptions"></FullCalendar>
    </div>
</section>
</template>
