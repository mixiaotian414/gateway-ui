import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Row, Col,Form,Button,Table,message,Modal,Card,Icon,Tree,Divider,Select,Menu,Dropdown } from 'antd'
import styles from './Connectionlist.less'


/**
 * @Title:数据预览模态框组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2018/7/3
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const Option = Select.Option

class DataViewModal extends Component{
  state = {
    linkcode:"",
    tablename:"",
    isleaf:"",
    selectedKeys:[],
    dbType:"",
  }
  onSelect = (selectedKeys, info) => {
    console.log("selectedKeys:",selectedKeys)
    this.setState({
      linkcode:info.node.props.linkCode,
      tablename:info.node.props.title,
      isleaf:info.node.props.isleaf,
      dbType:info.node.props.dbType,
      selectedKeys:selectedKeys
    })
  }

  render(){
    const {  LedgerType,changeModal,changeTableModal,changeDataViewModal,dataViewVisible,changeDbType } = this.props;
    /*数据浏览*/
    const dataViewModalProps = {
      visible: dataViewVisible,
      maskClosable: false,
      title: '数据库浏览器',
      wrapClassName: 'vertical-center-modal',
      width:"500px",
      footer:[<Button type="primary" onClick={e=>changeDataViewModal(false)}>关闭</Button>],
      onCancel:()=>{
        changeDataViewModal(false)
      },
    }
    /*记录数*/
    const recordnumber =()=> {
      if(this.state.selectedKeys.length>0&&this.state.isleaf){
        this.props.dispatch({
          type:LedgerType+'/linkcount',
          payload:{
            linkCode: this.state.linkcode,
            table: this.state.tablename,
          }
        }).then(()=>{
          Modal.info({
            title: '记录数',
            content: (
              <div>
                <p>此表共有“{this.props.selectcount}”条记录。</p>
              </div>
            ),
            okText: "关闭",
          });
        })
      }else {
        message.warning('请选择表或视图')
      }
    }

    /*预览100行*/
    const preview = () =>{
      const linkcode = this.state.linkcode
      const tablename = this.state.tablename
      if(this.state.selectedKeys.length>0&&this.state.isleaf){
        this.props.dispatch({
          type: LedgerType+'/linkpreview',
          payload:{
            linkCode: linkcode,
            table:tablename,
          }
        })
        changeModal(true)
      }else {
        message.warning('请选择表或视图')
      }
    }
    /*显示表结构*/
    const displaytable = () =>{
      if(this.state.selectedKeys.length>0&&this.state.isleaf){
        this.props.dispatch({
          type: LedgerType+'/linktablestructure',
          payload:{
            linkCode:this.state.linkcode,
            table:this.state.tablename,
          }
        })
        changeTableModal(true)
        changeDbType(this.state.dbType)
      }else {
        message.warning('请选择表或视图')
      }
    }

    const loop = data => data.map((item) => {
      if (item.list) {
        return <TreeNode key={item.name} title={item.name}  linkCode={item.linkCode} isleaf={item.isLeaf} dbType={item.dbType}  >
          {loop(item.list)}
        </TreeNode>
      }
      return <TreeNode key={item.name} title={item.name}  linkCode={item.linkCode} isleaf={item.isLeaf} dbType={item.dbType} />
    })
    const looptable = data => data.map((item) => {
      if (item.list) {
        return <TreeNode key={item.name} title={item.name} linkCode={item.linkCode} dbType={item.dbType}  >
          {looptable(item.list)}
        </TreeNode>
      }
      return <TreeNode key={item.name} title={item.name} linkCode={item.linkCode} dbType={item.dbType} >
      </TreeNode>
    })

    const menu = (
      <Menu>
        <Menu.Item>
          <a onClick={e => preview()} >预览前100</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={e => recordnumber()} >记录数</a>
        </Menu.Item>
        <Menu.Item>
          <a onClick={e => displaytable()}  >显示表结构</a>
        </Menu.Item>
      </Menu>
    );

    return(
      <div>
        <Modal
          {...dataViewModalProps}
        >
          <Form>
            <Row>
              <Row style={{textAlign:'right'}}>
                <Dropdown overlay={menu} placement="bottomLeft">
                  <Button type="primary" >动作<Icon type="down" /></Button>
                </Dropdown>
              </Row>
              <Divider style={{margin:'12px 0'}} />
              <Col span={24}>
                <div style={{overflow: 'auto', width:'100%', height: '240px'}}>
                  <Tree
                    showLine
                    defaultExpandedKeys={['mysql']}
                    onSelect={this.onSelect}
                  >
                    {loop(this.props.dbshowlist)}
                  </Tree>
                </div>
              </Col>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }

}
export default Form.create()(DataViewModal)
