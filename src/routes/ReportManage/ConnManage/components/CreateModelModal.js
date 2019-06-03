import React from 'react'
import PropTypes from 'prop-types'
import { Form, Input,  Modal,Select,Button } from 'antd'
import { LoaderCheck } from '../../../../components'
import IndexForm from "./IndexForm";
/**
 * @Title:报表管理》数据源管理》创建连接
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2019/3/28
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
    setFieldsValue
  },
                 modalType,
                 loading,
                 queryProductLevData,
                 connectionTest,
                 onCancel,
  ...modalProps
}) => {
  const handleOk = () => {
    validateFields((errors,values) => {
      if (errors) {
        return
      }
   /*   console.log(values,'values')
      let str=""
        values.indexes.forEach((obj)=>{
          str+="["+obj.name+']'
      })*/

      onOk(values)
    })
  }

  const handleTest = () => {
    validateFields((errors,values) => {
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
        <Button onClick={e=>handleTest()} >测试连接</Button>,
        <Button  onClick={e=>onCancel()}>取消</Button>,
        <Button type="primary" onClick={e=>handleOk()}>确定</Button>
      ],
  }
  const indexProps={
    item,
    getFieldDecorator,
    getFieldsValue,
    setFieldsValue,
  queryProductLevData,
    modalType
  }
  return (
    <Modal {...modalOpts}>
      <IndexForm {...indexProps}></IndexForm>
      <LoaderCheck spinning={loading.effects['connManage/linkcheck']}/>
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
