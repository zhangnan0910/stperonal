import React from 'react';
import {Layout, Menu} from 'antd';

const {Header} = Layout;

class App extends React.PureComponent {
    render() {
        return (
            <Header className="header" style={{backgroundColor: "#f40"}}>
                <h1 style={{color: "#FFF"}}>3T Class</h1>
            </Header>
        )
    }
}

export default App;