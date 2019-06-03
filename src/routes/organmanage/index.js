import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import { Button, Select, Form,Table, Input, Row, Col, Tree, Switch, Modal, Menu,Tabs, Icon, Card , Divider,message,TreeSelect} from 'antd'
import { arrayToTree, queryArray } from 'utils'
import styles from './index.less'

/**
 * @title:机构管理
 * @author:duhaonan
 * @time:2018/4/22
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const TreeNode = Tree.TreeNode
const confirm = Modal.confirm
const { TabPane } = Tabs
const Option = Select.Option;

class organmanage extends Component {
    state = {
      modalVisible: false,
      expandedKeys: [],
      autoExpandParent: true,
      selectedKeys: [],
      visible: false,
      tempStyle: {},
      formValues: {},
      rightkey: {},
      btnStatus: [],
      modaltitle: "",
      menuVisible:true,
    };
  componentDidMount=()=>{
    this.props.dispatch({
      type: 'organmanage/query',
    }).then(()=>{
      this.setState({
        expandedKeys:[this.props.organmanage.list[0].orgId],
        selectedKeys:[this.props.organmanage.list[1].orgId]
      })
      this.props.dispatch({
        type: 'organmanage/queryid',
        payload: {
          appId:this.props.app.user.appId,
          orgId:this.props.organmanage.list[1].orgId,
          parentOrgId:this.props.organmanage.list[1].parentOrgId,
        },
      })
      this.props.dispatch({
        type: 'organmanage/queryPersonnel',
        payload: {
          appId:this.props.app.user.appId,
          orgId:this.props.organmanage.list[1].orgId,
        },
      })
    })
  }

  onSelect = (selectedKeys, info) => {
    this.props.dispatch({
      type: 'organmanage/queryid',
      payload: {
        appId:info.node.props.appId,
        orgId:info.node.props.eventKey,
        parentOrgId:info.node.props.parentOrgId,
      },
    })
    this.props.dispatch({
      type: 'organmanage/queryPersonnel',
      payload: {
        appId:info.node.props.appId,
        orgId:info.node.props.eventKey,
      },
    })
    this.setState({ selectedKeys });
  }
  onExpand = (expandedKeys) => {
    console.log('onExpand', arguments);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  getType() {
    const array = this.props.organmanage.getTypeList
    const select_list = array.length && array.map(k => ({ ...k, dict_Name: `${k.dictName}`,dict_Value: `${k.dictValue}` }));
    if (select_list.length > 0) {
      return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Option>)
    }
    return null;
  }
  render () {
    const FormItem = Form.Item
    const { getFieldDecorator } = this.props.form
    const { organmanage: { list, formValues, item, pagination, queryPersonnellist } } = this.props

    //获取功能集合
    const funclist = this.props.app.funcList
    //鼠标右键功能键
    const organAdd = funclist.map((item,key) =>(item.funcCode ==="100301"&& item.isRole === true?<Menu.Item key='100301'><a onClick={e => addState(e,this.state.rightkey.appId,this.state.rightkey.orgId,this.state.rightkey.parentOrgId)}><Icon type="plus-circle" />新增</a></Menu.Item>:null))
    const organUpdate = funclist.map((item,key) =>(item.funcCode ==="100303"&& item.isRole === true?<Menu.Item key='100303'><a onClick={e => updateState(e,this.state.rightkey.appId,this.state.rightkey.orgId,this.state.rightkey.parentOrgId)}><Icon type="edit" />修改</a></Menu.Item>:null))
    const organRemove = funclist.map((item,key) =>(item.funcCode ==="100302"&& item.isRole === true?<Menu.Item key='100302' style={{display:this.state.menuVisible?'block':'none'}} ><a onClick={e => remove(e, this.state.rightkey.appId,this.state.rightkey.orgId,this.state.rightkey.parentOrgId)}><Icon type="minus-circle-o" />删除</a></Menu.Item>:null))

    const renyuan = [
      {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
      },{
        title: '员工号',
        dataIndex: 'userCode',
        key: 'userCode',
      },{
        title: '性别',
        dataIndex: 'genderText',
        key: 'genderText',
      },
      {
        title: '用户状态',
        dataIndex: 'userStatusText',
        key: 'userStatusText',
      },
    ]
    //构造树形
    const organTree = arrayToTree(list.filter(_ => _.mpid !== '-1'), 'orgId', 'parentOrgId')
    //遍历树形
    const loop = data => data.map((item) => {
      if (item.children) {
        if(item.orgId==='0'){
          return (
            <TreeNode key={item.orgId} title={item.orgName} parentOrgId={item.parentOrgId} appId={item.appId} isLeaf={item.isLeaf} value={item.orgId}>
              {loop(item.children)}
            </TreeNode>
          );
        }else{
          return (
            <TreeNode key={item.orgId} title={'['+item.orgCode+']'+item.orgName} parentOrgId={item.parentOrgId} appId={item.appId} isLeaf={item.isLeaf} value={item.orgId}>
              {loop(item.children)}
            </TreeNode>
          );
        }
      }
      return <TreeNode key={item.orgId} title={'['+item.orgCode+']'+item.orgName} parentOrgId={item.parentOrgId} appId={item.appId} isLeaf={item.isLeaf} value={item.orgId} />;

    })
    const loopT = (data,id) => data.map((item) => {
      if(item.orgId===id){
        if (item.children) {
          return (
            <TreeNode disabled key={item.orgId} title={item.orgName} parentOrgId={item.parentOrgId} appId={item.appId}
                      isLeaf={item.isLeaf} value={item.orgId}>
              {loopTDisable(item.children)}
            </TreeNode>
          );
        }
        return  <TreeNode disabled key={item.orgId} title={item.orgName} parentOrgId={item.parentOrgId} appId={item.appId} isLeaf={item.isLeaf} value={item.orgId} />
      }
      if (item.children) {
        return (
          <TreeNode key={item.orgId} title={item.orgName} parentOrgId={item.parentOrgId} appId={item.appId} isLeaf={item.isLeaf} value={item.orgId}>
            {loopT(item.children,id)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.orgId} title={item.orgName} parentOrgId={item.parentOrgId} appId={item.appId} isLeaf={item.isLeaf} value={item.orgId} />;

    })
    const loopTDisable = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode disabled key={item.orgId} title={item.orgName} parentOrgId={item.parentOrgId} appId={item.appId} isLeaf={item.isLeaf} value={item.orgId}>
            {loopT(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode disabled key={item.orgId} title={item.orgName} parentOrgId={item.parentOrgId} appId={item.appId} isLeaf={item.isLeaf} value={item.orgId} />;

    })

    const handleModalVisible = (flag) => {
      this.setState({
        modalVisible: !!flag,
      })
    }


    const formItemLayout2 = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    }
    //鼠标右键菜单弹窗
    const onRightClick = (e) => {
      if(!e.node.props.isLeaf){
        this.setState({
          menuVisible:false,
        })
      }else {
        this.setState({
          menuVisible:true,
        })
      }
      const left = e.event.pageX
      const top = e.event.pageY
      this.setState({
        visible: true,
        tempStyle: {
          position: 'fixed',
          left: `${left}px`,
          top: `${top}px`,
          width: '110px',
          background: '#F0F0F0',
        },
        rightkey: {
          appId: e.node.props.appId,
          orgId: e.node.props.eventKey,
          parentOrgId: e.node.props.parentOrgId,
        },
      })
      document.onclick = function () {
        this.setState({
          visible: false,
        })
      }.bind(this)
    }



    const remove = (e,appId, orgId, parentOrgId) => {
      const { dispatch } = this.props
        confirm({
          title: '确定删除吗?',
          okText:'确定',
          cancelText:'取消',
          onOk() {
            dispatch({
              type: 'organmanage/delete',
              payload: {
                appId,
                orgId,
                parentOrgId,
              },
            })
          },
        })
    }

    const okHandle = () => {
      if (this.state.btnStatus === 1) {
        okHandleUpdate()
      }
      if (this.state.btnStatus === 2) {
        okHandleAdd()
      }
    }

    //菜单新增保存
    const okHandleAdd = () => {
      const { form, dispatch } = this.props
      form.validateFields((err, fieldsValue) => {
        if (err) return
        dispatch({
          type: 'organmanage/add',
          payload: {
            appId: fieldsValue.appId,
            parentOrgId: fieldsValue.parentOrgId,
            orgCode: fieldsValue.orgCode,
            orgName: fieldsValue.orgName,
            shortName: fieldsValue.shortName,
            orgType: fieldsValue.orgType,
            orgAddr: fieldsValue.orgAddr,
            zipcode: fieldsValue.zipcode,
            linkMan: fieldsValue.linkMan,
            linkTel: fieldsValue.linkTel,
            email: fieldsValue.email,
            sortNo: fieldsValue.sortNo,
          },
        })
        form.resetFields()
        this.setState({
          modalVisible: false,
        })

      })
    }
    //菜单修改保存
    const okHandleUpdate = () => {
      const { form, dispatch } = this.props
      form.validateFields((err, fieldsValue) => {
        if (err) return
        dispatch({
          type: 'organmanage/update',
          payload: {
            appId: fieldsValue.appId,
            orgId: fieldsValue.orgId,
            parentOrgId: fieldsValue.parentOrgId,
            orgCode: fieldsValue.orgCode,
            orgName: fieldsValue.orgName,
            shortName: fieldsValue.shortName,
            orgType: fieldsValue.orgType,
            orgAddr: fieldsValue.orgAddr,
            zipcode: fieldsValue.zipcode,
            linkMan: fieldsValue.linkMan,
            linkTel: fieldsValue.linkTel,
            email: fieldsValue.email,
            sortNo: fieldsValue.sortNo,
          },
        }).then(
          dispatch({
            type: 'organmanage/queryid',
            payload: {
              appId:fieldsValue.appId,
              orgId:fieldsValue.orgId,
              parentOrgId:fieldsValue.parentOrgId,
            },
          })
        )

        this.setState({
          modalVisible: false,
          selectedKeys:[fieldsValue.orgId]
        })
      })
    }
    //鼠标右键新增
    const addState = (e,appId,orgId,parentOrgId) => {
      this.props.form.resetFields()
      this.props.dispatch({
        type: 'organmanage/queryid',
        payload: {
          appId:appId,
          orgId:orgId,
          parentOrgId:parentOrgId,
        },
      })
      handleModalVisible(true)
      this.setState({
        btnStatus: 2,
        modaltitle:"机构新增",

      })
    }


    //鼠标右键修改回显
    const updateState = (e,appId,orgId,parentOrgId) => {
      this.props.form.resetFields()
      this.props.dispatch({
        type: 'organmanage/queryid',
        payload: {
          appId:appId,
          orgId:orgId,
          parentOrgId:parentOrgId
        },
      })
      this.setState({
        btnStatus: 1,
        modaltitle:"机构修改",
      })

      handleModalVisible(true)
    }

    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: true,
      ...pagination,
    }

    //人员明细分页（带参数）
    // const handleTableChange = (pagination, filtersArg, sorter) => {
    //   const { dispatch } = this.props
    //
    //   const filters = Object.keys(filtersArg).reduce((obj, key) => {
    //     const newObj = { ...obj }
    //     newObj[key] = this.getValue(filtersArg[key])
    //     return newObj
    //   }, {})
    //
    //   const params = {
    //     page: pagination.current,
    //     pageSize: pagination.pageSize,
    //     ...formValues,
    //     ...filters,
    //   }
    //   if (sorter.field) {
    //     params.sorter = `${sorter.field}_${sorter.order}`
    //   }
    //
    //   dispatch({
    //     type: 'organmanage/querySuccess',
    //     payload: {
    //       formValues: { ...formValues, ...filters },
    //     },
    //   })
    //
    //   dispatch({
    //     type: 'organmanage/queryPersonnel',
    //     payload: params,
    //   })
    // }

    return (
      <div className={styles.divbackground}>
        <Row>
          <Col span={8}>
            <Row style={{ marginTop: '10px' }} />
            <div style={{overflow: 'auto', width:'100%', height: '450px'}}>
            <Tree
              showLine
              onExpand={this.onExpand}
              expandedKeys={this.state.expandedKeys}
              autoExpandParent={this.state.autoExpandParent}
              onRightClick={onRightClick}
              onSelect={this.onSelect}
              selectedKeys={this.state.selectedKeys}
            >
                {loop(organTree)}
            </Tree>
            </div>
          </Col>
          <Col span={16}>
            <Tabs type="card">
              <TabPane tab="基本信息" key="1">
                <Card>
                  <Row>
                    <Col span={4}>机构名称：</Col><Col span={6}>{item.orgName}</Col>
                  </Row>
                  <Divider style={{margin:'10px'}} />
                  <Row>
                    <Col span={4}>机构号：</Col><Col span={6}>{item.orgCode}</Col>
                  </Row>
                  <Divider style={{margin:'10px'}} />
                  <Row>
                    <Col span={4}>机构地址：</Col><Col span={6}>{item.orgAddr}</Col>
                  </Row>
                  <Divider style={{margin:'10px'}} />
                  <Row>
                    <Col span={5}>机构排序号：</Col><Col span={6}>{item.sortNo}</Col>
                  </Row>
                  <Divider style={{margin:'10px'}} />
                  <Row>
                    <Col span={4}>机构类型：</Col><Col span={6}>{item.orgTypeName}</Col>
                  </Row>
                  <Divider style={{margin:'10px'}} />
                  <Row>
                    <Col span={4}>联系人：</Col><Col span={6}>{item.linkMan}</Col>
                  </Row>
                  <Divider style={{margin:'10px'}} />
                  <Row>
                    <Col span={4}>联系电话：</Col><Col span={6}>{item.linkTel}</Col>
                  </Row>
                  <Divider style={{margin:'10px'}} />
                  <Row>
                    <Col span={4}>电子邮件：</Col><Col span={6}>{item.email}</Col>
                  </Row>
                </Card>

              </TabPane>
              <TabPane tab="人员信息" key="3">
                <Table
                  style={{paddingLeft:'0px', paddingTop: '0px'}}
                  bordered={false}
                  size="small"
                  columns={renyuan}
                  rowClassName={(record, index) => index % 2  === 0 ? styles.tableindexcolor : ''}
                  dataSource={queryPersonnellist}
                  pagination={false}
                  // onChange={handleTableChange}
                  loading={this.props.loading.effects['organmanage/queryPersonnelrole']}
                >
                </Table>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
        {this.state.modalVisible && <Modal
        title={this.state.modaltitle}
        wrapClassName="vertical-center-modal"
        visible={this.state.modalVisible}
        onOk={okHandle}
        onCancel={() => handleModalVisible()}
        width={600}
        okText={"保存"}
        cancelText={"取消"}
      >
        <Form layout="horizontal"  onSubmit={okHandle}>
                {getFieldDecorator('appId', {
                  initialValue: item.appId,
                })(<Input  type="hidden"  />)}
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout2} label="机构代码" hasFeedback >
                {getFieldDecorator('orgCode', {
                  initialValue: this.state.modaltitle == "机构新增" ? undefined: item.orgCode,
                  rules: [
                    this.state.modaltitle == "机构新增" ?{
                      validator: (rule, value, callback) => {
                        console.info(value)
                        console.info(rule)
                        this.props.dispatch({
                          type: 'app/validateVal',
                          payload: {
                            tab:'ap_fd_org',
                            col:'ORG_CODE',
                            val:value
                          },
                        }).then(()=>{
                          if(this.props.app.flag){
                            callback('机构代码已存在')
                          }
                          if(!this.props.app.flag){
                            callback()
                          }
                        })

                      }
                    }:{}
                    ,
                    {
                      pattern: /^[0-9a-zA-Z]{0,11}$/g,
                      message: '请输入正确代码，代码不能为汉字且小于11位！',
                    },
                    {
                      required: true,
                      message: '机构代码不能为空',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout2} label="机构名称" hasFeedback >
                {getFieldDecorator('orgName', {
                  initialValue: this.state.modaltitle == "机构新增" ? undefined: item.orgName,
                  rules: [
                    {
                      required: true,
                      message: '机构名称不能为空',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout2} label="机构简称" hasFeedback >
                {getFieldDecorator('shortName', {
                  initialValue: this.state.modaltitle == "机构新增" ? undefined: item.shortName,
                  rules: [
                    {
                      required: true,
                      message: '机构简称不能为空',
                    },
                  ],
                })(<Input placeholder="请输入"  />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout2} label="机构类型"  >
                {getFieldDecorator('orgType', {
                  initialValue: this.state.modaltitle == "机构新增" ? this.props.organmanage.getTypeList[0].dictValue: item.orgType,
                })(<Select placeholder="请选择" >
                  {this.getType()}
                </Select>)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout2} label="父机构" >
                {getFieldDecorator('parentOrgId', {
                  initialValue: this.state.modaltitle == "机构新增" ? item.orgId: item.parentOrgId,
                })(
                  (this.state.modaltitle == "机构新增"|| item.orgId===this.props.organmanage.list[0].orgId)?<TreeSelect placeholder="请选择" disabled>{loopT(organTree)}</TreeSelect>:<TreeSelect placeholder="请选择">{loopT(organTree,item.orgId)}</TreeSelect>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout2} label="邮编" hasFeedback >
                {getFieldDecorator('zipcode', {
                  initialValue: this.state.modaltitle == "机构新增" ? undefined: item.zipcode,
                  rules: [
                    {
                      pattern: /^[0-9]{6}$/,
                      message: '请输入正确的邮编！',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout2} label="联系人"  >
                {getFieldDecorator('linkMan', {
                  initialValue: this.state.modaltitle == "机构新增" ? undefined: item.linkMan,
                })(<Input placeholder="请输入"  />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout2} label="联系电话" hasFeedback>
                {getFieldDecorator('linkTel', {
                  initialValue: this.state.modaltitle == "机构新增" ? undefined: item.linkTel,
                  rules: [
                    {
                      pattern: /^(\d{3}-)(\d{8})$|^(\d{4}-)(\d{7})$|^(\d{4}-)(\d{8})$/,
                      message: '请输入正确的座机号码格式！',
                    },
                  ],
                })(<Input placeholder="请输入"  />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout2} label="电子邮件" hasFeedback >
                {getFieldDecorator('email', {
                  initialValue: this.state.modaltitle == "机构新增" ? undefined: item.email,
                  rules: [
                    {
                      pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                      message: '请输入正确的邮箱地址！',
                    },
                  ],
                })(<Input placeholder="请输入"  />)}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout2} label="机构排序号" >
                {getFieldDecorator('sortNo', {
                  initialValue: this.state.modaltitle == "机构新增" ? undefined: item.sortNo,
                })(<Input placeholder="请输入"  />)}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem {...formItemLayout2} label="机构地址"  >
                {getFieldDecorator('orgAddr', {
                  initialValue: this.state.modaltitle == "机构新增" ? undefined: item.orgAddr,
                })(<Input placeholder="请输入"  style={{width:'300%'}}/>)}
              </FormItem>
            </Col>
          </Row>
              {getFieldDecorator('orgId', {
                initialValue: item.orgId,
              })(
                <Input type="hidden" />
              )}
        </Form>
      </Modal>}
        <Menu
          visible={this.state.visible}
          style={this.state.tempStyle}
        >
            {organAdd}
            {organUpdate}
            {organRemove}
        </Menu>


      </div>
    )
  }
}

export default connect(({ organmanage,app, loading }) => ({ organmanage,app, loading }))(Form.create()(organmanage))
