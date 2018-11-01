import React from 'react';
import {
    Form,
    Input,
    DatePicker,
    Select,
    Button,
    Breadcrumb,
} from 'antd';
import "@/pages/course/create/style.less";
import AddTeacher from "@/pages/course/create/AddTeacher";
import AddStudent from "@/pages/course/create/AddStudent";
import FreeScrollBar from 'react-free-scrollbar'
import http from '@/utils/http';
import {message} from "antd/lib/index";
import moment from 'moment';
import {Link} from "react-router-dom";
import HoverDelete from '@/pages/course/create/HoverDelete';

const FormItem = Form.Item;
const Option = Select.Option;
const InputGroup = Input.Group;
export default class EditLesson extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            lessonName: '',
            classDate: "",
            classTime: ``,
            duration: ``,
            teacherArr: [],
            studentArr: [],
            teacherNum: 0,
            studentNum: 0,
            avatar: ``,
            rows: props.location.state.rows,
            row: props.location.state.row,
            hour: ``,
            minute: ``,
        }
    }

    componentDidMount() {
        (async () => {
            const data = await this.getClassInfo();
            const teacher = [data.teacherJson].map((item, index) => {
                return {
                    teacherAccount: item.account,
                    teacherName: item.name,
                    avatar: ``,
                }
            })
            const student = data.studentJson.map((item, index) => {
                return {
                    studentAccount: item.account,
                    studentName: item.name,
                    avatar: ``,
                }
            })
            this.setState({
                lessonName: data.class_name,
                classDate: data.class_date,
                classTime: data.class_btime,
                duration: data.duration,
                teacherArr: teacher,
                studentArr: student,
                minute: data.class_btime.split(":")[1],
                hour: data.class_btime.split(":")[0]
                // teacherNum: this.state.teacherArr.length,
                // studentNum: this.state.studentArr.length,
            })
        })();
    }

    getClassInfo = () => {
        const {row} = this.state;
        return http.post("/course/get-class-info-new", {
            classId: row.class_id,
        }).then((response) => {
            return response.data
        })

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
            teacherArr: data,
            // teacherNum: this.state.teacherArr.length
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
            studentArr: data,
            // studentNum: this.state.studentArr.length
        })
    }
    teacherChildList = (e) => {
        let data = [];
        let {teacherArr} = this.state;
        teacherArr.map((res, idx) => {
            if (res.teacherAccount !== e) {
                message.destroy();
                message.error("删除成功");
                data.push(res);
            }
        })
        this.setState({
            teacherArr: data,
            // teacherNum: this.state.teacherArr.length
        })

    }
    studentChildList = (e) => {
        let data = [];
        let {studentArr} = this.state;
        studentArr.map(res => {
            if (res.studentAccount !== e) {
                message.destroy();
                message.success("删除成功");
                data.push(res)
            }
        })
        this.setState({
            studentArr: data,
            // studentNum: this.state.studentArr.length
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

    editCourseClass = () => {
        const {lessonName, classDate, hour, minute, classTime, row, rows, duration, teacherArr, studentArr} = this.state;
        const istype = (parseInt(rows.type) === 1 ? studentArr.length !== 0 : teacherArr.length !== 0);
        if (lessonName !== "" && teacherArr.length !== 0 && istype && duration !== '' && classDate !== "" && hour !== "" && minute !== '') {
            const createUnix = moment(classDate + `\n` + hour + ":" + minute).unix();
            const curUnix = moment(new Date()).unix() + 1200;
            if (createUnix < curUnix) {
                message.destroy();
                message.error('请设置为最少20分钟后的时间')
            } else {
                http.post("/course/edit-course-class-new", {
                    courseId: rows.course_id,
                    className: lessonName,
                    classDate: classDate,
                    beginTime: hour + `:` + minute,
                    classId: row.class_id,
                    duration: duration,
                    teacherJson: JSON.stringify(teacherArr),
                    studentJson: JSON.stringify(studentArr),
                }).then((response) => {
                    if (response.error_info.errno === 1) {
                        message.destroy();
                        message.success('编辑成功')
                        this.props.history.push({
                            pathname: '/lesson',
                            state: {
                                val: rows
                            },
                        })
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
        const {lessonName, classDate, classTime, teacherArr, studentArr, rows, row, duration, hour, minute, teacherNum, studentNum} = this.state;
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
                        <Breadcrumb.Item
                            onClick={() => {
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
                        <Breadcrumb.Item href="">
                            编辑课节
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div style={{backgroundColor: "#fff"}}>
                    <div style={{padding: 15, borderBottom: "0.5px solid #ccc"}}>
                        <h3>编辑课节</h3>
                    </div>
                    <div style={{display: "flex", padding: 15}}>
                        <Form style={{width: '50%'}}>
                            <FormItem className="FormItem">
                                <span className="front">课节名称</span>
                                <Input placeholder={"请输入课节名称"}
                                       maxlength={30}
                                       style={{width: 150}}
                                       defaultValue={lessonName}
                                       onChange={(e) => {
                                           this.setState({
                                               lessonName: e.target.value
                                           })
                                       }}
                                />
                            </FormItem>
                            <FormItem className="FormItem">
                                <span className="front">开始日期</span>
                                {classDate ? <DatePicker
                                    placeholder='选择日期'
                                    disabledDate={(current) => {
                                        return current && current < moment().add(-1, 'd')
                                    }}
                                    value={moment(classDate)}
                                    onChange={(e, time) => {
                                        this.setState({
                                            classDate: time
                                        })
                                    }}/> : <DatePicker
                                    placeholder='选择日期'
                                    disabledDate={(current) => {
                                        return current && current < moment().add(-1, 'd')
                                    }}
                                    onChange={(e, time) => {
                                        this.setState({
                                            classDate: time
                                        })
                                    }}/>}
                            </FormItem>
                            <FormItem className="FormItem">
                                <span className="front">开始时间</span>
                                {classTime && <InputGroup style={{display: "inline"}}>
                                    <Select style={{width: 80}}
                                            defaultValue={classTime.split(":")[0]}
                                            onChange={(e) => {
                                                this.setState({
                                                    hour: e

                                                })
                                            }}>
                                        {hourArr && hourArr.map((item, index) => {
                                            return (<Option key={index}>{item}</Option>)
                                        })}
                                    </Select>
                                    <span style={{margin: 5}}>时</span>
                                    <Select style={{width: 80}}
                                            defaultValue={classTime.split(":")[1]}
                                            onChange={(e) => {
                                                this.setState({
                                                    minute: e
                                                })
                                            }}>
                                        {minuteArr && minuteArr.map((item, index) => {
                                            return (<Option key={index}>{item}</Option>)
                                        })}
                                    </Select>
                                    <span style={{margin: 5}}>分</span>
                                </InputGroup>}

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
                                           if (e.target.value < 30) {
                                               message.destroy();
                                               message.error('课节时长请输入30-150之间的数字');
                                               e.target.value = 30;
                                               this.setState({
                                                   duration: e.target.value
                                               })
                                           } else if (e.target.value > 150) {
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
                                        onClick={() => {
                                            this.editCourseClass();
                                        }}>保存
                                </Button>
                            </FormItem>
                        </Form>
                        <div className="course-box-content-content-right grouping-right" style={{marginLeft: 20}}>
                            <div style={{display: "flex", height: 40, alignItems: "center"}}
                                 className="right-title grouping-title grouping-title1">
                                <span>教师 ( <b style={{color: "#1093ED"}}>{teacherArr.length} / 1</b> )</span>
                                {parseInt(rows.type) === 1 ? <span>学生 ( <b
                                    style={{color: "#1093ED"}}>{studentArr.length} / 6</b> )</span> : null}
                            </div>
                            <div style={{display: 'flex'}} className="grouping-right-center teacher ">
                                <ul className='scrollbar'>
                                    <AddTeacher teacherChild={this.teacherChild} num={this.teacherNum}/>
                                    {teacherArr && teacherArr.map((item, index) => {
                                        return (
                                            <HoverDelete key={index} teacherChildList={this.teacherChildList}
                                                         res={item}/>
                                        )
                                    })}
                                </ul>
                                {parseInt(rows.type) === 1 ?
                                    <ul className='scrollbar'>
                                        <AddStudent studentChild={this.studentChild} num={this.studentNum}/>
                                        {studentArr.map((item, index) => {
                                            return (
                                                <HoverDelete key={index} studentChildList={this.studentChildList}
                                                             res={item}/>
                                            )
                                        })}
                                    </ul> : null}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}