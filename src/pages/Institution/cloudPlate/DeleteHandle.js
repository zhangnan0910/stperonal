import React from "react";
import {Button, Modal} from 'antd';
import {getCookie} from '@/utils/cookies';
import {message} from "antd/lib/index";
import http from '@/utils/http';

export default class DeleteHandle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            items: props.items,
        }
    }

    showModal = (e) => {
        this.setState({
            visible: true,
        });
    }


    handleCancel = () => {
        this.setState({visible: false});
    }


    deleteFolderHandle = async () => {
        await http.post("/netdisk/del-folder", {
            folderId: this.props.folderSelected.join(','),
        }).then((response) => {
            if (response.error_info.errno === 1) {
                message.success("文件夹删除成功");
                if (this.props.adminId) {
                    this.props.refreshCurFolder();
                } else {
                    this.props.getCloudList();
                }
            } else {
                message.error(response.error_info.error);
            }
        }).catch();
    }

    deleteFileHandle = async () => {
        await http.post("/netdisk/del-file", {
            fileId: this.props.fileSelected.join(','),
        }).then((response) => {
            if (response.error_info.errno === 1) {
                message.success("文件删除成功");
                if (this.props.adminId) {
                    this.props.refreshCurFolder();
                } else {
                    this.props.getCloudList();
                }
            } else {
                message.error(response.error_info.error);
            }
        }).catch();
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

    render() {
        const {visible, loading} = this.state;
        const {folderSelected, fileSelected, adminId} = this.props;
        return (
            <div style={{display: "inline"}}>
                <Button style={{width: 80, marginRight: 10}}
                        disabled={this.trimNull(folderSelected).length === 0 && this.trimNull(fileSelected).length === 0 ? true : false}
                        onClick={this.showModal}
                >
                    删除
                </Button>
                <Modal
                    visible={visible}
                    title="提示"
                    onCancel={this.handleCancel}
                    footer={[<div style={{display: "flex"}} key="button">
                        <Button
                            key="submit"
                            style={{width: 100}}
                            type="primary"
                            onClick={() => {
                                if (this.trimNull(fileSelected).length) {
                                    this.deleteFileHandle();
                                } else if (this.trimNull(folderSelected).length) {
                                    this.deleteFolderHandle();
                                } else {
                                    this.deleteFileHandle();
                                    this.deleteFolderHandle();
                                }

                                this.setState({
                                    visible: false,
                                    loading: true,
                                });
                            }}
                        >
                            确定
                        </Button>
                        <Button
                            key="back"
                            style={{width: 100}}
                            onClick={() => {
                                this.setState({loading: true});
                                setTimeout(() => {
                                    this.setState({loading: false, visible: false});
                                }, 10);
                            }}
                        >
                            取消
                        </Button>
                    </div>
                        ,]}
                >
                    <h3 style={{color: "#f00"}}>您确定要删除课件吗？</h3>
                </Modal>
            </div>
        )
    }
}