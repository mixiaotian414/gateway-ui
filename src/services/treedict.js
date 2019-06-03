import { request, config } from 'utils'

const { api } = config
const { secdictselect, validateVal } = api

export async function getSelectList(params) {
    return request({
        url: secdictselect,
        method: 'POST',
        data: params,
    })
}
export async function getTreeType(params) {
    return request({
        url: '/gateway/dicttreeselecttree.json',
        method: 'POST',
        data: params,
    })
}
export async function getTreeTypeSon(params) {
    return request({
        url: '/gateway/dicttreeselecttree.json',
        method: 'POST',
        data: params,
    })
}
export async function DictTreeAdd(params) {
    return request({
        url: '/gateway/dicttreeadd.json',
        method: 'POST',
        data: params,
    })
}
export async function DictTreeEdit(params) {
    return request({
        url: '/gateway/dicttreeedit.json',
        method: 'POST',
        data: params,
    })
}
export async function DictTreeSave(params) {
    return request({
        url: '/gateway/dicttreesave.json',
        method: 'POST',
        data: params,
    })
}
export async function DictTreeDel(params) {
    return request({
        url: '/gateway/dicttreedel.json',
        method: 'POST',
        data: params,
    })
}
export async function DictTreeInfo(params) {
    return request({
        url: '/gateway/dicttreeinfo.json',
        method: 'POST',
        data: params,
    })
}
export async function DictTreeTreeList(params) {
    return request({
        url: '/gateway/dicttreetreelist.json',
        method: 'POST',
        data: params,
    })
}
export async function onlyCheck(params) {
    return request({
        url: validateVal,
        method: 'POST',
        data: params,
    })
}
