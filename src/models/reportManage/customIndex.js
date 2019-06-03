import modelExtend from 'dva-model-extend'
import * as Service from 'services/ReportManage/customIndex'
import {message} from 'antd'
const {query,querySelectTree,create,remove,prodcollect,prodmove,userBussList,deriveprodupdate,getSelectList} = Service
import { arrayToSelectTree } from 'utils'

/**
 * @Title:报表管理》自定义指标列表
 * @Description:model
 * @Author: mxt
 * @Time: 2018/3/13
 * @updateTime: 2018/5/8
 * @updateRemark: 添加指标移动，表单列，筛选框，批量删除等
 * @Version 1.1
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const LedgerType="customIndex"
export default modelExtend({
  namespace: LedgerType,
  state:{
    list:[],
    formValues:{
      page: 1,
      pageSize: 10
    },
    LedgerType,
    modalType:'create',
    currentItem:{},
    getTypeList:[]
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname==="/"+LedgerType) {
          const payload = location.query || { page: 1, pageSize: 10 }
          dispatch({
            type: 'initData',
            payload,
          })
          dispatch({
            type: 'getSelectList'
          })
          dispatch({
            type: 'query'
          })
        }
      })
    },
  },
  effects: {
    * query({payload={ page: 1, pageSize: 10 }}, {call, put}) {
      //列表data
      const data = yield call(query, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==='1') {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.RSP_BODY.deriveList,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.RSP_BODY.total,
            },
          },
        })
      }
    },
    * initData({payload={ page: 1, pageSize: 10 }}, {call, put,select}) {
      //treeDate
      const querySelectTreeData = yield call(querySelectTree, payload)
    /*  const SelectTree = arrayToSelectTree(querySelectTreeData.LIST, 'group_id', 'prt_group_id')*/
      const treeData =querySelectTreeData.RSP_BODY.deriveProdList
      let treeString=JSON.stringify(treeData)
      let treeTrans=treeString.replace(/shortName/g,"title").replace(/code/g,"value")

      let treeDataJson= JSON.parse(treeTrans);


        yield put({
          type: 'querySuccess',
          payload: {
            querySelectTreeData: treeDataJson,
          },
        })

      //treeDate
      const {user} =yield select (_ => _.app)
      const {userId,appId} = user
      let query={
        userId,appId
      }
      const res = yield call(userBussList, query)

      let BussList =res.RSP_BODY.bussList

      yield put({
        type:"querySuccess",
        payload:{
          BussList
        }
      })


    },
    * create ({ payload,callback }, { call, put }) {
      const data = yield call(create, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==='1') {
        callback(data)
        yield put({ type: 'query' })
      } else {
        throw data
      }
    },
    * update ({ payload ,callback}, { call, put }) {
      const data = yield call(deriveprodupdate, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==='1') {
        callback(data)
        yield put({ type: 'query' })
      } else {
        throw data
      }

    },
  * toEdit ({ payload,callback }, { call, put }) {
   /*   const data = yield call(create, payload)*/
    yield put({ type: 'querySuccess',
      payload })
    },
  * moveIndex ({ payload,callback }, { call, put }) {
      const data = yield call(prodmove, payload)
    if (data.RSP_HEAD.TRAN_SUCCESS==='1') {
      callback(data)
      yield put({ type: 'query' })
    } else {
      throw data
    }

    },
    * multiDelete ({ payload,callback }, { call, put }) {
      const data = yield call(remove, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
      callback(data)
    },
    * prodcollect ({ payload,callback }, { call, put }) {
      const data = yield call(prodcollect, payload)
      if (data.success) {
        yield put({ type: 'query' })
      } else {
        throw data
      }
      callback(data)
    },
    * getSelectList({ payload }, { call, put, select }) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      const data = {
        appId: appId,
        dictCode: 'FREQUENCY'
      }
      const response = yield call(getSelectList, data)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              getTypeList: response.RSP_BODY.dictList
          },
          })
        }
      }
    },
  },
  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    }
  }

})
