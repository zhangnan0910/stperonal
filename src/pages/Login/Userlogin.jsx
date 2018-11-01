import React, { Component } from 'react'
import {
    Form,
    Checkbox,
    message
  } from 'antd';
const FormItem = Form.Item;
class Userlogin extends Component {
    constructor(){
        super()
        this.state = {
          username: "",
          pwd: "",
          msg: "",
          tip: "",
          type: 2,
          errorText: "请输入正确的账号和密码",
        }
      }
    // 实现
  handleChange(e) {
    let { username } = this.state
    let name = e.target.name
    this.setState({
      [name]: e.target.value
    })
    // let tel = /^[1][3,4,5,7,8]\d{9}$/;
    let tel = /^\d{11}$/;
    if (e.target.type == 'text') {
      if (tel.test(e.target.value)) {
        this.setState({
          tip: ""
        })
      } else {
        this.setState({
          tip: "请输入正确的账号"
        })
      }
    }
  }
  render() {
    let {username,pwd} = this.state
    const { getFieldDecorator } = this.props.form;
    return (
        <Form className="login-form">
            <FormItem label="手机号">
            <input
                type="text"
                name='username'
                value={username}
                style={{ height: 38 }}
                placeholder="请输入账号"
                className="ant-input"
                onChange={this.handleChange.bind(this)} />
            </FormItem>
            <FormItem label="密码">
            <input
                type="password"
                name='pwd'
                value={pwd}
                style={{ height: 38 }}
                placeholder="请输入密码"
                className="ant-input"
                onChange={this.handleChange.bind(this)} />
            </FormItem>
            <FormItem>
            {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
                {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: false,
                })(
                <Checkbox>七天免登陆</Checkbox>
                )}
                <a className="login-form-forgot" href="" style={{ color: "#0091F0" }}>忘记密码</a>
            </div> */}
            <button
                style={{ marginTop: 15 }}
                className="ant-btn login-form-button ant-btn-primary"
            >登录</button>
            {/* <div style={{ textAlign: "center" }}>
                没有机构账号,<a href="" style={{ color: "#0091F0" }}>请注册</a>
            </div> */}
            </FormItem>
        </Form>
    )
  }
}
export default Form.create()(Userlogin)