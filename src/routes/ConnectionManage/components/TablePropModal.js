import React,{Component} from 'react'
import lodash from 'lodash'
import { Page } from 'components'
import { Row, Col,Form,Button,message,Modal,Card,Icon,Tree,Input,Checkbox,Divider,Select,Radio,Anchor,Table } from 'antd'
import styles from './Connectionlist.less'
import {updatelist} from "../../../services/ConnectionManage/connectionList";

/**
 * @Title:编辑表属性模态框组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2018/7/3
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const CheckboxGroup = Checkbox.Group;
const Option = Select.Option
const confirm = Modal.confirm
const { TextArea } = Input;
const RadioGroup = Radio.Group;
const { Link } = Anchor;

let map = new Map()
let arraylist = []
class TablePropModal extends Component{

  state = {
    selectedKeys: [],
    selectedRowKeys:[],
    selectedKeysProps:[],
    selectedTableKeys: [],
    attributeList:[],//属性列表
    attriList:[],
    newattriList:[],
    formValues:[],
    relacode:"",
    relatype:"",
    isselected:false,
    tablecode:[],
  }

  getAttriQuery() {
    if(this.props.getAttriQuery[0]) {
      const array = this.props.getAttriQuery
      const select_list = array.length && array.map(k => ({...k, dict_Name: `${k.dictName}`, dict_Value: `${k.dictValue}`}));
      if (select_list.length > 0) {
        return select_list.map(k => <Radio key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Radio>)
      }
      return null;
    }
  }
  getAttriXls() {
    if(this.props.getAttriXls[0]) {
      const array = this.props.getAttriXls
      const select_list = array.length && array.map(k => ({...k, dict_Name: `${k.dictName}`, dict_Value: `${k.dictValue}`}));
      if (select_list.length > 0) {
        return select_list.map(k => <Radio key={JSON.stringify(k)} title={k.dict_Name} value={k.dict_Value}>{k.dict_Name}</Radio>)
      }
      return null;
    }
  }

  render(){

    const {  LedgerType,changeTablePropsModal,changeColModal,tablePropsVisible,colVisible,changeTableCode } = this.props;
    const { getFieldDecorator } =this.props.form
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
        span: 20,
      },
    }

    /*表属性*/
    const tableModalProps = {
      visible: tablePropsVisible,
      maskClosable: false,
      title: '物理表属性',
      wrapClassName: 'vertical-center-modal',
      width:"800px",
      onCancel:()=>{
        changeTablePropsModal(false)
        map.clear()
        /*this.setState({
          newattriList:[],
          attriList:[],
        })*/
      },
    }
    /*转换树形*/
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
    /*鼠标左键点击字段事件*/
    const onSelectTree = (selectedKeys, info) => {
      const { form } = this.props
      if(this.props.linktabletreelist){
        if(this.props.linktabletreelist[0].tableName === info.node.props.title){
          this.setState({
            selectedTableKeys:selectedKeys,
            tablecode:this.props.linktabletreelist[0].tableCode,
            relacode:info.node.props.relaCode,
            //isselected:info.node.props.isSelected,
            attriList:arrayToTree(this.props.linktabletreelist[0].attriList.filter(_ => _.isNecessary !== '2'), 'attriCode', 'parentCode'),
            newattriList:this.props.linktabletreelist[0].attriList,
          })
        }
      }
      if(this.props.linktabletreelist){
        if(this.props.linktabletreelist[0].colList){
          this.props.linktabletreelist[0].colList.map((item)=>{
            if(item.colName === info.node.props.title){
              this.setState({
                selectedTableKeys:selectedKeys,
                relacode:info.node.props.relaCode,
                attriList:arrayToTree(item.attriList.filter(_ => _.isNecessary !== '2'), 'attriCode', 'parentCode'),
                newattriList:item.attriList,
              })
            }
          })
        }
      }
      const attrisName = form.getFieldValue("attrisName")
      const attrisTName = form.getFieldValue("attrisTName")
      const attrisDescript = form.getFieldValue("attrisDescript")
      const attrisFont = form.getFieldValue("attrisFont")
      const attrisColor = form.getFieldValue("attrisColor")
      const attrisFormula = form.getFieldValue("attrisFormula")
      const queryType = form.getFieldValue("queryType")
      const xlsType = form.getFieldValue("xlsType")
      let attris = []
      if(attrisFormula){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000006'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisFormula
              })
            }
          })
        }
      }
      if(attrisTName){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000020'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisTName
              })
            }
          })
        }
      }
      if(queryType){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000007'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:queryType
              })
            }
          })
        }
      }
      if(xlsType){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000008'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:xlsType
              })
            }
          })
        }
      }
      if(attrisName){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000011'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisName
              })
            }
          })
        }
      }
      if(attrisDescript){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000012'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisDescript
              })
            }
          })
        }
      }
      if(attrisFont){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000015'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisFont
              })
            }
          })
        }
      }
      if(attrisColor){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000014'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisColor
              })
            }
          })
        }
      }
      map.set(this.state.relacode,attris)
      map.delete("")
      let obj = []
      for( let i of map){
        obj.push({
          code:i[0],
          listcode:i[1],
        })
      }
      arraylist = obj
      if(arraylist.length>0){
        arraylist.map((item)=>{
          if(item.code===info.node.props.relaCode){
            this.setState({
              newattriList:item.listcode
            })
          }
        })
      }
      this.props.form.resetFields()
    }

    /*添加列（字段）弹出模态框*/
    const addColumn = () =>{
      changeColModal(true)
    }
    /*删除列（字段）*/
    const delColumn = () =>{
      const { dispatch } = this.props
      const colCode = this.state.selectedTableKeys[0]
      const tablecode = this.props.TableCode
      if(this.state.selectedTableKeys ==""){
        message.warning('请选择字段！')
      }else{
        confirm({
          title:"确定删除吗？",
          okText: "确定",
          cancelText: "取消",
          onOk (){
            dispatch({
              type: LedgerType+'/linkcoldel',
              payload:{
                colCode:colCode,
              }
            }).then(()=>{
              dispatch({
                type: LedgerType+'/linktabletree',
                payload:{
                  tableCode:tablecode
                }
              }).then(()=>{
                changeTablePropsModal(true)
              })
            })
          }
        })
      }
    }
    /*添加列（字段）保存成功*/
    const saveColumn = () =>{
      this.props.form.validateFields((err,fieldsValue)=>{
        if(err) return
        this.props.dispatch({
          type: LedgerType+'/linkcoladd',
          payload:{
            tableCode:this.props.TableCode,
            tableCol:fieldsValue.tableCol,
            colType:'02',
          }
        }).then(()=>{
          this.props.dispatch({
            type: LedgerType+'/linktabletree',
            payload:{
              tableCode:this.props.TableCode
            }
          }).then(()=>{
            changeTablePropsModal(true)
          })
        })
      })
    }
    /*保存属性*/
    const saveTableProps = () =>{
      const attrisName = this.props.form.getFieldValue("attrisName")
      const attrisTName = this.props.form.getFieldValue("attrisTName")
      const attrisDescript = this.props.form.getFieldValue("attrisDescript")
      const attrisFont = this.props.form.getFieldValue("attrisFont")
      const attrisColor = this.props.form.getFieldValue("attrisColor")
      const attrisFormula = this.props.form.getFieldValue("attrisFormula")
      const queryType = this.props.form.getFieldValue("queryType")
      const xlsType = this.props.form.getFieldValue("xlsType")
      let attris = []
      if(attrisFormula){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000006'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisFormula
              })
            }
          })
        }
      }
      if(attrisTName){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000020'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisTName
              })
            }
          })
        }
      }
      if(queryType){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000007'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:queryType
              })
            }
          })
        }
      }
      if(xlsType){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000008'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:xlsType
              })
            }
          })
        }
      }
      if(attrisName){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000011'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisName
              })
            }
          })
        }
      }
      if(attrisDescript){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000012'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisDescript
              })
            }
          })
        }
      }
      if(attrisFont){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000015'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisFont
              })
            }
          })
        }
      }
      if(attrisColor){
        if(this.state.newattriList){
          this.state.newattriList.map((item)=>{
            if(item.attriCode === '000014'){
              attris.push({
                attriCode:item.attriCode,
                attriContent:attrisColor
              })
            }
          })
        }
      }
      map.set(this.state.relacode,attris)
      //map.delete("")
      let formlist = []
      for(let i of map){
        formlist.push({
          relaCode:i[0],
          attris:i[1],
        })
      }
      //const formLsit = JSON.stringify(map)
      this.props.dispatch({
        type: LedgerType+'/linkattrisave',
        payload:{
          relaCodes:formlist,
        }
      }).then(()=>{
        this.props.form.resetFields()
        map.clear()
      })
    }
    /*遍历table col树*/
    const loop = data => data.map((item) => {
      if (item.tableName) {
        return <TreeNode key={item.tableCode} title={item.tableName} realType={item.tableCode} relaCode ={item.tableCode} isSelected={item.isSelected}>
          {loop(item.colList)}
        </TreeNode>
      }
      return <TreeNode key={item.colCode} title={item.colName} realType={item.colCode} relaCode={item.colCode} isSelected={item.isSelected} />
    })
    /*遍历属性list*/
    const loopExtendTree = data => data.map((item) => {
      if (item.children) {
        return <TreeNode key={item.attriCode} title={item.attriName} parentCode={item.parentCode} attriContent={item.attriContent} isNecessary={item.isNecessary} >
          {loopExtendTree(item.children)}
        </TreeNode>
      }
      return <TreeNode key={item.attriCode} title={item.attriName} parentCode={item.parentCode} attriContent={item.attriContent} isNecessary={item.isNecessary} />
    })
    const loopplainOptionstree = data => data.map((item) => {
      if (item.children){
        return <Link  href={'#'+item.attriCode}  title={item.attriName }>
          {loopplainOptionstree(item.children)}
        </Link>
      }
      return <Link  href={'#'+item.attriCode}  title={item.attriName} />
    })
    /*表属性名称*/
    const Tname = this.state.newattriList&&this.state.newattriList.map((item,key)=>( item.attriCode ==="000020"?
        <Card id="000020" style={{width:'400px'}} key={key}>
          <p className={styles.ptablestyle}>表名称：</p>
          <Divider  className={styles.divider1} />
          <Col span={20} offset={3}>
            <FormItem {...formItemLayout1} hasFeedback>
              {getFieldDecorator('attrisTName',{
                  initialValue:item.attriContent
                }
              )(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Card>
        :null
    ))
    const Tdescription = this.state.newattriList&&this.state.newattriList.map((item,key)=>( item.attriCode ==="000021"?
        <Card id="000021" style={{width:'400px'}} key={key}>
          <p className={styles.ptablestyle}>表描述：</p>
          <Divider  className={styles.divider1} />
          <Col span={20} offset={3}>
            <FormItem {...formItemLayout1} hasFeedback>
              {getFieldDecorator('attrisTdescription',{
                  initialValue:item.attriContent
                }
              )(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Card>
        :null
    ))

    /*属性：名称*/
    const name = this.state.newattriList&&this.state.newattriList.map((item,key) =>( item.attriCode ==="000011"?
        <Card id="000011" style={{width:'400px'}} key={key}>
          <p className={styles.ptablestyle}>名称：</p>
          <Divider  className={styles.divider1} />
          <Col span={20} offset={3}>
            <FormItem {...formItemLayout1} hasFeedback>
              {getFieldDecorator('attrisName',{
                  initialValue:item.attriContent
                }
              )(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Card>
        :null
    ))
    /*属性：描述*/
    const description = this.state.newattriList&&this.state.newattriList.map((item,key) =>( item.attriCode ==="000012"?
        <Card id="000012" style={{width:'400px'}} key={key}>
          <p className={styles.ptablestyle}>描述：</p>
          <Divider  className={styles.divider1} />
          <Col span={20} offset={3}>
            <FormItem {...formItemLayout1}  hasFeedback>
              {getFieldDecorator('attrisDescript',{
                  initialValue:item.attriContent
                }
              )(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Card>
        :null
    ))
    /*属性：字体*/
    const fonttype = this.state.newattriList&&this.state.newattriList.map((item,key) =>( item.attriCode ==="000015"?
        <Card id="000015" style={{width:'400px'}} key={key}>
          <p className={styles.ptablestyle}>字体：</p>
          <Divider  className={styles.divider1} />
          <Col span={20} offset={3}>
            <FormItem {...formItemLayout1} hasFeedback>
              {getFieldDecorator('attrisFont',{
                  initialValue:item.attriContent,
                }
              )(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Card>
        :null
    ))
    /*属性：颜色*/
    const colortype = this.state.newattriList&&this.state.newattriList.map((item,key) =>( item.attriCode ==="000014"?
        <Card id="000014" style={{width:'400px'}} key={key}>
          <p className={styles.ptablestyle}>颜色：</p>
          <Divider  className={styles.divider1} />
          <Col span={20} offset={3}>
            <FormItem {...formItemLayout1} hasFeedback>
              {getFieldDecorator('attrisColor',{
                  initialValue:item.attriContent
                }
              )(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Col>
        </Card>
        :null
    ))
    /*属性：公式*/
    const formula = this.state.newattriList&&this.state.newattriList.map((item,key) =>( item.attriCode ==="000006"?
        <Card id="000006" style={{width:'400px'}} key={key}>
          <p className={styles.ptablestyle}>公式：</p>
          <Divider  className={styles.divider1} />
          <Col span={20} offset={3}>
            <FormItem labelCol={{span:3}} wrapperCol={{span:20}} hasFeedback>
              {getFieldDecorator('attrisFormula',{
                  initialValue:item.attriContent
                }
              )(
                <TextArea placeholder="请输入"
                          rows={3}
                />
              )}
            </FormItem>
          </Col>
        </Card>
        :null
    ))
    /*属性：查询类型*/
    const queryType = this.state.newattriList&&this.state.newattriList.map((item,key) =>( item.attriCode ==="000007"?
        <Card id="000007" style={{width:'400px'}} key={key}>
          <p className={styles.ptablestyle}>查询类型：</p>
          <Divider  className={styles.divider1} />
          <Col span={20} offset={3}>
            <FormItem labelCol={{span:3}} wrapperCol={{span:23}}>
              {getFieldDecorator('queryType',{
                  initialValue:item.attriContent
                }
              )(
                <RadioGroup name="radiogroup">
                  {this.getAttriQuery()}
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Card>
        :null
    ))
    /*属性：xls类型*/
    const xlsType = this.state.newattriList&&this.state.newattriList.map((item,key) =>( item.attriCode ==="000008"?
        <Card id="000008" style={{width:'400px'}} key={key}>
          <p className={styles.ptablestyle}>xls类型：</p>
          <Divider  className={styles.divider1} />
          <Col span={20} offset={3}>
            <FormItem labelCol={{span:5}} wrapperCol={{span:13}} >
              {getFieldDecorator('xlsType',{
                  initialValue:item.attriContent
                }
              )(
                <RadioGroup name="radiogroup">
                  {this.getAttriXls()}
                </RadioGroup>
              )}
            </FormItem>
          </Col>
        </Card>
        :null
    ))
    const {selectedRowKeys} = this.state

    return(
      <div>
        <Modal
          {...tableModalProps}
          className={styles.modalbody}
          onOk={() =>saveTableProps()}
        >
          <Row>
            <Divider  style={{margin:'5px 0',fontSize:'12px'}}>属性</Divider>
            <Col span={6}>
              <Col span={12}>
                <p>主题</p>
              </Col>
              <Col style={{textAlign:'right',marginRight:'10px'}}>
                <a onClick={e =>addColumn()}><Icon type="plus" /></a>
                <a onClick={e =>delColumn()}><Icon type="minus" /></a>
              </Col>
              <Card className={styles.body}>
                <div style={{overflow: 'auto', width:'100%', height: '280px'}}>
                  <Tree
                    showLine
                    defaultExpandedKeys={this.props.TableCode}
                    //onRightClick={onRightClick}
                    onSelect={onSelectTree}
                  >
                    {loop(this.props.linktabletreelist)}
                  </Tree>
                </div>
              </Card>
            </Col>
            <Col span={5}>
              <div>
                <Col style={{height:'20px'}}>
                  <p>可用</p>
                </Col>
                {/*<Col style={{textAlign:'right',marginRight:'10px'}}>
                  <a onClick={e =>this.addColumnprops()}><Icon type="plus" /></a>
                  <a onClick={e =>this.delColumnprops()}><Icon type="minus" /></a>
                </Col>*/}
                {
                  this.state.attriList.length>0?
                    <Card className={styles.body1}>
                      <div style={{overflow: 'auto', width:'100%', height: '280px'}}>
                        {/*<Tree
                          //checkable
                          defaultExpandedKeys={['','']}
                          //selectedKeys={this.state.selectedKeysProps}
                          //onSelect={onSelectAttri}
                          //multiple={true}
                        >
                          {loopExtendTree(this.state.attriList)}
                        </Tree>*/}
                        <Anchor
                      affix={false}
                      className={styles.anchorLink}
                    >
                      {loopplainOptionstree(this.state.attriList)}
                    </Anchor>
                      </div>
                    </Card>:null
                }
              </div>
            </Col>
            <Col span={9}>
              <Col span={4} style={{height:'20px'}}>
                <p>设置</p>
              </Col>
              <div style={{overflow: 'auto', width:'410px', height: '300px'}}>
                {name}
                {Tname}
                {Tdescription}
                {description}
                {colortype}
                {formula}
                {fonttype}
                {queryType}
                {xlsType}
              </div>
            </Col>
          </Row>
        </Modal>
        <Modal
          visible={colVisible}
          maskClosable="false"
          wrapClassName="vertical-center-modal"
          title="添加列"
          onCancel={() =>changeColModal(false)}
          onOk={() =>saveColumn()}
        >
          <Row>
            <FormItem {...formItemLayout} label="列名" hasFeedback>
              {getFieldDecorator('tableCol'
              )(
                <Input placeholder="请输入" />
              )}
            </FormItem>
          </Row>

        </Modal>
      </div>
    )
  }
}
export default Form.create()(TablePropModal)
