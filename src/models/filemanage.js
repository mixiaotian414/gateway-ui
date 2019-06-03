import modelExtend from 'dva-model-extend'
import * as Service from 'services/filemanage'
import {message} from 'antd'
const { query,LoadReport } = Service
const LedgerType="FileIndex"

export default modelExtend({
  namespace: LedgerType,
  state:{
    list:[],
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
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        //if (location.pathname==="/"+LedgerType) {
        if (location.pathname==="/fileIndex") {
          const payload = location.query || {}
          dispatch({
            type: 'query',
            payload,
          })
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
              list: data.RSP_BODY.list,
            },
          })
        }
      }
    },

    /*批量下载*/
    * LoadReport({payload}, {call, put, select}) {
      const data = yield call(LoadReport, payload);
      if (data.data) {
        //获取后台文件名
        const realFileName = data['headers']['content-disposition'].split('filename=')[1];
        yield put({type: 'saveFile', payload: {blob: data.data, fileName: realFileName}})

      } else {
        throw data
      }
    },
    * saveFile({
                 payload: {blob, fileName = 'abcdefg.xlsx'},
               }, {call}) {
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, fileName);
      } else {
        let link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;

        //此写法兼容可火狐浏览器
        document.body.appendChild(link);

        let evt = document.createEvent("MouseEvents");
        evt.initEvent("click", false, false);
        link.dispatchEvent(evt);

        document.body.removeChild(link);
      }
    },
  },
  reducers: {
    querySuccess(state, {payload}) {
      return {...state, ...payload}
    },
  }
})
