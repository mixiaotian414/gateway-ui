import {request,config} from 'utils'

const {api} =config

export async function query (params) {
  return request({
    url: '/gateway/notifylist.json',
    method: 'post',
    data:params,
  })
}
export async function deleteLog (params) {
  return request({
    url: '/gateway/notifydel.json',
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
