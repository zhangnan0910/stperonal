import http from '@/utils/http';

let url = 'http://dev.3tclass.3ttech.cn/static/agent.php';
// const url = 'http://dev.3tclass.3ttech.cn/static/1.php';

//获取云盘文件夹列表
export function fetchCloudPlateList({actionUrl, SID, safeKey, timeStamp, folderId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        folderId
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//获取顶级文件夹ID
export function fetchTopFolderId({actionUrl, SID, safeKey, timeStamp}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//获取云盘文件列表
export function fetchNetdiskList({actionUrl, SID, safeKey, timeStamp, folderId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        folderId,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//删除文件
export function deleteFile({actionUrl, SID, safeKey, timeStamp, fileId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        fileId,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//删除目录
export function deleteFolder({actionUrl, SID, safeKey, timeStamp, folderId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        folderId,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//移动文件
export function mobileFolder({actionUrl, SID, safeKey, timeStamp, folderId, newfolderId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        folderId,
        newfolderId
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//复制文件
export function copyFolder({actionUrl, SID, safeKey, timeStamp, folderId, newfolderId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        folderId,
        newfolderId
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//创建文件夹
export function createFolder({actionUrl, SID, safeKey, timeStamp, folderName, folderId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        folderName,
        folderId
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//上传文件
export function uploadFile({actionUrl, SID, safeKey, timeStamp, folderId, file}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        folderId,
        file,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//创建文件夹
export function createTopFolder({actionUrl, SID, safeKey, timeStamp, folderName}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        folderName,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//文件搜索
export function searchFolder({actionUrl, SID, safeKey, timeStamp, connect}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        connect,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//课程note
export function setNote({actionUrl, SID, safeKey, fileId, page, note}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        fileId,
        page,
        note
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//获取文件详情
export function fileDetil({actionUrl, SID, safeKey, fileId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        fileId,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//面包屑
export function fetchBreadCrumbs({actionUrl, SID, safeKey, timeStamp, folderId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        folderId,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}