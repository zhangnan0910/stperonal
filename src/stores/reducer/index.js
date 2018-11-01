import {combineReducers} from "redux"
import {getCookie} from '@/utils/cookies'
import {
    GET_DATA_START,
    GET_DATA_SUCCESS,
    GET_GROUP_SUCCESS,
    GET_DELETE_TEACHER,// 删除教师
    GET_TEACHERDATA_SUCCESS,//获取教师列表
} from '@/stores/reducer/variable'
// 用户分组
function usergroup(state=[],action){
    switch (action.type) {
        case GET_DATA_START:
            return 'loading'
            break;
        case GET_GROUP_SUCCESS:
            return action.payload
            break;
       
        default:
            return state
            break;
    }
}
// 分组下的l教师和学生
function usergroupList(state=[],action){
    switch (action.type) {
        case GET_DATA_START:
            return 'loading'
            break;
        case GET_DATA_SUCCESS:
            return action.payload
            break;
        case GET_DELETE_TEACHER:
            return action.payload
            break;
        default:
            return state
            break;
    }
}
// 获取cookie
function getcookie(){
    return JSON.parse(unescape(unescape(getCookie("login-token"))))
}
// 教师列表
function userteacher(state=[],action){
    switch (action.type) {
        case GET_DATA_START:
            return 'loading'
            break;
        case GET_TEACHERDATA_SUCCESS:
            return action.payload
            break;
        default:
            return state
            break;
    }
}
// 添加教师
function addteacher(state=[],action){
    switch (action.type) {
        case GET_DATA_START:
            return 'loading'
            break;
        case GET_DATA_SUCCESS:
            return action.payload
            break;
        default:
            return state
            break;
    }
}
const reducer =  combineReducers({
    // 用户
    usergroup, // 获取分组列表
    usergroupList, // 获取默认文件下的学生和教师
    getcookie, // 获取cookie
    userteacher, // 获取教师列表
    addteacher, // 添加教师
    
})
    

export default reducer