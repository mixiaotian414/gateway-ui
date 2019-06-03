import {request,config} from 'utils'

const {api} =config


const pagecommen ={"PAGE_COND":{"LIMIT":5,"PAGENUM":1}}
export async function query (data) {
/*  let data ={
    ...params,
    ...pagecommen,
    "PARAMS":{"paraCode":"200005"}
  }*/

  return request({
    url: '/gateway/reportsearchlist.json',
    method: 'post',
    data,
  })
}
export async function queryProductLev (data) {


  return request({
    url: '/gateway/secdictselect.json',
    method: 'post',
    data,
  })
}
export async function querySelectTree (data) {

  return request({
    url: '/gateway/basicprodsynctree.json',
    method: 'post',
    data,
  })
}

export async function create (data) {

  return request({
    url: '/gateway/reportadd.json',
    method: 'post',
    data,
  })
}

export async function reportdelete (data) {

  return request({
    url: '/gateway/reportdelete.json',
    method: 'post',
    data,
  })
}

export async function reportupdate (data) {

  return request({
    url: '/gateway/reportupdate.json',
    method: 'post',
    data,
  })
}

export async function reportproddelete (data) {

  return request({
    url: '/gateway/reportproddelete.json',
    method: 'post',
    data,
  })
}
