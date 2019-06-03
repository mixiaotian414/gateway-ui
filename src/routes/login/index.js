import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Button, Row, Form, Input } from 'antd'
import { config } from 'utils'
import styles from './index.less'

const FormItem = Form.Item

const Login = ({
  loading,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }

  return (

  <div className={styles.bg}>
    <div className={styles.register}>
      <div className={styles.login}>
        <div className={styles.logo}></div>
        <div className={styles.title}> | 数据平台</div>
      </div>
      <form>
        <FormItem hasFeedback>
          {getFieldDecorator('loginName', {
            initialValue:'',
            /*rules: [
              {
                required: true,
                message: '用户名不能为空'
              },
            ],*/
          })(<Input type="text" onPressEnter={handleOk} placeholder="用户名" className={styles.registerText}/>)}
        </FormItem>
        <FormItem hasFeedback>
          {getFieldDecorator('password', {
            initialValue:'',
           /* rules: [
              {
                required: true,
                message: '密码不能为空'
              },
            ],*/
          })(<Input type="password" onPressEnter={handleOk} placeholder="密码" className={styles.registerText}/>
          )}
        </FormItem>
        <Button type="primary" onClick={handleOk} className={styles.registerButton} loading={loading.effects.login}>登录</Button>
      </form>


    </div>
  </div>
  )
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ loading }) => ({ loading }))(Form.create()(Login))
