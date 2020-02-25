'use strict';

//import { hot } from 'react-hot-loader/root';

import React from 'react';
import ReactDOM from 'react-dom';

import 'antd/dist/antd.less';

import App from './App';

const root = document.getElementById('app');

import { ConfigProvider } from 'antd';
import pt_BR from 'antd/lib/locale-provider/pt_BR';

//hot(
ReactDOM.render(
    <ConfigProvider locale={pt_BR}>
        <App />
    </ConfigProvider>,
    root
);
//);
