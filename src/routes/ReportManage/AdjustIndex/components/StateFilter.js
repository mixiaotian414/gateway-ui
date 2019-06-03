import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col,  Form, Button, DatePicker} from 'antd';
import PropTypes from 'prop-types'
import styles from './Filter.less';
import {MultipleOrganTree,CurSelect,IndexTree} from 'components'
import moment from 'moment'
/**
 * @Title:报表管理》派生指标调整》查询组件
 * @Description:Filter查询组件(生命周期模式)
 * @Author: mxt
 * @Time: 2018/5/5
 * @Update: dhn
 * @UpdateTime: 2018/6/25
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item;

class Filter extends Component {
  state = {
  };

  handleFormReset = () => {
    const { resetFields } = this.props.form;
    const { dispatch,LedgerType} = this.props;
    dispatch({
      type:LedgerType+'/querySuccess',
      payload: {
        quotaNum:0,
        quota:{},
        organ:{},
        organNum:0,
      },
    })
    resetFields();
    this.props.handleFormReset();
  }


  renderSimpleForm() {
    const { getFieldDecorator } = this.props.form;
    const { appId, orgId } = this.props;
    let end = new Date
    let timestamp = end.getTime()
    let begin = new Date(timestamp - 1 * 24 * 3600 * 1000)

    let betime = []
 /*   betime[0] = moment(begin)
    betime[1] = moment(begin)*/
    let initialCreateTime=moment(begin)
    const {form}=this.props

    let   Format = 'YYYY-MM-DD';
    const ComProps ={
      form,
      appId,
      orgId
    }
    return (
      <div>
        <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
          <Col md={6} sm={24}>
            {/* <IndexTree {...ComProps}/> */}
            <FormItem label="指标">
              <Button style={{width:"100%"}} onClick={()=>{this.props.onAdd(this.props.quota,"quota")}} icon="search" >{this.props.quotaNum>0?"已选择"+this.props.quotaNum+"个指标项":"选择指标"}</Button>
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <CurSelect {...ComProps}/>
          </Col>
          <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit" loading={this.props.loading.effects['dayLedger/query']}>查询</Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
            </span>
          </Col>
        </Row>
        <Row gutter={{ md: 6, lg: 12, xl: 48 }}>
          <Col md={6} sm={24}>
            {/* <MultipleOrganTree {...ComProps}/> */}
            <FormItem label="机构">
              <Button style={{width:"100%"}} onClick={()=>{this.props.onAdd(this.props.organ,"organization")}} icon="search" >{this.props.organNum>0?"已选择"+this.props.organNum+"个机构项":"选择机构"}</Button>
            </FormItem>
          </Col>
          <Col md={6} sm={24}>
            <FormItem label="期次">
              {getFieldDecorator('dateId', { initialValue: initialCreateTime })(
                <DatePicker
                  allowClear={false}
                  format={Format}>
                </DatePicker>
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
      //formvalues 将所有表单数据存到state里，这样分页时会带着查询条件
      const {formValues,quota,organ}=this.props
      let  Format = 'YYYYMMDD';
      const {dateId} = fields
      //要注意解构赋值的顺序
      let changefields={
        ...formValues,
        ...fields,
        ...quota,
        ...organ,
      };
      //方便以后前后台联调
      if (dateId) {
        changefields={

          ...changefields,
          /* 'date': [DATE_ID[0].format('YYYY-MM-DD'), DATE_ID[1].format('YYYY-MM-DD')],
           'start_date':DATE_ID[0].format('YYYYMMDD'),
           'end_date':DATE_ID[1].format('YYYYMMDD'),*/
          'dateId':dateId.format(Format),
        }
      }else{
        changefields={
          ...changefields,
          /*  'date': undefined,
            'start_date':undefined,
            'end_date':undefined,*/
          'dateId':undefined
        }
      }
      if(changefields.branches!==undefined){
        let listb =[]
        changefields.branches.map((item) => {
          listb.push(item.value)
        });
        changefields={
          ...changefields,
          branchId:listb
        }
      }
      if(changefields.products!==undefined){
        let listp =[]
        let listpName = []
        changefields.products.map((item) => {
          listp.push(item.value)
          listpName.push(item)
        });
        changefields={
          ...changefields,
          productId:listp,
        }
      }else {
        changefields={
          ...changefields,
          productId:[],
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
  handleFormReset:PropTypes.func,
  toSubmit:PropTypes.func,
}
export default (Form.create()(Filter))


