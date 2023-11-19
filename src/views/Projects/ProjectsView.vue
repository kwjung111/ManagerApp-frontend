<script setup>
import HamburgerBtn from '../../components/common/Hamburger-btn.vue'
import Project from '../../components/project/project.vue'
import { ref, onMounted, onUnmounted, computed, inject } from 'vue'

const axios = inject('axios')
const Cmmn = inject('Cmmn')
const url = Cmmn.url

const projects = ref(null)

axios.get(`${url}/projects/`)
.then((res) =>{
    projects.value = res.data.result
})




const changeFilter = () => {

    console.log('filterchanged')
}

</script>

<template>
    <header>
        <div class="header-container">
            <div class="header-title">
                <h1> PROJECTS </h1>
            </div>
            <!-- 메인 -->
            <div class="header-date">
                <p>메인 수정 필요</p>
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
                <div class="box"><button class="box-text" @click="changeFilter(0)" :class="{ active: true }">최근
                        1주일
                        접수<span class=strong>{{ 0 }}</span></button> </div>
            </div>
            <div class="table-wrap">
                <div class="post-table">
                    <ul class="table-head">
                        <li class="col01">NO</li>
                        <li class="col02">등록일시</li>
                        <li class="col03">프로젝트 내용</li>
                        <li class="col04">상태</li>
                        <li class="col05">진척률</li>
                        <li class="col06">참여자</li>
                        <li class="col07">비고</li>
                    </ul>
                    <div class="table-body" v-if="true">
                        <ol>
                            <Project v-for="(project,i) of projects" :key="i" :project="project" />
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
            <!-- 리팩토링 필요 구간 start
            <template v-if="projectAddModalVisible">
                <div class="modal-bg">
                    <ProjectAddModal @closeModal="toggleProjectAddModal" />
                </div>
            </template>
             구간 end -->
        </div>
    </section>
</template>