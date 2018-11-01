import React, {Component} from 'react';
import {Redirect} from 'react-router-dom'
import Loadable from 'react-loadable';
// 一级路由
import Login from '@/pages/Login';
import Index from '@/pages/Index/index.jsx';
// index->子路由
//机构首页
import Home from '@/pages/home/Home';

//课程管理
import Classes from '@/pages/course/class/Classes';
import Lessons from '@/pages/course/lesson/Lessons';
import CreateClass from '@/pages/course/create/CreateClass';
import SetLesson from "@/pages/course/lesson/SetLesson";
import EditLesson from "@/pages/course/lesson/EditLesson";
import CreateLesson from '@/pages/course/create/CreateLesson';
import Editclass from '../pages/course/class/EditClass'
// 用户管理
import Teacher from '@/pages/Users/teacher/index';
import Student from '@/pages/Users/student/student';
// import Grouping from '@/pages/Users/grouping/index';
import Addteacher from '@/pages/Users/teacher/addteacher';
import Addstudent from "@/pages/Users/student/addstudent";
import TeacherDetail from "@/pages/Users/teacher/TeacherDetail"
//教务管理
import MonitorLesson from "@/pages/eduTask/MonitorLesson";
import PrisonDetail from "@/pages/eduTask/PrisonDetail";
// 机构管理
import CloudPlate from '@/pages/Institution/cloudPlate/CloudPlate';
import CourseNote from "@/pages/Institution/cloudPlate/CourseNote";

const router = {
    routes: [
        {
            path: '/',
            exact: true,
            component: () => <Redirect from='/' to='/home'/>,

        },
        {
            path: '/login',
            exact: true,
            component: Login,
        }, {
            path: '/',
            component: Index,
            children: [
                {
                    path: '/home',
                    name: "home",
                    component: Home
                }, { // 课程管理
                    path: '/class',
                    name: "class",
                    component: Classes
                }, {
                    path: '/setLesson',
                    name: "setLesson",
                    component: SetLesson
                }, {
                    path: '/lesson',
                    name: "lesson",
                    component: Lessons
                }, {
                    path: "/create",
                    name: "create",
                    component: CreateClass
                }, {
                    path: "/detail",
                    name: "detail",
                    component: CreateLesson
                }, {
                    path: "/editLesson",
                    name: "editLesson",
                    component: EditLesson
                },
                {
                    path: "/editclass/:id/:record",
                    name: "editclass",
                    component: Editclass
                },
                {// 用户管理
                    path: '/teacher',
                    name: "teacher",
                    // component:TeacherDetail
                    component: Teacher
                },
                {
                    path: "/teacherDetail/:id",
                    name: "teacherDetail",
                    component: TeacherDetail
                },
                {
                    path: '/addteacher',
                    name: "addteacher",
                    component: Addteacher
                },
                {
                    path: '/addstudent',
                    name: "addstudent",
                    component: Addstudent
                },
                {
                    path: '/student',
                    name: "student",
                    component: Student
                },
                // {
                //     path: '/grouping',
                //     name: "grouping",
                //     component: Grouping
                // }, 
                {
                    path: '/monitor',
                    name: "monitor",
                    component: MonitorLesson
                }, {
                    path: '/prison',
                    name: "prison",
                    component: PrisonDetail
                },
                // , { // 机构管理
                //     path: '/institution',
                //     name: "institution",
                //     component: Institution
                // },
                {
                    path: '/netdisk',
                    name: "netdisk",
                    component: CloudPlate
                }, {
                    path: '/note',
                    name: "note",
                    component: CourseNote
                }
            ]
        }


    ]
}

const routes = router.routes
export {routes}
export default router