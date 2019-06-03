import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input,  Modal,Select,Button ,Tabs,Row ,Col,Checkbox,Table,message,DatePicker,TreeSelect} from 'antd'
import Combinedindex from './Combinedindex'
import Generalindex from './Generalindex'
import Multindex from './Multindex'
import Derivindex  from './Derivindex'
import moment from 'moment'
import { request } from 'utils'
const TreeNode = TreeSelect.TreeNode;
/**
 * @Title:指标库管理》指标管理》创建指标
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2019/4/10
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

class CreateModel extends Component {

  state = {
    modalType:"create",//默认创建update,detail 暂时未用到
    saveButtonVisible:false,//点击下一步通过后置true
    nextButtonVisible:true,//点击下一步通过后置false
    publishButtonVisible:false,//点击下一步通过后置true

    activeKey:"1",//当前tab key
    modelList:[],//数据字段列表
    indexType:"",//指标类型
    IndexTypeList:[],//指标类型列表
    FrequencyList:[],//数据周期
    unitList:[],//数据单位
    statisticsTypeList:[],//统计类型
    productFormatList:[],//统计类型
    treeData:[],//指标编码下拉框
    properties:{
      modelId:"",
      productCode:"",
      productMeasure:"",//多维指标用于度量；普通指标/总账指标：用于度量；派生指标：用于指标配置公式；组合指标：用于指标逻辑ID
      productAggregation:"",
    },//技术属性
    dimList:[],//组合指标维度列表
  };
  onChange = (activeKey) => {
    if(this.state.activeKey==="1")
    {
      message.info("填写完成后，点击下一步")
      return}
    this.setState({
      activeKey,
      nextButtonVisible:true,
      saveButtonVisible:false,
      publishButtonVisible:false,
    });
  }

  componentDidMount() {
    const {IndexTypeList,FrequencyList,unitList,statisticsTypeList,modalType,productFormatList,item}=this.props

    if(modalType!=="create"){
      this.setState({
        indexType:item.info.productType
      })
    }
    this.setState({
      IndexTypeList,FrequencyList,unitList,modalType,statisticsTypeList,productFormatList
    })


  }

  disabledStartDate=(current)=> {
    // 一个月内

    let endtime = new Date(Date.now() + 30 * 24 * 3600 * 1000)
    let startdata=new Date(Date.now() - 0* 24 * 3600 * 1000)


    return (current && current.valueOf() < Date.now()) ||current>endtime;
  }

  onLoadData = (treeNode) => {
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }

      let code=treeNode.props.eventKey
      const {indexType}=this.state
      this.promise = request({
        url:"/gateway/indexsynselect.json",
        method: 'post',
        data: {
          id:code,
          productType:indexType,
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }
        const queryData = result.RSP_BODY.proList||[]
      console.log(queryData,"queryData")
        let treeData =queryData.map((data)=>{
          let obj={
            title:data.productName,
            key:data.id,
            value:data.id,
            isLeaf:data.isLeaf,
            isUsed:data.isUsed===1?true:false
          }
          return obj
        })
        treeNode.props.dataRef.children = treeData;
        this.setState({
          treeData: [...this.state.treeData],
        });
        resolve();
      })

    });
  }


  renderTreeNodes = (data) => {

    const {indexType}=this.state
    let disabled=false
    if (indexType==="basic"){
      disabled=true
    }
    return data.map((item) => {

      if (item.children) {
        return (
          <TreeNode text={item.text} title={item.isUsed?(<b style={{ color: 'rgba(0,0,0,0.25)' }}>{item.title}</b>):item.title} key={item.key} dataRef={item} disabled={disabled} selectable={!item.isUsed} value={item.value} >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} dataRef={item} title={item.isUsed?(<b style={{ color: 'rgba(0,0,0,0.25)' }}>{item.title}</b>):item.title} selectable={!item.isUsed} value={item.value} />;
    });
  }


  render () {
    const {  form} = this.props;
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


    const {  modelList,indexType,IndexTypeList,FrequencyList,unitList,productFormatList,statisticsTypeList,treeData,properties,dimList} = this.state;
   //console.log(indexType,"indexType")
    const {
      item = {info:{},properties:{},dimList:[]},
      onOk,
      form: {
        setFieldsValue,
      getFieldDecorator,
      validateFields,
      getFieldsValue,
        getFieldValue
    },
      confirmLoading,
      modalType,
      queryProductLevData,
      connectionTest,
      onCancel,
      selectInfo,
      ...modalProps

    }  =this.props ;

    const  onChangeCode = (value, label, extra) => {

      if(getFieldValue("productName")===null||getFieldValue("productName")===""||getFieldValue("productName")===undefined)
      {
    setFieldsValue({productName:extra.triggerNode.props.dataRef.text})
    /*       setFieldsValue({productName:value})*/
       }
   }
     const handleOk = () => {
       validateFields((errors, values) => {
        /*多维	multi
          普通	basic
          总账	ledger
          派生	derive
          组合	group	 */
         let   type =values.productType
          if (errors) {
            return
          }
         //console.log(properties,"properties")

          if(type==="multi"){
            let flag = (JSON.stringify(properties) == "{}")
            if(flag){
              message.error("请完成技术属性表单")
              return
            }
            if(properties.modelId===""||properties.productMeasure===""){
              message.error("请完成技术属性表单")
              return
            }
          }
          if(type==="basic"||type==="ledger"){
            if(!properties.modelId){
              message.error("请完成技术属性表单")
              return
            }
          }
          values.productEnableTime = values.productEnableTime.format(dateFormat)
          properties.productCode=values.productCode

          if(type==="group"){
            if(!properties.productMeasure){
              message.error("请选择一条多维指标目录中的指标！")
              return
            }
          }
         //console.log("type",type)
          let obj={
            'info':values,
            properties,
            dimList
          }
          if(type==="derive"){

            if(!properties.productMeasure){
              message.error("请填写指标公式")
              return
            }
            this.promise = request({
              url:"/gateway/indexvalidate.json",
              method: 'post',
              data: {
                formula:properties.productMeasure,
              },
            }).then((result) => {
              if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
                return
              }
              onOk(obj)
            })
          }else{
            onOk(obj)
          }

          /*  //console.log(values,'values')
             let str=""
               values.indexes.forEach((obj)=>{
                 str+="["+obj.name+']'
             })*/



        })
      }
      //下一步
      const onNextStep=()=>{
        validateFields((errors, values) => {
          if (errors) {
          return
          }
          /*  //console.log(values,'values')
             let str=""
               values.indexes.forEach((obj)=>{
                 str+="["+obj.name+']'
             })*/

         //console.log(values,"values")
          this.setState({ activeKey:"2",
            nextButtonVisible:false,
            publishButtonVisible:true,
            saveButtonVisible:true });
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
           this.state.saveButtonVisible&&modalType!=="detail"? <Button type="primary" loading={confirmLoading} onClick={e => handleOk()}>保存</Button>:null,
          /* this.state.publishButtonVisible? <Button type="primary" onClick={e => handleOk()}>发布新版本</Button>:null,*/
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
      modelid=item.info.productDirId
      modelname=item.info.productDirName
    }

    //区分新建和修改end




    const onSelect=(value,option)=>{//选择指标类型

      setFieldsValue({"productCode": ""})
      this.setState({
        indexType:value
      })

      if(value==="basic"||value==="ledger")
      {

          this.promise = request({
            url:"/gateway/indexsynselect.json",
            method: 'post',
            data: {
              id:"-1",
              productType:value,
            },
          }).then((result) => {
            if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
              return
            }
            const queryData = result.RSP_BODY.proList||[]

            let treeData =queryData.map((data)=>{
              let obj={
                title:data.productName,
                key:data.id,
                value:data.id,
                isLeaf:data.isLeaf,
                isUsed:data.isUsed===1?true:false,
                text:data.text
              }
              return obj
            })

            this.setState({treeData:[...treeData]})
          })


      }
    }

    const CombinedindexProsp={//组合
      modalType,//详情
      item,
      type,//是否修改true是
      toselect:(modelId,productMeasure)=>{
        this.setState({
          properties:{
            ...this.state.properties,modelId,productMeasure,
          }
        })
      },
      tosave:(dimList)=>{
        this.setState({
          dimList
        })
      },
    }

     const GeneralindexProsp={//普通or总账
       modalType,//详情
       item,
       type,
       indexType,//"multi多维 basic普通 ledger总账 group组合derive派生
       tosave:(modelId)=>{
          this.setState({
            properties:{
              modelId,
            }
          })
        },

      }

      const MultindexProsp={//多维
        modalType,//详情
        item,
        type,
        tosave:(modelId,productMeasure)=>{
          this.setState({
            properties:{
              modelId,
              productMeasure
            }

          })
        },
      }
      const DerivindexProsp={//派生
        modalType,//详情
        item,
        type,
        onChange:(productMeasure)=>{
          this.setState({
            properties:{
              modelId:"",
              productMeasure
            }
          })
        },
      }

    const switchType=()=>{
      let {indexType} = this.state;
     //console.log("indexType",indexType)
      switch (indexType) {
        case "multi" ://多维
          return <Multindex {...MultindexProsp}/>
        case "basic" ://普通
          return  <Generalindex {...GeneralindexProsp}/>
        case "ledger" ://总账
          return  <Generalindex {...GeneralindexProsp}/>
        case "group" ://组合
          return  <Combinedindex {...CombinedindexProsp}/>
        case "derive" ://派生
          return  <Derivindex {...DerivindexProsp}/>
        default :
          return null
      }
    }
    let end = new Date
    let timestamp = end.getTime()
    let begin = new Date(timestamp - 0 * 24 * 3600 * 1000)

    let betime = []
    betime[0] = moment(begin)
    betime[1] = moment(begin)
    let initialCreateTime =  betime[0]
    const dateFormat1 = 'YYYY-MM-DD HH:mm:ss';
    const dateFormat = 'YYYY-MM-DD';
    return (
        <Modal {...modalOpts}>
          <Form layout="horizontal">
            { getFieldDecorator('productDirId', {
              initialValue: modelid,
            })(<Input   hidden />)
            }
           { type?"":getFieldDecorator('id', {
              initialValue: item.info.id,
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
                <FormItem label="指标名称" hasFeedback {...formItemLayout}>
                  {getFieldDecorator('productName', {
                    initialValue: item.info.productName,
                    //检验节点

                    rules: [
                      {
                        required: true,
                        whitespace:true,
                        message: '指标名称不能为空',
                      },
                    ],
                  })(<Input  placeholder="请输入"
                             disabled={modalType==="detail"?true:false}
                             style={{width:'70%'}} />)}
                </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="指标类型" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('productType', {
                        initialValue: item.info.productType,
                        rules: [
                          {
                            required: true,
                            message: '请选择',
                          },
                        ],
                      })(<Select
                        placeholder="请选择"
                        disabled={!type}
                        onSelect={onSelect}
                        style={{width:'70%'}}>
                        { IndexTypeList &&  IndexTypeList.map((item, key) => <Select.Option value={item.dictValue} key={key}>{item.dictName}</Select.Option>)}

                      </Select>)}
                    </FormItem>
                  </Col>
                  <Col span={12}>
                    {indexType==="basic"||indexType==="ledger"?<FormItem label="指标编码" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('productCode', {
                          initialValue: item.info.productCode,
                          rules: [
                            {
                              required: true,
                              message: '请选择',
                            },
                          ],
                        })(
                          <TreeSelect
                            style={{ width:'70%' }}
                            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                          /*  treeData={productCodeList}*/
                            loadData={this.onLoadData}
                            placeholder="请选择"
                            disabled={!type}
                       /*     treeDefaultExpandAll*/
                             onChange={onChangeCode}
                          >
                        {this.renderTreeNodes(this.state.treeData)}
                          </TreeSelect>
                        )
                        }
                      </FormItem>:
                      <FormItem label="指标编码" hasFeedback {...formItemLayout}>
                        {getFieldDecorator('productCode', {
                          initialValue: item.info.productCode,
                          //检验节点
                          validateTrigger: ['onBlur'],
                          rules: [
                            type ? {
                              validator: (rule, value, callback) => {

                                this.promise = request({
                                  url: "/gateway/utilsvalidateVal.json",
                                  method: 'post',
                                  data: {
                                    tab: "mea_product_info",
                                    col: "product_code",
                                    val: value
                                  },
                                }).then((result) => {
                                  if (result.RSP_HEAD.TRAN_SUCCESS !== '1') {
                                    callback('系统错误')
                                  }
                                  if (result.RSP_BODY.flag) {
                                    callback('编码已存在')

                                  }
                                  callback()
                                })
                              }
                            } : {},
                            {
                              pattern: /^[0-9a-zA-Z]{0,11}$/g,
                              message: '请输入正确编码，编码只允许字母加数字组合且小于11位！',
                            },
                            {
                              required: true,
                              whitespace: true,
                              message: '编码不能为空',
                            },
                          ],
                        })(<Input  placeholder="请输入"
                                   disabled={!type}
                                   style={{width:'70%'}} />)}
                      </FormItem>}

                  </Col>
                </Row>
                <Row>
                  <Col span={12}>

                    <FormItem {...formItemLayout} hasFeedback label="生效时间：">
                      {getFieldDecorator('productEnableTime', {
                      /*  initialValue: item.info.productEnableTime ? initialCreateTime : moment(item.info.productEnableTime, dateFormat),*/
                        initialValue: type ? initialCreateTime : moment(item.info.productEnableTime, dateFormat),

                        rules: [{ required: true, message: "此项不能为空" }]
                      })
                      (<DatePicker
                        showToday={true}
                        placeholder="请选择日期"
                       disabledDate={this.disabledStartDate}
                       disabled={!type}
                      /*  onChange={this.onStartChange}
                        onOpenChange={this.handleStartOpenChange}*/
                        format={dateFormat}
                        allowClear={false}
                        style={{ width:'70%'}}
                      />)
                      }
                    </FormItem>


                  </Col>
                  <Col span={12}>
                    <FormItem label="数据周期" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('productTerm', {
                        initialValue: item.info.productTerm||"D",
                        rules: [
                          {
                            required: true,
                            message: '请选择',
                          },
                        ],
                      })(<Select placeholder="请选择"
                                 disabled={!type}
                                 style={{width:'70%'}}>
                        {FrequencyList && FrequencyList.map((item, key) => <Select.Option value={item.dictValue} key={key}>{item.dictName}</Select.Option>)}

                      </Select>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="统计类型"   {...formItemLayout}>
                      {getFieldDecorator('productStatisticsType', {
                        initialValue: item.info.productStatisticsType,
                        /*  rules: [
                            {
                              required: true,
                              message: '请选择',
                            },
                          ],*/
                      })(<Select placeholder="请选择"
                                 disabled={!type}
                                 style={{width:'70%'}}>
                        {statisticsTypeList && statisticsTypeList.map((item, key) => <Select.Option value={item.dictValue} key={key}>{item.dictName}</Select.Option>)}

                      </Select>)}

                    </FormItem>


                  </Col>
                  <Col span={12}>
                    <FormItem label="可否汇总" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('eSum', {
                        initialValue: item.info.eSum||true,
                        rules: [
                          {
                            required: true,
                            message: '请选择',
                          }
                        ],
                      })(<Select placeholder="请选择"
                                 disabled={!type}

                                 style={{width:'70%'}}>
                        <Select.Option value={true} key={0}>是</Select.Option>
                        <Select.Option value={false} key={1}>否</Select.Option>
                      </Select>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="数据格式"   {...formItemLayout}>
                      {getFieldDecorator('productFormat', {
                        initialValue: item.info.productFormat,
                        /*  rules: [
                            {
                              required: true,
                              message: '请选择',
                            },
                          ],*/
                      })(<Select placeholder="请选择"
                                 disabled={!type}
                                 style={{width:'70%'}}>
                        {productFormatList && productFormatList.map((item, key) => <Select.Option value={item.dictValue} key={key}>{item.dictName}</Select.Option>)}

                      </Select>)}

                    </FormItem>


                  </Col>
                  <Col span={12}>
                    <FormItem label="数据单位" hasFeedback {...formItemLayout}>
                      {getFieldDecorator('productUnit', {
                        initialValue: item.info.productUnit||"00",
                        rules: [
                          {
                            required: true,
                            message: '请选择',
                          },
                        ],
                      })(<Select placeholder="请选择"

                                 disabled={!type}
                                 style={{width:'70%'}}>
                        {unitList && unitList.map((item, key) => <Select.Option value={item.dictValue} key={key}>{item.dictName}</Select.Option>)}

                      </Select>)}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <FormItem label="是否发布"   {...formItemLayout}>
                      {getFieldDecorator('ePublish', {
                        initialValue: item.info.ePublish||false,
                          rules: [
                            {
                              required: true,
                              message: '请选择',
                            },
                          ],
                      })(<Select placeholder="请选择"
                                 disabled={modalType==="detail"?true:false}
                                 style={{width:'70%'}}>
                        <Select.Option value={true} key={0}>是</Select.Option>
                        <Select.Option value={false} key={1}>否</Select.Option>

                      </Select>)}

                    </FormItem>


                  </Col>

                </Row>

              </TabPane>
              <TabPane tab="技术属性"
                //disabled
                       key="2">
                {
                  switchType()
                }

              </TabPane>

            </Tabs>
          </Form>
        </Modal>
      )

  }
}
CreateModel.propTypes = {
  form: PropTypes.object.isRequired,

  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(CreateModel)
