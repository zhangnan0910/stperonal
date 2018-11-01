import React from 'react';
import {Table, Breadcrumb, Button, Tag, Tooltip, Popover} from "antd";
import {Link} from "react-router-dom";
import http from '@/utils/http';
import {message} from "antd/lib/index";
import moment from "moment";
import {getCookie} from '@/utils/cookies';

export default class PrisonDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getcookies: JSON.parse(unescape(unescape(getCookie("login-token")))),
            item: props.location.state,
            items: [],
            screenshotList: [],
            tScreenshot: {},
            sScreenshot: [],
            userList: [],
            disabled: false,
            classRow: {},
            stagePercent: {},
            result: false,
            roomUrl: ""
        }
    }

    componentDidMount() {
        this.fetchLessonDetail();
        this.afterScreenshot();
    }


    fetchLessonDetail = async () => {
        const {getcookies, item, items} = this.state;
        await http.post("/course/get-lesson-class-details", {
            courseId: item.course_id,
            classId: item.class_id,
            userId: getcookies && getcookies.userInfo && getcookies.userInfo.userId
        }).then((response) => {
            if (response.error_info.errno === 1) {
                this.setState({
                    classRow: response.data.classInfo,
                    userList: response.data.lineList.length ? response.data.lineList : [],
                    items: items.concat(response.data.classInfo),
                    stagePercent: response.data.stagePercent,
                    roomUrl: response.data.room_url
                })
            } else {
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
            {h + m}
        </div>)
    }

    timestampToDate(timestamp) {
        //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let date = new Date(timestamp * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':';
        let s = date.getSeconds();
        return (<span>
            {Y + M + D}{h + m + s}
        </span>)
    }

    bannerTime(timestamp) {
        //时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let date = new Date(timestamp * 1000);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + ' ';
        let h = date.getHours() + ':';
        let m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes());
        let s = date.getSeconds();
        return (<div>
            {Y + M + D}{h + m}
        </div>)
    }

    get columns() {
        const {roomUrl} = this.state;
        return [{
            title: '课程',
            dataIndex: 'course_name',
            key: 'course_name',
            render: (value, row) => {
                return (<Tooltip placement="top" title={value}>
                        <span style={{
                            width: 100,
                            display: "block",
                            overflow: 'hidden',
                            textOverflow: "ellipsis",
                            whiteSpace: 'nowrap',
                        }}>{value}</span>
                </Tooltip>)
            }
        }, {
            title: '课节',
            dataIndex: 'class_name',
            key: 'class_name',
            render: (value, row, index) => {
                return (<Tooltip placement="top" title={value}>
                        <span style={{
                            width: 100,
                            display: "block",
                            overflow: 'hidden',
                            textOverflow: "ellipsis",
                            whiteSpace: 'nowrap',
                        }}>{value}</span>
                </Tooltip>)
            }
        }, {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
            render: (value) => <span>{parseInt(value) === 0 ? "公开课" : "标准课"}</span>
        }, {
            title: '日期',
            dataIndex: 'class_date',
            key: 'class_date',
        }, {
            title: '开课时间',
            dataIndex: 'begin_time',
            key: 'begin_time',
            render: (value) => <span>{this.timestampToTime(value)}</span>
        }, {
            title: '时长',
            dataIndex: 'duration',
            key: 'duration',
        }, {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (value) => {
                if (parseInt(value) === 0) {
                    return (<Tag style={{
                        backgroundColor: "#CCC",
                        color: "#fff",
                        border: 0,
                        fontFamily: "PingFangSC-Regular"
                    }}> 未开始</Tag>)
                } else if (parseInt(value) === 1) {
                    return (<Tag style={{
                        backgroundColor: "#1BA1ED",
                        color: "#fff",
                        border: 0,
                        fontFamily: "PingFangSC-Regular"
                    }}> 进行中</Tag>)
                } else if (parseInt(value) === 2) {
                    return (<Tag style={{
                        backgroundColor: "#CCC",
                        color: "#fff",
                        border: 0,
                        fontFamily: "PingFangSC-Regular"
                    }}> 已结束</Tag>)
                } else {
                    return (<span>{""}</span>)
                }
            }
        }, {
            title: '教师',
            dataIndex: 'teacher_name',
            key: 'teacher_name',
            render: (value, row, index) => {
                return (<Tooltip placement="top" title={value ? value : row.teacher_accout}>
                        <span style={{
                            width: 100,
                            display: "block",
                            overflow: 'hidden',
                            textOverflow: "ellipsis",
                            whiteSpace: 'nowrap',
                        }}>{value ? value : row.teacher_accout}</span>
                </Tooltip>)
            }
        }, {
            title: '学生人数',
            dataIndex: 'online_num',
            key: 'online_num',
            render: (value, row) => {
                return (
                    <span>
                        {parseInt(row.type) === 0 ? <span>{row.total_num}</span> :
                            <span>{row.total_num}/{value || row.room_num}</span>}
                    </span>
                )
            }
        }, {
            title: '操作',
            dataIndex: 'admin',
            key: 'admin',
            render: (value, row) => {
                if (parseInt(row.status) === 1) {
                    return (<a style={{width: 24, height: 24, cursor: 'pointer'}} href={roomUrl} target={"_blank"}>
                        <img style={{width: 24, height: 24}}
                             src={require("@/assets/imgs/icons/icon_comein_jianke.jpg")}
                             alt=""/>
                    </a>)
                } else {
                    return (<img style={{width: 24, height: 24, cursor: 'pointer', opacity: "0.3"}}
                                 src={require("@/assets/imgs/icons/icon_comein_jianke.jpg")}
                                 alt=""/>)
                }
            }
        }]
    }

    get userColumn() {
        const {item, stagePercent} = this.state;
        return [{
            title: <h5 style={{color: "#666"}}>人员名称</h5>,
            dataIndex: 'nickName',
            width: 100,
            render: (value, row, index) => {
                return (<Tooltip placement="top" title={value ? value : row.teacher_accout}>
                        <span style={{
                            width: 100,
                            display: "block",
                            overflow: 'hidden',
                            textOverflow: "ellipsis",
                            whiteSpace: 'nowrap',
                        }}>{value ? value : row.userName}</span>
                </Tooltip>)
            }
        }, {
            title: <div>
                <div style={{display: "flex", fontSize: "12px"}}>
                    <div style={{
                        minWidth: 30, borderLeft: "1px dotted #f40",
                        flex: `${(parseFloat(stagePercent && stagePercent.tPreclass && stagePercent.tPreclass.percent) + parseFloat(stagePercent && stagePercent.tPreclass && stagePercent.sPreclass.percent)) * 100}%`,
                    }}>
                        <h5 style={{color: "#666"}}>预课</h5>
                        <h5 style={{color: "#666"}}>{this.timestampToTime(parseInt(item.class_btime) - 1200).props.children}</h5>
                    </div>
                    <div style={{
                        minWidth: 30,
                        flex: `${parseFloat(stagePercent && stagePercent.startClass && stagePercent.startClass.percent) * 100}%`
                    }}>
                    </div>
                    <div style={{
                        minWidth: 30,
                        flex: `${parseFloat(stagePercent && stagePercent.endClass && stagePercent.endClass.percent) * 100}%`
                    }}>
                    </div>
                    <div style={{
                        minWidth: 50,
                        borderLeft: "1px dotted #f40",
                        flex: `${parseFloat(stagePercent && stagePercent.overClass && stagePercent.overClass.percent) * 100}%`
                    }}>
                        <h5 style={{color: "#666"}}>截止</h5>
                        <h5 style={{color: "#666"}}>{this.timestampToTime(parseInt(item.class_etime) + 1200).props.children}</h5>
                    </div>
                </div>
                <div style={{display: "flex", fontSize: "12px"}}>
                    <div style={{
                        minWidth: 30,
                        borderLeft: "1px dotted #f40",
                        flex: `${parseFloat(stagePercent && stagePercent.tPreclass && stagePercent.tPreclass.percent) * 100}%`,
                    }}>
                    </div>
                    <div style={{
                        flex: `${parseFloat(stagePercent && stagePercent.tPreclass && stagePercent.sPreclass.percent) * 100}%`,
                    }}>
                    </div>
                    <div style={{
                        minWidth: 30,
                        borderLeft: "1px dotted #f40",
                        flex: `${parseFloat(stagePercent && stagePercent.startClass && stagePercent.startClass.percent) * 100}%`
                    }}>
                        <h5 style={{color: "#666"}}>开始</h5>
                        <h5 style={{color: "#666"}}>{this.timestampToTime(parseInt(item.class_btime)).props.children}</h5>
                    </div>
                    <div style={{
                        minWidth: 30,
                        borderLeft: "1px dotted #f40",
                        flex: `${parseFloat(stagePercent && stagePercent.endClass && stagePercent.endClass.percent) * 100}%`
                    }}>
                        <h5 style={{color: "#666"}}>结束</h5>
                        <h5 style={{color: "#666"}}>{this.timestampToTime(parseInt(item.class_etime)).props.children}</h5>
                    </div>
                    <div style={{
                        minWidth: 50,
                        borderLeft: "1px dotted #f40",
                        flex: `${parseFloat(stagePercent && stagePercent.overClass && stagePercent.overClass.percent) * 100}%`
                    }}>
                    </div>
                </div>
            </div>,
            dataIndex: 'list',
            render: (list, row) => {
                return (
                    <div
                        style={{
                            height: 8,
                            display: "flex",
                            borderRadius: "3px",
                            backgroundColor: "#F2F2F2",
                        }}>
                        {list && list.map((record, count) => {
                            const startContent = (
                                <div style={{fontSize: "12px", minWidth: 150}}>
                                    <p style={{display: "flex"}}>
                                        <span>时间：</span>
                                        <span>{record.pStart && record.pStart.msg && record.pStart.msg.time && parseInt(record.start) !== parseInt(record.end) ?
                                            this.timestampToDate(record.pStart.msg.time || "") : ``}</span>
                                    </p>
                                    <p>行为：{record.pStart && record.pStart.msg && record.pStart.msg.behavior || ""}</p>
                                    <p>记录：{record.pStart && record.pStart.msg && record.pStart.msg.record || ""}</p>
                                    <p>考勤：<span
                                        style={{color: record.pStart && record.pStart.msg && record.pStart.msg.attendance == "正常" ? "#7ED321" : "#F00"}}>
                                        {record.pStart && record.pStart.msg && record.pStart.msg.attendance || ""}</span>
                                    </p>
                                </div>
                            );
                            const endContent = (
                                <div style={{fontSize: "12px", minWidth: 150}}>
                                    <p style={{display: "flex"}}>
                                        <span>时间：</span>
                                        <span>{record.pEnd && record.pEnd.msg && record.pEnd.msg.time && parseInt(record.start) !== parseInt(record.end) ?
                                            this.timestampToDate(record.pEnd.msg.time || "") : ``}</span>
                                    </p>
                                    <p>行为：{record.pEnd && record.pEnd.msg && record.pEnd.msg.behavior || ""}</p>
                                    <p>记录：{record.pEnd && record.pEnd.msg && record.pEnd.msg.record || ""}</p>
                                    <p>考勤：<span
                                        style={{color: record.pEnd && record.pEnd.msg && record.pEnd.msg.attendance == "正常" ? "#7ED321" : "#F00"}}>
                                        {record.pEnd && record.pEnd.msg && record.pEnd.msg.attendance || ""}</span>
                                    </p>
                                </div>
                            );
                            return (
                                <div key={count} style={{
                                    display: "flex",
                                    width: `${100 * parseFloat(record && record.percent)}%`,
                                    height: 8,
                                }}>
                                    {record.line_color == "blue" ? <Popover placement="bottom" content={startContent}>
                                        <div style={{
                                            width: 8,
                                            height: 8,
                                            cursor: "pointer",
                                            backgroundColor: record.pStart.color == "blue" ? "#1BA1ED" : "#D9534F",
                                            borderRadius: "50%",
                                            display: record.pStart.color == "green" ? "none" : "block"
                                        }}>{}</div>
                                    </Popover> : null}
                                    <hr style={{
                                        backgroundColor: record.line_color == "blue" ? "#1BA1ED" : "#F1F1F1",
                                        height: 3,
                                        flex: `${100 * parseFloat(record.percent)}%`,
                                        width: `${100 * parseFloat(record.percent)}%`,
                                        border: 0,
                                        marginBottom: "3px",
                                        marginTop: "3px",
                                    }}/>
                                    {record.line_color == "blue" ? <Popover placement="bottom" content={endContent}>
                                        <div style={{
                                            width: 8,
                                            height: 8,
                                            cursor: "pointer",
                                            backgroundColor: record.pEnd.color == "blue" ? "#1BA1ED" : "#D9534F",
                                            borderRadius: "50%",
                                            display: record.pEnd.color == "green" ? "none" : "block",
                                        }}>{}</div>
                                    </Popover> : (parseInt(record.start) === parseInt(record.end) && parseInt(item.status) === 2 ?
                                        <div
                                            style={{margin: parseInt(record.start) === parseInt(record.end) ? "0 200px" : "0px"}}>
                                            <Popover placement="bottom" content={startContent || endContent}>
                                                <div style={{
                                                    width: 8,
                                                    height: 8,
                                                    cursor: "pointer",
                                                    backgroundColor: "#D9534F",
                                                    borderRadius: "50%",
                                                }}>{}</div>
                                            </Popover>
                                        </div> : null)}
                                </div>
                            )
                        })}
                    </div>
                )
            },
        },
        ];
    }


    renderBigImg = () => {
        const {item, tScreenshot, sScreenshot, screenshotList} = this.state;
        if (parseInt(item.type) === 0) {
            return (<div style={{margin: "0 25px"}}>
                    <div
                        style={{
                            width: 430,
                            minHeight: 216,
                            background: 'url(' + `${(tScreenshot.screenshot || screenshotList[0] && screenshotList[0].tScreenshot.screenshot) ?
                                require(`@/assets/imgs/icons/icon_wutu_gongkai.jpg`) :
                                require(`@/assets/imgs/icons/icon_wutu_beijing.jpg`)}` + ')' + "no-repeat center center",
                            backgroundOrigin: "paddingBox",
                            backgroundSize: "100% auto",
                            overflow: "hidden"
                        }}>
                        {screenshotList[0] && screenshotList[0].tScreenshot.screenshot ?
                            <img style={{width: 275, margin: "5px 75px"}}
                                 onError={(e) => {
                                     e.target.onerror = null;
                                     e.target.src = require(`@/assets/imgs/icons/icon_wutu_black.jpg`);
                                 }}
                                 src={tScreenshot.screenshot || screenshotList[0].tScreenshot.screenshot}
                                 alt="loading..."/> : null}
                    </div>
                    <div style={{
                        margin: 10,
                        textAlign: "center"
                    }}>
                        {(tScreenshot.logTime ?
                            <span>时间：{moment(tScreenshot.logTime).format('YYYY-MM-DD HH:mm')}</span> : null) || (screenshotList[0] ?
                            <span>时间：{moment(screenshotList[0].tScreenshot.logTime).format('YYYY-MM-DD HH:mm')}</span> : null)}
                    </div>
                </div>
            )
        } else {
            const isNoPic = (tScreenshot && tScreenshot.screenshot)
                || (screenshotList[0] && screenshotList[0].tScreenshot.screenshot)
                || (tScreenshot.screenshot || screenshotList[0] && screenshotList[0].tScreenshot.screenshot);
            return (<div style={{margin: "0 25px"}}>
                    <div style={{
                        width: 450, height: 216,
                        display: "flex",
                        background: 'url(' + `${(parseInt(this.state.item.total_num) > 0 || isNoPic) ?
                            require(`@/assets/imgs/icons/icon_wutu_biaozhun_1.jpg`)
                            : require(`@/assets/imgs/icons/icon_wutu_beijing.jpg`) }` + ')' + "no-repeat center right",
                        backgroundOrigin: "paddingBox",
                        backgroundSize: "100% auto",
                        overflow: "hidden"
                    }}>
                        <div style={{
                            width: 270,
                            height: 216,
                            overflow: "hidden",
                            marginTop: 5
                        }}>
                            {screenshotList[0] && screenshotList[0].tScreenshot.screenshot ? (tScreenshot.screenshot || tScreenshot.screenshot == "") ?
                                <img
                                    style={{
                                        width: 270,
                                        maxHeight: 216,
                                        verticalAlign: "middle"
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = require(`@/assets/imgs/icons/icon_wutu_biaozhun.jpg`);
                                    }}
                                    src={tScreenshot.screenshot}
                                    alt="loading..."/> : <img
                                    style={{
                                        width: 270,
                                        maxHeight: 211,
                                        verticalAlign: "middle"
                                    }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = require(`@/assets/imgs/icons/icon_wutu_biaozhun.jpg`);
                                    }}
                                    src={screenshotList[0] && screenshotList[0].tScreenshot.screenshot}
                                    alt="loading..."/> : null}
                        </div>
                        <div style={{
                            width: 181,
                            height: (sScreenshot && sScreenshot.length) > 4 ? "212px" : "141px",
                            display: "flex",
                            flexWrap: "wrap",
                            overflow: "hidden",
                            marginTop: 5,
                        }}>
                            {sScreenshot && sScreenshot.length ? (sScreenshot.map((ite, idx) => {
                                return (<div key={idx} style={{width: 90, height: 70, overflow: "hidden"}}>
                                    <img style={{width: 90, maxHeight: 70, verticalAlign: "middle"}}
                                         onError={(e) => {
                                             e.target.onerror = null;
                                             e.target.src = require(`@/assets/imgs/icons/icon_wutu_black.jpg`);
                                         }}
                                         src={ite.screenshot}
                                         alt="loading..."/>
                                </div>)
                            })) : (screenshotList[0] && screenshotList[0].sScreenshot.map((ite, idx) => {
                                return (<div key={idx} style={{width: 90, height: 70, overflow: "hidden"}}>
                                    <img style={{width: 90, maxHeight: 70, verticalAlign: "middle"}}
                                         onError={(e) => {
                                             e.target.onerror = null;
                                             e.target.src = require(`@/assets/imgs/icons/icon_wutu_black.jpg`);
                                         }}
                                         src={ite.screenshot}
                                         alt="loading..."/>
                                </div>)
                            }))}
                        </div>
                    </div>
                    <div style={{
                        margin: 10,
                        textAlign: "center"
                    }}>
                        {(tScreenshot.logTime ?
                            <span>时间：{moment(tScreenshot.logTime).format('YYYY-MM-DD HH:mm')}</span> : null) || (screenshotList[0] ?
                            <span>时间：{moment(screenshotList[0].tScreenshot.logTime).format('YYYY-MM-DD HH:mm')}</span> : null)}
                    </div>
                </div>
            )
        }

    }

    renderSmallImg = () => {
        const {screenshotList, tScreenshot, result} = this.state;
        let activeIndex = screenshotList.findIndex(item => item.tScreenshot.screenshot === tScreenshot.screenshot)
        activeIndex = activeIndex === -1 ? 0 : activeIndex;
        return (
            <div style={{
                width: `${screenshotList.length > 2 ? "360" : "240"}px`,
                height: 130,
                display: "flex",
                overflow: "hidden",
                boxSizing: "borderBox",
            }}>
                {screenshotList && screenshotList.length && screenshotList.map((item, index) => {
                    if (parseInt(this.state.item.type) === 0) {
                        return (
                            <div key={index}
                                 style={{
                                     display: "flex",
                                     cursor: "pointer",
                                     width: 110,
                                     height: 90,
                                     marginRight: 10,
                                     overflow: "hidden",
                                 }}
                                 ref={ref => this.box = ref}
                                 onClick={() => {
                                     this.setState({
                                         tScreenshot: item.tScreenshot,
                                         sScreenshot: item.sScreenshot
                                     })
                                 }}
                            >
                                <div style={{
                                    width: 100, height: 90,
                                    display: "flex",
                                    flexWrap: "wrap",
                                    overflow: "hidden",
                                }}>
                                    <div style={{
                                        width: 100, maxHeight: 75,
                                        background: 'url(' + `${screenshotList ?
                                            require(`@/assets/imgs/icons/icon_wutu_wuren.jpg`) :
                                            require(`@/assets/imgs/icons/icon_wutu_wutu.jpg`) }` + ')' + "no-repeat center center",
                                        backgroundOrigin: "paddingBox",
                                        backgroundSize: "100% auto",
                                        overflow: "hidden",
                                        border: `${activeIndex === index ? 1 : 0}` + "px solid #1BA1ED"
                                    }}>
                                        <img style={{width: 100, verticalAlign: "middle"}}
                                             onError={(e) => {
                                                 e.target.onerror = null;
                                                 e.target.src = require(`@/assets/imgs/icons/icon_wutu_black.jpg`);
                                             }}
                                             src={item && item.tScreenshot && item.tScreenshot.screenshot}
                                             alt="loading..."/>
                                    </div>
                                    <div style={{width: 100, height: 15, fontSize: 11, textAlign: "center"}}>
                                        {item.tScreenshot && moment(item.tScreenshot.logTime).format('YYYY-MM-DD HH:mm')}
                                    </div>
                                </div>
                            </div>
                        )
                    } else {
                        return (
                            <div key={index}
                                 style={{
                                     display: "flex",
                                     cursor: "pointer",
                                     width: 130,
                                     height: 90,
                                     marginRight: 10,
                                     overflow: "hidden",
                                 }}
                                 ref={ref => this.box = ref}
                                 onClick={() => {
                                     this.setState({
                                         tScreenshot: item.tScreenshot,
                                         sScreenshot: item.sScreenshot
                                     })
                                 }}
                            >
                                <div
                                    style={{
                                        width: 130,
                                        height: 80,
                                        overflow: "hidden",
                                        display: "flex",
                                        flexWrap: "wrap",
                                    }}>
                                    <div
                                        style={{
                                            width: 130,
                                            height: 54,
                                            display: "flex",
                                            background: 'url(' + `${screenshotList ?
                                                require(`@/assets/imgs/icons/icon_wutu.jpg_liebiao.jpg`) :
                                                require(`@/assets/imgs/icons/icon_wutu_wutu.jpg`) }` + ')' + "no-repeat center center",
                                            backgroundOrigin: "paddingBox",
                                            backgroundSize: "100% auto",
                                            overflow: "hidden",
                                            backgroundColor: "#333",
                                            border: `${activeIndex === index ? 1 : 0}` + "px solid #1BA1ED"
                                        }}
                                    >
                                        <div style={{width: 70, height: 54, overflow: "hidden", marginTop: 2}}>
                                            {item && item.tScreenshot && item.tScreenshot.screenshot ?
                                                <img style={{width: 70, height: 54}}
                                                     onError={(e) => {
                                                         e.target.onerror = null;
                                                         e.target.src = require(`@/assets/imgs/icons/icon_wutu_black.jpg`);
                                                     }}
                                                     src={item.tScreenshot.screenshot}
                                                     alt="loading..."/> : null}
                                        </div>
                                        <div style={{
                                            width: 52,
                                            height: `${item.sScreenshot && item.sScreenshot.length > 4 ? "55px" : "37px"}`,
                                            display: "flex",
                                            flexWrap: "wrap",
                                            overflow: "hidden",
                                            marginBottom: 2
                                        }}>
                                            {item && item.sScreenshot && item.sScreenshot.map((ite, idx) => {
                                                return (
                                                    <div key={idx} style={{width: 23, height: 18}}>
                                                        <img
                                                            style={{
                                                                width: 23,
                                                                height: 18,
                                                                verticalAlign: "middle"
                                                            }}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = require(`@/assets/imgs/icons/icon_wutu_black.jpg`);
                                                            }}
                                                            src={ite.screenshot}
                                                            alt="loading..."/>
                                                    </div>)
                                            })}
                                        </div>
                                    </div>
                                    <div style={{
                                        width: 120,
                                        height: 15,
                                        fontSize: 11,
                                    }}>{item.tScreenshot && moment(item.tScreenshot.logTime).format('YYYY-MM-DD HH:mm')}</div>
                                </div>
                            </div>
                        )
                    }
                })}
            </div>
        )
    }

    afterScreenshot = async () => {
        const {screenshotList, item} = this.state;
        const maxTime = screenshotList[2] && screenshotList[2].tScreenshot.logTime ||
            screenshotList[1] && screenshotList[1].tScreenshot.logTime ||
            screenshotList[0] && screenshotList[0].tScreenshot.logTime;
        await http.post("/course/get-screenshot-list", {
            logTime: maxTime ? moment(maxTime).unix() : "",
            courseId: item.course_id,
            classId: item.class_id,
            direction: 0
        }).then((response) => {
            if (response.error_info.errno === 1) {
                this.setState({
                    screenshotList: response.data
                })
            }
        });
    }

    beforeScreenshot = async () => {
        const {screenshotList, item} = this.state;
        await http.post("/course/get-screenshot-list", {
            logTime: screenshotList[0] && moment(screenshotList[0].tScreenshot.logTime).unix(),
            courseId: item.course_id,
            classId: item.class_id,
            direction: 1
        }).then((response) => {
            if (response.error_info.errno === 1) {
                this.setState({
                    screenshotList: response.data
                })
            }
        });
    }

    render() {
        const {item, items, screenshotList, userList} = this.state;
        return (
            <div style={{padding: 20}}>
                <div style={{display: "flex", margin: "0 0 15px 0"}}>
                    <Breadcrumb style={{flex: "75%"}}>
                        <Breadcrumb.Item>
                            <span>教务管理</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item style={{cursor: 'pointer'}}
                                         onClick={() => {
                                             this.props.history.push('/monitor')
                                         }}>
                            <span>监课</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <span>监课详情</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div style={{backgroundColor: "#fff", padding: 10}}>
                    <div style={{margin: "0 0 15px 0"}}>
                        <h3>{item.class_name}</h3>
                    </div>
                    <div>
                        <Table
                            rowKey={(row) => row.class_id}
                            locale={{emptyText: "暂无数据"}}
                            pagination={false}
                            columns={this.columns}
                            dataSource={items}
                        />
                    </div>
                </div>
                <div style={{display: "flex", marginTop: 5}}>
                    <div style={{
                        width: 500,
                        flex: "1",
                        marginRight: 10,
                        backgroundColor: "#fff",
                        padding: 10,
                        boxSizing: "borderBox",
                    }}>
                        <h3 style={{margin: 10}}>课节截图</h3>
                        <div>
                            {this.renderBigImg()}
                        </div>
                        <div style={{
                            display: "flex",
                            width: 430,
                            height: 100,
                            padding: 10,
                            margin: "0 auto",
                        }}>
                            <Button
                                style={{
                                    marginTop: 5,
                                    border: 0,
                                    display: "block",
                                    width: 30,
                                    height: 58,
                                    background: 'url(' + `${require('@/assets/imgs/icons/btn_arrow_left_normal.jpg')}` + ')' + "no-repeat center center",
                                    backgroundOrigin: "paddingBox",
                                    backgroundSize: "100% auto",
                                    textAlign: "center",
                                }}
                                disabled={screenshotList[0] && screenshotList[0].tScreenshot.logTime ? false : true}
                                onClick={() => this.beforeScreenshot()}
                            />
                            <div style={{
                                width: 400,
                                height: 150,
                            }}>
                                <div
                                    style={{display: `${screenshotList && screenshotList.length ? "block" : "none"}`}}>
                                    {this.renderSmallImg()}
                                </div>
                            </div>
                            <Button
                                style={{
                                    marginTop: 5,
                                    border: 0,
                                    display: "block",
                                    width: 30,
                                    height: 58,
                                    background: 'url(' + `${require('@/assets/imgs/icons/btn_arrow_right_normal.jpg')}` + ')' + "no-repeat center center",
                                    backgroundOrigin: "paddingBox",
                                    backgroundSize: "100% auto",
                                    textAlign: "center",
                                }}
                                disabled={(screenshotList[2] && screenshotList[2].tScreenshot.logTime || screenshotList[1] && screenshotList[1].tScreenshot.logTime || screenshotList[0] && screenshotList[0].tScreenshot.logTime) ? false : true}
                                onClick={() => this.afterScreenshot()}
                            />
                        </div>
                    </div>
                    <Table columns={this.userColumn}
                           locale={{emptyText: "暂无数据"}}
                           pagination={false}
                           dataSource={userList}
                           scroll={{x: 1 | true}}
                           rowKey={(e) => e.userId || e.userName}
                           style={{overflow: "hidden", flex: "100%", backgroundColor: "#fff"}}/>
                </div>
            </div>
        )
    }
}