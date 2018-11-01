import React from "react";
import {Button, Breadcrumb, Icon, Table, Divider, InputNumber, Input, DatePicker, TimePicker} from 'antd';
import {Link} from "react-router-dom";
import {message, Select} from "antd/lib/index";
import http from '@/utils/http';
import moment from 'moment';
import "./../create/style.less";

const format = 'HH:mm';
const Option = Select.Option;
const InputGroup = Input.Group;
export default class SetLesson extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: props.history.location.state.rows,
            type: props.history.location.state.type,
            isPublic: false,
            items: [],
            classId: '',
            className: '',
            classDate: '',
            classTime: '',
            duration: '',
            hour: `0`,
            minute: `0`,
            beginTime: ''
        }
    }

    componentDidMount() {
        this.getSetLesson();
    }

    getSetLesson = async () => {
        const {rows} = this.state;
        await http.post("/course/get-course-class-new", {
            courseId: rows,
            // courseId: "300001",
        }).then((response) => {
            const datas = response.data.map((item, index) => {
                return {
                    classId: item.class_id,
                    className: item.class_name,
                    beginTime: '',
                    classDate: '',
                    duration: item.duration,
                };
            });
            if (response.error_info.errno === 1) {
                this.setState({
                    items: datas
                })
            }
        })
    }

    get columns() {
        const {type} = this.state;
        return [{
            title: "序号",
            dataIndex: "index",
            key: "index",
            render: (value, row, index) => {
                return (<div style={{width: 50}}>{index + 1}</div>)
            }
        }, {
            title: '课节名称',
            dataIndex: 'className',
            key: 'className',
            render: (value, row, index) => {
                return (
                    <Input defaultValue={value}
                           maxlength={30}
                           style={{width: 180}}
                           onChange={(e) => {
                               const newClassName = e.target.value;
                               const items = this.state.items;
                               const newItems = [
                                   ...items.slice(0, index),
                                   Object.assign({}, row, {className: newClassName}),
                                   ...items.slice(index + 1)
                               ]
                               this.setState({
                                   items: newItems
                               })
                           }}/>
                )
            },
        }, {
            title: '开始日期',
            dataIndex: 'classDate',
            key: 'classDate',
            render: (value, row, index) => {
                return (
                    <DatePicker
                        placeholder={`请选择日期`}
                        disabledDate={(current) => {
                            return current && current < moment().add(-1, 'd')
                        }}
                        // defaultValue={value ? moment(value) : ''}
                        onChange={(e, date) => {
                            const newClassDate = date;
                            const items = this.state.items;
                            const newItems = [
                                ...items.slice(0, index),
                                Object.assign({}, row, {classDate: newClassDate}),
                                ...items.slice(index + 1)
                            ]
                            this.setState({
                                items: newItems
                            })
                        }}/>
                )
            }
        }, {
            title: '开始时间',
            dataIndex: 'beginTime',
            key: 'beginTime',
            render: (value, row, index) => {
                return (
                    <div>
                        <TimePicker
                            placeholder="请选择时间"
                            format={format}
                            onChange={(e, time) => {
                                const items = this.state.items;
                                const newItems = [
                                    ...items.slice(0, index),
                                    Object.assign({}, row, {beginTime: time}),
                                    ...items.slice(index + 1)
                                ]
                                this.setState({
                                    items: newItems
                                })
                            }}
                        />
                    </div>
                )
            }
        }, {
            title: '时长',
            key: 'duration',
            dataIndex: 'duration',
            render: (value, row, index) => {
                return (
                    <div>
                        <Input type="number"
                               style={{width: 100}}
                            // onBlur={() => {
                            //     let duration = +this.state.duration
                            //     duration <= 150 && duration >= 10 ? null : message.error('请输入10-150之间的数字')
                            // }}
                               value={value}
                               onClick={(e) => {
                                   if (parseInt(e.target.value) < 30 || parseInt(e.target.value) > 150) {
                                       // message.destroy();
                                       // message.error('课节时长请输入30-150之间的数字');
                                       if (parseInt(e.target.value) < 30) {
                                           e.target.value = 30;
                                       } else if (parseInt(e.target.value) > 150) {
                                           e.target.value = 150;
                                       }
                                       const newDuration = e.target.value;
                                       const items = this.state.items;
                                       const newItems = [
                                           ...items.slice(0, index),
                                           Object.assign({}, row, {duration: newDuration}),
                                           ...items.slice(index + 1)
                                       ]
                                       this.setState({
                                           items: newItems
                                       })
                                   }
                               }}
                               onChange={(e) => {
                                   const newDuration = e.target.value;
                                   // if (parseInt(e.target.value) < 30) {
                                   //     message.destroy();
                                   //     message.error('课节时长请输入30-150之间的数字');
                                   // } else if (parseInt(e.target.value) > 150) {
                                   //     message.destroy();
                                   //     message.error('课节时长请输入30-150之间的数字');
                                   // }
                                   const items = this.state.items;
                                   const newItems = [
                                       ...items.slice(0, index),
                                       Object.assign({}, row, {duration: newDuration}),
                                       ...items.slice(index + 1)
                                   ]
                                   this.setState({
                                       items: newItems
                                   })
                               }}/>
                        <span style={{margin: 5}}>分钟</span>
                    </div>
                )
            }
        }];
    }

    editSublime = async () => {
        const {items, rows, beginTime} = this.state;
        await http.post("/course/batch-edit-course-class", {
            classJson: JSON.stringify(items),
            courseId: rows
        }).then((response) => {
            if (response.error_info.errno === 1) {
                this.props.history.push({
                    pathname: '/class',
                    state: rows
                })
                message.destroy();
                message.success('创建成功')
            } else {
                message.destroy();
                message.error(response.error_info.error)
            }
        })
    }

    batchEditCourse = () => {
        const {items, rows, beginTime} = this.state;
        let check = true;
        const isEmpty = items && items.every((record, index) => {
            return record.className !== "" && record.classDate !== "" && record.beginTime !== "" && record.duration !== "";
        })
        items && items.forEach((item, index) => {
            const createUnix = item.classDate && item.beginTime && moment(item.classDate + `\n` + item.beginTime).unix();
            const curUnix = moment(new Date()).unix() + 1200;
            if (isEmpty) {
                check = false;
                if (createUnix < curUnix) {
                    check = false;
                    message.destroy();
                    message.error('课节开始时间需设置在20分钟之后');
                } else {
                    if (item.duration >= 30 && item.duration <= 150) {
                        check = !check;
                        if (check) {
                            return this.editSublime();
                        }
                    } else {
                        check = false;
                        message.destroy();
                        message.error('课节时长请输入30-150之间的数字');
                    }
                }
            } else {
                check = false;
                message.destroy();
                message.error("请填写完整信息");
            }
        })
    }


    render() {
        const {type, getcookies, items, rows, hour, minute} = this.state;
        return (
            <div style={{padding: 20}}>
                <div style={{display: "flex", margin: "0 0 15px 0"}}>
                    <Breadcrumb style={{flex: "95%"}}>
                        <Breadcrumb.Item>
                            <span>教学管理</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item href="">
                            <span>课程管理</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            {parseInt(type) === 0 ? '公开课' : `标准课`}
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <span>创建课程</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            课节设置
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    {/*<Button style={{flex: "5%", margin: "0 0 15px 0"}}>*/}
                    {/*<Icon type="sync"/>*/}
                    {/*</Button>*/}
                </div>
                <div style={{backgroundColor: "#fff"}}>
                    <div style={{padding: 15, borderBottom: "0.5px solid #ccc"}}>
                        <h3>课节设置</h3>
                    </div>
                </div>
                <div style={{padding: 15, backgroundColor: "#fff"}} className="set-lesson">
                    <Table columns={this.columns}
                           rowKey={e => e.classId}
                           dataSource={items}
                           pagination={false}
                           scroll={{y: 400 | true}}
                           style={{height: "100%"}}
                           locale={{emptyText: "暂无数据"}}
                    />
                    <Button type='primary'
                            style={{marginTop: 15, width: 150}}
                            onClick={(e) => {
                                this.batchEditCourse();
                            }}>完成
                    </Button>
                </div>
            </div>
        )
    }
}