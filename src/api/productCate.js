import request from "../utils/request";

export function fetchListWithChildren() {
    return request({
        url:'/productCategory/list/withChildren',
        method:'get'
    })
}

export function fetchList(parentId, params) {
    return request({
        url:'/productCategory/list/'+parentId,
        method:'get',
        params:params
    })
}

export function updateNavStatus(data) {
    return request({
        url:'/productCategory/update/navStatus',
        method:'post',
        data:data
    })
}

export function updateShowStatus(data) {
    return request({
        url:'/productCategory/update/showStatus',
        method:'post',
        data:data
    })
}

export function deleteProductCate(id) {
    return request({
        url:'/productCategory/delete/'+id,
        method:'post'
    })
}
