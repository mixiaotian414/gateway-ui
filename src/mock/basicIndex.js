import lodash from 'lodash'
const qs = require('qs')
const Mock = require('mockjs')

const config = require('../utils/config')

const { apiPrefix } = config
let DataMock = Mock.mock({
  'data|150-180': [
    {
      indexNum:/^A[1][0][0][1]\d{4}$/,
      indexName:/^指标\d{3}$/,
      'indexType|1':["0","1","2"],
      'indexFormula|1':["1.6*[A10010001]+[A10010002]","IF[M3710367<=0#0,M3710367>0#M3710367]","MAX([A10010001],1.6*[A10010002])+[A10010002]","TIME(1.2*[A10010001],SY)+TIME(1.2*[A10010002],SY)"],
      'indexRemark|1':["常用派生指标","财务专用指标","管理指标"],
      'key|+1':1,
    },
  ],
})
let database = lodash.cloneDeep(DataMock.data)

const NOTFOUND = {
  messindexCode: 'Not Found',
  /*documentation_url: 'http://localhost:8000/request',*/
}

const queryArray = (array, key, keyAlias = 'key') => {
  if (!(array instanceof Array)) {
    return null
  }
  let data

  for (let item of array) {
    if (item[keyAlias] === key) {
      data = item
      break
    }
  }

  if (data) {
    return data
  }
  return null
}
module.exports = {
  [`GET ${apiPrefix}/basicIndex`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    const data =  [{
      key: 1,
      indexName: '效益指标',
      indexCode: undefined,
      originType:undefined,
      Line:undefined,
      indexState:undefined,
      children: [{
        key: 11,
        indexName: '利息收入',
        indexCode: undefined,
        originType:  undefined,
        Line: undefined,
        indexState:undefined,
        children: [{
          key: 121,
          indexName: '资金指标',
          indexCode: 'P10001',
          originType: '机构',
          Line:'会计条线',
          indexState:'有效',
        },{
          key: 122,
          indexName: '利息支出',
          indexCode: 'P10001',
          originType: '机构',
          Line:'会计条线',
          indexState:'有效',
        }],
      } , {
        key: 13,
        indexName: '全部贷款',
        indexCode: undefined,
        originType: undefined,
        Line:undefined,
        indexState:undefined,
        children: [{
          key: 131,
          indexName: '利息支出',
          indexCode: 'P10001',
          originType: '机构',
          Line:'会计条线',
          indexState:'有效',
          children: [{
            key: 1311,
            indexName: '利息支出',
            indexCode: 'P10001',
            originType: '机构',
            Line:'会计条线',
            indexState:'有效',
          }, {
            key: 1312,
            indexName: '利息支出',
            indexCode: 'P10001',
            originType: '机构',
            Line:'会计条线',
            indexState:'有效',
          }],
        }],
      }],
    }];
    res.status(200).json({
      LIST: data.slice((page - 1) * pageSize, page * pageSize),
      total: data.length,
      RESCODE:"1",
      RESMESSAGE:"获取数据错误",
      PARAMS:{"paraCode":"200005"},
    })
  },

}
