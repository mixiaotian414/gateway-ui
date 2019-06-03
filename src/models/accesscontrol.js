import modelExtend from 'dva-model-extend'
import * as accesscontrolService from 'services/accesscontrol'
import { pageModel } from 'models/common'
import { message } from 'antd'

const { getVisitIpList, delList,addVisitIps, delVisitIps } = accesscontrolService
export default modelExtend(pageModel,{
  namespace: 'accesscontrol',

  state: {
    list: [],//表单list
  },
  effects: {
    * query ({ payload = { page: 1, pageSize: 10 } }, { call, put, select} ) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      payload = {...payload,appId:appId}
      const response = yield call(getVisitIpList, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: response.RSP_BODY.visitIpList,
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
    //批量删除
    * delete ({ payload }, { call, put,select }) {
      const response = yield call(delList, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({type: 'updateState', payload: {selectedRowKeys: []}})
          yield put({
            type: 'query',
          })
          message.success('删除成功')
        }
      }
    },
    //添加黑名单
    * addBlack ({ payload }, { call, put,select }) {
      const response = yield call(addVisitIps, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({type: 'updateState', payload: {selectedRowKeys: []}})
          yield put({
            type: 'query',
          })
          message.success('添加成功')
        }
      }
    },
    //解除黑名单
    * removeBlack ({ payload }, { call, put,select }) {
      const response = yield call(delVisitIps, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({type: 'updateState', payload: {selectedRowKeys: []}})
          yield put({
            type: 'query',
          })
          message.success('解除成功')
        }
      }
    },

  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/accesscontrol') {
          dispatch({
            type: 'query'
          })
        }
      })
    },
  },
  reducers: {
    querySuccess (state, { payload }) {
      return { ...state, ...payload }
    },
  }

})
