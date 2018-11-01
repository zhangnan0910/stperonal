import React, { Component } from 'react'
import {
    Form,
    Button,
    Radio,
    Switch,
    Icon,
    Input,
    Breadcrumb,
    message
} from 'antd'
import {Link} from 'react-router-dom'
const { TextArea } = Input
// import FreeScrollBar from 'react-free-scrollbar'
import AddTeacher from '@/pages/course/create/AddTeacher'
import AddStudent from '@/pages/course/create/AddStudent'
import NetdiskResources from "@/pages/course/create/NetdiskResources";
import { getCookie } from '@/utils/cookies';
import HoverDelete from '@/pages/course/create/HoverDelete'
import Http from "@/utils/http"

const FormItem = Form.Item;
export default class EditClass extends Component {
    constructor() {
        super()
        this.state = {
            getcookies: JSON.parse(unescape(unescape(getCookie("login-token")))),
            courseName: '',
            teacher_name: '',
            count: '',
            duration: 30,
            course_id: '',
            teacherVal: [],
            studentVal: [],
            type: null,
            teacherJson: [],
            studentJson: [],
            folderId: [],
            teacherNum: 0,
            record: '',
            notice: '',
            class_count: 0,
            studentAvatar:''
        }
    }

    componentDidMount() {
        // 获取此课程下的学生
        Http.post('/course/get-course-info',{
                courseId: this.props.match.params.id,
            }
        ).then(data => {
            let datas = data.data;
            if (data.error_info.errno === 1) {
                this.setState({
                    courseName: datas.course_name,
                    teacher_name: datas.teacher_name,
                    studentNum: datas.student_num,
                    course_id: this.props.match.params.id,
                    studentVal: datas.studentList,
                    teacherVal: [datas.teacher],
                    teacherNum: 1,
                    folder_name: datas.folder_name,
                    type: datas.type,
                    notice: datas.notice,
                    record: datas.record,
                    class_count: datas.class_count,
                    folderId: datas.folderId,
                })
            }
        })
    }

    onChange = (checked) => {
        this.setState({
            record: checked == true ? 1 : 0
        });
    }
    courefolder_namechange(e) {
        this.setState({
            folder_name: e.target.value
        })
    }

    // 课件数量
    changenum(e) {
        this.setState({
            count: e.target.value
        })
    }

    // 课件时长
    changeduration(e) {
        this.setState({
            duration: e.target.value
        })
    }

    // 提交改变的数据
    submits = () => {
        let { teacherVal, studentVal,courseName,course_id, folderId,record,type,notice } = this.state
        // if(teacherVal[0]&&(type===1?studentVal[0]:1)&&courseName!==''){
            if(!(courseName.length<=30&&courseName.length>=1)){
                message.destroy()
                message.error('请输入正确的课节标题')
            }else if(!teacherVal[0]){
                message.destroy()
                message.error('教师不能为空')
            }else if(type===1?!studentJson[0]:null){
                message.destroy()
                message.error('学生不能为空')
            }else{
                Http.post('/course/edit-course-new',{
                        courseName: courseName,
                        courseId: course_id,
                        teacherJson: JSON.stringify(teacherVal),
                        studentJson: studentVal[0]?JSON.stringify(studentVal):[],
                        folderId: JSON.stringify(folderId),
                        record,
                        notice
                    }
                ).then(data => {
                    if (data.error_info.errno === 1) {
                        message.destroy();
                        message.success('修改成功')
                        this.props.history.push({
                            pathname: '/class',
                        })
                    } else {
                        message.destroy();
                        message.error(data.error_info.error)
                    }
                })
        }
        
        
    }
    // 老师确定返回的数据
    teacherChild = (e) => {
        let data = e.map(res => {
            return {
                teacherAccount: res.teacherAccount,
                teacherName: res.teacherName,
                teacherAvatar:res.teacherAvatar
            }
        })
        this.setState({
            teacherVal: data,
            teacherNum: data.length
        })
    }
    studentChild = (e) => {
        let data = e.map(res => {
            return {
                studentAccount: res.studentAccount,
                studentName: res.studentName,
                studentAvatar:res.studentAvatar
            }
        })
        this.setState({
            studentVal: data,
            studentNum: data.length
        })
    }
    teacherChildList = (e) => {
        let data = []
        this.state.teacherVal.map(res => {
            if (res.teacherAccount !== e) {
                message.destroy();
                message.success('删除成功')
                data.push(res)
            }
        })

        this.setState({
            teacherVal: data,
            teacherNum: data.length
        })
    }
    studentChildList = (e) => {
        let data = []
        this.state.studentVal.map(res => {
            if (res.studentAccount != e) {
                data.push(res)
            }
        })
        this.setState({
            studentVal: data,
            studentNum: data.length
        })
    }

    fetchNetDiskFileID(folderId) {
        this.setState({
            folderId: folderId
        })
    }

    onPressEnter = (e) => {
        if (e.target.value.length < 30) {
            this.setState({
                notice: e.target.value
            })
        } else {
            message.destroy();
            message.error('公告信息,最多30个字')
        }
    }

    render() {
        const { isPublic, teacherVal, courseName, studentVal, folderId } = this.state;
        return (
            <div className='course-box'>
                <div style={{ display: "flex",paddingBottom:15 }}>
                    <Breadcrumb  style={{ flex: "95%" }}>
                        <Breadcrumb.Item >
                            教学管理
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to='/class'>课程管理</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            编辑课程
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div className='course-box-content'>
                    <div style={{ padding: 15, borderBottom: "0.5px solid #ccc" }}>
                        <h3>编辑课程</h3>
                    </div>
                    <div className='course-box-content-content'>
                        <Form style={{ width: '40%' }}>
                            <FormItem
                                label="课程类型"
                                style={{ display: 'flex' }}
                            >
                                <span>{this.state.type == '0' ? '公开课' : '标准课'}</span>
                            </FormItem>
                            <FormItem
                                label="课程标题"
                                style={{ display: 'flex', marginTop: 25 }}>
                                <input
                                    type="text"
                                    value={courseName}
                                    className="ant-input"
                                    className="ant-input"
                                    onBlur = {()=>{
                                        this.state.courseName.length>30?message.error('课程标题最大长度30个字'):null
                                    }}
                                    onChange={(e) => {
                                        this.setState({
                                            courseName: e.target.value
                                        })
                                        
                                    }} />
                            </FormItem>
                            <FormItem
                                label="课节数量"
                                style={{ display: 'flex' }}>
                                <span style={{ marginLeft: 15 }}>{this.state.class_count}</span>
                            </FormItem>
                            <FormItem
                                label="云盘管理"
                                style={{ display: 'flex' }}>
                                <NetdiskResources
                                    folderId={folderId} type="edit"
                                    fetchNetDiskFileID={this.fetchNetDiskFileID.bind(this)}
                                />
                            </FormItem>
                            {
                                this.state.type == 0 ? <FormItem
                                    label="公告设置"
                                    style={{ display: 'flex' }}>
                                    <TextArea autosize={{ minRows: 4, maxRows: 4 }}
                                        cols='30'
                                        defaultValue={this.state.notice}
                                        maxLength='30'
                                        onChange={this.onPressEnter}
                                    ></TextArea>
                                </FormItem> : null
                            }
                            <FormItem
                                style={{ display: 'flex' }}
                                label="录制">
                                <Switch defaultChecked={this.props.match.params.record == 1 ? true : false}
                                    onChange={this.onChange} />
                            </FormItem>
                            <FormItem>
                                <div style={{color:'red',fontSize:12, marginLeft: 30}}>您所编辑的课程信息将会同步到当前课程中的所有课节中</div>
                                <Button type="primary" style={{ maxWidth: 260, marginLeft: 30 }} block onClick={this.submits}>
                                    提交
                                </Button>
                            </FormItem>
                        </Form>
                        <div className="course-box-content-content-right">
                            <div className="right-title">
                                <span>教师 ( <b style={{ color: "#1093ED" }}>{this.state.teacherNum} / 1</b> )</span>
                                {this.state.type == 1 ? <span>学生 ( <b
                                    style={{ color: "#1093ED" }}>{this.state.studentNum} / 6</b>)</span> : null}
                            </div>
                            <div style={{ display: 'flex' }}>
                                <ul className='scrollbar'>
                                    <AddTeacher teacherChild={this.teacherChild} num={this.teacherNum}></AddTeacher>
                                    {
                                        teacherVal[0] ? teacherVal && teacherVal.map((res, index) => {
                                            return <HoverDelete key={index} teacherChildList={this.teacherChildList}
                                                res={res}></HoverDelete>
                                        })
                                            : null
                                    }
                                </ul>
                                {this.state.type == 1 ? <ul className='scrollbar'>
                                    <AddStudent studentChild={this.studentChild} num={this.studentNum}></AddStudent>
                                    {
                                        studentVal && studentVal.map((res, index) => {
                                            return <HoverDelete key={index} studentChildList={this.studentChildList}
                                                res={res}></HoverDelete>
                                        })
                                    }
                                </ul> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        )
    }
}
