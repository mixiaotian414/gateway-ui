import modelExtend from 'dva-model-extend'
import * as sysParamService from 'services/sysparam'
import { pageModel } from 'models/common'
import { message } from 'antd'

const { query, queryid, del, create, update } = sysParamService
export default modelExtend(pageModel,{
  namespace: 'sysParam',

  state: {
    list: [],
    currentItem: {},
    formValues: {},
    item:[],
    selectedRowKeys: [],
    paraIdList: [],
  },
  effects: {

    * query ({ payload = { page: 1, pageSize: 10 } }, { call, put, select} ) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      payload = {...payload,appId:appId}
      const response = yield call(query, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: response.RSP_BODY.paramList,
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

    * add ({ payload }, { call, put }) {
      const response = yield call(create, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'query',
          })
          message.success('添加成功')
        }
      }
    },

    * delete ({ payload }, { call, put,select }) {
      const response = yield call(del, payload)
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
    * update ({ payload }, { call, put }) {
      const response = yield call(update, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'query',
          })
          message.success('修改成功')
        }
      }
    },
    * queryid ({ payload }, { call, put, select }) {
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

  },
  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/sysparam') {
        }
      })
    },
  },

  reducers: {
    querySuccess (state, { payload }) {
      return { ...state, ...payload }
    },
  },
})
