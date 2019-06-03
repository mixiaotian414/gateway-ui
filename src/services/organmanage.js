import { request, config } from 'utils'

export async function query (params) {
  return request({
    url: '/gateway/organizationusertree.json',
    method: 'post',
    data: params,
  })
}
export async function queryid (params) {
  return request({
    url: '/gateway/organizationload.json',
    method: 'POST',
    data: params,
  })
}
export async function del (params) {
  return request({
    url: '/gateway/organizationdelete.json',
    method: 'POST',
    data: params,
  })
}

export async function add (params) {
  return request({
    url: '/gateway/organizationadd.json',
    method: 'post',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: '/gateway/organizationsave.json',
    method: 'post',
    data: params,
  })
}

export async function queryPersonnel (params) {
  return request({
    url: '/gateway/organizationuserlist.json',
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
