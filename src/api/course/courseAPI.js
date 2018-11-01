import http from '@/utils/http';

const url = 'http://dev.3tclass.3ttech.cn/static/agent.php';

//获取首页数据

export function fetchIndexList({actionUrl, SID, safeKey, timeStamp}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//获取课程列表
export function fetchCourseList({actionUrl, SID, safeKey, timeStamp, courseStatus, page, perpage}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        courseStatus,
        page,
        perpage,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//获取课节列表
export function fetchLessonList({actionUrl, SID, safeKey, timeStamp, courseId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        courseId,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    });
}

//创建课程
export function createCourse({actionUrl, SID, safeKey, timeStamp, courseName, folderId, Filedata, expiryTime, mainTeacherAccount, courseIntroduce}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        courseName,
        folderId,
        Filedata,
        expiryTime,
        mainTeacherAccount,
        courseIntroduce
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

// 编辑课程
export function editCourse({actionUrl, SID, safeKey, timeStamp, courseId, folderId, courseName, expiryTime, mainTeacherAccount, stamp, Filedata, courseIntroduce}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        courseId,
        folderId,
        courseName,
        expiryTime,
        mainTeacherAccount,
        stamp,
        Filedata,
        courseIntroduce
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

// 删除课程
export function deleteCourse({actionUrl, SID, safeKey, timeStamp, courseId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        courseId
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

// 删除课节
export function deleteLesson({actionUrl, SID, safeKey, timeStamp, courseId, classId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        courseId,
        classId
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

// 获取机构下教师列表
export function fetctTeacherList({actionUrl, SID, safeKey, timeStamp, perpage}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        perpage
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

// 获取机构下学生列表
export function fetctStudentList({actionUrl, SID, safeKey, timeStamp, perpage}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        perpage
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

// 手机号搜索
export function searchMolileUser({actionUrl, SID, safeKey, timeStamp, mobile}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        mobile
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

//获取教师和学生分组
export function fetchUserGroup({actionUrl, SID, safeKey, timeStamp, page, perpage, groupId, type}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        page,
        perpage,
        groupId,
        type
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

//获取获取机构分组
export function fetchSIDGroup({actionUrl, SID, safeKey, timeStamp, page, perpage}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        page,
        perpage,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

//批量编辑
export function editCreateLesson({actionUrl, SID, safeKey, timeStamp, classJson, classId, className, classDate, beginTime, duration, courseId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        classJson,
        classId,
        className,
        classDate,
        beginTime,
        duration,
        courseId
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}


//获取设置课节列表
export function fetchSetCourseList({actionUrl, SID, safeKey, timeStamp, courseId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        courseId,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}

//获取课节信息
export function fetchLessonInfo({actionUrl, SID, safeKey, timeStamp, classId}) {
    return http.post(url, {
        actionUrl,
        SID,
        safeKey,
        timeStamp,
        classId,
    }, {
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    })
}