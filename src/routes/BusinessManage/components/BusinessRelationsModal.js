import React,{Component} from 'react'
import { Page } from 'components'
import { Row, Col,Form,Button,message,Modal,Card,Icon,Tree,Anchor,Input,Checkbox,Select } from 'antd'

/**
 * @Title:业务关系模态框组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2018/7/11
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FormItem = Form.Item
const TreeNode = Tree.TreeNode
const { Link } = Anchor;
const confirm = Modal.confirm
const { TextArea } = Input;
const Option = Select.Option

let set = new Set()
let Formula = new Set()
class BusinessRelationsModal extends Component{
  state = {
    textareaVisible:false,
    conditionVisible:false,
    textAreaValue:"",
    formula1Value:"",
    flag:0,//记录点击添加公式次数
    increase:0,//自增1（步长）
    dropdowntablelist:[],
    formulaTable1:"",
    formulaTable2:"",
    tableOne:"",
    tableTwo:"",
    columnOne:"",
    columnTwo:"",
    tableCode1:"",
    tableCode2:"",
    colCode1:"",
    colCode2:"",
    isComplex:"02",
    checked:false,
    checked2:"",
  };

  componentWillReceiveProps = ()=>{
    if(this.props.relationList){
      if(this.props.relationList.relationalFormulaShow){
        if(this.state.checked2==='01'){
          this.setState({
            textareaVisible:true,
            checked:true,
            textAreaValue:this.props.relationList.relationalFormulaShow,
          })
        }else {
          this.setState({
            textareaVisible:false,
            checked:false,
            textAreaValue:this.props.relationList.relationalFormulaShow,
          })
        }
      }else if(this.state.checked2==='01'){
        this.setState({
          textareaVisible:true,
          checked:true,
          textAreaValue:this.props.relationList.relationalFormulaShow,
        })
      }else {
        this.setState({
          textareaVisible:false,
          checked:false,
          textAreaValue:this.props.relationList.relationalFormulaShow,
        })
      }
      if(this.props.relationList.tableCodeShow1||this.props.relationList.tableCodeShow2){
        if(this.state.tableOne===""&&this.state.tableTwo===""){
          this.setState({
            tableOne:this.props.relationList.tableCodeShow1,
            tableTwo:this.props.relationList.tableCodeShow2,
            tableCode1:this.props.relationList.tableCode1,
            tableCode2:this.props.relationList.tableCode2,
          })
        }
      }
      if(this.props.relationList.isComplex==='01'){
        if(this.state.checked2 === '02'){
          this.setState({
            checked:false,
            textareaVisible:false,
            isComplex:"02",
          })
        }else {
          this.setState({
            checked:true,
            textareaVisible:true,
            isComplex:"01",
          })
        }
      }
    }
  }


  onChange =(e)=>{
    this.setState({
      isComplex:e.target.checked? "01":"02",
      textareaVisible:e.target.checked,
      checked:e.target.checked,
      checked2:e.target.checked? "01":"02",
    })
  };

  onShowCondtionModal =()=>{
    this.setState({
      conditionVisible:true,
      flag:this.state.increase+1,
      increase:this.state.flag+1,
    })
  }
  /*清空公式*/
  reSetTextArea =()=>{
    this.props.form.resetFields(['textarea']);
    set.clear()
    Formula.clear()
    this.setState({
      textAreaValue:"",
      formula1Value:"",
      flag:0,
      increase:0,
    })
  }
  changeFormula =(e)=>{
    if(this.props.relationList){
      this.setState({
        textAreaValue:this.props.relationList.relationalFormulaShow
      })
    }else {
      this.setState({
        textAreaValue:e.target.value
      })
    }

  }

  getFromTableList() {
    const array = this.props.selectFromTableList
    const select_list = array.length && array.map(k => ({ ...k, tableName: `${k.tableName}`,tableCode: `${k.tableCode}` }));
    if (select_list.length > 0) {
      return select_list.map(k => <Option key={JSON.stringify(k)} title={k.tableName} value={k.tableCode}>{k.tableName}</Option>)
    }
    return null;
  }
  getTargetTableList() {
    const array = this.props.selectTargetTableList
    const select_list = array.length && array.map(k => ({ ...k, tableName: `${k.tableName}`,tableCode: `${k.tableCode}` }));
    if (select_list.length > 0) {
      return select_list.map(k => <Option key={JSON.stringify(k)} title={k.tableName} value={k.tableCode}>{k.tableName}</Option>)
    }
    return null;
  }

  getFColList() {
    const array = this.props.selectFColList
    const select_list = array.length && array.map(k => ({ ...k, colName: `${k.colName}`,colCode: `${k.colCode}` }));
    if (select_list.length > 0) {
      return select_list.map(k => <Option key={JSON.stringify(k)} title={k.colName} value={k.colCode}>{k.colName}</Option>)
    }
    return null;
  }
  getTColList() {
    const array = this.props.selectTColList
    const select_list = array.length && array.map(k => ({ ...k, colName: `${k.colName}`,colCode: `${k.colCode}` }));
    if (select_list.length > 0) {
      return select_list.map(k => <Option key={JSON.stringify(k)} title={k.colName} value={k.colCode}>{k.colName}</Option>)
    }
    return null;
  }



  render(){
    const { LedgerType,changeBusinessRelationsModal,businessRelationsVisible,relationtitle } =this.props
    const { getFieldDecorator,getFieldsValue} = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 10,
      },
      wrapperCol: {
        span: 14,
      },
    };
    const handleOk =()=>{
      if(relationtitle === 'create'){
        addRelations()
      }
      if(relationtitle === 'update'){
        updateRelations()
      }
    };



    const addRelations =()=>{
      if(this.state.isComplex === '01'){
        const { form, dispatch } = this.props
        form.validateFields((err, fieldsValue) => {
          if (err) return
          dispatch({
            type:LedgerType+'/modelrelaadd',
            payload:{
              modelCode:this.props.ModelCode,
              relationalName:fieldsValue.relationalName,
              tableCode1:this.state.tableCode1,
              tableCode2:this.state.tableCode2,
              colCode1:"",
              colCode2:"",
              relationalType:fieldsValue.relationalType,
              isComplex:this.state.isComplex,
              relationalFormula:this.state.formula1Value,
            }
          })
          form.resetFields()
          set.clear()
          Formula.clear()
          this.setState({
            textAreaValue:"",
            formula1Value:"",
            flag:0,
            increase:0,
          })
        })
      }else {
        const { form, dispatch } = this.props
        form.validateFields((err, fieldsValue) => {
          if (err) return
          dispatch({
            type:LedgerType+'/modelrelaadd',
            payload:{
              modelCode:this.props.ModelCode,
              relationalName:fieldsValue.relationalName,
              tableCode1:this.state.tableCode1,
              tableCode2:this.state.tableCode2,
              colCode1:this.state.colCode1,
              colCode2:this.state.colCode2,
              relationalType:fieldsValue.relationalType,
              isComplex:this.state.isComplex,
              relationalFormula:this.state.formula1Value,
            }
          })
          form.resetFields()
          set.clear()
          Formula.clear()
          this.setState({
            textAreaValue:"",
            formula1Value:"",
            flag:0,
            increase:0,
          })
        })
      }
    }

    const updateRelations =()=>{
      if(this.state.isComplex === '01'){
        const { form, dispatch } = this.props
        form.validateFields((err, fieldsValue) => {
          if (err) return
          dispatch({
            type:LedgerType+'/modelrelationalsave',
            payload:{
              modelCode:this.props.ModelCode,
              relationalCode:fieldsValue.relationalCode,
              relationalName:fieldsValue.relationalName,
              tableCode1:this.state.tableCode1===""?this.props.relationList.tableCode1:this.state.tableCode1,
              tableCode2:this.state.tableCode2===""?this.props.relationList.tableCode2:this.state.tableCode2,
              colCode1:"",
              colCode2:"",
              relationalType:fieldsValue.relationalType,
              isComplex:this.state.isComplex,
              relationalFormula:this.state.formula1Value===""?this.props.relationList.relationalFormula:this.state.formula1Value,
            }
          })
          form.resetFields()
          set.clear()
          Formula.clear()
          this.setState({
            textAreaValue:"",
            formula1Value:"",
            flag:0,
            increase:0,
          })
        })
      }else {
        const { form, dispatch } = this.props
        form.validateFields((err, fieldsValue) => {
          if (err) return
          dispatch({
            type:LedgerType+'/modelrelationalsave',
            payload:{
              modelCode:this.props.ModelCode,
              relationalCode:fieldsValue.relationalCode,
              relationalName:fieldsValue.relationalName,
              tableCode1:this.state.tableCode1===""?this.props.relationList.tableCode1:this.state.tableCode1,
              tableCode2:this.state.tableCode2===""?this.props.relationList.tableCode2:this.state.tableCode2,
              colCode1:this.state.colCode1===""?this.props.relationList.colCode1:this.state.colCode1,
              colCode2:this.state.colCode2===""?this.props.relationList.colCode2:this.state.colCode2,
              relationalType:fieldsValue.relationalType,
              isComplex:this.state.isComplex===""?this.props.relationList.isComplex:this.state.isComplex,
              relationalFormula:""
            }
          })
          form.resetFields()
          set.clear()
          Formula.clear()
          this.setState({
            textAreaValue:"",
            formula1Value:"",
            flag:0,
            increase:0,
          })
        })
      }
    }

    /*添加公式*/
    const handleConditionOk =()=>{
      const tableOne = this.state.tableOne
      const tableTwo = this.state.tableTwo
      const columnOne = this.state.columnOne
      const columnTwo = this.state.columnTwo
      const tablecode1 = this.state.tableCode1
      const tablecode2 = this.state.tableCode2
      const colcode1 = this.state.colCode1
      const colcode2 = this.state.colCode2
      let obj = []
      let obj2 = []
      let Formula1 = []
      let Formula2 = []
      /*如果flag>1,说明点击添加公式的次数>1*/
      if(this.state.flag>1){
        for(let i=1;i<=this.state.flag;i++){
          set.add("["+"\""+tableOne+"."+columnOne+"\""+"]"+"="+"["+"\""+tableTwo+"."+columnTwo+"\""+"]")
          Formula.add("["+"\""+tablecode1+"."+colcode1+"\""+"]"+"="+"["+"\""+tablecode2+"."+colcode2+"\""+"]")
        }
        for(let i of set){
          obj2.push(i)
        }
        for(let i of Formula){
          Formula2.push(i)
        }
        this.setState({
          conditionVisible:false,
          textAreaValue: ("AND"+"("+obj2+")").toString(),
          formula1Value:("AND"+"("+Formula2+")").toString()
        })
      }else {
        set.add("["+"\""+tableOne+"."+columnOne+"\""+"]"+"="+"["+"\""+tableTwo+"."+columnTwo+"\""+"]")
        Formula.add("["+"\""+tablecode1+"."+colcode1+"\""+"]"+"="+"["+"\""+tablecode2+"."+colcode2+"\""+"]")
        for(let i of set){
          obj.push(i)
        }
        for(let i of Formula){
          Formula1.push(i)
        }
        this.setState({
          conditionVisible:false,
          textAreaValue: obj.toString(),
          formula1Value: Formula1.toString()
        })
      }
    }
    const onFromTableChange = (e,Array)=>{
      this.props.dispatch({
        type: LedgerType+'/modelfcollist',
        payload:{
          tableCode:e
        }
      }).then(()=>{
        this.setState({
          formulaTable1:e,
          tableOne:Array.props.title,
          tableCode1:e,
        })
      })
    }
    const onTargetTableChange = (e,Array)=>{
      this.props.dispatch({
        type: LedgerType+'/modeltcollist',
        payload:{
          tableCode:e
        }
      }).then(()=>{
        this.setState({
          formulaTable2:e,
          tableTwo:Array.props.title,
          tableCode2:e
        })
      })
    }

    const onColOneChange = (e,Array)=>{
      this.setState({
        columnOne:Array.props.title,
        colCode1:e,
      })
    }
    const onColTwoChange = (e,Array)=>{
      this.setState({
        columnTwo:Array.props.title,
        colCode2:e,
      })
    }

    const onCancel =()=>{
      changeBusinessRelationsModal(false)
      set.clear()
      Formula.clear()
      this.setState({
        textAreaValue:"",
        formula1Value:"",
        flag:0,
        increase:0,
        checked2:"",
      })
      this.props.form.resetFields()
    }
    const onCancelTwo =()=>{
      this.setState({conditionVisible:false})
    }

    const relationsProps = {
      visible: businessRelationsVisible,
      maskClosable: false,
      title: relationtitle === 'create'?'创建模型关系':'修改模型关系',
      wrapClassName: 'vertical-center-modal',
      width:"700px",
      onCancel:()=>{onCancel()},
      onOk:()=>{handleOk()}
    };
    const joinConditionProps = {
      visible: this.state.conditionVisible,
      maskClosable: false,
      title: '添加链接条件',
      wrapClassName: 'vertical-center-modal',
      width:"600px",
      onCancel:()=>{onCancelTwo()},
      onOk:()=>{handleConditionOk()}
    };

    return(
      <div>
        <Modal
          {...relationsProps}
        >
          <Form>
            <Row>
              <Col span={10} offset={2}>
                <FormItem {...formItemLayout} label="来源  表" >
                  {getFieldDecorator(`fromtable`,
                    {
                      initialValue:relationtitle === 'create'?undefined:this.props.relationList.tableCodeShow1,
                      rules: [{ required: true, message: "来源表不能为空" }]
                    }
                  )(
                    <Select  placeholder="请选择"  onChange={onFromTableChange} >
                      {this.getFromTableList()}
                    </Select>
                  )
                  }
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="来源  字段" >
                  {getFieldDecorator(`fromfield`,
                    {
                      initialValue:relationtitle === 'create'?undefined:this.props.relationList.isComplex ==='01'? undefined:this.props.relationList.colCodeShow1
                    })(
                    <Select placeholder="请选择" disabled={this.state.checked? true : false} onChange={onColOneChange}>
                      {this.getFColList()}
                    </Select>
                  )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={2}>
                <FormItem {...formItemLayout} label="目标  表" >
                  {getFieldDecorator(`targettable`,
                    {
                      initialValue:relationtitle === 'create'?undefined:this.props.relationList.tableCodeShow2,
                      rules: [{ required: true, message: "目标表不能为空" }]
                    }
                  )(
                  <Select  placeholder="请选择" onChange={onTargetTableChange} >
                    {this.getTargetTableList()}
                  </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem {...formItemLayout} label="目标 字段" >
                  {getFieldDecorator(`targetfield`,
                    {
                      initialValue:relationtitle === 'create'?undefined:this.props.relationList.isComplex ==='01'? undefined:this.props.relationList.colCodeShow2
                    })(
                    <Select placeholder="请选择" disabled={this.state.checked? true : false} onChange={onColTwoChange} >
                      {this.getTColList()}
                    </Select>
                  )
                  }
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={2}>
                <FormItem {...formItemLayout} label="关系名" >
                  {getFieldDecorator(`relationalName`,
                    {
                      initialValue:relationtitle === 'create'?undefined:this.props.relationList.relationalName,
                      rules: [{ required: true, message: "关系名不能为空" }]
                    })(
                    <Input placeholder="请输入" style={{width:'260px'}}/>
                  )}
                  {getFieldDecorator(`relationalCode`,
                    {
                      initialValue:relationtitle === 'create'?undefined:this.props.relationList.relationalCode
                    })(
                    <Input placeholder="请输入" style={{width:'260px'}} type="hidden" />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={2}>
                <FormItem {...formItemLayout} label="表之间连接类型" >
                  {getFieldDecorator(`relationalType`,
                    {
                      initialValue:relationtitle === 'create'?undefined:this.props.relationList.relationalType
                    })(
                  <Select  placeholder="请选择"  style={{width:'260px'}} >
                    <Select.Option value="left join">left join</Select.Option>
                    <Select.Option value="right join">right join</Select.Option>
                    <Select.Option value="inner join">inner join</Select.Option>
                    <Select.Option value="full outer">full outer</Select.Option>
                  </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10} offset={2}>
                <FormItem {...formItemLayout} label="复杂连接类型" >
                  {/*{
                    this.props.relationList.isComplex == '01' ? this.setState({
                      checked: true
                    }) : this.setState({checked: false})
                  }*/}
                    <Checkbox
                        checked={this.state.checked}
                        onChange={this.onChange}
                    />

                </FormItem>
              </Col>
            </Row>
            <Row>
              <Row style={{textAlign:'right',marginRight:'60px'}}>

                <a onClick={e=>this.onShowCondtionModal()} disabled={ this.state.textareaVisible? false : true }><Icon type="plus" /></a>
                <a onClick={e=>this.reSetTextArea()} disabled={ this.state.textareaVisible? false : true }><Icon type="minus" /></a>
              </Row>
              <Col>
                <FormItem labelCol={{span:'6'}} wrapperCol={{span:'16'}}  label="复杂连接条件公式" >
                  <TextArea
                    id="textarea"
                    rows={4}
                    value={this.state.textAreaValue}
                    disabled={ this.state.textareaVisible? false : true }
                    //onChange={this.changeFormula}
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Modal>
        <Modal
          {...joinConditionProps}
        >
          <Form layout="inline">
            <Row>
              <p>选择两个列以加入连接条件</p>
            </Row>
            <Row>
              <FormItem label="">
                {getFieldDecorator(`tableOne`,
                  {
                    initialValue:relationtitle ==='create'?this.state.tableOne:this.state.tableOne ===""?this.props.relationList.tableCodeShow1:this.state.tableOne
                  }
                )(
                <Select  placeholder="请选择" style={{width:'260px'}} disabled >
                  {this.getFromTableList()}
                </Select>
                )}
              </FormItem>
              <FormItem label="">
                {getFieldDecorator(`columnOne`
                )(
                  <Select  placeholder="请选择" style={{width:'260px'}} onChange={onColOneChange} >
                    {this.getFColList()}
                  </Select>
                )}
              </FormItem>
            </Row>
            <Row>
              <FormItem label="">
                {getFieldDecorator(`tableTwo`,
                  {
                    initialValue:relationtitle ==='create'?this.state.tableTwo:this.state.tableTwo === ""?this.props.relationList.tableCodeShow2:this.state.tableTwo
                  }
                )(
                  <Select  placeholder="请选择" style={{width:'260px'}} disabled >
                    {this.getTargetTableList()}
                  </Select>
                )}
              </FormItem>
              <FormItem label="">
                {getFieldDecorator(`columnTwo`)(
                    <Select  placeholder="请选择" style={{width:'260px'}} onChange={onColTwoChange} >
                      {this.getTColList()}
                    </Select>
                )}
              </FormItem>
            </Row>
          </Form>
        </Modal>
      </div>
    )
  }
}
export default Form.create()(BusinessRelationsModal)
