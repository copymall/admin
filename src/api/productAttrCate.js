import request from "../utils/request";

export function fetchList(params) {
    return request({
        url: '/productAttribute/category/list',
        method:'get',
        params: params
    });
}

export function deleteProductAttrCate(id) {
    return request({
        url:'/productAttribute/category/delete/'+id,
        method:'get'
    });
}

export function createProductAttrCate(data) {
    return request({
       url:'/productAttribute/category/create',
        method:'post',
        data:data
    });
}

export function updateProductAttrCate(id, data) {
    return request({
        url:'/productAttribute/category/update/'+id,
        method:'post',
        data: data
    });
}
