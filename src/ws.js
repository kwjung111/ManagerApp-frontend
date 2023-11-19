import Cmmn from "./common.js"
import eventMapper from './eventHandler.js';

const wsUrl = Cmmn.wsUrl;
//웹소켓 연결

/*
    웹소켓 메세지 구조
    {
        type : 메시지 타입( event - 클라이언트가 받아서 함수 등 실행, message - 단순 텍스트 메세지 용도),
        data : 실질적 데이터
        {
            method : 서버에서 메세지를 보낸 함수이름
            resource : 관련된 자원
            rid : 자원의 시퀀스값
            UID : 유저 id() - 클라이언트 쿠키에 저장되는 uuidv4 값
            content : message 타입의 내용 / event 타입에서 노출될 알람 내용 등
            meta : 위 내용 외에 전달되어야 하는 값들 
        }
    }

*/
const websock = {
    ws : null,              //connect 시 할당
connectWs : function() {

    //중복 연결 방어
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        console.log('이미 서버에 연결되어 있습니다.');  
        return;
    }

    //연결 수행
    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = async () => {
        console.log('연결되었습니다')
        localStorage.setItem('wsReConnect', true);
    }

    this.ws.onmessage = async (event) => {
        const rcvJson = JSON.parse(event.data)
        const onmessageEvt = new CustomEvent('wsMessage', {
            detail: {
                type : rcvJson.type,
                data : rcvJson.data,
            }
        })
        window.dispatchEvent(onmessageEvt);
        if (rcvJson.type === "message") {
            let msgData = rcvJson.data
            console.log("server message :", msgData);
        }
        else if (rcvJson.type === "event") {
            let evtData = rcvJson.data
            console.log("server event : ", evtData)
            eventMapper(evtData)
        }
    }

    this.ws.onclose = async () => {
        console.log('서버와의 연결이 종료되었습니다.')
        
        //비정상 종료 시 재연결
        if (localStorage.getItem('wsReConnect') == false) {
            setTimeout(() => {
                console.log('reconnecting to server...')
                this.connectWs();
            }, 1000)
        }
    }

    return this.ws
},
disconnect : function() {    
    if(this.ws && this.ws.readyState === WebSocket.OPEN) {
        localStorage.setItem('wsReConnect',false)
        this.ws.close()
    }
        this.ws = null;
}
}

export default websock