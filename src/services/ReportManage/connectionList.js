import { request, config } from 'utils'
const { api } = config
const {testlist} = api
export async function query (params) {
  return request({
    url:  '/gateway/databaseinfo.json',
    method: 'post',
    data:params,
  })

}

export async function linkload(params) {
  return request({
    url:  '/gateway/databaseload.json',
    method: 'post',
    data:params,
  })
}
export async function linkAdd(params) {
  return request({
    url:  '/gateway/databaseadd.json',
    method: 'post',
    data:params,
  })
}
export async function linktablelist(params) {
  return request({
    url:  '/gateway/linktablelist.json',
    method: 'post',
    data:params,
  })
}
export async function linktableadd(params) {
  return request({
    url: '/gateway/linktableadd.json',
    method: 'post',
    data:params,
  })
}

export async function linksave(params) {
  return request({
    url: '/gateway/databasesave.json',
    method: 'post',
    data:params,
  })
}
export async function linkcheck(params) {
  return request({
    url: '/gateway/databasetest.json',
    method: 'post',
    data:params,
  })
}
export async function linktabledel(params) {
  return request({
    url: '/gateway/linktabledel.json',
    method: 'post',
    data:params,
  })
}
export async function linkdel(params) {
  return request({
    url: '/gateway/databasedel.json',
    method: 'post',
    data:params,
  })
}
export async function linkcoladd(params) {
  return request({
    url: '/gateway/coladd.json',
    method: 'post',
    data:params,
  })
}
export async function linkcoldel(params) {
  return request({
    url: '/gateway/coldel.json',
    method: 'post',
    data:params,
  })
}

export async function linksearchinfo(params) {
  return request({
    url: '/gateway/linksearchinfo.json',
    method: 'post',
    data:params,
  })
}

export async function linktabletree(params) {
  return request({
    url: '/gateway/linktabletree.json',
    method: 'post',
    data:params,
  })
}
export async function linkdbshow(params) {
  return request({
    url: '/gateway/linkdbshow.json',
    method: 'post',
    data:params,
  })
}
export async function linkpreview(params) {
  return request({
    url: '/gateway/linkpreview.json',
    method: 'post',
    data:params,
  })
}
export async function linkcount(params) {
  return request({
    url: '/gateway/linkcount.json',
    method: 'post',
    data:params,
  })
}
export async function linktablestructure(params) {
  return request({
    url: '/gateway/linktablestructure.json',
    method: 'post',
    data:params,
  })
}
export async function linkattrisave(params) {
  return request({
    url: '/gateway/attrisave.json',
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
