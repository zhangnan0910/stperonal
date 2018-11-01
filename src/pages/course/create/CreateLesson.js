import React from 'react';
import {
    Form,
    Input,
    DatePicker,
    Select,
    Button,
    Radio,
    Switch,
    Icon,
    Breadcrumb,
    Checkbox,
    Modal,
    Avatar,
    Tabs,
    Table,
    InputNumber,
    TimePicker
} from 'antd';
import {Link} from "react-router-dom";
import "./style.less";
import {getCookie} from '@/utils/cookies';
import AddTeacher from "@/pages/course/create/AddTeacher";
import AddStudent from "@/pages/course/create/AddStudent";
import FreeScrollBar from 'react-free-scrollbar'
import http from '@/utils/http';
import {message} from "antd/lib/index";
import HoverDelete from '@/pages/course/create/HoverDelete';
import moment from "moment";

const format = 'HH:mm';
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const InputGroup = Input.Group;
const TabPane = Tabs.TabPane;
const Search = Input.Search;
const {TextArea} = Input;
const {RangePicker} = DatePicker;

export default class CreateLesson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: props.location.state,
            className: '',
            classDate: '',
            classTime: `10:30`,
            teacherVal: [],
            teacherJson: [],
            studentVal: [],
            studentJson: [],
            duration: '',
            hour: '',
            minute: '',
            teacherNum: 0,
            studentNum: 0,
            disabledFlag: false
        }
    }

    componentDidMount() {
        const {rows, hour, minute} = this.state;
        (async () => {
            const datas = await http.post("/course/get-course-student", {
                courseId: rows.course_id,
                identity: `1`
            }).then((response) => {
                if (response.error_info.errno === 1) {
                    return response.data
                }
            })
            const arrTeachers = [{
                teacherAccount: rows.teacher_account,
                teacherName: rows.teacher_name,
                avatar: ``
            }]
            this.setState({
                studentVal: datas.studentList,
                teacherVal: arrTeachers,
                studentNum: this.state.studentVal.length,
                teacherNum: this.state.studentVal.length,
                // classDate: rows.course_btime !== "" && parseInt(rows.course_btime) > 0 ? this.timestampToTime(rows.course_btime) : "",
                duration: rows.duration,
                className: rows.course_name
            })
        })()
    }

    // 老师确定返回的数据
    teacherChild = (e) => {
        let data = e.map(res => {
            return {
                teacherAccount: res.teacherAccount,
                teacherName: res.teacherName
            }
        })
        this.setState({
            teacherVal: data,
            // teacherNum: this.state.teacherVal.length
        })
    }
    studentChild = (e) => {
        let data = e.map(res => {
            return {
                studentAccount: res.studentAccount,
                studentName: res.studentName
            }
        })
        this.setState({
            studentVal: data,
            // studentNum: this.state.studentVal.length
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
            // teacherNum: this.state.teacherVal.length
        })
    }
    studentChildList = (e) => {
        let data = []
        let data1 = []
        this.state.studentVal.map(res => {
            if (res.studentAccount !== e) {
                data.push(res)
                data1.push({
                    studentAccount: res.studentAccount,
                    studentName: res.studentName
                })
            }
        })
        this.setState({
            studentVal: data,
            // studentNum: this.state.studentVal.length
        })
    }

    getHour = () => {
        let arr = [];
        for (let i = 0; i < 24; i++) {
            if (i < 10) {
                i = `0` + i
            }
            arr.push(i);
        }
        return arr
    }

    getMinute = () => {
        let arr = [];
        for (let i = 0; i < 60; i++) {
            if (i < 10) {
                i = `0` + i
            }
            arr.push(i);
        }
        return arr
    }


    timestampToTime(timestamp) {
        //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let date = new Date(timestamp * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';

        return `${Y + M + D}`
    }


    addCourseClass = () => {
        const {className, classDate, hour, minute, teacherVal, studentVal, duration, rows} = this.state;
        const istype = (parseInt(rows.type) === 1 ? studentVal.length !== 0 : teacherVal.length !== 0)
        if (className !== "" && teacherVal.length !== 0 && istype && duration !== '' && classDate !== "" && hour !== "" && minute !== '') {
            const createUnix = moment(classDate + `\n` + hour + ":" + minute).unix();
            const curUnix = moment(new Date()).unix() + 1200;
            if (createUnix < curUnix) {
                message.destroy();
                message.error('请设置为最少20分钟后的时间');
            } else {
                http.post("/course/add-course-class-new", {
                    courseId: rows.course_id,
                    className: className,
                    classDate: classDate,
                    beginTime: hour + ":" + minute,
                    duration: duration,
                    teacherJson: JSON.stringify(teacherVal),
                    studentJson: JSON.stringify(studentVal),
                }).then((response) => {
                    if (response.error_info.errno === 1) {
                        this.setState({
                            disabledFlag: true
                        })
                        message.destroy();
                        message.success('创建成功')
                        setTimeout(() => {
                            this.props.history.push({
                                pathname: '/lesson',
                                state: {val: rows}
                            })
                        }, 1000)
                    } else {
                        message.destroy();
                        message.error(response.error_info.error)
                    }
                });
            }
        } else {
            message.destroy();
            message.error('请填写完整信息')
        }
    }

    render() {
        const {className, classTime, classDate, rows, teacherVal, studentVal, duration, teacherNum, studentNum, hour, minute} = this.state;
        const styles = {width: '100%', height: 390};
        const hourArr = this.getHour();
        const minuteArr = this.getMinute();
        return (
            <div style={{padding: 20}}>
                <div style={{display: "flex", margin: "0 0 15px 0"}}>
                    <Breadcrumb style={{flex: "95%"}}>
                        <Breadcrumb.Item>
                            <span>教学管理</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <Link to='/class'>
                                <span>课程管理</span>
                            </Link>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item onClick={() => {
                            if (rows) {
                                this.props.history.push({
                                    pathname: '/lesson',
                                    state: {
                                        val: rows
                                    },
                                })
                            }
                        }}>
                            <span>课节管理</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            标准课
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            创建课节
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    {/*<Button style={{flex: "5%", margin: "0 0 15px 0"}}>*/}
                    {/*<Icon type="sync"/>*/}
                    {/*</Button>*/}
                </div>
                <div style={{backgroundColor: "#fff"}}>
                    <div style={{padding: 15, borderBottom: "0.5px solid #ccc"}}>
                        <h3>创建课节</h3>
                    </div>
                    <div style={{display: "flex", padding: 15}}>
                        <Form style={{width: '50%'}}>
                            <FormItem className="FormItem">
                                <span className="front">课节名称</span>
                                <Input placeholder={"请输入课节名称"}
                                       maxlength={30}
                                       defaultValue={className}
                                       style={{width: 240}}
                                       onChange={(e) => {
                                           this.setState({
                                               className: e.target.value
                                           })
                                       }}
                                />
                            </FormItem>
                            <FormItem className="FormItem">
                                <span className="front">开始日期</span>
                                <DatePicker placeholder="请选择日期"
                                            disabledDate={(current) => {
                                                return current && current < moment().add(-1, 'd')
                                            }}
                                    // defaultValue={moment(new Date())}
                                            style={{width: 240}}
                                            onChange={(e, time) => {
                                                this.setState({
                                                    classDate: time
                                                })
                                            }}/>
                            </FormItem>
                            <FormItem className="FormItem">
                                <span className="front">开始时间</span>
                                <InputGroup style={{display: "inline"}}>
                                    <Select style={{width: 90}}
                                            onChange={(e) => {
                                                this.setState({
                                                    hour: e
                                                })
                                            }}>
                                        {hourArr && hourArr.map((item, index) => {
                                            return (<Option key={index} style={{textAlign: "center"}}>{item}</Option>)
                                        })}
                                    </Select>
                                    <span style={{margin: 5}}>时</span>
                                    <Select style={{width: 90}}
                                            onChange={(e) => {
                                                this.setState({
                                                    minute: e
                                                })
                                            }}>
                                        {minuteArr && minuteArr.map((item, index) => {
                                            return (<Option key={index} style={{textAlign: "center"}}>{item}</Option>)
                                        })}
                                    </Select>
                                    <span style={{margin: 5}}>分</span>
                                </InputGroup>
                            </FormItem>
                            <FormItem className="FormItem">
                                <span className="front">时长</span>
                                <Input type="number"
                                       className='ant-input'
                                       style={{width: 80, textAlign: 'center'}}
                                    // onBlur={() => {
                                    //     let duration = +this.state.duration
                                    //     duration <= 150 && duration >= 10 ? null : message.error('课节时长请输入10-150之间的数字')
                                    // }}
                                       onClick={(e) => {
                                           if (parseInt(e.target.value) < 30) {
                                               message.destroy();
                                               message.error('课节时长请输入30-150之间的数字');
                                               e.target.value = 30;
                                               this.setState({
                                                   duration: e.target.value
                                               })
                                           } else if (parseInt(e.target.value) > 150) {
                                               message.destroy();
                                               message.error('课节时长请输入30-150之间的数字');
                                               e.target.value = 150;
                                               this.setState({
                                                   duration: e.target.value
                                               })
                                           }
                                       }}
                                       value={this.state.duration}
                                       onChange={(e) => {
                                           this.setState({
                                               duration: e.target.value
                                           })
                                       }}/>
                                <span style={{margin: 5}}>分钟</span>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" style={{width: "80%"}}
                                        disabled={this.state.disabledFlag}
                                        onClick={() => {
                                            this.addCourseClass()
                                        }}>创建
                                </Button>
                            </FormItem>
                        </Form>
                        <div className="course-box-content-content-right grouping-right" style={{marginLeft: 20}}>
                            <div style={{display: "flex", height: 40, alignItems: "center"}}
                                 className="grouping-title grouping-title1 right-title">
                                <span>教师 ( <b style={{color: "#1093ED"}}>{teacherVal.length} / 1</b> )</span>
                                <span>学生 ( <b style={{color: "#1093ED"}}>{studentVal.length} / 6</b> )</span>
                            </div>
                            <div style={{display: 'flex'}} className="grouping-right-center teacher ">
                                    <ul className='scrollbar'>
                                        <AddTeacher teacherChild={this.teacherChild}></AddTeacher>
                                        {
                                            teacherVal && teacherVal.map((res, index) => {
                                                const arrTeacher = {
                                                    teacherAccount: res.account || res.teacherAccount,
                                                    teacherName: res.name || res.teacherName
                                                }
                                                return (
                                                    <HoverDelete key={index} teacherChildList={this.teacherChildList}
                                                                 res={arrTeacher}/>)
                                            })
                                        } </ul>
                                    <ul className='scrollbar'>
                                        <AddStudent studentChild={this.studentChild}></AddStudent>
                                        {
                                            studentVal && studentVal.map((res, index) => {
                                                const arrStudent = {
                                                    studentAccount: res.account || res.studentAccount,
                                                    studentName: res.name || res.studentName
                                                }
                                                return (
                                                    <HoverDelete key={index} studentChildList={this.studentChildList}
                                                                 res={arrStudent}/>)
                                            })
                                        } </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}