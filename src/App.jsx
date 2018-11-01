import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
// 路由配置
import {routes} from './router/config'
import RouterView from '@/router/routers';


class App extends React.PureComponent {
    render() {
        return (
            <Router>
                <RouterView routes={routes}/>
            </Router>
        )
    }
}

export default App;