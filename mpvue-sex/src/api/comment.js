import fetch from '@/utils/fetch'

/**
 * 新增文章留言
 */
export function articleAaq(data) {
    return fetch({
        url: '/apps/qg/customer/articleAaq/addLy',
        method: 'post',
        data: data
    })
}

/**
 * 删除文章留言
 */
export function delArticleAaqByOpenid(data) {
    return fetch({
        url: '/apps/qg/customer/articleAaq/delArticleAaqByOpenid',
        method: 'post',
        data: data
    })
}

/**
 * 查询文章留言列表
 */
export function queryArticleAaqByArticleId(data) {
    return fetch({
        url: '/apps/qg/customer/articleAaq/queryArticleAaqByArticleId',
        method: 'post',
        data: data
    })
}

