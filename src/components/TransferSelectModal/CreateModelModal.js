import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input,  Modal,Select } from 'antd'

import IndexForm from "./IndexForm";
/**
 * @Title:报表管理》模型管理》创建模型
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2018/3/22
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */


const modal = ({
  item = {},
  onOk,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  modalType1,
  type,
  queryProductLevData,
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors,values) => {
      if (errors) {
        return
      }

      if(type=="quota"){
        let str=[]
      
        values.products.forEach((item)=>{
          let obj = {
            value: item.name, 
            label: item.title
          };
          
          str.push(obj)
        })
        const data = {
          ...values,
          "products":str
        }

        onOk(data)

      } else {
        let str1=[]
        
        values.branches.forEach((item)=>{
          let obj = {
            value: item.name, 
            label: item.title
          };
          
          str1.push(obj)
        })
        const data1 = {
          ...values,
          "branches":str1
        }
       
        onOk(data1)
      }
       
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }
  const indexProps={
    item,
    getFieldDecorator,
    getFieldsValue,
  // queryProductLevData,
    modalType1,
    type
  }
  return (
    <Modal {...modalOpts}>
      <IndexForm {...indexProps}></IndexForm>
    </Modal>
  )
}
modal.propTypes = {
  form: PropTypes.object.isRequired,
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default Form.create()(modal)
