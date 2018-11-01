import React, { Component } from 'react'
import { Form, Input, Radio, Button } from 'antd';
import './style.less'
import Http from '@/utils/http'
const FormItem = Form.Item;
const { TextArea } = Input
class Froms extends Component {
    componentDidMount() {
       
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const FormItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 5 },
        };
        const FormItemLayout1 = {
            wrapperCol: { span: 7 },
        };
        return (

            <Form layout="horizontal">
                <FormItem label="账号" {...FormItemLayout}>
                    {getFieldDecorator('Account', {
                        rules: [{ required: true, message: '请输入姓名！' }],
                    })(
                        <Input placeholder="请输入账号不可与手机相同" />
                    )}
                </FormItem>
                <FormItem label="手机号" {...FormItemLayout}>
                    {getFieldDecorator('phone', {
                        rules: [{
                            pattern: /^1(3|4|5|7|8)\d{9}$/, message: "手机号码格式不正确！"
                        }, {
                            required: false, message: '请输入手机号！'
                        }],
                    })(
                        <Input placeholder="请输入手机号" />
                    )}
                </FormItem>
                <FormItem label="名称" {...FormItemLayout}>
                    {getFieldDecorator('name', {
                        rules: [{ required: false, message: '请输入姓名！' }],
                    })(
                        <Input placeholder="请输入人员名称" />
                    )}
                </FormItem>
                <FormItem label="密码" {...FormItemLayout}>
                    {getFieldDecorator('password', {
                        rules: [{
                            required: false, message: '请输入手机号！'
                        }],
                    })(
                        <Input placeholder="默认密码123456" type="password" />
                    )}
                </FormItem>
                <FormItem label="性别" {...FormItemLayout}>
                    {getFieldDecorator('sex', {
                        rules: [{ required: false, message: '请选择性别！' }],
                    })(
                        <Radio.Group>
                            <Radio value='男'>男</Radio>
                            <Radio value='女'>女</Radio>
                        </Radio.Group>
                    )}
                </FormItem>
                <FormItem label="邮箱" {...FormItemLayout}>
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: '邮箱格式不正确！',
                        }, {
                            required: false, message: '请输入邮箱！',
                        }],
                    })(
                        <Input />
                    )}
                </FormItem>

                <FormItem label="简介" {...FormItemLayout}>
                    <TextArea />
                </FormItem>
                <FormItem label="所在地区" {...FormItemLayout}>
                    {getFieldDecorator('region', {
                        rules: [{ required: false, message: '请输入年龄！' }],
                    })(
                        <Input placeholder="请输入地区" />
                    )}
                </FormItem>
                <FormItem label="所在分组" {...FormItemLayout}>
                    {getFieldDecorator('Grouping', {
                        rules: [{ required: false, message: '请输入年龄！' }],
                    })(
                        <Input placeholder="请选择要分配到的分组" />
                    )}
                </FormItem>
                <FormItem {...FormItemLayout1}>
                    <Button type="primary" onClick={this.check}>
                        添加
                        </Button>
                </FormItem>
            </Form>
        )
    }
}
export default Form.create()(Froms)
