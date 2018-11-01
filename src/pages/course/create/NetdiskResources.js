import React from "react";
import {Modal, Button, Table, Icon, Tooltip} from 'antd';
import http from '@/utils/http';
import {message} from "antd/lib/index";
import "./style.less";

export default class NetdiskResources extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            items: [],
            adminId: "",
            topData: "",
            data: [],
            fileNameArr: [],
            folderId: []
        }
    }

    componentDidMount() {
        (async () => {
            const data = await this.getTopFolderId();
            this.setState({topData: data});
            this.getCloudList();
        })();
    }

    getTopFolderId = () => {
        return http.post("/netdisk/get-top-folder-id", {}).then((response) => {
            return response.data;
        });
    }

    getCloudList = async () => {
        const {topData, data, adminId} = this.state;
        const datas = await http.post("/netdisk/get-cloud-list", {
            folderId: topData || adminId,
        }).then((response) => {
            return response.data;
        });
        this.setState({
            data: [],
            items: datas && datas.folder_list && datas.folder_list.concat(datas && datas.file_list),
        });
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

    showModal = () => {
        this.setState({
            visible: true,
        });
    }

    handleOk = () => {
        this.setState({loading: true});
        setTimeout(() => {
            this.setState({loading: false, visible: false});
        }, 100);
    }

    handleCancel = () => {
        this.setState({visible: false});
    }

    getBreadCrumbs = (row) => {
        return http.post("/netdisk/bread-crumbs", {
            folderId: row.folder_id,
        }).then((response) => {
            return response.data;
        })
    }

    isInArray = (row) => {
        const {folderId} = this.state;
        const isIn = folderId.some((item) => item.id === row.id);
        if (!isIn) {
            const fileArr = folderId && folderId.concat({
                id: row.id,
                file_name: row.file_name
            })
            this.setState({
                folderId: fileArr
            })
        }
    }

    isAtArray = (row) => {
        const isAt = this.props.folderId.some((item) => item.id === row.id);
        if (!isAt) {
            const fileArrs = this.props.folderId && this.props.folderId.concat({
                id: row.id,
                file_name: row.file_name
            })
            this.props.fetchNetDiskFileID(fileArrs);
        }
    }


    get columns() {
        const {adminId, folderId, fileNameArr} = this.state;
        return [{
            title: "文件名",
            dataIndex: 'folder_name',
            render: (value, row) => {
                if (value || row.folderName || row.folder_name) {
                    return (
                        <Tooltip placement="leftTop" title={<span>{value || row.folderName || row.folder_name}</span>}>
                            <Button
                                style={{
                                    border: 0,
                                    textAlign: "left",
                                    width: 200,
                                    overflow: 'hidden',
                                    textOverflow: "ellipsis",
                                }}
                                onClick={async () => {
                                    const datas = await http.post("/netdisk/get-cloud-list", {
                                        folderId: row.id || row.folder_id,
                                    }).then(function (response) {
                                        return response.data;
                                    });
                                    const arr = await this.getBreadCrumbs(row);
                                    this.setState({
                                        adminId: row.id || row.folder_id,
                                        data: arr,
                                        items: datas && datas.folder_list && datas.folder_list.concat(datas.file_list)
                                    });
                                }}>
                                <img src={require('@/assets/imgs/icons/icon_file.png')} width={18} alt="loading..."/>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <span style={{textIndent: "5em"}}>{value || row.folderName || row.folder_name}</span>
                            </Button>
                        </Tooltip>
                    )
                } else {
                    return (
                        <Tooltip placement="leftTop" title={<span>{row.file_name}</span>}>
                            <Button
                                style={{
                                    border: 0,
                                    textAlign: "left",
                                    width: 200,
                                    overflow: 'hidden',
                                    textOverflow: "ellipsis",
                                }}
                                onClick={() => {
                                    if (this.props.type === "create") {
                                        this.isInArray(row);
                                    } else {
                                        this.isAtArray(row);
                                    }
                                }}
                            >
                                <img
                                    src={row.file_name ? this.iconControl(row) : require('@/assets/imgs/icons/icon_file.png')}
                                    style={{width: 15, height: 15}}
                                    alt="loading..."/>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <span style={{textIndent: "5em"}}>{row.file_name}</span>
                            </Button>
                        </Tooltip>
                    )
                }

            },
        }];
    }

    get column() {
        const {folderId, fileNameArr} = this.state;
        return [{
            title: '已选择',
            dataIndex: 'file_name',
            key: 'file_name',
            render: (value, row, index) => {
                return (<div style={{display: "flex"}}>
                    <Tooltip placement="right" title={<span>{value}</span>}>

                        {/*&nbsp;&nbsp;&nbsp;&nbsp;*/}
                        <span style={{flex: "80%"}}>
                            <img
                                src={row.file_name ? this.iconControl(row) : require('@/assets/imgs/icons/icon_file.png')}
                                style={{width: 15, height: 15}}
                                alt="loading..."/>
                            <Button
                                style={{
                                    textAlign: "left",
                                    width: 120,
                                    overflow: 'hidden',
                                    textOverflow: "ellipsis",
                                    border: 0
                                }}
                            >{value}</Button>
                    </span>
                        <Icon
                            style={{flex: "1%", marginRight: 0, color: "#0af", marginTop: 8, cursor: "pointer"}}
                            type={`delete`}
                            onClick={() => {
                                if (this.props.type === "create") {
                                    const stateData = folderId.slice(0, index).concat(folderId.slice(index + 1));
                                    this.setState({
                                        folderId: stateData
                                    })
                                } else {
                                    const propsData = this.props.folderId.slice(0, index).concat(this.props.folderId.slice(index + 1));
                                    this.props.fetchNetDiskFileID(propsData);
                                }

                            }}
                        />
                    </Tooltip>
                </div>)
            },
        }];
    }


    render() {
        const {getcookies, visible, loading, items, topData, adminId, data, folderId, fileNameArr} = this.state;
        return (
            <div style={{display: "inline"}}>
                {this.props.folderId.length && this.props.type === "edit" ?
                    <Button
                        style={{
                            width: 150,
                            // overflow: 'hidden',
                            // textOverflow: "ellipsis",
                            // backgroundColor: "#3CA512",
                            // color: "#fff",
                            // border: 0
                        }}
                        onClick={this.showModal}><span>已选文件（&nbsp;<h4
                        style={{display: "inline", color: "#1890ff"}}>{this.props.folderId.length}</h4>&nbsp;）</span>
                        {/*{this.props.folderId.map((item, index) => {*/}
                        {/*return (<span key={index}>{item.file_name}/</span>)*/}
                        {/*})}*/}
                    </Button>
                    : (folderId.length && this.props.type === "create" ?
                        <Button
                            style={{
                                width: 150,
                                // overflow: 'hidden',
                                // textOverflow: "ellipsis",
                                // backgroundColor: "#3CA512",
                                // color: "#fff",
                                // border: 0
                            }}
                            onClick={this.showModal}><span>已选文件（&nbsp;<h4
                            style={{display: "inline", color: "#1890ff"}}>{folderId.length}</h4>&nbsp;）</span>
                            {/*{folderId.map((item, index) => {*/}
                            {/*return (<span key={index}>{item.file_name}/</span>)*/}
                            {/*})}*/}
                        </Button>
                        : <Button style={{width: 150}}
                                  onClick={this.showModal}>请选择云盘资源</Button>)
                }
                <Modal
                    visible={visible}
                    title="云盘"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[<div style={{display: "flex"}} key={'button'}>
                        <Button
                            key="submit"
                            style={{width: 100}}
                            type="primary"
                            loading={loading}
                            onClick={() => {
                                if (this.props.type === "edit") {
                                    this.props.fetchNetDiskFileID(this.props.folderId);
                                } else {
                                    this.props.fetchNetDiskFileID(folderId);
                                }
                                this.setState({visible: false});
                            }}
                        >
                            确定
                        </Button>
                        <Button
                            key="back"
                            style={{width: 100}}
                            onClick={() => {
                                this.setState({visible: false});
                            }}
                        >
                            取消
                        </Button>
                    </div>
                        ,]}
                >
                    <div style={{padding: 10}}>
                        <img src={require('@/assets/imgs/icons/icon_cloud.jpg')} style={{cursor: "pointer"}}
                             width={20} alt="loading..."/>
                        <span>
                            {data.map((item, index) => {
                                return (<span key={index}>&nbsp;&nbsp;&nbsp;&nbsp;/
                                        <Button
                                            style={{display: "inline", width: "auto", border: 0}}
                                            onClick={async () => {
                                                const datas = await http.post("/netdisk/get-cloud-list", {
                                                    folderId: item.id,
                                                }).then((response) => {
                                                    return response.data;
                                                });
                                                this.setState({
                                                    adminId: item.id,
                                                    items: datas && datas.folder_list && datas.folder_list.concat(datas.file_list),
                                                    data: data.slice(0, index + 1)
                                                });
                                            }}>{item.folderName}</Button>
                                    </span>)
                            })}
                            </span>
                    </div>
                    <div style={{display: "flex"}} className="netdisk-source">
                        <Table
                            style={{width: 250, minHeight: 300}}
                            locale={{emptyText: "暂无文件"}}
                            rowKey={e => e.folder_id || e.id}
                            columns={this.columns}
                            pageSize={5}
                            pagination={false}
                            scroll={{y: 300 | true}}
                            dataSource={items}
                            size="small"
                        />
                        <Table
                            style={{width: 200, minHeight: 300}}
                            locale={{emptyText: "暂无文件"}}
                            columns={this.column}
                            rowKey={e => e.id}
                            pageSize={5}
                            pagination={false}
                            scroll={{y: 300 | true}}
                            dataSource={this.props.type === "edit" ? this.props.folderId : folderId}
                            size="small"
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}
