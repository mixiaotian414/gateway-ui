import React from 'react'
import PropTypes from 'prop-types'
import { Form,  Modal,Button,message} from 'antd'
import SearchTree from './SearchTree'
/**
 * @Title:报表管理》自定义指标列表》移动指标目录
 * @Param:
 *        fetchData：预留查询条件
 *        form：父组件form域
 * @Description:
 * @Author: mxt
 * @Time: 2018/5/9
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */


const modal = ({
                 onFinish,
  form: {
    setFieldsValue,
    getFieldDecorator,
    validateFields,
    getFieldsValue,
  },
  ...modalProps
}) => {
  const handleOk = () =>{
      const data = {
        ...getFieldsValue(),
      }
    if(!!data.typeId){
      onFinish(data)
    }else{
      message.error("请选择目录")
    }
   /*   onFinish(data)*/

}

  const modalOpts = {
    ...modalProps,
     footer:<Button style={{float:'center'}} type="primary" onClick={(e)=>{handleOk(e)}}>完成</Button>,
  }

  const searchTreeProps={

  }

  return (
    <Modal {...modalOpts}>
      {getFieldDecorator('typeId',{
      })
      (
      <SearchTree />
      )}
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
