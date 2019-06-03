import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import { Button,Table,Form ,Modal, Badge,Row,Col, Tabs,message,Divider ,Input,Card  } from 'antd'
import styles from './index.less'

class password extends React.Component{
  state = {

  }

  render(){
    const FormItem = Form.Item
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsValue, setFieldsValue } = this.props.form
    const userList = this.props.app.userList

    const checkConfirm = (rule, value, callback) => {
      if (value && value !== this.props.form.getFieldValue('newPassword')) {
        callback('两次输入的密码不匹配!');
      } else {
        callback();
      }
    }
    const checkConfirmEx = (rule, value, callback) => {
      if (value && value === this.props.form.getFieldValue('password')) {
        callback('新密码不能与原密码相同!');
      } else {
        callback();
      }
    };
    const handleOk =()=>{
      this.props.form.validateFields((err, fieldsValue) => {
        if (err) return
        this.props.dispatch({
          type: 'password/passwordUpdate',
          payload: {
            appId: this.props.app.user.appId,
            userId: fieldsValue.userId,
            password: fieldsValue.password,
            newPassword: fieldsValue.newPassword,
          },
        })
        this.props.form.resetFields()
      })
    }
    return(
      <div className={styles.divbackground}>
        <Card>
          <Form layout="inline" >
            <Row style={{ marginLeft:'30px'}}>
              <Col span={18} offset={4}>
                <FormItem label="登录账号:" >
                  {getFieldDecorator('loginName',{
                    initialValue: this.props.app.user.loginName
                  })(
                    <Input placeholder="请输入" type="hidden"  size="large" />

                  )}
                  <span style={{width:350}}>{this.props.app.user.loginName}</span>
                </FormItem>
              </Col>

            </Row>
            <Row style={{ marginLeft:'57px'}}>
              <Col span={18} offset={4}>
                <FormItem label="姓名:"   style={{ marginTop:'20px'}}>
                  {getFieldDecorator('name',{
                    initialValue: this.props.app.user.name
                  })(
                    <Input placeholder="请输入" type="hidden"  size="large" />
                  )}
                  <span style={{width:350}}>{this.props.app.user.name}</span>
                </FormItem>
              </Col>

            </Row>
            <Row style={{marginTop:'10px',marginLeft:'30px'}}>
              <Col span={18} offset={4}>
                <FormItem label="原密码:" >
                  {getFieldDecorator('password',{
                    rules: [
                      {
                        required: true,
                        message: '原密码不能为空',
                      },
                    ],
                  })(
                    <Input placeholder="请输入" type="password" size="large" style={{width:340}} />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{marginTop:'10px',marginLeft:'30px'}}>
              <Col span={18} offset={4}>
                <FormItem label="新密码:" >
                  {getFieldDecorator('newPassword',{
                    rules: [
                      {
                        required: true,
                        message: '新密码不能为空',
                      },
                      {
                        validator: checkConfirmEx,
                      },
                    ],
                  })(
                    <Input placeholder="请输入" type="password" size="large" style={{width:340}} />

                  )}
                </FormItem>
              </Col>
            </Row>
            <Row style={{marginTop:'10px'}}>
              <Col span={18} offset={4}>
                <FormItem label="重复新密码:">
                  {getFieldDecorator('confirm',{
                    rules: [
                      {
                        required: true,
                        message: '请确认密码！',
                      },
                      {
                        validator: checkConfirm,
                      },
                    ],
                  })(
                    <Input placeholder="请输入" type="password" size="large" style={{width:340}} />
                  )}
                </FormItem>
              </Col>

            </Row>
            <Row>
              <FormItem>
                {getFieldDecorator('userId',{
                  initialValue: this.props.app.user.userId
                })(
                  <Input placeholder="请输入" type="hidden"  size="large" style={{width:350}} />
                )}
              </FormItem>
            </Row>
            <Row style={{ textAlign: 'center' }}>
              <Button type="primary" onClick={e=>handleOk()} >保存</Button>
            </Row>
          </Form>
        </Card>
    </div>)
  }
}
export default connect(({ password, loading,app }) => ({ password, loading,app }))(Form.create()(password))
