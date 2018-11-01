import React, { Component, Fragment } from 'react'
import {
  Table,
  Breadcrumb,
  Icon,
  Modal,
  Button,
  Layout,
  Popover,
  Spin,
  message,
  Pagination,
  Input
} from 'antd'
import Random from "@/utils/random"
import { getCookie } from '@/utils/cookies'
import { Link } from "react-router-dom"
import { connect } from "react-redux"
import { GET_DATA_START,
  GET_TEACHERDATA_SUCCESS,
  GET_DELETE_TEACHER
} from '@/stores/reducer/variable'
// import NewFroms from "@/components/NewFroms"
import Http from "@/utils/http"
const { Content } = Layout
const Search = Input.Search;
class index extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      visible: false,
      content: null,
      page: 1,
      perpage: 10,
      title: '',
      teacherAccountid: "",
      searchVal:'',
      searchFlag:true,
      getcookie: JSON.parse(unescape(unescape(getCookie("login-token")))),
    }
  }
  componentDidMount() {
    this.props.getData({
      page: this.state.page,
      perpage: this.state.perpage,
      keyword:this.state.searchVal,
      searchFlag:this.state.searchFlag
    })
  }
  render() {
    let { getuserteacher } = this.props
      return (
        <Layout className="commons">
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              用户管理
            </Breadcrumb.Item>
            <Breadcrumb.Item>教师管理</Breadcrumb.Item>
          </Breadcrumb>
          <Content className="user-content">
            <div style={{display:'flex'}}>
              <span>教师管理</span>
              <div style={{display:'flex'}}>
              <Search
                placeholder="请输入手机号或姓名"
                onSearch={value => {
                  this.setState({
                    page:1
                  },()=>{
                    if(value!==''){
                      this.setState({
                        searchVal:value,
                        page:this.state.page,
                        perpage: this.state.perpage,
                        searchFlag:true
                      })
                      this.props.getData({
                        page: this.state.page,
                        perpage: this.state.perpage,
                        keyword:value
                      })
                    }else{
                      if(this.state.searchFlag){
                        this.setState({
                          searchFlag:false,
                          searchVal:''
                        })
                        this.props.getData({
                          page: 1,
                          perpage: this.state.perpage,
                          keyword:''
                        })
                      }else{
                        message.destroy()
                        message.error('请输入搜索内容')
                      }
                      
                    }
                  })
                  
                }}
                style={{ width: 200,marginRight:10 }}
              />
                <Link to="/addteacher">
                  <Button type="primary"><Icon type="plus" />添加教师</Button></Link>
              </div>
            </div>
            <div className="user-content-bottom">
            {(typeof getuserteacher !== "string" && getuserteacher.length != 0)?
            <Fragment>
              <Table
                columns={this.columns()}
                dataSource={getuserteacher.teacherList}
                pagination={false}
                rowKey={record => record.teacherId}
                locale = {
                  {emptyText:'暂无数据'}
                }
                // loading = {this.state.loading}
              ></Table>
              <Pagination
                style={{ textAlign: "right", padding: "10px 0px" }}
                total={+getuserteacher.teacherNum}
                pageSize={this.state.perpage}
                defaultCurrent={1}
                onChange={this.handleTableChange} 
                current={this.state.page}/>
            </Fragment>:<Spin />}
              
            </div>
          </Content>
          <Modal
            title={this.state.title}
            width="360px"
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            cancelText="取消"
            okText="确定"
            cancelButtonProps
          >
            {this.state.content}
          </Modal>
        </Layout>)
  }
  // 跳转路由
  Jump(val) {
    this.props.history.push({
      pathname: '/teacherDetail/'+val.teacherId,
      state: val
    })
  }
  // 弹窗显示
  showModal = (e, val) => {
    let { content} = this.state
    this.setState({
      title: '提示'
    })
    content = <div style={{ textAlign: "center" }}>
      <h6 style={{ color: "#FF3B30", fontSize: 18 }}>确定要删除此教师吗？</h6>
      <dl style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}>
        <dt style={{ paddingRight: 15 }}>
          <img style={{ width: 64, height: 64, borderRadius: '50%' }} src={val.teacherAvatar} alt="" />
        </dt>
        <dd>
          <h3 style={{ fontSize: 16, color: "#333" }}>{val.teacherName}</h3>
          <p style={{ fontSize: 12, color: "#999" }}>{val.teacherAccount}</p>
        </dd>
      </dl>
    </div>


    this.setState({
      visible: true,
      content,
      teacherAccountid: val ? val.teacherAccount : ''
    });

  }
  // 弹窗确定按钮
  handleOk = (e) => {
    let { title, teacherAccountid ,page,perpage} = this.state
    // 请求停用接口
    if (title == '提示') {
      // this.props.deleteTeacher({
      //   teacherAccountid,
      //   page,
      //   perpage
      // })
      Http.post("/school/delete-teacher",{
          teacherAccount: teacherAccountid,
          page,
          perpage,
        }).then(data => {
        if (data.error_info.errno == 1) {
          this.props.getData({page,perpage})
          message.destroy()
          message.success('删除成功')
        } else {
          message.destroy();
          message.error(data.error_info.error)
        }

      })
    }
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
  // 分页器
  handleTableChange = (cur, pageSize) => {
    this.setState({
      page: cur,
      perpage: pageSize
    })
    this.props.getData({
      page: cur,
      perpage: pageSize,
      keyword:this.state.searchVal
    })
  }
  columns = () =>{
    return [{
      title: '头像',
      dataIndex: 'teacherAvatar',
      key: 'teacherAvatar',
      render: (text, record) => {
        let a = Random(record.teacherAccount)
        return <img src={text ? text : a} />
      },
      width: '10%'
    }, {
      title: '昵称',
      dataIndex: 'teacherName',
      key: 'teacherName',
      width: '10%',
      align:'center',
    }, {
      title: '账号',
      dataIndex: 'teacherAccount',
      key: 'teacherAccount',
      width: '20%',
      align:'center',
      render: (text, record) => (
        <span>
          <span>{record.teacherAccount}</span>
          <span style={{ color: 'red', paddingLeft: 10 }}>{record.isRegister == 0 ? '未注册' : ''}</span>
        </span>
      )
    }, 
    // {
    //   title: '地区',
    //   key: 'city',
    //   dataIndex: 'city',
    //   width: '12%'
    // }, 
    {
      title: '课程进度',
      key: 'courseProgress',
      dataIndex: 'courseProgress',
      width: '8%',
      align:'center',
    }, {
      title: '课节进度',
      key: 'classProgress',
      dataIndex: 'classProgress',
      width: '8%',
      align:'center',
    }, {
      title: '设备检测信息',
      key: '设备检测信息',
      width: '20%',
      align:'center',
      dataIndex: '设备检测信息',
      render: (text, record) => (
        <span>
          <Popover  content={
            <div className="user-popover">
              {
                record.microphone ?
                  <Fragment>
                    <p><span>检测时间</span><span>{record.microphone.checkTime}</span></p>
                    <p><span>检测结果</span><span>{record.microphone.checkReason}</span></p>
                    {/* <p><span>检测原因</span><span>{record.microphone.checkReason}</span></p>
                    <p><span>用户选择</span><span style={{color:record.microphone.userChoice == 1 ?'#41B315':'#FF3B30'}}>{record.microphone.userChoice == 1 ? '正常' : '异常'}</span></p>
                    <p><span>程序检测</span><span style={{color:record.microphone.programCheck == 1 ?'#41B315':'#FF3B30'}}>{record.microphone.programCheck == 1 ? '正常' : '异常'}</span></p> */}
                    {/* audioFileUrl */}
                    <p><span>使用设备</span><span>{record.microphone.useAudioDevice}</span></p>
                    <p><span>设备列表</span><span className='user-popover-audioDeviceList'>
                        {record.microphone.audioDeviceList.map((res,i)=>{
                          return <span key={i}>{res}</span>
                        })}
                      </span></p>
                  </Fragment>
                  : null
              }
            </div>
            } placement="bottom">
            <img src={require(`../../../assets/imgs/icons/${
              record.microphone ? 'icon_stautas_microphone_success.png' : 'icon_stautas_microphone_disable.png'
              }`)}
              style={{ margin: 5, width: 20, height: 20 }}
            /></Popover>
          <Popover content={
            <div className="user-popover">
              {
                record.camera ?
                  <Fragment>
                    <p><span>检测时间</span><span>{record.camera.checkTime}</span></p>
                    <p><span>检测结果</span><span 
                    // style={()=>{
                    //   // if(record.camera.checkReason==='自检完成'){
                    //   //  { color:'#41B315'}
                    //   // }else if(){

                    //   // }
                    // }}
                    >{record.camera.checkReason}</span></p>
                    {/* <p><span>检测原因</span><span>{record.camera.checkReason}</span></p>
                    <p><span>用户选择</span><span style={{color:record.camera.userChoice == 1 ?'#41B315':'#FF3B30'}}>{record.camera.userChoice == 1 ? '正常' : '异常'}</span></p>
                    <p><span>程序检测</span><span style={{color:record.camera.programCheck == 1 ?'#41B315':'#FF3B30'}}>{record.camera.programCheck == 1 ? '正常' : '异常'}</span></p>
                    <p><span>摄像头截图</span>{record.camera.screenshot && <img src={record.camera.screenshot} alt="" />}</p> */}
                    <p><span>使用设备</span><span>{record.camera.useMicDevice}</span></p>
                    <p><span>设备列表</span>
                    <span className='user-popover-audioDeviceList'>
                        {record.camera.micDeviceList.map((res,i)=>{
                          return <span key={i}>{res}</span>
                        })}
                    </span></p>
                  </Fragment>
                  : null
              }
            </div>
          } placement="bottom">
            <img src={require(`../../../assets/imgs/icons/${
              record.camera ? 'icon_stautas_camera_success.png' : 'icon_stautas_camera_disable.png'
              }`)}
              style={{ margin: 5, width: 20, height: 20 }} />
          </Popover>

          <Popover content={
            <div className="user-popover">
              {
                record.speaker ?
                  <Fragment>
                    <p><span>检测时间</span><span>{record.speaker.checkTime}</span></p>
                    <p><span>检测结果</span><span>{record.speaker.checkReason}</span></p>
                    {/* <p><span>检测原因</span><span>{record.speaker.checkReason}</span></p>
                    <p><span>用户选择</span><span style={{color:record.speaker.userChoice == 1?'#41B315':'#FF3B30'}}>{record.speaker.userChoice == 1 ? '正常' : '异常'}</span></p>
                    <p><span>程序检测</span><span style={{color:record.speaker.programCheck==1?'#41B315':'#FF3B30'}}>{record.speaker.programCheck == 1 ? '正常' : '异常'}</span></p> */}
                    <p><span>使用设备</span><span>{record.speaker.useSpeakerDevice}</span></p>
                    <p><span>设备列表</span>
                    <span className='user-popover-audioDeviceList'>
                        {record.speaker.speakerDeviceList.map((res,i)=>{
                          return <span key={i}>{res}</span>
                        })}
                      </span></p>
                  </Fragment>
                  : null
              }
            </div>
          } placement="bottom">
            <img src={require(`../../../assets/imgs/icons/${
              record.speaker ? 'icon_stautas_headset_success.png' : 'icon_stautas_headset_disable.png'
              }`)}
              style={{ margin: 5, width: 20, height: 20 }} />
          </Popover>
          <Popover content={
            <div className="user-popover">
              {
                record.network ?
                  <Fragment>
                    <p><span>操作系统</span><span>{record.network.operatingSystem}</span></p>
                    <p><span>服务器</span><span>{record.network.server}</span></p>
                    <p><span>浏览器</span><span>{record.network.browser}</span></p>
                    <p><span>内核版本</span><span style={{color:record.network.kernelVersion.indexOf("Chrome") !== -1 ?'#41B315':'#FF3B30'}}>{record.network.kernelVersion}</span></p>
                    <p><span>录屏插件</span><span style={{color:record.network.screenPlugin == 1 ?'#41B315':'#FF3B30'}}>{record.network.screenPlugin == 1 ? '是' : '否'}</span></p>
                    <p><span>IP地址</span><span>{record.network.clientIp}</span></p>
                    {/* <p><span>MAC地址</span><span>{record.network.macAddress}</span></p> */}
                    <p><span>网络延时</span><span>{record.network.networkDelay}</span></p>
                    <p><span>丢包率</span><span>{record.network.useAudioDevice}</span></p>
                    <p><span>版本</span><span>{record.network.clientVersion}</span></p>
                  </Fragment>
                  : null
              }
            </div>
          } placement="bottom">
            {
              record.network ?
                <img src={require(`../../../assets/imgs/icons/${
                  record.network.kernelVersion.indexOf("Chrome") !== -1 ? 'icon_stautas_network_success.png' : 'icon_stautas_network_danger.png'
                  }`)}
                  style={{ margin: 5, width: 20, height: 20 }} />
                : <img src={require(`../../../assets/imgs/icons/${
                  record.network ? 'icon_stautas_network_success.png' : 'icon_stautas_network_disable.png'
                  }`)}
                  style={{ margin: 5, width: 20, height: 20 }} />
            }
          </Popover>
        </span>
      ),
    }, {
      title: '操作',
      key: 'Action',
      dataIndex: 'Action',
      width: '12%',
      align:'center',
      render: (text, record) => (

        <span className='user-edit'>
          <span>
            <img onClick={() => this.Jump(record)} className='user-bj' src={require(`../../../assets/imgs/icons/icon_info_normal.png`)} alt="" />
            {/* <img className='user-edit user-bj' onClick={(e)=>this.showModal(e,record)} src={require(`../../../assets/imgs/icons/icon_edit_normal.png`)} alt=""/> */}
            <img className='minus-circle-o user-bj' onClick={(e) => this.showModal(e, record)} src={require(`../../../assets/imgs/icons/icon_delete_normal.png`)} alt="" />
          </span>
        </span>
      ),
    }]
  }
}

function mapDispatchToProps(dispatch) {
  return {
    // 获取初始数据
    getData(val) {
      let { page, perpage,keyword } = val
      dispatch({
        type: GET_DATA_START
      })
      Http.post("/school/get-teacher-list",{
          page,
          perpage,
          keyword
        }).then(data => {
        if (data.error_info.errno == 1) {
          dispatch({
            type: GET_TEACHERDATA_SUCCESS,
            payload: data.data
          })
        }
      })
    },
    // 删除教师
  //   deleteTeacher(val){
  //     let {
  //       teacherAccountid,
  //       page,
  //       perpage
  //     } = val
  //     Http.post("/school/delete-teacher",{
  //         teacherAccount: teacherAccountid,
  //         page,
  //         perpage
  //       }).then(data => {
  //       // console.log(data)
  //       if (data.error_info.errno == 1) {
  //         dispatch({
  //           type: GET_DELETE_TEACHER,
  //           payload: data.data
  //         })
  //       }
  //     })
  //   }

  }
}
function mapStateToprops(state) {
  return {
    getuserteacher: state.userteacher,
    getcookies: state.getcookie
  }
}
export default connect(mapStateToprops, mapDispatchToProps)(index)