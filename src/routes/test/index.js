import React, { Component } from 'react'
import { connect } from 'dva'
import { Row, Col,Form,Input,Button,Table,Modal} from 'antd'

class Test extends Component {
    render() {
      const { getFieldDecorator} = this.props.form;
      const FormItem = Form.Item
        return (
            <div className={styles.divbackground}>
              <Form layout="inline">
              <FormItem label="机构:">
                {getFieldDecorator('userName',{
                })(
                  <Input placeholder="请输入"  style={{width:150}} />
                )}
              </FormItem>
              <FormItem label="币种:">
                {getFieldDecorator('times',{
                  /*  initialValue: '9'*/
                })(
                  <Input placeholder="请输入"  style={{width:150}} />
                )}
              </FormItem>

              <FormItem>
                <Button   type="primary" icon="search"  htmlType="submit"  style={{marginRight:'15px'}}>查询</Button>
                <Button   type="default" icon="search"  htmlType="submit"  >重置</Button>
              </FormItem>
              </Form>
              {/*<Row style={{marginTop:10}}>*/}
                {/*<Col>*/}
                  {/*<Button  type="default" icon="export">导出</Button>*/}
                {/*</Col>*/}
              {/*</Row>*/}
              <Row>
                <Col span={24}>
                  <iframe name="contentArea" src="http://192.168.1.47:9199/FineReport/page_demo/demo.html"  className={styles.iframe}></iframe>
                  {/*<iframe name="contentArea" src="http://192.168.1.47:9199/runqianDemo/NewFile.jsp?branch_id=321323007"  className={styles.iframe}></iframe>*/}
                </Col>
              </Row>
            </div>
        )
    }
}

export default connect(({ test, loading }) => ({ test, loading }))(Form.create()(Test))
