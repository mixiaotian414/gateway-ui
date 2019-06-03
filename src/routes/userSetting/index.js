import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import { DropOption } from 'components'
import { GifButton, MenuButton } from 'components'
import { LocaleProvider, Button, Select, Tabs, Table, Card, Form, Input, Modal, Menu, Tree, Dropdown, Icon, Badge, Row, Col, Divider, message, DatePicker, Pagination, TreeSelect, Checkbox } from 'antd'
import styles from './index.less'
import moment from 'moment';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import lodash from 'lodash'

/**
 * @title:用户管理
 * @author:chenshuai
 * @time:2018/4/18
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const Option = Select.Option
const { TabPane } = Tabs
const Search = Input.Search
const { RangePicker } = DatePicker
const confirm = Modal.confirm
const TreeNode = TreeSelect.TreeNode;
const CheckboxGroup = Checkbox.Group;

class userSetting extends React.Component {

  state = {
    userVisible: false,
    modalVisible: false,
    modalVisibleUpdate: false,
    selectedRows: [],
    formValues: {},
    btnStatus: [],
    modaltitle: "",
    startValue: null,
    endValue: null,
    start_date: '',
    end_date: '',
    endOpen: false,
    selectedRowKeys: [],
    userid: "",
    usercode: "",
    treeData: [],
    plainOptions: [],
    defaultCheckedList: [],
    checkedList: [],
    indeterminate: false,
    checkAll: false,

  }
  componentDidMount = () => {
    this.props.dispatch({
      type: 'userSetting/query',
    })
  }
  //设置生效时间与失效时间，（生效时间《=失效时间）
  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
  }
  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    const sta = value.format('YYYY-MM-DD')
    this.setState({
      start_date: sta
    })
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    const end = value.format('YYYY-MM-DD')
    this.setState({
      end_date: end
    })
    this.onChange('endValue', value);
  }

  getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');





  //性别下拉列表
  getGenderType() {
    if (this.props.userSetting.getGenderTypeList[0]) {
      const array = this.props.userSetting.getGenderTypeList

      const select_list = array.length && array.map(k => ({ ...k, dict_Name: `${k.dictName}`, dict_Value: `${k.dictValue}` }));
      if (select_list.length > 0) {
        return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Option>)
      }
      return null;
    }
  }
  //用户类型下拉列表
  getUserType() {
    if (this.props.userSetting.getUserTypeList[0]) {
      const array = this.props.userSetting.getUserTypeList
      const select_list = array.length && array.map(k => ({
        ...k,
        dict_Name: `${k.dictName}`,
        dict_Value: `${k.dictValue}`
      }));
      if (select_list.length > 0) {
        return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name}
          value={k.dict_Value}>{k.dict_Name}</Option>)
      }
      return null;
    }
  }
  //用户证件类型下拉列表
  getUserIdType() {
    if (this.props.userSetting.getUserIdTypeList[0]) {
      const array = this.props.userSetting.getUserIdTypeList
      const select_list = array.length && array.map(k => ({
        ...k,
        dict_Name: `${k.dictName}`,
        dict_Value: `${k.dictValue}`
      }));
      if (select_list.length > 0) {
        return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name}
          value={k.dict_Value}>{k.dict_Name}</Option>)
      }
      return null;
    }
  }
  //初始化selectedRowKeys已被勾选中的数据
  componentWillReceiveProps = () => {
    this.setState({
      selectedRowKeys: this.props.userSetting.roleIds,
    })

  }

  //用户锁定按钮
  Locking = (record) => {
    this.props.dispatch({
      type: 'userSetting/UserLockOrUnlock',
      payload: {
        lockStatus: '0',
        userId: record.userId
      }
    })
  }
  //用户解锁按钮
  Unlock = (record) => {
    this.props.dispatch({
      type: 'userSetting/UserLockOrUnlock',
      payload: {
        lockStatus: '1',
        userId: record.userId
      }
    })
  }
  onChangeBox = (checkedList) => {
    this.setState({
      checkedList,
      indeterminate: !!checkedList.length && (checkedList.length < this.state.plainOptions.length),
      checkAll: checkedList.length === this.state.plainOptions.length,
    });
  }

  render() {
    const FormItem = Form.Item
    const { getFieldDecorator, validateFieldsAndScroll, getFieldsValue, setFieldsValue } = this.props.form
    //获取功能集合
    const funclist = this.props.app.funcList
    //功能按钮组
    const menuDelete = funclist.map((item, key) => (item.funcCode === "100202" && item.isRole === true ? <Menu.Item key='100202'>删除</Menu.Item> : null))
    const menuUpdate = funclist.map((item, key) => (item.funcCode === "100203" && item.isRole === true ? <Menu.Item key='100203'>编辑</Menu.Item> : null))
    const menuPasswordReset = funclist.map((item, key) => (item.funcCode === "100204" && item.isRole === true ? <Menu.Item key='100204'>密码重置</Menu.Item> : null))
    const menuRole = funclist.map((item, key) => (item.funcCode === "100205" && item.isRole === true ? <Menu.Item key='100205'>角色关联</Menu.Item> : null))
    const menuLocking = funclist.map((item, key) => (item.funcCode === "100207" && item.isRole === true ? <Menu.Item key='100207'>锁定</Menu.Item> : null))
    const menuUnlock = funclist.map((item, key) => (item.funcCode === "100208" && item.isRole === true ? <Menu.Item key='100208'>解锁</Menu.Item> : null))

    const onCheckAllChange = (e) => {
      let checkL = []
      this.props.userSetting.bussList.map((item) => {
        if (item) {
          checkL.push(item.businessCode)
        }
      })
      this.setState({
        checkedList: e.target.checked ? checkL : [],
        indeterminate: false,
        checkAll: e.target.checked,
      });
      const fields = getFieldsValue()
      const newFields = {
        ...fields,
        bussIds: e.target.checked ? checkL : []
      }
      setFieldsValue(newFields)
    }

    const handleMenuClick = (record, e) => {
      if (e.key === '100203') {
        updateState(e, this.props.app.user.appId, record.userCode, record.userId, record)
      } else if (e.key === '100202') {
        remove(e, this.props.app.user.appId, record.userCode, record)
      } else if (e.key === '100204') {
        passwordreset(e, this.props.app.user.appId, record.userId, record.userCode)
      } else if (e.key === '100205') {
        roleallrole(e, this.props.app.user.appId, record.userId, record.userCode)
      } else if (e.key === '100207') {
        this.Locking(record)
      } else if (e.key === '100208') {
        this.Unlock(record)
      }
    }
    const columns = [
      {
        title: '员工号',
        dataIndex: 'userCode',
        key: 'userCode',
      }, {
        title: '用户名称',
        dataIndex: 'userName',
        key: 'userName',
      }, {
        title: '角色',
        dataIndex: 'roleName',
        key: 'roleName',
      }, {
        title: '状态',
        dataIndex: 'userStatusText',
        key: 'userStatusText',
      }, {
        title: '是否锁定',
        dataIndex: 'lockStatus',
        key: 'lockStatus',
        render: (text) => {
          if (text == 1) {
            return "未锁定"
          } else {
            return "锁定"
          }
        }
      }, {
        title: '所属机构',
        dataIndex: 'orgName',
        key: 'orgName',
      }, {
        title: '操作',
        render: (text, record) => {
          if (this.props.app.user.loginName == 'admin') {
            return (
              <Dropdown
                overlay={<Menu onClick={e => handleMenuClick(record, e)}>
                  {menuDelete}{menuUpdate}{record.lockStatus == 0 ? menuUnlock : menuLocking}{menuPasswordReset}{menuRole}
                </Menu>}
              >
                <Button style={{ border: 'none' }}>
                  <Icon style={{ marginRight: 2 }} type="bars" />
                  <Icon type="down" />
                </Button>
              </Dropdown>
            )
          } else {
            return (
              <Dropdown
                overlay={<Menu onClick={e => handleMenuClick(record, e)}>
                  {menuDelete}{menuUpdate}{menuPasswordReset}{menuRole}
                </Menu>}
              >
                <Button style={{ border: 'none' }}>
                  <Icon style={{ marginRight: 2 }} type="bars" />
                  <Icon type="down" />
                </Button>
              </Dropdown>
            )
          }
        }
      }
    ]
    const jiaose = [
      {
        title: '系统名称',
        dataIndex: 'appName',
        key: 'appName',
      }, {
        title: '角色名称',
        dataIndex: 'roleName',
        key: 'roleName',
      }, {
        title: '角色类型',
        dataIndex: 'roleTypeText',
        key: 'roleTypeText',
      },
    ]

    const { userSetting: { pagination, list, formValues, item, queryPersonnelrolelist, roleIds, ids, organizationtreelist } } = this.props

    const handleTableChange = (pagination, filtersArg, sorter) => {
      const { dispatch } = this.props;
      const userName = this.props.form.getFieldValue("userName");
      const userCode = this.props.form.getFieldValue("userCode");
      const filters = Object.keys(filtersArg).reduce((obj, key) => {
        const newObj = { ...obj };
        newObj[key] = this.getValue(filtersArg[key]);
        return newObj;
      }, {});
      const params = {
        page: pagination.current,
        pageSize: pagination.pageSize,
        userName: userName || '',
        userCode: userCode || '',
        ...formValues,
        ...filters,
      };
      if (sorter.field) {
        params.sorter = `${sorter.field}_${sorter.order}`;
      }
      dispatch({
        type: 'userSetting/query',
        payload: params,
      });
    }
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    };
    //用户模糊查询
    const handleSearch = (e) => {
      e.preventDefault()
      const { dispatch } = this.props
      const userName = this.props.form.getFieldValue("userName");
      const userCode = this.props.form.getFieldValue("userCode");
      const values = {
        ...formValues,
        userName: userName || '',
        userCode: userCode || '',
        page: 1,
        pageSize: 10,
      }
      dispatch({
        type: 'userSetting/query',
        payload: values,
      })
    }
    //角色模糊查询
    const handleRoleSearch = (e) => {
      e.preventDefault()
      const { dispatch } = this.props
      const roleName = this.props.form.getFieldValue("roleNameSelect");
      dispatch({
        type: 'userSetting/queryPersonnelrole',
        payload: {
          appId: this.props.app.user.appId,
          roleName: roleName || '',
        }
      })
    }

    const formItemLayout = {
      labelCol: {
        span: 3
      },
      wrapperCol: {
        span: 14
      },
    };
    //重置
    const handleFormReset = () => {
      const { form } = this.props;
      form.resetFields();
    }
    //新增弹窗
    const addState = () => {
      this.props.form.resetFields()
      this.props.dispatch({
        type: 'userSetting/organizationtree',
        payload: {
          appId: this.props.app.user.appId,
          orgId: this.props.app.user.orgId,

        }
      })
      this.props.dispatch({
        type: 'userSetting/userbusslist',
        payload: {
          appId: this.props.app.user.appId,
        }
      }).then(() => {
        let busslist = []
        this.props.userSetting.bussList.map((item) => {
          if (item) {
            busslist.push({
              label: item.businessName,
              value: item.businessCode,
            })
          }
        })
        handleModalVisible(true)
        this.setState({
          btnStatus: 2,
          modaltitle: "用户新增",
          plainOptions: busslist
        })
      })


    }
    //角色关联列表
    const roleallrole = (e, appId, userId, userCode) => {
      handleModalVisibleUser(true)
      this.setState({
        userid: userId,
        usercode: userCode,
      })
      //角色关联列表
      this.props.dispatch({
        type: 'userSetting/queryPersonnelrole',
        payload: {
          appId: appId,
          userId:userId,
        }
      })
      //已关联的角色列表
      this.props.dispatch({
        type: 'userSetting/userchecklist',
        payload: {
          appId: appId,
          userId: userId,
        }
      })
    }
    //角色关联保存
    const okHandleUserRole = () => {
      this.props.dispatch({
        type: 'userSetting/useruserrole',
        payload: {
          appId: this.props.app.user.appId,
          userId: this.state.userid,
          userCode: this.state.usercode,
          roles: selectedRowKeys,
        },
      });
      this.setState({
        userVisible: false
      })

    }
    //用户修改回显
    const updateState = (e, appId, userCode, userId, record) => {
      this.props.form.resetFields()
      this.props.dispatch({
        type: 'userSetting/organizationtree',
        payload: {
          appId: this.props.app.user.appId,
          orgId: this.props.app.user.orgId,

        }
      })
      this.props.dispatch({
        type: 'userSetting/queryid',
        payload: {
          appId: appId,
          userCode: userCode,
          userId: userId,
        },
      });
      if ((this.state.start_date == '' || this.state.start_date == undefined) && (this.state.end_date == '' || this.state.end_date == undefined)) {
        this.setState({
          start_date: record.userEffectiveDate,
          end_date: record.userExpireDate,
        })
      }
      this.props.dispatch({
        type: 'userSetting/userbusslist',
        payload: {
          appId: appId,
          userId: userId,
        }
      }).then(() => {
        let busslistex = []
        this.props.userSetting.bussList.map((item) => {
          if (item) {
            busslistex.push({
              label: item.businessName,
              value: item.businessCode,
            })
          }
        })
        this.setState({
          btnStatus: 1,
          modaltitle: "用户修改",
          plainOptions: busslistex,
          checkedList: this.props.userSetting.checkList
        })
        handleModalVisible(true)
      })
    }

    const handleModalVisible = (flag) => {
      this.setState({
        modalVisible: !!flag,
      });
    }

    const handleModalVisibleUser = (flag) => {
      this.setState({
        userVisible: !!flag,
      });
    }
    //model保存
    const okHandle = () => {
      if (this.state.btnStatus === 1) {
        okHandleUpdate()
      }
      if (this.state.btnStatus === 2) {
        okHandleAdd()
      }
    }
    //用户新增保存
    const okHandleAdd = () => {
      const { form, dispatch } = this.props
      form.validateFields((err, fieldsValue) => {
        if (err) return
        dispatch({
          type: 'userSetting/add',
          payload: {
            appId: this.props.app.user.appId,
            userCode: fieldsValue.userCodeadd,
            loginName: fieldsValue.loginNameadd,
            orgId: fieldsValue.orgIdadd,
            userName: fieldsValue.userNameadd,
            spellName: fieldsValue.spellNameadd,
            userStatus: fieldsValue.userStatusadd,
            gender: fieldsValue.genderadd,
            userIdType: fieldsValue.userIdTypeadd,
            userIdNo: fieldsValue.userIdNoadd,
            userEffectiveDate: this.state.start_date,
            userExpireDate: this.state.end_date,
            bussIds: fieldsValue.bussIds,
          },
        })
        form.resetFields()
        this.setState({
          modalVisible: false,
        })
      })
    }
    //用户修改保存
    const okHandleUpdate = () => {
      const { form, dispatch } = this.props
      const orgname1 = this.props.form.getFieldValue("orgIdadd");
      if (orgname1 === item.orgName) {
        form.validateFields((err, fieldsValue) => {
          if (err) return
          dispatch({
            type: 'userSetting/update',
            payload: {
              appId: fieldsValue.appIdadd,
              userCode: fieldsValue.userCodeadd,
              loginName: fieldsValue.loginNameadd,
              userId: fieldsValue.userIdadd,
              orgId: item.orgId,
              userName: fieldsValue.userNameadd,
              spellName: fieldsValue.spellNameadd,
              userStatus: fieldsValue.userStatusadd,
              gender: fieldsValue.genderadd,
              userIdType: fieldsValue.userIdTypeadd,
              userIdNo: fieldsValue.userIdNoadd,
              userEffectiveDate: this.state.start_date,
              userExpireDate: this.state.end_date,
              bussIds: fieldsValue.bussIds,
            },
          })

          this.setState({
            modalVisible: false,
          })
        })
      } else {
        form.validateFields((err, fieldsValue) => {
          if (err) return
          dispatch({
            type: 'userSetting/update',
            payload: {
              appId: fieldsValue.appIdadd,
              userCode: fieldsValue.userCodeadd,
              loginName: fieldsValue.loginNameadd,
              userId: fieldsValue.userIdadd,
              orgId: fieldsValue.orgIdadd,
              userName: fieldsValue.userNameadd,
              spellName: fieldsValue.spellNameadd,
              userStatus: fieldsValue.userStatusadd,
              gender: fieldsValue.genderadd,
              userIdType: fieldsValue.userIdTypeadd,
              userIdNo: fieldsValue.userIdNoadd,
              userEffectiveDate: this.state.start_date,
              userExpireDate: this.state.end_date,
              bussIds: fieldsValue.bussIds,
            },
          })

          this.setState({
            modalVisible: false,
          })
        })
      }

    }

    //用户删除
    const remove = (e, appId, userCode, record) => {
      const { dispatch } = this.props
      if (record.loginName === "admin") {
        Modal.warning({
          title: '此用户为超级管理员无法删除!',
          okText: "取消",
        });
      } else {
        confirm({
          title: '确定删除此用户吗?',
          okText: "确定",
          cancelText: "取消",
          onOk() {
            dispatch({
              type: 'userSetting/delete',
              payload: {
                appId: appId,
                userCode: userCode,
                userId: record.userId,
              },
            })
          },
        })
      }

    }
    //密码重置
    const passwordreset = (e, appId, userId, userCode) => {
      const { dispatch } = this.props
      confirm({
        title: '确定密码重置吗?',
        okText: "确定",
        cancelText: "取消",
        onOk() {
          dispatch({
            type: 'userSetting/passwordreset',
            payload: {
              appId: appId,
              userId: userId,
              userCode: userCode,
            },
          })
        },
      })
    }
    //角色关联列表勾选取值
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      ids,
      onChange: (record, e) => {
        this.setState({
          selectedRowKeys: record,
        })
      },
      onSelectInvert: (record) => {
        this.props.dispatch({
          type: 'userSetting/updateState',
          payload: {
            selectedRowKeys: record,
            ids: e,
          },
        })
      }
    }

    const dateFormat = 'YYYY-MM-DD';

    //遍历树形
    const loop = data => data.map((item) => {
      if (item.children) {
        return <TreeNode key={item.orgId} title={item.orgName} value={item.orgId} isLeaf={item.isLeaf} dataRef={item} >
          {loop(item.children)}
        </TreeNode >
      }
      return <TreeNode key={item.orgId} title={item.orgName} value={item.orgId} isLeaf={item.isLeaf} dataRef={item} />
    })

    //鼠标失去焦点判断员工号是否唯一
    const onBlurChange = () => {
      const usercode = this.props.form.getFieldValue("userCodeadd")
      this.props.dispatch({
        type: 'app/validateVal',
        payload: {
          tab: 'ap_user',
          col: 'USER_CODE',
          val: usercode,
        },
      }).then(() => {
        if (this.props.app.flag) {
          message.error("该员工号:" + "【" + usercode + "】" + "已存在,请重新输入")
          this.props.form.resetFields("userCodeadd")
        }
      })

    }
    //异步处理树形
    const onLoadData = (treeNode) => {
      this.props.dispatch({
        type: 'userSetting/organizationtreetwo',
        payload: {
          appId: this.props.app.user.appId,
          parentOrgId: treeNode.props.eventKey
        }
      })
      return new Promise((resolve) => {
        if (treeNode.props.children) {
          resolve();
          return;
        }
        setTimeout(() => {
          treeNode.props.dataRef.children = this.props.userSetting.organizationtreelisttwo
          this.setState({
            treeData: this.props.userSetting.organizationtreelist,
          });
          resolve();
        }, 1000);
      });
    }


    return (
        <div className={styles.divbackground}>
          <Row>
            <Form layout="inline" ref="form" onSubmit={handleSearch}>
              <FormItem label="中文姓名" >
                {getFieldDecorator('userName', {
                })(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
              <FormItem label="员工号"  >
                {getFieldDecorator('userCode', {
                })(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
              <FormItem>
                <Button type="primary" loading={this.props.loading.effects['userSetting/query']} htmlType="submit" >查询</Button>
              </FormItem>
              <FormItem>
                <Button onClick={handleFormReset} htmlType="submit" >重置</Button>
              </FormItem>
            </Form>
          </Row>
          <Row style={{ marginTop: '10px' }}>
            <Col>
              <GifButton FuncListBtn={funclist} onBtnClick={() => addState()} btnCode="100201" btnType="primary" btnIcon="plus" btnText="新建" />
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Table
                //rowSelection={rowSelection}
                style={{ paddingLeft: '0px', paddingTop: '10px' }}
                bordered
                fixed
                rowKey={record => record.userId}
                columns={columns}
                dataSource={list}
                pagination={paginationProps}
                onChange={handleTableChange}
                loading={this.props.loading.effects['userSetting/query']}
              >
              </Table>
            </Col>
          </Row>
          {this.state.modalVisible &&
            <Modal
              title={this.state.modaltitle}
              wrapClassName="vertical-center-modal"
              visible={this.state.modalVisible}
              onOk={okHandle}
              onCancel={() => handleModalVisible()}
              okText="确定" cancelText="取消"
              width={600}
            ><Form layout="horizontal">
                <Row>
                  <Col span={12}>
                    {this.state.modaltitle == "用户新增" ?
                      <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="员工号" hasFeedback >
                        {getFieldDecorator('userCodeadd', {
                          initialValue: this.state.modaltitle == "用户新增" ? null : item.userCode,
                          rules: [{
                            required: true,
                            validator: (rule, value, callback) => {

                              if (!(/^[A-Za-z0-9]{1,7}$/.test(value))) {
                                callback('【请输入"英文"或"数字"长度不能超过"7"位】')
                              }
                              else {
                                callback();
                              }
                            }
                          }, {
                            required: true,
                            message: '【员工号不能为"空"】',
                          },
                          ],

                        })(
                          <Input onBlur={onBlurChange} placeholder="请输入" />
                        )}
                      </FormItem>
                      : <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="员工号" >
                        {getFieldDecorator('userCodeadd', {
                          initialValue: this.state.modaltitle == "用户新增" ? null : item.userCode,
                          rules: [{
                            required: true,
                            validator: (rule, value, callback) => {

                              if (!(/^[A-Za-z0-9]{1,7}$/.test(value))) {
                                callback('【请输入"英文"或"数字"长度不能超过"7"位】')
                              }
                              else {
                                callback();
                              }
                            }
                          }, {
                            required: true,
                            message: '【员工号不能为"空"】',
                          },
                          ],

                        })(
                          <Input onBlur={onBlurChange} placeholder="请输入" disabled />
                        )}
                      </FormItem>
                    }

                  </Col>
                  <Col span={12}>
                    <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="登录名" hasFeedback >
                      {getFieldDecorator('loginNameadd', {
                        rules: [{
                          required: true,
                          validator: (rule, value, callback) => {
                            if (!(/^[A-Za-z0-9]+$/.test(value))) {
                              callback('【请输入"英文"或"数字"】')
                            }
                            else {
                              callback();
                            }
                          }
                        },
                        {
                          required: true,
                          message: '【登录名不能为"空"】',
                        },
                        ],
                        initialValue: this.state.modaltitle == "用户新增" ? null : item.loginName,
                      })(
                        <Input placeholder="请输入" />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <FormItem {...formItemLayout} label="机构" hasFeedback >

                      {getFieldDecorator('orgIdadd', {
                        initialValue: this.state.modaltitle == "用户新增" ? undefined : item.orgName,
                        rules: [
                          {
                            required: true,
                            message: '【机构不能为"空"】',
                          }]
                      })(
                        <TreeSelect
                          style={{ width: 435 }}
                          loadData={onLoadData}
                          placeholder="请选择"
                          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                        >
                          {loop(organizationtreelist)}
                        </TreeSelect>
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Tabs type="card">
                    <TabPane tab="基本资料" key="1">
                      <Row>
                        <Col span={12}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="中文姓名" hasFeedback >
                            {getFieldDecorator('userNameadd', {
                              rules: [{
                                required: true,
                                validator: (rule, value, callback) => {
                                  if (!(/[\u4E00-\u9FA5]/.test(value))) {
                                    callback('【请输入"中文汉字"】')
                                  }
                                  else {
                                    callback();
                                  }
                                }
                              }
                              ],
                              initialValue: this.state.modaltitle == "用户新增" ? null : item.userName,
                            })(
                              <Input placeholder="请输入" />
                            )}
                          </FormItem>
                        </Col>
                        <Col span={12}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="姓名拼音" hasFeedback >
                            {getFieldDecorator('spellNameadd', {
                              initialValue: this.state.modaltitle == "用户新增" ? null : item.spellName,
                              rules: [{
                                validator: (rule, value, callback) => {

                                  if (!(/^[a-zA-Z]+$/.test(value))) {
                                    callback('【请输入"英文"】')
                                  }
                                  else {
                                    callback();
                                  }
                                }
                              }
                              ],
                            })(
                              <Input placeholder="请输入" />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="用户状态" hasFeedback >
                            {getFieldDecorator('userStatusadd', {
                              initialValue: this.state.modaltitle == "用户新增" ? this.props.userSetting.getUserTypeList[1].dictValue : item.userStatus,
                            })(
                              <Select placeholder="请选择"  >
                                {this.getUserType()}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={12}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="性别" hasFeedback >
                            {getFieldDecorator('genderadd', {
                              initialValue: this.state.modaltitle == "用户新增" ? this.props.userSetting.getGenderTypeList[0].dictValue : item.gender,
                            })(
                              <Select placeholder="请选择"  >
                                {this.getGenderType()}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="证件类型" hasFeedback >
                            {getFieldDecorator('userIdTypeadd', {
                              initialValue: this.state.modaltitle == "用户新增" ? this.props.userSetting.getUserIdTypeList[0].dictValue : item.userIdType,
                            })(
                              <Select placeholder="请选择"  >
                                {this.getUserIdType()}
                              </Select>
                            )}
                          </FormItem>
                        </Col>
                        <Col span={12}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="证件号码" hasFeedback >
                            {getFieldDecorator('userIdNoadd', {
                              initialValue: this.state.modaltitle == "用户新增" ? null : item.userIdNo,
                              rules: [{
                                required: true,
                                validator: (rule, value, callback) => {
                                  if (!(/^\d{15}|\d{}18$/.test(value))) {
                                    callback('【请输入"15"或"18"位数字】')
                                  }
                                  else {
                                    callback();
                                  }
                                }
                              }
                              ],
                            })(
                              <Input placeholder="请输入" />
                            )}
                          </FormItem>
                        </Col>
                      </Row>
                      <Row>
                        <Col span={12}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="生效日期" hasFeedback >
                            {getFieldDecorator('start_date', {
                              initialValue: this.state.modaltitle == "用户新增" ? null : moment(item.userEffectiveDate, dateFormat),
                              rules: [{
                                required: true,
                                message: '【生效日期不能为"空"】',
                              }
                              ],
                            })(
                              <DatePicker
                                allowClear={false}
                                placeholder="生效日期"
                                disabledDate={this.disabledStartDate}
                                onChange={this.onStartChange}
                                onOpenChange={this.handleStartOpenChange}
                                format={dateFormat}
                              />)}
                          </FormItem>
                        </Col>
                        <Col span={12}>
                          <FormItem labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="失效日期" hasFeedback >
                            {getFieldDecorator('end_date', {
                              initialValue: this.state.modaltitle == "用户新增" ? null : moment(item.userExpireDate, dateFormat),
                              rules: [{
                                required: true,
                                message: '【失效日期不能为"空"】',
                              }
                              ],
                            })(
                              <DatePicker
                                allowClear={false}
                                placeholder="失效日期"
                                disabledDate={this.disabledEndDate}
                                onChange={this.onEndChange}
                                open={this.state.endOpen}
                                onOpenChange={this.handleEndOpenChange}
                                format={dateFormat}
                              />)}
                          </FormItem>
                          {getFieldDecorator('userIdadd', {
                            initialValue: this.state.modaltitle == "用户新增" ? undefined : item.userId,
                          })(
                            <Input type="hidden" />
                          )}
                          {getFieldDecorator('appIdadd', {
                            initialValue: this.state.modaltitle == "用户新增" ? undefined : item.appId,
                          })(
                            <Input type="hidden" />
                          )}
                        </Col>
                      </Row>
                    </TabPane>
                    <TabPane tab="业务功能" key="2">
                      <Card style={{ width: '542px', height: '205px' }}>
                        <Row>
                          <Checkbox
                            indeterminate={this.state.indeterminate}
                            onChange={onCheckAllChange}
                            checked={this.state.checkAll}
                          >
                            全选
                        </Checkbox>
                        </Row>

                        <Row>
                          {getFieldDecorator('bussIds', {
                            initialValue: this.state.modaltitle == "用户新增" ? undefined : this.state.checkedList,
                          })(
                            <Checkbox.Group style={{ width: '100%' }} onChange={this.onChangeBox}>
                              <Row>
                                {this.state.plainOptions&&this.state.plainOptions.map((item,index)=>
                                  <Col span={8}><Checkbox value={item.value}>{item.label}</Checkbox></Col>
                                )}
                              </Row>
                            </Checkbox.Group>
                          )}
                        </Row>
                      </Card>

                    </TabPane>
                  </Tabs>
                </Row>
              </Form>
            </Modal>}
          <Modal
            visible={this.state.userVisible}
            wrapClassName="vertical-center-modal"
            title="角色关联列表"
            onCancel={() => handleModalVisibleUser()}
            onOk={okHandleUserRole}
            width={700}
            okText="确定" cancelText="取消"
          >
            <Form layout="inline" onSubmit={handleRoleSearch}>
              <FormItem label="角色名称" >
                {getFieldDecorator('roleNameSelect', {
                })(
                  <Input placeholder="请输入" />
                )}
              </FormItem>
              <FormItem >
                <Button type="primary" loading={this.props.loading.effects['userSetting/queryPersonnelrole']} htmlType="submit" >查询</Button>
              </FormItem>
              <FormItem>
                <Button onClick={handleFormReset} htmlType="submit" >重置</Button>
              </FormItem>

              <Table
                bordered={false}
                style={{ paddingLeft: '0px', paddingTop: '10px' }}
                rowSelection={rowSelection}
                rowKey={record => record.roleId}
                scroll={{ y: 300 }}
                size="small"
                rowClassName={(record, index) => index % 2 === 0 ? styles.tableindexcolor : ''}
                columns={jiaose}
                dataSource={queryPersonnelrolelist}
                pagination={false}
                loading={this.props.loading.effects['userSetting/queryPersonnelrole']}
              >
              </Table>
            </Form>

          </Modal>
        </div>
    )
  }
}
export default connect(({ userSetting, loading, app }) => ({ userSetting, loading, app }))(Form.create()(userSetting))
