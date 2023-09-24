import cmmn from "./common.js"

//event 의 method 나 meta 정보에 따라 이벤트 분기
const evtHandler= {
    postHandler: async (evtData)=>{
        const UID = await cmmn.getUserIdentifier();
        //새글 등록시 알림
        if (evtData.method == "POST" && evtData.UID != UID) {    
            cmmn.newNoti('새글 등록됨',evtData,evtData.rid);
        }else if(evtData.method == "PATCH" && evtData.UID != UID){
            //후속과제 등록시
            if(evtData.meta.followUp){
                cmmn.newNoti(`후속과제 등록됨`,evtData,evtData.meta.followUp);
            }
        }
    },

    memoHandler: async (evtData) => {
        const UID = await cmmn.getUserIdentifier();
        //storage 에 번호가 저장된 게시물들에 댓글 등록시 알림
        if (evtData.method == "POST" && evtData.UID != UID) {
            //게시물에 연관된 정보를 받으므로 posts 저장소로 접근
            if (cmmn.checkSendNotification("posts", evtData.meta.postSeq)) {
                cmmn.newNoti('댓글 등록됨',evtData,evtData.meta.postSeq);
            }
        }
    }
}


const evtMap= {
    posts:evtHandler.postHandler,
    memos:evtHandler.memoHandler,
}


//resource 에 따라 handler 분기
const eventMapper = (evtData) => {
    const eventHandler= evtMap[evtData.resource]
    return eventHandler(evtData)
}

export default eventMapper