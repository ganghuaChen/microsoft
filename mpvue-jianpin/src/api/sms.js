import fly from '@/utils/fly'
export function smscode(phoneNo){
    return new Promise(resolve => {
        fly.post('/shortmessage/send', {
            templateId: '007',
            channel: '3000001',
            phoneNo: phoneNo,
        }).then(rsp => {
            resolve(rsp)
        })
    })
}
