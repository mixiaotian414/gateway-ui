import {request} from 'utils'

export async function query (params) {
  return request({
    url:  '/gateway/dimensionlist.json',
    method: 'post',
    data:params,
  })
}

export async function datasource(params) {
  return request({
    url: '/gateway/databaseinfo.json',
    method: 'post',
    data:params,
  })
}
export async function dimensiontable(params) {
  return request({
    url: '/gateway/tablemodelselecttable.json',
    method: 'post',
    data:params,
  })
}
export async function dimensionvalue(params) {
  return request({
    url: '/gateway/tablemodelresult.json',
    method: 'post',
    data:params,
  })
}

export async function update(params) {
  return request({
    url: '/gateway/dimensionsave.json',
    method: 'post',
    data:params,
  })
}
export async function create(params) {
  return request({
    url: '/gateway/dimensionadd.json',
    method: 'post',
    data:params,
  })
}
export async function del(params) {
  return request({
    url: '/gateway/dimensiondel.json',
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
export async function dataview(params) {
  return request({
    url: 'gateway/dimensionview.json',
    method: 'POST',
    data: params,
  })
}
