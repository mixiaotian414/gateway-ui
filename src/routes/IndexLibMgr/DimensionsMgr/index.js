import React from 'react'
import PropTypes from 'prop-types'
import { routerRedux } from 'dva/router'
import { connect } from 'dva'
import { Page } from 'components'
import queryString from 'query-string'
import {message} from 'antd'
import Filter from './components/Filter'
import TableList from './components/TableList'
import DimensionAdd from './components/DimensionAdd'
import DataView from './components/DataView'


/**
 * @Title:指标库管理=》维度管理
 * @Description:父组件（stateless）
 * @Author: chenshuai
 * @Time: 2019/4/9
 * @Version 1.0
 * @Copyright: Copyright (c) 2019 .DHCC
 */
const DimensionsMgr = ({
                     location, dispatch, DimensionsMgr, loading
                   }) => {
  location.query = queryString.parse(location.search)
  const {
    formValues,
    LedgerType,
    ids,
    selectedRowKeys,
    modalType,
    dataViewVisible,
    dataViewFormValues,
    dataViewList,
    getType,
    datasourceList,
    dimensiontableList,
    dimensionValueList,
    modalVisible,
    currentItem,
    pagination1,
    getTypeList,
    ...liststate
  } = DimensionsMgr

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

    deleteIndex (item) {
      dispatch({
        type: LedgerType + '/del',
        payload: {
          ids: item
        },
      })
    },
    onDataView(data){
      dispatch({
        type:LedgerType+'/queryDataView',
        payload: {
          id: data.id,
          dimensionDatasource: data.dimensionDatasource,
          dimensionTable: data.dimensionTable,
          dimensionKey: data.dimensionKey,
          dimensionValue: data.dimensionValue,
          filterKey: "",
          filterValue: "",
          page: 1,
          pageSize: 10
        },
      })
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          dataViewFormValues:{
            id: data.id,
            dimensionDatasource: data.dimensionDatasource,
            dimensionTable: data.dimensionTable,
            dimensionKey: data.dimensionKey,
            dimensionValue: data.dimensionValue,
            filterKey: "",
            filterValue: "",
          }
        },
      })
    },
    onDataVisible(data){
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          dataViewVisible:data
        },
      })
    }
  }

  /*索引参数*/
  const filerProps={
    LedgerType,
    loading,
    /*查询参数*/
    formValues,
    getType,
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
  const modalProps = {
    dispatch,
    LedgerType,
    modalType,
    getType,
    datasourceList,
    dimensiontableList,
    dimensionValueList,
    item: modalType === 'create' ? {} : currentItem,
    visible: modalVisible,
    //confirmLoading: loading.effects[LedgerType+'/update'],
    title: `${modalType === 'create' ? '添加维度' : '维度修改'}`,
    dimensionType:getType,
    onOk (data) {
      dispatch({
        type:LedgerType+`/${modalType}`,
        payload: data,
      })
    },
    onCancel () {
      dispatch({
        type: LedgerType+'/hideModal',
      })
    },
  }
  const dataViewProps = {
    dataViewVisible,
    LedgerType,
    dispatch,
    loading,
    dataViewList,
    dataViewFormValues,
    pagination1,

    onDataViewTableChange:(params)=>{
      dispatch({
        type:LedgerType+'/queryDataView',
        payload: params,
      });
    },
    onDataViewCancel(data){
      dispatch({
        type:LedgerType+'/querySuccess',
        payload: {
          dataViewVisible:data
        },
      })
    },
    onDataViewOk(data){
      dispatch({
        type:LedgerType+'/queryDataView',
        payload: {
          dimensionDatasource: dataViewFormValues.dimensionDatasource,
          dimensionKey: dataViewFormValues.dimensionKey,
          dimensionTable:dataViewFormValues.dimensionTable,
          dimensionValue: dataViewFormValues.dimensionValue,
          id: dataViewFormValues.id,
          filterKey: data.filterKey || '',
          filterValue: data.filterValue || '',
          page: 1,
          pageSize: 10,
        },
      });
    }
  }
  return (
    <Page inner>
      <Filter {...filerProps} />
      <TableList {...listProps} />
      <DimensionAdd {...modalProps} />
      <DataView {...dataViewProps }/>
    </Page>

  )
}

DimensionsMgr.propTypes = {
  DimensionsMgr: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ DimensionsMgr, loading }) => ({ DimensionsMgr, loading }))(DimensionsMgr)
