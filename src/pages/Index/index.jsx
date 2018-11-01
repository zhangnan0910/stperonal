import React, {Component} from 'react'
import Aside from '@/components/aside'
import RouterView from '@/router/routers';
import {Layout, Icon, Avatar, Popover, Tabs, Menu} from 'antd';
import "./style.less";
import {Link} from "react-router-dom";
import {getCookie, delCookie} from '@/utils/cookies'
import Random from "@/utils/random"

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;
const TabPane = Tabs.TabPane;
this.newTabIndex = 0;
const getcookies = JSON.parse(unescape(unescape(getCookie("login-token"))))
const panes = [
    {title: 'Tab 1', content: 'Content of Tab Pane 1', key: '1'},
    {title: 'Tab 2', content: 'Content of Tab Pane 2', key: '2'},
];
export default class index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activeKey: panes[0].key,
            panes,
            collapsed: false,
        }
    }

    onChange = (activeKey) => {
        this.setState({activeKey});
    }

    onEdit = (targetKey, action) => {
        this[action](targetKey);
    }

    add = () => {
        const panes = this.state.panes;
        const activeKey = `newTab${this.newTabIndex++}`;
        panes.push({title: 'New Tab', content: 'New Tab Pane', key: activeKey});
        this.setState({panes, activeKey});
    }

    remove = (targetKey) => {
        let activeKey = this.state.activeKey;
        let lastIndex;
        this.state.panes.forEach((pane, i) => {
            if (pane.key === targetKey) {
                lastIndex = i - 1;
            }
        });
        const panes = this.state.panes.filter(pane => pane.key !== targetKey);
        if (lastIndex >= 0 && activeKey === targetKey) {
            activeKey = panes[lastIndex].key;
        }
        this.setState({panes, activeKey});
    }


    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }


    render() {
        const getcookies = JSON.parse(unescape(unescape(getCookie("login-token"))))
        let a = getcookies.userInfo.avatar?getcookies.userInfo.avatar:Random(getcookies.userInfo.userId)
        const content = (
            <div>
                <p style={{paddingTop: 15}} onClick={() => {
                    delCookie("login-token")
                }}><Link to="/login"><Icon type="logout"/>&nbsp;&nbsp;退出账号</Link></p>
            </div>
        );
        return (
            <Layout className='Layout-bg'>
                <Header className="header">
                    <div className="box">
                        <div className="logo"></div>
                    </div>
                    <div className='own'>
                        <Icon
                            style={{color: "#0af", cursor: "pointer"}}
                            className="trigger"
                            type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                            onClick={this.toggle}
                        />
                        <div className='commons'>
                            <img style={{width: 40, height: 40}}
                                 src={getcookies.userInfo.avatar?getcookies.userInfo.avatar:a} alt=""/>
                            <span>Hi,&nbsp;{getcookies.userInfo.nickName}</span>
                            <Popover trigger="click" content={content}>
                                <Icon type="down" style={{cursor: "pointer"}}/>
                            </Popover>
                        </div>
                    </div>
                </Header>
                <Layout>
                    <Sider
                        trigger={null}
                        collapsible
                        collapsed={this.state.collapsed}
                    >
                        <div className="logo"/>
                        <Menu
                            defaultSelectedKeys={['1']}
                            mode="inline"
                            theme="dark"
                        >
                            <Menu.Item key="3">
                                <Link to='/home'>
                                <span style={{marginLeft: 10, display: 'block'}}
                                ><img
                                    src={require('@/assets/imgs/icons/icon_main_home.png')}
                                    alt="loading..."/>
                                    <span className='treeShow'>机构首页</span>
                                </span></Link>
                            </Menu.Item>
                            <SubMenu key="project"
                                     title={<span style={{marginLeft: 10}}>
                                    <img src={require('@/assets/imgs/icons/icon_sidebar_class_normal.png')}
                                         alt="loading..."/>
                                    <span className='treeShow'>教学管理</span>
                                </span>}>
                                <Menu.Item key="4"><Link to='/class' className='treeShow'>课程管理</Link></Menu.Item>
                            </SubMenu>
                            <SubMenu key="6"
                                     title={<span style={{marginLeft: 10}}>
                                    <img
                                        src={require('@/assets/imgs/icons/icon_sidebar_people_normal.png')}
                                        alt="loading..."/>
                                    <span className='treeShow'>用户管理</span>
                                </span>}>
                                <Menu.Item key="7"><Link to='/teacher'
                                                         className='treeShow'>教师管理</Link></Menu.Item>
                                <Menu.Item key="8"><Link to='/student'
                                                         className='treeShow'>学生管理</Link></Menu.Item>
                                {/* <Menu.Item key="9"><Link to='/grouping'
                                                         className='treeShow'>分组管理</Link></Menu.Item> */}
                            </SubMenu>
                            <SubMenu key="10" title={<span style={{marginLeft: 10}}>
                                <img
                                    src={require('@/assets/imgs/icons/icon_sidebar_Academic_affairs_normal.png')}
                                    alt="loading..."/>
                                <span className='treeShow'>教务管理</span>
                            </span>}>
                                <Menu.Item key="11"><Link to='/monitor'
                                                          className='treeShow'>监课</Link></Menu.Item>
                            </SubMenu>
                            <SubMenu key="12" title={<span style={{marginLeft: 10}}>
                                <img
                                    src={require('@/assets/imgs/icons/icon_sidebar_mechanism_normal.png')}
                                    alt="loading..."/>
                                <span className='treeShow'>机构管理</span>
                            </span>}>
                                <Menu.Item key="13"><Link to='/netdisk'
                                                          className='treeShow'>云盘管理</Link></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Sider>
                    <Content>
                        <RouterView routes={this.props.routes}/>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}
