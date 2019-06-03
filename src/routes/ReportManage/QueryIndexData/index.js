import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import {message} from 'antd'
import Filter from './components/StateFilter'
import List from './components/StateList'
import { CreateModelModal } from 'components'
/**
 * @Title:报表管理》指标数据查询
 * @Description:父组件（stateless）
 * @Author: mxt
 * @Time: 2018/5/5 * @Update: dhn
 * @UpdateTime: 2018/6/25
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const QueryIndexData = ({
                          location, dispatch, queryIndexData, loading,
                        }) => {
  location.query = queryString.parse(location.search)
  const {
    queryProductLevData,
    formValues,
    querySelectTreeData,
    LedgerType,
    quota,
    quotaNum,
    organ,
    organNum,
    modalType1,
    type,
    currentItem,
    modalVisible1,
    appId,
    orgId,
    ...liststate,
  } = queryIndexData


  const modalProps = {
    modalType1,
    type,
    item: modalType1 === 'create' ? {} : currentItem,
    visible: modalVisible1,
    maskClosable: false,
    confirmLoading: loading.effects[LedgerType+'/update'],
    title: `${type === 'quota' ? '多选指标' : '多选机构'}`,
    wrapClassName: 'vertical-center-modal',
    width:"850px",
    queryProductLevData,
    /*完成创建指标*/
    okText:"保存",
    cancelText:"取消",

    onOk (data) {
      if(type =="quota"){

        dispatch({
            type: LedgerType+'/saveModalData',
            payload:{quota: {...data},}
        })

        dispatch({
          type:LedgerType+'/querySuccess',
          payload: {quotaNum:data.products.length},
        })
      } else {
        
        dispatch({
          type: LedgerType+'/saveModalData',
          payload:{organ: {...data},}
        })

        dispatch({
          type:LedgerType+'/querySuccess',
          payload: {organNum:data.branches.length},
        })
      }
    },
    
    onCancel () {
      dispatch({
        type: LedgerType+'/hideModal',
      })
    },
  }

  const {modalType}= {...liststate}
  /*列表参数*/
  const listProps={
    dispatch,
    /*namespace*/
    LedgerType,
    loading,
    ...liststate,
    //查询数据
    formValues,
    queryProductLevData,
    /*查询表单*/
    onTableChange:(filters,params)=>{
      console.info(filters)
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

    /*完成创建指标*/
    onCreat:(data)=>{
      dispatch({
        type:LedgerType+'/'+modalType,
        payload:data,

      })
    },/*操作模态框*/
    changeModal:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          modalVisible:data
        },
      })
    },
  }
  /*索引参数*/
  const filerProps={
    dispatch,
    appId,
    orgId,
    LedgerType,
    loading,
    quota,
    quotaNum,
    organ,
    organNum,
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

    onAdd (item,type) {
      dispatch({
        type: LedgerType+'/querySuccess',
        payload:{
          type: type,
        }
      });
      if(item){
        dispatch({
          type: LedgerType + '/showModal',
          payload: {
            type:type,
            modalType1: 'update',
            currentItem: item,
          },
        })
      }  else {
          dispatch({
            type: LedgerType+'/showModal',
            payload: {
              type:type,
              modalType1: 'create',
              currentItem: {},
            },
          })

      }
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
      {modalVisible1 && <CreateModelModal {...modalProps} />}
    </Page>

  )
}

QueryIndexData.propTypes = {
  queryIndexData: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ queryIndexData, loading }) => ({ queryIndexData, loading }))(QueryIndexData)
