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
      'indexRate|1':["年","月","天"],
      'currencyCode|1':["人民币","美元","英镑"],
      'organName|1':["交通银行总行","中国人民银行","建设银行总行"],
      'indexFlag|1':["0","1"],
      'indexFormula|1':["1.6*[A10010001]+[A10010002]","IF[M3710367<=0#0,M3710367>0#M3710367]","MAX([A10010001],1.6*[A10010002])+[A10010002]","TIME(1.2*[A10010001],SY)+TIME(1.2*[A10010002],SY)"],
      'indexRemark|1':["常用派生指标","财务专用指标","管理指标"],
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


  [`GET ${apiPrefix}/customIndex`] (req, res) {
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

  [`GET ${apiPrefix}/querySelectTree`] (req, res) {


    const { query } = req
    const data= [
      {group_id:'0',group_name:'湖南省联社',prt_group_id:'TOP',create_time:'20171211203035'},
      {group_id:'1',group_name:'长沙市办',prt_group_id:'0',create_time:'20171211203035'},
      {group_id:'2',group_name:'常德市办',prt_group_id:'0',create_time:'20171211203035'},
      {group_id:'3',group_name:'郴州市办',prt_group_id:'0',create_time:'20171211203035'},
      {group_id:'4',group_name:'衡阳市办',prt_group_id:'0',create_time:'20171211203035'},
      {group_id:'5',group_name:'怀化市办',prt_group_id:'0',create_time:'20171211203035'},
      {group_id:'6',group_name:'娄底市办',prt_group_id:'0',create_time:'20171211203035'},
      {group_id:'11',group_name:'长沙农商银行',prt_group_id:'1',create_time:'20171211203035'},
      {group_id:'12',group_name:'星沙农商银行',prt_group_id:'1',create_time:'20171211203035'},
      {group_id:'13',group_name:'浏阳农商银行',prt_group_id:'1',create_time:'20171211203035'},
      {group_id:'21',group_name:'桃源农商银行',prt_group_id:'2',create_time:'20171211203035'},
      {group_id:'22',group_name:'安乡农商银行',prt_group_id:'2',create_time:'20171211203035'},
      {group_id:'23',group_name:'常德农商银行',prt_group_id:'2',create_time:'20171211203035'},
      {group_id:'31',group_name:'郴州农商银行',prt_group_id:'3',create_time:'20171211203035'},
      {group_id:'32',group_name:'宜章农商银行',prt_group_id:'3',create_time:'20171211203035'},
      {group_id:'41',group_name:'衡阳农商银行',prt_group_id:'4',create_time:'20171211203035'},
      {group_id:'42',group_name:'衡东农商银行',prt_group_id:'4',create_time:'20171211203035'},
      {group_id:'51',group_name:'怀化农商银行',prt_group_id:'5',create_time:'20171211203035'},
      {group_id:'52',group_name:'新晃农商银行',prt_group_id:'5',create_time:'20171211203035'},
      {group_id:'61',group_name:'娄底农商银行',prt_group_id:'6',create_time:'20171211203035'},
      {group_id:'62',group_name:'涟源农商银行',prt_group_id:'6',create_time:'20171211203035'},
    ]

    res.status(200).json({
      LIST: data,
      RESCODE:"1",
      PARAMS:{"paraCode":"200005"},
    })
  },

  [`GET ${apiPrefix}/queryIndexList`] (req, res) {


    const { query } = req
    const results=
      [{"gender":"male","name":{"title":"mr","first":"chris","last":"wilhelm"},"email":"chris.wilhelm@example.com","nat":"DE"},{"gender":"female","name":{"title":"miss","first":"yolanda","last":"ruiz"},"email":"yolanda.ruiz@example.com","nat":"ES"},{"gender":"female","name":{"title":"mrs","first":"ivon","last":"ruben"},"email":"ivon.ruben@example.com","nat":"NL"},{"gender":"male","name":{"title":"monsieur","first":"samuel","last":"charles"},"email":"samuel.charles@example.com","nat":"CH"},{"gender":"male","name":{"title":"mr","first":"dylan","last":"morris"},"email":"dylan.morris@example.com","nat":"NZ"}]
    res.status(200).json({
      results: results,
      RESCODE:"1",
      PARAMS:{"paraCode":"200005"},
    })
  },

  [`POST ${apiPrefix}/createIndex`] (req, res) {
    const newData = req.body
    newData.createTime = Mock.mock('@now')

    newData.id = Mock.mock('@id')
    newData.key = Mock.mock('@id')

    database.unshift(newData)

    res.status(200).end()
  },

  [`DELETE ${apiPrefix}/customIndex`] (req, res) {
    const { ids } = req.body
    database = database.filter(item => !ids.some(_ => _ === item.id))
    res.status(204).end()
  },

}
