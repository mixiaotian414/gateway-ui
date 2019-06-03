const qs = require('qs')
const Mock = require('mockjs')

const config = require('../utils/config')

const { apiPrefix } = config
let DataMock = Mock.mock({
  'data|30-50': [
    {
      DATE_ID:'@datetime',
      organCode:/^A[1][0][0][1]\d{4}$/,
      organName:/^机构\d{3}$/,
      indexNum:/^A[1][0][0][1]\d{4}$/,
      indexName:/^指标\d{3}$/,
      indexValue:/^[1234567]\d{4,8}\.\d{2}$/,
      changeValue:/^[1234567]\d{4,8}\.\d{2}$/,
      'key|+1':1,
    },
  ],
})
let database = DataMock.data

const NOTFOUND = {
  message: 'Not Found',
  /*documentation_url: 'http://localhost:8000/request',*/
}


module.exports = {

  [`GET ${apiPrefix}/modelManageDetail/:id`] (req, res) {
    const { id } = req.params
    const newData = database
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    res.status(200).json({
      LIST: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
      RESCODE:"1",
      RESMESSAGE:"获取数据错误",
      PARAMS:{"paraCode":"200005"},
    })
  },

}
