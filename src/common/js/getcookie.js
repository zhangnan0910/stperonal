import {getCookie} from '@/utils/cookies'
let obj = {
    
}
if(getCookie('login-token')){
    let {
        UID,
        safeKey,
        timeStamp
    } = JSON.parse(unescape(unescape(getCookie("login-token"))))

    obj = {
        UID,
        safeKey,
        timeStamp
    }
    
}
export default obj