import {request,config} from 'utils'

const {api} =config


const pagecommen ={"PAGE_COND":{"LIMIT":5,"PAGENUM":1}}
export async function querynosum (params) {
  return request({
    url:  '/gateway/derivedatanosum.json',
    method: 'post',
    data:params,
  })
}
export async function querysumbybranch (params) {
  return request({
    url:  '/gateway/derivedatasumbybranch.json',
    method: 'post',
    data:params,
  })
}
export async function querysumbydate (params) {
  return request({
    url:  '/gateway/derivedatasumbydate.json',
    method: 'post',
    data:params,
  })
}

export async function create (params) {
  return request({
    url:  '/gateway/reportadd.json',
    method: 'post',
    data:params,
  })
}

export async function queryProductLev (data) {


  return request({
    url: '/gateway/secdictselect.json',
    method: 'post',
    data,
  })
}
