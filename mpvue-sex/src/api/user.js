import fetch from '@/utils/fetch'

/**
 * 查询当前登录用户
 */
export function getCurrCust(data) {
    return fetch({
        url: '/apps/qg/customer/getCurrCust',
        method: 'get',
        data: data
    })
}

/**
 * PC端模拟用户登录
 */
export function cusLogin(data) {
    return fetch({
        url: '/cusLogin',
        method: 'post',
        data: data
    })
}

/**
 * 发起微信的网页授权
 */
export function auth(data) {
    return fetch({
        url: '/weixin/auth',
        method: 'post',
        data: data
    })
}

