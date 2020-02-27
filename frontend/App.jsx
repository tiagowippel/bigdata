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

import WordCloud from 'react-d3-cloud';

// const data = [
//     { text: 'Hey', value: 1000 },
//     { text: 'lol', value: 200 },
//     { text: 'first impression', value: 800 },
//     { text: 'very cool', value: 1000000 },
//     { text: 'duck', value: 10 },
// ];

const fontSizeMapper = word => Math.log(word.value * 10) * 5;
const rotate = word => word.value % 360;

class Dashboard extends React.Component {
    constructor(props) {
        super(props);
    }

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
                        path="/nuvemPalavras"
                        component={props => <NuvemPalavras />}
                    />
                    <Route
                        path="/buscaPalavras"
                        component={props => <BuscaPalavras />}
                    />
                    <Route path="/404" component={props => <h1>404</h1>} />
                    <Route component={() => <Redirect to="/404" />} />
                </Switch>
            </>
        );
    }
}

class NuvemPalavras extends React.Component {
    data = [];

    componentDidMount() {
        client
            .query({
                query: gql`
                    query {
                        getWords
                    }
                `,
            })
            .then(res => {
                const words = res.data.getWords;

                console.log(words);

                this.data = words.map((item, k) => ({
                    text: item.palavra,
                    value: item.qtdOcorrencias * (k < 5 ? 100000 : 1),
                }));

                this.forceUpdate();
            });
    }

    render() {
        return (
            <div>
                <WordCloud
                    data={this.data}
                    fontSizeMapper={fontSizeMapper}
                    rotate={rotate}
                />
            </div>
        );
    }
}

@observer
class BuscaPalavras extends React.Component {
    @observable value = '';
    @observable lista = [];

    componentDidMount() {}

    render() {
        return (
            <>
                <div
                    style={{
                        display: 'flex',
                    }}
                >
                    <Input
                        placeholder="Palavra"
                        value={this.value}
                        onChange={e => {
                            this.value = e.target.value;
                        }}
                    ></Input>
                    <Button
                        type="primary"
                        onClick={e => {
                            client
                                .query({
                                    query: gql`
                                        query($options: JSON!) {
                                            getLivros(options: $options)
                                        }
                                    `,
                                    variables: {
                                        options: {
                                            palavra: this.value,
                                        },
                                    },
                                })
                                .then(res => {
                                    const data = res.data.getLivros;

                                    console.log(data);
                                });
                        }}
                    >
                        Enviar
                    </Button>
                </div>
                <div>
                    <Table
                        columns={[
                            {
                                title: 'Livro',
                                dataIndex: 'livro',
                            },
                            {
                                title: 'Qtd. ocorrencias da palavra',
                                dataIndex: 'qtdOcorrencias',
                            },
                        ]}
                        dataSource={this.lista}
                    ></Table>
                </div>
            </>
        );
    }
}
