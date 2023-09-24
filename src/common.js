//깊은복사
import axios from 'axios'
import dayjs from 'dayjs'

const cmmn = {
  url: import.meta.env.VITE_BACK_URL,
  wsUrl: import.meta.env.VITE_BACK_WSURL,
  notiImg : import.meta.env.VITE_NOTI_ICON,
  deepCopy: (obj) => {
    if (obj === null || typeof obj !== 'object') return obj

    let copy = {}
    for (let key in obj) {
      copy[key] = cmmn.deepCopy(obj[key])
    }
    return copy
  },
  formatSecondsAsTime: (secs, format) => {
    var hr = Math.floor(secs / 3600)
    var min = Math.floor((secs - hr * 3600) / 60)
    var sec = Math.floor(secs - hr * 3600 - min * 60)

    if (hr < 10) {
      hr = '0' + hr
    }
    if (min < 10) {
      min = '0' + min
    }
    if (sec < 10) {
      sec = '0' + sec
    }
    if (!hr) {
      hr = '00'
    }

    if (format != null) {
      var formatted_time = format.replace('hh', hr)
      formatted_time = formatted_time.replace('h', hr * 1 + '') // check for single hour formatting
      formatted_time = formatted_time.replace('mm', min)
      formatted_time = formatted_time.replace('m', min * 1 + '') // check for single minute formatting
      formatted_time = formatted_time.replace('ss', sec)
      formatted_time = formatted_time.replace('s', sec * 1 + '') // check for single second formatting
      return formatted_time
    } else {
      return hr + ':' + min + ':' + sec
    }
  },
  //hh:mm:ss 를 초로 변환
  convertHmsToSec: (hms) => {
    let timeArr = hms.split(':')
    let hr = Number(timeArr[0])
    let min = Number(timeArr[1])
    let sec = Number(timeArr[2])
    return hr * 3600 + min * 60 + sec
  },
  convertSecToHms: (totSec) => {
    let hr = Math.floor(totSec / 3600)
    let min = Math.floor((totSec % 3600) / 60)
    let sec = Math.floor(totSec % 60)

    if (hr < 10) hr = '0' + hr
    if (min < 10) min = '0' + min
    if (sec < 10) sec = '0' + sec

    return `${hr}:${min}:${sec}`
  },
  setCookie: (key, val) => {
    document.cookie = `${key} = ${val}`
  },

  //TODO 리팩토링
  getCookie: (key) => {
    let fullCk = document.cookie
    let ckArr = fullCk.split(';')
    let ckWithKey = ckArr.find((cookie) => {
      return cookie.split('=')[0].trim() == key
    })
    if (ckWithKey) return ckWithKey.split('=')[1].trim()
    else return null
  },

  // 초기화에 사용
  applyCookieVal: (key, target) => {
    let val = cmmn.getCookie(key)
    if (val) target.value = val
  },

  getUserIdentifier: async () => {
    let userKey = localStorage.getItem('userKey')
    if (userKey == null) {
      const res = await axios.get(`${cmmn.url}/identifier`)
      userKey = res.data
      localStorage.setItem('userKey', res.data)
    }
    return userKey
  },

  //알림받을 정보를 저장
  saveNotificationInfo(type, id) {
    let newNoti = {}
    let notiItems = localStorage.getItem(`notifications_${type}`);
    let notifications
    if(typeof notiItems != 'object'){
      notifications = {}
    }else{
      notifications = JSON.parse(notiItems) || {}
    }
    //오래된 key 들 삭제(기한 7일)
    for (let key in notifications) {
      if (dayjs().diff(dayjs(notifications[key]), 'days') <= 7) {
        newNoti[key] = notifications[key]
      }
    }
    newNoti[id] = dayjs().format()
    localStorage.setItem(`notifications_${type}`, JSON.stringify(newNoti))
  },

  //알림 여부를 판단
  checkSendNotification(type, id) {
    const notifications = JSON.parse(localStorage.getItem(`notifications_${type}`)) || {}

    let notiInfo = notifications[id]

    if (notiInfo) {
      return true
    } else {
      return false
    }
  },

  newNoti(msg,evtData,id){

    console.log(evtData)
    const noti = new Notification(msg, {
      icon: `../public/noti_icon.jpg`,                 
      body: evtData.content
  });

  noti.onclick = function (event) {
    event.preventDefault();         // 알림 클릭의 기본 동작을 방지
    cmmn.navigateToSection(id)        // id 위치로 이동
};

setTimeout(() => {
    noti.close()
}, 10000)

  return noti
  },

  navigateToSection(sectionId) {
    window.focus()
    location.hash = `#${sectionId}`

    //비동기화 -> 현재 큐의 비동기 함수 모두 실행 후 실행됨.
    setTimeout(() => {
      const element = document.getElementById(sectionId)
      if (element) {
        element.focus()
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 0)
  },
  //공통코드를 서버에서 가져옴
  async getCmcd(cd) {
    try {
      const res = await axios.get(`${cmmn.url}/cmmn/cmcd/${cd}`)
        if (res.data.ok == true) {
          return res.data.result
        } else {
          alert('서버와의 통신에 실패했습니다.')
          throw new Error('Comm error')
        }
    } catch(error) {
      console.error(error)
    }
  }
}

export default cmmn
