import React, {Component} from "react";
import {Link} from "react-router-dom";
import {Layout, Menu, Breadcrumb, Icon} from 'antd';

const {Header, Content, Footer, Sider} = Layout;
const SubMenu = Menu.SubMenu;

class Aside extends Component {
    constructor() {
        super()
        this.state = {
            collapsed: false,
            flag: false
        }
    }

    toggleCollapsed() {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    }

    toggleClass() {
        this.setState({
            flag: !this.state.flag
        });
    }

    onCollapse = (collapsed) => {
        // console.log(collapsed);
        this.setState({collapsed});
    }

    render() {
        //console.log(this.state.flag)
        return (
            <div>
                <Sider collapsible
                       collapsed={this.state.collapsed}
                       onCollapse={this.onCollapse}
                       theme="dark"
                       style={{width: 160, minHeight: "100%", backgroundColor: "#f0f2f5"}}
                >
                    <Menu
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        theme="dark"
                        // inlineCollapsed={this.state.collapsed}
                    >

                        <Menu.Item key="3">
                            <Icon type="home"/>
                            <span><Link to='/home' style={{color: "#eee"}}>机构首页</Link></span>
                        </Menu.Item>
                        <SubMenu key="project" title={<span>
                                                        <Icon type="book"/>
                                                        <span>课程管理</span>
                                                    </span>}>
                            <Menu.Item key="4"><Link to='/class'>课程管理</Link></Menu.Item>
                            <Menu.Item key="5"><Link to='/lesson'>课节管理</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="6" title={<span>
                                                    <Icon type="team"/>
                                                    <span>用户管理</span>
                                            </span>}>
                            <Menu.Item key="7"><Link to='/teacher'>教师管理</Link></Menu.Item>
                            <Menu.Item key="8"><Link to='/student'>学生管理</Link></Menu.Item>
                            <Menu.Item key="9"><Link to='/grouping'>分组管理</Link></Menu.Item>
                        </SubMenu>
                        <SubMenu key="10" title={<span>
                                                    <Icon type="notification"/>
                                                    <span>机构管理</span>
                                            </span>}>
                            <Menu.Item key="11"><Link to='/institution'>云盘管理</Link></Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
            </div>
        )
    }
}

export default Aside