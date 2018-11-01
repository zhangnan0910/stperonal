import React from "react";
import {Table, Button, Icon, Breadcrumb, Input, Tooltip} from 'antd';
import {getCookie} from '@/utils/cookies';
import http from '@/utils/http';
import {message} from "antd/lib/index";
import "@/pages/course/create/style.less";

class CourseNote extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getcookies: JSON.parse(unescape(unescape(getCookie("login-token")))),
            noteFiles: this.props.history.location.state,
            fileDatas: [],
            previewDatas: [],
            note: "",
            fileId: ""
        }
    }

    componentDidMount() {
        this.getPageNote();
    }

    iconControl(row) {
        let seat = row.file_name.lastIndexOf(".");
        let ext = row.file_name.substr(seat).toLowerCase();
        let url = ``;
        if (ext === `.pptx` || ext === `.ppt`) {
            url = require('@/assets/imgs/icons/icon_file_ppt.png');
        } else if (ext === `.jpg` || ext === `.png` || ext === `.gif` || ext === `.jpeg` || ext === `.bmp`) {
            url = require('@/assets/imgs/icons/icon_file_img.png');
        } else if (ext === `.mp3` || ext === `.wma`) {
            url = require('@/assets/imgs/icons/icon_file_music.png');
        } else if (ext === `.mp4` || ext === `.rmvb` || ext === `.avi`) {
            url = require('@/assets/imgs/icons/icon_file_video.png');
        } else if (ext === ".pdf") {
            url = require('@/assets/imgs/icons/icon_file_pdf.png');
        } else if (ext === ".doc" || ext === ".docx") {
            url = require('@/assets/imgs/icons/icon_file_doc.png');
        } else if (ext === ".xlsx" || ext === `.xls`) {
            url = require('@/assets/imgs/icons/icon_file_excel.png');
        } else if (ext === ".txt") {
            url = require('@/assets/imgs/icons/icon_file_txt.png');
        } else {
            url = require('@/assets/imgs/icons/icon_weizhi.jpg');
        }
        return url;
    }


    get noteFileColumns() {
        return [{
            title: '文件名',
            key: "file_name",
            dataIndex: 'file_name',
            render: (value, row) => {
                // let activeIndex = this.state.noteFiles.findIndex(record => {
                //     console.log(record)
                //     console.log(row)
                //     return record.id === row.id
                // })
                // activeIndex = activeIndex === -1 ? 0 : activeIndex;
                return (<Tooltip placement="top" title={value}>
                    <Button
                        style={{
                            border: 0,
                            width: 350,
                            display: "block",
                            overflow: 'hidden',
                            textOverflow: "ellipsis",
                            whiteSpace: 'nowrap',
                            cursor: "pointer",
                            textAlign: "left",
                            // backgroundColor: activeIndex ? "#1af" : "#ff0"
                        }}
                        onClick={async () => {
                            await http.post("/netdisk/get-page-note", {
                                id: row.id
                            }).then((response) => {
                                if (response.error_info.errno === 1) {
                                    const {imgSrcData = '[]', pageNotes = '[]'} = response.data;
                                    const urls = JSON.parse(imgSrcData) || [];
                                    const notes = JSON.parse(pageNotes) || [];
                                    const data = urls.map((item, index) => {
                                        return {
                                            page: index,
                                            url: item,
                                            note: notes[index] || ''
                                        };
                                    })
                                    this.setState({
                                        previewDatas: data,
                                        fileId: row.id
                                    })
                                }
                            })
                        }}>
                        <img src={this.iconControl(row)} width={25} alt="loading..."/>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <span>{value}</span>
                    </Button>
                </Tooltip>)
            }
        }];
    }

    get previewColumns() {
        return [{
            title: '课件预览',
            key: "url",
            dataIndex: 'url',
            width: 200,
            render: (value, row, index) => {
                if (row) {
                    return (<figure style={{border: 0, width: 200}}>
                        <img width={200} src={value} alt=""/>
                        <figcaption style={{textAlign: "center"}}>{parseInt(row.page) + 1}</figcaption>
                    </figure>)
                }
            }
        }, {
            title: <div style={{textAlign: "center"}}>Note内容</div>,
            key: "note",
            dataIndex: 'note',
            flex: "70%",
            render: (value, row, index) => {
                return (<div style={{width: "100%", padding: "1px 30px"}}>
                    <textarea
                        style={{width: "100%", backgroundColor: "#fff", padding: 12}}
                        rows="5"
                        value={value}
                        onBlur={() => this.setPageNote()}
                        onChange={(e) => {
                            const newNote = e.target.value;
                            const previewDatas = this.state.previewDatas;
                            const newPreviewDatas = [
                                ...previewDatas.slice(0, index),
                                Object.assign({}, row, {note: newNote}),
                                ...previewDatas.slice(index + 1)
                            ]
                            this.setState({
                                previewDatas: newPreviewDatas
                            })
                        }}

                    />
                </div>)
            }
        }];
    }


    getPageNote = async () => {
        const {noteFiles} = this.state;
        await http.post("/netdisk/get-page-note", {
            id: noteFiles[0].id
        }).then((response) => {
            if (response.error_info.errno === 1) {
                const {imgSrcData = '[]', pageNotes = '[]'} = response.data;
                const urls = JSON.parse(imgSrcData) || [];
                const notes = JSON.parse(pageNotes) || [];
                const data = urls.map((item, index) => {
                    return {
                        page: index,
                        url: item,
                        note: notes[index] || ''
                    };
                })
                this.setState({
                    previewDatas: data,
                    fileId: noteFiles[0].id
                })
            }
        })
    }

    setPageNote = async () => {
        const {fileId, previewDatas} = this.state;
        await http.post("/netdisk/set-page-note", {
            fileId: fileId,
            data: JSON.stringify(previewDatas.map(item => item.note))
        }).then((response) => {
            if (response.error_info.errno !== 1) {
                message.destroy();
                message.error(response.error_info.error);
            }
        });
    }

    render() {
        const {previewDatas, noteFiles, fileId} = this.state;

        return (
            <div style={{padding: 20}}>
                <div style={{display: "flex", margin: "0 0 15px 0"}}>
                    <Breadcrumb style={{flex: "95%"}}>
                        <Breadcrumb.Item>
                            <span>机构管理</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item
                            style={{cursor: 'pointer'}}
                            onClick={() => {
                                this.props.history.push('/netdisk')
                            }}>
                            <span>云盘管理</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <span>课件Note</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <div style={{backgroundColor: "#fff", padding: 15}}>
                    <div style={{display: "flex"}}>
                        <h3 style={{flex: "40%"}}>课件Note</h3>
                        <Button type="primary"
                                style={{width: 100}}
                                onClick={async () => {
                                    await http.post("/netdisk/set-page-note", {
                                        fileId: fileId,
                                        data: JSON.stringify(previewDatas)
                                    }).then((response) => {
                                        if (response.error_info.errno === 1) {
                                            message.destroy();
                                            message.success('保存成功');
                                        }
                                    });
                                }}>
                            <Icon type="save" theme="outlined"/>保存
                        </Button>
                    </div>
                    <div style={{display: "flex", marginTop: 15}}>
                        <div style={{
                            minWidth: 350,
                            marginRight: 10,
                            border: "1px solid #eee"
                        }}>
                            <Table
                                dataSource={noteFiles}
                                columns={this.noteFileColumns}
                                pagination={false}
                                locale={{emptyText: "暂无文件"}}
                                rowKey={(file) => file.id}
                            />
                        </div>
                        <div style={{flex: "60%"}} className="course-note">
                            <Table
                                dataSource={previewDatas}
                                columns={this.previewColumns}
                                locale={{emptyText: "暂无预览"}}
                                scroll={{y: 500 | true}}
                                rowKey={(file) => file.url || file.page}
                            />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CourseNote;