import cmmn from "./common.js"

const notiFadeOutTime = 10000;//ms 단위


//event 의 method 나 meta 정보에 따라 이벤트 분기
const evtHandler= {
    postHandler: async (evtData)=>{
        const UID = await cmmn.getUserIdentifier();
        //새글 등록시 알림
        if (evtData.method == "POST" && evtData.UID != UID) {    
            const noti = new Notification('새글 등록됨', {
                icon: './ico-noti.svg',
                body: evtData.content});

            noti.onclick = function (event) {
                event.preventDefault();         // 알림 클릭의 기본 동작을 방지
                cmmn.navigateToSection(evtData.rid)        // id 위치로 이동
            };

            setTimeout(() => {
                noti.close()
            }, notiFadeOutTime)
        }
    },

    memoHandler: async (evtData) => {
        const UID = await cmmn.getUserIdentifier();
        //storage 에 번호가 저장된 게시물들에 댓글 등록시 알림
        if (evtData.method == "POST" && evtData.UID != UID) {
            //게시물에 연관된 정보를 받으므로 posts 저장소로 접근
            if (cmmn.checkSendNotification("posts", evtData.meta.postSeq)) {
                const noti = new Notification('댓글 등록됨', {
                    icon: null,                      //TODO 아이콘 삽입
                    body: evtData.content
                });

                noti.onclick = function (event) {
                    event.preventDefault();         // 알림 클릭의 기본 동작을 방지
                    cmmn.navigateToSection(evtData.meta.postSeq)        // id 위치로 이동
                };

                setTimeout(() => {
                    noti.close()
                }, notiFadeOutTime)
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