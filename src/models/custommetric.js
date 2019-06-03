import modelExtend from 'dva-model-extend'
import * as Service from 'services/custommetric'
import {message} from 'antd'
const {query, del} = Service
import { arrayToSelectTree } from 'utils'


const LedgerType="custommetricIndex"
export default modelExtend({
  namespace: LedgerType,
  state:{
    list:[],
    engineUrl:'',
    selectedRowKeys: [],
    ids: [],
    formValues:{
      page: 1,
      pageSize: 10
    },
    LedgerType,
    modalType:'create',
    currentItem:{},
    modalVisible:false,
    getTypeList:[]
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        // if (location.pathname==="/"+LedgerType) {
        if (location.pathname==="/custommetricIndex") {
          const payload = location.query || { page: 1, pageSize: 10 }
          dispatch({
            type: 'query',
            payload,
          })
        }
      })
    },
  },
  effects: {
    * query({payload={ page: 1, pageSize: 10 }}, {call, put}) {
      //列表data
      const data = yield call(query, payload)
      if (data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.RSP_BODY.data,
              engineUrl:data.RSP_BODY.engineUrl,
              pagination: {
                current: Number(payload.page) || 1,
                pageSize: Number(payload.pageSize) || 10,
                total: data.RSP_BODY.total,
              },
            },
          })
        }
      }
    },

    * del ({ payload }, { call, put, select }) {
      const response = yield call(del, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          message.success('删除成功')
          yield put({
            type: 'query',
          })
        }
      }
    },


  },
  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    },
  }

})
