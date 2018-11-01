import React from 'react';
import {
    Form,
    Input,
    Select,
    Button,
    Radio,
    Switch,
    Breadcrumb,
    Tabs,
    message,
    InputNumber
} from 'antd';

const {TextArea} = Input
import FreeScrollBar from 'react-free-scrollbar'
import "./style.less";
import AddTeacher from "@/pages/course/create/AddTeacher";
import AddStudent from "@/pages/course/create/AddStudent";
import {getCookie} from '@/utils/cookies';
import Http from "@/utils/http"
import HoverDelete from '@/pages/course/create/HoverDelete'
import NetdiskResources from "@/pages/course/create/NetdiskResources";
import {Link} from 'react-router-dom'
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
const TabPane = Tabs.TabPane;
const Search = Input.Search;

export default class CreateClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getcookies: JSON.parse(unescape(unescape(getCookie("login-token")))),
            isPublic: true,
            courseName: '',
            count: 1,
            val: [],
            type: 1,
            teacherJson: [],
            studentJson:[],
            teacherVal: [],
            studentVal: [],
            duration: 30,
            teacherNum: 0,
            studentNum: 0,
            arr: [],
            notice: '',
            record: 1,
            folderId: [],
            disabledFlag:false
        }
    }
    render() {
        const {teacherVal, studentVal, folderId} = this.state;
        const styles = {width: '100%', height: 390}
        return (
            <div className='course-box'>
                <div style={{display: "flex",paddingBottom:15}}>
                    <Breadcrumb  style={{flex: "95%"}}>
                    <Breadcrumb.Item >
                        教学管理
                    </Breadcrumb.Item>
                        <Breadcrumb.Item >
                            <Link to='/class'>课程管理</Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {this.props.location.state.text}
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    {/* <Button style={{flex: "5%", margin: "0 0 15px 0"}}>
                        <Icon type="sync"/>
                    </Button> */}
                </div>
                <div className='course-box-content'>
                    <div style={{padding: 15, borderBottom: "0.5px solid #ccc"}}>
                        <h3>{this.props.location.state.text}</h3>
                    </div>
                    <div className='course-box-content-content'>
                        <Form style={{width: '40%'}}>
                            <FormItem
                                label="课程类型"
                                style={{display: 'flex'}}
                            >
                                <Radio.Group
                                    defaultValue="标准课"
                                    onChange={e => {
                                        this.setState({
                                            type: e.target.value === '公开课' ? 0 : 1,
                                        })
                                    }}>
                                    <Radio value="标准课">标准课</Radio>
                                    <Radio value="公开课">公开课</Radio>
                                </Radio.Group>
                            </FormItem>
                            <FormItem
                                label="课程标题"
                                style={{display: 'flex', marginTop: 25}}>
                                <input
                                    type="text"
                                    placeholder="请输入课程标题"
                                    className="ant-input"
                                    // onBlur = {()=>{
                                    //     let courseName = this.state.courseName
                                    //     message.destroy()
                                    //     courseName.length<=30&&courseName.length>0?null:message.error('课程标题最大长度30个字')
                                    // }}
                                    onInput={(e) => {
                                        this.setState({
                                            courseName: e.target.value
                                        })
                                    }}/>
                            </FormItem>
                            {
                                this.state.type === 0 ? null :
                                    <FormItem
                                        label="课节数量"
                                        style={{display: 'flex'}}>
                                        <input type="text"
                                               className='ant-input'
                                               style={{width: 50, textAlign: 'center'}}
                                            //    onBlur = {()=>{
                                            //        message.destroy()
                                            //        let count = +this.state.count
                                            //        count<=15&&count>=1?null:message.error('课节数量请输入1-15之间的数字')
                                            //    }}
                                               value={this.state.count}
                                                onChange={(e) => {
                                                    this.setState({
                                                        count: e.target.value
                                                    })
                                                }}/>
                                    </FormItem>
                            }
                            <FormItem
                                label="课节时长"
                                style={{display: 'flex'}}>
                                <input type="text"
                                    className='ant-input'
                                    style={{width: 50, textAlign: 'center'}}
                                    // onBlur = {()=>{
                                    //     let duration = +this.state.duration
                                    //     message.destroy()
                                    //     duration<=150&&duration>=10?null:message.error('课节时长请输入10-150之间的数字')
                                    // }}
                                    value={this.state.duration}
                                    onChange={(e) => {
                                        this.setState({
                                            duration:e.target.value
                                        })
                                    }}/>
                                <span style={{marginLeft: 15}}>分钟</span>
                            </FormItem>
                            <FormItem
                                label="云盘管理"
                                style={{display: 'flex'}}>
                                <NetdiskResources folderId={folderId} type="create"
                                                  fetchNetDiskFileID={this.fetchNetDiskFileID.bind(this)}
                                />
                            </FormItem>
                            {
                                this.state.type == 0 ? <FormItem
                                    label="公告设置"
                                    style={{display: 'flex'}}>
                                    <TextArea
                                        autosize={{minRows: 4, maxRows: 4}}
                                        cols="25"
                                        defaultValue={this.state.notice}
                                        onChange={this.onPressEnter}
                                        placeholder="请输入公告信息,最多30个字"
                                        onBlur = {()=>{
                                            if(this.state.notice.length>30){
                                                message.destroy();
                                                message.error('公告信息,最多30个字')
                                            }
                                        }}
                                    ></TextArea>
                                </FormItem> : null
                            }
                            <FormItem
                                style={{display: 'flex'}}
                                label="录制">
                                <Switch defaultChecked onChange={this.onChange}/>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" 
                                    block
                                    disabled = {this.state.disabledFlag}
                                    style={{maxWidth: 260, marginLeft: 30}} 
                                    onClick={() => {
                                        this.submits()
                                    }}>
                                    下一步
                                </Button>
                            </FormItem>
                        </Form>
                        <div className="course-box-content-content-right">
                            <div 
                                 className="right-title">
                                <span>教师 ( <b style={{color: "#1093ED"}}>{teacherVal.length} / 1</b> )</span>
                                {this.state.type === 1 ?
                                    <span>学生 ( <b style={{color: "#1093ED"}}>{studentVal.length} / 6</b> )</span> : null}

                            </div>
                            <div style={{display: 'flex'}}>
                                <ul className='scrollbar'>
                                {console.log(teacherVal)}
                                    <AddTeacher teacherChild={this.teacherChild}></AddTeacher>
                                    {
                                        
                                        teacherVal[0] ? teacherVal && teacherVal.map((res, index) => {
                                            return <HoverDelete key={index} teacherChildList={this.teacherChildList}
                                                                res={res}></HoverDelete>
                                        }) : null
                                    }
                                </ul>
                                {
                                    this.state.type == '1' ? <ul className='scrollbar'>
                                        <AddStudent studentChild={this.studentChild}></AddStudent>
                                        {
                                            studentVal && studentVal.map((res, index) => {
                                                return <HoverDelete key={index} res={res}
                                                                    studentChildList={this.studentChildList}></HoverDelete>
                                            })
                                        }
                                    </ul> : null
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    // 录制
    onChange = (checked) => {
        this.setState({
            record: checked == true ? 1 : 0
        });
    }
    changeduration(e) {
        this.setState({
            duration: e.target.value
        })
    }

    submits = (val) => {
        let {
            courseName, count, teacherJson, studentJson, duration, type, folderId,notice
        } = this.state
        if(courseName.length<1){
            message.destroy()
            message.error('课程标题不能为空')
        }
        else if(!(courseName.length<=30&&courseName.length>=1)){
            message.destroy()
            message.error('课程标题最大长度为30个字')
        }else if(!(+count<=15&&+count>=1)){
            message.destroy()
            message.error('课节数量请输入1-15之间的数字')
        }else if(!(+duration<=150&&+duration>=10)){
            message.destroy()
            message.error('课节时长请输入30-150之间的数字')
        }else if(!teacherJson[0]){
            message.destroy()
            message.error('教师不能为空')
        }else if(type===1?!studentJson[0]:null){
            message.destroy()
            message.error('学生不能为空')
        }else if(notice.length>30){
            message.destroy();
            message.error('公告信息,最多30个字')
        }else{
            if(courseName!=='' && count!=='' && teacherJson[0] && (type===1?studentJson[0]:1) && duration!==''){
                Http.post('/course/create-course',{
                        courseName,
                        type,
                        count,
                        duration,
                        folderId: JSON.stringify(folderId),
                        record: this.state.record,
                        teacherJson: JSON.stringify(teacherJson),
                        studentJson: JSON.stringify(studentJson),
                        notice: this.state.notice
                    }).then(data => {
                    if (data.error_info.errno === 1) {
                        this.setState({
                            disabledFlag:true
                        })
                        message.destroy();
                        message.success('创建成功')
                        setTimeout(()=>{
                            this.props.history.push({
                                pathname: '/setLesson',
                                state: {
                                    rows: data.data,
                                    type: this.state.type
                                }
                            })
                        },1000)
                    } else {
                        message.destroy();
                        message.error(data.error_info.error)
                    }
                })
            }
        }
    }
    // 老师确定返回的数据
    teacherChild = (e) => {
        let data = e.map(res => {
            return {
                account: res.teacherAccount,
                name: res.teacherName,
                teacherAvatar:res.teacherAvatar
            }
        })
        this.setState({
            teacherVal: e,
            teacherJson: data
        })
    }
    studentChild = (e) => {
        let data = e.map(res => {
            return {
                account: res.studentAccount,
                name: res.studentName,
                studentAvatar:res.studentAvatar
            }
        })
        this.setState({
            studentVal: e,
            studentJson: data
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
            teacherJson: data
        })
    }
    studentChildList = (e) => {
        let data = []
        let data1 = []
        this.state.studentVal.map(res => {
            if (res.studentAccount != e) {
                data.push(res)
                data1.push({
                    account: res.studentAccount,
                    name: res.studentName
                })
            }
        })
        this.setState({
            studentVal: data,
            studentJson: data1
        })
    }

    fetchNetDiskFileID(folderId) {
        this.setState({
            folderId: folderId
        })
    }

    onPressEnter = (e) => {
        
        this.setState({
            notice: e.target.value
        })
        
    }
}