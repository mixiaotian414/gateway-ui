import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import Filter from './components/StateFilter'
import List from './components/StateList'
/**
 * @Title:报表管理》报表查询
 * @Description:父组件（stateless）
 * @Author: mxt
 * @Time: 2018/5/17
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const ReportQuery = ({
  location, dispatch, reportQuery, loading,
}) => {
  location.query = queryString.parse(location.search)
  const {
    formValues,
    querySelectTreeData,
    LedgerType,
    ...liststate,
  } = reportQuery

  /*列表参数*/
  const listProps={
    dispatch,
    /*namespace*/
    LedgerType,
    loading,
    ...liststate,
    formValues,
    /*刷新*/
    refresh:()=>{
      dispatch({type: LedgerType+'/query'})
    },
    /*跳转*/
    tohistoryAna:(record)=>{
      dispatch(routerRedux.push({
        pathname:LedgerType+'Detail/'+record.key,
      }))
    },
    handleFormReset:()=>{
      dispatch({
        type: LedgerType+'/querySuccess',
        payload:{formValues:{}}
      });
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
    /*下拉树*/
    querySelectTreeData,
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
    </Page>

  )
}

ReportQuery.propTypes = {
  reportQuery: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ reportQuery, loading }) => ({ reportQuery, loading }))(ReportQuery)
