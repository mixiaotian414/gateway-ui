import lodash from 'lodash'
const qs = require('qs')
const Mock = require('mockjs')

const config = require('../utils/config')

const { apiPrefix } = config
let DataMock = Mock.mock({
  'data|150-180': [
    {
      'key|+1':1,
      id: '@id',
      num: '@id',
      'card_type|1': ["运通卡","万事达卡","威士卡","银联卡"],
      'card_property|1': ["借记卡","贷记卡","准贷记卡"],
      'card_material|1': ["磁条卡","芯片卡","复合卡","EMV"],
      date: '@date',
      time: '@time',
      country: '@county',
      money: /^[34578]\d{5}$/,
      'type|1':  ["消费","转入","ATM","POS","自助终端"],
      'typenum|1':  ["0","1","2","3","4"],
      'qudao|1':  ["手机银行","网银","转出","取现","查询"],
      'qudaonum|1':  ["0","1","2","3","4"],
      'showName|1': ["交易反欺诈工作流","常用工作流","不常用工作流"],
      othername: '@cname',
      account: /^[34578]\d{17}$/,
      phone: /^1[34578]\d{11}$/,
      institution: /^[34578]\d{9}[KTP]$/,
      'institution_name|1': ["中国建设银行","中国工商银行","中国银行"],
      'status|1': ["0","1","2"],
      'statusname|1': ["告警","强认证","阻断"],
      'deal|1': ["待审核","转电核","已回执","已审核"],
      'dealstatus|1': ["0","1","2","3"],
    }
  ],
})
let database = lodash.cloneDeep(DataMock.data)
//不改变原型
let database2 = lodash.cloneDeep(DataMock.data)

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


  [`GET ${apiPrefix}/roleSetting`] (req, res) {
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

  [`GET ${apiPrefix}/roleSetting2`] (req, res) {
    const { query } = req
    let { pageSize, page, ...other } = query
    pageSize = pageSize || 10
    page = page || 1

    let newData = database2
    for (let key in other) {
      if ({}.hasOwnProperty.call(other, key)) {
        newData = newData.filter((item) => {
          if ({}.hasOwnProperty.call(item, key)) {
            if (key === 'address') {
              return other[key].every(iitem => item[key].indexOf(iitem) > -1)
            } else if (key === 'createTime') {
              const start = new Date(other[key][0]).getTime()
              const end = new Date(other[key][1]).getTime()
              const now = new Date(item[key]).getTime()
              if (start && end) {
                return now >= start && now <= end
              }
              return true
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
  [`POST ${apiPrefix}/roleSettingDetail/:id`] (req, res) {
    const { id } = req.params
    const data = queryArray(database, id, 'id')
    if (data) {
      res.status(200).json({
       LIST: data,
        total: data.length,
        RESCODE:"1",
        PARAMS:{"paraCode":"200005"},
      } )
    } else {
      res.status(404).json(NOTFOUND)
    }
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

  [`GET ${apiPrefix}/queryChannel`] (req, res) {

    const { query } = req
    const data =[
      { label: '全部',
        value: '',
        key:"1"},
      { label: '手机银行',
        value: '0',
        key:"2"},
      { label: '网银',
        value: '1',
        key:"3"},
      { label: '转出',
        value: '2',
        key:"4"},
      { label: '取现',
        value: '3',
        key:"5"},
      { label: '查询',
        value: '4',
        key:"6"},
    ]
    res.status(200).json({
      LIST: data,
      RESCODE:"1",
      PARAMS:{"paraCode":"200005"},
    })
  },

  [`GET ${apiPrefix}/queryTradeType`] (req, res) {

    const { query } = req
    const data =[
      { label: '全部',
        value: '',
        key:"1"},
      { label: '消费',
        value: '0',
        key:"2"},
      { label: '转入',
        value: '1',
        key:"3"},
      { label: 'ATM',
        value: '2',
        key:"4"},
      { label: 'POS',
        value: '3',
        key:"5"},
      { label: '自助终端',
        value: '4',
        key:"6"},
    ]
    res.status(200).json({
      LIST: data,
      RESCODE:"1",
      PARAMS:{"paraCode":"200005"},
    })
  },
  [`GET ${apiPrefix}/queryRiskType`] (req, res) {


    const { query } = req
    const data =[
      { label: '全部',
        value: '',
        key:"1"},
      { label: '告警',
        value: '0',
        key:"2"},
      { label: '强验证',
        value: '1',
        key:"3"},
      { label: '阻断',
        value: '2',
        key:"4"}
    ]
    res.status(200).json({
      LIST: data,
      RESCODE:"1",
      PARAMS:{"paraCode":"200005"},
    })
  },
}
