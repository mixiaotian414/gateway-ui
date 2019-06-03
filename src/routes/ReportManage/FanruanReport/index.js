import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import { Button,Form ,Input,Modal,Icon,Row,Col,DatePicker,Select } from 'antd'
import styles from './index.less'
import {ExclusiveOrganTree,CurSelect} from 'components'
import { Page } from 'components'
let  Format = 'YYYYMM';
import moment from 'moment'
const { MonthPicker, RangePicker } = DatePicker;
import queryString from 'query-string'
class FanruanReport  extends React.Component{

  state = {
      src:"http://114.116.42.140:40099/fineReport/page_demo/demo.html"
  }
  render(){
    const FormItem = Form.Item
    const { getFieldDecorator, getFieldsValue } = this.props.form
    let end = new Date
    let timestamp = end.getTime()
    let begin = new Date(timestamp)

    let initialCreateTime=moment(begin)
    const handleSubmit = (e) => {
      e.preventDefault()
      let fields = getFieldsValue()
      fields = handleFields(fields)
      //fields 以后需要按照?branch_id=321323007&XXXX=2312的格式传给src
      //等待接口完善暂时不做拼接，（可以用queryString.parse）
      let urlParam ="?"+queryString.stringify(fields )
      let src =this.state.src+urlParam
      this.setState({
        src
      })
    }
    const handleFields = (fields) => {
      const { Date,currId } = fields
      if (Date) {
        fields.Date = Date.format('YYYYMM')
      }
      if(currId){
        fields.Curr=currId
      }
      return fields
    }

    const {src} = this.state;

    const aprops={
      form:this.props.form
    }
    return (
      <Page inner>
        <div className={styles.tableList}>
          <div className={styles.tableListForm}>
            <Form onSubmit={handleSubmit} layout="inline">
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>
                <Col md={6} sm={24}>
                  <ExclusiveOrganTree  {...aprops}/>
                </Col>
                <Col md={6} sm={24}>
                  < CurSelect {...aprops }/>
                </Col>
                <Col md={6} sm={24}>
                  <FormItem label="日期">
                    {getFieldDecorator('Date',{ initialValue: initialCreateTime })(
                      <MonthPicker
                        format={Format}
                        placeholder="请选择" >
                      </MonthPicker>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit"  >查询</Button>
            </span>
                </Col>
              </Row>
              <Row gutter={{ md: 6, lg: 24, xl: 48 }}>

                <Col md={6} sm={24}>
                  <FormItem label="单位">
                    {getFieldDecorator('Unit',{
                      initialValue: '1'
                    })(
                      <Select placeholder="请选择">
                        <Select.Option value="1" key="1">元</Select.Option>
                        <Select.Option value="10000" key="1">万元</Select.Option>

                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={6} sm={24}>

                </Col>
              </Row>
              <Row >
                <Col span={24}>
                  <iframe frameBorder="no" border="0" scrolling="no"  src={src} style={{ width: '100%',height: '800px'}}></iframe>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Page>
    )
  }
}
export default  Form.create()(FanruanReport)
