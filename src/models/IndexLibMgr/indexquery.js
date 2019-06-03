import modelExtend from 'dva-model-extend'
import * as Service from 'services/IndexLibMgr/IndexQuery/indexquery'
import {message} from 'antd'
const { indextree,indexdimension,collectiontree,createDir,updateDir,delDir,delReport,indexcollection,query,create,update,del,getSelectList,dataview,LoadReport } = Service
const LedgerType="IndexQuery"

export default modelExtend({
  namespace: LedgerType,
  state:{
    list:[],
    collectionSelectedKeys:[],
    keyData:[],
    ids: [],
    formValues:{
      page: 1,
      pageSize: 10
    },
    changefields:{},
    LedgerType,
    currentItem:{},
    dirItem:{},
    filterVisible: false,//操作模态框
    treeVisible:false,
    collectionModalVisible:false,
    exportVisible:false,
    modalType: 'create',
    modalTreeType:'createDir',
    collectionModalType:'',
    filtersData:[],
    collectionTreeData : [],
    indexTreeData : [],
    dimensionList:[],
    dimensionparams:[],
    selectdata:[],
    selectdataid:[],
    columnsName:[],
    selectIndexIds:[], //选中指标id集合
    checkedKeys:[],
    filterModalList:[],//过滤列表List
    dimensionType:[],//维度类型
    dimensionId:[],//维度id
    dimensionValue:[],//过滤后的维度值
    dataList:[],
    titleList:[],
    filterTargetKeys: [],
    indexName:"",
    exportparams:{}
  },
  subscriptions: {
    setup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname==="/IndexQuery") {
          /*dispatch({
            type: 'indextree',
          })*/
          dispatch({
            type: 'collectiontree',
          })
          dispatch({
            type: 'getSelectList'
          })
          dispatch({
            type: 'querySuccess',
            payload:{
              filtersData:[],
              dimensionList:[],
              collectionSelectedKeys:[],
              checkedKeys:[],
              selectdata:[],
              selectdataid:[],
              dataList:[],
              titleList:[],
              dimensionValue:[],
            }
          });
        }
      })
    },
  },
  effects: {
    * getSelectList({ payload }, { call, put, select }) {
      const { user } = yield select(_ => _.app)
      const { appId } = user
      const data = {
        appId:appId,
        dictCode: 'REPORT_TYPE'
      }

      const response = yield call(getSelectList, data)
      if (response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'getReportType',
            payload: response.RSP_BODY.dictList,
          })
        }
      }
    },
    /*指标目录树*/
    * indextree ({ payload },{ call, put, select}){
      const response = yield call(indextree, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              indexTreeData: response.RSP_BODY.producttree,
            },
          })
        }
      }
    },
    /*指标维度查询*/
    * indexdimension ({ payload },{ call, put, select}){
      const response = yield call(indexdimension, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              dimensionList: response.RSP_BODY.dimensionList,
            },
          })
        }
      }
    },

    /*收藏目录同步树*/
    * collectiontree ({ payload },{ call, put, select}){
      const response = yield call(collectiontree, payload)
      if(response.success) {
        if (response.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              collectionTreeData: response.RSP_BODY.reporttree,
            },
          })
        }
      }
    },
    /*收藏目录新增*/
    * createDir ({ payload }, { call, put }) {
      const data = yield call(createDir, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==="1") {
        message.success('新增成功')
        yield put({ type: 'hideModalTree' })
        yield put({ type: 'collectiontree' })
      } else {
        throw data
      }
    },
    /*收藏目录修改*/
    * updateDir ({ payload }, { call, put }) {
      const data = yield call(updateDir, payload)
      if (data.RSP_HEAD.TRAN_SUCCESS==="1") {
        message.success('修改成功')
        yield put({ type: 'hideModalTree' })
        yield put({ type: 'collectiontree' })
      } else {
        throw data
      }
    },
    /*收藏目录删除*/
    * delDir({ payload },{ call,put }){
      const response = yield call(delDir,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          message.success('删除成功')
          yield put({
            type:'collectiontree',
          })
        }
      }
    },
    //报表删除
    * delReport({ payload },{ call,put }){
      const response = yield call(delReport,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          message.success('删除成功')
          yield put({
            type:'collectiontree',
          })
        }
      }
    },
    //指标收藏
    * indexcollection({ payload },{ call,put }){
      const response = yield call(indexcollection,payload)
      if(response.success){
        if(response.RSP_HEAD.TRAN_SUCCESS === '1'){
          message.success('收藏成功')
          yield put({ type: 'hideCollectionModal' })
          yield put({
            type:'collectiontree',
          })
        }
      }
    },
    /*导出*/
    * download({payload}, {call, put, select}) {
      const data = yield call(LoadReport, payload);
      if (data.data) {
        //获取后台文件名
        const realFileName = data['headers']['content-disposition'].split('filename=')[1];
        const filename = decodeURI(realFileName)
        yield put({type: 'saveFile', payload: {blob: data.data, fileName: filename}})

      } else {
        throw data
      }
    },
    * saveFile({
                 payload: {blob, fileName = 'abcdefg.xlsx'},
               }, {call,put}) {
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
        message.success('导出成功')
        yield put({ type: 'exportHideModal' })
      }
    },

    /*指标查询*/
    * query({payload={ page: 1, pageSize: 10 }}, {call, put}) {
      const data = yield call(query, payload)
      if(data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              dataList: data.RSP_BODY.dataList,
              titleList: data.RSP_BODY.titleList,
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

    * filterModalData({payload={ page: 1, pageSize: 10 }}, {call, put}) {
      const data = yield call(dataview, payload)
      if(data.success) {
        if (data.RSP_HEAD.TRAN_SUCCESS === '1') {
          yield put({
            type: 'querySuccess',
            payload: {
              filterModalList: data.RSP_BODY.dataList,
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
    getReportType(state, { payload }) {
      return {
        ...state,
        getReportType: payload,
      }
    },
    showModal (state, { payload }) {
      return { ...state, ...payload, filterVisible: true }
    },
    hideModal (state) {
      return { ...state, filterVisible: false }
    },
    showModalTree (state, { payload }) {
      return { ...state, ...payload, treeVisible: true }
    },
    hideModalTree (state) {
      return { ...state, treeVisible: false }
    },
    showCollectionModal (state, { payload }) {
      return { ...state, ...payload, collectionModalVisible: true }
    },
    hideCollectionModal (state) {
      return { ...state, collectionModalVisible: false }
    },
    exportShowModal (state, { payload }) {
      return { ...state, ...payload, exportVisible: true }
    },
    exportHideModal (state) {
      return { ...state, exportVisible: false }
    },
  }
})
