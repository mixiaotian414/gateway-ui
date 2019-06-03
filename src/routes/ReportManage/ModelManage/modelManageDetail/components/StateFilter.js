import React, {Component} from 'react';
import {connect} from 'dva';
import {Row, Col, Form, Select, Button, DatePicker, Checkbox, message} from 'antd';
import PropTypes from 'prop-types'
import styles from './Filter.less';

const {RangePicker} = DatePicker;
import moment from 'moment'
import {MultipleOrganTree, CurSelect} from 'components'

/**
 * @Title:报表管理》模型管理》模型查询》》查询组件
 * @Description:Filter查询组件(生命周期模式)
 * @Author: mxt
 * @Time: 2018/3/16
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item;
const {Option} = Select;
const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');


class Filter extends Component {
  state = {
    modalVisible: false,
    expandForm: false,
  };

  componentWillMount() {
    const {dispatch, LedgerType} = this.props;
    dispatch({
      type: LedgerType + '/querySuccess',
      payload: {
        quotaNum: 0,
        quota: {},
        organ: {},
        organNum: 0,
      },
    })
  }

  handleFormReset = () => {
    const {resetFields} = this.props.form;
    const {dispatch, LedgerType} = this.props;
    dispatch({
      type: LedgerType + '/querySuccess',
      payload: {
        quotaNum: 0,
        quota: {},
        organ: {},
        organNum: 0,
      },
    })
    resetFields();
    this.props.handleFormReset();
  }

  renderSimpleForm() {
    const {getFieldDecorator} = this.props.form;
    const {queryCurData, querySelectTreeData, LedgerType, form} = this.props

    let end = new Date
    let timestamp = end.getTime()
    let begin = new Date(timestamp - 1 * 24 * 3600 * 1000)
    let betime = []
    betime[0] = moment(begin)
    betime[1] = moment(begin)
    let initialCreateTime = betime
    let Format = 'YYYY-MM-DD';
    const ComProps = {
      form
    }
    return (
      <div>
        <Row gutter={{md: 6, lg: 12, xl: 24}}>
          <Col md={6} sm={24}>
            {/* <MultipleOrganTree {...ComProps}/> */}
            <FormItem label="机构">
              <Button style={{width: '100%'}} onClick={() => {
                this.props.onAdd(this.props.organ, "organization")
              }} icon="search">{this.props.organNum > 0 ? "已选择" + this.props.organNum + "个机构项" : "选择机构"}</Button>
            </FormItem>
          </Col>
          <Col md={2} sm={24}>
            <FormItem>
              {getFieldDecorator('flag', {valuePropName: 'checked', initialValue: false})(
                <Checkbox>级联</Checkbox>
              )}
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <CurSelect {...ComProps}/>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" loading={this.props.loading.effects['modelManageDetail/query']}>查询</Button>
              <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
        <Row gutter={{md: 6, lg: 12, xl: 24}}>
          <Col md={6} sm={24}>
            <FormItem label="期次">
              {getFieldDecorator('DATE_ID', {initialValue: initialCreateTime})(
                <RangePicker
                  allowClear={false}
                  format={Format}>
                </RangePicker>
              )}
            </FormItem>
          </Col>
        </Row>
      </div>
    );
  }

  render() {
//处理提交数据
    const handleFields = (fields) => {
      //formValues 将所有表单数据存到state里，这样分页时会带着查询条件

      const {formValues, LedgerType, quota, organ} = this.props
      let Format = 'YYYY-MM-DD';
      const {DATE_ID, flag} = fields
      //要注意解构赋值的顺序

      let changefields = {
        ...formValues,
        ...fields,
        ...quota,
        ...organ,
        'curr': fields.currId,
      };

      //方便以后前后台联调
      if (DATE_ID && DATE_ID.length > 0) {
        changefields = {
          ...changefields,
          'dates': [DATE_ID[0].format('YYYYMMDD'), DATE_ID[1].format('YYYYMMDD')],
          'start_date': DATE_ID[0].format('YYYYMMDD'),
          'end_date': DATE_ID[1].format('YYYYMMDD'),
          /*  'DATE_ID':DATE_ID.format(Format),*/
        }
      } else {
        changefields = {
          ...changefields,
          'date': undefined,
          'start_date': undefined,
          'end_date': undefined,
          /*    'DATE_ID':undefined*/
        }
      }


      changefields = {
        ...changefields,
      }

      if (changefields.branches !== undefined) {
        let listb = []
        changefields.branches.map((item) => {
          listb.push(item.value)
        });
        changefields = {
          ...changefields,
          branches: listb
        }
      }
      if (changefields.products !== undefined) {
        let listp = []
        let listpName = []
        changefields.products.map((item) => {
          listp.push(item.value)
          listpName.push(item)
        });
        changefields = {
          ...changefields,
          products: listp,
          productsName: listpName
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
        if(changefields.branches !== undefined){
          let Strings = (changefields.code).split(",");
          let products = []
          for (let i = 0; i < Strings.length - 1; i++) {
            let Strings1 = (Strings[i]).split(".")
            products[i] = Strings1[0];
          }
          const changefields1 = {
            ...changefields,
            products: products,
            modalcode: Strings[Strings.length - 1]
          }
          toSubmit(changefields1)
        }else{
          message.error("请选择指标后查询")
        }
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
  formValues: PropTypes.object,
  queryCurData: PropTypes.array,
  querySelectTreeData: PropTypes.array,
  queryProductLevData: PropTypes.array,
  handleFormReset: PropTypes.func,
  toSubmit: PropTypes.func,
}
export default (Form.create()(Filter))


