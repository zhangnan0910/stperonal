import React from "react";
import {Input, Button, Modal, Icon, Carousel, Tooltip} from 'antd';
import "./style.less";
import http from '@/utils/http';
import Dialog from '@/components/Dialog'
import {message} from "antd/lib/index";

export default class FileShow extends React.Component {
    constructor(props) {
        super(props);
    }

    uploadHandle = async (row) => {
        await http.get("/netdisk/download", {
            fileUrl: row.originalSrc
        })
    }
    onPreview = (record) => {
        const {row} = this.props;
        if (parseInt(row.convert) === -1) {
            message.destroy();
            message.error("正在转码中，暂时不可预览");
        } else {
            this.dialog.setData(record)
        }
    }

    render() {
        const {row} = this.props;
        return (
            <div style={{display: "inline"}}>
                    <span
                        onClick={() => this.onPreview(row)}
                        style={{
                            width: 400,
                            display: "block",
                            overflow: 'hidden',
                            textOverflow: "ellipsis",
                            whiteSpace: 'nowrap',
                            cursor: "pointer",
                            marginLeft: -15
                        }}>
                    &nbsp;&nbsp;&nbsp;&nbsp;
                        <img
                            src={row.file_name ? this.props.iconControl(row) : require('@/assets/imgs/icons/icon_file.png')}
                            width={25} alt="loading..."/>
                        &nbsp;&nbsp;&nbsp;&nbsp;
                        <Tooltip placement="top" title={row.file_name}>
                               <span style={{textIndent: "5em"}}>{row.file_name}</span>
                        </Tooltip>
                        <Dialog ref={c => this.dialog = c}/>
                </span>
            </div>
        );
    }
}
