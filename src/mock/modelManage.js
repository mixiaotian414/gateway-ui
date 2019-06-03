import lodash from 'lodash'
const qs = require('qs')
const Mock = require('mockjs')

const config = require('../utils/config')

const { apiPrefix } = config
let DataMock = Mock.mock({
  'data|150-180': [
    {
      modelNum:/^A[1][0][0][1]\d{4}$/,
      modelName:/^模型\d{3}$/,
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


  [`GET ${apiPrefix}/modelManage`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = database
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            if (key === 'address') {
              return other[key].every(iitem => item[key].indexOf(iitem) > -1)
            } else if (key === 'queryDate') {
              const start = new Date(other[key][0]).getTime()
              const end = new Date(other[key][1]).getTime()
              const now = new Date(item[key]).getTime()
              if (start && end) {
                return now >= start && now <= end
              }
              return true
            } else if (key === 'DATE_ID') {
              const start = new Date(other[key]).getTime()

              const now = new Date(item[key]).getTime()

              if (now === start) {
                return true
              }
              return false
            } else if (key==='dealstatus'){

              var i = other[key].length;
              if (i===0){
                return true
              }
              while (i--) {
                if ( parseInt(other[key][i],10)===parseInt(item[key],10)) {
                  return true;
                }
              }
              return false;
            }else if (key==='qudaonum'||key==='typenum'||key==='status'){
                if ( parseInt(other[key],10)===parseInt(item[key],10)||other[key]==="") {
                  return true;
                }
              return false;
            }
            return String(item[key]).trim().indexOf(decodeURI(other[key]).trim()) > -1
          }
          return true
        })
      }
    }
    res.status(200).json({
      LIST: newData.slice((page - 1) * pageSize, page * pageSize),
      total: newData.length,
      RESCODE:"1",
      RESMESSAGE:"获取数据错误",
      PARAMS:{"paraCode":"200005"},
    })
  },




  [`GET ${apiPrefix}/updateState`] (req, res) {

    const { query } = req


    const {id,operate} = query
    let isExist = false


    database = database.map((item) => {
      if (item.id === id) {
        isExist = true
        if (operate==='open'){
          item.status=1
        }else {

          item.status=0

        }
     /*   return Object.assign({}, item, editItem)*/
        return item
      }
      return item
    })

    if (isExist) {
      res.status(200).json({
        RESCODE:"1",
        PARAMS:{"paraCode":"200005"},
      })
    } else {
      res.status(404).json(NOTFOUND)
    }
  },
  [`GET ${apiPrefix}/queryProductLev`] (req, res) {

    const { query } = req
    const data =[
      { label: '一级科目',
        value: '1',
        key:"11"},
      { label: '二级科目',
        value: '2',
        key:"21"},
      { label: '三级科目',
        value: '3',
        key:"31"},
    ]
    res.status(200).json({
      LIST: data,
      RESCODE:"1",
      PARAMS:{"paraCode":"200005"},
    })
  },
  [`GET ${apiPrefix}/queryParam`] (req, res) {

    const { query } = req
    const data =[
      { label: '全部',
        value: '',
        key:"0"},
      { label: '交易编号',
        value: 'tradeNo',
        key:"1"},
      { label: '卡号',
        value: 'num',
        key:"2"},
      { label: '户号',
        value: 'account',
        key:"3"},
    ]
      res.status(200).json({
        LIST: data,
        RESCODE:"1",
        PARAMS:{"paraCode":"200005"},
      })
  },


    [`POST ${apiPrefix}/createmodel`] (req, res) {
  const newData = req.body
  newData.createTime = Mock.mock('@now')

  newData.id = Mock.mock('@id')
  newData.key = Mock.mock('@id')

  database.unshift(newData)

  res.status(200).end()
},
}
