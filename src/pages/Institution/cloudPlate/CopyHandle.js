import React from "react";
import {Modal, Button, Tree, Icon} from 'antd';
import {copyFolder, fetchCloudPlateList} from "@/api/netdisk/netdiskAPI";
import {getCookie} from '@/utils/cookies';

const TreeNode = Tree.TreeNode;
export default class CopyHandle extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            adminId: props.adminId,
            folderNames: [],
            getcookies: JSON.parse(unescape(unescape(getCookie("login-token"))))
        }
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
        }, 3000);
    }

    handleCancel = () => {
        this.setState({visible: false});
    }

    iconControl(row) {
        let seat = row.file_name.lastIndexOf(".");
        let ext = row.file_name.substr(seat).toLowerCase();
        let url = ``;

        if (ext === `.pptx` || ext === `.ptx`) {
            url = require('@/assets/imgs/icons/icon_file_ppt.png');
        } else if (ext === `.jpg` || ext === `.png` || ext === `.gif`) {
            url = require('@/assets/imgs/icons/icon_file_img.png');
        } else if (ext === `mp3`) {
            url = require('@/assets/imgs/icons/icon_file_music.png');
        } else if (ext === `mp4`) {
            url = require('@/assets/imgs/icons/icon_file_video.png');
        } else if (ext === "pdf") {
            url = require('@/assets/imgs/icons/icon_file_pdf.png');
        } else if (ext === "doc" || ext === "docx") {
            url = require('@/assets/imgs/icons/icon_file_doc.png');
        } else if (ext === "xlsx") {
            url = require('@/assets/imgs/icons/icon_file_excel.png');
        } else if (ext === "txt") {
            url = require('@/assets/imgs/icons/icon_file_txt.png');
        } else {
            url = require('@/assets/imgs/icons/icon_file.png');
        }
        return url;
    }

    render() {
        const {visible, loading, getcookies, adminId, folderNames} = this.state;
        const {data} = this.props;
        return (
            <div style={{display: "inline"}}>
                <Button style={{width: 80, marginRight: 10}}
                        onClick={this.showModal}
                >
                    复制
                </Button>
                <Modal
                    visible={visible}
                    title="选择复制到的目录"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[<div style={{display: "flex"}}>
                        <Button
                            key="submit"
                            style={{width: 100}}
                            type="primary"
                            loading={loading}
                            onClick={async () => {
                                // console.log(fileId);
                                await mobileFolder({
                                    actionUrl: "http://dev.api.3tclass.3ttech.cn/netdisk/mobile-folder",
                                    SID: getcookies.SID,
                                    safeKey: getcookies.safeKey,
                                    timeStamp: parseInt((new Date().getTime()) / 1000),
                                    folderId: this.props.adminId,
                                    newfolderId: '3'
                                });
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
                    <Tree
                        showIcon
                        defaultExpandAll
                        defaultSelectedKeys={['0-0-0']}
                    >
                        <TreeNode
                            icon={<img style={{width: 20}} src={require('@/assets/imgs/icons/icon_file.png')} alt=""/>}
                            title="机构云盘"
                            key="0-0">
                            {data && data.map((row, index) => {
                                return (
                                    <TreeNode
                                        icon={<img style={{width: 20}}
                                                   src={row.file_name ? this.iconControl(row) : require('@/assets/imgs/icons/icon_file.png')}
                                                   alt=""/>}
                                        title={row.folder_name || row.file_name}
                                        key={index}>

                                    </TreeNode>
                                )
                            })}
                        </TreeNode>
                    </Tree>
                </Modal>
            </div>
        );
    }
}
