
import React, { Fragment } from "react";
import {
    Input,
    Button,
    Modal,
    Tabs,
    Table,
    Pagination,
    message,
    Tooltip
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
            }
        ).then(data => {
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
                            page:this.state.page,
                            total:data.data.studentNum,
                            current:this.state.page
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
            Http.post('/school/get-student-list',{
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
                            page:cur
                        })
                    }
                })
        }
        
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
        this.getStudent(1)
    }

    handleOk = () => {
        let selectedRowKeys;
        if(this.state.selectedRowKeys.length<=6&&this.state.selectedRowKeys.length>=1){
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
            message.error("请输入1-6位学生")
            this.setState({
                visible: true,
            });
            
        
        }
        this.props.studentChild(selectedRowKeys)
        
    }

    handleCancel = () => {
        this.setState({ visible: false,searchVal:'',page:1,selectedRowKeys:[] });
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
    
            }

        return (
            <Fragment>
                <li className="add" onClick={this.showModal} style={{ textAlign: 'center' }}>
                    <img src={require("../../../assets/imgs/icons/ic_add_circle_normal.png")} />
                    {/* <span>（1/6）</span> */}
                </li>
                <Modal
                    visible={visible}
                    title="添加学生"
                    className ='model-box'
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[<Button key="submit"
                        type="primary"
                        loading={loading}
                        onClick={this.handleOk}
                    >确认</Button>]}
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
                            onSearch={(val) => this.setState({page:1},()=>{
                                this.searchs(val)
                            })}
                        />
                        <Table
                            columns={this.columns()}
                            dataSource={data}
                            pagination={{
                                style:{ textAlign: "  center", paddingTop: 10 },
                                total:+this.state.total,
                                pageSize:this.state.perpage,
                                defaultCurrent:1,
                                onChange:this.handleTableChange,
                                current:this.state.page
                            }}
                            rowSelection={rowSelection}
                            rowKey={record => record.teacherId ? record.teacherId : record.studentId}
                            locale = {
                                {emptyText:'暂无数据'}
                              }
                        />

                    </div>
                </Modal>
            </Fragment>
        );
    }
    columns = () =>{
        return [{
            title: '手机号',
            dataIndex: 'studentAccount',
        }, {
            title: '姓名',
            dataIndex: 'studentName',
            render:(value)=>{
                return <Tooltip placement="topLeft" title={value}>{value}</Tooltip>
            }
        }, {
            title: '地区',
            dataIndex: 'city',
            render:(value)=>{
                return <Tooltip placement="topLeft" title={value}>{value}</Tooltip>
            }
        }];
    }
}

// export default class AddStudent extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             loading: false,
//             visible: false,
//             data: [],
//             page: 1,
//             perpage: 6,
//             arrData: [],
//             pageFlag: true,
//             selectedRowKeys: [],
//             scrollFlag: false,
//         }
//         this.studentsCache = [];
//     }

//     // 获取老师列表
//     getStudent = (pages, perpages) => {
//         let page = pages ? pages : this.state.page
//         let perpage = perpages ? perpages : this.state.perpage
//         Http.post('/school/get-student-list',{
//                 page,
//                 perpage,
//             }
//         ).then(data => {
//             data.data.studentList.forEach(student => {
//                 const index = this.studentsCache.findIndex(item => {
//                     if (item.studentId === student.studentId) {
//                         return true
//                     }
//                     return false
//                 })
//                 if (index === -1) {
//                     this.studentsCache.push(student)
//                 }
//             });
//             if (data.error_info.errno == 1) {
//                 this.setState({
//                     data: data.data.studentList,
//                     page,
//                     perpage,
//                     total: +data.data.studentNum
//                 })
//             }
//         })
//     }
//     // 搜索
//     searchs(e) {
//         Http.post(Headers.url,
//             Object.assign('/school/get-student-list',{
//                 keyword: e
//             }).then(data => {
//                 if (data.error_info.errno == 1) {
//                     this.setState({
//                         data: data.data.studentList,
//                         pageFlag: false,
//                         scrollFlag: data.data.studentList.length > 6 ? true : false
//                     })
//                 }
//             })
//     }

//     // 分页器切换
//     handleTableChange = (cur, pageSize) => {
//         this.getStudent(cur, pageSize)
//     }
//     showModal = () => {
//         this.setState({
//             visible: true,
//         });
//         this.getStudent()
//     }

//     handleOk = () => {
//         let {arrData} = this.state
//         const selectedRowKeys = arrData.map((userId) => {
//             return this.studentsCache.find(item => {
//                 if (item.studentId === userId) {
//                     return true;
//                 }
//             })
//         })
//         this.props.studentChild(selectedRowKeys)
//         this.setState({ loading: true, scrollFlag: false });
//         setTimeout(() => {
//             this.setState({ loading: false, visible: false, pageFlag: true, selectedRowKeys: [] });
//         }, 1000);
//     }

//     handleCancel = () => {
//         this.setState({ visible: false });
//     }

//     render() {
//         const { visible, loading, data, selectedRowKeys,arrData } = this.state;
//         // 分组check 表格
//         const
//             rowSelection = {
//                 selectedRowKeys,
//                 onChange: (selectedRowKeys, selectedRows) => {
//                     if (selectedRowKeys.length > 6 || arrData.length>6) {
//                         message.destroy();
//                         message.error("最多只能添加6位学生")
//                     } else {
//                         // if(arrData.length<6){
//                         //     arrData.push(...selectedRowKeys)
//                         // }else{
//                         //     message.destroy();
//                         //     message.error("最多只能添加6位学生")
//                         // }
//                         this.setState({
//                             selectedRowKeys
//                         })
//                     }
//                 }
//             }

//         const columns = [{
//             title: '手机号',
//             dataIndex: 'studentAccount',
//         }, {
//             title: '姓名',
//             dataIndex: 'studentName',
//             render: text => <a href="javascript:;">{text}</a>,
//         }, {
//             title: '地区',
//             dataIndex: 'city',
//         }];
//         return (
//             <Fragment>
//                 <li className="add" onClick={this.showModal} style={{ textAlign: 'center' }}>
//                     <img src={require("../../../assets/imgs/icons/ic_add_circle_normal.png")} />
//                     {/* <span>（1/6）</span> */}
//                 </li>
//                 <Modal
//                     visible={visible}
//                     title="添加学生"
//                     onOk={this.handleOk}
//                     onCancel={this.handleCancel}
//                     footer={[<Button key="submit"
//                         type="primary"
//                         loading={loading}
//                         onClick={this.handleOk}
//                     >确认</Button>]}
//                 >
//                     <div>
//                         <Search
//                             style={{ margin: "10px auto" }}
//                             placeholder="请输入手机号或账号"
//                             enterButton="搜索"
//                             size="large"
//                             onSearch={(val) => this.searchs(val)}
//                         />
//                         <Table
//                             columns={columns}
//                             dataSource={data}
//                             pagination={false}
//                             rowSelection={rowSelection}
//                             rowKey={record => record.teacherId ? record.teacherId : record.studentId}
//                             scroll={this.state.scrollFlag ? { y: 200 } : false}
//                         />
//                         {
//                             this.state.pageFlag ? <Pagination
//                                 style={{ textAlign: "  center", paddingTop: 10 }}
//                                 total={+this.state.total}
//                                 pageSize={this.state.perpage}
//                                 itemRender={itemRender}
//                                 
//                                 defaultCurrent={this.page}
//                                 onChange={this.handleTableChange} /> : null
//                         }

//                     </div>
//                 </Modal>
//             </Fragment>
//         );
//     }
// }
{/* <TabPane tab="整组添加" key="1">
                            <div style={{display: "flex"}}>
                                <div style={{width: 100}}>所有分组：</div>
                                <Select defaultValue="教师1组">
                                    <Option value="教师1组">教师1组</Option>
                                    <Option value="教师2组">教师2组</Option>
                                    <Option value="教师3组">教师3组</Option>
                                </Select>
                            </div>
                            <div style={{display: "flex"}}>
                                <div style={{width: 150}}>人员列表：</div>
                                <div style={{display: "flex", flexWrap: "wrap"}}>
                                    <div
                                        style={{
                                            display: "flex",
                                            border: "1px solid #ddd",
                                            width: 200,
                                            margin: 5
                                        }}>
                                        <Checkbox/>
                                        <div>
                                            <div>马教师</div>
                                            <div>123456</div>
                                        </div>
                                    </div>
                                    <br/>
                                    <div
                                        style={{
                                            display: "flex",
                                            border: "1px solid #ddd",
                                            width: 200,
                                            margin: 5
                                        }}>
                                        <Checkbox/>
                                        <div>
                                            <div>王教师</div>
                                            <div>123456</div>
                                        </div>
                                    </div>
                                    <br/>
                                    <div
                                        style={{
                                            display: "flex",
                                            border: "1px solid #ddd",
                                            width: 200,
                                            margin: 5
                                        }}>
                                        <Checkbox/>
                                        <div>
                                            <div>刘教师</div>
                                            <div>123456</div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </TabPane> */
}