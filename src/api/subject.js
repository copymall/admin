import request from "../utils/request";

export function fetchListAll() {
    return request({
        url:'/subject/listAll',
        method:'get'
    });
}
