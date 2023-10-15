<script setup>
import HamburgerBtn from '../../components/common/Hamburger-btn.vue'
import DatePickModal from '../../components/common/Date-PickModal.vue';
import { ref,onBeforeMount, inject } from 'vue'

const axios = inject('axios')
const Cmmn = inject('Cmmn')
const url = Cmmn.url


const fromDate = ref(Cmmn.getCurMonthYMD())
const toDate = ref(Cmmn.getTodayYMD())

const datepickModalVisible = ref(false)


axios.get(`${url}/projects/`)
.then((res) =>{
    console.log(res)
})

onBeforeMount(() => {
     refresh()
})

const refresh = async () => {  
    const queryParams = {
        fromDate : fromDate.value,
        toDate : toDate.value,
    }
    axios.get(`${url}/projects/fin`,{params:queryParams},
    )
        .then((res) => {
            console.log(res)
        })
}

function toggleDatePickModal() {
    datepickModalVisible.value = !datepickModalVisible.value
}

function selectDate(data){
    fromDate.value = data.fromDate
    toDate.value = data.toDate
    refresh();
}


const changeFilter = () => {

    console.log('filterchanged')
}

</script>

<template>
    <header>
        <div class="header-container">
            <div class="header-title">
                <h1> PROJECTS </h1>
                <h2>완료 게시물</h2>
            </div>
            <!-- 메인 -->
            <div class="header-date">
                <p>{{ fromDate}} ~ {{ toDate}} </p>
            </div>
            <HamburgerBtn></HamburgerBtn>
        </div>
        <div class="btn-post-wrap">
            <button class="btn-post btn-common positive"  title="신규 프로젝트 등록">
                <i class="fa-pen-to-square"></i>
            </button>
        </div>
    </header>

    <section>
        <div class="container">
            <div class="sidebar">
                <div class="box"><button class="box-text" @click="toggleDatePickModal()" :class="{ active: true }">최근
                        1주일
                        접수<span class=strong>{{ 0 }}</span></button> </div>
            </div>
            <div class="table-wrap">
                <div class="post-table">
                    <ul class="table-head">
                        <li class="col01">NO</li>
                        <li class="col02">등록일시</li>
                        <li class="col03">SR 내용</li>
                        <li class="col04">상태</li>
                        <li class="col05">경과/조치시간</li>
                        <li class="col06">담당자</li>
                        <li class="col07">비고</li>
                    </ul>
                    <div class="table-body" v-if="true">
                        <ol>
                            <!--
                            <Post v-for="(post, i) of filteredList" :key="i" :post="post" :lastRefreshTime="lastRefreshTime"
                                @addMemo="toggleMemoAddModal" />
                            -->
                        </ol>
                    </div>
                    <div class="table-body" v-else>
                        <p class="no-db">아직 등록된 게시물이 없습니다 ! !</p>
                    </div>
                </div>
            </div>
            <template v-if="datepickModalVisible" >
                <div class="modal-bg">
            <DatePickModal :fromDate="fromDate" :toDate="toDate" @closeModal="toggleDatePickModal" @selectDate="selectDate"></DatePickModal>
        </div>
        </template>
        </div>
    </section>
</template>