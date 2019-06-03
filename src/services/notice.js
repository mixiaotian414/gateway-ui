import {request,config} from 'utils'

const {api} =config

export async function query (params) {
  return request({
    url: '/gateway/notifypublist.json',
    method: 'post',
    data:params,
  })
}
export async function deleteLog (params) {
  return request({
    url: '/gateway/notifyupdate.json',
    method: 'post',
    data: params,
  })
}
export async function addNotice (params) {
  return request({
    url: '/gateway/notifypush.json',
    method: 'post',
    data: params,
  })
}
export async function addNoticeAll (params) {
  return request({
    url: '/gateway/notifypushall.json',
    method: 'post',
    data: params,
  })
}
export async function queryid (params) {
  return request({
    url: 'gateway/userlist.json',
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
