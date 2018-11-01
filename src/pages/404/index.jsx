import React from 'react';
import {Button} from 'antd';
import {Link} from 'react-router-dom'
import './style.scss';
export default class extends React.PureComponent{
  render(){
    return (
      <div className="notfound">
         <div className="m-container">
          <div className="m-left">
            <img className="u-image" src="https://gw.alipayobjects.com/zos/rmsportal/KpnpchXsobRgLElEozzI.svg"/>
          </div>
          <div className="m-right">
            <h1 className="u-status">404</h1>
            <div className="u-description">抱歉，你访问的页面不存在</div>
            <div><Link to='/home'><Button type="primary">返回首页</Button></Link></div>
          </div>
        </div>
      </div>
    )
  }
}