import lodash from 'lodash'
const qs = require('qs')
const Mock = require('mockjs')

const config = require('../utils/config')

const { apiPrefix } = config
let DataMock = Mock.mock({
  'data|1': [
    {
      modelNum:/^A[1][0][0][1]\d{4}$/,
      modelName:/^报表\d{3}$/,
      createDate:'@dateTime',
      'modelType|1':["0","1","2"],
      'indexes|1':[ ['A10010002', 'A10010001', 'A10010003'],['B10010002', 'B10010001', 'B10010003'],['C10010002', 'C10010001', 'C10010003']],
      'modelRemark|1':["常用模型","财务专用模型","管理模型"],
      'key|+1':1,
    },
  ],
})
let database = lodash.cloneDeep(DataMock.data)


const NOTFOUND = {
  message: 'Not Found',
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


  [`GET ${apiPrefix}/reportQuery`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    const data=[{
      modelNum:'A1000101',
        modelName:'帆软报表',
      createDate:'2018/05',
      'modelType':"0",
       'modelRemark':"帆软模型",
      'key':2,
    },{
      modelNum:'A1000102',
        modelName:'润乾报表',
      createDate:'2018/05',
      'modelType':"0",
       'modelRemark':"润乾模型",
      'key':3,
    },{
      modelNum:'A1000105',
        modelName:'业务状况表',
      createDate:'2018/05',
      'modelType':"0",
       'modelRemark':"常用模型",
      'key':1,
    },]

    res.status(200).json({
      LIST: data,
      total: data.length,
      RESCODE:"1",
      RESMESSAGE:"获取数据错误",
      PARAMS:{"paraCode":"200005"},
    })
  },




}
