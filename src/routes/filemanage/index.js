import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import FileFilter from './components/FileFilter'
import FileList from './components/FileList'
import {message} from 'antd'

/**
 * @Title:即席查询XMI文件管理组件
 * @Description:父组件（stateless）
 * @Author: chenshuai
 * @Time: 2019/3/18
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */
const FileIndex = ({
                      location, dispatch, FileIndex, loading,app
                    }) => {
  location.query = queryString.parse(location.search)
  const {
    formValues,
    LedgerType,
    ids,
    selectedRowKeys,
    getTypeList,
    ...liststate
  } = FileIndex

  const {modalType}= {...liststate}
  /*列表参数*/
  const listProps={
    dispatch,
    app,
    /*namespace*/
    LedgerType,
    ids,
    selectedRowKeys,
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
    /*操作模态框*/
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
    LedgerType,
    loading,
    /*查询参数*/
    formValues,
    getTypeList,
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
      console.log('values',changefields)
      dispatch({
        type:LedgerType+'/query',
        payload: changefields
      })
    }
  }
  return (
    <Page inner>

      <FileList {...listProps} />
    </Page>

  )
}

FileIndex.propTypes = {
  FileIndex: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ FileIndex, loading,app }) => ({ FileIndex, loading ,app}))(FileIndex)
