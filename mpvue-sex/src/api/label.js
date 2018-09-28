import fetch from '@/utils/fetch'

/**
 * 查询全部标签
 */
export function queryLableAll(data) {
    return fetch({
        url: '/apps/qg/customer/customerExt/queryArticle',
        method: 'post',
        data: data
    })
} 
 

