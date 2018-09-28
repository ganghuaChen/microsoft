import fetch from '@/utils/fetch'

/**
 * 查询推荐课程
 */
export function queryTjCourse(size) {
    return fetch({
        url: '/apps/qg/customer/course/random/list/' + size,
        method: 'get'
    })
}

/**
 * 查询课程列表
 */
export function queryCourse(data){
    return fetch({
        url: '/apps/qg/customer/course/list',
        method: 'get',
        data: data,
        // headers: {
        //     showLoading: true
        // }
    })
}

/**
 * 查询课程详情
 */
export function courseDetail(courseId){
    return fetch({
        url: '/apps/qg/customer/course/detail/' + courseId,
        method: 'get'
    })
}

/**
 * 获取视屏播放地址
 */
export function playurl(mediaId){
    return fetch({
        url: '/apps/qg/customer/course/media/playurl/' + mediaId,
        method: 'post'
    })
}



