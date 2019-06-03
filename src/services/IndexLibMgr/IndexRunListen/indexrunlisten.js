import {request} from 'utils'

//查询列表
export async function query (params) {
  return request({
    url:  '/gateway/indexmonitoringlist.json',
    method: 'post',
    data:params,
  })
}
//添加跑数任务 运行
export async function indexRun(params) {
  return request({
    url: '/gateway/indexmonitoringrun.json',
    method: 'post',
    data:params,
  })
}
//指标重跑
export async function heavyRun(params) {
  return request({
    url: '/gateway/indexmonitoringrerun.json',
    method: 'post',
    data:params,
  })
}
//指标清除
export async function del(params) {
  return request({
    url: '/gateway/indexmonitoringclear.json',
    method: 'post',
    data:params,
  })
}
//获取跑批状态下拉列表
export async function getSelectList(params) {
  return request({
    url: 'gateway/secdictselect.json',
    method: 'POST',
    data: params,
  })
}

