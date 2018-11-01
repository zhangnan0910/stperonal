import React, { Component, Fragment } from 'react'
import {
    Tabs,
    Breadcrumb,
    Layout,
    Form,
    Button,
    message
} from 'antd';
const TabPane = Tabs.TabPane;
const { Content } = Layout
const FormItem = Form.Item
import Http from "@/utils/http"
import { connect } from "react-redux"
import { GET_DATA_START } from '@/stores/reducer/variable'
class addteacher extends Component {
    constructor() {
        super()
        this.state = {
            flagActive: 0,
            msg: '',
            value: '',
            flag: false,
        }
    }
    changeTab(val) {
        this.setState({
            flagActive: val
        })
    }
    valchange(e) {
        let tel = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!tel.test(e.target.value)) {
            this.setState({
                msg: '请输入正确的手机格式',
                value: e.target.value,
            })
        } else {
            this.setState({
                msg: '',
                value: e.target.value,
                flag: true
            })
        }
    }
    render() {
        let { flagActive } = this.state
        let off = false
        return (
            <Layout className="commons">
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>
                        用户管理
                    </Breadcrumb.Item>
                    <Breadcrumb.Item style={{cursor: 'pointer'}}
                        onClick={()=>{
                        this.props.history.push('/student')
                        }}>学生管理</Breadcrumb.Item>
                    <Breadcrumb.Item>添加学生</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="user-content">
                    <div>
                        <span>添加学生</span>
                    </div>
                    <div style={{ width: 400 }} className="user-content-bottom">
                        {/* <div className="user-tab education-login-tab">
                            <span style={{ borderRadius: 10 }} className='active'>手机号添加</span>
                        </div> */}
                        <div className="user-tab-content" style={{ position: 'relative' }}>
                            <div className="user-tip">请输入您要添加的学生手机号</div>
                            <FormItem
                                label="手机号"
                                required
                                help={this.state.msg}
                                style={{ display: 'flex' }}>
                                <input
                                    type="text"
                                    placeholder="请输入手机号"
                                    className="ant-input"
                                    onInput={(e) => {
                                        this.valchange(e)
                                    }} />
                            </FormItem>
                            <Button
                                style={{ width: 185, marginLeft: 100, marginTop: 100 }}
                                type="primary"
                                onClick={() => { 
                                    let tel = /^[1][3,4,5,7,8][0-9]{9}$/
                                    tel.test(this.state.value)?this.props.getData(this.state.value):null
                                }}
                            >添加</Button>


                        </div>
                    </div>
                </Content>
            </Layout>
        )
    }
}
function mapDispatchToProps(dispatch) {
    return {
        getData(val) {
            dispatch({
                type: GET_DATA_START
            })
            Http.post("/school/create-student",{
                    SID: this.getcookies.SID,
                    safeKey: this.getcookies.safeKey,
                    timeStamp: this.getcookies.timeStamp,
                    studentAccount: val
                }).then(data => {
                if (data.error_info.errno == 1) {
                    message.success('添加成功')
                } else {
                    message.destroy();
                    message.error(data.error_info.error)
                }

            })
        }
    }
}
function mapStateToprops(state) {
    return {
        adduserteacher: state.addteacher,
        getcookies: state.getcookie
    }
}
export default connect(mapStateToprops, mapDispatchToProps)(addteacher)