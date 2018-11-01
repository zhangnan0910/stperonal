
export default function getAvatarUrl(user) {
    let url;
    if (user.avatar) {
        url = user.avatar;
    } else {
        // const imgSubName = user.userId % 30;
        // url = `/resources/images/user/avatar_${imgSubName}.png`;
        const imgSubName = user % 32 +1;
        url = `https://userservice.oss-cn-beijing.aliyuncs.com/avatar/avator_${imgSubName}.png`
        // let num = imgSubName<10?'0'+imgSubName:imgSubName
        // url = num
        // url = `../../../assets/imgs/avatar/icon_0${num}.png`
    }

    return url;
}