import React,{Component} from 'react'
import PropTypes from 'prop-types'
import { Page } from 'components'
import { Row, Col,Form,Modal,Button,message,Input,Transfer, Select,DatePicker } from 'antd'

/**
 * @Title:日期为度过滤
 * @Description:子组件
 * @Author: chenshuai
 * @Time: 2019/5/27
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */

const FormItem = Form.Item
const confirm = Modal.confirm;
let  Format = 'YYYYMMDD';
const Option = Select.Option
class FilterModal extends Component{
  state={
    filterList:[],//穿梭框列表集合
    dateString:"",
  }
  componentWillReceiveProps =()=>{
    //初始化穿梭框列表集合
    if(this.props.dateModalList){
      if(this.props.dateModalList.length>0){
        let filterList =this.props.dateModalList.map((data)=>{
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
      validateFields((errors,values) => {
        if (errors) {
          return
        }
        let data = {}
        data[this.props.code] = this.state.dateString
        this.props.dispatch({
          type:'CustomReportQuery/querySuccess',
          payload: {
            paramCode:this.props.code,
            paramDate:this.state.dateString
          },
        })
        this.props.onCancel()
      })
    }
    const handleCancel = ()=>{
      this.props.onCancel()
    }
    const onChange=(date, dateString)=> {
      this.setState({
        dateString
      })
    }

    return(<div>
      <Modal
        {...ModalProps}
      >
        <FormItem {...formItemLayout}  label="日期" >
          {getFieldDecorator('date', {
            rules: [
              {
                required: true,
                message: '日期不能为空',
              },
            ],
          })(
            <DatePicker
              allowClear={false}
              style={{ width:'240px' }}
              onChange={onChange}
              format={Format}
              placeholder="请选择" >
            </DatePicker >
          )}
        </FormItem>

      </Modal>
    </div>)
  }
}

export default Form.create()(FilterModal)
