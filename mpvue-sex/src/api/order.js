import fetch from '@/utils/fetch'

/**
 * 获取课程订单
 */
export function getCourseOrdered(data) {
    return fetch({
        url: '/apps/qg/customer/course/ordered/list',
        method: 'get',
        data: data
    })
}
