import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Button, Form, Table, Modal, Input, Card } from 'antd';

const { TextArea } = Input;
class Sqlmonitor extends Component {
    constructor(props) {
        super(props);
        this.Showmodal = this.Showmodal.bind(this);
        this.state = {
            sql: []
        }
    }
    componentDidMount() {
        this.timer = setInterval(function () {
            this.props.dispatch({
                type: 'sqlmonitor/getTableList',
            })
        }.bind(this), 5000)
    }
    componentWillUnmount() {
        clearInterval(this.timer);
    }
    Showmodal(text) {
        this.setState({
            modalvisible: true,
            sql: text
        })
    }
    handleCancel = () => {
        this.setState({
            modalvisible: false,
        })
    }
    render() {
        const columns = [{
            title: 'SQL',
            dataIndex: 'SQL',
            key: 'SQL',
            width: '50%',
            className: styles.listshow,
            render: (text, record) => {
                return (
                    <span>
                        <a onClick={() => this.Showmodal(text)}>{text}</a>
                    </span>
                )
            }
        }, {
            title: '执行数',
            dataIndex: 'ExecuteCount',
            key: 'ExecuteCount',
            sorter: (a, b) => a.ExecuteCount - b.ExecuteCount,
        }, {
            title: '执行时间',
            dataIndex: 'TotalTime',
            key: 'TotalTime',
            sorter: (a, b) => a.TotalTime - b.TotalTime,
        }, {
            title: '读取行数',
            dataIndex: 'FetchRowCount',
            key: 'FetchRowCount',
        }, {
            title: '最大并发',
            dataIndex: 'ConcurrentMax',
            key: 'ConcurrentMax',
        }];
        return (
            <div className={styles.divbackground}>
                <Table
                    rowKey={record => record.SQL}
                    columns={columns}
                    dataSource={this.props.sqlmonitor.list}
                    pagination={false}
                    bordered
                />
                <Modal
                    title={'SQL详情'}
                    visible={this.state.modalvisible}
                    onCancel={this.handleCancel}
                    maskClosable={false}
                    wrapClassName="vertical-center-modal"
                    footer={[
                        <Row key='modal' style={{ textAlign: 'right' }}>
                            <Button key="qx" onClick={this.handleCancel}>取消</Button>
                        </Row>
                    ]}
                >
                    {this.state.sql}
                </Modal>
            </div>
        )
    }
}

Sqlmonitor.propTypes = {
    loading: PropTypes.object,
};

export default connect(({ sqlmonitor, loading }) => ({ sqlmonitor, loading }))(Form.create()(Sqlmonitor))
