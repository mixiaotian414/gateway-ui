import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col,  Form, Input, Select, Button, } from 'antd';
import PropTypes from 'prop-types'
import styles from './Filter.less';
import {OrganTree,CurSelect} from 'components'
/**
 * @Title:指标查询》数据源管理》查询组件
 * @Description:Filter查询组件(生命周期模式)
 * @Author: mxt
 * @Time: 2019/3/27
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item;

class Filter extends Component {
  state = {
    modalVisible: false,
    expandForm: false,
  };

  handleFormReset = () => {
    const { resetFields } = this.props.form;
    resetFields();
    this.props.handleFormReset();
  }


  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  }
  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const {LedgerType,form}=this.props

    const {queryProductLevData}=this.props
    let   Format = 'YYYY-MM-DD';
    const ComProps ={
      form
    }
    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

        <Col md={6} sm={24}>
          <FormItem label="连接名称">
            {getFieldDecorator('connectionName')(
              <Input  placeholder="请输入"/>
            )}
          </FormItem>
        </Col>
    {/*    <Col md={6} sm={24}>
          <FormItem label="模型类型">
            {getFieldDecorator('modelType')(
              <Select mode="tags" placeholder="请选择">
                {queryProductLevData && queryProductLevData.map((item, key) => <Select.Option value={item.value} key={key}>{item.label}</Select.Option>)}
              </Select>
            )}
          </FormItem>
        </Col>*/}
        <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" loading={this.props.loading.effects['dayLedger/query']}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset} htmlType="submit">重置</Button>

            </span>
        </Col>
      </Row>
    );
  }
  render() {



    /**
     * 点击搜索按钮
     * */
    const handleSubmit = (e) => {
      e.preventDefault();
      const toSubmit = this.props.toSubmit
      this.props.form.validateFields(function (err, fieldsValue) {

        toSubmit(fieldsValue)
      });
      return false;
    }
    return (
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>
              <Form onSubmit={handleSubmit} layout="inline">
                {this.renderSimpleForm()}
              </Form>
            </div>
          </div>
    );
  }
}
Filter.propTypes = {
  LedgerType: PropTypes.string,
  loading: PropTypes.object,
  handleFormReset:PropTypes.func,
  toSubmit:PropTypes.func,
}
export default (Form.create()(Filter))


