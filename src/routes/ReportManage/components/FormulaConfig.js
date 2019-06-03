import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Card, Row,Col ,Button,Tree,message } from 'antd'
const TreeNode = Tree.TreeNode;
const { TextArea } = Input;
import { request } from 'utils'
import styles from './FormulaConfig.less';
import IndexCard from './IndexCard';
const FormItem = Form.Item;
import { arrayToSelectTree } from 'utils'
/**
 * @Title:报表管理》自定义指标》公式配置(数组操作，带一般校验，暂时不用)
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2018/3/19
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
  /* {value: 'C',type:'clear'},*/
];

class FormulaConfig extends React.Component {

  constructor (props) {
    super(props)
    const {
      fetchData={},
    } = props
    this.state = {
      valueText: '',
      TransText: '',

      errorFlag:false,//是否有抛出错误
      errorMessage:"",
      KeyList : [],//公式对外文本
      KeyValueList:[],//公式的对内编码

      noTitleKey:'article',
      treeData: [
        { title: 'Expand to load', key: '0' },
        { title: 'Expand to load', key: '1' },
        { title: 'Tree Node', key: '2', isLeaf: true },
      ],


    }
  }
  componentDidMount () {

  }


  handleValueInput(data) {

    let oldState = this.state.valueText;
    let TransText = this.state.TransText;
    let errorMessage = this.state.errorMessage;

   try{
    let {value,text} = this.checkClickType(oldState,TransText,data)
    this.setState({
      valueText:value,
      TransText:text
    })

   }catch (err){
       message.error(err.message)
   }


  }
  checkClickType(oldvalue,oldText,data){
    let KeyList = this.state.KeyList;//栈
    let initFlag=false
    if (KeyList.length===0){
      initFlag = true
    }

    if(KeyList.length<1&&(data.type==='operator'||data.type==='point')){
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
        //退格键，删除栈最后一位
        KeyList.pop();
        this.setState({
          KeyList,
        })
        //文本根据栈重新渲染
        let strChanged = "";
        let strChangedText = "";
        for (let i = 0; i < KeyList.length; i++) {
          strChanged += String(KeyList[i].value);
          strChangedText += String(KeyList[i].title);
        }
        oldvalue =  strChanged.trimEnd()
        oldText =  strChangedText.trimEnd()
        res={
          value:oldvalue ,
          text:oldText
        }
        return {...res}
      case 'clear'://清空
        oldvalue = '';
        oldText = '';
        this.setState({KeyList:[]})
       res={
          value:oldvalue ,
          text:oldvalue
        }
        return {...res}
      case 'operator'://操作符
        //不能出现连续操作符的情况
        if(KeyList[KeyList.length-1].type==='operator'){
          //如果栈里最后一个是操作符，则更换操作符，
          KeyList.splice(KeyList.length-1,1,data)
          this.setState({
            KeyList,
          })
          //删除之前操作符
          oldvalue =  oldvalue.substring(0,oldvalue.length-1)
          oldText =  oldText.substring(0,oldText.length-1)
          res={
            value: oldvalue + data.value ,
            text: oldText + data.title
          }
          return {...res}
        }
        //如果不是，操作符入栈
          KeyList.push(data)
          this.setState({
            KeyList,
          })
          res={
            value: oldvalue + data.value ,
            text: oldText + data.title
          }
          return {...res}
      //TODO
      case 'spoperator'://函数
        res={
          value: oldvalue + data.value ,
          text: oldText + data.title
        }
        KeyList.push(data)
        return {...res}
      case 'brackets'://括号
        res={
          value: oldvalue + data.value ,
          text: oldText + data.title
        }
        KeyList.push(data)
        return {...res}
      case 'point'://小数点
        //不能出现连续小数点的情况
        if(KeyList[KeyList.length-1].type!=='number'){
          //如果栈里最后一个不是数字则报错，
          message.error("非法输入小数点")
          res={
            value: oldvalue ,
            text: oldText
          }
          return {...res}
        }else{//栈最后一位是数字的情况
          let pointFlag=false
          let pointNum=-1
          //栈中是否有其他小数点
          for (let i=KeyList.length;i>0;i--){
            if(KeyList[i-1].type==='point'){
              pointFlag=true
              pointNum=i-1
              break
            }
          }

          let operatorFlag=false
          if (pointNum<0){
            //如果没出现过小数点正常执行
            operatorFlag=true
          }else if(pointNum>0){
            //如果有之前有小数点
            //判断小数点之间是否有操作符
            for(let j=pointNum+1;j<KeyList.length;j++){
              if( KeyList[j].type==='operator'){
                operatorFlag=true
                break
              }
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
        KeyList.push(data)
        return {...res}
      case 'index'://指标入栈
        if (!initFlag&&!(KeyList[KeyList.length-1].type==='operator'||KeyList[KeyList.length-1].type==='brackets-left')) {
          message.error('指标输入位置有误')
          res={
            value:oldvalue ,
            text: oldText
          }
          return {...res}
        }

        KeyList.push(data)
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
          if(!initFlag&&KeyList[KeyList.length-1].value==='/'){
            message.error('除数不可以为0')
            res={
              value:oldvalue ,
              text: oldText
            }
            return {...res}
          }
        }
        //非首位，栈前可以为以下元素
        if (!initFlag&&!(KeyList[KeyList.length-1].type==='operator'||
            KeyList[KeyList.length-1].type==='brackets-left'||
            KeyList[KeyList.length-1].type==='point'||
            KeyList[KeyList.length-1].type==='number')) {
          message.error('输入位置有误')
          res={
            value:oldvalue ,
            text: oldText
          }
          return {...res}
        }

        KeyList.push(data)
        res={
          value:oldvalue + data.value,
          text: oldText + data.title
        }
        return {...res}
      default://一般
        KeyList.push(data)
        res={
          value:oldvalue + data.value,
          text: oldText + data.title
        }
        return {...res}
    }
  }

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
    /* const { getFieldDecorator} = this.props.form*/


    const cardprops ={
      onSelect : (selectedKeys, info) => {
        if(selectedKeys.length>0)
        {
          let rev = info.selectedNodes[0].props.title
          let treenode={value:selectedKeys[0],type:'index',title:rev}
          this.handleValueInput(treenode)
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
            <TextArea   placeholder="公式展示区" autosize={{ minRows: 2, maxRows: 4 }} value={this.state.valueText} />   </Col>
        </Row>
        <Row >
          <Col span={24}>
            <div style={{ margin: '10px 0' }} />  </Col>
        </Row>
        <Row >
          <Col span={24}>
            <TextArea disabled placeholder="汉字展示区" autosize={{ minRows: 2, maxRows: 4 }} value={this.state.TransText}/>
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
      </div>
    )
  }
}

FormulaConfig.propTypes = {
  /*form: PropTypes.object,
  fetchData: PropTypes.string,*/
}

export default FormulaConfig
