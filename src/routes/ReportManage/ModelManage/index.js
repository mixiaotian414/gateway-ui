import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect,message } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import Filter from './components/StateFilter'
import List from './components/StateList'
import CreateModelModal from './components/CreateModelModal'
/**
 * @Title:报表管理》模型管理
 * @Description:父组件（stateless）
 * @Author: mxt
 * @Time: 2018/3/22
 * @updateTime: 2018/5/10
 * @updateRemark: 表格展开，表格删除指标
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const ModelManage = ({
                       location, dispatch, modelManage, loading,
                     }) => {
  location.query = queryString.parse(location.search)
  const {
    formValues,

    LedgerType,
    queryProductLevData,
    modalType,
    currentItem,
    modalVisible,
    ...liststate,

  } = modelManage

  const modalProps = {
    modalType,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[LedgerType+'/update'],
    title: `${modalType === 'create' ? '创建模型' : '修改模型'}`,
    wrapClassName: 'vertical-center-modal',
    width:"850px",
    queryProductLevData,
    /*完成创建指标*/
    okText:"保存",
    cancelText:"取消",

    onOk (data) {

      dispatch({
        type:LedgerType+`/${modalType}`,
        payload: data,

      })
    },
    onCancel () {
      dispatch({
        type: LedgerType+'/hideModal',
      })
    },
  }

  /*列表参数*/
  const listProps={

    dispatch,
    LedgerType,
    loading,
    ...liststate,
    formValues,
    /*刷新*/

    onEditItem (item) {
      dispatch({
        type: LedgerType + '/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
    deleteIndex (item) {
      dispatch({
        type: LedgerType + '/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },

    onAdd () {
      dispatch({
        type: LedgerType+'/showModal',
        payload: {
          modalType: 'create',
          currentItem: {},
        },
      })
    },
    /*查询表单*/
    onTableChange:(filters,params)=>{
      dispatch({
          type:LedgerType+'/querySuccess',
          payload:{formValues: {...formValues,...filters},}
        }
      )
      dispatch({
        type:LedgerType+'/query',
        payload: params,
      });
    }
  }

  /*索引参数*/
  const filerProps={
    LedgerType,
    loading,
    /*查询参数*/
    formValues,
    /*机构下拉树*/
    queryProductLevData,
    /*重置表单*/
    handleFormReset:()=>{
      dispatch({
        type: LedgerType+'/querySuccess',
        payload:{
          formValues:{
          page: 1,
          pageSize: 10
        },}
      });
    },
    /*查询表单*/
    toSubmit:(changefields)=>{
      dispatch({
          type: LedgerType+'/querySuccess',
          payload:{formValues: changefields,}
        }
      )
      dispatch({
        type:LedgerType+'/query',
        payload: changefields
      })
    }
  }
  return (
    <Page inner>
      <Filter {...filerProps} />
      <List {...listProps} />
      {modalVisible && <CreateModelModal {...modalProps} />}
    </Page>

  )
}

ModelManage.propTypes = {
  modelManage: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ modelManage, loading }) => ({ modelManage, loading }))(ModelManage)
