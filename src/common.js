//깊은복사
import dotenv from 'dotenv'

const cmmn = {
  url : import.meta.env.VITE_BACK_URL,
  wsUrl : import.meta.env.VITE_BACK_WSURL,
  deepCopy: (obj) => {
  if (obj === null || typeof obj !== 'object') return obj;
  
  let copy = {};
  for (let key in obj) {
    copy[key] = cmmn.deepCopy(obj[key]);
  }
  return copy;
  },
  formatSecondsAsTime : (secs, format) => {
    var hr  = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600))/60);
    var sec = Math.floor(secs - (hr * 3600) -  (min * 60));
  
    if (hr < 10)  { hr    = "0" + hr; }
    if (min < 10) { min = "0" + min; }
    if (sec < 10) { sec  = "0" + sec; }
    if (!hr)       { hr   = "00"; }
  
    if (format != null) {
      var formatted_time = format.replace('hh', hr);
      formatted_time = formatted_time.replace('h', hr*1+""); // check for single hour formatting
      formatted_time = formatted_time.replace('mm', min);
      formatted_time = formatted_time.replace('m', min*1+""); // check for single minute formatting
      formatted_time = formatted_time.replace('ss', sec);
      formatted_time = formatted_time.replace('s', sec*1+""); // check for single second formatting
      return formatted_time;
    } else {
      return hr + ':' + min + ':' + sec;
    }
  },
  //hh:mm:ss 를 초로 변환
   convertHmsToSec : (hms) =>{
    let timeArr = hms.split(':')
    let hr = Number(timeArr[0])
    let min = Number(timeArr[1])
    let sec = Number(timeArr[2])
    return hr *3600 + min * 60 + sec 
   },
   convertSecToHms : (totSec) => {
    let hr = Math.floor(totSec/3600)
    let min = Math.floor(totSec%3600/60)
    let sec = Math.floor(totSec%60)

    if(hr < 10) hr = '0' + hr
    if(min < 10) min = '0'+ min
    if(sec < 10) sec = '0' + sec
    
    return `${hr}:${min}:${sec}`  
  }
  
}

export default cmmn
