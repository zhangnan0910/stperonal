import {getCookie,delCookie,setCookie} from '@/utils/cookies'
let unCode = JSON.parse(unescape(unescape(getCookie("login-token"))))
export let getcookie = ()=>{
    if(getCookie('login-token')){
        let {
            SID,
            safeKey,
            timeStamp
        } = JSON.parse(unescape(unescape(getCookie("login-token"))))
        return {
            SID,
            safeKey,
            timeStamp
        }  
    }
} 
export const baseUrl = () => {
    let url = '';
    if (process.env.API_ENV == 'development') {
        // 真实路径
         url = "https://devapi3tclass.3ttech.cn"
    } else if (process.env.API_ENV == 'preproduction') {
         url = 'https://preapi3tclass.3ttech.cn'
    } else {
         url = 'https://api3tclass.3ttech.cn'
    }
    return url;
}