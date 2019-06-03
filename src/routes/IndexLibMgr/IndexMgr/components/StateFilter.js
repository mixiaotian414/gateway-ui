import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col,  Form, Input, Select, Button, } from 'antd';
import PropTypes from 'prop-types'
import styles from './Filter.less';
import {OrganTree,CurSelect} from 'components'
/**
 * @Title:指标库管理》指标管理》查询组件
 * @Description:Filter查询组件(生命周期模式)
 * @Author: mxt
 * @Time: 2019/4/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item;

class Filter extends Component {
  state = {
    modalVisible: false,
    expandForm: false,
  };



  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const {LedgerType,form}=this.props
    const handleFormReset = () => {
      const { resetFields } = this.props.form;
      resetFields();
      this.props.handleFormReset();
    }
    const {IndexTypeList}=this.props

    return (
      <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

        <Col md={8} sm={24}>
          <FormItem label="指标名称">
            {getFieldDecorator('productName')(
              <Input  placeholder="请输入"/>
            )}
          </FormItem>
        </Col>
        <Col md={9} sm={24}>
          <FormItem label="指标类型">
            {getFieldDecorator('productType')(
              <Select  mode="multiple"  placeholder="请选择">
                {IndexTypeList && IndexTypeList.map((item, key) => <Select.Option value={item.dictValue} key={key}>{item.dictName}</Select.Option>)}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit"
                      loading={this.props.loading.effects['dayLedger/query']}

              >查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={ handleFormReset}>重置</Button>

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


