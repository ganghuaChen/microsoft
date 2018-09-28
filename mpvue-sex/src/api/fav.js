import fetch from '@/utils/fetch'

/**
 * 收藏文章
 */
export function articleLike(data) {
    return fetch({
        url: '/apps/qg/customer/articleLike/add',
        method: 'post',
        data: data
    })
}

/**
 * 我的收藏文章列表
 */
export function queryMyArticleLike(data) {
    return fetch({
        url: '/apps/qg/customer/articleLike/queryMyArticleLike',
        method: 'get',
        data: data
    })
}

/**
 * 取消收藏文章
 */
export function delArticleLike(data) {
    return fetch({
        url: '/apps/qg/customer/articleLike/delArticleLike',
        method: 'post',
        data: data
    })
}

/**
 * 查询文章是否被某用户收藏
 * @params articleId
 */
export function queryArticleLike(data) {
    return fetch({
        url: '/apps/qg/customer/articleLike/queryArticleLike',
        method: 'post',
        data: data
    })
}



