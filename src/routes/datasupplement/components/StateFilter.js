import React, {Component} from 'react';
import {connect} from 'dva';
import {Row, Col, Form, Button, DatePicker, Input, InputNumber, Select, TreeSelect, Collapse} from 'antd';
import PropTypes from 'prop-types'
import styles from './Filter.less';

/**
 * @Title:列表DEMO——>查询组件
 * @Description:Filter查询组件(生命周期模式)
 * @Author: dhn
 * @Time: 2018/6/26
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const {RangePicker} = DatePicker;
const Option = Select.Option

class Filter extends Component {
  state = {};

  handleFormReset = () => {
    const {resetFields} = this.props.form;
    resetFields();
    this.props.handleFormReset();
  }

//表单渲染
  renderSimpleForm() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <Row gutter={{md: 6, lg: 24, xl: 48}}>
          <Col md={6} sm={24}>
            <FormItem label="编码">
              {getFieldDecorator('recordCode')(
                <Input placeholder="请输入"/>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24} style={{marginLeft: -20}}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit"
                          loading={this.props.loading.effects['dayLedger/query']}>查询</Button>
                  <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
                </span>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
//处理提交数据
    const handleFields = (fields) => {
      //formvalues 将所有表单数据存到state里，这样分页时会带着查询条件
      const {formValues} = this.props
      const {dateId} = fields
      //要注意解构赋值的顺序
      let changefields = {
        ...formValues,
        ...fields,
      };
      //方便以后前后台联调
      if (dateId) {
        changefields = {
          ...changefields,
        }
      } else {
        changefields = {
          ...changefields,
        }
      }
      return changefields
    }

    /**
     * 点击搜索按钮
     * */
    const handleSubmit = (e) => {
      e.preventDefault();
      const toSubmit = this.props.toSubmit
      this.props.form.validateFields(function (err, fieldsValue) {
        const changefields = handleFields(fieldsValue)
        toSubmit(changefields)
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
  loading: PropTypes.object,
  handleFormReset: PropTypes.func,
  toSubmit: PropTypes.func,
}
export default (Form.create()(Filter))


