import fetch from '@/utils/fetch'

/**
 * 上传图片
 */
export function uploadImage(data) {
    return fetch({
        url: '/upload/image',
        method: 'post',
        data: data
    })
}
