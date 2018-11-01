import React, { Component } from 'react'
import {
    Tabs,
    Table,
    Spin,
    Layout,
    Breadcrumb,
    Pagination
} from "antd"
import Http from "@/utils/http"
import "./index.less"
const TabPane = Tabs.TabPane
import { getCookie } from '@/utils/cookies'
import Random from "@/utils/random"
import moment from 'moment';
const { Content } = Layout
export default class teacherDetail extends Component {
    constructor() {
        super()
        this.state = {
            userId: [],
            classdata: [],
            readom: null,
            users1: '',
            users2: '',
            total:10,
            page:1,
            perpage:10,
            loading:false,
            getcookies: JSON.parse(unescape(unescape(getCookie("login-token")))),
        }
    }
    componentDidMount() {
        let { location } = this.props
        let users2 = location.state.teacherName?(location.state.teacherName?location.state.teacherName:'未设置昵称'):(location.state.studentName?location.state.studentName:'未设置昵称')
        // console.log(users2)
        let a;
        if(location.state.studentAccount){
            a = location.state.studentAvatar? location.state.studentAvatar:Random(location.state.studentAccount)
        }else if(location.state.teacherAccount){
            a = location.state.teacherAvatar? location.state.teacherAvatar:Random(location.state.teacherAccount)
        }
        this.setState({
            readom:a,
            users1: location.state.teacherAccount ? '教师管理' : '学生管理',
            users2,
            loading:true
        })
        // 获取教师学生信息变量
        let ID = location.state.teacherAccount ? location.state.teacherAccount : location.state.studentAccount
        let detailurl = location.state.teacherAccount ? '/school/get-teacher-info' : '/school/get-student-info'
        // 获取教师或者学生详情
        Http.post(detailurl,{
                [location.state.teacherAccount ? 'teacherAccount' : 'studentAccount']: ID,
                
            }).then(res => {
            if (res.error_info.errno == 1) {  
                this.setState({
                    userId: res.data,
                    loading:false
                })
            }

        }).catch(e => { })
        // 获取教师学生课节变量
        let url = location.state.teacherAccount ? '/course/get-teacher-class-list' : '/course/get-student-class-list'
        // 课节列表
        Http.post(url,{
            [location.state.teacherAccount ? 'teacherAccount' : 'studentAccount']: ID,
            page:this.state.page,
            perpage:this.state.perpage
        }).then(res => {

            if (res.error_info.errno == 1) {
                this.setState({
                    classdata: res.data.list,
                    total:res.data.countTotal
                })
            }

        }).catch(e => { })
    }
    handleTableChange = (cur, pageSize) => {
        let { location } = this.props
        // this.setState({loading:true})
        let ID = location.state.teacherAccount ? location.state.teacherAccount : location.state.studentAccount
        // 获取教师学生课节变量
        let url = location.state.teacherAccount ? '/course/get-teacher-class-list' : '/course/get-student-class-list'
        // 课节列表
        Http.post( url,{
            [location.state.teacherAccount ? 'teacherAccount' : 'studentAccount']: ID,
            page:cur,
            perpage:pageSize
        }).then(res => {
            if (res.error_info.errno == 1) {
                this.setState({
                    classdata: res.data.list,
                    total:res.data.countTotal,
                    page: cur,
                    perpage: pageSize,
                    loading:false
                })
            }

        }).catch(e => { })
    }
    render() {
        let { columns, classdata, userId, readom, users1, users2 } = this.state
        if (readom) {
            return (
                <Layout className="commons">
                    <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>
                      用户管理
                    </Breadcrumb.Item>
                        <Breadcrumb.Item style={{cursor: 'pointer'}} onClick={()=>{
                            users1==='学生管理'?this.props.history.push('/student'):this.props.history.push('/teacher')
                        }}>{users1}</Breadcrumb.Item>
                        <Breadcrumb.Item>{users2}</Breadcrumb.Item>
                    </Breadcrumb>
                    <Content className="user-content">
                        <div>
                            <span>{users1==='教师管理'?'教师详情':'学生详情'}</span>
                        </div>
                        <div style={{ display: "flex", padding: 10 }} className="teacher-detail">
                            <ul className="teacher-detail-left">
                                <li>{users2}</li>
                                <li>
                                    <span></span>
                                    <img src={userId.teacherAvatar ? userId.teacherAvatar : readom} alt="" />
                                    <span></span>
                                </li>
                                {/* <li>
                                    <span>综合评分</span>
                                    <Rate disabled defaultValue={userId.compositeScore?userId.compositeScore:5} />
                                </li> */}
                                <li>
                                    <span>课程进度</span>
                                    <span>{userId.courseProgress}</span>
                                </li>
                                <li>
                                    <span>课节进度</span>
                                    <span>{userId.classProgress}</span>
                                </li>
                                <li>
                                    <span>账号</span>
                                    <span>{userId.teacherAccount?userId.teacherAccount:userId.studentAccount}</span>
                                </li>
                                {/* <li>
                                    <span>性别</span>
                                    <span>{userId.sex == 1 ? '男' : '女'}</span>
                                </li>
                                <li>
                                    <span>邮箱</span>
                                    <span>{userId.email}邮箱</span>
                                </li> */}
                                {/* <li>
                                    <span>地区</span>
                                    <span>{userId.city}</span>
                                </li> */}
                                <li>
                                    <span>注册时间</span>
                                    <span>{userId.registerTime}</span>
                                </li>
                                {/* <li>
                                    <span>简介</span>
                                    <span>{userId.description}</span>
                                </li> */}
                            </ul>
                            <div className="teacher-detail-right" style={{ marginLeft: 20 }}>
                                <Tabs defaultActiveKey="1" >
                                    <TabPane tab="课节列表" key="1"></TabPane>
                                </Tabs>
                                <div style={{width:'100%',height:'100%'}}>
                                    <Table 
                                        rowKey={record =>record.id}
                                        pagination={false}
                                        columns={this.columns()}
                                        dataSource={classdata}
                                        loading = {this.state.loading}
                                        locale = {
                                            {emptyText:'暂无数据'}
                                          } />
                                    {+this.state.total<0?null:<Pagination
                                        style={{ textAlign: "right", padding: "10px 0px" }}
                                        total={+this.state.total}
                                        pageSize={this.state.perpage}
                                        defaultCurrent={1}
                                        onChange={this.handleTableChange} />}
                                </div>
                                
                            </div>
                        </div>
                    </Content>
                </Layout>
            )
        } else {
            return <Spin />
        }

    }
    columns = () =>{
        return [{
            title: '课节名称',
            dataIndex: 'class_name',
            key: 'class_name',
            width:160,
            render: (val) => {
                return <span className='ellipsis'>{val}</span>
            }
        }, {
            title: '课程名称',
            dataIndex: 'course_name',
            key: 'course_name',
            align:'center',
            width:160,
            render: (val) => {
                return <span className='ellipsis'>{val}</span>
            }
        }, {
            title: '类型',
            dataIndex: 'type',
            align:'center',
            key: 'type',
            render: (val) => {
                val = val == "0" ? "公开课" : "标准课";
                return <span>{val}</span>
            }
        }, {
            title: '开课日期',
            dataIndex: 'class_date1',
            align:'center',
            key: 'class_date',
            render: (text, record) => {
                return <span>{moment(moment.unix(record.class_btime)).format('YYYY-MM-DD')}</span>
            }
        }, {
            title: '时间',
            dataIndex: 'class_btime',
            align:'center',
            key: 'class_btime',
            render: (text, record) => {
                return <span>{moment(moment.unix(record.class_btime)).format('HH:mm')}</span>
            }
        }, {
            title: '时长',
            key: 'duration',
            align:'center',
            dataIndex: 'duration',
        }, {
            title: '课节状态',
            key: 'status',
            dataIndex: 'status',
            align:'center',
            render: (val) => {
                if (val == "0") {
                    val = "未上课"
                } else if (val == "1") {
                    val = "上课中"
                } else {
                    val = "已结束"
                }
                return <span>{val}</span>
            }
        },
        //  {
        //     title: '实际时长',
        //     key: 'seat_num1',
        //     dataIndex: 'seat_num1',
        // }, 
        {
            title: '学生数',
            key: 'stu_num',
            align:'center',
            dataIndex: 'stu_num',
            render:(val)=>{
                if(val==='0'){
                    return <span>--</span>
                }else{
                    return <span>{val}</span>
                }
            }
        }]
    }
}
