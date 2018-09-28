import fetch from '@/utils/fetch'

/**
 * jssdk
 */
export function getJssdkParams(data) {
    return fetch({
        url: '/weixin/getJssdkParams',
        method: 'post',
        data: data
    })
}
