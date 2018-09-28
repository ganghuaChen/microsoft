
import fetch from '@/utils/fetch'

/**
 * 推广者提现
 */
export function saveWithdrawCash(data) {
    return fetch({
        url: '/apps/qg/distribution/customer/saveWithdrawCash',
        method: 'post',
        data: data
    })
}