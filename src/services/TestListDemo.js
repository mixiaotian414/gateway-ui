import {request} from 'utils'

export async function query (params) {
  return request({
    url:  '/gateway/demolist.json',
    method: 'post',
    data:params,
  })
}

export async function getSelectList(params) {
  return request({
    url: 'gateway/secdictselect.json',
    method: 'POST',
    data: params,
  })
}

export async function queryid (params) {
  return request({
    url: '/gateway/demoload.json',
    method: 'POST',
    data: params,
  })
}
export async function del (params) {
  return request({
    url: '/gateway/demodel.json',
    method: 'POST',
    data: params,
  })
}

export async function add (params) {
  return request({
    url: '/gateway/demoadd.json',
    method: 'post',
    data: params,
  })
}
export async function update (params) {
  return request({
    url: '/gateway/demosave.json',
    method: 'post',
    data: params,
  })
}
