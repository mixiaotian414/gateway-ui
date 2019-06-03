import modelExtend from 'dva-model-extend'
import * as Service from 'services/ReportManage/queryIndexData'
import {message} from 'antd'
const {querynosum,querysumbybranch,querysumbydate,queryProductLev,create} = Service
import { arrayToSelectTree } from 'utils'

/**
 * @Title:报表管理》指标数据查询
 * @Description:model
 * @Author: mxt
 * @Time: 2018/5/4
 * @Update: dhn
 * @UpdateTime: 2018/6/25
 * @Version 1.0
 * @Copyright: Copyright (c) 2018 .DHCC
 */

const LedgerType="queryIndexData"
export default modelExtend({

  namespace: LedgerType,
  state:{
    list:[],
    quota:{},
    organ:{},
    quotaNum:0,
    organNum:0,
    organization:[],
    formValues:{
      tableType:'1',
      page: 1,
      pageSize: 10
    },
    LedgerType,
    modalType:'create',
    modalType1:'create',
    type: '', //指标 机构类型
    modalVisible:false,
    modalVisible1:false
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {

        if (location.pathname==="/"+LedgerType) {
          dispatch({
            type: 'init',
          })
          dispatch({
            type:'querySuccess',
            payload: {
              quotaNum:0,
              quota:{},
              organ:{},
              organNum:0,
            },
          })
        }
      })
    },
  },
  effects: {
    * query({payload={ page: 1, pageSize: 10 ,tableType:"1"}}, {call, put}) {
      //列表data
      let data = {}
      let sums
      if(payload.tableType==='1'){
        data = yield call(querynosum, payload)
        sums =data.RSP_BODY.sumdata
        if (sums&&sums.length>0){
        sums[0].dateId="总计"
        sums[0].branchId="-"
        sums[0].branchName="-"}
      }else if(payload.tableType==='2'){
        data = yield call(querysumbybranch, payload)
        sums =data.RSP_BODY.sumdata
      }else {
        data = yield call(querysumbydate, payload)
        sums =data.RSP_BODY.sumdata
      }
      let list =data.RSP_BODY.dataList

      if (data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              list,
              sums,
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
    * create ({ payload,callback }, { call, put }) {
      const data = yield call(create, payload)
      if (data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          message.success("保存成功")
          yield put({
            type: 'querySuccess',
            payload: {
              modalVisible: false
            },
          })
        }

      }
    },

    * init({payload={ page: 1, pageSize: 10 }}, {call, put}) {

      payload={	"appId":"1",
        "dictCode":"REPORT_TYPE"}
      //类别
      const queryProductLevData = yield call(queryProductLev, payload)

      if (queryProductLevData.RSP_HEAD.TRAN_SUCCESS==="1") {
        yield put({
          type: 'querySuccess',
          payload: {
            queryProductLevData: queryProductLevData.RSP_BODY.dictList,
          },
        })
      }else{
        message.error("获取科目级别失败："+queryProductLevData)
      }
    },
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
    }
  }

})
