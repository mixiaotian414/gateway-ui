import { request, config } from 'utils'
const { api } = config
const {testlist} = api

export async function modelinfo(params) {
  return request({
    url: '/gateway/modelinfo.json',
    method: 'post',
    data:params,
  })

}

export async function modelinfoadd(params) {
  return request({
    url: '/gateway/modelinfo.json',
    method: 'post',
    data:params,
  })

}

export async function modellinktablelist(params) {
  return request({
    url: '/gateway/modellinktablelist.json',
    method: 'post',
    data:params,
  })
}

export async function modeltableadd(params) {
  return request({
    url: '/gateway/modeltableadd.json',
    method: 'post',
    data:params,
  })
}

export async function modellinklist(params) {
  return request({
    url: '/gateway/modellinklist.json',
    method: 'post',
    data:params,
  })
}
export async function modelsave(params) {
  return request({
    url: '/gateway/modelsave.json',
    method: 'post',
    data: params,
  })
}

export async function modelupdate(params) {
  return request({
    url: '/gateway/modelsave.json',
    method: 'post',
    data: params,
  })
}

export async function modeldel(params) {
  return request({
    url: '/gateway/modeldel.json',
    method: 'post',
    data: params,
  })
}
export async function modeltabledel(params) {
  return request({
    url: '/gateway/modeltabledel.json',
    method: 'post',
    data: params,
  })
}
export async function modelcoldel(params) {
  return request({
    url: '/gateway/modelcoldel.json',
    method: 'post',
    data: params,
  })
}

export async function modelfromtablelist(params) {
  return request({
    url: '/gateway/modeltablelist.json',
    method: 'post',
    data: params,
  })
}
export async function modeltargettablelist(params) {
  return request({
    url: '/gateway/modeltablelist.json',
    method: 'post',
    data: params,
  })
}
export async function modelfcollist(params) {
  return request({
    url: '/gateway/modelcollist.json',
    method: 'post',
    data: params,
  })
}
export async function modeltcollist(params) {
  return request({
    url: '/gateway/modelcollist.json',
    method: 'post',
    data: params,
  })
}
export async function modelrelaadd(params) {
  return request({
    url: '/gateway/modelrelaadd.json',
    method: 'post',
    data: params,
  })
}
export async function modelrelationalinfo(params) {
  return request({
    url: '/gateway/modelrelationalinfo.json',
    method: 'post',
    data: params,
  })
}

export async function modelrelationalsave(params) {
  return request({
    url: '/gateway/modelrelationalsave.json',
    method: 'post',
    data: params,
  })
}

export async function modelrelationaldel(params) {
  return request({
    url: '/gateway/modelrelationaldel.json',
    method: 'post',
    data: params,
  })
}

export async function modelsyntree(params) {
  return request({
    url: '/gateway/modelsyntree.json',
    method: 'post',
    data: params,
  })
  /*return request({
    url:  '/api/v1/businesslist',
    method: 'GET',
    data:params,
  })*/
}
/*table col 属性树*/
export async function modeltabletree(params) {
  return request({
    url: '/gateway/modeltabletree.json',
    method: 'post',
    data: params,
  })
}
/*table col 属性编辑保存*/
export async function modelattrisave(params) {
  return request({
    url: '/gateway/modelattrisave.json',
    method: 'post',
    data: params,
  })
}
export async function modellinkcollist(params) {
  return request({
    url: '/gateway/modellinkcollist.json',
    method: 'post',
    data: params,
  })
}
export async function modelcoladd(params) {
  return request({
    url: '/gateway/modelcoladd.json',
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
