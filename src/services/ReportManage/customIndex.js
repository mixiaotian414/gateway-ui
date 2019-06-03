import {request,config} from 'utils'

const {api} =config


const pagecommen ={"PAGE_COND":{"LIMIT":5,"PAGENUM":1}}
export async function query (data) {
/*  let data ={
    ...params,
    ...pagecommen,
    "PARAMS":{"paraCode":"200005"}
  }
  return request({
    url:  '/api/v1/customIndex',
    method: 'get',
    data,
  })*/
  return request({
    url: '/gateway/deriveprodsearchlist.json',
    method: 'post',
    data,
  })
}
export async function getSelectList(params) {
  return request({
    url: 'gateway/secdictselect.json',
    method: 'POST',
    data: params,
  })
}
export async function querySelectTree (data) {
/*  let data ={
    ...params,
    ...pagecommen,
    "PARAMS":{"paraCode":"200005"}
  }*/
  return request({
    url:  '/gateway/deriveproddirtree.json',
    method: 'post',
    data,
  })
}

export async function create (data) {
  return request({
    url: '/gateway/deriveprodadd.json',
    method: 'post',
    data,
  })
}
export async function deriveprodupdate (data) {
  return request({
    url: '/gateway/deriveprodupdate.json',
    method: 'post',
    data,
  })
}

export async function remove (data) {
  return request({
    url: '/gateway/deriveproddelete.json',
    method: 'post',
    data,
  })
}

export async function prodcollect (data) {
  return request({
    url: '/gateway/prodcollect.json',
    method: 'post',
    data,
  })
}
export async function prodmove (data) {
  return request({
    url: '/gateway/deriveprodmove.json',
    method: 'post',
    data,
  })
}

export async function userBussList (data) {
  return request({
    url: '/gateway/systemuserBussList.json',
    method: 'post',
    data,
  })
}
