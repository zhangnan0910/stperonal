import React, {Fragment} from "react";
import {
    Input,
    Button,
    Icon,
    Modal,
    Tabs,
    Table,
    Pagination,
    message,
   Tooltip
} from 'antd';

import {
    fetctTeacherList,
    searchMolileUser,
    fetchSIDGroup,
    fetchUserGroup
} from "@/api/course/courseAPI";
import Http from "@/utils/http"
// import AddData from '@/components/AddData'
const TabPane = Tabs.TabPane;
const Search = Input.Search;

export default class AddTeacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            items: [],
            group: [],
            perpage: 6,
            page: 1,
            total: 6,
            data: [],
            val: [],
            searchFlag:false,
            searchVal:"",
            selectedRowKeys:[]
        }
    }
    render() {
        const {visible, loading, data,selectedRowKeys} = this.state;
        // 分组check 表格
    const
    rowSelection = {
        type: 'radio',
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
                selectedRowKeys
            })
        }
    }
        return (
            <Fragment>
                <li className="add" onClick={this.showModal} style={{textAlign: 'center'}}>
                    <img src={require("../../../assets/imgs/icons/ic_add_circle_normal.png")}/>
                    {/* <span><b>{}</b>/<b>{}</b></span> */}
                </li>
                <Modal
                    visible={visible}
                    title="添加教师"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[<Button key="submit"
                                     type="primary"
                                     loading={loading}
                                     onClick={this.handleOk}
                    >确认</Button>]}
                >
                    <Search
                        style={{margin: "10px auto"}}
                        placeholder="请输入手机号或姓名"
                        enterButton="搜索"
                        size="large"
                        value = {this.state.searchVal}
                        onChange = {(v)=>{
                            this.setState({
                                searchVal:v.target.value
                            })
                        }}
                        onSearch={(val) => this.searchs(val)}
                    />
                    <Table
                        columns={this.columns()}
                        dataSource={data}
                        rowSelection={rowSelection}
                        rowKey={record => record.teacherId}
                        className = 'model-box'
                        locale = {
                            {emptyText:'暂无数据'}
                          }
                          pagination ={{
                            total:+this.state.total,
                            pageSize:this.state.perpage,
                            defaultCurrent:1,
                            onChange:this.handleTableChange,
                            current:this.state.page
                          }}
                    />
                </Modal>
            </Fragment>
        );
    }
    showModal = () => {
        this.setState({
            visible: true,
            page:1
        });
        this.getTeacher(1)
    }
    handleOk = () => {
        let data = []
        this.state.data.map(res=>{
            if(res.teacherId === this.state.selectedRowKeys[0]){
                data.push(res)
            }
        })
        if(data.length<1){
            message.destroy();
            message.error("教师不能为空")
            this.setState({
                visible: true,
            });
        }else{
            this.setState({
                visible: false,
            });
        }
        // sessionStorage.setItem('teacherAccount',data[0].teacherAccount)
        this.props.teacherChild(data)
        setTimeout(() => {
            this.setState({loading: false,selectedRowKeys:[],searchVal:'',page:1});
        }, 1000);
    }
    handleCancel = () => {
        this.setState({visible: false,searchVal:'', page:1});
    }

    // 获取老师列表
    getTeacher(pages) {
        let page = pages ? pages : this.state.page
        let {perpage} = this.state
        Http.post('/school/get-teacher-list',{
                page,
                perpage,
            }
        ).then(data => {
            if (data.error_info.errno == 1) {
                this.setState({
                    data: data.data.teacherList,
                    page,
                    searchFlag:false,
                    total: +data.data.teacherNum
                })
            }
        })
    }

    // 搜索
    searchs(e) {
        let {data} = this.state
        if(e!==''){
            this.setState({
                page:1
            },()=>{
                Http.post('/school/get-teacher-list',{
                    keyword: e,
                    page:this.state.page,
                    perpage:this.state.perpage
                }).then(data => {
                if (data.error_info.errno == 1) {
                    this.setState({
                        data: data.data.teacherList,
                        total:data.data.teacherNum,
                        searchFlag:true,
                        searchVal:e
                    })
                    }
                })
            })
        }else{
            this.getTeacher() 
            this.setState({
                pageFlag:true,
            })
        }
        
    }

    // 分页器切换
    handleTableChange = (cur) => {
        if(!this.state.searchFlag){
            this.getTeacher(cur)
        }else{
            Http.post('/school/get-teacher-list',{
                    keyword: this.state.searchVal,
                    page:cur,
                    perpage:this.state.perpage
                }).then(data => {
                if (data.error_info.errno == 1) {
                    this.setState({
                        data: data.data.teacherList,
                        total:data.data.teacherNum,
                        searchFlag:true,
                        page:cur
                    })
                }
            })
        }
        
    }
    columns = () =>{
        return [{
            title: '手机号',
            dataIndex: 'teacherAccount',
            key: 'teacherAccount'
        }, {
            title: '姓名',
            dataIndex: 'teacherName',
            key: 'teacherName',
            render:(value)=>{
                return <Tooltip placement="topLeft" title={value}>{value}</Tooltip>
            }
        }, {
            title: '地区',
            dataIndex: 'city',
            key: 'city',
            render:(value)=>{
                return <Tooltip placement="topLeft" title={value}>{value}</Tooltip>
            }
        }]
    }
}
{/* <TabPane tab="整组添加" key="1">
                            <div style={{display: "flex"}}>
                                <div style={{width: 100}}>所有分组：</div>
                                <Select defaultValue={"请选择分组"}>
                                    {group.map((item, index) => {
                                        return (
                                            <Option style={{width: 130}} key={index}
                                                    value={item.groupName}>{item.groupName}</Option>
                                        )
                                    })}
                                </Select>
                            </div>
                            <div style={{display: "flex"}}>
                                <div style={{width: 150}}>人员列表：</div>
                                <div style={{display: "flex", flexWrap: "wrap"}}>

                                </div>
                            </div>
                        </TabPane> */
}
