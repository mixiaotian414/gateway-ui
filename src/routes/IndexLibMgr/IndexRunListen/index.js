import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import {message} from 'antd'
import Filter from './components/Filter'
import TableList from './components/TableList'
import CreateModal from './components/CreateModal'



/**
 * @Title:指标库管理=》指标跑数监控
 * @Description:父组件（stateless）
 * @Author: chenshuai
 * @Time: 2019/4/18
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */
const IndexRunListen = ({
                         location, dispatch, IndexRunListen, loading
                       }) => {
  location.query = queryString.parse(location.search)
  const {
    formValues,
    LedgerType,
    ids,
    selectedRowKeys,
    modalType,
    getType,
    modalVisible,
    currentItem,
    indexTreeData,
    ...liststate
  } = IndexRunListen

  /*列表参数*/
  const listProps={
    dispatch,
    /*namespace*/
    LedgerType,
    ids,
    selectedRowKeys,
    loading,
    ...liststate,
    formValues,
    /*查询表单*/
    onTableChange:(params)=>{
      dispatch({
          type:LedgerType+'/querySuccess',
          payload:{formValues: {...formValues},}
        }
      )
      dispatch({
        type:LedgerType+'/query',
        payload: params,
      });
    },
    /*操作模态框*/
    changeModal:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          modalVisible:data
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

    onEditItem (item) {
      dispatch({
        type: LedgerType + '/showModal',
        payload: {
          modalType: 'update',
          currentItem: item,
        },
      })
    },
  }

  /*索引参数*/
  const filerProps={
    LedgerType,
    loading,
    formValues,
    getType,
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
  const modalProps = {
    modalType,
    indexTreeData,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    title: `${modalType === 'create' ? '添加指标跑数任务' : '维度修改'}`,
    dimensionType:getType,
    onOk (data) {
      dispatch({
        type:LedgerType+'/indexRun',
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: LedgerType+'/hideModal',
      })
    },
  }

  return (
    <Page inner>
      <Filter {...filerProps} />
      <TableList {...listProps} />
      <CreateModal {...modalProps} />
    </Page>

  )
}

IndexRunListen.propTypes = {
  IndexRunListen: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ IndexRunListen, loading }) => ({ IndexRunListen, loading }))(IndexRunListen)
