import {request} from 'utils'

export async function indextree (params) {
  return request({
    url:  '/gateway/indexindextree.json',
    method: 'post',
    data:params,
  })
}
export async function indexdimension (params) {
  return request({
    url:  '/gateway/indexquerydimension.json',
    method: 'post',
    data:params,
  })
}
export async function collectiontree (params) {
  return request({
    url:  '/gateway/indexquerytree.json',
    method: 'post',
    data:params,
  })
}
export async function createDir (params) {
  return request({
    url:  '/gateway/indexquerytreeadd.json',
    method: 'post',
    data:params,
  })
}
export async function updateDir (params) {
  return request({
    url:  '/gateway/indexquerytreesave.json',
    method: 'post',
    data:params,
  })
}
export async function delDir (params) {
  return request({
    url:  '/gateway/indexquerytreedel.json',
    method: 'post',
    data:params,
  })
}
export async function delReport (params) {
  return request({
    url:  '/gateway/indexquerydel.json',
    method: 'post',
    data:params,
  })
}
export async function indexcollection (params) {
  return request({
    url:  '/gateway/indexquerycollect.json',
    method: 'post',
    data:params,
  })
}

export async function query (params) {
  return request({
    url:  '/gateway/indexqueryquery.json',
    method: 'post',
    data:params,
  })
}

export async function create(params) {
  return request({
    url: '/gateway/indexindextree.json',
    method: 'POST',
    data:params,
  })
}
export async function getSelectList(params) {
  return request({
    url: '/gateway/secdictselect.json',
    method: 'POST',
    data: params,
  })
}
export async function dataview(params) {
  return request({
    url: '/gateway/dimensionview.json',
    method: 'POST',
    data: params,
  })
}
export async function LoadReport(params) {
  return request({
    url: '/gateway/exportexcel.expt',
    method: 'postfile',
    data: params,
  })
}

