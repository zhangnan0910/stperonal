import React, { Component } from 'react'
import { Input, Spin, Tooltip, Breadcrumb, Select, Button, Pagination, Tabs, Modal, Badge } from "antd";

import http from '@/utils/http';
import { Link } from "react-router-dom";
import moment from "moment";
import Http from '@/utils/http'
const { TextArea } = Input;
import { message } from "antd/lib/index";
import { getCookie } from '@/utils/cookies';
import ChatRoom from '@/pages/eduTask/ChatRoom';
import './monitorLesson.less'
const Search = Input.Search;
const TabPane = Tabs.TabPane;
const InputGroup = Input.Group;
const Option = Select.Option;
export default class MonitorLesson extends Component {

    constructor(props) {
        super(props);
        this.state = {
            getcookies: JSON.parse(unescape(unescape(getCookie("login-token")))),
            items: [],
            page: 1,
            perpage: 8,
            totalCount: 1,
            status: "1",
            SelectVal: '课程',
            SearchVals: '请输入课程名称',
            SearchVal: '',
            SearchFlag: false,
            httpFlag: true,
            visible: false,
            curItem: '',
            describe: '',//求助信息
            helpData: [],
            classIds:'', // 存储课节id 获取未读消息
        }
    }

    componentDidMount() {
        const { page, perpage, status } = this.state;
        this.fetchLessonClass(page, perpage, status);
    }
    // 更改求助信息的阅读状态
    fetchstatus = () => {
        Http.post('/course/update-help-status', {

        }).then(res => {
            console.log(res)
        })
    }
    fetchLessonClass = async (page, perpage, status) => {
        const { getcookies } = this.state;
        await http.post("/course/lesson-class-list", {
            page: page ? page : this.state.page,
            perpage: perpage ? perpage : this.state.perpage,
            status: status ? status : this.state.status,
            userId: getcookies && getcookies.userInfo && getcookies.userInfo.userId
        }
        ).then((response) => {
            if (response.error_info.errno === 1) {
                let arr = []
                if(response.data.list.length>0){
                    response.data.list.map(res=>{
                        arr.push(res.class_id)
                    })
                }
                this.setState({
                    items: response.data.list,
                    totalCount: response.data.totalCount,
                    classIds : arr
                },()=>{
                    this.getUnreadmsg()
                })
            } else {
                message.destroy();
                message.error(response.error_info.error)
            }
        })
    }

    searchHandle = async (page, perpage, status, val) => {
        const { SelectVal, getcookies } = this.state;
        await http.post("/course/lesson-class-list", {
            page: page ? page : this.state.page,
            perpage: perpage ? perpage : this.state.perpage,
            status: status,
            courseName: SelectVal === '课程' ? val : '',
            className: SelectVal === '课节' ? val : '',
            teacherName: SelectVal === '教师' ? val : '',
            userId: getcookies && getcookies.userInfo && getcookies.userInfo.userId
        }
        ).then((response) => {
            if (response.error_info.errno === 1) {
                this.setState({
                    items: response.data.list,
                    totalCount: response.data.totalCount,
                })
            } else {
                this.setState({
                    items: [],
                    totalCount: 0
                })
                message.destroy();
                message.error(response.error_info.error)
            }
        })
    }

    timestampToTime(timestamp) {
        //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let date = new Date(timestamp * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        let s = date.getSeconds();
        return (<div>
            {Y + M + D + h + m}
        </div>)
    }

    selectHandleChange = (e) => {
        if (e === '教师') {
            this.setState({
                SelectVal: '教师',
                SearchVals: '请输入手机号或姓名',
                SearchVal: ''
            })
        } else if (e === '课程') {
            this.setState({
                SelectVal: '课程',
                SearchVals: '请输入课程名称',
                SearchVal: ''
            })
        } else if (e === '课节') {
            this.setState({
                SelectVal: '课节',
                SearchVals: '请输入课节名称',
                SearchVal: ''
            })
        }
    }

    renderBanner = (item) => {
        if (parseInt(item.type) === 0) {
            return (<div
                style={{
                    cursor: "pointer",
                    background: 'url(' + `${item.tScreenshot && item.tScreenshot.screenshot == "" ? require(`@/assets/imgs/icons/icon_wutu_wutu.jpg`) : require(`@/assets/imgs/icons/icon_weikai_0.jpg`)}` + ')' + "no-repeat center center",
                    backgroundOrigin: "paddingBox",
                    backgroundSize: "100% auto"
                }}
                onClick={() => {
                    this.props.history.push({
                        pathname: '/prison',
                        state: item
                    })
                }}>
                <div style={{ width: 228, minHeight: 106, overflow: "hidden" }}>
                    {item.tScreenshot.screenshot ?
                        <img style={{ margin: "0 40px", width: 140 }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = require(`@/assets/imgs/icons/icon_wutu_black.jpg`);
                            }}
                            src={item.tScreenshot.screenshot}
                            alt="loading..." /> : null}
                </div>
            </div>)
        } else {
            return (<div
                style={{
                    cursor: "pointer",
                    background: 'url(' + `${(item.tScreenshot && item.sScreenshot) ?
                        (item.tScreenshot.screenshot === "" && item.sScreenshot.length === 0 ?
                            require(`@/assets/imgs/icons/icon_wutu_wutu.jpg`) : require(`@/assets/imgs/icons/icon_wutu.jpg_liebiao.jpg`)) :
                        require(`@/assets/imgs/icons/icon_wutu_wutu.jpg`)}` + ')' + "no-repeat center center",
                    backgroundOrigin: "paddingBox",
                    backgroundSize: "100% auto"
                }}
                onClick={() => {
                    this.props.history.push({
                        pathname: '/prison',
                        state: item
                    })
                }}>
                <div style={{ width: 228, height: 106, display: "flex", overflow: "hidden" }}>
                    <div style={{ width: 130, height: 106 }}>
                        {item.tScreenshot.screenshot ? <img
                            style={{ width: 130, height: "auto", verticalAlign: "middle", margin: "5px 0" }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = require(`@/assets/imgs/icons/icon_wutu_black.jpg`);
                            }}
                            src={item.tScreenshot.screenshot}
                            alt="loading..." /> : null}
                    </div>
                    <div style={{
                        width: 98,
                        height: `${item.sScreenshot && item.sScreenshot.length < 5 ? "70px" : "106px"}`,
                        display: "flex",
                        flexWrap: "wrap",
                        marginTop: 3
                    }}>
                        {item.sScreenshot && item.sScreenshot.map((ite, idx) => {
                            return (
                                <img key={idx}
                                    style={{
                                        width: 44,
                                        height: 35,
                                        display: `${idx > 5 ? "none" : "block"}`
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = require(`@/assets/imgs/icons/icon_wutu_black.jpg`);
                                    }}
                                    src={ite.screenshot ? ite.screenshot : require(`@/assets/imgs/icons/icon_wutu.jpg`)}
                                    alt="loading..."
                                />
                            )
                        })}
                    </div>
                </div>
            </div>)
        }
    }

    render() {
        const { items, totalCount, page, perpage, SearchVal, SearchVals, status } = this.state;
        return (
            <div style={{ padding: 20, overflowY: totalCount ? "scroll" : "visible" }}>
                <div style={{ display: "flex", margin: "0 0 15px 0" }}>
                    <Breadcrumb style={{ flex: "75%" }}>
                        <Breadcrumb.Item>
                            <span>教务管理</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <span>监课</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div style={{ width: 1070, backgroundColor: "#fff", padding: 10 }}>
                    <div style={{ display: "flex" }}>
                        <div style={{ flex: "50%" }}>
                            <Tabs
                                style={{ width: 200, marginLeft: 10 }}
                                onChange={(e) => {
                                    this.setState({
                                        status: e,
                                        page: 1,
                                        totalCount,
                                        SearchVal: ""
                                    })
                                    this.fetchLessonClass({ page: 1 }, perpage, e);
                                }}>
                                <TabPane style={{ width: 100 }} tab={<span>进行中</span>} key="1" />
                                <TabPane style={{ width: 100 }} tab={<span>已完成</span>} key="2" />
                            </Tabs>
                        </div>
                        <div style={{ flex: "15%", margin: "15px 0" }}>
                            <InputGroup compact>
                                <Select defaultValue="课程"
                                    onChange={this.selectHandleChange}
                                >
                                    <Option value="课程">课程</Option>
                                    <Option value="课节">课节</Option>
                                    <Option value="教师">教师</Option>
                                </Select>
                                <Search
                                    style={{ width: 240, marginRight: 10 }}
                                    placeholder={SearchVals}
                                    value={SearchVal}
                                    enterButton="搜索"
                                    onSearch={value => {
                                        this.setState({
                                            page: 1,
                                            perpage: 8,
                                        }, () => {
                                            if (value != '') {
                                                this.searchHandle(page, perpage, status, value)
                                                this.setState({
                                                    SearchVal: value,
                                                    httpFlag: true,
                                                    SearchFlag: true,
                                                    page: 1,
                                                    perpage: 8,
                                                    totalCount: totalCount
                                                })
                                            } else {
                                                if (this.state.httpFlag) {
                                                    this.searchHandle(page, perpage, status, value)
                                                    this.setState({
                                                        httpFlag: false,
                                                        SearchFlag: false,
                                                    })
                                                } else {
                                                    message.destroy()
                                                    message.error('请输入搜索内容')
                                                }

                                            }
                                        })
                                    }}
                                    onChange={(e) => {
                                        this.setState({
                                            SearchVal: e.target.value
                                        })
                                    }}
                                />
                            </InputGroup>

                        </div>
                    </div>
                    <div style={{
                        width: 1050,
                        textAlign: "center",
                        display: totalCount ? "none" : "block",
                        margin: 20
                    }}>
                        <div>暂无课程</div>
                    </div>
                    <div style={{ width: 1050, display: "flex", flexWrap: "wrap" }}>
                        {items && items.map((item, index) => {
                            return (
                                <div key={index}
                                    style={{
                                        width: `240px`,
                                        // height: `263px`,
                                        backgroundColor: "#FFF",
                                        border: "1px solid #E5E5E5",
                                        borderRadius: 4,
                                        margin: 10,
                                        padding: 10
                                    }}>

                                    <h4 style={{ display: "flex" }}>
                                        <span style={{ flex: "20%" }}>课节：</span>
                                        <span style={{
                                            flex: "75%",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <Tooltip placement="bottom" title={item.class_name}>
                                                {item.class_name}
                                            </Tooltip>
                                        </span>
                                    </h4>
                                    <h5 style={{ display: "flex" }}>
                                        <span style={{ flex: "15%" }}>课程：</span>
                                        <span style={{
                                            flex: "75%",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <Tooltip placement="bottom" title={item.course_name}>
                                                {item.course_name}
                                            </Tooltip>
                                        </span>
                                    </h5>
                                    <div>
                                        {this.renderBanner(item)}
                                    </div>
                                    <h5 style={{ display: "flex", marginTop: 10 }}>
                                        <span style={{ fontSize: 12, flex: "32%" }}>开课老师：</span>
                                        <span style={{
                                            fontSize: 12,
                                            flex: "24%",
                                            width: 110,
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: 'nowrap'
                                        }}>
                                            <Tooltip placement="bottom"
                                                title={item.teacher_name ? item.teacher_name : item.teacher_account}>
                                                {item.teacher_name ? item.teacher_name : item.teacher_account}
                                            </Tooltip>
                                        </span>
                                        <span style={{
                                            flex: "42%",
                                            marginRight: 0,
                                            fontSize: 12,
                                        }}>
                                            <span>学生人数：</span>
                                            {parseInt(item.type) === 0 ?
                                                <span style={{ color: "#999" }}>{item.total_num}</span> :
                                                <span>
                                                    <span style={{ color: "#f00" }}>{item.total_num}</span>／<span
                                                        style={{ color: "#999" }}>{item.room_num}</span>
                                                </span>}
                                        </span>
                                    </h5>
                                    <h5 style={{ display: "flex" }}>
                                        <span>开课时间：</span>
                                        <span>{item.class_btime && item.class_btime > 0 ? this.timestampToTime(item.class_btime) : '--'}</span>
                                    </h5>
                                    <div style={{ display: "flex" }}>
                                        <a href={item.room_url || ""} target={"_blank"}>
                                            <Button
                                                disabled={parseInt(status) === 1 ? false : true}
                                                type="primary"
                                                style={{
                                                    width: 85,
                                                    // marginRight: 10,
                                                    // background: "#1093ED",
                                                    // border: "1px solid #0084C6",
                                                    boxShadow: "0 2px 4px 0 rgba(0,0,0,0.10)",
                                                    borderRadius: 4,
                                                    // color: "#fff",
                                                    textAlign: "center",
                                                    fontSize: 14,
                                                    fontFamily: "PingFangSC-Semibold"
                                                }}>进入教室</Button>
                                        </a>
                                        <Badge count={5}>
                                            <Button style={{ marginLeft: 15 }} onClick={() => {
                                                this.setState({
                                                    curItem: item.class_id,
                                                    visible: true
                                                })
                                            }}><img src='/static/imgs/icons/ic_question_24.png' />
                                            </Button>
                                        </Badge>
                                        {
                                            item.class_id === this.state.curItem && <Modal
                                                visible={this.state.visible}
                                                width={350}
                                                style={{ height: 400 }}
                                                className='MonitorLesson-model-box'
                                                footer={
                                                    <div className='MonitorLesson-model-footer'>
                                                        <TextArea
                                                            className='MonitorLesson-model-textarea ximiBlock'
                                                            placeholder='说点什么'
                                                            value={this.state.describe}
                                                            onChange={(e) => {
                                                                this.setState({
                                                                    describe: e.target.value
                                                                })
                                                            }}
                                                        />
                                                        <Button
                                                            className='MonitorLesson-model-button'
                                                            disabled={this.state.describe ? false : true}
                                                            type="primary"
                                                            onClick={() => {
                                                                this.Submitmsg(item)
                                                            }}
                                                        >发送</Button>
                                                    </div>
                                                }
                                                title={<div className='help-header'>求助解答</div>}
                                                onCancel={(e) => { this.setState({ visible: false }) }}
                                            >
                                                <ChatRoom ref={(e)=>this.chatRoom=e} 
                                                    userId = {this.state.getcookies.userInfo.userId}
                                                    helpChats={this.state.helpData} 
                                                    show = {this.state.visible}
                                                    data={item} />
                                            </Modal>
                                        }
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <Pagination
                    style={{ textAlign: "right", marginTop: "10px", width: 1070 }}
                    total={parseInt(totalCount)}
                    current={page}
                    pageSize={perpage}
                    hideOnSinglePage={true}
                    onChange={(curPage, curPerpage) => {
                        if (!this.state.SearchFlag) {
                            this.setState({
                                page: curPage,
                                perpage: curPerpage
                            });
                            this.fetchLessonClass(curPage, curPerpage, status);
                        } else {
                            this.setState({
                                page: curPage,
                                perpage: curPerpage
                            });
                            this.searchHandle(curPage, curPerpage, status, this.state.SearchVal)
                        }
                    }} />
            </div>
        )
    }
    // 发送求助信息
    Submitmsg = (val) => {
        let { helpData } = this.state
        Http.post('/course/seek-help', {
            courseId: val.course_id,
            classId: val.class_id,
            describe: this.state.describe,
            userId: this.state.getcookies.userInfo.userId
        }).then(res => {
            if (res.error_info.errno === 1) {
                this.chatRoom.getData()
                helpData.push(res.data)
                this.setState({
                    helpData
                })
            }
            this.setState({
                describe: ''
            })
        })
    }
    // 获取未读消息渲染
    getUnreadmsg = () =>{
        let {classIds} = this.state
        Http.post('/course/unread-info-count', {
            classIds : classIds.join()
        }).then(res => {
            console.log(res)
        })
    }
}
