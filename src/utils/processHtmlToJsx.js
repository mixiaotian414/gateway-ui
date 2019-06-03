/*
import lodash from 'lodash'
/!**
 * Created by Administrator on 2017/11/1.
 *!/
// let fs=require("fs");
//
// let buf=fs.readFileSync("./src/routes/login/index.js");
// let str=buf.toString();
str = ` <div class="ant-transfer">
          <div class="ant-transfer-list ant-transfer-list-with-footer" style="width: 250px; height: 300px;">
            <div class="ant-transfer-list-header">
            </div>
            <div class="ant-transfer-list-body ant-transfer-list-body-with-search">
              <div class="ant-transfer-list-body-search-wrapper">
                <div><input placeholder="Search here" class="ant-input ant-transfer-list-search" type="text"
                            value="12131"/><a href="#" class="ant-transfer-list-search-action"><i
                  class="anticon anticon-cross-circle"></i></a></div>
              </div>
              <ul class="ant-transfer-list-content">


              </ul>
              <div class="ant-transfer-list-body-not-found">Not Found</div>
            </div>

          </div>
          <div class="ant-transfer-operation">
            <button disabled="" type="button" class="ant-btn ant-btn-primary ant-btn-sm"><i
              class="anticon anticon-left"></i><span>to left</span></button>
            <button disabled="" type="button" class="ant-btn ant-btn-primary ant-btn-sm"><i
              class="anticon anticon-right"></i><span>to right</span></button>
          </div>
          <div class="ant-transfer-list ant-transfer-list-with-footer" style="width: 250px; height: 300px;">
            <div class="ant-transfer-list-header"> </div>
            <div class="ant-transfer-list-body ant-transfer-list-body-with-search">
              <div class="ant-transfer-list-body-search-wrapper">
                <div><input placeholder="Search here" class="ant-input ant-transfer-list-search" type="text"
                            value="12312"/><a href="#" class="ant-transfer-list-search-action"><i
                  class="anticon anticon-cross-circle"></i></a></div>
              </div>
              <ul class="ant-transfer-list-content">

              </ul>
              <div class="ant-transfer-list-body-not-found">Not Found</div>
            </div>

          </div>
        </div>
`


let re = /class="([^"]+)"/g
let result = str.replace(re, function (str, $1) {
  let arr = $1.split(/\s+/);
  if (arr.length == 1) {
    return `className={styles["${arr[0]}"]}`
  }
  if (arr.length > 1) {
    return `className={${arr.map(v => {
      return `styles["${v}"]`
    }).join(",")}}`
  }
});
result = result.replace(/id="([^"]+)"/g, function (str, $1) {
  return `className={styles["id_${$1}"]}`
});
result = result.replace(/<(img|input)([^>]+?[\/]?)>/g, function (str, $1, $2) {
  return `<${$1}${$2}/>`;
});
result = result.replace(/style="([^"]+)"/g, function (str, $1) {
  let arr = $1.split(";");
  let style = arr.map(v => {
    if (!v)return false;
    let varr = v.split(":");
    let key = varr[0].replace(/-(\w)/g, function (str, $1) {
      return $1.toUpperCase();
    });
    return `${key}:"${varr[1]}"`;
  }).filter(v => v).join(",");
  return `style={{${style}}}`;
});
result = result.replace(/<!--[\s\S]*?-->/g, "\n");

result=result.replace(/<([^>]+?)([\/]?)>/g,function(str,$1,$2){
    let list=[];
    let result=$1.replace(/className=\{([^\}]+)\}/g,function(str,$1){
      list.push($1);
      return "";
    });
    if(list.length) {
      return `<${result} className={classnames(${list.join(",")})}${$2}>`;
    }else{
      return str;
    }
});
/!*console.info(result);*!/



const arrayToTree = (array, id = 'id', pid = 'pid', children = 'children') => {
  let data = lodash.cloneDeep(array)
  let result = []
  let hash = {}
  data.forEach((item, index) => {
    hash[data[index][id]] = data[index]
  })

  data.forEach((item) => {
    let hashVP = hash[item[pid]]
    if (hashVP) {
      !hashVP[children] && (hashVP[children] = [])
      hashVP[children].push(item)
    } else {
      result.push(item)
    }
  })
  return result
}



const user = {
  "menu": [
    {
      "menu_no": "EBANK_01",
      "prt_menu_no": "EBANK",
      "menu_url": "/dashboard",
      "menu_name": "首页",
      "login_disp_model": "LM03",
      "menu_inner_name": "首页",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_02",
      "prt_menu_no": "EBANK",
      "menu_url": "1",
      "menu_name": "账户",
      "login_disp_model": "LM03",
      "menu_inner_name": "账户",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_02_01",
      "prt_menu_no": "EBANK_02",
      "menu_url": "/zhcx",
      "menu_name": "账户查询",
      "login_disp_model": "LM03",
      "menu_inner_name": "账户查询",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_02_02",
      "prt_menu_no": "EBANK_02",
      "menu_url": "/wylscx",
      "menu_name": "网银流水查询",
      "login_disp_model": "LM03",
      "menu_inner_name": "网银流水查询",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_03",
      "trade_no": "EBANK_01",
      "prt_menu_no": "EBANK",
      "menu_url": "1",
      "menu_name": "转账",
      "login_disp_model": "LM03",
      "menu_inner_name": "转账",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_03_01",
      "trade_no": "EBANK_01_01",
      "prt_menu_no": "EBANK_03",
      "menu_url": "/dbzz",
      "menu_name": "单笔转账",
      "login_disp_model": "LM03",
      "menu_inner_name": "单笔转账",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_03_02",
      "trade_no": "EBANK_01_02",
      "prt_menu_no": "EBANK_03",
      "menu_url": "/fk/plfk",
      "menu_name": "批量转账",
      "login_disp_model": "LM03",
      "menu_inner_name": "批量转账",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_03_03",
      "trade_no": "EBANK_01",
      "prt_menu_no": "EBANK_03",
      "menu_url": "1",
      "menu_name": "收款方管理",
      "login_disp_model": "LM03",
      "menu_inner_name": "收款方管理",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_03_03_01",
      "trade_no": "EBANK_01",
      "prt_menu_no": "EBANK_03_03",
      "menu_url": "/skfwh",
      "menu_name": "收款方信息维护",
      "login_disp_model": "LM03",
      "menu_inner_name": "收款方信息维护",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_03_03_02",
      "trade_no": "EBANK_01",
      "prt_menu_no": "EBANK_03_03",
      "menu_url": "/skffzgl",
      "menu_name": "收款方分组管理",
      "login_disp_model": "LM03",
      "menu_inner_name": "收款方分组管理",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_03_04",
      "trade_no": "EBANK_01",
      "prt_menu_no": "EBANK_03",
      "menu_url": "/kxytwh",
      "menu_name": "款项用途维护",
      "login_disp_model": "LM03",
      "menu_inner_name": "款项用途维护",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_03_05",
      "trade_no": "EBANK_01",
      "prt_menu_no": "EBANK_03",
      "menu_url": "/dehhcx",
      "menu_name": "大额行号查询",
      "login_disp_model": "LM03",
      "menu_inner_name": "大额行号查询",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_03_06",
      "trade_no": "EBANK_01_03",
      "prt_menu_no": "EBANK_03",
      "menu_url": "/yycx",
      "menu_name": "预约撤销",
      "login_disp_model": "LM03",
      "menu_inner_name": "预约转账撤销",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_04",
      "trade_no": "EBANK_02",
      "prt_menu_no": "EBANK",
      "menu_url": "1",
      "menu_name": "存款",
      "login_disp_model": "LM03",
      "menu_inner_name": "存款",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_04_01",
      "trade_no": "EBANK_02_01",
      "prt_menu_no": "EBANK_04",
      "menu_url": "1",
      "menu_name": "定期存款",
      "login_disp_model": "LM03",
      "menu_inner_name": "定期存款",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_04_01_01",
      "trade_no": "EBANK_02_01_01",
      "prt_menu_no": "EBANK_04_01",
      "menu_url": "/deposit_in_time",
      "menu_name": "存入定期存款",
      "login_disp_model": "LM03",
      "menu_inner_name": "存入定期存款",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_04_01_02",
      "trade_no": "EBANK_02_01_02",
      "prt_menu_no": "EBANK_04_01",
      "menu_url": "/timeDeposit",
      "menu_name": "支取定期存款",
      "login_disp_model": "LM03",
      "menu_inner_name": "支取定期存款",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_04_01_03",
      "trade_no": "EBANK_02_01",
      "prt_menu_no": "EBANK_04_01",
      "menu_url": "/deposit_in_time_chaxun",
      "menu_name": "查询定期存款",
      "login_disp_model": "LM03",
      "menu_inner_name": "查询定期存款",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_04_02",
      "trade_no": "EBANK_02_02",
      "prt_menu_no": "EBANK_04",
      "menu_url": "1",
      "menu_name": "通知存款",
      "login_disp_model": "LM03",
      "menu_inner_name": "通知存款",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_04_02_01",
      "trade_no": "EBANK_02_02_01",
      "prt_menu_no": "EBANK_04_02",
      "menu_url": "/crtzck",
      "menu_name": "存入通知存款",
      "login_disp_model": "LM03",
      "menu_inner_name": "存入通知存款",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_04_02_02",
      "trade_no": "EBANK_02_02_02",
      "prt_menu_no": "EBANK_04_02",
      "menu_url": "/jlzqtz",
      "menu_name": "建立支取通知",
      "login_disp_model": "LM03",
      "menu_inner_name": "建立支取通知",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_04_02_03",
      "trade_no": "EBANK_02_02_03",
      "prt_menu_no": "EBANK_04_02",
      "menu_url": "/zqtzck",
      "menu_name": "支取通知存款",
      "login_disp_model": "LM03",
      "menu_inner_name": "支取通知存款",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_04_02_04",
      "trade_no": "EBANK_02_02_04",
      "prt_menu_no": "EBANK_04_02",
      "menu_url": "/qxzqtz",
      "menu_name": "取消支取通知",
      "login_disp_model": "LM03",
      "menu_inner_name": "取消支取通知",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_04_02_05",
      "trade_no": "EBANK_02_02",
      "prt_menu_no": "EBANK_04_02",
      "menu_url": "/cxtzck",
      "menu_name": "查询通知存款",
      "login_disp_model": "LM03",
      "menu_inner_name": "查询通知存款",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_05",
      "prt_menu_no": "EBANK",
      "menu_url": "/reviewCheck",
      "menu_name": "复核",
      "login_disp_model": "LM03",
      "menu_inner_name": "复核",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_06",
      "trade_no": "EBANK_04",
      "prt_menu_no": "EBANK",
      "menu_url": "1",
      "menu_name": "设置",
      "login_disp_model": "LM03",
      "menu_inner_name": "设置",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_06_01",
      "trade_no": "EBANK_04_01",
      "prt_menu_no": "EBANK_06",
      "menu_url": "/authoritySet",
      "menu_name": "操作人员权限设置",
      "login_disp_model": "LM03",
      "menu_inner_name": "操作人员权限设置",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_06_02",
      "trade_no": "EBANK_04_02",
      "prt_menu_no": "EBANK_06",
      "menu_url": "/czyxxwh",
      "menu_name": "操作人员信息维护",
      "login_disp_model": "LM03",
      "menu_inner_name": "操作人员信息维护",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_06_03",
      "trade_no": "EBANK_04_03",
      "prt_menu_no": "EBANK_06",
      "menu_url": "/infoChange",
      "menu_name": "操作人员信息变更",
      "login_disp_model": "LM03",
      "menu_inner_name": "操作人员身份变更",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_06_04",
      "trade_no": "EBANK_04_04",
      "prt_menu_no": "EBANK_06",
      "menu_url": "/reviewProcessSetting",
      "menu_name": "复核流程设置",
      "login_disp_model": "LM03",
      "menu_inner_name": "复核流程设置",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_06_05",
      "trade_no": "EBANK_04_05",
      "prt_menu_no": "EBANK_06",
      "menu_url": "/TradeMoneySet",
      "menu_name": "交易限额设置",
      "login_disp_model": "LM03",
      "menu_inner_name": "交易限额设置",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_06_06",
      "trade_no": "EBANK_04",
      "prt_menu_no": "EBANK_06",
      "menu_url": "/settingWizard",
      "menu_name": "系统设置向导",
      "login_disp_model": "LM03",
      "menu_inner_name": "系统设置向导",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_06_07",
      "trade_no": "EBANK_04",
      "prt_menu_no": "EBANK_06",
      "menu_url": "/glyfh",
      "menu_name": "管理员复核",
      "login_disp_model": "LM03",
      "menu_inner_name": "管理员复核",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_07",
      "prt_menu_no": "EBANK",
      "menu_url": "1",
      "menu_name": "服务中心",
      "login_disp_model": "LM03",
      "menu_inner_name": "服务中心",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_07_01",
      "prt_menu_no": "EBANK_07",
      "menu_url": "/wyczrzcx",
      "menu_name": "网银操作日志查询",
      "login_disp_model": "LM03",
      "menu_inner_name": "网银操作日志查询",
      "ebank_login_model": "EM02"
    }, {
      "menu_no": "EBANK_07_03",
      "prt_menu_no": "EBANK_07",
      "menu_url": "/password",
      "menu_name": "修改密码",
      "login_disp_model": "LM03",
      "menu_inner_name": "修改密码",
      "ebank_login_model": "EM02"
    },{
      "menu_no": "EBANK_08",
      "prt_menu_no": "EBANK",
      "menu_url": "",
      "menu_name": "测试",
      "login_disp_model": "LM03",
      "menu_inner_name": "测试",
      "ebank_login_model": "EM02"
    },{
      "menu_no": "EBANK_08_01",
      "prt_menu_no": "EBANK_08",
      "menu_url": "/test",
      "menu_name": "组件测试",
      "login_disp_model": "LM03",
      "menu_inner_name": "组件测试",
      "ebank_login_model": "EM02"
    },{
      "menu_no": "EBANK_08_02",
      "prt_menu_no": "EBANK_08",
      "menu_url": "/request",
      "menu_name": "接口测试",
      "login_disp_model": "LM03",
      "menu_inner_name": "接口测试",
      "ebank_login_model": "EM02"
    },],
}
const menuTree = arrayToTree(user.menu, 'menu_no', 'prt_menu_no')

console.log(menuTree)
*/

/*const arry=[{aaa:"sdds",bbb:"sdsd"}]
console.log('arry',arry)
const json =JSON.stringify(arry)
console.log('json',json)
const tmp=json
const payload={
  arry1:tmp
}
console.log(payload)*/

/*
let KeyList=['1','2','3','1']


let pointFlag=false
let pointNum
for (let i=KeyList.length;i>0;i--){
  if(KeyList[i-1]==='3'){
    pointFlag=true
    pointNum=i-1
    break
  }
}

console.log(pointNum)*/

/*


*/


// let fs=require("fs");
//
// let buf=fs.readFileSync("./src/routes/login/index.js");
// let str=buf.toString();
str = ` <div class="ant-transfer">
          <div class="ant-transfer-list ant-transfer-list-with-footer" style="width: 250px; height: 300px;">
            <div class="ant-transfer-list-header">
            </div>
            <div class="ant-transfer-list-body ant-transfer-list-body-with-search">
              <div class="ant-transfer-list-body-search-wrapper">
                <div><input placeholder="Search here" class="ant-input ant-transfer-list-search" type="text"
                            value="12131"/><a href="#" class="ant-transfer-list-search-action"><i
                  class="anticon anticon-cross-circle"></i></a></div>
              </div>
              <ul class="ant-transfer-list-content">


              </ul>
              <div class="ant-transfer-list-body-not-found">Not Found</div>
            </div>

          </div>
          <div class="ant-transfer-operation">
            <button disabled="" type="button" class="ant-btn ant-btn-primary ant-btn-sm"><i
              class="anticon anticon-left"></i><span>to left</span></button>
            <button disabled="" type="button" class="ant-btn ant-btn-primary ant-btn-sm"><i
              class="anticon anticon-right"></i><span>to right</span></button>
          </div>
          <div class="ant-transfer-list ant-transfer-list-with-footer" style="width: 250px; height: 300px;">
            <div class="ant-transfer-list-header"> </div>
            <div class="ant-transfer-list-body ant-transfer-list-body-with-search">
              <div class="ant-transfer-list-body-search-wrapper">
                <div><input placeholder="Search here" class="ant-input ant-transfer-list-search" type="text"
                            value="12312"/><a href="#" class="ant-transfer-list-search-action"><i
                  class="anticon anticon-cross-circle"></i></a></div>
              </div>
              <ul class="ant-transfer-list-content">

              </ul>
              <div class="ant-transfer-list-body-not-found">Not Found</div>
            </div>

          </div>
        </div>
`


/*let re = /class="([^"]+)"/g
let result = str.replace(re, function (str, $1) {
  let arr = $1.split(/\s+/);
  if (arr.length == 1) {
    return `className={styles["${arr[0]}"]}`
  }
  if (arr.length > 1) {
    return `className={${arr.map(v => {
      return `styles["${v}"]`
    }).join(",")}}`
  }
});
result = result.replace(/id="([^"]+)"/g, function (str, $1) {
  return `className={styles["id_${$1}"]}`
});
result = result.replace(/<(img|input)([^>]+?[\/]?)>/g, function (str, $1, $2) {
  return `<${$1}${$2}/>`;
});
result = result.replace(/style="([^"]+)"/g, function (str, $1) {
  let arr = $1.split(";");
  let style = arr.map(v => {
    if (!v)return false;
    let varr = v.split(":");
    let key = varr[0].replace(/-(\w)/g, function (str, $1) {
      return $1.toUpperCase();
    });
    return `${key}:"${varr[1]}"`;
  }).filter(v => v).join(",");
  return `style={{${style}}}`;
});
result = result.replace(/<!--[\s\S]*?-->/g, "\n");

result=result.replace(/<([^>]+?)([\/]?)>/g,function(str,$1,$2){
  let list=[];
  let result=$1.replace(/className=\{([^\}]+)\}/g,function(str,$1){
    list.push($1);
    return "";
  });
  if(list.length) {
    return `<${result} className={classnames(${list.join(",")})}${$2}>`;
  }else{
    return str;
  }
});
console.info(result)*/


/*
function b(){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
console.log("执行b")
      resolve();
    })
  }).then(()=>{
    new Promise((resolve,reject)=>{
      let tmp
      setTimeout(()=>{
        for(i=0;i<10;i++){
          let tmp=a(i)
        }
      },3000);
      if(tmp===9)
        resolve();
    }).then(()=>{
      console.log("b成功")
    })

  })
}
b()*/

/*

var val = 1;
function a(i){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      resolve();
    },3000);
  }).then(()=>{
    console.log("成功"+i)
    val++
  })
}

function step1(resolve, reject) {
  if (val >= 1) {
    resolve('执行B');
  } else if (val === 0) {
    reject(val);
  }
}

function step2(resolve, reject) {
  while(val<10)
  {
    console.log(val,'val')
    a(val)
  }
  if (val===10)
  resolve()
}

new Promise(step1).then(function(val){
  console.info(val);
  return new Promise(step2);
}).then(function(val){
  console.info("B执行完了");
})
*/
let  data ={a:"1"}
console.log(data,'data',data = {b:"1"})

