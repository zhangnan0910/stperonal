import React, { Component } from 'react'
import {
  Modal,
  Icon,
  message
} from 'antd'
import Http from "@/utils/http"
import { getCookie } from '@/utils/cookies'
export default class groupingLeftshow extends Component {
  constructor() {
    super()
    this.state = {
      isiconShow: false,
      visible: false,
      title: null,
      datavalue: {},
      flag: false,
      off: false,
      values: '',
      val: '',
      getcookies: JSON.parse(unescape(unescape(getCookie("login-token"))))
    }
  }
  handleMouseEnter() {
    this.setState({
      isiconShow: true
    })
  }
  handleMouseLeave() {
    this.setState({
      isiconShow: false
    })
  }
  edit(e, val) {
    e.stopPropagation()
    if ((e.target.className.indexOf("edit") != -1)) {
      this.setState({
        title: "编辑分组",
        flag: true,
        values: val.groupName
      })
    } else {
      this.setState({
        title: "提示",
        flag: false,
        off: true
      })
    }
    this.setState({
      visible: true,
      datavalue: val,
    })
  }
  // 改变文件夹名字
  handelChange = (e) => {
    let { datavalue } = this.state
    this.setState({
      values: e.target.value,
      datavalue: {
        groupId: datavalue.groupId,
        groupName: e.target.value,
        num: datavalue.num
      }
    })
  }
  //  确定按钮
  handleOk = (e) => {
    let { datavalue, flag } = this.state
    if(this.state.title==='提示'){
      Http.post("/school/delete-group",{
          groupId: datavalue.groupId,
          groupName: datavalue.groupName,
      }).then(data => {
        if (data.error_info.errno == 1) {
          this.props.propChild({
            val: datavalue,
            off: this.state.off
          })
          message.destroy()
          message.success( "删除成功");
        }
      }).catch(() => { })
    }else{
      if(this.state.values.length<=30&&this.state.values.length>0){
        Http.post("/school/update-group",{
            groupId: datavalue.groupId,
            groupName: datavalue.groupName,
        }
        ).then(data => {
          if (data.error_info.errno == 1) {
            this.props.propChild({
              val: datavalue,
              off: this.state.off
            })
            this.setState({
              visible: false
            });
            message.destroy()
            message.success("修改成功");
          }
        }).catch(() => { })
      }else if(this.state.values.length<1){
        this.setState({
          visible: true
        });
        message.destroy()
        message.error('分组名称不能为空')
      }else{
        this.setState({
          visible: true
        });
        message.destroy()
        message.error('分组名称最大长度为30个字符')
      }
    }
    
    setTimeout(() => {
      
    }, 2000);
  }
  // 取消按钮
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  render() {
    let { res, groupId } = this.props
    return (
      <li ref='li'
        onMouseEnter={this.handleMouseEnter.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
        onClick={() => { this.props.handleChild(res, this.state.off) }}
        style={{ paddingLeft: 30, position: "relative",paddingRight:50,cursor:'pointer' }}
        className={'dhEllipsis'+' '+(groupId == res.groupId ? 'clicks' : '')}
      >
        {res.groupName} ( <b style={{ color: "#1093ED" }}>{res.num}</b>  )
          <span className="edit">
          {
            this.state.isiconShow ?
              <span>
                <Icon type="edit" onClick={(e) => this.edit(e, res)} style={{ padding: 10, fontSize: 20, color: "#1093ED" }} />
                <Icon type="delete" onClick={(e) => this.edit(e, res)} style={{ padding: 10, fontSize: 20, color: "#1093ED" }} />
              </span>
              : null
          }
        </span>
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          title={this.state.title}
          cancelText="取消"
          okText="确定"
        >
          {
            this.state.title == '编辑分组' ? <div
              style={{ display: "flex", alignItems: "center" }}>
              <span style={{ width: 100 }}>分组名称 :</span>
              <input type="text"
                className="ant-input"
                onBlur = {(e)=>{
                  message.destroy()
                  e.target.value.length>30?message.error('分组名称最大长度为30个字符'):null
                }}
                value={this.state.values}
                onChange={this.handelChange}
              />
            </div> : <h1 style={{ fontSize: 18, color: "#FF3B30", textAlign: "center" }}>你确定要删除此分组吗？</h1>
          }
        </Modal>
      </li>
    )
  }

}
