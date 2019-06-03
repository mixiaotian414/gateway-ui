import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input,  Modal,Select,Button ,Tabs,Row ,Col,Checkbox,Table,message} from 'antd'
import EditableTable from './EditableTable'
import { request } from 'utils'
/**
 * @Title:模型管理》模型管理》创建模型
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2019/4/3
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const TabPane = Tabs.TabPane;
const FormItem = Form.Item
const { TextArea } = Input;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
}
const formItemLayout1 = {
  labelCol: {
    span: 3,
  },
  wrapperCol: {
    span: 21,
  },
}
class CreateModelModal extends Component {

  state = {
    item :{},//当前修改值
    eSave:true,//如果该模型下已经创建指标，则所有项均不可修改
    selectModelType:false,//模型类型是否为普通或总账 如果是则TRUE
    saveButtonVisible:false,//点击下一步通过后置true
    nextButtonVisible:true,//点击下一步通过后置true
    advancedFlag:false,//高级按钮
    activeKey:"1",//当前tab key
    modelList:[],//数据字段列表
  /*  addmodelList:[],//数据字段列表*/
    conList:[],//数据源下拉
    tableList:[],//数据表下拉
    modelTypeList:[],//模型类型
    editTableFlag:true,//table是否加载
  };

  componentDidMount() {
    const {conList,modelTypeList,item,modalType}=this.props

    if(modalType!=="create"&&item){

      this.setState({
        eSave:item.eSave
      })
    }

    this.setState({
      conList,modelTypeList
    })
 /*   this.fetchdatabase()
    this.fetchModelType()*/
  }

  fetchdatabase=()=>{//数据源（暂无用，已经由父组件传值）
    this.promise = request({
      url:"/gateway/databaseinfo.json",
      method: 'post',
      data: {
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      if (result.RSP_BODY) {

        const conList =result.RSP_BODY.connectionList

        this.setState({
          conList
        })
      }
    })
  }
  fetchModelType=()=>{//模型类型（暂无用，已经由父组件传值）
    this.promise = request({
      url:"gateway/secdictselect.json",
      method: 'post',
      data: {
        appId: "1",
        dictCode: "modeltype",
      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      if (result.RSP_BODY) {

        const modelTypeList =result.RSP_BODY.modelTypeList

        this.setState({
          modelTypeList
        })
      }
    })
  }


  onChange = (activeKey) => {
    if(this.state.activeKey==="1")
    {
      message.info("填写完成后，点击下一步")
      return}
    this.setState({
      activeKey,
      nextButtonVisible:true,
      saveButtonVisible:false
    });
  }
  render () {

    let list = [
      {
        "tableColumn": "BRANCH__ID",
        "tableColumnName": "机构",
        "tableColumnType": "MYSQL",
        "fieldType": "MYSQL",
        "dimensionType": "MYSQL",
        "aggregateType": "MYSQL",
        "tableColumnLength": "12",
        "tableColumnPrecision": "0",
        "isNull": "true",
        "isPrimaryKey": true,
        "isAvailable": true
      },{
        "tableColumn": "BRANCH__IDa",
        "tableColumnName": "机构a",
        "tableColumnType": "MYSQL",
        "fieldType": "MYSQL",
        "dimensionType": "MYSQL",
        "aggregateType": "MYSQL",
        "tableColumnLength": "12",
        "tableColumnPrecision": "0",
        "isNull": "true",
        "isPrimaryKey": true,
        "isAvailable": true
      }
    ]



    const {  advancedFlag,modelList,editTableFlag,selectModelType,eSave} = this.state;
    list =modelList
    const {
      item = {},
      onOk,
      confirmLoading,
      form: {
      getFieldDecorator,
      validateFields,
      getFieldsValue,
        getFieldValue,
        setFieldsValue
    },
      modalType,
      queryProductLevData,
      connectionTest,
      onCancel,
      selectInfo,//选择目录的ID
      ...modalProps

    }  =this.props ;

    const {modelTypeList,conList,tableList} =this.state
      const handleOk = () => {
        validateFields((errors, values) => {
          let id =item.id
          if (errors) {
          /*  return*/
          }

          /*保存的时候“数据字段”项勾选的列表，必须1：有一个字段类型是维度且维度类型是日期维度，2：至少有一个字段类型是度量，3：字段类型是维度时，维度类型不能为空*/
          /*====================start=====================*/
          /*解读：1.字段类型 fieldType=dimension &&维度 dimensionDateType=1
                 2. fieldType=fact
                 3字段类型 fieldType=dimension &&维度 dimensionDateType===null   false
                 */
          let reason1count=false
          let reason2count=false
          let reason3count=true

         //console.log(modelList,"modelList")
          for (let i=0;i<modelList.length;i++){
            if( modelList[i].eAvailable){//已选列表
               if( modelList[i].fieldType==="fact"){
               reason2count=true;

              }else if ( modelList[i].fieldType==="dimension"&& modelList[i].dimensionDateType==="1"){
                 reason1count=true;
               }

               if( modelList[i].fieldType==="dimension"&& !modelList[i].dimensionDateType){
                 reason3count=false
               }


            }
          }

          if(!(reason2count&&reason1count&&reason3count)){
            if(!reason1count){
              message.error("保存时“数据字段”项勾选的列表，至少有一个字段类型是维度且维度类型是日期维度")
            }
            if(!reason2count)
            message.error("保存时“数据字段”项勾选的列表，至少有一个字段类型是度量")

            if(!reason3count)
              message.error("保存时“数据字段”项勾选的列表，如果字段类型是维度，维度类型不能为空")

            return
          }
          /*====================end=====================*/

          if(values.modelProperty){//后台只要modelTable
            values.modelTable=values.modelTableSQL
          }
          let obj={
            'model_info':values,
            modelList,
            id
          }
          /*   console.log(values,'values')
             let str=""
               values.indexes.forEach((obj)=>{
                 str+="["+obj.name+']'
             })*/
       //console.log(obj,"obj")
          onOk(obj)
        })
      }
      //下一步
      const onNextStep=()=>{
        validateFields((errors, values) => {
          if (errors) {
            return
          }
         /* 如果模型类型是 普通CO或者总账GL,数据字段默认全部选中*/
          let modelType=values.modelType
          if(modelType==="CO"||modelType==="GL"){
            this.setState({selectModelType:true})
          }else{
            this.setState({selectModelType:false})
          }
          /*初始值准备*/
          let sql=values.modelTableSQL
          let modelDatasource=values.modelDatasource//数据源
          let modelProperty=values.modelProperty//是否高级
          let modelTable=values.modelTable//数据库表
          let txt=""//后台传值变量
          let isTable=""//后台传值变量


           /*======区分新建和修改start=======*/
           /*如果新建点了高级需要验证sql，不点高级直接查表字段不需要验证SQL*/
           /*如果是修改，则跳过所有验证部分，并修改取数URL接口*/
           /*新建状态的接口tablemodelresult.json*/
           /*修改状态的接口tablemodelreset.json(重置公用)*/
            if(type){//如果是新建
              if(modelProperty){//是否点高级，点高级需要认证
                isTable="sql"
                txt=sql
                if(!txt){
                  message.error("SQL不能为空")
                  return
                }
                this.promise = request({
                  url:"/gateway/tablemodeltest.json",
                  method: 'post',
                  data: {
                    sql,
                    modelDatasource
                  },
                }).then((result) => {
                  if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
                    message.error("连接失败！")
                    return
                  }
                  if (result.RSP_BODY) {
                    const resultc =result.RSP_BODY.result
                    if(resultc){//如果验证成功

                      this.promise = request({
                        url:"/gateway/tablemodelresult.json",
                        method: 'post',
                        data: {
                          isTable,
                          txt,
                          modelDatasource
                        },
                      }).then((resulta) => {
                       //console.log(resulta,"resulta")
                        if (resulta.RSP_HEAD.TRAN_SUCCESS!=='1') {
                          message.error("连接失败！")
                          return
                        }
                        if (resulta.RSP_BODY) {
                          const list =resulta.RSP_BODY.modelList
                         //console.log(list,"modelList")
                          if(list){
                            this.setState({ modelList:list});
                          }
                        }
                      })

                      this.setState({ activeKey:"2",nextButtonVisible:false,saveButtonVisible:true });
                    }
                    else{
                      message.error("SQL测试未通过，请检查SQL")
                    }
                  }
                })
                /*   console.log(values,'values')
                   let str=""
                     values.indexes.forEach((obj)=>{
                       str+="["+obj.name+']'
                   })*/
              }else{//没点高级按钮

                isTable="table"
                txt=modelTable
                if(!txt){
                  message.error("数据表不能为空")
                  return
                }
                this.promise = request({
                  url:"/gateway/tablemodelresult.json",
                  method: 'post',
                  data: {
                    isTable,
                    txt,
                    modelDatasource
                  },
                }).then((resultb) => {

                  if (resultb.RSP_HEAD.TRAN_SUCCESS!=='1') {
                    message.error("连接失败！")
                    return
                  }
                  if (resultb.RSP_BODY) {

                    const modelList =resultb.RSP_BODY.modelList
                    if(modelList){

                      this.setState({ modelList});
                    }
                  }
                })
                this.setState({ activeKey:"2",nextButtonVisible:false,saveButtonVisible:true });
              }

            }else{//如果是修改
              let id =item.id
              this.promise = request({
                url:"/gateway/tablemodelreset.json",
                method: 'post',
                data: {
                  id
                },
              }).then((resultb) => {

                if (resultb.RSP_HEAD.TRAN_SUCCESS!=='1') {
                  message.error("连接失败！")
                  return
                }
                if (resultb.RSP_BODY) {

                  const modelList =resultb.RSP_BODY.modelList
                  if(modelList){

                    this.setState({ modelList});
                  }
                }
              })
              this.setState({ activeKey:"2",nextButtonVisible:false,saveButtonVisible:true });


            }

        })
      }
      const handleTest = () => {
        validateFields((errors, values) => {
          if (errors) {
            return
          }
          connectionTest(values)
        })
      }

      const modalOpts = {
        ...modalProps,
        onCancel,
        footer:
          [
            this.state.nextButtonVisible? <Button type="primary" onClick={e => onNextStep()}>下一步</Button>:null,
            <Button type="primary" onClick={e => onCancel()}>取消</Button>,
           this.state.saveButtonVisible&&eSave? <Button type="primary"  loading={confirmLoading}onClick={e => handleOk()}>保存</Button>:null,
          ],
      }

      //区分新建和修改start
    let type=modalType==='create'?true:false
    let modelid
    let modelname
    if(type){//如果是新增，目录ID从前面传
       modelid=selectInfo.value
       modelname=selectInfo.name
    }else{//目录ID ，目录名称
      modelid=item.modelDirId
      modelname=item.modelDirText
    }

    //区分新建和修改end
    const editableTableProsp={
      eSave,//是否可以修改
      confirmLoading,
      selectModelType,//模型类型是否是普通或总账，如果是的话，数据字段全部不可以选中
      modalDataSource:list,
   /*   tosave:(addmodelList)=>{
        this.setState({
          addmodelList
        })
      },*/
      onChange:(modelList)=>{
       //console.log(modelList,"modelList")
        this.setState({
          modelList
        })
      },
      toModalConfirm(selectedRows){
        dispatch({
          type: 'dbzz/changeToggle', payload: {
            tab2: false,
            tempconfirm:true,
            modallistdata:selectedRows
          }
        })
      }
    }

    const onSelect=(value,option)=>{
      let modelType=getFieldValue("modelType")//模型类型
      if(!modelType){
        message.info("请选择模型类型")
        return
      }
      this.promise = request({
        url:"/gateway/tablemodelselecttable.json",
        method: 'post',
        data: {
          modelDatasource:value,
          modelType
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }
        if (result.RSP_BODY) {

          const tableList =result.RSP_BODY.tableList
          setFieldsValue({"modelTable": ""})
          this.setState({
            tableList
          })
        }
      })
    }
    const onSelectModel=(value,option)=>{
      let modelDatasource=getFieldValue("modelDatasource")//模型类型
      if(!modelDatasource){
        return
      }
      this.promise = request({
        url:"/gateway/tablemodelselecttable.json",
        method: 'post',
        data: {
          modelDatasource,
          modelType:value,
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }
        if (result.RSP_BODY) {

          const tableList =result.RSP_BODY.tableList
          setFieldsValue({"modelTable": ""})
          this.setState({
            tableList
          })
        }
      })
    }

    const testSQL=()=>{
     //console.log("aaa")
      let sql=getFieldValue("modelTableSQL")
      let modelDatasource=getFieldValue("modelDatasource")

      this.promise = request({
        url:"/gateway/tablemodeltest.json",
        method: 'post',
        data: {
          sql,
          modelDatasource
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          message.error("连接失败！")
          return
        }
        if (result.RSP_BODY) {
          const flag =result.RSP_BODY.result
          if(flag)
          message.success("测试成功！")
          else{
            message.error("测试失败！")
          }
        }
      })

    }
    const synchronize=()=>{//同步


      let txt=getFieldValue("modelTable")
      let id=item.id
      let modelDatasource=getFieldValue("modelDatasource")

      this.promise = request({
        url:"/gateway/tablemodelsynchronization.json",
        method: 'post',
        data: {
          txt,
          id,
          modelDatasource
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          message.error("连接失败！")
          return
        }
        if (result.RSP_BODY) {
          const modelListAdd =result.RSP_BODY.modelList
          if(modelListAdd.length>0){


            const ConmodelList=modelList.concat(modelListAdd)
           //console.log(ConmodelList,"ConmodelList")
            this.setState({modelList:ConmodelList})
            message.info("新增字段成功")
          }else{
            message.info("无新增字段")
          }

        }
      })

    }
    const reset=()=>{//重置

      let id=item.id

      this.promise = request({
        url:"/gateway/tablemodelreset.json",
        method: 'post',
        data: {
          id
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          message.error("连接失败！")
          return
        }
        if (result.RSP_BODY) {
          const modelListAdd =result.RSP_BODY.modelList
          if(modelListAdd.length>0){

            this.setState({modelList:modelListAdd,editTableFlag:false},()=>{
              this.setState({
                editTableFlag:true
              })
            })
            message.info("重置成功")
          }else{
            message.info("重置失败")
          }

        }
      })

    }

    return (
        <Modal {...modalOpts}>
          <Form layout="horizontal">

            { getFieldDecorator('modelDirId', {
              initialValue: modelid,
            })(<Input   hidden />)
            }
            <Tabs
              defaultActiveKey="1"
              onChange={this.onChange}
              activeKey={this.state.activeKey}
            >
              <TabPane tab="基本信息" key="1">
                <Row>
                  <Col span={12}>
                <FormItem label="所属目录" hasFeedback {...formItemLayout}>
                 <Input value={modelname} style={{width:'70%'}} disabled={true}/>
                </FormItem>
                  </Col>
                  <Col span={12}>
                <FormItem label="模型名称" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('modelName', {
                    initialValue: item.modelName,
                    //检验节点
                    validateTrigger: [ 'onBlur'],
                    rules: [

                      {
                        required: true,
                        whitespace:true,
                        message: '模型名称不能为空',
                      },
                    ],
                  })(<Input  placeholder="请输入"
                             disabled={!eSave}
                             style={{width:'70%'}} />)}
                </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                <FormItem label="模型类型" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('modelType', {
                    initialValue: item.modelType,
                    rules: [
                      {
                        required: true,
                        message: '请选择',
                      },
                    ],
                  })(<Select
                    onSelect={onSelectModel}
                    disabled={!type}
                    placeholder="请选择" style={{width:'70%'}}>
                    {modelTypeList && modelTypeList.map((item, key) => <Select.Option value={item.dictValue} key={key}>{item.dictName}</Select.Option>)}

                  </Select>)}
                </FormItem>
                  </Col>
                  <Col span={12}>
                <FormItem label="数据源" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('modelDatasource', {
                        initialValue: item.modelDatasource,
                        rules: [
                          {
                            required: true,
                            message: '请选择',
                      },
                    ],
                  })(<Select placeholder="请选择"
                             onSelect={onSelect}
                             disabled={!type}
                             style={{width:'70%'}}>
                    {conList && conList.map((item, key) => <Select.Option value={item.id} key={key}>{item.connectionName}</Select.Option>)}

                  </Select>)}
                </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                <FormItem label="数据库表"   {...formItemLayout}>
                  {getFieldDecorator('modelTable', {
                    initialValue: item.modelTable,
              /*      rules: [
                      {
                        required: !advancedFlag,
                        message: '请选择',
                      },
                    ],*/
                  })(<Select placeholder="请选择"
                             disabled={advancedFlag||!type}
                             style={{width:'70%'}}>
                    {tableList && tableList.map((item, key) => <Select.Option value={item.value} key={key}>{item.text}</Select.Option>)}

                  </Select>)}
                  {getFieldDecorator('modelProperty', {
                    valuePropName: 'checked',
                    initialValue: false,
                  })(  <Checkbox style={{marginLeft:"10px"}}
                                 disabled={!type}
                                 onChange={()=>{
                    this.setState({
                      advancedFlag:!advancedFlag

                    })}}>高级</Checkbox>)}


                </FormItem>


                  </Col>

                </Row>

                <Row>
                  <Col span={24}>
                <FormItem label="SQL"  {...formItemLayout1}>
                  {getFieldDecorator('modelTableSQL', {
                    initialValue: item.modelTableSQL,


                  })(<TextArea  placeholder="请输入"
                                disabled={!advancedFlag||!type}
                                rows={4}
                                style={{width:'80%'}}
                              />)}
                  <a href="javascript:null" disabled={!advancedFlag} style={{marginLeft:"10px",lineHeight:"6"}} onClick={()=>testSQL()}>测试</a>
                </FormItem>

                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                <FormItem label="描述" hasFeedback {...formItemLayout1}>
                  {getFieldDecorator('modelDesc', {
                    initialValue: item.modelDesc,
                    //检验节点

                  })(<TextArea  placeholder="请输入"
                                disabled={!eSave}
                                rows={4}
                             style={{width:'80%'}} />)}
                </FormItem>
                  </Col>
                </Row>
              </TabPane>
              <TabPane tab="数据字段"
                //disabled
                       key="2">
                <Row type="flex" justify="start">
                  <Col span={24}   >
                    <Row type="flex" justify="left"  >
                      <Col span={2}  >
                        { type?"": <Button  onClick={()=>{
                          reset()
                        }} icon="" >重置</Button>}
                      </Col>
                      <Col span={2}  >
                        { type||advancedFlag?"": <Button   onClick={()=>{
                          synchronize()
                        }} icon="" >同步</Button>}
                      </Col>
                   {/*   <Col span={3}  >
                        <Button    onClick={()=>{
                          this.props.onAdd()
                        }} icon="plus" >增加字段</Button>
                      </Col>*/}

                    </Row>
                  </Col>


                </Row>
                <Row >
                  <Col span={24}>
                    {editTableFlag?<EditableTable {...editableTableProsp}/>:""}

              </Col>
            </Row>
              </TabPane>

            </Tabs>
          </Form>
        </Modal>
      )

  }
}
CreateModelModal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(CreateModelModal)
