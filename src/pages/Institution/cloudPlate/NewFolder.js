import React from "react";
import {Modal, Button, Input, message} from 'antd';
import http from '@/utils/http';

export default class NewFolder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            folderName: '',
        }
    }


    showModal = () => {
        this.setState({
            folderName: "",
            loading: false,
            visible: true,
        });
    }

    handleOk = () => {
        this.setState({loading: true});
        setTimeout(() => {
            this.setState({loading: false, visible: false});
        }, 3000);
    }

    handleCancel = () => {
        this.setState({visible: false});
    }

    render() {
        const {visible, loading, folderName} = this.state;
        const {data, topData, adminId} = this.props;
        return (
            <div style={{display: "inline"}}>
                <Button style={{marginRight: 10, width: 100}}
                        onClick={this.showModal}
                >
                    新建文件夹
                </Button>
                <Modal
                    visible={visible}
                    title="新建文件夹"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[<div style={{display: "flex"}} key="button">
                        <Button
                            key="submit"
                            style={{width: 100}}
                            type="primary"
                            onClick={async () => {
                                if (folderName === "") {
                                    message.destroy();
                                    message.error("文件夹名不能为空");
                                } else {
                                    await http.post("/netdisk/create-folder", {
                                        folderName: folderName,
                                        folderId: adminId || topData,
                                    }).then((response) => {
                                        if (response.error_info.errno === 1) {
                                            message.success("文件夹新建成功");
                                            if (adminId) {
                                                this.props.refreshCurFolder();
                                            } else {
                                                this.props.getCloudList();
                                            }
                                        } else {
                                            message.error(response.error_info.error);
                                        }
                                    }).catch();
                                    this.setState({
                                        visible: false,
                                        loading: true,
                                    });
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
                                    loading: true,
                                    visible: false,
                                });
                            }}
                        >
                            取消
                        </Button>
                    </div>
                        ,]}
                >
                    <div>
                        <span>文件夹名称：</span>
                        <Input
                            maxlength={40}
                            value={folderName}
                            placeholder="请输入文件夹名称"
                            style={{width: 350}}
                            onChange={(e) => {
                                this.setState({
                                    folderName: e.target.value
                                })
                            }}
                        />
                    </div>
                </Modal>
            </div>
        );
    }
}
