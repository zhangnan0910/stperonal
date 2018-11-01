import React, { Component } from 'react'
import { Form, Input, Radio, Button } from 'antd';
import './NewFroms.less'
import Http from '@/utils/http'
const FormItem = Form.Item;
const { TextArea } = Input
class Froms extends Component {
    constructor(){
        super()
        this.state = {
            formData:{
                name:'',
                tel:'',
                pwd:'',
                email:'',
                city:''
            }
        }
    }
    componentDidMount() {
       
    }
    render() {
        let {formData} = this.state
        return (
            // /^1(3|4|5|7|8)\d{9}$/
            <Form layout="horizontal">
                <FormItem 
                    label="账号" 
                    style={{display:"flex"}}
                    required>
                    <input className="ant-input" value={formData.name} />
                </FormItem>
                <FormItem 
                    label="手机号" 
                    style={{display:"flex"}}
                    required
                    >
                    <input className="ant-input" value={formData.tel} />
                </FormItem>
                <FormItem 
                    label="密码" 
                    style={{display:"flex"}}
                    >
                    <input className="ant-input" value={formData.pwd} />
                </FormItem>
                <FormItem label="性别" style={{display:"flex"}}>
                    <Radio.Group>
                        <Radio value='男'>男</Radio>
                        <Radio value='女'>女</Radio>
                    </Radio.Group>
                </FormItem>
                <FormItem 
                    label="邮箱" 
                    style={{display:"flex"}}
                    >
                    <input className="ant-input"  value={formData.email} />
                </FormItem>

                <FormItem label="简介" style={{display:"flex"}}>
                    <TextArea />
                </FormItem>
                <FormItem 
                    label="所在地区" 
                    style={{display:"flex"}}>
                    <input className="ant-input" value = {formData.city} />
                </FormItem>
                
                <FormItem style={{marginLeft:30,width:250}}>
                    <Button type="primary" onClick={this.check}>
                        添加
                    </Button>
                </FormItem>
            </Form>
        )
    }
}
export default Form.create()(Froms)
