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
export async function getSecdictSyntree(params) {
    return request({
        url: '/gateway/secdictsyntree.json',
        method: 'POST',
        data: params,
    })
}
export async function getSecdictSyntreeson(params) {
    return request({
        url: '/gateway/secdictsyntree.json',
        method: 'POST',
        data: params,
    })
}
export async function SecdictAddType(params) {
    return request({
        url: '/gateway/secdictaddType.json',
        method: 'POST',
        data: params,
    })
}
export async function SecdictAddDict(params) {
    return request({
        url: '/gateway/secdictaddDict.json',
        method: 'POST',
        data: params,
    })
}
export async function SecdictDeltype(params) {
    return request({
        url: '/gateway/secdictdeltype.json',
        method: 'POST',
        data: params,
    })
}
export async function SecdictDel(params) {
    return request({
        url: '/gateway/secdictdel.json',
        method: 'POST',
        data: params,
    })
}
export async function SecdictLoadType(params) {
    return request({
        url: '/gateway/secdictloadtype.json',
        method: 'POST',
        data: params,
    })
}
export async function SecdictLoad(params) {
    return request({
        url: '/gateway/secdictload.json',
        method: 'POST',
        data: params,
    })
}
export async function SecdictTypeSave(params) {
    return request({
        url: '/gateway/secdicttypesave.json',
        method: 'POST',
        data: params,
    })
}
export async function SecdictSave(params) {
    return request({
        url: '/gateway/secdictsave.json',
        method: 'POST',
        data: params,
    })
}
export async function SecdictTreeDict(params) {
    return request({
        url: '/gateway/secdicttreedict.json',
        method: 'POST',
        data: params,
    })
}
export async function SecdictDictInfo(params) {
    return request({
        url: '/gateway/secdictdictInfo.json',
        method: 'POST',
        data: params,
    })
}
export async function SecdictDictTypeInfo(params) {
    return request({
        url: '/gateway/secdictdicttypeinfo.json',
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
