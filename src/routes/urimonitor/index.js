import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Button, Form, Table, Modal } from 'antd';


class Urimonitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        this.timer = setInterval(function () {
            this.props.dispatch({
                type: 'urimonitor/getTableList',
            })
        }.bind(this), 5000)
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    render() {
        const columns = [{
            title: 'URI',
            dataIndex: 'URI',
            key: 'URI',
            width: '20%'
        }, {
            title: '请求次数',
            dataIndex: 'RequestCount',
            key: 'RequestCount',
            sorter: (a, b) => a.RequestCount - b.RequestCount,
        }, {
            title: '请求时间（和）',
            dataIndex: 'RequestTimeMillis',
            key: 'RequestTimeMillis',
            sorter: (a, b) => a.RequestTimeMillis - b.RequestTimeMillis,
        }, {
            title: '请求最慢（单次）',
            dataIndex: 'RequestTimeMillisMax',
            key: 'RequestTimeMillisMax',
            sorter: (a, b) => a.RequestTimeMillisMax - b.RequestTimeMillisMax,
        }, {
            title: 'Jdbc执行数',
            dataIndex: 'JdbcExecuteCount',
            key: 'JdbcExecuteCount',
            sorter: (a, b) => a.JdbcExecuteCount - b.JdbcExecuteCount,
        }, {
            title: 'Jdbc时间',
            dataIndex: 'JdbcExecuteTimeMillis',
            key: 'JdbcExecuteTimeMillis',
            sorter: (a, b) => a.JdbcExecuteTimeMillis - b.JdbcExecuteTimeMillis,
        }, {
            title: '读取行数',
            dataIndex: 'JdbcFetchRowCount',
            key: 'JdbcFetchRowCount',
        }, {
            title: '更新行数',
            dataIndex: 'JdbcUpdateCount',
            key: 'JdbcUpdateCount',
        }];
        return (
            <div className={styles.divbackground}>
                <Table
                    rowKey={record => record.URI}
                    columns={columns}
                    dataSource={this.props.urimonitor.list}
                    pagination={false}
                    bordered
                />
            </div>
        )
    }
}

Urimonitor.propTypes = {
    loading: PropTypes.object,
};

export default connect(({ urimonitor, loading }) => ({ urimonitor, loading }))(Form.create()(Urimonitor))
