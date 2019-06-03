import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Form, Button, Input, Table } from 'antd';

const FormItem = Form.Item;

class LogListener extends Component {
    constructor(props) {
        super(props);
        this.Show = this.Show.bind(this);
        this.Reset = this.Reset.bind(this);
        this.state = {

        }
    }
    Show() {
        const startRow = this.props.form.getFieldValue("startRow");
        const endRow = this.props.form.getFieldValue("endRow");
        this.props.dispatch({
            type: 'loglistener/GetLog',
            payload: {
                startRow: startRow,
                endRow: endRow
            }
        })
    }
    Reset() {
        this.props.form.resetFields();
        this.props.dispatch({
            type: 'loglistener/GetLog',
            payload: {
                startRow: '',
                endRow: ''
            }
        })
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const columns = [
            {
                title: '序号',
                dataIndex: 'row',
                key: 'row',
                width: '5%'
            }, {
                title: '日志信息',
                dataIndex: 'text',
                key: 'text',
                width: '95%',
                className: styles.left
            }
        ]
        return (
            <div className={styles.divbackground}>
                <Form layout="inline" style={{ textAlign: 'left' }}>
                    <FormItem label="日志行数：" >
                        {getFieldDecorator('startRow', {
                        })(<Input placeholder="请输入起始行" />)}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('endRow', {
                        })(<Input placeholder="请输入终止行" />)}
                    </FormItem>
                    <FormItem>
                        <Button type="primary" onClick={this.Show}>查询</Button>
                    </FormItem>
                    <FormItem>
                        <Button onClick={this.Reset}>重置</Button>
                    </FormItem>
                    <Row style={{ marginTop: '10px' }}>
                        <Col>
                            <div style={{ overflow: 'auto', height: '450px' }}>
                                <Table

                                    rowKey={record => record.row}
                                    columns={columns}
                                    dataSource={this.props.loglistener.loglist}
                                    pagination={false}
                                    showHeader={false}
                                    bordered={false}
                                    size="small"
                                />
                            </div>
                        </Col>
                    </Row>
                </Form>
            </div>
        )
    }
}

LogListener.propTypes = {
    loading: PropTypes.object,
};

export default connect(({ loglistener, loading }) => ({ loglistener, loading }))(Form.create()(LogListener))
