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
        return (
            <li
                onMouseEnter={this.handleMouseEnter.bind(this)}
                onMouseLeave={this.handleMouseLeave.bind(this)}>
                <dl style={{ marginBottom: 0 }}>
                    <dt><img src={res.res.teacherAvatar ? res.res.teacherAvatar : a} alt="" /></dt>
                    <dd style={{ paddingLeft: 10 }}>
                        <h3 style={{ fontSize: 16, color: "#333" }}>{res.res.teacherName?res.res.teacherName:res.res.studentName}</h3>
                        <p style={{ fontSize: 12, color: "#999" }}>{res.res.teacherAccount?res.res.teacherAccount:res.res.studentAccount}</p>
                        {this.state.isiconShow?<Icon type="delete" onClick={(e) => this.edit(e, res.res)}  style={{ padding: 10, fontSize: 20, color: "#1093ED" }} />:null}
                    </dd>
                </dl>
            </li>
        )
    }
}










import React, { Component, Fragment } from 'react'
import HoverShow from "./groupingLeftshow"
import FreeScrollBar from 'react-free-scrollbar'
import Random from "@/utils/random"
import HoverDelete from '../../../pages/Users/grouping/HoverDelete'
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
import { getCookie } from '@/utils/cookies'
const { Content } = Layout
const Search = Input.Search;
import Http from "@/utils/http"
import './index.less'
class index extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      rightdata: {},
      title: null,
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
      studentList:[],
      teacherList:[]
    }
  }
  componentDidMount() {
    // 初始页面渲染
    let { ind } = this.state
    // this.props.getgroupData()
    // 获取机构分组
    Http.post("/school/get-group-list")
    .then(data => {
      if (data.error_info.errno == 1) {
        this.setState({
          data: data.data
        })
        return data.data.groupList
      }
    }).then(res => {
      // 获取机构分组下的老师和学生
      Http.post("/school/get-group-user-list",{
          groupId: res[ind].groupId
        }).then(data => {
        let that = this
        if (data.error_info.errno == 1) {
          that.setState({
            // rightdata: data.data
            studentList:data.data.studentList,
            teacherList:data.data.teacherList
          })
        }
      })
    }).catch()
  }
  // 列表更新，重新渲染
  resData() {
    return Http.post("/school/get-group-list")
    .then(data => {
      if (data.error_info.errno == 1) {
        this.setState({
          data: data.data
        })
      }
    })
  }
  // 点击添加教师学生
  getData(flag, page, perpage) {
    // 点击添加教师和学生
    Http.post( flag ?"/school/get-student-list" :
          "/school/get-teacher-list",{
        page: page ? page : this.state.page,
        perpage: perpage ? perpage : this.state.perpage,
      }).then(data => {
      let datas = data.data.studentList ? data.data.studentList : data.data.teacherList
      if (data.error_info.errno == 1) {
        this.setState({
          modaldata: datas,
          title: "",
          total: data.data.teacherNum ? data.data.teacherNum : data.data.studentNum,
          loading: false,
          page,
          perpage
        })
      }
    })
  }
  // 分页器
  handleTableChange = (cur, pageSize) => {
    this.getData(this.state.flag, cur, pageSize)
  }
  teacherChildList = (e) => {
    
    let data = []
    this.state.teacherList.map(res => {
        if (res.teacherAccount !== e) {
            // message.destroy();
            // message.success('删除成功')
            data.push(res)
        }
    })
    this.state.teacherList = data
    this.setState({
          teacherList:data
    })
}
  studentChildList = (e) => {
    let data = []
    this.state.studentList.map(res => {
        if (res.studentAccount != e) {
            data.push(res)
        }
    })
    this.setState({
        studentList:data
  })
}
  // 弹窗显示
  showModal = (e) => {
    const flag = e.target.className === "getgroupstudentList"
    // 弹框内容
    if (e.target.name === "添加分组") { // 添加分组
      this.setState({
        title: e.target.name
      })
    } else { // 学生和老师机构
      this.getData(flag, this.state.page, this.state.perpage)
      this.setState({
        flag,
        modaldata: [],
        total: 0,
        loading: true
      })
    }

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
    if (title == "添加分组") {
      // 添加发送请求
      Http.post("/school/add-group",{
          groupName: value,
        }).then(data => {
        if (data.error_info.errno == 1) {
          // 添加成功，重新请求数据
          message.success('添加成功')
          this.resData()
        }
      })
    } else {
      // 处理给后台传送数据
      userList.map(res => {
        if (res.teacherId) {
          tdata.push({
            userAccount: res.teacherAccount,
            type: 1,
            name: res.teacherName
          })
        } else {
          tdata.push({
            userAccount: res.studentAccount,
            type: 2,
            name: res.studentName
          })
        }
      })
      // 请求添加分组教师和学生
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


    setTimeout(() => {
      this.setState({
        visible: false,
        confirmLoading: false,
        scrollFlag:false,
        pageFlag:true
      });
    }, 1000);
  }
  // 弹出取消按钮
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }
  // 搜索 
  searchs(e, columns, flag) {
    Http.post("/school/get-teacher-list",{
        keyword: e
      }).then(data => {
        let datas = data.data.studentList ? data.data.studentList : data.data.teacherList
        if (data.error_info.errno == 1) {
            this.setState({
              title: "",
              modaldata: datas,
              scrollFlag:datas.length>6?true:false,
              pageFlag:false
            })
        }
      })
  }
  // 分组check 表格
  const
  rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      this.setState({
        userList: selectedRows
      })
    }
  }
  // 编辑 重新请求数据
  propChild(e) {
    Http.post("/school/get-group-list",{
        keyword: e
      }).then(data => {
      if (data.error_info.errno == 1) {
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
    Http.post("/school/get-group-user-list",{
        groupId: flag ? (vals[0] ? vals[0].groupId : vals[1].groupId) : e.groupId,
      }).then(data => {
      let that = this
      if (data.error_info.errno == 1) {
        that.setState({
          rightdata: data.data,
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
  render() {
    const styles = { width: '100%', height: 390 }
    const { visible,
      data,
      teacherList,
      studentList} = this.state;
    if (data.groupList) {
      if (this.state.ind == 0) {
        this.setState({
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
            <Breadcrumb.Item>
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
                  <span>教师 ( <b style={{ color: "#1093ED" }}>{teacherList && teacherList.length}</b> )</span>
                  <span>学生 ( <b style={{ color: "#1093ED" }}>{studentList && studentList.length}</b> )</span>
                </div>
                <div style={{ display: "flex" }} className="grouping-right-center">
                  {/* 教师 */}
                  <FreeScrollBar autohide>
                  <ul>
                    
                      <li onClick={(e) => this.showModal(e, 'ulboxl')} style={{ textAlign: "center" }}>
                        <img style={{ width: 20, height: 20 }} src={require("../../../assets/imgs/icons/ic_add_circle_normal.png")} alt="" />
                      </li>
                      {
                          teacherList && teacherList.map((res, index) => {
                              return <HoverDelete key={index} teacherChildList={this.teacherChildList}
                                  res={res}></HoverDelete>
                          })
                      }
                      {/* {
                        teacherList && teacherList.map((res, index) => {
                          let a = Random(res.teacherAccount)
                          return <li key={index} onClick={() => this.Jump(res)}>
                            <dl style={{ marginBottom: 0 }}>
                              <dt><img src={res.teacherAvatar ? res.teacherAvatar : require(`../../../assets/imgs/avatar/icon_0${a}.png`)} alt="" /></dt>
                              <dd style={{ paddingLeft: 10 }}>
                                <h3 style={{ fontSize: 16, color: "#333" }}>{res.teacherName}</h3>
                                <p style={{ fontSize: 12, color: "#999" }}>{res.mobile}</p>
                              </dd>
                            </dl>
                          </li>
                        })
                      } */}
                
                  </ul></FreeScrollBar>
                  {/* 学生 */}
                  <FreeScrollBar autohide><ul>
                    
                      <li onClick={(e) => this.showModal(e, 'ulboxr')} className="getgroupstudentList" style={{ textAlign: "center" }}>
                        <img style={{ width: 20, height: 20 }} className="getgroupstudentList" src={require("../../../assets/imgs/icons/ic_add_circle_normal.png")} alt="" />
                      </li>
                      {/* {
                        studentList && studentList.map((res, index) => {
                          let a = Random(res.studentAccount)
                          return <li key={index} onClick={() => this.Jump(res)}>
                            <dl style={{ marginBottom: 0 }}>
                              <dt><img src={res.studentAvatar ? res.studentAvatar : require(`../../../assets/imgs/avatar/icon_0${a}.png`)} alt="" /></dt>
                              <dd style={{ paddingLeft: 10 }}>
                                <h3 style={{ fontSize: 16, color: "#333" }}>{res.studentName}</h3>
                                <p style={{ fontSize: 12, color: "#999" }}>{res.mobile}</p>
                              </dd>
                            </dl>
                          </li>
                        })
                      } */}
                      {
                          studentList && studentList.map((res, index) => {
                              return <HoverDelete key={index} studentChildList={this.studentChildList}
                                  res={res}></HoverDelete>
                          })
                      }
                    
                  </ul></FreeScrollBar>
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
                              rowKey={record => record.teacherId ? record.teacherId : record.studentId}
                              scroll={this.state.scrollFlag?{y:200}:false}
                              locale = {
                                {emptyText:'暂无数据'}
                              }
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
}
export default index
