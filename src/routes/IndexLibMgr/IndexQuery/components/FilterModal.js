import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Row, Col,Form,Modal,Button,message,Input,Transfer, DatePicker } from 'antd'

/**
 * @Title:维度过滤组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2019/4/11
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */

const FormItem = Form.Item
const confirm = Modal.confirm;
let  Format = 'YYYY-MM-DD';
let map = new Map()//存放查询参数的map
let ids = new Map()//存放过滤框回显的map

class FilterModal extends Component{
  state={
    item:this.props.item||{},
    targetKeys: [],//右侧框数据集合
    selectedKeys: [],//设置哪些选项被选中
    filterList:[],//穿梭框列表集合
    moveKeys:[],
    rightKeys:[],//穿梭框右边列表集合
    arraydata:[],//用作回显
    status:"",
    newdata:[],//用作回显
  }
  componentDidMount = () => {
    map.clear()
    ids.clear()
    this.setState({
      targetKeys: [],//右侧框数据集合
      selectedKeys: [],//设置哪些选项被选中
      filterList:[],
      moveKeys:[],
      rightKeys:[],
      arraydata:[],
      newdata:[],
    })
  }

  componentWillReceiveProps =()=>{
    if(this.props.filtersData.length ===0){
      map.clear()
      ids.clear()
      this.setState({
        targetKeys:[],
        newdata:[],
      })
    }
    if(this.props.visible){
      const { newdata,rightKeys } = this.state
      if(newdata){
        /*设置过滤框回显，判断newdata对象中是否包含"key"*/
        if(newdata.hasOwnProperty("a"+this.props.dimensionId)){
          this.setState({
            targetKeys:newdata["a"+this.props.dimensionId],
          });
        }else {
          this.setState({
            targetKeys:[],
          });
        }
      }
    }
    //初始化穿梭框列表集合
    if(this.props.filterModalList){
      if(this.props.filterModalList.length>0){
        let filterList =this.props.filterModalList.map((data)=>{
          let obj={
            key:data.dimensionValue,
            title:data.dimensionKey,
          }
          return obj
        })
        this.setState({
          filterList
        })
      }else {
        this.setState({
          filterList:[]
        })
      }
    }
  }
  handleChange = (nextTargetKeys, direction, moveKeys) => {
    this.setState({
      targetKeys: nextTargetKeys,
      moveKeys:moveKeys,
      rightKeys:nextTargetKeys,
    })
  }

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    let data = {}
    /* 用来作为过滤框回显得数组
    初始化维度数组（有多少维度就初始化多少个数组，然后将数组setState到arraydata对象中）
    格式：a? = [](a后边拼的是维度id,[]存的是维度集合)
    */
    //status控制初始化数组（status为true,说明数组已初始化完成。）
    if(this.state.status ===""){
      if(this.props.dimensionList.length>0){
        this.props.dimensionList.map((item)=>{
          data["a"+item.id] = []
        })
        this.setState({
          arraydata:data
        })
      }
    }

    this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });
  }

  handleScroll = (direction, e) => {
    console.log('direction:', direction);
    console.log('target:', e.target);
  }

  render(){
    const { getFieldDecorator, validateFields,validateFieldsAndScroll } = this.props.form
    const {  LedgerType } = this.props;
    const { targetKeys, selectedKeys, disabled } = this.state;
    const ModalProps = {
      visible: this.props.visible,
      maskClosable: false,
      title:this.props.title,
      wrapClassName:"vertical-center-modal",
      width:'680px',
      onOk:()=>{handleOk()},
      onCancel:()=>{handleCancel()}
    }
    const handleOk = () => {
      const { arraydata,rightKeys,targetKeys } = this.state
      let g = []
      for(let i in arraydata){
        if(i.substring(1) === this.props.dimensionId){

          //arraydata[i]=nextTargetKeys

            arraydata[i]=targetKeys
            /*如果点击的维度id(dimensionId)等于对象数组的key,则往map（ids）里set值*/
            ids.set(i,arraydata[i])
            let obj2 = {}
            /*修改格式为 id:[] (id为动态的)*/
            for(let i of ids){
              obj2[i[0]]=i[1]
            }
            this.setState({
              //rightKeys:arraydata[i],
              newdata:obj2,
              status:"true"
            });

           /* const params = {
              id:this.props.dimensionId,
              value:this.state.targetKeys
            }*/
            /*将参数set到map里*/
            /*将map 转成 { 5:[ 5 , 7 , 8] }格式的*/
            map.set(i.substring(1),this.state.targetKeys)
            /*定义数组 转成格式为{
              {
                id: 5
                value: 5 ,7, 8
              }
            }*/
          //if(targetKeys.length>0){
            for(let i of map){
              g.push({
                id:i[0],
                value:i[1],
              })
            }
         // }
        }
      }
      this.props.onOk(g)
    }
    const handleCancel = ()=>{
      this.props.onCancel()
    }

    return(<div>
      <Modal
        {...ModalProps}
      >{
        /*目前维度类型只有{日期，非日期}两种，日期维度过滤框可能会用到日期控件，先留着后期备用*/
        /*this.props.dimensionType ==='1'? //dimensionType "1"为日期维度，"0"非日期维度
          <Row>
            <Col span={24} >
              <FormItem style={{ textAlign:'center' }}>
                <DatePicker
                  //allowClear={false}
                  style={{ width:'240px' }}
                  format={Format}
                  placeholder="请选择" >
                </DatePicker >
              </FormItem>
            </Col>
          </Row>
          :*/
          <FormItem>
            <Transfer
              listStyle={{
                width: 280,
                height: 300,
              }}
              ref = {(transfer)=> {this.transfer = transfer;}}
              dataSource={this.state.filterList}
              titles={['可选值', '选中值']}
              targetKeys={targetKeys}
              selectedKeys={selectedKeys}
              onChange={this.handleChange}
              onSelectChange={this.handleSelectChange}
              //onScroll={this.handleScroll}
              render={item => item.title}
            />
          </FormItem>
      }
      </Modal>
    </div>)
  }
}

export default Form.create()(FilterModal)
