import React, { Fragment } from "react";
import {
    Input,
    Button,
    Modal,
    Tabs,
    Table,
    Pagination,
    message
} from 'antd';
import Http from "@/utils/http"
const TabPane = Tabs.TabPane;
const Search = Input.Search;
export default class AddStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            visible: false,
            data: [],
            page: 1,
            perpage: 6,
            val: [],
            arr: [],
            pageFlag: true,
            searchVal:'',
            searchFlag:false,
            selectedRowKeys: [],
            scrollFlag: false,
        }
        this.studentsCache = [];
    }
    // 缓存
    CacheList = (data) => {
        data.forEach(student => {
            const index = this.studentsCache.findIndex(item => {
                if (item.studentId === student.studentId) {
                    return true
                }
                return false
            })
            if (index === -1) {
                this.studentsCache.push(student)
            }
        })
    }
    // 获取老师列表
    getStudent = (pages, perpages) => {
        let page = pages ? pages : this.state.page
        let perpage = perpages ? perpages : this.state.perpage
        Http.post('/school/get-student-list',{
                page,
                perpage,
            }).then(data => {
            this.CacheList(data.data.studentList)
            if (data.error_info.errno == 1) {
                this.setState({
                    data: data.data.studentList,
                    page,
                    perpage,
                    total: +data.data.studentNum
                })
            }
        })
    }
    // 搜索
    searchs(e) {
        if (e !== '') {
            Http.post('/school/get-student-list',{
                    keyword: e,
                    page:this.state.page,
                    perpage:this.state.perpage,
                    
                }).then(data => {
                    if (data.error_info.errno == 1) {
                        this.CacheList(data.data.studentList)
                        this.setState({
                            data: data.data.studentList,
                            searchVal:e,
                            searchFlag:true,
                            total:data.data.studentNum,
                        })
                    }
                })
        }else{
            this.getStudent()
            this.setState({
                pageFlag:true,
            })
        }
    }

    // 分页器切换
    handleTableChange = (cur, pageSize) => {
        if(!this.state.searchFlag){
            this.getStudent(cur, pageSize)
        }else{
            Http.post("/school/get-student-list",{
                    keyword: this.state.searchVal,
                    page:cur,
                    perpage:pageSize, 
                }).then(data => {
                    if (data.error_info.errno == 1) {
                        this.CacheList(data.data.studentList)
                        this.setState({
                            data: data.data.studentList,
                            searchFlag:true,
                            total:data.data.studentNum,
                            // pageFlag: false,
                            // scrollFlag: data.data.studentList.length > 6 ? true : false
                        })
                    }
                })
        }
        
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
        this.getStudent()
    }

    handleOk = () => {
        let selectedRowKeys;
        if(this.state.selectedRowKeys.length>=1){
            selectedRowKeys = this.state.selectedRowKeys.map((userId) => {
                return this.studentsCache.find(item => {
                    if (item.studentId === userId) {
                        return true;
                    }
                })
            })
            setTimeout(() => {
                this.setState({
                    loading: false,
                    visible: false,
                    selectedRowKeys: [],
                    searchVal:''
                });
            }, 1000);
        }else{
            selectedRowKeys=[]
            message.destroy();
            message.error("学生不能为空")
            this.setState({
                visible: true,
            });
            
        
        }
        this.props.studentChild(selectedRowKeys)
        
    }

    handleCancel = () => {
        this.setState({ visible: false,searchVal:'' });
    }

    render() {
        const { visible, loading, data, selectedRowKeys } = this.state;
        // 分组check 表格
        const
            rowSelection = {
                selectedRowKeys,
                onChange: (selectedRowKeys, selectedRows) => {
     
                    this.setState({
                        selectedRowKeys
                    })
                },
                // getCheckboxProps: record => (
                //     {
                //         disabled: record.studentAccount === sessionStorage.getItem('teacherAccount'), // Column configuration not to be checked
                //     }),

            }

        const columns = [{
            title: '手机号',
            dataIndex: 'studentAccount',
        }, {
            title: '姓名',
            dataIndex: 'studentName',
            render: text => <a href="javascript:;">{text}</a>,
        }, {
            title: '地区',
            dataIndex: 'city',
        }];
        return (
            <Fragment>
                <li className="add" onClick={this.showModal} style={{ textAlign: 'center' }}>
                    <img style={{ width: 20, height: 20 }} src={require("../../../assets/imgs/icons/ic_add_circle_normal.png")} />
                    {/* <span>（1/6）</span> */}
                </li>
                <Modal
                    visible={visible}
                    title="添加学生"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    okText="确定"
                >
                    <div>
                        <Search
                            style={{ margin: "10px auto" }}
                            placeholder="请输入手机号或姓名"
                            enterButton="搜索"
                            size="large"
                            value={this.state.searchVal}
                            onChange = {(v)=>{
                                this.setState({
                                    searchVal:v.target.value
                                })
                            }}
                            onSearch={(val) => this.searchs(val)}
                        />
                        {data[0] ? <Table
                            columns={columns}
                            dataSource={data}
                            pagination={false}
                            rowSelection={rowSelection}
                            locale = {
                                {emptyText:'暂无数据'}
                              }
                            rowKey={record => record.teacherId ? record.teacherId : record.studentId}
                         
                        /> : <Table
                                columns={columns}
                                dataSource={data}
                                pagination={false}
                                rowSelection={rowSelection}
                                locale = {
                                    {emptyText:'暂无数据'}
                                  }
                                rowKey={record => record.teacherId ? record.teacherId : record.studentId}
                            />}
                        {
                            this.state.pageFlag ? <Pagination
                                style={{ textAlign: "  center", paddingTop: 10 }}
                                total={+this.state.total}
                                pageSize={this.state.perpage}
                                defaultCurrent={this.page}
                                onChange={this.handleTableChange} /> : null
                        }

                    </div>
                </Modal>
            </Fragment>
        );
    }
}