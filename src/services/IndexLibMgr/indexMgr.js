import { request, config } from 'utils'

export async function query (params) {
  return request({
    url: '/gateway/indextree.json',
    method: 'post',
    data: params,
  })
}
export async function queryid (params) {
  return request({
    url: '/gateway/indexlist.json',
    method: 'POST',
    data: params,
  })
}
export async function del (params) {
  return request({
    url: '/gateway/indextreedel.json',
    method: 'POST',
    data: params,
  })
}

export async function add (params) {
  return request({
    url: '/gateway/indexaddtree.json',
    method: 'post',
    data: params,
  })
}
export async function toupdate (params) {
  return request({
    url: '/gateway/indexload.json',
    method: 'post',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: '/gateway/indexsave.json',
    method: 'post',
    data: params,
  })
}

export async function updatetree (params) {
  return request({
    url: '/gateway/indextreesave.json',
    method: 'post',
    data: params,
  })
}


export async function addModel (params) {
  return request({
    url: '/gateway/indexadd.json',
    method: 'post',
    data: params,
  })
}
export async function deleteModal (params) {
  return request({
    url: '/gateway/indexdel.json',
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
export async function getIndexType(params) {
  return request({
    url: 'gateway/secdictselect.json',
    method: 'POST',
    data: params,
  })
}
export async function getFrequency(params) {
  return request({
    url: 'gateway/secdictselect.json',
    method: 'POST',
    data: params,
  })
}
export async function getunit(params) {
  return request({
    url: 'gateway/secdictselect.json',
    method: 'POST',
    data: params,
  })
}
export async function indexpublish(params) {
  return request({
    url: 'gateway/indexpublish.json',
    method: 'POST',
    data: params,
  })
}
