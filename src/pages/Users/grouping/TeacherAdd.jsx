import React, {Fragment} from "react";
import {
    Input,
    Modal,
    Tabs,
    Table,
    Pagination,
    message
} from 'antd';
import {
    fetctTeacherList,
    searchMolileUser,
    fetchSIDGroup,
    fetchUserGroup
} from "@/api/course/courseAPI";
import Http from "@/utils/http"
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
            pageFlag:true,
            scrollFlag:false,
            selectedRowKeys:[],
        }
        this.teachersCache = [];
    }
    render() {
        const {visible, loading, data,selectedRowKeys} = this.state;
        // 分组check 表格
    const
    rowSelection = {
        selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({
                selectedRowKeys
            })
        }
    }
        const columns = [{
            title: '手机号',
            dataIndex: 'teacherAccount',
            key: 'teacherAccount'
        }, {
            title: '姓名',
            dataIndex: 'teacherName',
            key: 'teacherName',
        }, {
            title: '地区',
            dataIndex: 'city',
            key: 'city'
        }]
        return (
            <Fragment>
                <li className="add" onClick={this.showModal} style={{textAlign: 'center'}}>
                    <img style={{ width: 20, height: 20 }} src={require("../../../assets/imgs/icons/ic_add_circle_normal.png")}/>
                    {/* <span><b>{}</b>/<b>{}</b></span> */}
                </li>
                <Modal
                    visible={visible}
                    title="添加教师"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    okText="确定"
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
                    {data[0]?<Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        rowSelection={rowSelection}
                        locale = {
                            {emptyText:'暂无数据'}
                          }
                        rowKey={record => record.teacherId}
                    />:<Table
                        columns={columns}
                        dataSource={data}
                        pagination={false}
                        rowSelection={rowSelection}
                        locale = {
                            {emptyText:'暂无数据'}
                          }
                        rowKey={record => record.teacherId}
                    />}
                    {
                        this.state. pageFlag?<Pagination
                        style={{textAlign: "  center", paddingTop: 10}}
                        total={+this.state.total}
                        pageSize={this.state.perpage}
                        defaultCurrent={1}
                        onChange={this.handleTableChange}/>:null
                    }
                </Modal>
            </Fragment>
        );
    }
    CacheList = (data) => {
        data.forEach(student => {
            const index = this.teachersCache.findIndex(item => {
                if (item.teacherId === student.teacherId) {
                    return true
                }
                return false
            })
            if (index === -1) {
                this.teachersCache.push(student)
            }
        })
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
        this.getTeacher()
    }

    handleOk = () => {
        let selectedRowKeys;
        if(this.state.selectedRowKeys.length>=1){
            selectedRowKeys = this.state.selectedRowKeys.map((userId) => {
                return this.teachersCache.find(item => {
                    if (item.teacherId === userId) {
                        return true;
                    }
                })
            })
            this.props.teacherChild(selectedRowKeys)
            setTimeout(() => {
                this.setState({
                    loading: false,
                    visible: false,
                    selectedRowKeys: [],
                    searchVal:'',
                });
            }, 1000);
        }else{
            message.destroy();
            message.error("教师不能为空")
            this.setState({
                visible: true,
            });
        }
        this.setState({loading: true});
    }
    handleCancel = () => {
        this.setState({visible: false,pageFlag:true,searchVal:'',selectedRowKeys:[]});
    }

    // 获取老师列表
    getTeacher(pages, perpages) {
        let page = pages ? pages : this.state.page
        let perpage = perpages ? perpages : this.state.perpage
        Http.post('/school/get-teacher-list',{
                page,
                perpage,
            }).then(data => {
            if (data.error_info.errno == 1) {
                this.CacheList(data.data.teacherList)
                this.setState({
                    data: data.data.teacherList,
                    page,
                    perpage,
                    total: +data.data.teacherNum
                })
            }
        })
    }

    // 搜索
    searchs(e) {
        let {data} = this.state
        if(e!==''){
            Http.post("/school/get-teacher-list",{
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
        }else{
            this.getTeacher() 
            this.setState({
                pageFlag:true,
            })
        }
        
    }

    // 分页器切换
    handleTableChange = (cur, pageSize) => {
        if(!this.state.searchFlag){
            this.getTeacher(cur, pageSize)
        }else{
            Http.post("/school/get-teacher-list",{
                    keyword: this.state.searchVal,
                    page:cur,
                    perpage:pageSize
                }).then(data => {
                if (data.error_info.errno == 1) {
                    this.setState({
                        data: data.data.teacherList,
                        total:data.data.teacherNum,
                        searchFlag:true,
                    })
                }
            })
        }
        
    }
    
}
