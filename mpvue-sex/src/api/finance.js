import fetch from '@/utils/fetch'

/**
 * 推广者资产统计
 */
export function assetStats(data) {
    return fetch({
        url: '/apps/qg/customer/finance/assetStats',
        method: 'post',
        data: data
    })
}

/**
 * 推广者收益明细
 */
export function getDpIncomePage(data) {
    return fetch({
        url: '/apps/qg/customer/finance/getDpIncomePage',
        method: 'post',
        data: data
    })
}

/**
 * 提现申请列表
 */
export function withdrawList(data) {
    return fetch({
        url: '/apps/qg/customer/withdraw/list',
        method: 'post',
        data: data
    })
}

/**
 * 发起提现申请
 */
export function withdrawApply(data) {
    return fetch({
        url: '/apps/qg/customer/withdraw/apply',
        method: 'post',
        data: data
    })
}
