const qs = require('qs')
const Mock = require('mockjs')
const config = require('../utils/config')

const { apiPrefix } = config
let datalist = Mock.mock({
  'data|80-100': [
    {
      'key|+1': 1,
      appId: /^[1234]\d{6}[1-9]$/,
      'appName|1': ["绩效考核系统","报表管理系统","客户关系系统","财务管理系统","总账管理系统"],
      appCode: /^[1]\d{4}[1-9]$/,
      'appDesc|1': ["超级管理员","管理员","财务主任","业务经理","柜员"],
      'appType|1': ["类型1","类型2","类型3"],
      'openAppStatus|1':["是","否"],
      'openApp|1':["0","1"],
      appPeffectivedate: '@date',
      appExpiredate: '@date',
    },
  ],
})
let database = datalist.data

const NOTFOUND = {
  message: 'Not Found',
  //documentation_url: 'http://localhost:8001/request',
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
  [`GET ${apiPrefix}/apimanage`](req, res) {
    const { query } = req
    let { pageSize, page } = query
    pageSize = pageSize || 10
    page = page || 1
    let newData = database
    res.status(200).json({
      RSP_BODY:{appList: newData.slice((page - 1) * pageSize, page * pageSize),total: newData.length},
      RSP_HEAD:{TRAN_SUCCESS:  "1"},
    })
  },

}

