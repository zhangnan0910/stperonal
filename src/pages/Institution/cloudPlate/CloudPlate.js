import React from 'react';
import {Table, Button, Input, Icon, Modal, Breadcrumb, Tooltip} from 'antd';
import {Link} from "react-router-dom";
import DeleteHandle from "@/pages/Institution/cloudPlate/DeleteHandle";
import MoblieHandle from "@/pages/Institution/cloudPlate/MoblieHandle";
import CopyHandle from "@/pages/Institution/cloudPlate/CopyHandle";
import NewFolder from "@/pages/Institution/cloudPlate/NewFolder";
import UploadHandle from "@/pages/Institution/cloudPlate/UploadHandle";
import FileShow from "@/pages/Institution/cloudPlate/FileShow";
import http from '@/utils/http';
import {message} from "antd/lib/index";

const confirm = Modal.confirm;
const Search = Input.Search;

class CloudPlate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: [],
            topData: "",
            loading: false,
            data: [],
            adminId: '',
            fileSelected: [],
            folderSelected: [],
            selectedRowKeys: [],
        }
    }

    componentDidMount() {
        (async () => {
            const topData = await this.getTopFolderId();
            this.setState({topData: topData, adminId: topData});
            this.getCloudList();
        })();
    }

    getTopFolderId = () => {
        return http.post("/netdisk/get-top-folder-id", {}).then((response) => {
            if (response.error_info.errno === 1) {
                return response.data;
            }
        });
    }

    getCloudList = async () => {
        const {topData, data, adminId} = this.state;
        const datas = await http.post("/netdisk/get-cloud-list", {
            folderId: topData || adminId,
        }).then((response) => {
            if (response.error_info.errno === 1) {
                return response.data;
            }
        });
        this.setState({
            data: [],
            items: datas && datas.folder_list && datas.folder_list.concat(datas && datas.file_list),
        });
    }

    refreshCurFolder = async () => {
        const {adminId, topData} = this.state;
        const datas = await http.post("/netdisk/get-cloud-list", {
            folderId: adminId || topData,
        }).then((response) => {
            if (response.error_info.errno === 1) {
                return response.data;
            }
        });
        this.setState({
            items: datas && datas.folder_list && datas.folder_list.concat(datas && datas.file_list),
        });
    }

    searchList(value) {
        return http.post("/netdisk/search", {
            connect: value
        }).then((response) => {
            if (response.error_info.errno === 1) {
                return response.data;
            }
        })
    }

    getBreadCrumbs = (row) => {
        return http.post("/netdisk/bread-crumbs", {
            folderId: row.folder_id,
        }).then((response) => {
            if (response.error_info.errno === 1) {
                return response.data;
            }
        })
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

    start = () => {
        this.setState({loading: true});
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 100);
    }

    trimNull = (array) => {
        for (let i = 0; i < array.length; i++) {
            if (array[i] === "" || typeof(array[i]) === "undefined") {
                array.splice(i, 1);
                i = i - 1;
            }
        }
        return array;
    }

    get NetdiskColumns() {
        return [{
            title: '文件名',
            key: `folderName`,
            dataIndex: `folderName`,
            render: (value, row) => {
                if (value || row.folderName || row.folder_name) {
                    return (<div>
                            <span style={{
                                width: 400,
                                display: "block",
                                overflow: 'hidden',
                                textOverflow: "ellipsis",
                                whiteSpace: 'nowrap',
                                cursor: "pointer"
                            }}
                                  onClick={async () => {
                                      const data = await http.post("/netdisk/get-cloud-list", {
                                          folderId: row.id || row.folder_id,
                                      }).then(function (response) {
                                          return response.data;
                                      });
                                      const arr = await this.getBreadCrumbs(row);
                                      this.setState({
                                          adminId: row.id || row.folder_id,
                                          data: arr,
                                          items: data && data.folder_list && data.folder_list.concat(data && data.file_list)
                                      });
                                  }}>
                            <img src={require('@/assets/imgs/icons/icon_file.png')} width={25} alt="loading..."/>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <Tooltip placement="top" title={value || row.folderName || row.folder_name}>
                                <span style={{
                                    textIndent: "5em",
                                }}>{value || row.folderName || row.folder_name}</span>
                                  </Tooltip>
                        </span>
                    </div>)
                } else {
                    return (<FileShow row={row}
                                      iconControl={this.iconControl.bind(this)}
                    />)
                }
            }
        }, {
            title: '大小',
            key: 'file_size',
            dataIndex: 'file_size',
            render: (value, row) => {
                return (<div>
                    {value ? `${value > (1024 * 1000) ? `${(value / (1024 * 1000)).toFixed(2)}M` : `${(value / 1024).toFixed(0)}kb` }` : `---`}
                </div>)
            }
        }, {
            title: '修改日期',
            key: "folder_time",
            dataIndex: 'folder_time',
            render: (value, row) => {
                return (<span>{value || row.file_time}</span>)
            }
        }];
    }

    get rowSelection() {
        const {fileSelected, folderSelected} = this.state;
        let fileIds = [];
        let folderIds = [];
        let noteFiles = [];
        let self = this;
        return {
            onChange: (selectedRowKeys, selectedRows) => {
                selectedRows.forEach((item, index) => {
                    fileIds ? fileIds.push(item.id) : fileIds;
                    folderIds ? folderIds.push(item.folder_id) : folderIds;
                })
                self.setState({
                    selectedRowKeys: selectedRowKeys,
                    fileSelected: fileIds,
                    folderSelected: folderIds,
                    noteFiles: selectedRows
                })
            },
            getCheckboxProps:
                record => ({
                    disabled: record.name === 'Disabled User',
                    name: record.name,
                }),
        };
    }

    render() {
        const {items, data, noteFiles, adminId, topData, fileSelected, folderSelected} = this.state;
        return (
            <div style={{padding: 20}}>
                <div style={{display: "flex"}}>
                    <Breadcrumb style={{flex: "95%"}}>
                        <Breadcrumb.Item>
                            <span>机构管理</span>
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <span>云盘管理</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                    <Button style={{flex: "5%", margin: "0 0 15px 0"}}
                            onClick={() => {
                                this.start();
                                if (adminId) {
                                    this.refreshCurFolder();
                                } else {
                                    this.getCloudList();
                                }
                                this.setState({
                                    selectedRowKeys: [],
                                })
                            }}
                    >
                        <Icon type="sync"/>
                    </Button>
                </div>
                <div style={{backgroundColor: "#fff", padding: 15}}>
                    <div>
                        <h3>云盘管理</h3>
                    </div>
                    <div style={{display: 'flex'}}>
                        <div style={{marginBottom: 15, flex: "50%"}}>
                            <UploadHandle data={data}
                                          topData={topData}
                                          getCloudList={this.getCloudList.bind(this)}
                                          adminId={adminId}
                                          refreshCurFolder={this.refreshCurFolder.bind(this)}
                            />
                            <NewFolder data={data}
                                       topData={topData}
                                       adminId={adminId}
                                       getCloudList={this.getCloudList.bind(this)}
                                       refreshCurFolder={this.refreshCurFolder.bind(this)}
                            />
                            <Button style={{width: 100, marginRight: 10}}
                                    disabled={(this.trimNull(fileSelected).length !== 0 || this.trimNull(folderSelected).length !== 0) ? false : true}
                                    onClick={() => {
                                        if (this.trimNull(folderSelected).length === 0) {
                                            this.props.history.push({
                                                pathname: '/note',
                                                state: noteFiles
                                            })
                                        } else {
                                            message.destroy();
                                            message.error("文件夹暂不支持课件备注");
                                        }
                                    }}
                            >
                                课件备注
                            </Button>
                            <DeleteHandle fileSelected={fileSelected}
                                          folderSelected={folderSelected}
                                          adminId={adminId}
                                          getCloudList={this.getCloudList.bind(this)}
                                          refreshCurFolder={this.refreshCurFolder.bind(this)}
                            />
                            {/*<MoblieHandle data={data} adminId={adminId}/>*/}
                            {/*<CopyHandle data={data} adminId={adminId}/>*/}
                        </div>
                        <div style={{marginRight: 0}}>
                            <Search
                                placeholder="搜索"
                                onSearch={async (value) => {
                                    if (value) {
                                        const data = await this.searchList(value);
                                        this.setState({
                                            items: data.folder_list && data.folder_list.concat(data && data.file_list),
                                        })
                                    } else {
                                        this.getCloudList();
                                    }
                                }}
                                style={{width: 150, marginRight: 10}}
                            />
                        </div>
                    </div>
                    <div>
                        <div style={{display: "flex"}}>
                            <a>
                                <img src={require('@/assets/imgs/icons/icon_cloud.jpg')} style={{cursor: "pointer"}}
                                     width={25} alt="loading..."/>
                            </a>
                            &nbsp;&nbsp;
                            <span>
                                {data.map((item, index) => {
                                    return (<span key={index}>&nbsp;&nbsp;/
                                        <Button
                                            style={{display: "inline", width: "auto", border: 0}}
                                            onClick={async () => {
                                                const datas = await http.post("/netdisk/get-cloud-list", {
                                                    folderId: item.id,
                                                }).then((response) => {
                                                    if (response.error_info.errno === 1) {
                                                        return response.data;
                                                    }
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
                        <Table rowSelection={this.rowSelection}
                               locale={{emptyText: "暂无文件"}}
                               columns={this.NetdiskColumns}
                               dataSource={items}
                               rowKey={e => e.id || e.folder_id || e.file_id}
                               style={{marginTop: 15}}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default CloudPlate;