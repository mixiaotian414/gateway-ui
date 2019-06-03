import React,{ Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input,  Modal,Select,Button ,Tabs,Row ,Col,Checkbox,Table,message,Card,Tree,TreeSelect} from 'antd'
import { arrayToTree, queryArray,request } from 'utils'
import { connect } from 'dva'
const { TextArea } = Input;
/**
 * @Title:指标库管理》指标管理》创建指标》派生指标
 * @Description:禁止用户输入字符，增加输入校验，暂不用
 * @Author: mxt
 * @Time: 2019/4/16
 * @updateTime: 2019/5/9
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const TreeNode = Tree.TreeNode
const FormItem = Form.Item

class DerivindexOld extends Component {

  state = {
    item :{},
    list:[],
    expandedKeysa:["1"],
    expandedKeysb:["0"],
    expandedKeysc:["0"],
    textAreaRef:"",
    modelList:[],//数据字段列表
    valueText: '',
    TransText:"",//实时翻译，暂不用
    resultTransText:"",//点击测试按钮返回的翻译
    errorFlag:false,//是否有抛出错误
    errorMessage:"",
    KeyList : [],//公式对外文本
    KeyValueList:[],//公式的对内编
  };
  componentDidMount=()=>{

    this.promise = request({//模型目录含模型
      url:"/gateway/indexproattrtree.json",
      method: 'post',
      data: {

      },
    }).then((result) => {
      if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
        return
      }
      const modeltree = result.RSP_BODY.producttree
      const list=[{
        id: '-1',
        productName: "指标目录",
        modelId: "1",
        children:modeltree
      }]
      this.setState({
        list,
        expandedKeysa:["-1"],
      })
    })


  }

  handleKeyDown(e) {
    e.preventDefault();
   //console.log(e.key,"key")
   //console.log(e.keyCode,"keycode")

    const  keyCode=e.keyCode
    const   title=e.key
    const   value=e.key
    let obj={value,title}
    if(keyCode>47&&keyCode<58||(keyCode>95&&keyCode<106)){//0-9
     obj.type='number'
    this.handleValueInput(obj)
    }else if (keyCode>105&&keyCode<108||keyCode===109||keyCode===111){//*+-/
      obj.type='operator'
      this.handleValueInput(obj)
    }else if(keyCode===110){
      obj.type='point'

      this.handleValueInput(obj)
    }else if(keyCode===8){
      obj.type='back'
      this.handleValueInput(obj)
    }else if(title==="("){
      obj.type='brackets-left'
      this.handleValueInput(obj)
    }else if(title===")"){
      obj.type='brackets-right'
      this.handleValueInput(obj)
    }else{
      return
    }
    /*   if(e.keyCode===8){
         var textValue = '';
         var textObj = this.refs.textArea;
         console.log('textObj',textObj)
         if(textObj.setSelectionRange){
           var rangeStart=textObj.selectionStart;
           var rangeEnd=textObj.selectionEnd;
           var delValue = textObj.value.substring(rangeStart-1,rangeStart);
           var tempStr1=textObj.value.substring(0,rangeStart-1);
           var tempStr2=textObj.value.substring(rangeEnd);
           textValue = tempStr1+tempStr2;
           if(delValue=="]" && tempStr1.indexOf("[")>-1){
             var res = tempStr1.match(/(\[[\u4E00-\u9FA5]*)$/g);
             if(face_name1[res+']']!=undefined) {
               textValue = tempStr1.substring(0,tempStr1.lastIndexOf("["))+tempStr2;
             }
             console.info(res);
           }
           textObj.value=textValue;
           textObj.focus();
           textObj.setSelectionRange(rangeStart-1,rangeStart-1);
           return false;
         }else{
           return true;
         }
       }*/

    /* this.setState({valueText:e.target.value})*/
  }


  onSelecta = (selectedKeys, info) => {

   /* const  value=info.node.props.value*/
    const   isLeaf=info.node.props.isLeaf
    const   value=info.node.props.formula
    const   title=info.node.props.title

   //console.log(info.node.props,"title")
    if(selectedKeys.length>0)
    {
      let treenode={value,type:'index',title}
      this.handleValueInput(treenode)
    }

    this.setState({
      selectedKeysa: selectedKeys
    })

    this.state.textAreaRef.focus()

  }

  handleValueInput(data) {
    const {setFieldsValue,getFieldsValue} =this.props.form
    let {valueText} = getFieldsValue()
   //console.log(data,"data")
    let oldState = valueText;
    let TransText = this.state.TransText;
    let errorMessage = this.state.errorMessage;
    try{
      let {value,text} = this.checkClickType(oldState,TransText,data)
      setFieldsValue({'valueText':value})
      this.setState({
        TransText:text
      })
    }catch (err){
      message.error(err.message)
    }

  }

  checkClickType(oldvalue,oldText,data){
    let initFlag=false
    let lastStr
   //console.log("oldvalue",oldvalue)
   //console.log("data.value",data.value)
    if (oldvalue.length<1){
      initFlag=true
    }else {
      lastStr=oldvalue.charAt(oldvalue.length-1)
    }
    if(oldvalue.length<1&&(data.type==='operator'||data.type==='point')){
      message.error("首位非法")
      res={
        value:'' ,
        text:''
      }
      return {...res}
    }
    let res
    switch (data.type) {
      case 'back':
        //文本根据栈重新渲染
        oldvalue =  oldvalue.substr(0,oldvalue.length-1)
        res={
          value:oldvalue ,
          text:oldText
        }
        return {...res}
      case 'clear'://清空
        oldvalue = '';
        oldText = '';
        res={
          value:oldvalue ,
          text:oldvalue
        }
        return {...res}
      case 'operator'://操作符
        //不能出现连续操作符的情况
        if(lastStr==='+'||lastStr==='-'||lastStr==='*'||lastStr==='/'){
          //如果栈里最后一个是操作符，则更换操作符，
          //删除之前操作符
          oldvalue =  oldvalue.substring(0,oldvalue.length-1)
          oldText =  oldText.substring(0,oldText.length-1)
          res={
            value: oldvalue + data.value ,
            text: oldText + data.title
          }
          return {...res}
        }else if(lastStr==='.'){
          message.error("非法输入操作符")
          res={
            value: oldvalue ,
            text: oldText
          }
          return {...res}
        }
        //如果不是，操作符入栈
        res={
          value: oldvalue + data.value ,
          text: oldText + data.title
        }
        return {...res}
      //TODO 在上面截获了，这个没用
      case 'spoperator'://函数
        res={
          value: oldvalue + data.value ,
          text: oldText + data.title
        }
        return {...res}
      //未加校验
      case 'brackets'://括号
        res={
          value: oldvalue + data.value ,
          text: oldText + data.title
        }
        return {...res}
      case 'point'://小数点
        //不能出现连续小数点的情况
        let regpoint =  /[`\d+]/im
        if(!regpoint.test(lastStr) ){
          //如果栈里最后一个不是数字则报错，
          message.error("非法输入小数点!")
          res={
            value: oldvalue ,
            text: oldText
          }
          return {...res}
        }else{//栈最后一位是数字的情况
          let pointFlag=false
          let pointNum=-1
          //栈中是否有其他小数点
          if(oldvalue.indexOf(".") != -1 ){
            pointFlag=true
            pointNum=oldvalue.lastIndexOf(".")
          }

          let operatorFlag=false
          if (pointNum<0){
            //如果没出现过小数点正常执行
            operatorFlag=true
          }else if(pointNum>0){
            //如果有之前有小数点
            //判断小数点之间是否有操作符
            var reg = /[`+*\-\/'[\]]/im
            var str=oldvalue.substr(pointNum,oldvalue.length-1)
            if(reg.test(str) ) {
              operatorFlag=true
            }
          }
          //如果没有操作符则为非法输入
          if (operatorFlag===false){
            message.error("非法输入小数点")
            res={
              value: oldvalue ,
              text: oldText
            }
            return {...res}
          }
        }
        res={
          value: oldvalue + data.value ,
          text: oldText + data.title
        }
        return {...res}
      case 'index'://指标入栈
        if (!initFlag&&!(lastStr==='+'||lastStr==='-'||lastStr==='*'||lastStr==='/'||lastStr==='(')) {
          message.error('指标输入位置有误')
          res={
            value:oldvalue ,
            text: oldText
          }
          return {...res}
        }
        res = {
          value: oldvalue + data.value,
          text: oldText + data.title
        }
        return {...res};
      case 'number':
        if(initFlag){
          oldvalue = ''
          oldText = ''
        }
        if(data.value==='0'){
          if(!initFlag&&lastStr==='/'){
            message.error('除数不可以为0')
            res={
              value:oldvalue ,
              text: oldText
            }
            return {...res}
          }
        }
        //非首位，栈前可以为以下元素
        let regnum =  /[`+*\-\/(.\d+'[\]]/im
        if (!initFlag&&!regnum.test(lastStr)) {
          message.error('输入位置有误')
          res={
            value:oldvalue ,
            text: oldText
          }
          return {...res}
        }
        res={
          value:oldvalue + data.value,
          text: oldText + data.title
        }
       //console.log(res,"res")
        return {...res}
      default://一般
        res={
          value:oldvalue + data.value,
          text: oldText + data.title
        }
        return {...res}
    }
  }





  onSelectb = (selectedKeys, info) => {
    this.setState({
      selectedKeysb:selectedKeys
    })
    this.state.textAreaRef.focus()
  }
   onSelectc= (selectedKeys, info) => {

     const  value=info.node.props.value
     const   title=info.node.props.title

    //console.log(info.node.props,"title")
     if(selectedKeys.length>0)
     {
       let treenode={value,type:'operator',title}
       this.handleValueInput(treenode)
     }


     this.setState({
       selectedKeysc:selectedKeys
     })
     this.state.textAreaRef.focus()
  }
  onExpanda = (expandedKeys) => {
   //console.log('onExpand', arguments);
    this.setState({
      expandedKeysa:expandedKeys,
      autoExpandParenta: false,
    });
  }
  onExpandb = (expandedKeys) => {
   //console.log('onExpand', arguments);
    this.setState({
      expandedKeysb:expandedKeys,
      autoExpandParentb: false,
    });
  }
  onExpandc = (expandedKeys) => {
   //console.log('onExpand', arguments);
    this.setState({
      expandedKeysc:expandedKeys,
      autoExpandParentc: false,
    });
  }
  render () {
    const {  LedgerType,lista} = this.props;
    const {getFieldDecorator,getFieldValue} = this.props.form;



    const {  modelList,list} = this.state;

    const {
      item = {},
      onOk,
      modalType,
      onCancel,
      ...modalProps
    }  =this.props ;
    const handleOk = () => {
      validateFields((errors, values) => {
        if (errors) {
          /*  return*/
        }
        let obj={
          'model_info':values,
          modelList
        }
        /*  //console.log(values,'values')
           let str=""
             values.indexes.forEach((obj)=>{
               str+="["+obj.name+']'
           })*/
       //console.log(obj,"obj")
        /* onOk(obj)*/
      })
    }



    const modalOpts = {
      ...modalProps,
      onCancel,
      footer:
        [
          <Button type="primary" onClick={e => onCancel()}>取消</Button>,
          <Button type="primary" onClick={e => onOk()}>确定</Button>

        ],
    }

    //构造树形
   /* const organTree = arrayToTree(list.filter(_ => _.mpid !== '-1'), 'orgId', 'parentOrgId')*/
    const functionTree  = [{
      title: '函数',
      key: '0',
      value: '0',
      children: [/*{
        title: 'max()',
        key: 'mak',
      }, {
        title: 'min()',
        key: 'min',
      }, */{
        title: 'if（）',
        key: 'if',
        value: 'if',
      }],
    }];
    const operatorsTree  = [{
      title: '操作符',
      key: '0',
      value: '0',
      children: [{
        title: '+',
        key: '+',
        value: '+',
      }, {
        title: '-',
        key: '-',
        value: '-',
      }, {
        title: '*',
        key: '*',
        value: '*',
      }, {
        title: '/',
        key: '/',
        value: '/',
      }, {
        title: '.',
        key: '.',
        value: '.',
      }, {
        title: '（',
        key: '（',
        value: '（',
      }, {
        title: '）',
        key: '）',
        value: '）',
      }, /*{
        title: '+/-',
        key: '+/-',
        key: '+/-',
      }*/],
    }];
    const renderTreeNodes = data => data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    })


    //遍历树形
    const loop = data => data.map((item) => {
      /*let flag =false
      if (item.eLeaf){
        flag=true
      }*/
      if (item.children) {
        return (
          <TreeNode key={item.id} title={item.productName} modelId={item.modelId}   formula={item.formula} selectable={item.eLeaf?true:false}  value={item.id}>
            {loop(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode key={item.id} title={item.productName} formula={item.formula} selectable={item.eLeaf?true:false}  modelId={item.modelId}   value={item.id} />;

    })


    const formItemLayout = {
      labelCol: {
        span: 0,
      },
      wrapperCol: {
        span: 24,
      },
    }

    const testResult=()=>{
      const formula=getFieldValue("valueText")
     //console.log(formula)
      this.promise = request({
        url:"/gateway/indexvalidate.json",
        method: 'post',
        data: {
          formula,
        },
      }).then((result) => {
        if (result.RSP_HEAD.TRAN_SUCCESS!=='1') {
          return
        }
        message.success("测试成功")
       /* const queryData = result.RSP_BODY.dictList*/
        this.setState({
          resultTransText:result.RSP_BODY.text,
        })
      })
    }
    return (
      <div>
        <Row style={{marginTop:"10px"}}>
          <Col span={4}>
            <Button type="primary" onClick={e=>testResult()}>测试公式</Button>
          </Col>
        </Row>

        <Row style={{marginTop:"10px"}}>
          <Col span={24}>
            <FormItem hasFeedback {...formItemLayout} >
              {getFieldDecorator('valueText', {
                initialValue:  this.state.valueText?this.state.valueText:"",
               rules: [{
                  validator: (rule, value, callback) => {
                    if (!(/^[A-Za-z0-9\+\-\*\/\(\)\.\"]$/.test(value))) {
                      callback('【请输入正确格式】')
                    }

                    if (value && value.length > 500) {
                      callback('长度不超过500')
                    } else {
                      callback();
                    }
                  }
                }]
              })(<TextArea autosize={{ minRows: 3, maxRows: 6 }}
                           placeholder="请输入"
                           style={{ width: '100%'}}
                           ref={c => this.setState({textAreaRef:c})}
                           onKeyDown={(e)=>{this.handleKeyDown(e)}}

              />)}
            </FormItem>
          </Col>
        </Row>
          <Row style={{marginTop:"10px"}}>
            <Col span={24}>
              <TextArea  placeholder="汉字展示区"   autosize={{ minRows: 2, maxRows: 4 }} value={this.state.resultTransText}/>
              <div style={{ margin: '10px 0' }} /> </Col>
          </Row>

            <Row gutter={16}>
              <Col span={12}>

          <div style={{overflow: 'auto', width:'100%', height: '350px'}}>
            <Card  bordered={true}  >
              <Tree
                showLine
                onExpand={this.onExpanda}
                expandedKeys={this.state.expandedKeysa}
                autoExpandParent={this.state.autoExpandParenta}

                onSelect={this.onSelecta}
                selectedKeys={this.state.selectedKeysa}
              >
                {loop(list)}
              </Tree>
            </Card>
          </div>

        </Col>
              <Col span={6}>
                <div style={{overflow: 'auto', width:'100%', height: '350px'}}>
                  <Card  bordered={true}  >
                  <Tree
                    showLine
                    onExpand={this.onExpandb}
                    expandedKeys={this.state.expandedKeysb}
                    autoExpandParent={this.state.autoExpandParentb}

                    onSelect={this.onSelectb}
                    selectedKeys={this.state.selectedKeysb}
                  >
                    {renderTreeNodes(functionTree)}
                  </Tree>
                  </Card>
                </div>
              </Col>
              <Col span={6}>
                <div style={{overflow: 'auto', width:'100%', height: '350px'}}>
                  <Card  bordered={true}  >
                  <Tree
                    showLine
                    onExpand={this.onExpandc}
                    expandedKeys={this.state.expandedKeysc}
                    autoExpandParent={this.state.autoExpandParentc}

                    onSelect={this.onSelectc}
                    selectedKeys={this.state.selectedKeysc}
                  >
                    {renderTreeNodes(operatorsTree)}
                  </Tree>
                  </Card>
                </div>
              </Col>
      </Row>
      </div>

    )

  }
}
DerivindexOld.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default connect(({ loading,dispatch  }) => ({  loading,dispatch }))(Form.create()(DerivindexOld))
