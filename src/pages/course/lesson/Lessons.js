import React from 'react';
import {Table, Icon, Button, Breadcrumb, Tooltip} from 'antd';
import {fetchLessonList} from "@/api/course/courseAPI";
import {Link} from "react-router-dom";
import DeleteLesson from "@/pages/course/lesson/DeleteLesson";
import moment from "moment";
import {message} from "antd/lib/index";
import http from '@/utils/http';

class Lessons extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            items: [],
            rows: props.history.location.state && props.history.location.state.val,
        }
    }

    componentDidMount() {
        this.getCourseClass();
    }

    getCourseClass = async () => {
        const {rows} = this.state;
        await http.post("/course/get-course-class", {
            courseId: rows && rows.course_id,
        }).then((response) => {
            if (response.error_info.errno === 1) {
                this.setState({
                    items: response.data,
                })
            } else {
                this.setState({
                    items: [],
                })
            }
        }).catch(e => {
        });
    }

    get columns() {
        const {rows} = this.state;
        return [{
            title: '序号',
            dataIndex: 'index',
            key: 'index',
            render: (value, row, index) => {
                return (<span>{index + 1}</span>)
            }
        }, {
            title: '课节名称',
            dataIndex: 'class_name',
            key: 'class_name',
            render: (value, row, index) => {
                return (
                    <Tooltip placement="top" title={value}>
                        <span style={{
                            width: 100,
                            display: "block",
                            overflow: 'hidden',
                            textOverflow: "ellipsis",
                            whiteSpace: 'nowrap',
                        }}>{value}</span>
                    </Tooltip>
                )
            }
        }, {
            title: '课程名称',
            dataIndex: 'course_name',
            key: 'course_name',
            render: (value, row) => {
                return (
                    <Tooltip placement="top" title={rows && rows.course_name}>
                        <span style={{
                            width: 100,
                            display: "block",
                            overflow: 'hidden',
                            textOverflow: "ellipsis",
                            whiteSpace: 'nowrap',
                        }}>{rows && rows.course_name}</span>
                    </Tooltip>
                )
            }
        }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (value) => {
                return (<div>{parseInt(value) === 0 ? '公开课' : "标准课"}</div>)
            }
        }, {
            title: '开始时间',
            dataIndex: 'class_btime',
            key: 'class_btime',
            render: value => {
                return (<div>{value ? moment(value).format('YYYY-MM-DD HH:mm') : "未设置"}</div>);
            }
        }, {
            title: '时长',
            key: 'duration',
            dataIndex: 'duration',
            render: (value) => {
                return (<span>{value ? `${value}分钟` : ""}</span>)
            }
        }, {
            title: '教师',
            key: 'teacher_name',
            dataIndex: 'teacher_name',
            render: (value, row) => {
                return (
                    <Tooltip placement="top" title={value || row.teacher_account}>
                        <span style={{
                            width: 100,
                            display: "block",
                            overflow: 'hidden',
                            textOverflow: "ellipsis",
                            whiteSpace: 'nowrap',
                        }}>{value || row.teacher_account}</span>
                    </Tooltip>
                )
            }
        }, {
            title: '学生人数',
            key: 'student_num',
            dataIndex: 'student_num',
        }, {
            title: '直播/回放',
            key: 'live_replay',
            dataIndex: 'live_replay',
            render: (value, row) => {
                return (<div>
                    {parseInt(row.live) === 0 ? "否" : "是"}/{parseInt(row.replay) === 0 ? "否" : "是"}
                </div>)
            }
        }, {
            title: '操作',
            key: 'operation',
            dataIndex: 'operation',
            render: (value, row) => {
                if (parseInt(row.status) === 4) {
                    return (
                        <div style={{display: "flex"}}>
                            <img style={{padding: 10, cursor: 'pointer', opacity: "0.3"}}
                                 onClick={() => {
                                     message.destroy();
                                     message.error('课节正在进行中');
                                 }}
                                 className='minus-circle-o user-bj'
                                 src={require(`@/assets/imgs/icons/icon_edit_hover.png`)}
                                 alt="loading..."/>
                            {parseInt(rows.type) === 0 ? null :
                                <img style={{padding: 10, cursor: 'pointer', opacity: "0.3"}}
                                     onClick={() => {
                                         message.destroy();
                                         message.error('课节正在进行中,不可操作')
                                     }}
                                     className='minus-circle-o user-bj'
                                     src={require(`@/assets/imgs/icons/icon_delete_normal.png`)}
                                     alt="loading..."/>
                            }
                        </div>
                    )
                } else if (parseInt(row.status) === 3) {
                    return (
                        <div style={{display: "flex"}}>
                            <img style={{padding: 10, cursor: 'pointer', opacity: "0.3"}}
                                 onClick={() => {
                                     message.destroy();
                                     message.error('课节预课中')
                                 }}
                                 className='minus-circle-o user-bj'
                                 src={require(`@/assets/imgs/icons/icon_edit_hover.png`)}
                                 alt="loading..."/>
                            {parseInt(rows.type) === 0 ? null :
                                <img style={{padding: 10, cursor: 'pointer', opacity: "0.3"}}
                                     onClick={() => {
                                         message.destroy();
                                         message.error('课节预课中,不可操作')
                                     }}
                                     className='minus-circle-o user-bj'
                                     src={require(`@/assets/imgs/icons/icon_delete_normal.png`)}
                                     alt="loading..."/>
                            }
                        </div>
                    )
                } else if (parseInt(row.status) === 2) {
                    return (
                        <div style={{display: "flex"}}>
                            <img style={{padding: 10, cursor: 'pointer', opacity: "0.3"}}
                                 onClick={() => {
                                     message.destroy();
                                     message.error('课节已完结')
                                 }}
                                 className='minus-circle-o user-bj'
                                 src={require(`@/assets/imgs/icons/icon_edit_hover.png`)}
                                 alt="loading..."/>
                            {parseInt(rows.type) === 0 ? null :
                                <img style={{padding: 10, cursor: 'pointer', opacity: "0.3"}}
                                     onClick={() => {
                                         message.destroy();
                                         message.error('课节已完结,不可操作')
                                     }}
                                     className='minus-circle-o user-bj'
                                     src={require(`@/assets/imgs/icons/icon_delete_normal.png`)}
                                     alt="loading..."/>
                            }
                        </div>
                    )
                } else if (parseInt(row.status) === 1) {
                    return (
                        <div style={{display: "flex"}}>
                            <img style={{padding: 10, cursor: 'pointer', opacity: "0.3"}}
                                 onClick={() => {
                                     message.destroy();
                                     message.error('课节正在进行中,不可操作')
                                 }}
                                 className='minus-circle-o user-bj'
                                 src={require(`@/assets/imgs/icons/icon_edit_hover.png`)}
                                 alt="loading..."/>
                            {parseInt(rows.type) === 0 ? null :
                                <img style={{padding: 10, cursor: 'pointer', opacity: "0.3"}}
                                     onClick={() => {
                                         message.destroy();
                                         message.error('课节正在进行中,不可操作')
                                     }}
                                     className='minus-circle-o user-bj'
                                     src={require(`@/assets/imgs/icons/icon_delete_normal.png`)}
                                     alt="loading..."/>
                            }
                        </div>
                    )
                } else {
                    return (
                        <div style={{display: "flex"}}>
                            <img style={{padding: 10, cursor: 'pointer'}}
                                 className='user-bj'
                                 src={require(`@/assets/imgs/icons/icon_edit_hover.png`)}
                                 alt="loading..."
                                 onClick={() => {
                                     this.props.history.push({
                                         pathname: '/editLesson',
                                         state: {
                                             row: row,
                                             rows: rows,
                                         }
                                     })
                                 }}/>
                            {parseInt(rows.type) === 0 ? null :
                                <DeleteLesson getCourseClass={this.getCourseClass.bind(this)} row={row} rows={rows}/>}
                        </div>
                    )
                }

            },
        }];
    }


    timestampToTime(timestamp) {
        //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let date = new Date(timestamp * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = date.getMinutes();
        let s = date.getSeconds();
        return (<div>
            {Y + M + D + h + m}
        </div>)
    }

    render() {
        const {items, rows} = this.state;
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
                        <Breadcrumb.Item href="">
                            <span>课节管理</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    {/*<Button style={{flex: "5%", margin: "0 0 15px 0"}}>*/}
                    {/*<Icon type="sync"/>*/}
                    {/*</Button>*/}
                </div>
                <div style={{backgroundColor: "#fff", padding: 15}}>
                    <div style={{display: "flex"}}>
                        <h3 style={{flex: "50%"}}>课节管理</h3>
                        {rows && parseInt(rows.type) === 0 ? null : <Button
                            type="primary"
                            style={{width: 110}}
                            onClick={() => {
                                this.props.history.push({
                                    pathname: '/detail',
                                    state: rows
                                })
                            }}
                        >
                            <Icon type="plus"/>新建课节
                        </Button>}
                    </div>
                    <Table columns={this.columns}
                           dataSource={items}
                           locale={{emptyText: "暂无数据"}}
                           rowKey={e => e.class_id}
                           style={{marginTop: 15}}/>
                </div>
            </div>
        )
    }
}

export default Lessons;