import { request, config } from 'utils'

export async function query (params) {
  return request({
    url: '/gateway/tablemodeltree.json',
    method: 'post',
    data: params,
  })
}
export async function queryid (params) {
  return request({
    url: '/gateway/tablemodelinfo.json',
    method: 'POST',
    data: params,
  })
}
export async function del (params) {
  return request({
    url: '/gateway/tablemodeltreedel.json',
    method: 'POST',
    data: params,
  })
}

export async function add (params) {
  return request({
    url: '/gateway/tablemodeltreeadd.json',
    method: 'post',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: '/gateway/tablemodelsave.json',
    method: 'post',
    data: params,
  })
}

export async function updatetree (params) {
  return request({
    url: '/gateway/tablemodeltreesave.json',
    method: 'post',
    data: params,
  })
}


export async function addModel (params) {
  return request({
    url: '/gateway/tablemodeladd.json',
    method: 'post',
    data: params,
  })
}
export async function deleteModal (params) {
  return request({
    url: '/gateway/tablemodeldel.json',
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
export async function getConList(params) {
  return request({
    url: 'gateway/gateway/databaseinfo.json',
    method: 'POST',
    data: params,
  })
}
export async function getModelTypeList(params) {
  return request({
    url: 'gateway/secdictselect.json',
    method: 'POST',
    data: params,
  })
}
