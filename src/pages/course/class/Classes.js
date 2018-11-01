import React from 'react';
import {connect} from "react-redux";
import {Link} from "react-router-dom";
import {Table, 
        message, 
        Icon, 
        Button, 
        Breadcrumb, 
        Pagination, 
        Modal,
        Select,
        Input
    } from 'antd';
import {getCookie} from '@/utils/cookies';
import Http from "@/utils/http"
import moment from "moment";
const InputGroup = Input.Group;
const Option = Select.Option;
const Search = Input.Search;
class Classes extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            getcookies: JSON.parse(unescape(unescape(getCookie("login-token")))),
            items: [],
            courseStatus: 0,
            page: 1,
            perpage: 10,
            visible: false,
            course_id: null,
            total:10,
            SelectVal:'课程',
            SearchVals:'请输入课程名称',
            SearchVal:'',
            SearchFlag:false,
            httpFlag:true
        }
    }
    componentDidMount() {
        const {page, perpage} = this.state;
        this.getCourseList(page, perpage);
    }
    render() {
        const {items, page, perpage} = this.state;
        return (
            <div style={{padding: 20,height:'100%',display: "flex",flexDirection:'column'}}>
                <div style={{display: "flex",paddingBottom:15,flexShrink:0}}>
                    <Breadcrumb  style={{flex: "95%"}}>
                        <Breadcrumb.Item>
                            教学管理
                        </Breadcrumb.Item>
                        <Breadcrumb.Item>
                            <span>课程管理</span>
                        </Breadcrumb.Item>
                    </Breadcrumb>
                </div>
                <Modal
                    title='提示'
                    width="360px"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    cancelText="取消"
                    okText="确定"
                    cancelButtonProps
                >
                    <div style={{textAlign: "center"}}>
                        <h6 style={{color: "#FF3B30", fontSize: 18}}>确定要删除此课程吗？</h6>
                    </div>
                </Modal>
                <div style={{backgroundColor: "#fff", padding: 15,flex:1}}>
                    <div style={{display: "flex"}}>
                        <h3 style={{flex: "50%"}}>课程管理</h3>
                        <div style={{display: "flex"}} >
                            <InputGroup compact className='classSearchStyle' >
                                <Select defaultValue="课程" onChange={this.SelecthandleChange}>
                                    <Option value="课程">课程</Option>
                                    <Option value="教师">教师</Option>
                                </Select>
                                <Search
                                    placeholder={this.state.SearchVals}
                                    onSearch={value => {
                                        this.setState({
                                            page:1,
                                        },()=>{
                                            if(value != ''){
                                                this.getCourseLists(value)
                                                this.setState({
                                                    SearchVal:value,
                                                    httpFlag:true,
                                                    SearchFlag:true,
                                                    page:1
                                                })
                                            }else{
                                                if(this.state.httpFlag){
                                                    this.getCourseLists(value)
                                                    this.setState({
                                                        httpFlag:false,
                                                        SearchFlag:false
                                                    })
                                                }else{
                                                    message.destroy()
                                                    message.error('请输入搜索内容')
                                                }
                                                
                                            }
                                        })
                                    }}
                                    // enterButton="搜索"
                                    style={{ marginRight:10 ,width:200,borderRight:'1px solid #ccc'}}
                                    value = {this.state.SearchVal}
                                    onChange = {(e)=>{
                                        this.setState({
                                            SearchVal:e.target.value
                                        })
                                    }}
                                />
                                </InputGroup>    
                            <Button type="primary" onClick={() => {
                                this.Jump('创建课程')
                            }} style={{width: 110}}>
                                <Icon type="plus"/>新建课程<Link to="/create"></Link>
                            </Button>
                        </div>
                    </div>
                    <Table
                        columns={this.columns()}
                        dataSource={items}
                        style={{marginTop: 15}}
                        pagination={false}
                        rowKey={e => e.course_id}
                        locale = {
                            {emptyText:'暂无数据'}
                          }
                    />
                    <Pagination
                        style={{textAlign: "right", padding: "10px 0px"}}
                        defaultCurrent={1}
                        total={+this.state.total}
                        pageSize={this.state.perpage}
                        onChange={(page, perpage) => {
                            if(!this.state.SearchFlag){
                                this.getCourseList(page, perpage);
                            }else{
                                this.getCourseLists(this.state.SearchVal,page, perpage)
                            }
                            
                        }}
                        current={this.state.page}
                    />
                </div>
            </div>
        )
    }
    SelecthandleChange = (e) =>{
        if(e==='教师'){
            this.setState({
                SelectVal:'教师',
                SearchVals:'请输入手机号或姓名',
                SearchVal:''
            })
        }else{
            this.setState({
                SelectVal:'课程',
                SearchVals:'请输入课程名称',
                SearchVal:''
            })
        }
    }
    Jump(text, val) {
        if (text === '编辑课程') {
            this.props.history.push({
                pathname: '/lesson',
                state: {
                    val,
                    text
                }
            })
        } else if (text === '创建课程') {
            this.props.history.push({
                pathname: '/create',
                state: {
                    val,
                    text
                }
            })
        }

    }
    // 模糊搜索
    getCourseLists = (val,page, perpage) => {
        let {courseStatus,SelectVal} = this.state
        Http.post('/course/get-course-list', {
                courseStatus,
                page:page?page:this.state.page,
                perpage:perpage?perpage:this.state.perpage,
                courseName:SelectVal==='课程'?val:'',
                teacherName:SelectVal==='教师'?val:''
            }
        ).then(data=>{
            if(data.error_info.errno===1){
                this.setState({
                    items: data.data.list,
                    total:data.data.countTotal,
                    page:page?page:this.state.page
                })
            }else{
                this.setState({
                    items: [],
                    total:10
                })
                message.destroy()
                message.error(data.error_info.error)
            }
        })
    }
    // 获取列表数据
    getCourseList = (page, perpage) => {
        const {getcookies, courseStatus} = this.state;
        Http.post('/course/get-course-list',{
            courseStatus: courseStatus,
            page,
            perpage,
        }).then((response) => {
            if (response.error_info.errno === 1) {
                this.setState({
                    items: response.data.list,
                    page,
                    perpage,
                    total:response.data.countTotal
                })
            }
        }).catch(e => {
        });
    }

    edit(row) {
        this.props.history.push({
            pathname: '/editclass/'+row.course_id+'/'+row.record,
            state: row
        })
    }

    showModal = (e, val) => {
        this.setState({
            visible: true,
            course_id: val.course_id
        });

    }
    // 弹窗确定按钮
    handleOk = (e) => {
        Http.post( '/course/del-course',{
                courseId: this.state.course_id,
            }
        ).then(res => {
            if (res.error_info.errno === 1) {
                message.destroy();
                message.success('删除成功')
                const {page, perpage} = this.state;
                this.getCourseList(page, perpage);
            } else {
                message.destroy();
                message.error(res.error_info.error)
            }
        })
        this.setState({
            visible: false,
        });

    }
    // 弹窗关闭按钮
    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }
    columns = () =>{
        return [
            {
                title: '课程名称',
                dataIndex: 'course_name',
                key: 'course_name',
                render: (value, row) => {
                    return <span style={{ cursor: "pointer",overflow:'hidden'}} onClick={() => {
                        this.Jump('编辑课程', row)
                    }}>{value}</span>
                },
                width:200
            }, {
                title: '类型',
                dataIndex: 'type',
                key: 'type',
                align:'center',
                render: (value) => {
                    return (<span>{parseInt(value) === 0 ? `公开课` : `标准课`}</span>)
                }
            }, {
                title: '开始时间',
                dataIndex: 'course_btime',
                key: 'course_btime',
                align:'center',
                render: value => {
                    return (<div>
                        {+value<='0'?'未设置':moment(moment.unix(value)).format('YYYY-MM-DD HH:mm')}    
                    </div>);
                }
            }, {
                title: '课节进度',
                key: 'progress',
                dataIndex: 'progress',
                align:'center',
                render: (value, row) => {
                    return (<div>
                        {row.class_end} /{row.class_count}
                    </div>)
                }
            },  {
                title: '教师',
                key: 'teacher_name',
                dataIndex: 'teacher_name',
                align:'center',
            }, {
                title: '学生人数',
                key: 'student_num',
                dataIndex: 'student_num',
                align:'center',
                render: (value, row) => {
                    if(row.type==0){
                        if(row.course_status==1){
                            return <span>{row.student_num}</span>
                        }else{
                            return <span>--</span>
                        }
                    }else{
                        return <span>{value}</span>
                    }
                }
            }, {
                title: '状态',
                key: 'course_status',
                dataIndex: 'course_status',
                align:'center',
                render: (value, row) => {
                    if (parseInt(value) === 0) {
                        value = '未开始'
                        return (<span style={{padding:'5px 10px',borderRadius:5,color:'#fff', backgroundColor: "#CCC", border: 0}}>{value}</span>)
                    } else if (parseInt(value) === 1) {
                        value = '进行中'
                        return (<span style={{padding:'5px 10px',borderRadius:5,color:'#fff', backgroundColor: "#1BA1ED", border: 0}}>{value}</span>)
                    } else if(parseInt(value) === 2) {
                        value = '已完成';
                        return (<span style={{padding:'5px 10px',borderRadius:5,color:'#fff', backgroundColor: "#777", border: 0}}>{value}</span>)
                    }else if(value===-1){
                        value = ''
                        // return (<span style={{padding:'5px 10px',borderRadius:5,color:'#fff', backgroundColor: "#777", border: 0}}>{value}</span>)
                    }else{
                        value = '已结课';
                        return (<span style={{padding:'5px 10px',borderRadius:5,color:'#fff', backgroundColor: "#777", border: 0}}>{value}</span>)
                    }
                }
            }, {
                title: '操作',
                key: 'handle',
                align:'center',
                dataIndex: 'handle',
                render: (value, row) => {
                    //row.class_state 0:未上课，1 上课
                   if(row.course_status==0||row.course_btime<=0){
                        return <div id='cursor'>
                        <img style={{padding: 10, cursor: "pointer"}}
                            onClick={() => this.edit(row)} className='user-bj'
                            src={require(`../../../assets/imgs/icons/icon_edit_hover.png`)} alt=""/>
                        <img style={{padding: 10, cursor: "pointer"}}
                            className='minus-circle-o user-bj' onClick={(e) => this.showModal(e, row)}
                            src={require(`../../../assets/imgs/icons/icon_delete_normal.png`)} alt=""/>
                    </div>
                   }else if(row.course_status==1){
                       if(row.class_state==1){
                            return <div id='cursor'>
                            <img style={{padding: 10, cursor: "pointer",opacity:'.2'}}
                                onClick={()=>{message.destroy(), message.error('课程正在进行中,不可操作')}}
                                src={require(`../../../assets/imgs/icons/icon_edit_hover.png`)} alt=""/>
                            <img style={{padding: 10, cursor: "pointer",opacity:'.2'}}
                                className='minus-circle-o user-bj' onClick={()=>{message.destroy(), message.error('课程正在进行中,不可操作')}}
                                src={require(`../../../assets/imgs/icons/icon_delete_normal.png`)} alt=""/>
                            </div>
                       }else{
                        return <div id='cursor'>
                        <img style={{padding: 10, cursor: "pointer"}}
                            onClick={() => this.edit(row)} className='user-bj' className='user-bj'
                            src={require(`../../../assets/imgs/icons/icon_edit_hover.png`)} alt=""/>
                        <img style={{padding: 10, cursor: "pointer",opacity:'.2'}}
                            className='minus-circle-o user-bj' onClick={()=>{message.destroy(), message.error('课程正在进行中,不可操作')}}
                            src={require(`../../../assets/imgs/icons/icon_delete_normal.png`)} alt=""/>
                        </div>
                       }
                        
                   }else if(row.course_status==2){
                    return <div id='cursor'>
                        <img style={{padding: 10, cursor: "pointer",opacity:'.2'}}
                            onClick={()=>{message.destroy(), message.error('课程已完成')}} className='user-bj'
                            src={require(`../../../assets/imgs/icons/icon_edit_hover.png`)} alt=""/>
                        <img style={{padding: 10, cursor: "pointer",opacity:'.2'}}
                            className='minus-circle-o user-bj' onClick={()=>{message.destroy(), message.error('课程已完成')}}
                            src={require(`../../../assets/imgs/icons/icon_delete_normal.png`)} alt=""/>
                    </div> 
                   }else{
                    return <div id='cursor'>
                        <img style={{padding: 10, cursor: "pointer",opacity:'.2'}}
                            onClick={()=>{message.destroy(), message.error('课程已完结')}} className='user-bj'
                            src={require(`../../../assets/imgs/icons/icon_edit_hover.png`)} alt=""/>
                        <img style={{padding: 10, cursor: "pointer",opacity:'.2'}}
                            className='minus-circle-o user-bj' onClick={()=>{message.destroy(), message.error('课程已完结')}}
                            src={require(`../../../assets/imgs/icons/icon_delete_normal.png`)} alt=""/>
                    </div> 
                }
                },
            }];
    }
}

export default connect()(Classes)