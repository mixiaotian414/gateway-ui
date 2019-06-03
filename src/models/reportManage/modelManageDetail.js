import pathToRegexp from 'path-to-regexp'
import modelExtend from 'dva-model-extend'
import * as modelManageDetailService from 'services/ReportManage/modelManageDetail'
import {pageModel} from 'models/common'
import {message} from 'antd'

const {query, queryColumn} = modelManageDetailService
import queryString from 'query-string'

const LedgerType = "modelManageDetail"
export default modelExtend({

  namespace: LedgerType,

  state: {
    LedgerType,
    queryIndex: undefined,
    data: [],
    formValues: {
      tableType: '1',
      page: 1,
      pageSize: 10
    },
    quota:{},
    organ:{},
    quotaNum:0,
    organNum:0,
    currentItem:{},
    modalVisible:false,
    modalType1:'create',
    type: '', //指标 机构类型
    modalVisible1:false
  },

  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        const match = pathToRegexp('/modelManageDetail/:id').exec(location.pathname)
        if (match) {
          dispatch({
            type: 'querySuccess',
            payload: {
              code: match[1],
              tableType: '1',
              formValues: {
                page: 1,
                pageSize: 10,
                code: match[1],
                tableType: '1',
              }
            }
          })
          /*dispatch({
            type: 'queryColumn',
            payload: {
              page: "1",
              pageSize: "10",
              code: match[1],
              tableType: "1",
            }
          })*/
        }
      })
    },
  },

  effects: {
    * query({payload}, {call, put}) {
      const data = yield call(query, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS === "1") {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.RSP_BODY.colList,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: Number(payload.pageSize) || 10,
              total: data.RSP_BODY.total,
            },
          },
        })
      } else {
        message.error("获取列表数据失败：" + data)
      }
    },

    /** queryColumn({payload}, {call, put}) {
      //列表data
      const data = yield call(queryColumn, payload)

      if (data.RSP_HEAD.TRAN_SUCCESS === "1") {
        yield put({
          type: 'querySuccess',
          payload: {
            queryIndex: data.RSP_BODY.reportList[0].products
          },
        })
      } else {
        message.error("获取列表数据失败：" + data)
      }
    },*/
  },

  reducers: {
    saveModalData (state, { payload }) {
      return { ...state, ...payload, modalVisible1: false }
    },
    showModal (state, { payload }) {
      return { ...state, ...payload, modalVisible1: true }
    },

    hideModal (state) {
      return { ...state, modalVisible1: false }
    },

    querySuccess(state, {payload}) {
      return {...state, ...payload}
    },
    resetForm(state) {
      let code = state.code
      let payload = {
        formValues: {
          page: 1,
          pageSize: 10,
          code
        },
      }
      return {...state, ...payload}
    },
  },
})
