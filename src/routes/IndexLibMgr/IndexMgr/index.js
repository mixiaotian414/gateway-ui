import React,{ Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'dva'
import { Button, Select, Form,Table, Input, Row, Col, Tree, Switch, Modal, Menu,Tabs, Icon, Card , Divider,message,TreeSelect } from 'antd'
import { arrayToTree, queryArray,request } from 'utils'
import styles from './index.less'
import Filter from './components/StateFilter'
import List from './components/StateList'
import { Page } from 'components'
import CreateModel from './components/CreateModel'
import classnames from 'classnames'
/**
 * @title:指标管理
 * @author:mixiaotian
 * @time:2019/4/10
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const TreeNode = Tree.TreeNode
const confirm = Modal.confirm
const { TabPane } = Tabs
const Option = Select.Option;

class IndexMgr extends Component {
  state = {
    modalVisible: false,
    expandedKeys: [],
    autoExpandParent: true,
    selectedKeys: [],
    selectInfo: {//选中的目录
      name:"",
      value:"",
    },
    visible: false,
    tempStyle: {},
    formValues: {},
    rightkey: {
      id: "",
      parentId:"",
      modeltitle: "",
      treeNode:{},
    },
    btnStatus: [],
    modaltitle: "",
    menuVisible:true,

    col1:6,col2:18,menu_icon:true
  };
  componentDidMount=()=>{
    this.props.dispatch({
      type: 'IndexMgr/query',
    }).then(()=>{
      this.setState({
        expandedKeys:["-1"],
      })
    })
  }

  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }

      let code=treeNode.props.eventKey
      let productType=treeNode.props.dataRef.productType
      let productCode=treeNode.props.dataRef.productCode
      let productAttribute=treeNode.props.dataRef.productAttribute
      console.log(treeNode,"treeNode")
      this.promise = request({
        url:"/gateway/indextree.json",
        method: 'post',
        data: {
          id:code,
          productType,
          productCode,
          productAttribute,
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }
        const queryData = result.RSP_BODY.producttree||[]
        console.log(queryData,"queryData")

        treeNode.props.dataRef.children = queryData;
        this.props.dispatch({
          type: 'IndexMgr/querySuccess',
          payload:{...this.props.IndexMgr.organTree}
        })


        resolve();
      })

    });
  }


  onExpand = (expandedKeys) => {
   //console.log('onExpand', arguments);
    this.setState({
      expandedKeys,
      autoExpandParent: false,
    });
  }
  getType() {
    const array = this.props.IndexMgr.getTypeList
    const select_list = array.length && array.map(k => ({ ...k, dict_Name: `${k.dictName}`,dict_Value: `${k.dictValue}` }));
    if (select_list.length > 0) {
      return select_list.map(k => <Option key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Option>)
    }
    return null;
  }


  render () {

    const FormItem = Form.Item
    const { getFieldDecorator } = this.props.form
    const { IndexMgr: { organTree, formValues, item,
      LedgerType,modalType,modalVisible, currentItem,productFormatList, IndexTypeList,FrequencyList,unitList,statisticsTypeList, ...liststate
    },dispatch,loading } = this.props
    const {selectedKeys,selectInfo} =this.state
    const onSelect = (selectedKeys, info) => {
     //console.log(info.node.props.eventKey,"info")
     //console.log(selectedKeys,"selectedKeys")
      dispatch({
          type:LedgerType+'/querySuccess',
          payload:{formValues: {...formValues, id:info.node.props.eventKey},}
        }
      )
      this.props.dispatch({
        type: LedgerType+'/queryid',
        payload: {
          ...formValues,
          id:info.node.props.eventKey,
        },
      })

      this.setState({ selectedKeys,
        selectInfo:{
          value:info.node.props.eventKey,
          name:info.node.props.title
        }
      });
    }
    //获取功能集合
    const funclist = this.props.app.funcList
    //鼠标右键功能键
    const organAdd = funclist.map((item,key) =>(item.funcCode ==="100301"&& item.isRole === true?<Menu.Item key='100301'><a onClick={e => addState(e,this.state.rightkey.appId,this.state.rightkey.id,this.state.rightkey.parentId)}><Icon type="plus-circle" />新增</a></Menu.Item>:null))
    const organUpdate = funclist.map((item,key) =>(item.funcCode ==="100303"&& item.isRole === true?<Menu.Item key='100303'><a onClick={e => updateState(e,this.state.rightkey.appId,this.state.rightkey.id,this.state.rightkey.parentId)}><Icon type="edit" />修改</a></Menu.Item>:null))
    const organRemove = funclist.map((item,key) =>(item.funcCode ==="100302"&& item.isRole === true?<Menu.Item key='100302' style={{display:this.state.menuVisible?'block':'none'}} ><a onClick={e => remove(e, this.state.rightkey.appId,this.state.rightkey.id,this.state.rightkey.parentId)}><Icon type="minus-circle-o" />删除</a></Menu.Item>:null))


    //构造树形
   /* const organTree = arrayToTree(list.filter(_ => _.mpid !== '-1'), 'orgId', 'parentOrgId')*/
    //遍历树形
    const loop = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode icon={<Icon type={"folder"} />}   dataRef={item} key={item.id} title={item.productName} productAttribute={item.productAttribute} productCode={item.productCode} value={item.id}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode icon={<Icon type={"folder"}  />}  dataRef={item}  key={item.id} title={item.productName} productAttribute={item.productAttribute}   productCode={item.productCode}  value={item.id} />;

    })


    const handleModalVisible = (flag) => {
      this.setState({
        treemodalVisible: !!flag,
      })
    }


    const formItemLayout2 = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    }
    //鼠标右键菜单弹窗
    const onRightClick = (e,treeNode) => {

      console.log(e)
        if(e.node.props.value==="-1"||e.node.props.children){
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
          id: e.node.props.eventKey,
          parentId: e.node.props.parentId,
          modeltitle: e.node.props.title,
          treeNode,
        },
      })
      document.onclick = function () {
        this.setState({
          visible: false,
        })
      }.bind(this)
    }

    const remove = (e,appId, id, parentId) => {
      const { dispatch } = this.props
      confirm({
        title: '确定删除吗?',
        okText:'确定',
        cancelText:'取消',
        onOk() {
          dispatch({
            type: 'IndexMgr/delete',
            payload: {
              id
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
      const { form, dispatch, } = this.props
      const { rightkey  } = this.state
      form.validateFields((err, fieldsValue) => {
        if (err) return
        dispatch({
          type: 'IndexMgr/add',
          payload: {
            pid: rightkey.id,
            productDirName: fieldsValue.productDirName,
          },
          callback: (response) => {
            if (response.RSP_HEAD.TRAN_SUCCESS==='1') {
              const queryData = result.RSP_BODY.producttree||[]
              rightkey.treeNode.props.dataRef.children = queryData
              this.props.dispatch({
                type: 'IndexMgr/querySuccess',
                payload:{...organTree}
              })
            }
          }
        })
        form.resetFields()
        this.setState({
          treemodalVisible: false,
        })

      })
    }
    //菜单修改保存
    const okHandleUpdate = () => {
      const { form, dispatch } = this.props
      form.validateFields((err, fieldsValue) => {
        if (err) return
        dispatch({
          type: 'IndexMgr/updatetree',
          payload: {
            productDirName: fieldsValue.productDirName,
            id: this.state.id,
          },
        })

        this.setState({
          treemodalVisible: false,
          selectedKeys:[this.state.id]
        })
      })
    }
    //鼠标右键新增
    const addState = (e,appId,orgId,parentOrgId) => {

      handleModalVisible(true)
      this.setState({
        btnStatus: 2,
        modaltitle:"目录新增",

      })
    }


    //鼠标右键修改回显
    const updateState = (e,appId,id,parentId) => {


      this.setState({
        btnStatus: 1,
        modaltitle:"目录修改",
        id
      })

      handleModalVisible(true)
    }

    /*列表参数*/
    const listProps={
      dispatch,
      LedgerType,
      loading,
      ...liststate,
      formValues,
      /*刷新*/

      onEditItem (item) {
        dispatch({
          type: LedgerType + '/toupdate',
          payload: {
            id: item.id,
            productType:item.productType
          },
        })
      },
      onDetail(item) {
        dispatch({
          type: LedgerType + '/todetail',
          payload: {
            id: item.id,
            productType:item.productType,
          },
        })
      },
      deleteIndex (record) {
        dispatch({
          type: LedgerType + '/deleteModal',
          payload: {
            id:record.id
          },
        })
      },
      onPublish (record) {
              dispatch({
                type: LedgerType + '/onPublish',
                payload: {
                  id:record.id,
                  ePublish:!record.ePublish
                },
              })
            },
      onBloodTree (record) {
              dispatch({
                type: LedgerType + '/onPublish',
                payload: {
                  id:record.id,
                  ePublish:!record.ePublish
                },
              })
            },

      onAdd () {
        if(selectedKeys.length !== 0&&selectedKeys[0]!=="-1"){//不为空 且不为根节点可以点击新建
          dispatch({
            type: LedgerType+'/showModal',
            payload: {
              modalType: 'create',
              currentItem: {},
            },
          })
        }else{
          message.info("请选择目录")
        }
      },
      /*查询表单*/
      onTableChange:(params)=>{

        dispatch({
            type:LedgerType+'/querySuccess',
            payload:{formValues: {...formValues,...params},}
          }
        )
        dispatch({
          type:LedgerType+'/queryid',
          payload: params,
        });
      }
    }

    /*索引参数*/
    const filerProps={
      LedgerType,
      loading,
      /*查询参数*/
      formValues,
      /*机构下拉树*/
      IndexTypeList,
      /*重置表单*/
      handleFormReset:()=>{
        dispatch({
          type: LedgerType+'/querySuccess',
          payload:{
            formValues:{
              page: 1,
              pageSize: 10,
              id:selectedKeys[0]
            },}
        });
      },
      /*查询表单*/
      toSubmit:(changefields)=>{
        if(selectedKeys.length !== 0){//不为空 且不为根节点可以点击新建
          dispatch({
              type: LedgerType+'/querySuccess',
              payload:{formValues: {...formValues,...changefields},}
            }
          )
          dispatch({
            type:LedgerType+'/queryid',
            payload: {...formValues,...changefields}
          })
        }else{
          message.info("请选择目录")
        }
      }
    }
    const modalProps = {
      selectInfo,
      modalType,
      item: modalType === 'create' ? {info:{},properties:{},dimList:[]} : currentItem,
      visible: modalVisible,
      maskClosable: false,
      confirmLoading: loading.effects[LedgerType+'/'+modalType],
      title: `${modalType === 'create' ? '创建指标' : modalType==="update"?"修改指标":'指标详情'}`,
      wrapClassName: 'vertical-center-modal',
      width:"1150px",
      statisticsTypeList,//统计类型
      productFormatList,//数据格式
      IndexTypeList,//指标类型
      FrequencyList,//数据周期
      unitList,//数据单位
      connectionTest(data){
        dispatch({
          type:LedgerType+`/linkcheck`,
          payload: data,
        })
      },
      onOk (data) {

        dispatch({
          type:LedgerType+`/${modalType}`,
          payload: data,

        })
      },
      onCancel () {
        dispatch({
          type: LedgerType+'/hideModal',
        })
      },
    }
    const onClick=()=>{
      if(this.state.menu_icon){
        this.setState({
          col1:0,col2:24,menu_icon:!this.state.menu_icon
        })}else{
        this.setState({
          col1:6,col2:18,menu_icon:!this.state.menu_icon
        })
      }
    }




    return (
      <div className={styles.cardExtra}>
      <Page inner>
        <Row>
          <Col span={this.state.col1}>
            <Row style={{
            /*  marginTop: '10px' */
            }} />
            <div    style={{overflow: 'auto', width:'100%', height: '450px'}}>
              <Card title="目录管理" bordered={true}   >
              <Tree
                showLine
                onExpand={this.onExpand}
                expandedKeys={this.state.expandedKeys}
                autoExpandParent={this.state.autoExpandParent}
                loadData={this.onLoadData}
                onRightClick={onRightClick}
                onSelect={onSelect}
                selectedKeys={this.state.selectedKeys}
              >
                {loop(organTree)}
              </Tree>




              </Card>
            </div>
          </Col>
          <Col span={this.state.col2}>
            <Card title={
             <div style={{display:"flex"}}>
              <div
              className={styles.button}
             onClick={
             onClick
             }

              >
              <Icon type={classnames({ 'menu-unfold': !this.state.menu_icon, 'menu-fold':this.state.menu_icon })} />
              </div>
               <span >指标列表</span>
            </div>
            } bordered={true} >
            <Page inner>
              <Filter {...filerProps} />
              <List {...listProps} />
              {modalVisible && <CreateModel {...modalProps} />}
            </Page>
            </Card>

          </Col>
        </Row>
        {this.state.treemodalVisible && <Modal
          title={this.state.modaltitle}
          wrapClassName="vertical-center-modal"
          visible={this.state.treemodalVisible}
          onOk={okHandle}
          onCancel={() => handleModalVisible()}
          width={600}
          okText={"保存"}
          cancelText={"取消"}
        >
          <Form layout="horizontal"  onSubmit={okHandle}>

            <Row>

              <Col span={12}>
                <FormItem {...formItemLayout2} label="目录名称" hasFeedback >
                  {getFieldDecorator('productDirName', {
                    initialValue: this.state.modaltitle == "目录新增" ? undefined: this.state.rightkey.modeltitle,
                    rules: [
                      {
                        required: true,
                        message: '目录名称不能为空',
                      },
                    ],
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>

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


      </Page>
      </div>
    )
  }
}

export default connect(({ IndexMgr,app, loading,dispatch  }) => ({ IndexMgr,app, loading,dispatch }))(Form.create()(IndexMgr))
