'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

const Teste = props => {
    return <h1>Teste</h1>;
};

const imports = {
    Teste,
};

const store = require('store');

import {
    Card,
    Button,
    Input,
    Table,
    Form,
    Row,
    Col,
    Layout,
    Drawer,
    Menu,
    message,
    Modal,
    Spin,
    Icon,
    Tooltip,
} from 'antd';

const SubMenu = Menu.SubMenu;

message.config({
    //top: 85,
    //duration: 2,
    //maxCount: 3,
});

import { Provider, observer, inject } from 'mobx-react';
import { observable, action, toJS, autorun, extendObservable } from 'mobx';

import {
    BrowserRouter as Router,
    //HashRouter as Router,
    //Router,
    Route,
    Link,
    Redirect,
    Switch,
    withRouter,
} from 'react-router-dom';

import _ from 'lodash';

import { ApolloLink } from 'apollo-link';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink, HttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import { setContext } from 'apollo-link-context';

import gql from 'graphql-tag';

//import history from './history';

const client = new ApolloClient({
    //link: createHttpLink({ uri: '/graphql' }),
    link: ApolloLink.from([new HttpLink({ uri: '/graphql' })]),
    cache: new InMemoryCache(),
    defaultOptions: {
        query: {
            fetchPolicy: 'no-cache',
        },
    },
});

const pageStore = {};

@observer
class App extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <>
                <Router>
                    <Dashboard></Dashboard>
                </Router>
            </>
        );
    }
}

export default App;

@observer
class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {}

    render() {
        return (
            <>
                <Switch>
                    <Route
                        path="/"
                        exact
                        component={props => (
                            <Card
                                style={{
                                    maxWidth: '500px',
                                    margin: '10px auto',
                                }}
                            >
                                <h1>Home</h1>
                            </Card>
                        )}
                    />
                    <Route
                        path="/teste"
                        component={props => (
                            <Card
                                style={{
                                    maxWidth: '500px',
                                    margin: '10px auto',
                                }}
                            >
                                <h1>Teste</h1>
                            </Card>
                        )}
                    />
                    <Route path="/404" component={props => <h1>404</h1>} />
                    <Route component={() => <Redirect to="/404" />} />
                </Switch>
            </>
        );
    }
}
