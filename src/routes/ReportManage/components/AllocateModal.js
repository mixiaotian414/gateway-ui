import React from 'react'
import PropTypes from 'prop-types'
import { Form, Modal, } from 'antd'

import FormulaConfigInput from './FormulaConfigInput'
/**
 * @Title:报表管理》自定义指标列表》配置公式模型
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2018/3/20
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */


const modal = ({
  item = {},
  onOk,
                 valueText,
                 translate,
  form: {
    setFieldsValue,
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () =>{
    validateFields((errors) => {
      if (errors) {
        return
      }
      const data = {
        ...getFieldsValue(),

      }
      onOk(data)
    })
}

  const modalOpts = {
    ...modalProps,
    onOk:handleOk
  }
const formulaConfigInputOpts = {
  getFieldDecorator,
  setFieldsValue,
  getFieldsValue,
  valueText,
  translate
  }

  return (
    <Modal {...modalOpts}>
      <FormulaConfigInput {...formulaConfigInputOpts} />
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
