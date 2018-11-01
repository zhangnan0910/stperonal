import React from "react";
import {Modal, Button, Upload, Icon, message, Input} from 'antd';
import http from '@/utils/http';
import {baseUrl} from "@/common/js/index";
import {getCookie} from '@/utils/cookies';

const Dragger = Upload.Dragger;

export default class UploadHandle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getcookies: JSON.parse(unescape(unescape(getCookie("login-token")))),
            loading: false,
            visible: false,
            Filedata: ''
        }
    }

    showModal = () => {
        this.setState({
            Filedata: '',
            loading: false,
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

    get uploadDatas() {
        const {getcookies} = this.state;
        let self = this;
        return {
            name: 'name[]',
            multiple: true,
            accept: "application/msword," + "application/vnd.ms-powerpoint," +
            "image/jpeg," + "image/gif," + "image/png," +
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document," +
            "application/vnd.ms-powerpoint,application/pdf," + "application/vnd.ms-works," +
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            action: `${baseUrl()}/upload/get-files-url`,
            data: {
                SID: getcookies.SID,
                safeKey: getcookies.safeKey,
                timeStamp: getcookies.timeStamp,
                folderId: this.props.adminId,
            },
            onChange(info) {
                self.setState({
                    Filedata: info
                });
                const status = info.file.status;
                if (status !== 'uploading') {
                    // console.log(info.file, info.fileList);
                }
                if (status === 'done') {
                    message.destroy();
                    message.success(`${info.file.name} 预上传成功`);
                } else if (status === 'error') {
                    message.destroy();
                    message.error(`${info.file.name} 预上传失败.`);
                }
            },
        }
    }


    render() {
        const {visible, loading, Filedata} = this.state;
        const {data, topData, adminId} = this.props;
        return (
            <div style={{display: "inline"}}>
                <Button
                    type="primary"
                    style={{marginRight: 10, width: 120}}
                    onClick={this.showModal}
                >
                    <Icon type="cloud-upload" theme="outlined"/>上传文件
                </Button>
                <Modal
                    destroyOnClose={true}
                    visible={visible}
                    title="上传文件到云盘机构"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[<div style={{display: "flex"}} key="button">
                        <Button
                            key="submit"
                            style={{width: 100}}
                            type="primary"
                            onClick={async () => {
                                if (Filedata.fileList) {
                                    const result = Filedata.fileList.some((upFile) => {
                                        let suffix = ['docx', 'doc', 'pptx', 'ppt', 'pdf', 'gif', 'jpg', 'jpeg', 'bmp', 'png'];
                                        return suffix.indexOf(upFile.name.slice(upFile.name.lastIndexOf(".") + 1)) < 0;
                                    });
                                    if (result) {
                                        message.destroy();
                                        message.error('上传文件格式错误');
                                    } else {
                                        await http.post("/netdisk/upload-files", {
                                            folderId: adminId || topData,
                                            file: JSON.stringify(Filedata.fileList)
                                        }).then((response) => {
                                            if (response.error_info.errno === 1) {
                                                message.destroy();
                                                message.success("文件上传成功");
                                                if (adminId) {
                                                    this.props.refreshCurFolder();
                                                } else {
                                                    this.props.getCloudList();
                                                }
                                            } else {
                                                message.destroy();
                                                message.error(response.error_info.error);
                                            }
                                        }).catch();
                                        this.setState({
                                            visible: false,
                                            loading: true
                                        });
                                    }
                                } else {
                                    message.destroy();
                                    message.error("请选择文件");
                                }
                            }}
                        >
                            确定
                        </Button>
                        <Button
                            key="back"
                            style={{width: 100}}
                            onClick={() => {
                                this.setState({
                                    visible: false,
                                    loading: true
                                });
                            }}
                        >
                            取消
                        </Button>
                    </div>
                        ,]}
                >
                    <Dragger {...this.uploadDatas}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="upload"/>
                        </p>
                        <p className="ant-upload-text">选择文件</p>
                    </Dragger>
                </Modal>
            </div>
        );
    }
}
