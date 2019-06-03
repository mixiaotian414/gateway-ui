import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Row, Col,Form,Button,Table,message,Modal,Card,Icon,Tree,Anchor,Input,Divider,Select,Menu } from 'antd'
import styles from './Business.less'
import lodash from 'lodash'
/**
 * @Title:业务模型创建模型模态框组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2018/7/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const Option = Select.Option
const confirm = Modal.confirm
const { Link } = Anchor;

class BusinessAddModal extends Component{
  state = {
    modalColumn:false,
    modalProps:false,
    newattriList:[],
    linkCode:"",
  }


  componentWillReceiveProps = () => {
    this.setState({
      newattriList:this.props.modelInfoList,
    })
  }

  getLinkType() {
    const array = this.props.linkList
    const select_list = array.length && array.map(k => ({ ...k, link_Name: `${k.linkName}`,link_Code: `${k.linkCode}` }));
    if (select_list.length > 0) {
      return select_list.map(k => <Option key={JSON.stringify(k)} title={k.linkName} value={k.linkCode}>{k.linkName}</Option>)
    }
    return null;
  }

  render(){
    const {  LedgerType,changeAddBusinsessModal,addBusinessVisible,businessModalTitle } = this.props;
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 16,
      },
    }
    const formItemLayout1 = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 15,
      },
    }
    const modalBusinessProps = {
      visible: addBusinessVisible,
      maskClosable: false,
      title: businessModalTitle ==='create'? "创建业务模型":"修改业务模型",
      wrapClassName: 'vertical-center-modal',
      width:"800px",
      onCancel:()=>{
        changeAddBusinsessModal(false)
      },
      onOk:()=>{
        saveBusinessModal()
      }
    }
    const arrayToTree = (array, id = 'pid', pid = 'pid', children = 'children') => {
      let data = lodash.cloneDeep(array)
      let result = []
      let hash = {}
      data.forEach((item, index) => {
        hash[data[index][id]] = data[index]
      })

      data.forEach((item) => {
        let hashVP = hash[item[pid]]
        if (hashVP) {
          !hashVP[children] && (hashVP[children] = [])
          hashVP[children].push(item)
        } else {
          result.push(item)
        }
      })
      return result
    }

    const saveBusinessModal = ()=>{
      if(businessModalTitle ==='create'){
        saveBusiness()
      }
      if(businessModalTitle ==='update'){
        updateBusiness()
      }
    }
    const saveBusiness = ()=>{
      const linkCode = this.props.form.getFieldValue("linkCode")
      const attrisMName = this.props.form.getFieldValue("attrisMName")
      const attrisMDescription = this.props.form.getFieldValue("attrisMDescription")
      const modelName = this.props.form.getFieldValue("modalName")
      let attris = []
      if(attrisMName){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000017'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisMName
              })
            }
          })
        }
      }
      if(attrisMDescription){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000018'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisMDescription
              })
            }
          })
        }
      }
      this.props.dispatch({
        type: LedgerType+'/modelsave',
        payload:{
          linkCode:linkCode,
          modelName:modelName,
          attris:attris,
        }
      }).then(()=>{
        this.props.form.resetFields()
      })
    }

    const updateBusiness =()=>{
      const linkCode = this.props.form.getFieldValue("linkCode")
      const attrisMName = this.props.form.getFieldValue("attrisMName")
      const attrisMDescription = this.props.form.getFieldValue("attrisMDescription")
      const modelName = this.props.form.getFieldValue("modalName")
      let attris = []
      if(attrisMName){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000017'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisMName
              })
            }
          })
        }
      }
      if(attrisMDescription){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000018'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisMDescription
              })
            }
          })
        }
      }
      this.props.dispatch({
        type: LedgerType+'/modelupdate',
        payload:{
          linkCode:linkCode,
          modelCode:this.props.modelInfoListT.modelCode,
          attris:attris,
        }
      }).then(()=>{
        this.props.form.resetFields()
      })
    }

    const attrislist = arrayToTree(this.props.modelInfoList.filter(_ => _.isNecessary !== '2'), 'attriCode', 'parentCode')

    const loopplainOptionstree = data => data.map((item) => {
      if (item.children) {
        return <TreeNode key={item.attriCode} title={item.attriName}  >
          {loopplainOptionstree(item.children)}
        </TreeNode>
      }
      return <TreeNode key={item.attriCode} title={item.attriName} />
    })
    /*模型属性名称*/
    const mName = this.props.modelInfoList&&this.props.modelInfoList.map((item,key)=>( item.attriCode ==="000017"?
        <Card id="000017" style={{width:'580px'}} key={key}>
          <p className={styles.ptablestyle}>名称：</p>
          <Divider  className={styles.divider} />
          <Col span={20} offset={5}>
            <FormItem {...formItemLayout1}  hasFeedback>
              {getFieldDecorator('attrisMName',{
                  initialValue: businessModalTitle ==='create'? null:item.attriContent
                }
              )(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Card>
        :null
    ))
    const mDescription = this.props.modelInfoList&&this.props.modelInfoList.map((item,key)=>( item.attriCode ==="000018"?
        <Card id="000018" style={{width:'580px'}} key={key}>
          <p className={styles.ptablestyle}>描述：</p>
          <Divider  className={styles.divider} />
          <Col offset={5} span={20}>
            <FormItem {...formItemLayout1} hasFeedback>
              {getFieldDecorator('attrisMDescription',{
                  initialValue:businessModalTitle ==='create'? null:item.attriContent
                }
              )(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Card>
        :null
    ))

    return(
      <div>
        <Modal
          {...modalBusinessProps}
          className={styles.modalbody}
        >
          <Row>
            <Form>
              <Row>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="NAME" hasFeedback>
                    {getFieldDecorator('modalName',{
                        initialValue:businessModalTitle ==='create'? null:this.props.modelInfoListT.modelName,
                      rules: [{ required: true, message: "名称不能为空" }]
                      }
                    )(
                      <Input placeholder="请输入" disabled={businessModalTitle ==='create'? false:true} />
                    )}
                  </FormItem>
                </Col>
                <Col span={12}>
                  <FormItem {...formItemLayout} label="Connection" hasFeedback>
                    {getFieldDecorator('linkCode', {
                      initialValue: businessModalTitle ==='create'? undefined: this.props.modelInfoListT.linkCode,
                      rules: [{ required: true, message: "连接不能为空" }]
                    })(
                      <Select placeholder="请选择" disabled={businessModalTitle ==='create'? false:true} >
                        {this.getLinkType()}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Divider  style={{margin:'5px 0',fontSize:'12px'}}>属性</Divider>

          </Row>
          <Row>
            <Col span={6}>
              <Col style={{height:'20px'}}>
                <p>可用</p>
              </Col>
              {/*<Col style={{textAlign:'right',marginRight:'10px'}}>
                <a onClick={e =>this.addColumnprops()}><Icon type="plus" /></a>
                <a onClick={e =>this.delColumnprops()}><Icon type="minus" /></a>
              </Col>*/}
              <Card className={styles.body}>
                <div style={{overflow: 'auto', width:'100%', height: '280px'}}>
                  <Tree
                    defaultExpandedKeys={['000016']}
                  >
                    {loopplainOptionstree(attrislist)}
                  </Tree>
                </div>
              </Card>
            </Col>
            <Col span={18}>
              <Col span={4} style={{height:'20px'}}>
                <p>设置</p>
              </Col>
              <div style={{overflow: 'auto', width:'580px', height: '305px'}}>
                {mName}
                {mDescription}
              </div>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(BusinessAddModal)
