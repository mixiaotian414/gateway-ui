import lodash from 'lodash'
const qs = require('qs')
const Mock = require('mockjs')

const config = require('../utils/config')

const { apiPrefix } = config
let DataMock = Mock.mock({
  'data|150-180': [
    {
      'dateId':'@datetime',
      organCode:/^A[1][0][0][1]\d{4}$/,
      organName:/^机构\d{3}$/,
      moneyIndex:/^[1234567]\d{4,8}\.\d{2}$/,
      moneyIndex2:/^[1234567]\d{4,8}\.\d{2}$/,
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
  [`GET ${apiPrefix}/queryIndexData`] (req, res) {
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

  [`GET ${apiPrefix}/queryCur`] (req, res) {

    const { query } = req
    const data =
      [{'key':'0','value':'0','labellabel':'折本外币'},
        {'key':'1','value':'1','label':'人民币'},
        {'key':'2','value':'2','label':'折人民币'},
        {'key':'3','value':'3','label':'折美元'},
        {'key':'12','value':'12','label':'英镑'},
        {'key':'13','value':'13','label':'港币'},
        {'key':'14','value':'14','label':'美元'},
        {'key':'15','value':'15','label':'瑞士法郎'},
        {'key':'16','value':'16','label':'德国马克'},
        {'key':'17','value':'17','label':'法国法郎'},
        {'key':'18','value':'18','label':'新加坡元'},
        {'key':'19','value':'19','label':'巴基斯坦卢比'},
        {'key':'20','value':'20','label':'荷兰盾'},
        {'key':'21','value':'21','label':'瑞典克郎'},
        {'key':'22','value':'22','label':'丹麦克郎'},
        {'key':'23','value':'23','label':'挪威克郎'},
        {'key':'24','value':'24','label':'奥地利先令'},
        {'key':'25','value':'25','label':'比利时法郎'},
        {'key':'26','value':'26','label':'意大利里拉'},
        {'key':'27','value':'27','label':'日元'},
        {'key':'28','value':'28','label':'加拿大元'},
        {'key':'29','value':'29','label':'澳大利亚元'},
        {'key':'30','value':'30','label':'坦桑尼亚先令'},
        {'key':'31','value':'31','label':'西班牙比塞塔'},
        {'key':'32','value':'32','label':'马来西亚林元'},
        {'key':'35','value':'35','label':'金融比利时法郎'},
        {'key':'36','value':'36','label':'科威特第纳尔'},
        {'key':'38','value':'38','label':'欧元'},
        {'key':'40','value':'40','label':'斯里兰卡卢比'},
        {'key':'41','value':'41','label':'阿尔及利亚第纳尔'},
        {'key':'42','value':'42','label':'芬兰马克'},
        {'key':'43','value':'43','label':'加纳塞地'},
        {'key':'44','value':'44','label':'伊拉克地那尔'},
        {'key':'45','value':'45','label':'马里法郎'},
        {'key':'46','value':'46','label':'摩洛哥地拉姆'},
        {'key':'47','value':'47','label':'塞拉利昂利昂'},
        {'key':'48','value':'48','label':'伊朗里亚尔'},
        {'key':'49','value':'49','label':'尼泊尔卢比'},
        {'key':'50','value':'50','label':'几内亚西里'},
        {'key':'60','value':'60','label':'第那儿'},
        {'key':'61','value':'61','label':'阿尔巴尼亚列克'},
        {'key':'62','value':'62','label':'罗马尼亚列依'},
        {'key':'63','value':'63','label':'朝鲜币'},
        {'key':'64','value':'64','label':'越南盾'},
        {'key':'65','value':'65','label':'匈牙利福林'},
        {'key':'66','value':'66','label':'保加利亚列瓦'},
        {'key':'67','value':'67','label':'捷克克郎'},
        {'key':'69','value':'69','label':'波兰兹罗提'},
        {'key':'70','value':'70','label':'卢布'},
        {'key':'71','value':'71','label':'兰特'},
        {'key':'73','value':'73','label':'蒙古图格里克'},
        {'key':'80','value':'80','label':'赞比亚克瓦查'},
        {'key':'81','value':'81','label':'澳门币'},
        {'key':'82','value':'82','label':'菲律宾比索'},
        {'key':'83','value':'83','label':'缅甸币'},
        {'key':'84','value':'84','label':'泰币'},
        {'key':'85','value':'85','label':'印度罗比'},
        {'key':'86','value':'86','label':'马尔他镑'},
        {'key':'87','value':'87','label':'新西兰元'},
        {'key':'88','value':'88','label':'爱尔兰镑'},
        {'key':'89','value':'89','label':'卢森堡法郎'},
        {'key':'90','value':'90','label':'葡萄牙埃斯库多'}]
    res.status(200).json({
      LIST: data,
      RESCODE:"1",
      PARAMS:{"paraCode":"200005"},
    })
  },

  [`GET ${apiPrefix}/seractIndexCreateModel`] (req, res) {


    const { query } = req
    const results=
      [{"gender":"male","name":{"title":"mr","first":"chris","last":"wilhelm"},"email":"chris.wilhelm@example.com","nat":"DE"},{"gender":"female","name":{"title":"miss","first":"yolanda","last":"ruiz"},"email":"yolanda.ruiz@example.com","nat":"ES"},{"gender":"female","name":{"title":"mrs","first":"ivon","last":"ruben"},"email":"ivon.ruben@example.com","nat":"NL"},{"gender":"male","name":{"title":"monsieur","first":"samuel","last":"charles"},"email":"samuel.charles@example.com","nat":"CH"},{"gender":"male","name":{"title":"mr","first":"dylan","last":"morris"},"email":"dylan.morris@example.com","nat":"NZ"}]
    res.status(200).json({
      results: results,
      RESCODE:"1",
      PARAMS:{"paraCode":"200005"},
    })
  },


}
