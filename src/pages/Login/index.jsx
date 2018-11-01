import React, { Component } from 'react'
import Http from "@/utils/http"
import { setCookie } from "@/utils/cookies"
import "./index.less"
import {
  Form,
  Checkbox,
  message
} from 'antd';
const FormItem = Form.Item;
export default class index extends Component {
  constructor(){
    super()
    this.state = {
      username: "",
      pwd: "",
      msg: "",
      tip: "",
      type: 2,
      errorText: "请输入正确的账号和密码",
      pwdtips:''
    }
  }
  render() {
    let { username ,pwd} = this.state
    return (
      <div className='login-box'>
        <div className='login-content'>
          <h3>3T CLASS 机构管理后台</h3>
          <Form className="login-form-box">
            <FormItem 
              label="手机号"
              help={this.state.tip}
            >
            <input
                type="text"
                name='username'
                ref = 'username'
                value={username}
                style={{ height: 38 }}
                placeholder="请输入账号"
                autoComplete="off"
                className="login-input"
                onChange={this.handleChange.bind(this)} 
                />
            </FormItem>
            <FormItem 
              label="密码"
              help = {this.state.pwdtips}
            >
            <input
                type="password"
                name='pwd'
                ref='pwd'
                value={pwd}
                style={{ height: 38 }}
                placeholder="请输入密码"
                className="login-input"
                autoComplete="off"
                onChange={this.handleChange.bind(this)} 
                />
            </FormItem>
            <FormItem>
            <button
                style={{ marginTop: 15 }}
                className="login-button"
                onClick = {this.submits}
                disabled = {this.state.disableFlag}
                style = {{cursor:'pointer'}}
            >登录</button>
            </FormItem>
        </Form>
        </div>
        <div className="education-copyright">Copyright © 2018 北京三体云联科技有限公司 版权所有</div>
      </div>
    )
  }
  handleChange(e) {
    let name = e.target.name
    this.setState({
      [name]: e.target.value
    })
    let tel = /^\d{11}$/;
    // 验证账号
    if (name == 'username') {
      if (tel.test(e.target.value)) {
        this.setState({
          tip: ""
        })
      } else {
        this.setState({
          tip: "请输入正确的账号"
        })
      }
    }else if(name == 'pwd'){ // 验证密码
        if(e.target.value.length<=0){
          this.setState({
            pwdtips:'密码不能为空'
          })
        }else if(e.target.value.length<6||e.target.value.length>20){
          this.setState({
            pwdtips:'请输入6-20个字符'
          })
        }else{
          this.setState({
            pwdtips:''
          })
        }
      }
    
  }
  // 提交验证账号正确时跳转首页
  submits = ()=> {
    let { username, pwd ,type} = this.state
    let tel = /^\d{11}$/;
    if (!tel.test(username)) {
      this.setState({
        msg: "请输入正确的手机号和密码"
      })
      message.destroy();
      message.error("请输入正确的手机号")
      return false
    }else if(pwd.length<6||pwd.length>20){
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
      }).catch(()=>{this.setState({disableFlag:false})})
    }

  }
}

