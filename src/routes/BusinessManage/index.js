import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import BusinessTree from './components/BusinessTree'
import BusinessAddModal from './components/BusinessAddModal'
import BusinessTableModal from './components/BusinessTableModal'
import TableAddModal from './components/TableAddModal'
import BusinessRelationsModal from './components/BusinessRelationsModal'

/**
 * @Title:业务模型父组件
 * @Description:父组件
 * @Author: chenshuai
 * @Time: 2018/7/10
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const BusinessIndex = ({
                           location, dispatch, BusinessIndex, loading
                         }) => {
  location.query = queryString.parse(location.search)
  const {
    LedgerType,
    businessTreelist,
    businessTableList,
    ...liststate
  } = BusinessIndex
  const listProps ={
    LedgerType,
    businessTreelist,
    businessTableList,
    dispatch,
    loading,
    ...liststate,
    /*操作创建业务模型模态框*/
    changeAddBusinsessModal:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          addBusinessVisible:data
        },
      })
    },
    /*操作编辑表属性模态框*/
    changeBusinsessTableModal:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          businsessTableModal:data
        },
      })
    },
    /*操作创建物理表模态框*/
    changeTableAddModal:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          tableAddVisible:data
        },
      })
    },

    /*操作创建物理表模态框*/
    changeBusinessRelationsModal:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          businessRelationsVisible:data
        },
      })
    },
    /*操作创建业务模型模态框title*/
    businessTitle:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          businessModalTitle:data
        },
      })
    },
    /*操作col模态框*/

    changeColModal:(data)=>{
      dispatch({
        type: LedgerType+'/querySuccess',
        payload: {
          colVisible:data
        },
      })
    },
    /*操作创建业务模型模态框title*/
    relationTitle:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          relationtitle:data
        },
      })
    },
    /*modelCode传值*/
    changeModelCode:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          ModelCode:data
        },
      })
    },
    /*tableCode传值*/
    changeTableCode:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          TableCode:data
        },
      })
    },

  }
  return (
    <div>
      <BusinessTree {...listProps} />
      <BusinessAddModal {...listProps} />
      <BusinessTableModal {...listProps} />
      <TableAddModal {...listProps} />
      <BusinessRelationsModal {...listProps} />
    </div>

  )

}
BusinessIndex.propTypes = {
  BusinessIndex: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ BusinessIndex, loading }) => ({ BusinessIndex, loading }))(BusinessIndex)
