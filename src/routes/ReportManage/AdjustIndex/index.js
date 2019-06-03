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
 * @Title:报表管理》派生指标调整
 * @Description:父组件（stateless）
 * @Author: mxt
 * @Time: 2018/5/2
 * @Update: dhn
 * @UpdateTime: 2018/6/25

 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const AdjustIndex = ({
                       location, dispatch, adjustIndex, loading,
                     }) => {
  location.query = queryString.parse(location.search)
  const {
    // queryProductLevData,
    formValues,
    LedgerType,
    appId,
    orgId,
    quota,
    organ,
    quotaNum,
    organNum,
    modalType1,
    type,
    currentItem,
    modalVisible1,
    ...liststate,
  } = adjustIndex

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
    // queryProductLevData,
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

    /*完成指标调整*/
    onCreat:(data)=>{
      dispatch({
        type:LedgerType+'/'+modalType,
        payload:data,
        callback:(res)=>{
        }
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
    organ,
    quotaNum,
    organNum,
    /*查询参数*/
    formValues,
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

AdjustIndex.propTypes = {
  adjustIndex: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ adjustIndex, loading }) => ({ adjustIndex, loading }))(AdjustIndex)
