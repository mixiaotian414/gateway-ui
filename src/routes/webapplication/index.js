import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Form, Table } from 'antd';


class Webapplication extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const columns = [{
            dataIndex: 'name',
            key: 'name',
            width: '30%'
        }, {
            dataIndex: 'value',
            key: 'value',
            width: '70%',
            className: styles.left
        }];
        const dataSource = [{
            key: '1',
            name: 'ContextPath',
            value: this.props.webapplication.list.ContextPath,
        }, {
            key: '2',
            name: '执行中',
            value: this.props.webapplication.list.RunningCount,
        }, {
            key: '3',
            name: '最大并发',
            value: this.props.webapplication.list.ConcurrentMax,
        }, {
            key: '4',
            name: '请求次数',
            value: this.props.webapplication.list.RequestCount,
        }, {
            key: '5',
            name: 'SessionCount',
            value: this.props.webapplication.list.SessionCount,
        }, {
            key: '6',
            name: '事务提交数',
            value: this.props.webapplication.list.JdbcCommitCount,
        }, {
            key: '7',
            name: '事务回滚数',
            value: this.props.webapplication.list.JdbcRollbackCount,
        }, {
            key: '8',
            name: 'Jdbc执行数',
            value: this.props.webapplication.list.JdbcExecuteCount,
        }, {
            key: '9',
            name: 'Jdbc时间',
            value: this.props.webapplication.list.JdbcExecuteTimeMillis,
        }, {
            key: '10',
            name: '读取行数',
            value: this.props.webapplication.list.JdbcFetchRowCount,
        }, {
            key: '11',
            name: '更新行数',
            value: this.props.webapplication.list.JdbcUpdateCount,
        }, {
            key: '12',
            name: 'OSMacOSXCount',
            value: this.props.webapplication.list.OSMacOSXCount,
        }, {
            key: '13',
            name: 'OSWindowsCount',
            value: this.props.webapplication.list.OSWindowsCount,
        },];
        return (
            <div className={styles.divbackground}>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    showHeader={false}
                    pagination={false}
                    bordered
                />
            </div>
        )
    }
}

Webapplication.propTypes = {
    loading: PropTypes.object,
};

export default connect(({ webapplication, loading }) => ({ webapplication, loading }))(Form.create()(Webapplication))
