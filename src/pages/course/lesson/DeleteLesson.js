import React from "react";
import {Modal, Button, Icon} from 'antd';
import {message} from "antd/lib/index";
import http from '@/utils/http';

export default class DeleteLesson extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
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
        }, 100);
    }

    handleCancel = () => {
        this.setState({visible: false});
    }


    render() {
        const {visible, loading} = this.state;
        const {rows, row} = this.props;
        return (
            <div style={{display: "inline"}}>
                <img style={{padding: 10, cursor: 'pointer'}}
                     className='minus-circle-o user-bj'
                     onClick={(e) => {
                         this.setState({
                             visible: true,
                         });
                     }}
                     src={require(`@/assets/imgs/icons/icon_delete_normal.png`)}
                     alt="loading..."/>
                <Modal
                    visible={visible}
                    title="提示"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[<div style={{display: "flex"}} key='button'>
                        <Button
                            key="sunlimb"
                            style={{width: 100}}
                            type="primary"
                            loading={loading}
                            onClick={async () => {
                                await http.post("/course/del-course-class", {
                                    courseId: rows && rows.course_id,
                                    classId: row && row.class_id
                                }).then((response) => {
                                    if (response.error_info.errno === 1) {
                                        this.props.getCourseClass();
                                        message.success('删除成功');
                                    } else {
                                        message.error(response.error_info.error)
                                    }
                                })
                                this.setState({visible: false});
                            }}
                        >
                            确定
                        </Button>
                        <Button
                            key="back"
                            style={{width: 100}}
                            onClick={() => {
                                this.setState({
                                    loading: false,
                                    visible: false
                                });
                            }}
                        >
                            取消
                        </Button>
                    </div>
                        ,]}
                >
                    <h3 style={{color: "#f00"}}>你确定要删除该课节吗？</h3>
                </Modal>
            </div>
        );
    }
}