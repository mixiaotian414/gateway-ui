import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Form, Table } from 'antd';


class Datasource extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        const columns = [{
            dataIndex: 'name',
            key: 'name',
            width: '30%',
        }, {
            dataIndex: 'value',
            key: 'value',
            width: '40%'
        }, {
            dataIndex: 'desc',
            key: 'desc',
            width: '30%'
        }];
        const dataSource = [{
            key: '1',
            name: '用户名',
            value: this.props.datasource.list.UserName,
            desc: '指定建立连接时使用的用户名'
        }, {
            key: '2',
            name: '连接地址',
            value: this.props.datasource.list.URL,
            desc: 'jdbc连接字符串'
        }, {
            key: '3',
            name: '数据库类型',
            value: this.props.datasource.list.DbType,
            desc: '数据库类型'
        }, {
            key: '4',
            name: '驱动类名',
            value: this.props.datasource.list.DriverClassName,
            desc: 'jdbc驱动的类名'
        }, {
            key: '5',
            name: '连接有效性检查类名',
            value: this.props.datasource.list.ValidConnectionCheckerClassName,
            desc: '连接有效性检查类名'
        }, {
            key: '6',
            name: '获取连接时检测',
            value: this.props.datasource.list.TestOnBorrow == false ? 'false' : 'true',
            desc: '是否在获得连接后检测其可用性'
        }, {
            key: '7',
            name: '空闲时检测',
            value: this.props.datasource.list.TestWhileIdle == false ? 'false' : 'true',
            desc: '是否在连接空闲一段时间后检测其可用性'
        }, {
            key: '8',
            name: '连接放回连接池时检测',
            value: this.props.datasource.list.TestOnReturn == false ? 'false' : 'true',
            desc: '是否在连接放回连接池后检测其可用性'
        }, {
            key: '9',
            name: '初始化连接大小',
            value: this.props.datasource.list.InitialSize,
            desc: '连接池建立时创建的初始化连接数'
        }, {
            key: '10',
            name: '最小空闲连接数',
            value: this.props.datasource.list.MinIdle,
            desc: '连接池中最小的活跃连接数'
        }, {
            key: '11',
            name: '最大连接数',
            value: this.props.datasource.list.MaxActive,
            desc: '连接池中最大的活跃连接数'
        }, {
            key: '12',
            name: '池中连接数',
            value: this.props.datasource.list.PoolingCount,
            desc: '当前连接池中的数目'
        }, {
            key: '13',
            name: '池中连接数峰值',
            value: this.props.datasource.list.ActivePeak,
            desc: '连接池中数目的峰值'
        }, {
            key: '14',
            name: '池中连接数峰值时间',
            value: this.props.datasource.list.ActivePeakTime,
            desc: '连接池数目峰值出现的时间'
        }, {
            key: '15',
            name: '逻辑连接打开次数',
            value: this.props.datasource.list.LogicConnectCount,
            desc: '产生的逻辑连接建立总数'
        }, {
            key: '16',
            name: '执行数',
            value: this.props.datasource.list.ExecuteCount,
            desc: '执行数'
        }];
        return (
            <div className={styles.divbackground}>
                {/* <p className={styles.styletabletop}>数据源</p> */}
                <Table
                    rowKey={record => record.name}
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

Datasource.propTypes = {
    loading: PropTypes.object,
};

export default connect(({ datasource, loading }) => ({ datasource, loading }))(Form.create()(Datasource))
