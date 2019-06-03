import pathToRegexp from 'path-to-regexp'
import modelExtend from 'dva-model-extend'
import * as reportQueryDetailService from 'services/ReportManage/reportQueryDetail'
import { pageModel } from 'models/common'
const { query} = reportQueryDetailService
import queryString from 'query-string'
const LedgerType="reportQueryDetail"
export default modelExtend({

  namespace:LedgerType,

  state: {

    list:[],
    formValues:{
      page: 1,
      pageSize: 10
    },
    LedgerType
  },

  subscriptions: {
    setup ({ dispatch, history }) {
      history.listen(( location ) => {
        const match = pathToRegexp('/reportQueryDetail/:id').exec(location.pathname)
        if (match) {
          dispatch({ type: 'query', payload: { id: match[1] } })

          const search=queryString.parse(location.search)
          const {tradetype} =search
          dispatch({ type: 'querySuccess', payload: {tradetype } })

        }
      })
    },
  },

  effects: {
    * query ({payload,}, { call, put }) {
      const detailData = yield call(query, payload)
      if (detailData.RESCODE==='1') {
        yield put({
          type: 'querySuccess',
          payload: {
            list: detailData.LIST,

          },
        })
      }

    },

  },

  reducers: {
    querySuccess (state, { payload }) {
      return {...state, ...payload}
    },
  },
})
