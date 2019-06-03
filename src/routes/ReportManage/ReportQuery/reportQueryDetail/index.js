import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import Filter from './components/StateFilter'
import List from './components/StateList'
/**
 * @Title:报表管理》报表查询详情
 * @Description:父组件（stateless）
 * @Author: mxt
 * @Time: 2018/5/17
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const ReportQueryDetail = ({
                       location, dispatch, reportQueryDetail, loading,
                     }) => {
  location.query = queryString.parse(location.search)
  const {
    formValues,
    queryCurData,
    querySelectTreeData,
    queryProductLevData,
    LedgerType,
    ...liststate,

  } = reportQueryDetail

  /*列表参数*/
  const listProps={
    /*总账类型*/
    dispatch,
    LedgerType,
    loading,
    ...liststate,
    formValues,
    /*刷新*/
    refresh:()=>{
      dispatch({type: LedgerType+'/query'})
    },
    /*历史分析*/
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
    /*币种数据*/
    queryCurData,
    /*机构下拉树*/
    querySelectTreeData,
    /*科目等级*/
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
      changefields={
        ...changefields,
        'id':1
      }
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

ReportQueryDetail.propTypes = {
  reportQueryDetail: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ reportQueryDetail, loading }) => ({ reportQueryDetail, loading }))(ReportQueryDetail)
