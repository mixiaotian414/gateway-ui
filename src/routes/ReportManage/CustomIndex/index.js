import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import {message} from 'antd'
import Filter from '../components/StateFilter'
import List from '../components/StateList'
/**
 * @Title:报表管理》自定义指标列表
 * @Description:父组件（stateless）
 * @Author: mxt
 * @Time: 2018/3/13
 * @updateTime: 2018/5/9
 * @updateRemark: 添加指标移动，表单列，筛选框，批量删除等
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const CustomIndex = ({
  location, dispatch, customIndex, loading,
}) => {
  location.query = queryString.parse(location.search)
  const {
    formValues,
    querySelectTreeData,
    LedgerType,
    getTypeList,
    ...liststate,
  } = customIndex

  const {modalType}= {...liststate}
  /*列表参数*/
  const listProps={
    dispatch,
    getTypeList,
    /*namespace*/
    LedgerType,
    loading,
    ...liststate,
    formValues,
    /*跳转*/
    onEditItem:(item)=>{
      dispatch({
        type:LedgerType+'/toEdit',
        payload: {
          modalType: 'update',
          currentItem: item,
          createmodalVisible:true
        },
      })
    },
    /*跳转*/
    onMoveItem:(item)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          MoveItem: item,
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
    },
    /*创建指标*/
    toCreat:()=>{
     dispatch({
       type:LedgerType+'/querySuccess',
        payload:{
          modalType: 'create',
          currentItem: {},
          createmodalVisible:true
        },
      })
    } ,
    /*完成创建指标*/
    onCreat:(data)=>{
     dispatch({
       type:LedgerType+'/'+modalType,
        payload:data,
        callback:(res)=>{
          let msg =modalType === 'create' ? '添加成功' : '修改成功'
          message.info(msg)
          dispatch({
            type:LedgerType+'/querySuccess',
            payload: {
              createmodalVisible:false
            },
          })
        }
      })
    }
  }
  /*索引参数*/
  const filerProps={
    LedgerType,
    getTypeList,
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

CustomIndex.propTypes = {
  customIndex: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ customIndex, loading }) => ({ customIndex, loading }))(CustomIndex)
