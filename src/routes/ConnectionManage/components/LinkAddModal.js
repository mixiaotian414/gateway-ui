import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Row, Col,Form,Button,Table,message,Modal,Tree,Anchor,Input,Checkbox,Select  } from 'antd'
import styles from './Connectionlist.less'
/**
 * @Title:创建连接模态框组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2018/7/3
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const Option = Select.Option
const confirm = Modal.confirm
const { Link } = Anchor;
const CheckboxGroup = Checkbox.Group;

class LinkAddModal extends Component{
  state = {
    isSupportBoolean:"0",//支持布尔数据类型
    isSupportBooleanT:"",
    isSupportTimestamp:"0",//支持timestamp数据类型
    isSupportTimestampT:"",
    isIdentifierParentheses:"1",//标识符使用引号括起来
    isIdentifierParenthesesT:"",
    forceLowercase:"1",//强制标识符使用小写字符
    forceLowercaseT:"",
    forceUppercase:"1",//强制标识符使用大写字符
    forceUppercaseT:"",
    isPreserveCase:"0",//Preserve case of reserverd words
    isPreserveCaseT:"",
    checkedisSupportBoolean:true,
    checkedisSupportTimestamp:true,
    checkedisIdentifierParentheses:false,
    checkedforceLowercase:false,
    checkedforceUppercase:false,
    checkedisPreserveCase:true,
    flagOracle:"",
    dbtype:""

  }

  componentWillReceiveProps = ()=>{
    if(this.props.linksearchinfolist){
      if(this.props.linksearchinfolist.isSupportBoolean==="0"){
        if(this.state.isSupportBooleanT ==='1'){
          this.setState({
            checkedisSupportBoolean:false
          })
        }else {
          this.setState({
            checkedisSupportBoolean:true
          })
        }
      }else if(this.state.isSupportBooleanT ==='0'){
        this.setState({
          checkedisSupportBoolean:true
        })
      }else {
        this.setState({
          checkedisSupportBoolean:false
        })
      }
      if(this.props.linksearchinfolist.isSupportTimestamp==="0"){
        if(this.state.isSupportTimestampT==="1"){
          this.setState({
            checkedisSupportTimestamp:false
          })
        }else {
          this.setState({
            checkedisSupportTimestamp:true
          })
        }
      }else if(this.state.isSupportTimestampT ==='0'){
        this.setState({
          checkedisSupportTimestamp:true
        })
      }else {
        this.setState({
          checkedisSupportTimestamp:false
        })
      }
      if(this.props.linksearchinfolist.isIdentifierParentheses==="0"){
        if(this.state.isIdentifierParenthesesT ==="1"){
          this.setState({
            checkedisIdentifierParentheses:false
          })
        }else {
          this.setState({
            checkedisIdentifierParentheses:true
          })
        }
      }else if(this.state.isIdentifierParenthesesT ==='0'){
        this.setState({
          checkedisIdentifierParentheses:true
        })
      }else {
        this.setState({
          checkedisIdentifierParentheses:false
        })
      }
      if(this.props.linksearchinfolist.forceLowercase==="0"){
        if(this.state.forceLowercaseT ==="1"){
          this.setState({
            checkedforceLowercase:false
          })
        }else {
          this.setState({
            checkedforceLowercase:true
          })
        }
      }else if(this.state.forceLowercaseT ==='0'){
        this.setState({
          checkedforceLowercase:true
        })
      }else {
        this.setState({
          checkedforceLowercase:false
        })
      }
      if(this.props.linksearchinfolist.forceUppercase==="0"){
        if(this.state.forceUppercaseT ==="1"){
          this.setState({
            checkedforceUppercase:false
          })
        }else {
          this.setState({
            checkedforceUppercase:true
          })
        }
      }else if(this.state.forceUppercaseT ==='0'){
        this.setState({
          checkedforceUppercase:true
        })
      }else {
        this.setState({
          checkedforceUppercase:false
        })
      }
      if(this.props.linksearchinfolist.isPreserveCase==="0"){
        if(this.state.isPreserveCaseT==="1"){
          this.setState({
            checkedisPreserveCase:false
          })
        }else {
          this.setState({
            checkedisPreserveCase:true
          })
        }
      }else if(this.state.isPreserveCaseT ==='0'){
        this.setState({
          checkedisPreserveCase:true
        })
      }else {
        this.setState({
          checkedisPreserveCase:false
        })
      }
      if(this.props.linksearchinfolist.dbType){
        this.setState({
          dbtype:this.props.linksearchinfolist.dbType
        })
      }
    }
  }

  getdbtype() {
    if (this.props.getDbType[0]) {
      const array = this.props.getDbType
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
  handleProvinceChange =(e)=>{
    if(e === '02'){
      this.setState({
        flagOracle:true,
        dbtype:e,
      })
    }else {
      this.setState({
        flagOracle:false,
        dbtype:e,
      })
    }
  }


  render(){
    const {  LedgerType,changeLinkModal,modalLinkVisible,linkModalTitle,linksearchinfolist } = this.props;
    const { getFieldDecorator, validateFieldsAndScroll } = this.props.form
    const formItemLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 16,
      },
    }
    //创建连接
    const modalProps = {
      visible: modalLinkVisible,
      maskClosable: false,
      title: linkModalTitle==='create'? "创建连接" : "修改连接",
      wrapClassName: 'vertical-center-modal',
      width:"800px",
      footer:
        [
          <Button type="primary" onClick={e=>connectionTest()}>测试</Button>,
          <Button type="primary" onClick={e=>onCancelModal()}>取消</Button>,
          <Button type="primary" onClick={e=>saveLink()}>确定</Button>
        ],
      onCancel:()=>{
        changeLinkModal(false)
        this.props.form.resetFields()

      }
    }
    const onCancelModal=()=>{
      changeLinkModal(false)
      this.props.form.resetFields()

    }
    //测试连接
    const connectionTest =()=> {
      this.props.form.validateFields((err,fieldsValue)=>{
        if(err) return
        this.props.dispatch({
          type: LedgerType+'/linkcheck',
          payload:{
            dbType: fieldsValue.dbType,
            username: fieldsValue.username,
            password: fieldsValue.password,
            dbIp: fieldsValue.dbIp,
            dbPort: fieldsValue.dbPort,
            dbName: fieldsValue.dbName,
          }
        }).then(()=>{
          Modal.info({
            title: '测试连接',
            content: (
              <div>
                <p>{this.props.checkCode?"连接成功！":"连接失败！"}</p>
              </div>
            ),
            okText: "关闭",
          });
        })
      })

    }
    //modal保存
    const saveLink =()=> {
      linkModalTitle=="create" ? saveConnection():updateConnection()
    }
    //创建连接保存
    const saveConnection =()=> {
      const { form, dispatch } = this.props
      form.validateFields((err, fieldsValue) => {
        if (err) return
        dispatch({
          type: LedgerType+'/linkAdd',
          payload: {
            linkName: fieldsValue.linkName,
            dbType: fieldsValue.dbType,
            tableSpace:this.state.dbtype ==='02'?fieldsValue.tableSpace:"",
            indexSpace:this.state.dbtype ==='02'?fieldsValue.indexSpace:"",
            username: fieldsValue.username,
            password: fieldsValue.password,
            dbIp: fieldsValue.dbIp,
            dbPort: fieldsValue.dbPort,
            dbName: fieldsValue.dbName,
            isSupportBoolean: this.state.isSupportBoolean,
            isPreserveCase: this.state.isPreserveCase,
            isSupportTimestamp: this.state.isSupportTimestamp,
            isIdentifierParentheses: this.state.isIdentifierParentheses,
            forceLowercase: this.state.forceLowercase,
            forceUppercase:this.state.forceUppercase,
          },
        })
        form.resetFields()
        //changeLinkModal(false)
      })
    }
    //修改连接保存
    const updateConnection =()=>{
      const { form,dispatch } = this.props
      form.validateFields((err,fieldsValue) => {
        if(err) return
        dispatch({
          type:LedgerType+'/linksave',
          payload:{
            linkCode:fieldsValue.linkCode,
            linkName:fieldsValue.linkName,
            dbType:fieldsValue.dbType,
            tableSpace:this.state.dbtype ==='02'?fieldsValue.tableSpace:"",
            indexSpace:this.state.dbtype ==='02'?fieldsValue.indexSpace:"",
            username:fieldsValue.username,
            password:fieldsValue.password,
            dbIp:fieldsValue.dbIp,
            dbPort:fieldsValue.dbPort,
            dbName:fieldsValue.dbName,
            isSupportBoolean: this.state.isSupportBoolean,
            isPreserveCase: this.state.isPreserveCase,
            isSupportTimestamp: this.state.isSupportTimestamp,
            isIdentifierParentheses: this.state.isIdentifierParentheses,
            forceLowercase: this.state.forceLowercase,
            forceUppercase:this.state.forceUppercase,
          }
        })
      })
      //changeLinkModal(false)
    }

    /*是否支持Boolean，0：支持；1：不支持*/
    const isSupportBoolean =(e)=> {
      this.setState({
        isSupportBoolean:e.target.checked ? 0 : 1,
        isSupportBooleanT:e.target.checked ? 0 : 1,
        checkedisSupportBoolean:e.target.checked
      })
    }
    /*是否支持timestamp数据类型，0：支持；1：不支持*/
    const isSupportTimestamp =(e)=> {
      this.setState({
        isSupportTimestamp:e.target.checked ? 0 : 1,
        isSupportTimestampT:e.target.checked ? 0 : 1,
        checkedisSupportTimestamp:e.target.checked
      })
    }
    /*标识符使用引号括起来，0：是；1：否*/
    const isIdentifierParentheses =(e)=> {
      this.setState({
        isIdentifierParentheses:e.target.checked ? 0 : 1,
        isIdentifierParenthesesT:e.target.checked ? 0 : 1,
        checkedisIdentifierParentheses:e.target.checked
      })
    }
    /*标识符强制小写，0：是；1：否*/
    const forceLowercase =(e)=> {
      this.setState({
        forceLowercase:e.target.checked ? 0 : 1,
        forceLowercaseT:e.target.checked ? 0 : 1,
        checkedforceLowercase:e.target.checked
      })
    }
    /*标识符强制大写，0：是；1：否*/
    const forceUppercase =(e)=> {
      this.setState({
        forceUppercase:e.target.checked ? 0 : 1,
        forceUppercaseT:e.target.checked ? 0 : 1,
        checkedforceUppercase:e.target.checked
      })
    }
    /*Preserve case of reserverd words*/
    const isPreserveCase =(e)=> {
      this.setState({
        isPreserveCase:e.target.checked ? 0 : 1,
        isPreserveCaseT:e.target.checked ? 0 : 1,
        checkedisPreserveCase:e.target.checked
      })
    }
    return(
      <div>
        <Modal {...modalProps}>
          <Row>
            <Col span={5}>
              <Anchor
                affix={false}
                className={styles.anchorLink}

              >
                <Link href="#commonly" title="一般" />
                <Link href="#senior" title="高级" />
              </Anchor>
            </Col>
            <Col span={19}>
              <div style={{overflow: 'auto', width:'100%', height: '350px'}}>
                <Row>
                  <Form layout="horizontal">
                    <Row>
                      <p style={{fontSize:'16px'}} id="commonly" >一般</p>
                    </Row>
                    <Row>
                      <FormItem {...formItemLayout} label="连接名称" hasFeedback>
                        {getFieldDecorator('linkName',{
                          initialValue:linkModalTitle=="create" ? null:this.props.linksearchinfolist.linkName,
                          rules: [{ required: true, message: "连接名称不能为空" }]
                          }
                        )(
                          <Input placeholder="请输入" />
                        )}
                        {getFieldDecorator('linkCode',{
                            initialValue:linkModalTitle=="create" ? null:this.props.linksearchinfolist.linkCode

                          }
                        )(
                          <Input placeholder="请输入" type="hidden" />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="连接类型" hasFeedback>
                        {getFieldDecorator('dbType',{
                            initialValue:linkModalTitle=="create" ? undefined:this.props.linksearchinfolist.dbType,
                            rules: [{ required: true, message: "连接类型不能为空" }]
                          }
                        )(
                          <Select  placeholder="请选择" onChange={this.handleProvinceChange} disabled={linkModalTitle=="create" ? false:true} >
                            {this.getdbtype()}
                          </Select>
                        )}
                      </FormItem>
                      {
                        this.state.flagOracle||this.state.dbtype ==='02'?
                          <FormItem {...formItemLayout} label="数据表空间" hasFeedback>
                            {getFieldDecorator('tableSpace',{
                                initialValue:linkModalTitle=="create" ? null:this.props.linksearchinfolist.tableSpace,
                              }
                            )(
                              <Input placeholder="请输入" />
                            )}
                          </FormItem>:null
                      }
                      {
                        this.state.flagOracle||this.state.dbtype ==='02'?
                          <FormItem {...formItemLayout} label="索引表空间" hasFeedback>
                            {getFieldDecorator('indexSpace',{
                                initialValue:linkModalTitle=="create" ? null:this.props.linksearchinfolist.indexSpace,
                              }
                            )(
                              <Input placeholder="请输入" />
                            )}
                          </FormItem>:null
                      }


                      <FormItem {...formItemLayout} label="主机名称" hasFeedback>
                        {getFieldDecorator('dbIp',{
                            initialValue:linkModalTitle=="create" ? null:this.props.linksearchinfolist.dbIp,
                            rules: [{ required: true, message: "主机名称不能为空" }]
                          }
                        )(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="数据库名称" hasFeedback>
                        {getFieldDecorator('dbName',{
                            initialValue:linkModalTitle=="create" ? null:this.props.linksearchinfolist.dbName,
                            rules: [{ required: true, message: "数据库名称不能为空" }]
                          }
                        )(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="端口号" hasFeedback>
                        {getFieldDecorator('dbPort',{
                            initialValue:linkModalTitle=="create" ? null:this.props.linksearchinfolist.dbPort,
                            rules: [{ required: true, message: "端口号不能为空" }]
                          }
                        )(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>

                      <FormItem {...formItemLayout} label="用户名" hasFeedback>
                        {getFieldDecorator('username',{
                            initialValue:linkModalTitle=="create" ? null:this.props.linksearchinfolist.username,
                            rules: [{ required: true, message: "用户名不能为空" }]
                          }
                        )(
                          <Input placeholder="请输入" />
                        )}
                      </FormItem>
                      <FormItem {...formItemLayout} label="密码" hasFeedback>
                        {getFieldDecorator('password',{
                            initialValue:linkModalTitle=="create" ? null:this.props.linksearchinfolist.password,
                            rules: [{ required: true, message: "密码不能为空" }]
                          }
                        )(
                          <Input placeholder="请输入" type="password" />
                        )}
                      </FormItem>
                    </Row>
                    {/*<Row style={{marginLeft:'110px'}}>
                      <Checkbox >Use Result Streaming Cursor</Checkbox>
                    </Row>*/}
                    <Row><p style={{fontSize:'16px',marginTop:'30px'}} id="senior" >高级</p></Row>
                    <Row style={{marginLeft:'110px'}}>
                        <Row style={{textAlign:'left'}}>
                          <Col span={24}>
                            <Checkbox onChange={isSupportBoolean} checked={this.state.checkedisSupportBoolean}>支持布尔数据类型</Checkbox>
                          </Col>
                        </Row>
                        <Row style={{textAlign:'left',marginTop:'20px'}}>
                          <Col span={24}>
                            <Checkbox onChange={isSupportTimestamp} checked={this.state.checkedisSupportTimestamp}>支持timestamp数据类型</Checkbox>
                          </Col>
                        </Row>
                        <Row style={{textAlign:'left',marginTop:'20px'}}>
                          <Col span={24}>
                            <Checkbox onChange={isIdentifierParentheses} checked={this.state.checkedisIdentifierParentheses}>标识符使用引号括起来</Checkbox>
                          </Col>
                        </Row>
                        <Row style={{textAlign:'left',marginTop:'20px'}}>
                          <Col span={24}>
                            <Checkbox onChange={forceLowercase} checked={this.state.checkedforceLowercase} >强制标识符使用小写字符</Checkbox>
                          </Col>
                        </Row>
                        <Row style={{textAlign:'left',marginTop:'20px'}}>
                          <Col span={24}>
                            <Checkbox onChange={forceUppercase} checked={this.state.checkedforceUppercase}>强制标识符使用大写字符</Checkbox>
                          </Col>
                        </Row>
                        <Row style={{textAlign:'left',marginTop:'20px',marginBottom:'80px'}}>
                          <Col span={24}>
                            <Checkbox onChange={isPreserveCase} checked={this.state.checkedisPreserveCase} >Preserve case of reserverd words</Checkbox>
                          </Col>
                        </Row>
                      {/*<FormItem  label="默认模式名称" hasFeedback>
                        <Input style={{width:'350px'}} placeholder="请输入建议" />
                      </FormItem>*/}

                    </Row>
                  </Form>
                </Row>
              </div>
            </Col>
          </Row>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(LinkAddModal)
