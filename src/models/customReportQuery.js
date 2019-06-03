import modelExtend from 'dva-model-extend'
import * as Service from 'services/customReport'
import {message} from 'antd'
const { query,otherdataview,dataview } = Service
import { arrayToSelectTree } from 'utils'


const LedgerType="CustomReportQuery"
export default modelExtend({
  namespace: LedgerType,
  state:{
    list:[],
    selectedRowKeys: [],
    ids: [],
    code:[],
    LedgerType,
    modalType:'create',
    dateVisible:false,
    dateModalList:[],
    otherVisible:false,
    otherModalList:[],
    paramDate:[],
    filtersData:[],

  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        //if (location.pathname==="/"+LedgerType) {
        if (location.pathname==="/CustomReportQuery") {

        }
      })
    },
  },
  effects: {
    * query({payload}, {call, put}) {
      //列表data
      const data = yield call(query, payload)
      if (data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list: data.RSP_BODY.data,
              route: data.RSP_BODY.route,
            },
          })
        }
      }
    },
    * dataModalData({payload={ page: 1, pageSize: 10 }}, {call, put}) {
      const data = yield call(dataview, payload)
      if(data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              dateModalList: data.RSP_BODY.dataList,
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
    * otherModalData({payload={ page: 1, pageSize: 10 }}, {call, put}) {
      const data = yield call(otherdataview, payload)
      if(data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              otherModalList: data.RSP_BODY.dataList,
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

  },
  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    },
    showModal (state, { payload }) {
      return { ...state, ...payload, dateVisible: true }
    },
    hideModal (state) {
      return { ...state, dateVisible: false }
    },
    othershowModal (state, { payload }) {
      return { ...state, ...payload, otherVisible: true }
    },
    otherhideModal (state) {
      return { ...state, otherVisible: false }
    },
  }
})
