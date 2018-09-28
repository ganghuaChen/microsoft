import fetch from '@/utils/fetch'

/**
 * 查询全部情感导师
 */
export function queryQgTeacherAll(data) {
    return fetch({
        url: '/apps/qg/customer/qgTeacher/queryQgTeacherAll',
        method: 'get',
        data: data
    })
}


/**
 * 查询导师详情
 */
export function queryTeacherInfo(data) {
    return fetch({
        url: '/apps/qg/customer/qgTeacher/queryTeacherInfoById',
        method: 'post',
        data: data
    })
}

/**
 * 查询导师的文章信息
 * @params teacherId
 */
export function queryArticleByTeacherId(data) {
    return fetch({
        url: '/apps/qg/customer/qgTeacher/queryArticleByTeacherId',
        method: 'post',
        data: data
    })
}

/**
 * 关注导师
 * vId
 */
export function focusTeacher(data) {
    return fetch({
        url: '/apps/qg/customer/articleGz/add',
        method: 'post',
        data: data
    })
}

/**
 * 取消关注导师
 * vId
 */
export function unfocusTeacher(data) {
    return fetch({
        url: '/apps/qg/customer/articleGz/delArticleGz/',
        method: 'post',
        data: data
    })
}

/**
 * 查询是否已关注
 */
export function queryGzByVid(data) {
    return fetch({
        url: '/apps/qg/customer/articleGz/queryGzByVid',
        method: 'post',
        data: data
    })
}

/**
 * 查询已关注导师
 */
export function queryFocusTeacher(data) {
    return fetch({
        url: '/apps/qg/customer/articleGz/queryArticleGz',
        method: 'post',
        data: data
    })
}

