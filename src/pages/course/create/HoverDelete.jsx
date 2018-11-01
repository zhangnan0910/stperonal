import React, { Component } from 'react'
import Random from "@/utils/random"
import {Icon} from 'antd'
export default class HoverDelete extends Component {
    constructor(){
        super()
        this.state = {
            isiconShow:false
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
    edit(e, res){
        if(res.teacherAccount){
            this.props.teacherChildList(res.teacherAccount)
        }else{
            this.props.studentChildList(res.studentAccount)
        }
        
    }
    render() {
        let res = this.props
        let a = Random(res.res.teacherAccount?res.res.teacherAccount:res.res.studentAccount)
        let Names = res.res.teacherName?(res.res.teacherName?res.res.teacherName:'未设置昵称'):(res.res.studentName?res.res.studentName:'未设置昵称')
        return (
            <li
                onMouseEnter={this.handleMouseEnter.bind(this)}
                onMouseLeave={this.handleMouseLeave.bind(this)}>
                <dl style={{ marginBottom: 0 }}>
                    <dt><img src={res.res.teacherAvatar ? res.res.teacherAvatar : a} alt="" /></dt>
                    <dd style={{ paddingLeft: 10 }}>
                        {/* <h3 style={{ fontSize: 16, color: "#333" }}>{Names}</h3> */}
                        <h3 style={{ fontSize: 16, color: Names==='未设置昵称'?'red':"#333",fontFamily:'PingFangSC-Regular'}}>{Names}</h3>
                        <p style={{ fontSize: 12, color: "#999" }}>{res.res.teacherAccount?res.res.teacherAccount:res.res.studentAccount}</p>
                        {this.state.isiconShow?<Icon type="delete" onClick={(e) => this.edit(e, res.res)}  style={{ padding: 10, fontSize: 20, color: "#1093ED" }} />:null}
                    </dd>
                </dl>
            </li>
        )
    }
}
