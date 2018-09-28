import fetch from '@/utils/fetch'

/**
 * 购买课程
 */
export function oaPay(data) {
    return fetch({
        url: '/apps/qg/customer/order/oaPay',
        method: 'post',
        data: data
    })
}
