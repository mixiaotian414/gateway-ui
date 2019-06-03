import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import styles from './index.less'
import { LocaleProvider, Form, Row, Col, Button, Input, Table, Modal } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { request } from 'utils'

const FormItem = Form.Item;

class Imagequery extends Component {
  constructor(props) {
    super(props);
    this.Query = this.Query.bind(this);
    this.Reset = this.Reset.bind(this);
    this.Next = this.Next.bind(this);
    this.Previous = this.Previous.bind(this);
    this.Preview = this.Preview.bind(this);
    this.state = {
      list: [],
      loadstart: false,
      modalVisible: false,
      picture: ""
    }
  }

  Query() {
    const imageName = this.props.form.getFieldValue("imageName");
    this.setState({
      loadingstatus: true
    })
    request({
      url: '/media/api/get?media_id=' + imageName + "&next_no=undefined" + "&up_no=undefined",
      method: 'get',
    }).then((data) => {
      this.setState({
        list: data,
        loadingstatus: false
      })
    })
  }

  Reset() {
    this.props.form.resetFields(['imageName']);
    this.setState({
      list: [],
    })
  }

  Previous() {
    const imageName = this.props.form.getFieldValue("imageName");
    if (this.state.list.success && this.state.list.data.length > 0) {
      this.setState({
        loadingstatus: true
      })
      const rk = this.state.list.data[0].rowkey
      request({
        url: '/media/api/get?media_id=' + imageName + "&next_no=undefined" + "&up_no=" + rk,
        method: 'get',
      }).then((data) => {
        this.setState({
          loadingstatus: false
        })
        if (data.data.length > 0) {
          this.setState({
            list: data,
          })
        }
      })
    }
  }

  Next() {
    const imageName = this.props.form.getFieldValue("imageName");
    if (this.state.list.success && this.state.list.data.length == 10) {
      this.setState({
        loadingstatus: true
      })
      const rk = this.state.list.data[this.state.list.data.length - 1].rowkey
      request({
        url: '/media/api/get?media_id=' + imageName + "&next_no=" + rk + "&up_no=undefined",
        method: 'get',
      }).then((data) => {
        this.setState({
          loadingstatus: false
        })
        if (data.data.length > 0) {
          this.setState({
            list: data,
          })
        }
      })
    }
  }

  Preview(record) {
    this.setState({
      modalVisible: true,
      picture: record
    })
  }

  handleCancel = (e) => {
    this.setState({
      modalVisible: false
    })
  }


  render() {
    const { getFieldDecorator, resetFields } = this.props.form;
    const columns = [
      {
        title: '文件名称',
        dataIndex: 'name',
        key: 'name',
        width: '20%'
      }, {
        title: '文件类型',
        dataIndex: 'type',
        key: 'type',
        width: '20%'
      }, {
        title: '文件别名',
        dataIndex: 'alias',
        key: 'alias',
        width: '20%',
        render: (text) => {
          if (text == 'undefined') {
            return ""
          } else {
            return text
          }
        }
      }, {
        title: '文件说明',
        dataIndex: 'explain',
        key: 'explain',
        width: '20%',
        render: (text) => {
          if (text == 'undefined') {
            return ""
          } else {
            return text
          }
        }
      }, {
        title: '图片展示',
        dataIndex: 'content',
        key: 'content',
        width: '20%',
        render: (record) => <a onClick={() => this.Preview(record)}><img src={"data:image/jpeg;base64," + record} alt="" width="100px" /></a>
      }
    ]

    return (
      <LocaleProvider locale={zhCN}>
        <div className={styles.divbackground}>
          <Row style={{ marginLeft: '10px' }}>
            <Form layout="inline" style={{ textAlign: 'left' }}>
              <FormItem label="影像名称：" >
                {getFieldDecorator('imageName', {
                })(<Input placeholder="请输入" style={{ float: 'left' }} />)}
              </FormItem>
              <FormItem>
                <Button key="cx" type="primary" onClick={this.Query} loading={this.state.loadingstatus}>查询</Button>
              </FormItem>
              <FormItem>
                <Button key="cz" onClick={this.Reset}>重置</Button>
              </FormItem>
            </Form>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col span={24}>
              <Table
                rowKey={record => record.rowkey}
                bordered
                simple
                fixed
                columns={columns}
                dataSource={this.state.list.data}
                pagination={false}
                loading={this.state.loadingstatus}
              />
            </Col>
          </Row>
          <Row style={{ marginTop: '20px' }}>
            <Col style={{ textAlign: 'center' }}>
              <Button style={{ marginRight: '10px' }} key="prev" onClick={this.Previous}>上一页</Button>
              <Button key="next" onClick={this.Next}>下一页</Button>
            </Col>
          </Row>
          <Modal
            title={"图片预览"}
            visible={this.state.modalVisible}
            onCancel={this.handleCancel}
            footer={false}
            keyboard={false}
            maskClosable={false}
            width={800}
          >
            <Row>
              <Col span={24}>
                <img src={"data:image/jpeg;base64," + this.state.picture} alt="" style={{ width: '100%', height: 'auto' }} />
              </Col>
            </Row>
          </Modal>
        </div>
      </LocaleProvider>
    )
  }
}

Imagequery.propTypes = {
  loading: PropTypes.object,
};

export default connect(({ imagequery, loading, app }) => ({ imagequery, loading, app }))(Form.create()(Imagequery))
