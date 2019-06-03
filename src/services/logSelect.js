import {request,config} from 'utils'

const {api} =config
const {roleSetting} = api

export async function query (params) {
  return request({
    url:'/gateway/logshandleLog.json',
    method: 'post',
    data:params,
  })
}
export async function deleteLog (params) {
  return request({
    url: '/gateway/syslogDel.json',
    method: 'post',
    data: params,
  })
}
export async function queryid (params) {
  return request({
    url: 'gateway/roleinfo.json',
    method: 'post',
    data: params,
  })
}
export async function getSelectList(params) {
  return request({
    url: 'gateway/secdictselect.json',
    method: 'POST',
    data: params,
  })
}
