import React from 'react'
import PropTypes from 'prop-types'
import {  Input, Card,Modal, Row,Col ,Button,message  } from 'antd'
const { TextArea } = Input;
import { request } from 'utils'
import styles from './FormulaConfigInput.less';
import IndexCard from './IndexCard';
import { arrayToSelectTree } from 'utils'
import MaxBox from './functionComps/MaxBox'
import IfBox from './functionComps/IfBox'
import TIMEBox from './functionComps/TIMEBox'
/**
 * @Title:报表管理》自定义指标》公式配置(用户可选可输，选择弱校验)
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2018/3/19
 * @updateTime: 2018/4/23
 * @updateContent: 用form修饰，方便取数
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const KEYVALUEST = [
  {title: '7',value: '7',type:'number',},
  {title: '8',value: '8',type:'number'},
  {title: '9',value: '9',type:'number'},
  {title: '←',value: '←',type:'back'},
  {title: '4',value: '4',type:'number'},
  {title: '5',value: '5',type:'number'},
  {title: '6',value: '6',type:'number'},
  {title: '+',value: '+',type:'operator'},
  {title: '1',value: '1',type:'number'},
  {title: '2',value: '2',type:'number'},
  {title: '3',value: '3',type:'number'},
  {title: '-',value: '-',type:'operator'},
  {title: '0',value: '0',type:'number'},
  {title: '.',value: '.',type:'point'},
  {title: '*',value: '*',type:'operator'},
  {title: '/',value: '/',type:'operator'},
  {title: '(',value: '(',type:'brackets-left'},
  {title: ')',value: ')',type:'brackets-right'},
  {title: '+/-',value: '+/-',type:'operator'},
  {title: '%',value: '%',type:'spoperator'},
  {title: '最大值',value: 'MAX',type:'spoperator'},
  {title: '最小值',value: 'MIN',type:'spoperator'},
  {title: 'IF',value: 'IF',type:'spoperator'},
  {title: 'TIME',value: 'TIME',type:'spoperator'},
  /* {value: 'C',type:'clear'},*/
];


class FormulaConfig extends React.Component {

  constructor (props) {
    super(props)
    const {
      fetchData={},
    } = props
    this.state = {
      //公式展示区
      valueText: '',
      //翻译区
      TransText: '',
      errorFlag:false,//是否有抛出错误
      errorMessage:"",

      currentItem:{},
      //MAX函数
      MAXBoxVisible:false,
      MINBoxVisible:false,
      IFBoxVisible:false,
      TIMEBoxVisible:false,
      BoxParam:undefined,
    }
  }
  componentDidMount () {
  /*  console.log("a",this.refs.ConfigInput)
    this.refs.ConfigInput.focus();*/

  }


  handleValueInput(data) {
    const {setFieldsValue,getFieldsValue} =this.props
   /* let oldState = this.state.valueText;*/
    let {valueText} = getFieldsValue()

    let oldState = valueText
    let TransText = this.state.TransText;
    let errorMessage = this.state.errorMessage;

    if(data.type==='spoperator'){
      switch (data.value) {
        case 'MAX':
          this.setState({MAXBoxVisible:true})
          this.setState({BoxParam:'MAX'})
              break
        case 'MIN':
          this.setState({MINBoxVisible:true})
          this.setState({BoxParam:'MIN'})
          break
        case 'IF':
          this.setState({IFBoxVisible:true})
          this.setState({BoxParam:'IF'})
          break
        case 'TIME':
          this.setState({TIMEBoxVisible:true})
          this.setState({BoxParam:'TIME'})
          break
      }
    }else{
         try{
          let {value,text} = this.checkClickType(oldState,TransText,data)
           setFieldsValue({'valueText':value})
          this.setState({
          /*  valueText:value,*/
            TransText:text
          })
         }catch (err){
             message.error(err.message)
         }
    }
/*     this.refs.textArea.focus()*/

    this.state.textAreaRef.focus()
  }

  //TODO 获取用户键盘键入事件，用于以后加校验
  handleKeyDown(e) {

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
  //按钮校验
  checkClickType(oldvalue,oldText,data){
    let initFlag=false
    let lastStr
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
        return {...res}
      default://一般
        res={
          value:oldvalue + data.value,
          text: oldText + data.title
        }
        return {...res}
    }
  }
  onTabChange = (key, type) => {
    this.setState({ [type]: key });
  }
  //按钮初始化添加事件
  initButtonList=(list,value)=>{
    value.forEach(data => {
      list.push(

        <Button style={{width:'60px',margin:'3px'}}
                key={data.value}
                onClick = {this.handleValueInput.bind(this,data)}
        >{data.value}</Button>
      );
    });
    return list;
  }


  render () {

   const {getFieldDecorator,setFieldsValue,getFieldsValue,valueText,translate} =this.props
    const cardprops ={
      onSelect : (selectedKeys, info) => {
        if(selectedKeys.length>0)
        {
          let rev = info.selectedNodes[0].props.title
          let treenode={value:selectedKeys[0],type:'index',title:rev}
          this.handleValueInput(treenode)
        }
      }  ,
      onListSelect : (selectItem) => {
          let treenode={value: selectItem.code,type:'index',title:selectItem.name}
          this.handleValueInput(treenode)

      }
    }

    let param=this.state.BoxParam
    let paramSet=param+'BoxVisible'
    let visible=this.state[paramSet]
    let title=param+'函数'

    /* const { getFieldDecorator} = this.props.form*/
    //函数modal
    const modalProps = {
      item: this.state.currentItem,
      visible,
      maskClosable: false,
      title,
      wrapClassName: 'vertical-double-center-modal',
      width:"700px",
      footer:<Button style={{float:'center'}} type="primary" onClick={()=>{this.setState({[paramSet]:false})}}>关闭</Button>,
      onCancel:()=>{
        this.setState({[paramSet]:false})
      },
    }
    //函数子组件props
    const BoxPros={
      param,
      onSave:(values)=> {
        if (values) {
        /*let valueText = this.state.valueText+values*/
          let {valueText} = getFieldsValue()
          setFieldsValue({'valueText':valueText+values})
        this.setState({
          [paramSet]: false,
          /*valueText*/
        })
       /*   this.refs.textArea.focus()*/
          this.state.textAreaRef.focus()
        }
      }
    }

    let buttonlist = [];
    let buttonValue = KEYVALUEST;
    buttonlist = this.initButtonList(buttonlist,buttonValue)
    return (
      <div className={styles.configMain}>
        <Row >
          <Col span={24}>
            {getFieldDecorator('valueText', {
             initialValue:  valueText?valueText:"",
              rules: [
                {
                  required: true,
                },
              ],
            })( <TextArea   placeholder="公式展示区" autosize={{ minRows: 2, maxRows: 4 }}

                           /* ref="textArea"*/
               ref={c => this.setState({textAreaRef:c})}
                              onKeyDown={(e)=>{this.handleKeyDown(e)}} /> )}
             </Col>
        </Row>
        <Row >
          <Col span={24}>
            <div style={{ margin: '10px 0' }} />  </Col>
        </Row>
        <Row >
          <Col span={24}>
            <TextArea disabled placeholder="汉字展示区" autosize={{ minRows: 2, maxRows: 4 }} value={translate?translate:""}/>
            <div style={{ margin: '10px 0' }} /> </Col>
        </Row>

        <Row gutter={16}>
          <Col span={11}>
            <Card
              bodyStyle={{height:'300px'}}
              title="常数及函数" style={{   }} >
              {buttonlist}
            </Card>
          </Col>
          <Col span={13}>
              <IndexCard {...cardprops}></IndexCard>
          </Col>
        </Row>
        {visible &&
        <Modal {...modalProps}>
          {param==='MAX' && <MaxBox  {...BoxPros}/>}
          {param==='MIN' && <MaxBox  {...BoxPros}/>}
          {param==='IF' && <IfBox  {...BoxPros}/>}
          {param==='TIME' && <TIMEBox  {...BoxPros}/>}
        </Modal>
       }
      </div>
    )
  }
}

FormulaConfig.propTypes = {
  /*form: PropTypes.object,
  fetchData: PropTypes.string,*/
}

export default FormulaConfig
