/* eslint-disable quotes */
import modelExtend from 'dva-model-extend'
import pathToRegexp from 'path-to-regexp'
import * as functionService from 'services/function'
import { pageModel } from 'models/common'
import { message } from 'antd'

const { query, queryid, add, update,del, func_read, queryapi, queryPersonnelrole, getSelectList, function_apisave, function_apis, apiDetail } = functionService

export default modelExtend(pageModel,{
  namespace: 'Function',

  state: {
    list: [],
    item: [],
    formValues: {},
    queryapilist: [],
    queryPersonnelrolelist: [],
    getFunctionTypeList: [],
    getFuncTypeList: [],
    getInterceptor:[],
    funcitem: [],
    apiidslist: [],
    countflag:[],
    apiDetailList:[],
  },

  effects: {

    //获取功能类型下拉列表
    * getSelectList({ payload }, { call, put, select }) {
      const id = yield select(state => state)
      const app = id.app.user.appId
      const data = {
          appId: app,
          dictCode: 'FUNC_TYPE_TREE'
      }
      const data1 = {
          appId: app,
          dictCode: 'FUNC_STATUS'
      }
      const data2 = {
        appId: app,
        dictCode: 'INTERCEPTOR'
      }
      const response = yield call(getSelectList, data)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getFunctionTypeList',
            payload: response.RSP_BODY.dictList,
          })
        }
      }
      const response1 = yield call(getSelectList, data1)
      if(response1.success) {
        if (response1.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getFuncTypeList',
            payload: response1.RSP_BODY.dictList,
          })
        }
      }
      const response2 = yield call(getSelectList, data2)
      if(response2.success) {
        if (response2.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getInterceptor',
            payload: response2.RSP_BODY.dictList,
          })
        }
      }
    },

    //树列表
    * query ({ payload }, { put, call,select }) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      payload = {...payload,appId:appId}
      const response = yield call(query,payload);
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: response.RSP_BODY.funcList,

            }
          })
        }
      }
    },
    //接口列表
    * queryapi ({ payload = { page: 1, pageSize: 10 } }, { call, put,select} ) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      payload = {...payload,appId:appId}
      const response = yield call(queryapi, payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS==='1'){
          yield put({
            type: 'querySuccess',
            payload: {
              queryapilist: response.RSP_BODY.apiList,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: response.RSP_BODY.total,
              },
            },
          })
        }
      }

    },
    //角色明细
    * queryPersonnelrole ({ payload = { page: 1, pageSize: 10 } }, { call, put} ) {
      const response = yield call(queryPersonnelrole, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              queryPersonnelrolelist: response.RSP_BODY.roleList,
              pagination2: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: response.RSP_BODY.total,
              },
            },
          })
        }
      }
    },
    //删除
    * delete ({ payload }, { select, call, put }) {
      const response = yield call(del, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              countflag: response.RSP_BODY.count,
            }
          })
          yield put({
            type: 'query',
            payload,
          })
        }
      }
    },
    //添加
    * add ({ payload }, { call, put }) {
      const response = yield call(add, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'query',
            payload,
          })
          message.success('添加成功')
        }
      }
    },
    //修改保存
    * update ({ payload }, { call, put }) {
      const response = yield call(update, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'query',
            payload,
          })
          message.success('修改成功')
        }
      }
    },
    //编辑取值
    * queryid ({ payload }, { call, put }) {
      const response = yield call(queryid, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              item: response.RSP_BODY,

            },
          })
        }
      }
    },
    //绑定接口取值
    * functionapis ({ payload }, { call, put,select }) {
      const response = yield call(function_apis, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              apiidslist: response.RSP_BODY.apiids,
            },
          })
        }
      }
    },
    //绑定接口
    * functionapisave ({ payload }, { call, put,select }) {
      const response = yield call(function_apisave, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({type: 'updateState', payload: {selectedRowKeys: []}})
          yield put({
            type: 'functionapis',
            payload,
          })
          message.success('绑定成功！')
        }
      }
    },
    //接口详情
    * apidetail ({ payload }, { call, put }) {
      const response = yield call(apiDetail, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              apiDetailList: response.RSP_BODY,

            },
          })
        }
      }
    },

    //功能节点查询（后台还没有写，目前用的编辑取值的接口）
    * funcread ({ payload }, { call, put }) {
      const response = yield call(func_read, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              funcitem: response.RSP_BODY,

            },
          })
        }
      }
    }
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/function') {
          const payload = location.queryapi || { page: 1, pageSize: 10 }
          dispatch({
            type: 'getSelectList'
          })
          dispatch({
            type: 'queryapi',
            payload,
          })
        }
      })
    },
  },

  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    },
    getFunctionTypeList(state, { payload }) {
      return {
        ...state,
        getFunctionTypeList: payload,
      }
    },
    getFuncTypeList(state, { payload }) {
      return {
        ...state,
        getFuncTypeList: payload,
      }
    },
    getInterceptor(state, { payload }) {
      return {
        ...state,
        getInterceptor: payload,
      }
    },
  }
})
