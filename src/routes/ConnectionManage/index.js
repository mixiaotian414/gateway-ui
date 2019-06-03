import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import Connectionlist from './components/Connectionlist'
import TablePropModal from './components/TablePropModal'
import PreviewModal from './components/PreviewModal'
import DisplayModal from './components/DisplayModal'
import LinkAddModal from './components/LinkAddModal'
import DataViewModal from './components/DataViewModal'
const ConnectionIndex = ({
                        location, dispatch, ConnectionIndex, loading,app
                      }) => {
  location.query = queryString.parse(location.search)
  const {

    LedgerType,
    ...liststate
  } = ConnectionIndex
  const listProps ={
    dispatch,
    app,
    LedgerType,
    loading,
    ...liststate,

    /*操作预览模态框*/
    changeModal:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          modalVisible:data
        },
      })
    },
    /*操作导入表模态框*/
    changeExportModal:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload:{
          exportVisible:data
        }
      })
    },
    /*操作创建连接模态框*/
    changeLinkModal:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          modalLinkVisible:data
        },
      })
    },
    /*操作创建连接模态框title*/
    linkTitle:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          linkModalTitle:data
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

    /*操作数据浏览模态框*/
    changeDataViewModal:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          dataViewVisible:data
        },
      })
    },

    /*操作显示表结构模态框*/
    changeTableModal:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          modalTableVisible:data
        },
      })
    },
    /*操作显示表属性模态框*/
    changeTablePropsModal:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          tablePropsVisible:data
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
    /*获取dbtype*/
    changeDbType:(data)=>{
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          dbType:data
        }
      })
    }

  }
    return (
      <div>
        <Connectionlist {...listProps} />
        <TablePropModal {...listProps} />
        <PreviewModal {...listProps} />
        <DisplayModal {...listProps} />
        <LinkAddModal {...listProps} />
        <DataViewModal {...listProps} />
      </div>

    )

}
ConnectionIndex.propTypes = {
  ConnectionIndex: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ ConnectionIndex, loading }) => ({ ConnectionIndex, loading }))(ConnectionIndex)
