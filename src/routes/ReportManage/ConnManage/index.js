import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import Filter from './components/StateFilter'
import List from './components/StateList'
import CreateModelModal from './components/CreateModelModal'
/**
 * @Title:指标计算》数据源管理
 * @Description:父组件（stateless）
 * @Author: mxt
 * @Time: 2018/5/3
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const ConnManage = ({
  location, dispatch, connManage, loading,
}) => {
  location.query = queryString.parse(location.search)
  const {
    formValues,
    LedgerType,
    modalType,
    modalVisible,
    getDbType,
    currentItem,
    ...liststate,

  } = connManage

  /*列表参数*/
  const listProps={
    dispatch,
    /*namespace*/
    LedgerType,
    loading,
    ...liststate,
    formValues,
    /*查询表单*/

    onTableChange:(params)=>{

      dispatch({
        type:LedgerType+'/query',
        payload: params,
      });
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
        type: LedgerType + '/linkdel',
        payload: {
          id: item.id,
          name:item.connectionName
        },
      })
    },
  }
  const modalProps = {
    modalType,
    loading,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    maskClosable: false,
    confirmLoading: loading.effects[LedgerType+'/update'],
    title: `${modalType === 'create' ? '新建连接' : '修改连接'}`,
    wrapClassName: 'vertical-center-modal',
    width:"850px",
    queryProductLevData:getDbType,
    connectionTest(data){
      dispatch({
        type:LedgerType+`/linkcheck`,
        payload: data,
      })
    },
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

  /*索引参数*/
  const filerProps={
    LedgerType,
    loading,
    /*查询参数*/
    formValues,
    /*重置表单*/
    handleFormReset:()=>{
      dispatch({
        type: LedgerType+'/querySuccess',
        payload:{
          formValues:{
            page: 1,
            pageSize: 10,
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


export default connect(({ connManage, loading }) => ({ connManage, loading }))(ConnManage)
