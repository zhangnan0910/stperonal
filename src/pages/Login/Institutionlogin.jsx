import React, { Component } from 'react'
import {
  Form,
  Checkbox,
  message
} from 'antd';
import Http from "@/utils/http"
import { setCookie } from "@/utils/cookies"
const FormItem = Form.Item;
class Institutionlogin extends Component {
  constructor(){
    super()
    this.state = {
      username: "",
      pwd: "",
      msg: "",
      tip: "",
      type: 2,
      disableFlag:false,
      errorText: "请输入正确的账号和密码",
    }
  }
   
  // 实现提示信息
  handleChange(e) {
    let name = e.target.name
    this.setState({
      [name]: e.target.value
    })
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
  // 提交验证账号正确时跳转首页
  submits() {
    let { username, pwd ,type} = this.state
    let tel = /^\d{11}$/;
    if (!tel.test(username)) {
      this.setState({
        msg: "请输入正确的手机号和密码"
      })
      message.destroy();
      message.error("请输入正确的手机号")
      return false
    }else if(pwd.length<6){
      message.destroy();
      message.error("请输入正确的密码")
      return false
    } else {
      this.setState({disableFlag:true})
      Http.post('/user/login',{
          userName: username,
          password: pwd,
          rememberMe: 0,
          type
        }).then(data => {
        if (data.error_info.errno == "1") {
          message.destroy()
          message.success("登录成功")
          setCookie("login-token", JSON.stringify(data.data))
          setTimeout(() => {
            this.props.history.replace('/home')
          }, 2000)
        } else {
          this.setState({disableFlag:false})
          message.destroy();
          message.error(data.error_info.error)
        }
      }).catch()
    }

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    let { username, pwd, errorText } = this.state
    return (
      <Form onSubmit={this.handleSubmit} className="login-form">
        <FormItem
          label="机构账号"
          help={this.state.tip}
        >
          <input
            type="text"
            name='username'
            value={username}
            style={{ height: 38 }}
            placeholder="请输入账号"
            className="ant-input"
            onChange={this.handleChange.bind(this)} />
        </FormItem>
        <FormItem
          label="机构密码"
        >
          <input
            type="password"
            name='pwd'
            value={pwd}
            style={{ height: 38 }}
            placeholder="请输入密码"
            className="ant-input"
            onChange={()=>{}}
            onInput={this.handleChange.bind(this)} />
        </FormItem>
        <FormItem style={{ marginTop: 15 }} >
          {/* <div style={{ display: "flex", justifyContent: "space-between" }}>
            {getFieldDecorator('remember', {
              valuePropName: 'checked',
              initialValue: true,
            })(
              <Checkbox>记住密码</Checkbox>
            )}
            <a className="login-form-forgot" href="" style={{ color: "#0091F0" }}>忘记密码</a>
          </div> */}
          <button
            style={{ marginTop: 15 }}
            className="ant-btn login-form-button ant-btn-primary"
            onClick={this.submits.bind(this)}
            disabled={this.state.disableFlag}
          >登录</button>
          {/* <div style={{ textAlign: "center" }}>
            没有机构账号,<a href="" style={{ color: "#0091F0" }}>请注册</a>
          </div> */}
        </FormItem>
      </Form>
    )
  }
}

export default Form.create()(Institutionlogin)