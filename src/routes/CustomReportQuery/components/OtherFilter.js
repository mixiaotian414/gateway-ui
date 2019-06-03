import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Row, Col,Form,Modal,Button,message,Input,Transfer, Select,DatePicker,Table } from 'antd'

/**
 * @Title:其他过滤组件
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2019/5/27
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */

const FormItem = Form.Item
const confirm = Modal.confirm;
let map = new Map()
class OtherFilter extends Component{
  state={
    filters:"",
    filtersCode:[],
    filtersName:[],
    filterCode:""
  }
  componentWillReceiveProps =()=>{
    //初始化穿梭框列表集合
    if(this.props.otherModalList){
      if(this.props.otherModalList.length>0){
        let filterList =this.props.otherModalList.map((data)=>{
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
    let data = []
    if(map.size>0){
      for(let i of map){
        data.push({
          code:i[0],
          name:i[1]
        })
      }
    }else {
      data =[]
    }
    const a = this.props.code+"Name"
    if(data){
      if(data.length>0){
        data.map((item)=>{
          if(item.code === a){
            this.setState({
              filters:item.name,
              filterCode:item.code,
            })
          }
        })
      }
    }
  }

  render(){
    const { getFieldDecorator, validateFields,validateFieldsAndScroll } = this.props.form
    const {  LedgerType } = this.props;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 17
      },
    };
    const ModalProps = {
      visible: this.props.visible,
      maskClosable: false,
      title:this.props.title,
      wrapClassName:"vertical-center-modal",
      width:'480px',
      onOk:()=>{handleOk()},
      onCancel:()=>{handleCancel()}
    }
    const handleOk = () => {
      const { arraydata } = this.state
      validateFields((errors,values) => {
        if (errors) {
          return
        }
        if(this.state.filtersCode&&this.state.filtersName){
          map.set(this.props.code,this.state.filtersCode,)
          map.set(this.props.code+"Name",this.state.filtersName)
        }
        let data = []
        if(map.size>0){
          for(let i of map){
            data.push({
              code:i[0],
              name:i[1]
            })
          }
        }else {
          data =[]
        }
        this.props.onOk(data)
      })
    }
    const handleCancel = ()=>{
      this.props.onCancel()
    }

    const selectchange =(value)=>{
      let a = value.split("/")
      this.setState({
        filtersCode:a[0],
        filtersName:a[1],
      })
    }
    return(<div>
      {this.props.visible?<Modal
        {...ModalProps}
      ><FormItem {...formItemLayout} label="过滤条件" hasFeedback >
        {getFieldDecorator('filter', {
          initialValue:this.props.code+"Name"===this.state.filterCode?this.state.filters:undefined,
          rules: [
            {
              required: true,
              message: '过滤条件不能为空',
            },
          ],
        })(
          <Select placeholder="请选择"  style={{width:'276px'}} onChange={selectchange} >
            {this.state.filterList && this.state.filterList.map((item, key) => <Select.Option key={key} value={item.key+"/"+item.title} >{item.title}</Select.Option>)}
          </Select>
        )}
      </FormItem>
      </Modal>:null}
    </div>)
  }
}

export default Form.create()(OtherFilter)
