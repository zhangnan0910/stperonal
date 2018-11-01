import React, { Component, Fragment } from 'react'
import HoverShow from "./groupingLeftshow"
import { connect } from "react-redux"
import FreeScrollBar from 'react-free-scrollbar'
import Random from "@/utils/random"
import {Paginationcom} from '@/components/Paginationcom'
import AddTeacher from '@/pages/Users/grouping/TeacherAdd'
import AddStudent from '@/pages/Users/grouping/StudentAdd'
import {
  GET_DATA_START,
  GET_DATA_SUCCESS
} from '@/stores/reducer/variable'
import {
  Breadcrumb,
  Layout,
  Modal,
  Table,
  Button,
  Icon,
  Input,
  message,
  Spin,
  Pagination,
} from 'antd'
const { Content } = Layout
const Search = Input.Search;
import Http from "@/utils/http"
import './index.less'
class index extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      teacherList:[],
      studentList:[],
      title: null,
      searchVal:'',
      visible: false,
      confirmLoading: false,
      content: null,
      value: "",
      userList: [],
      modaldata: null,
      ind: 0,
      total: 0,
      page: 1,
      perpage: 6,
      classNameId: '',
      loading: true,
      scrollFlag:false,
      pageFlag:true,
      columns: null,
    }
  }
  componentDidMount() {
    // 初始页面渲染
    let { ind } = this.state
    // this.props.getgroupData()
    // 获取机构分组
    Http.post("/school/get-group-list",
    ).then(data => {
      if (data.error_info.errno == 1) {
        this.setState({
          data: data.data
        })
        return data.data.groupList
      }
    }).then(res => {
      // 获取机构分组下的老师和学生
      if(res){
        Http.post("/school/get-group-user-list",{
            groupId: res[ind].groupId
          }).then(data => {
          let that = this
          if (data.error_info.errno == 1) {
            that.setState({
              studentList:data.data.studentList,
              teacherList:data.data.teacherList,
            })
          }
        })
      }
      }).catch()
  }
  render() {
    const styles = { width: '100%', height: 390 }
    const { visible,
      data,
      teacherList,
      studentList } = this.state;
    if (data.groupList) {
      if (this.state.ind == 0) {
        data.groupList[0]&&this.setState({
          ind: data.groupList[0].groupId
        })
      }
    }
    const columns = [{
      title: '手机号',
      dataIndex: this.state.flag ? 'studentAccount' : 'teacherAccount',
      key: this.state.flag ? 'studentAccount' : 'teacherAccount',
    }, {
      title: '名称',
      dataIndex: this.state.flag ? 'studentName' : 'teacherName',
      key: this.state.flag ? 'studentName' : 'teacherName',
    }, {
      title: '地区',
      dataIndex: 'city',
      key: 'city'
    }]
    if (data.length != 0) {
      return (
        <Layout className="commons">
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item >
              用户管理
            </Breadcrumb.Item>
            <Breadcrumb.Item>分组管理</Breadcrumb.Item>
          </Breadcrumb>
          <Content className="user-content">
            <div>
              <span >分组管理</span>
              <Button
                type="primary"
                style={{ width: 102 }}
                onClick={this.showModal.bind(this)}
                name="添加分组">
                <Icon type="plus" />添加分组
              </Button>
            </div>
            <div className="groupcontent user-content-bottom">
              {/* 分组列表 */}
              <div className="grouping-left grouping">
                <div style={{ display: "flex" }} className="grouping-title">
                  <span style={{ paddingLeft: 30 }}>分组</span>
                  <span>操作</span>
                </div>
                <ul style={styles}>
                  <FreeScrollBar autohide>
                    {
                      data.groupList && data.groupList.map((res, index) => {
                        return <HoverShow
                          key={res.groupId}
                          res={res}
                          groupId={this.state.ind != 0 ? this.state.ind : data.groupList[0].groupId}
                          propChild={this.propChild.bind(this)}
                          handleChild={this.handleChild.bind(this)}> </HoverShow>
                      })
                    }
                  </FreeScrollBar>
                </ul>
              </div>
              {/* 某分组下的老师和学生 */}
              <div className="grouping-right" style={{ marginLeft: 20 }}>
                <div style={{ display: "flex", height: 40, alignItems: "center" }} className="grouping-title grouping-title1">
                  <span>教师 ( <b style={{ color: "#1093ED" }}>{(teacherList && teacherList.length)||0}</b> )</span>
                  <span>学生 ( <b style={{ color: "#1093ED" }}>{(studentList && studentList.length)||0}</b> )</span>
                </div>
                <div style={{ display: "flex" }} className="grouping-right-center">
                  {/* 教师 */}
                  <FreeScrollBar autohide>
                  {data.groupList[0]&&<ul>
                    < AddTeacher teacherChild={this.teacherChild}></AddTeacher>
                      {/* <li onClick={(e) => this.showModal(e, 'ulboxl')} style={{ textAlign: "center" }}>
                        <img style={{ width: 20, height: 20 }} src={require("../../../assets/imgs/icons/ic_add_circle_normal.png")} alt="" />
                      </li> */}
                      {
                        teacherList[0] && teacherList.map((res, index) => {
                          let a = Random(res.teacherAccount)
                          return <li key={index} onClick={() => this.Jump(res)}>
                            <dl style={{ marginBottom: 0 }}>
                              <dt><img src={res.teacherAvatar ? res.teacherAvatar :a} alt="" /></dt>
                              <dd style={{ paddingLeft: 10 }}>
                                <h3 style={{ fontSize: 16, color: res.teacherName?"#333":'red'  }}>{res.teacherName?res.teacherName:'未设置昵称'}</h3>
                                <p style={{ fontSize: 12, color: "#999" }}>{res.teacherAccount}</p>
                              </dd>
                            </dl>
                          </li>
                        })
                      }
                
                    </ul>}</FreeScrollBar>
                  {/* 学生 */}
                  <FreeScrollBar autohide>{data.groupList[0]&&<ul>
                      {/* <li onClick={(e) => this.showModal(e, 'ulboxr')} className="getgroupstudentList" style={{ textAlign: "center" }}>
                        <img style={{ width: 20, height: 20 }} className="getgroupstudentList" src={require("../../../assets/imgs/icons/ic_add_circle_normal.png")} alt="" />
                      </li> */}
                      <AddStudent studentChild={this.studentChild}></AddStudent>
                      {
                        studentList && studentList.map((res, index) => {
                          let a = Random(res.studentAccount)
                          return <li key={index} onClick={() => this.Jump(res)}>
                            <dl style={{ marginBottom: 0 }}>
                              <dt><img src={res.studentAvatar ? res.studentAvatar : a} alt="" /></dt>
                              <dd style={{ paddingLeft: 10 }}>
                                <h3 style={{ fontSize: 16, color: res.studentName?"#333":'red' }}>{res.studentName?res.studentName:'未设置昵称'}</h3>
                                <p style={{ fontSize: 12, color: "#999" }}>{res.studentAccount}</p>
                              </dd>
                            </dl>
                          </li>
                        })
                      }
                    
                    </ul>}</FreeScrollBar>
                </div>
              </div>
            </div>
            <Modal
              visible={visible}
              onOk={this.handleOk}
              onCancel={this.handleCancel}
              title={this.state.title}
              cancelText="取消"
              okText="确定"
              destroyOnClose
            >
              {
                this.state.title == '添加分组' ?
                  <div
                    style={{ display: "flex", alignItems: "center" }}>
                    <span style={{ width: 100 }}>分组名称 :</span>
                    <input type="text"
                      className="ant-input"
                      onBlur = {(e)=>{
                        message.destroy()
                        e.target.value.length>30?message.error('分组名称最大长度为30个字符'):null
                      }}
                      placeholder="请输入分组名称"
                      onChange={this.handelChange}
                    />
                  </div>
                  :
                  <div style={{ paddingTop: 30 }}>
                    <div style={{ display: 'flex', marginBottom: 10, justifyContent: 'space-between' }}>
                      <span style={{ padding: '10px 10px 10px 0' }}>{this.state.flag ? "本机构学生" : "本机构教师"}</span>
                      <Search style={{ justifyContent: 'space-between' }}
                        onSearch={(val) => this.searchs(val)}
                        placeholder="请输入手机号或姓名"
                        value = {this.state.searchVal}
                        onChange = {(e)=>{
                          this.setState({
                            searchVal:e.target.value
                          })
                        }}
                        style={{ marginLeft: 10, width: 300 }}
                      />
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      {
                        this.state.loading ?
                          <Spin></Spin> :
                          <Fragment>
                            <Table
                              columns={columns}
                              dataSource={this.state.modaldata}
                              rowSelection={this.rowSelection}
                              pagination={false}
                              locale = {
                                {emptyText:'暂无数据'}
                              }
                              rowKey={record => record.teacherId ? record.teacherId : record.studentId}
                              // scroll={this.state.scrollFlag?{y:200}:false}
                            />
                            {/* <Paginationcom
                              onChange={this.handleTableChange}
                              PagData = {{
                                total:this.state.total,
                                pageSize:this.state.perpage,
                                itemRender:itemRender,
                                defaultCurrent:this.state.page,
                              }}
                              ></Paginationcom> */}
                            {this.state.pageFlag?<Pagination
                              style={{ textAlign: "center", paddingTop: 10 }}
                              total={+this.state.total}
                              pageSize={this.state.perpage}                              
                              defaultCurrent={this.state.page}
                              onChange={this.handleTableChange} />:null}

                          </Fragment>
                      }
                    </div>
                  </div>
              }
            </Modal>
          </Content>
        </Layout>)
    } else {
      return (
        <Layout className="commons"><Spin /></Layout>
      )
    }

  }
  // 列表更新，重新渲染
  resData() {
    return Http.post("/school/get-group-list",
    ).then(data => {
      if (data.error_info.errno == 1) {
        this.setState({
          data: data.data
        })
      }
    })
  }

  // 弹窗显示
  showModal = (e) => {
      this.setState({
        title: e.target.name
      })
    this.setState({
      visible: true,
    });
  }
  handelChange = (e) => {
    this.setState({
      value: e.target.value
    })
  }
  // 弹窗确定按钮
  handleOk = (e) => {
    let { title, value, userList, ind, data } = this.state
    let tdata = []
      if(this.state.value.length<=30&&this.state.value.length>0){
        // 添加发送请求
        Http.post("/school/add-group",{
            groupName: value,
          }).then(data => {
          if (data.error_info.errno == 1) {
            // 添加成功，重新请求数据
            message.success('添加成功')
            this.resData()
            this.setState({
              visible: false,
            })
          }
        })
      }else if(this.state.value.length<1){
        message.destroy()
        message.error('分组名称不能为空')
        this.setState({
          visible: true,
        })
      }else{
        message.destroy()
        message.error('分组名称最大长度为30个字符')
        this.setState({
          visible: true,
        })
      }
    setTimeout(() => {
      this.setState({
        confirmLoading: false,
        scrollFlag:false,
        pageFlag:true,
        searchVal:''
      });
    }, 1000);
  }
  // 弹出取消按钮
  handleCancel = () => {
    this.setState({
      visible: false,
      searchVal:'',
      modaldata:[]
    });
  }
  // 请求添加分组教师和学生
  getGroupList = (tdata)=>{
    let {ind} = this.state
      Http.post("/school/add-group-user",{
          groupId: ind == "0" ? data.groupList[ind].groupId : ind,
          userAccountJson: JSON.stringify(tdata),
        }).then(res => {
        Http.post("/school/get-group-user-list",{
            groupId: ind == "0" ? data.groupList[ind].groupId : ind,
          }).then(data => {
          let that = this
          if (data.error_info.errno == 1) {
            that.setState({
              rightdata: data.data,
            })
            this.resData()
          }
        })
      })
  }
    
  // 编辑 重新请求数据
  propChild(e) {
    Http.post('/school/get-group-list',{
        keyword: e
      }).then(data => {
      if (data.error_info.errno == 1) {
        if(!data.data.groupList[0]){
          this.setState({
            studentList:data.data.studentList,
            teacherList:data.data.teacherList,
          })
        }
        this.setState({
          data: data.data
        })
      }
    }).catch()
  }
  // 切换文件夹显示不同的数据
  handleChild(e, flag) {
    let val = this.state.data.groupList
    let vals = val.map(res => {
      if (res.groupId !== e.groupId) {
        return res
      }
    })
    Http.post('/school/get-group-user-list',{
        groupId: flag ? (vals[0] ? vals[0].groupId : vals[1].groupId) : e.groupId,
      }).then(data => {
      let that = this
      if (data.error_info.errno == 1) {
        that.setState({
          studentList:data.data.studentList,
          teacherList:data.data.teacherList,
          ind: flag ? (vals[0] ? vals[0].groupId : vals[1].groupId) : e.groupId,
        })
      }
    })
  }
  Jump(val) {
    this.props.history.push({
      pathname: '/teacherDetail/'+val.id,
      state: val
    })
  }
  // 老师确定返回的数据
  teacherChild = (e) => {
    let tdata = []
    let {teacherList} = this.state
    for(let i=0;i<e.length;i++){
      if(teacherList.indexOf(e[i])==-1){
        teacherList.push(e[i])
      }
    }
    teacherList.map(res=>{
      tdata.push({
        userAccount: res.teacherAccount,
        type: 1,
        name: res.teacherName,
      })
    })
    this.getGroupList(tdata)
    this.setState({
        teacherList,
    })
}
studentChild = (e) => {
  let tdata = []
  let {studentList} = this.state
  for(let i=0;i<e.length;i++){
    if(studentList.indexOf(e[i])==-1){
      studentList.push(e[i])
    }
  }
  studentList.map(res=>{
    tdata.push({
      userAccount: res.studentAccount,
      type: 1,
      name: res.studentName,
    })
  })
  this.getGroupList(tdata)
  this.setState({
      studentList,
  })
}
teacherChildList = (e) => {
    let data = []
    this.state.teacherVal.map(res => {
        if (res.teacherAccount !== e) {
            message.destroy();
            message.success('删除成功')
            data.push(res)
        }
    })
    this.setState({
        teacherVal: data,
        teacherJson: data
    })
}
studentChildList = (e) => {
    let data = []
    let data1 = []
    this.state.studentVal.map(res => {
        if (res.studentAccount != e) {
            data.push(res)
            data1.push({
                account: res.studentAccount,
                name: res.studentName
            })
        }
    })
    this.setState({
        studentVal: data,
        studentJson: data1
    })
}
}

export default index
