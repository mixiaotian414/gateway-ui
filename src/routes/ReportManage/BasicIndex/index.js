import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import Filter from './components/StateFilter'
import List from './components/StateList'
/**
 * @Title:报表管理》基础指标体系
 * @Description:父组件（stateless）
 * @Author: mxt
 * @Time: 2018/5/3
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const BasicIndex = ({
  location, dispatch, basicIndex, loading,
}) => {
  location.query = queryString.parse(location.search)
  const {
    formValues,
    LedgerType,
    ...liststate,
  } = basicIndex

  /*列表参数*/
  const listProps={
    dispatch,
    /*namespace*/
    LedgerType,
    loading,
    ...liststate,
    formValues,
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
     {/* <Filter {...filerProps} />*/}
      <List {...listProps} />
    </Page>

  )
}
BasicIndex.propTypes = {
  basicIndex: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ basicIndex, loading }) => ({ basicIndex, loading }))(BasicIndex)
