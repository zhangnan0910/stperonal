import React, { Component, Fragment } from 'react'
import {
  Table,
  Breadcrumb,
  Icon,
  Button,
  Layout,
  Popover,
  Pagination,
  Modal,
  message,
  Input
} from 'antd';
import {getcookie} from '@/common/js/index'
import { Link } from "react-router-dom"
import NewFroms from "@/components/NewFroms"
const { Content } = Layout
import { getCookie } from '@/utils/cookies'
import Random from "@/utils/random"
import "./student.less"
import Http from "@/utils/http"
const Search = Input.Search;
export default class index extends Component {
  constructor() {
    super()
    this.state = {
      visible: false,
      content: null,
      studentAccountid: null,
      page: 1,
      perpage: 10,
      searchVal:'',
      title: '',
      total:20,
      SearchFlag:true,
      loading:false,
      getcookie: JSON.parse(unescape(unescape(getCookie("login-token")))),
      data: [],
    }
  }
  componentDidMount() {
    this.getData()
  }
  render() {
    const data = this.state.data.studentList && this.state.data.studentList.map(res => {
      return res
    });
      return (
        <Layout className="commons">
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              用户管理
            </Breadcrumb.Item>
            <Breadcrumb.Item>学生管理</Breadcrumb.Item>
          </Breadcrumb>
          <Content className="user-content">
            <div>
              <span >学生管理</span>
              <div style={{display:'flex'}}>
              <Search
                placeholder="请输入手机号或姓名"
                onSearch={value => {
                  this.setState({
                    page:1
                  },()=>{
                    if(value!==''){
                    this.setState({
                      SearchFlag:true,
                      searchVal:value
                    })
                    this.getData(
                      this.state.page,
                      value
                    )
                  }else{
                    if(this.state.SearchFlag){
                      this.setState({
                        SearchFlag:false,
                        searchVal:''
                      })
                      this.getData(
                        1,
                        value
                      )
                    }else{
                      message.destroy()
                      message.error('请输入搜索内容')
                    }
                  }
                  })
                }}
                style={{width: 200,marginRight:10 }}
              />
              <Link to="/addstudent"><Button type="primary"><Icon type="plus" />添加学生</Button></Link>
              </div>
            </div>
            <div className="user-content-bottom">
              <Table
                columns={this.columns()}
                dataSource={data}
                pagination={false}
                rowKey={record => record.studentId}
                locale = {
                  {emptyText:'暂无数据'}
                }
                loading = {this.state.loading}
              ></Table>
              <Pagination
                style={{ textAlign: "right", padding: "10px 0px" }}
                defaultCurrent={1}
                pageSize={this.state.perpage}
                total={+this.state.total}
                current={this.state.page}
                onChange = {(page)=>{
                  this.getData(page,this.state.searchVal)
                }}
                />
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
        </Layout>
      )

  }
  getData(page, searchVal) {
    // this.setState({loading:true})
    Http.post("/school/get-student-list",{
      page:page?page:this.state.page,
      perpage:this.state.perpage,
      keyword:searchVal
    }).then(data => {
      if (data.error_info.errno == 1) {
        this.setState({
          data: data.data,
          loading:false,
          total:data.data.studentNum,
          page:page?page:this.state.page
        })
      }else{
        message.destroy()
        message.error(data.error_info.error)
      }
      
    }).catch(e => {
      e?this.setState({loading:false}):null
    })
  }
  // 跳转路由
  Jump(val) {
    this.props.history.push({
      pathname: '/teacherDetail/'+val.studentId,
      state: val
    })
  }
  handleOk = (e) => {
    // 删除学生
    Http.post("/school/delete-student",{
      studentAccount: this.state.studentAccountid
    }).then(data => {
      if (data.error_info.errno == 1) {
        message.destroy();
        message.success('删除成功')
        this.getData()
      } else {
        message.destroy();
        message.error(data.error_info.error)
      }
    }).catch(e => {
    })
    this.setState({
      visible: false,
    });
  }
  handleCancel = (e) => {
    this.setState({
      visible: false,
    });
  }
  showModal = (e, val) => {
    let { content } = this.state
    this.setState({
      title: '提示',
      studentAccountid: val ? val.studentAccount : null
    })
    content = <div style={{ textAlign: "center" }}>
      <h6 style={{ color: "#FF3B30", fontSize: 18 }}>确定要删除此学生吗？</h6>
      <dl style={{ display: "flex", justifyContent: "center", paddingTop: 20 }}>
        <dt style={{ paddingRight: 15 }}>
          <img style={{ width: 64, height: 64, borderRadius: '50%' }} src={val.studentAvatar} alt="" />
        </dt>
        <dd>
          <h3 style={{ fontSize: 16, color: "#333" }}>{val.studentName}</h3>
          <p style={{ fontSize: 12, color: "#999" }}>{val.studentAccount}</p>
        </dd>
      </dl>
    </div>
    this.setState({
      visible: true,
      content
    });

  }
  columns = () =>{
    return [{
      title: '头像',
      dataIndex: 'studentAvatar',
      key: 'studentAvatar',
      width: '10%',
      render: (text, record) => {
        let a = Random(record.studentAccount)
        return <img src={text ? text : a} />
      },
    }, {
      title: '昵称',
      dataIndex: 'studentName',
      key: 'studentName',
      width: '10%',
      align:'center',
    }, {
      title: '账号',
      dataIndex: 'studentAccount',
      key: 'studentAccount',
      width: '20%',
      align:'center',
      render: (text, record) => (
        <span>
          <span>{record.studentAccount}</span>
          <span style={{ color: 'red', paddingLeft: 10 }}>{record.isRegister == 0 ? '未注册' : ''}</span>
        </span>
      )
    }, 
    // {
    //   title: '地区',
    //   key: 'city',
    //   width: '12%',
    //   dataIndex: 'city'
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
      render: (text, record) => (
        <span>
          <Popover  content={
            <div className="user-popover">
              {
                
                record.microphone ?
                  <Fragment>
                    <p><span>检测时间</span><span>{record.microphone.checkTime}</span></p>
                    <p><span>检测原因</span><span>{record.microphone.checkReason}</span></p>
                    <p><span>用户选择</span><span style={{color:record.microphone.userChoice == 1 ?'#41B315':'#FF3B30'}}>{record.microphone.userChoice == 1 ? '正常' : '异常'}</span></p>
                    <p><span>程序检测</span><span style={{color:record.microphone.programCheck == 1 ?'#41B315':'#FF3B30'}}>{record.microphone.programCheck == 1 ? '正常' : '异常'}</span></p>
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
                    <p><span>检测原因</span><span>{record.camera.checkReason}</span></p>
                    <p><span>用户选择</span><span style={{color:record.camera.userChoice == 1 ?'#41B315':'#FF3B30'}}>{record.camera.userChoice == 1 ? '正常' : '异常'}</span></p>
                    <p><span>程序检测</span><span style={{color:record.camera.programCheck == 1 ?'#41B315':'#FF3B30'}}>{record.camera.programCheck == 1 ? '正常' : '异常'}</span></p>
                    {/* audioFileUrl */}
                    <p><span>摄像头截图</span>{record.camera.screenshot && <img src={record.camera.screenshot} alt="" />}</p>
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
                    <p><span>检测原因</span><span>{record.speaker.checkReason}</span></p>
                    <p><span>用户选择</span><span style={{color:record.speaker.userChoice == 1?'#41B315':'#FF3B30'}}>{record.speaker.userChoice == 1 ? '正常' : '异常'}</span></p>
                    <p><span>程序检测</span><span style={{color:record.speaker.programCheck==1?'#41B315':'#FF3B30'}}>{record.speaker.programCheck == 1 ? '正常' : '异常'}</span></p>
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
                    <p><span>MAC地址</span><span>{record.network.macAddress}</span></p>
                    <p><span>网络延时</span><span>{record.network.networkDelay}</span></p>
                    <p><span>丢包率</span><span>{record.network.useAudioDevice}</span></p>
                    <p><span>客户端版本</span><span>{record.network.clientVersion}</span></p>
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
      width: '12%',
      align:'center',
      render: (text, record) => (
        <span className='user-edit'>
          <img onClick={() => this.Jump(record)} className='user-bj' src={require(`../../../assets/imgs/icons/icon_info_normal.png`)} alt="" />
          {/* <img className='user-edit user-bj' onClick={this.showModal} src={require(`../../../assets/imgs/icons/icon_edit_normal.png`)} alt=""/> */}
          <img className='minus-circle-o user-bj' onClick={(e) => this.showModal(e, record)} src={require(`../../../assets/imgs/icons/icon_delete_normal.png`)} alt="" />
        </span>
      ),
    }]
  }

}
