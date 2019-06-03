import React,{Component} from 'react'
import { Page } from 'components'
import { Row, Col,Form,Button,Modal,Tree,Select,Menu,Input,Icon } from 'antd'
import styles from '.././index.less'
/**
 * @Title:指标查询=》指标目录树组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2019/4/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const Option = Select.Option
const confirm = Modal.confirm;

class CollectionTree extends Component{
  state = {
    tempStyle: {},//右键菜单样式
    visible: false,//鼠标右键
    rightkey: {},
  }

  render(){
    const { getFieldDecorator, validateFields } = this.props.form
    const { LedgerType,dispatch,item,onDeleteItem, onDeleteReport,onSelectKey,onSelectKeyData } = this.props

    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 12 },
    }
    //鼠标右键菜单弹窗
    const onRightClick = (e) => {
      const left = e.event.pageX
      const top = e.event.pageY
      this.setState({
        visible: true,
        tempStyle: {
          position: 'fixed',
          left: `${left}px`,
          top: `${top}px`,
          width: '100px',
          background: '#F0F0F0',
        },
        rightkey: {
          rootkey: e.node.props.eventKey,
          title:e.node.props.title,
          type:e.node.props.treeType,
        },
      })
      document.onclick = function () {
        this.setState({
          visible: false,
        })
      }.bind(this)
    }

    const onSelect = (selectedKeys, e) => {
      onSelectKey(selectedKeys)//向Filter子组件传值
      if(selectedKeys.length>0){
        if(e.node.props.treeType !=='1'){
          if(e.node.props.dataRef.products){
            let productIds = []; //指标id集合
            let indexData = []; //指标名称集合
            if(e.node.props.dataRef.products.length>0){
              e.node.props.dataRef.products.map((item)=>{
                productIds.push(item.idForDimension)
                indexData.push({
                  title:item.productName,
                  key:item.productId,
                  propertiesId:item.productId,
                })
              })
            }
            //查指标维度
            dispatch({
              type: LedgerType + '/indexdimension',
              payload: {
                id: productIds
              },
            })
            //查指标名称
            dispatch({
              type:LedgerType+'/querySuccess',
              payload: {
                filtersData:indexData,
                indexName:e.node.props.title,
              },
            })
            dispatch({
              type:LedgerType+'/querySuccess',
              payload: {
                selectdata:[]
              },
            })
          }
        }
      }else {
        //查指标维度
        dispatch({
          type: LedgerType + '/indexdimension',
          payload: { id: [] },
        })
        //查指标名称
        dispatch({
          type:LedgerType+'/querySuccess',
          payload: {
            filtersData:[],
            selectdata:[]
          },
        })
      }
      const params = {
        id:e.node.props.id,
        reportDirName:e.node.props.title,
        type:e.node.props.treeType
      }
      onSelectKeyData(params)
    }

    const loop = data => data.map((item) => {
      if (item.children) {
        return <TreeNode  key={item.id} title={item.reportDirName} id={item.id}  treeType={item.treeType} dataRef={item}  >
          {loop(item.children)}
        </TreeNode>
      }
      return <TreeNode  key={item.id} title={item.reportDirName} id={item.id} treeType={item.treeType} dataRef={item}  />
    })
    const ModalProps = {
      visible: this.props.visible,
      maskClosable: false,
      title:this.props.title,
      wrapClassName:"vertical-center-modal",
      width:'450px',
      onOk:()=>{handleOk()},
      onCancel:()=>{handleCancel()}
    }
    const handleOk = () => {
      validateFields((errors,values) => {
        if (errors) {
          return
        }
        if(this.props.modalTreeType ==='createDir'){
          values.parentId=this.state.rightkey.rootkey
        }else {
          values.id=this.state.rightkey.rootkey
        }
        this.props.onOk(values)
        this.props.form.resetFields()
      })
    }
    const handleCancel = ()=>{
      this.props.onCancel()
      this.props.form.resetFields()
    }
    const dirDel = (item)=>{
      const { type } = this.state.rightkey
      confirm({
        title:"确定删除吗？",
        okText: "确定",
        cancelText: "取消",
        onOk() {
          if(type ==='1'){ //type 1:目录删除，2:报表删除
            onDeleteItem(item)
          }else {
            onDeleteReport(item)
          }
        },
      })
    }

    return(
      <div>
        <Row gutter={24}>
          <Col lg={24} md={24}>
            <section className={styles.treecss}>
            <div style={{overflow: 'auto', width:'100%', height: '560px',marginTop:'20px'}}>
              <Tree
                //checkable
                autoExpandParent
                defaultExpandedKeys={['-1']}
                onRightClick={onRightClick}
                selectedKeys={this.props.collectionSelectedKeys}
                onSelect={onSelect}
              ><TreeNode key="-1" title="收藏目录" id="-1" treeType="1">
                {loop(this.props.collectionTreeData)}
              </TreeNode>

              </Tree>
            </div>
            </section>

          </Col>
        </Row>
        <Menu
          visible={this.state.visible}
          style={this.state.tempStyle}
        >
          {
            this.state.rightkey.type !=='2'?
              <Menu.Item key='1'><a onClick={()=>this.props.onOpenDir()}><Icon type="plus-circle" />新增</a></Menu.Item>
            :null
          }
          {
            this.state.rightkey.rootkey !=='-1'&& this.state.rightkey.type !=='2'?
              <Menu.Item key='2'><a onClick={()=>this.props.onEditDirItem(this.state.rightkey)}><Icon type="edit" />修改</a></Menu.Item>
            :null
          }
          {
            this.state.rightkey.rootkey !=='-1'?
              <Menu.Item key='3'><a onClick={()=>dirDel(this.state.rightkey.rootkey)}><Icon type="minus-circle-o" />删除</a></Menu.Item>
              :null
          }
        </Menu>
        <Modal
          {...ModalProps}
        >
          <Form>
            <Row>
              <FormItem {...formItemLayout} label="目录名称" hasFeedback >
                {getFieldDecorator('reportDirName', {
                  initialValue:item.title,
                  rules: [
                    {
                      required: true,
                      message: '目录名称不能为空',
                    },
                  ],
                })(<Input placeholder="请输入" />)}
              </FormItem>
            </Row>
          </Form>
        </Modal>
      </div>)
  }
}
export default Form.create()(CollectionTree)
