import React, { Component, Fragment } from 'react'
import {
    Tabs,
    Breadcrumb,
    Layout,
    Form,
    Button,
    message,
    InputNumber
} from 'antd';
const TabPane = Tabs.TabPane;
const { Content } = Layout
const FormItem = Form.Item
import Http from "@/utils/http"
import { connect } from "react-redux"
import {getcookie} from '@/common/js/index'

import { GET_DATA_START, GET_DATA_SUCCESS } from '@/stores/reducer/variable'
class addteacher extends Component {
    constructor() {
        super()
        this.state = {
            flagActive: 0,
            msg: '',
            value: '',
            flag: false,
            tip: '使用于3T Class平台已注册的用户',
            count: 0,
            url: ''
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
    changeval(e) {

        this.setState({
            count: e.target.value
        })
    }
    dowload() {
        let {  count } = this.state
        if(count>0&& count<=500){
            Http.post("/school/create-system-user",{
                count
            }).then(data => {
                if (data.error_info.errno == 1) {
                    message.success('下载成功')
                    window.location.href = data.data.downloadUrl
                } else {
                    message.destroy();
                    message.error(data.error_info.error)
                }
            })
        }else{
            message.destroy();
            message.error('请输入1-500之间的数字')
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
                        this.props.history.push('/teacher')
                        }}>教师管理</Breadcrumb.Item>
                    <Breadcrumb.Item>添加教师</Breadcrumb.Item>
                </Breadcrumb>
                <Content className="user-content">
                    <div>
                        <span>添加教师</span>
                    </div>
                    <div style={{ width: 400 }} className="user-content-bottom">
                        <div className="user-tab education-login-tab">
                            <span
                                onClick={(e) => { this.changeTab(0) }}
                                className={flagActive == 0 ? 'active' : '1'
                                }>手机号添加</span>
                            <span
                                onClick={(e) => { this.changeTab(1) }}
                                className={flagActive == 1 ? 'active' : '2'
                                }>系统生成账号</span>
                        </div>
                        <div className="user-tab-content">
                            {
                                flagActive == 0 ? <Fragment>
                                    <div className="user-tip">请输入您要添加的教师手机号</div>
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
                                </Fragment>
                                    :
                                <Fragment>
                                    <div className="user-tip">系统生成账号，请尽快通知教师修改密码</div>
                                    <div className="account-tab">
                                        <span>账号数量</span>
                                        <input type="text" 
                                            value={this.state.count}
                                            onChange={(e) => {
                                                this.setState({
                                                    count:e.target.value
                                                })
                                             }}
                                             onBlur = {()=>{
                                                 let count = +this.state.count 
                                                 message.destroy()
                                                count<=500&&count>0?null:message.error('请输入1-500之间的数字')
                                             
                                            }}/>
                                        <span>最多一次可以生成500个账号</span>
                                    </div>
                                    <Button
                                        style={{ width: 185, marginLeft: 100, marginTop: 100, background: '#1093ED' }}
                                        type="primary"
                                        onClick={() => { this.dowload() }}
                                    >生成并下载</Button>
                                </Fragment>
                            }
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
            Http.post("/school/create-teacher",{
                teacherAccount: val
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
