import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input, TreeSelect , Radio, Modal, Row,Col ,Select,Button,DatePicker} from 'antd'
const { TextArea } = Input;
import IndexForm from './IndexForm'

/**
 * @Title:报表管理》自定义指标》创建指标
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2018/3/21
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const    Format = 'YYYY-MM-DD'
const modal = ({
  item = {},
  onOk,
                 getTypeList,
  form: {
    getFieldDecorator,
    validateFields,
    getFieldsValue,
    setFieldsValue
  },
   onOpen,
    onAddType,
     queryProductLevData,
                 BussList,
                 modalType,
  ...modalProps
}) => {
  const handleOk = () => {

    validateFields((error) => {
      if (error) {

        return
      }
      const {unuseDate} =getFieldsValue()
      let data = {
        ...getFieldsValue(),
      }
      if (unuseDate){
        data = {
        ...getFieldsValue(),
          unuseDate:unuseDate.format(Format),
      }
      }
      onOk(data)
    })
  }

  const modalOpts = {
    ...modalProps,
    onOk: handleOk,
  }

 const indexProps={
   modalType,
   getTypeList,
   BussList,
    item,
   getFieldDecorator,
   getFieldsValue,
   setFieldsValue
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
