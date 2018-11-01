import React, { Component } from 'react'
import { Button ,Tooltip,message} from 'antd';
import Http from '@/utils/http'
import moment from "moment";
// this.props.data
export default class ChatRoom extends Component {
  constructor(){
    super()
    this.tiemr = null
    this.state = {
      helpChats:[],
      infoMag:{},
      shouldScroll : true,
      newChat : false,
    }
  }
  componentDidMount(){
    // this.tiemr = setInterval(()=>{
    //   this.getData()
    // },1000)
    this.getData()
  }
  render() {
    let {infoMag,helpChats} = this.state
    let {userId} = this.props
    let status = this.courseStatus(infoMag.status);
    
    return (
      <div className='MonitorLesson-model-content'>
          <div className='MonitorLesson-model-content-title'>
              <dl>
                <dt><img src="https://userservice.oss-cn-beijing.aliyuncs.com/avatar/avator_1.png" alt=""/></dt>
                <dd>
                  <Tooltip placement="topLeft" title={infoMag.class_name}>
                    <h3>{infoMag.class_name}</h3>
                  </Tooltip>
                  <Tooltip placement="topLeft" title={infoMag.teacher_name}>
                    <p>{infoMag.teacher_name}</p>
                  </Tooltip>
                  <Tooltip placement="topLeft" title={`手机 ：${infoMag.teacher_account}`}>
                    <p>手机 ：{infoMag.teacher_account}</p>
                  </Tooltip>
                </dd>
                <Button type="primary" 
                  className='MonitorLesson-model-content-title-button'
                >{status}</Button>
              </dl>
          </div>
          <ul className='help-list ximiBlock' ref={node => this.chatContainer = node}>
            {
              helpChats.length > 0 ?
              helpChats.map(item=>{
                const { stateShow, stateText, stateClassName } = getState(item,userId===item.userId )
                return (
                  <li key={item.tmpId || item.id} className='help-list_item'>
                      <div className='help-list_item-time'>{moment(moment.unix(item.created)).format('YYYY-MM-DD HH:mm:ss')}</div>
                      <div className={`help-list_item-nickname ${stateClassName}` }>{userId===item.userId ? '我' : '教务人员'}:</div>
                      {stateShow && <div className={'help-list_item-state'} 
                         onClick={() => this.handleReSubmit(item)}
                         >{stateText}</div>}
                      <div className={`help-list_item-content level-${item.level}`}>{item.describe}</div>
                  </li>
              );
              }):
              <div className='help-list-none'>
                  <img src='/static/imgs/icons/ic_question_48.png' alt='无数据' />
                  <div>你还没有任何求助</div>
              </div>
            }
          </ul>
      </div>
    )
  }
  //  获取信息列表
  getData = () =>{
    let {data} = this.props
      Http.post('/course/seek-list',{
        courseId:data.course_id,
        classId:data.class_id,
      }).then(res=>{
        if(res.error_info.errno===1){
          this.setState({
            helpChats:res.data.list,
            infoMag:res.data.class
          })
        }else if(res.error_info.errno===1 && res.error_info.errno===6){
          message.destroy()
          message.error(res.error_info.error)
        }
      }).catch(err=>{})
  }

  componentWillUpdate(nextProps, nextState) {
    const container = this.chatContainer;
    // 判断是否需要自动滚动聊天列表
    if (nextProps.show && !this.props.show) {
        this.state.shouldScroll = true;
    } else {
        this.state.shouldScroll = container.scrollTop + container.offsetHeight >= container.scrollHeight - 1;
    }
    this.state.shouldScroll = container.scrollTop + container.offsetHeight >= container.scrollHeight - 1;
    if (nextProps.helpChats.length > this.props.helpChats.length && !this.state.shouldScroll) {
        this.newChat = true;
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (!prevProps.show && this.props.show) {
        // Modal 组件内的 dom 需要在 componentDidMount 生命周期内移步获取
        setTimeout(() => {
            this.chatContainer.scrollTop = this.chatContainer.scrollHeight + 10;
        }, 10);
    } else if (this.shouldScroll) {
        // 新聊天渲染后自动滚动
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight + 10;
        this.newChat = false;
    }
  }
  handleReSubmit = (chat) => {
    console.log(chat.state)
    if (chat.state === '-2') {
        // this.props.updateHelpChat({ tmpId: chat.tmpId, state: '-1' });
        // this.fetchForHelp(chat);
    }
}
  // 课程状态
  courseStatus = (val) =>{
    switch(val){
      case 0:
          return '未开始'
          break;
      case 1:
          return '正在进行'
          break;
      case 2:
          return '已完成'
          break;
      case 3:
          return '预课中'
          break;
      default:
          return '预课中'
          break;
    }
  }

}
function getState(chat,mine) {
  //mine 判断是否是自己
  if (!mine) {
      return {
          stateText: '',
          stateClassName: ''
      };
  }
  let stateText = '';
  let stateClassName = '';
  switch (chat.state) {
      case '-2':
          stateText = '错';
          stateClassName = 'help-list_item-state--error';
          break;
      case '-1':
          stateText = '中';
          stateClassName = 'help-list_item-state--loading';
          break;
      case '0':
          stateText = '未读';
          stateClassName = 'help-list_item-state--unread';
          break;
      case '1':
          stateText = '已读';
          stateClassName = 'help-list_item-state--read';
          break;
      default:
          break;
  }
  return {
      stateShow: true,
      stateText,
      stateClassName
  };
}