import fetch from '@/utils/fetch'

/**
 * 查询推荐文章
 */
export function queryTjArticle(data) {
    return fetch({
        url: '/apps/qg/customer/article/queryTjArticle',
        method: 'post',
        data: data
    })
}

/**
 * 查询文章所关联的课程
 * @params articleId
 */
export function queryArticleCourse(data) {
    return fetch({
        url: '/apps/qg/customer/article/queryArticleCourse',
        method: 'post',
        data: data
    })
}


/**
 * 查询文章栏目列表
 */
export function queryArticleClass(data) {
    return fetch({
        url: '/apps/qg/customer/articleClass/queryArticleClass',
        method: 'post',
        data: data
    })
}

/**
 * 查询文章栏目对应下面的文章列表
 */
export function queryArticleByClassId(articleClassId, data) {
    return fetch({
        url: '/apps/qg/customer/articleClass/queryArticleByClassId/' + articleClassId,
        method: 'post',
        data: data
    })
}
