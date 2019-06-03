/* global window */
/* global document */
import React from 'react'
import NProgress from 'nprogress'
import PropTypes from 'prop-types'
import pathToRegexp from 'path-to-regexp'
import { connect } from 'dva'
import { Loader, MyLayout } from 'components'
import { LocaleProvider, BackTop, Layout, Modal, DatePicker, Form, Input, Select, Row, Col, Button, Tabs, Checkbox } from 'antd'
import { classnames, config } from 'utils'
import { Helmet } from 'react-helmet'
import { withRouter } from 'dva/router'
import Error from './error'
import '../themes/index.less'
import './app.less'
import moment from 'moment';
import zhCN from 'antd/lib/locale-provider/zh_CN';

const { Content, Footer, Sider } = Layout
const { Header, Bread, styles } = MyLayout
const { prefix, openPages } = config
const { TabPane } = Tabs
const dateFormat = 'YYYY-MM-DD';
const CheckboxGroup = Checkbox.Group;
let lastHref

const App = ({
  children, dispatch, app, loading, location, form
}) => {
  const {
    user, siderFold, darkTheme,bussList,checkList,plainOptions, isNavbar, menuPopoverVisible, navOpenKeys, menu, fetchingNotices, notices, currentUser, visible, userinfoVisible, userList,visiblepass
  } = app
  const FormItem = Form.Item
  const { getFieldDecorator } = form;
  let { pathname } = location
  pathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  const { iconFontJS, iconFontCSS, logo } = config
  const current = menu.filter(item => pathToRegexp(item.routeUri || '').exec(pathname))
  //const hasPermission = current.length ? permissions.visit.includes(current[0].id) : false
  const { href } = window.location
  if (lastHref !== href) {
    NProgress.start()
    if (!loading.global) {
      NProgress.done()
      lastHref = href
    }
  }
  const headerProps = {
    menu,
    user,
    visible,
    location,
    dispatch,
    siderFold,
    isNavbar,
    currentUser,
    menuPopoverVisible,
    navOpenKeys,
    fetchingNotices,
    notices,
    switchMenuPopover() {
      dispatch({ type: 'app/switchMenuPopver' })
    },
    logout() {
      dispatch({ type: 'app/logout' })
    },
    switchSider() {
      dispatch({ type: 'app/switchSider' })
    },
    userinfo() {
      dispatch({
        type: 'app/queryid',
        payload: {
          appId: user.appId,
          userCode: user.userCode,
          userId: user.userId,
        },
      })
      dispatch({
        type: 'app/userbusslist',
        payload: {
          appId: user.appId,
          userId:user.userId
        }
      }).then(() => {
        console.info(bussList)
        let busslistM = []
        bussList.map((item) => {
          if (item) {

            busslistM.push({
              label: item.businessName,
              value: item.businessCode,
            })
          }
        })
        dispatch({
          type: 'app/busslistMap',
          payload: {
            plainOptions: busslistM,
          },
        })
      })
      dispatch({ type: 'app/userinfoModal' })


    },
    chpasswd() {
      dispatch({ type: 'app/changeModal' })
    },
    changeOpenKeys(openKeys) {
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  }

  const siderProps = {
    menu,
    location,
    siderFold,
    darkTheme,
    navOpenKeys,
    changeTheme(e) {
      dispatch({
        type: 'app/SetTheme',
        payload: {
          sw: e
        }
      })
    },
    changeOpenKeys(openKeys) {
      window.localStorage.setItem(`${prefix}navOpenKeys`, JSON.stringify(openKeys))
      dispatch({ type: 'app/handleNavOpenKeys', payload: { navOpenKeys: openKeys } })
    },
  }
  const breadProps = {
    menu,
    location,
  }

  if (openPages && openPages.includes(pathname)) {
    return (<div>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      {children}
    </div>)
  }
  const handleOk = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return
      dispatch({
        type: 'app/chpasswd',
        payload: {
          appId: app.user.appId,
          userId: fieldsValue.userId,
          password: fieldsValue.password,
          newPassword: fieldsValue.newPassword,
        },
      })
      form.resetFields()
      dispatch({ type: 'app/changeModal' })
    })
  }
  //密码过期验证
  const updatePassword = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return
      dispatch({
        type: 'app/passwordUpdate',
        payload: {
          appId: app.user.appId,
          userId: fieldsValue.userId,
          password: fieldsValue.password,
          newPassword: fieldsValue.newPassword,
        },
      })
      form.resetFields()
      dispatch({ type: 'app/changeModalpass' })
     setTimeout(()=>{
        dispatch({ type: 'app/toLogin' })
      },2000)
    })
  }
  const handleCancel = () => {
    dispatch({ type: 'app/changeModal' })
  }
  const handleUserCancel = () => {
    dispatch({ type: 'app/userinfoModal' })
  }
  const checkConfirm = (rule, value, callback) => {
    if (value && value !== form.getFieldValue('newPassword')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  }
  const checkConfirmEx = (rule, value, callback) => {
    if (value && value === form.getFieldValue('password')) {
      callback('新密码不能与原密码相同!');
    } else {
      callback();
    }
  };
  return (
    <div>
      <Loader fullScreen spinning={loading.effects['app/query']} />
      <Helmet>
        <title>东华软件开发平台</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={logo} type="image/x-icon" />
        {iconFontJS && <script src={iconFontJS} />}
        {iconFontCSS && <link rel="stylesheet" href={iconFontCSS} />}
      </Helmet>

      <Layout className={classnames({ [styles.dark]: darkTheme, [styles.light]: !darkTheme })}>
        {!isNavbar && <Sider
          trigger={null}
          collapsible
          collapsed={siderFold}
        >
          {siderProps.menu.length === 0 ? null : <MyLayout.Sider {...siderProps} />}
        </Sider>}
        <Layout style={{ height: '100vh', overflow: 'scroll' }} id="mainContainer">
          <BackTop target={() => document.getElementById('mainContainer')} />
          <Header {...headerProps} />
          <Modal
            title="修改密码"
            visible={app.user.expire === true ? visiblepass : visible}
            closable={app.user.expire === true ? false : true}
            maskClosable={app.user.expire === true ? false : true}
            onCancel={e => handleCancel()}
            footer={app.user.expire === true ? [<Button type="primary" onClick={e => updatePassword()} >保存</Button>] : [<Button onClick={e => handleCancel()}>取消</Button>, <Button type="primary" onClick={e => handleOk()}>保存</Button>]}
            width={500}
          >
            <Form layout="inline" >
              <Row style={{ marginLeft: '30px' }}>
                <FormItem label="登录账号:" >
                  {getFieldDecorator('loginName', {
                    initialValue: app.user.loginName
                  })(
                    <Input placeholder="请输入" type="hidden" size="large" />

                  )}
                  <span style={{ width: 350 }}>{app.user.loginName}</span>
                </FormItem>
              </Row>
              <Row style={{ marginLeft: '57px' }}>
                <FormItem label="姓名:" style={{ marginTop: '20px' }}>
                  {getFieldDecorator('name', {
                    initialValue: app.user.name
                  })(
                    <Input placeholder="请输入" type="hidden" size="large" />
                  )}
                  <span style={{ width: 350 }}>{app.user.name}</span>
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'right' }}>
                <FormItem label="原密码:" style={{ marginTop: '20px' }}>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                        message: '原密码不能为空',
                      },
                    ],
                  })(
                    <Input placeholder="请输入" type="password" size="large" style={{ width: 340 }} />
                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'right' }}>
                <FormItem label="新密码:" style={{ marginTop: '20px' }}>
                  {getFieldDecorator('newPassword', {
                    rules: [
                      {
                        required: true,
                        message: '新密码不能为空',
                      },
                      {
                        validator: checkConfirmEx,
                      },
                      {
                        validator: (rule, value, callback) => {

                          if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(value))) {
                            callback('密码为大写字母+小写字母+数字或其他字符的组合，长度8-15位')
                          }
                          else {
                            callback();
                          }
                        }
                      }
                    ],
                  })(
                    <Input placeholder="请输入" type="password" size="large" style={{ width: 340 }} />

                  )}
                </FormItem>
              </Row>
              <Row style={{ textAlign: 'right' }}>
                <FormItem label="重复新密码:" style={{ marginTop: '20px' }}>
                  {getFieldDecorator('confirm', {
                    rules: [
                      {
                        required: true,
                        message: '请确认密码！',
                      },
                      {
                        validator: checkConfirm,
                      },
                      {
                        validator: (rule, value, callback) => {

                          if (!(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,15}$/.test(value))) {
                            callback('密码为大写字母+小写字母+数字或其他字符的组合，长度8-15位')
                          }
                          else {
                            callback();
                          }
                        }
                      }
                    ],
                  })(
                    <Input placeholder="请输入" type="password" size="large" style={{ width: 340 }} />
                  )}
                </FormItem>
              </Row>
              <Row>
                <FormItem>
                  {getFieldDecorator('userId', {
                    initialValue: app.user.userId
                  })(
                    <Input placeholder="请输入" type="hidden" size="large" style={{ width: 350 }} />
                  )}
                </FormItem>
              </Row>
            </Form>
          </Modal>
          {userinfoVisible && <Modal
            title="个人信息"
            visible={userinfoVisible}
            onCancel={e => handleUserCancel()}
            footer={[
              <Button key="back" type="primary" onClick={e => handleUserCancel()}>关闭</Button>,
            ]}
            width={500}
          >
            <Form layout="inline" >
              <Row>
                <Col span={12}>
                  <FormItem label="员工号"  >
                    <span>{userList.userCode}</span>
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem label="登录名"  >
                    <span>{userList.loginName}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <FormItem label="机构"  >
                    <span>{userList.orgName}</span>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Tabs type="card">
                  <TabPane tab="基本资料" key="1">
                    <Row>
                      <Col span={12}>
                        <FormItem label="中文姓名"  >
                          <span>{userList.userName}</span>
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem label="姓名拼音"  >
                          <span>{userList.spellName}</span>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem label="用户状态"  >
                          <span>{userList.userStatusText}</span>
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem label="性别"  >
                          <span>{userList.genderText}</span>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem label="证件类型"  >
                          <span>{userList.userIdTypeText}</span>
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem label="证件号码"  >
                          <span>{userList.userIdNo}</span>
                        </FormItem>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={12}>
                        <FormItem label="生效日期"  >
                          <span>{userList.userEffectiveDate}</span>
                        </FormItem>
                      </Col>
                      <Col span={12}>
                        <FormItem label="失效日期"  >
                          <span>{userList.userExpireDate}</span>
                        </FormItem>
                      </Col>
                    </Row>
                  </TabPane>
                  <TabPane tab="业务功能" key="2">
                    <Row>
                       {/* <CheckboxGroup options={plainOptions} value={checkList} disabled />*/}
                      <Checkbox.Group style={{ width: '100%' }}value={checkList} disabled  >
                        <Row>
                          {plainOptions&&plainOptions.map((item,index)=>
                            <Col span={8}><Checkbox value={item.value}>{item.label}</Checkbox></Col>
                          )}
                        </Row>
                      </Checkbox.Group>
                    </Row>
                  </TabPane>
                </Tabs>
              </Row>
            </Form>
          </Modal>}
          <Content>
            <Bread {...breadProps} />
            {children}
          </Content>
          <Footer >
            {config.footerText}
          </Footer>
        </Layout>
      </Layout>
    </div>


  )
}

App.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  app: PropTypes.object,
  userSetting: PropTypes.object,
  loading: PropTypes.object,
}

export default withRouter(connect(({ app, loading }) => ({ app, loading }))(Form.create()(App)))
