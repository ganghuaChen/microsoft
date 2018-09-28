import fly from '@/utils/fly'


export default function activityPay(orderId, productName){
    return new Promise(resolve => {
        fly.post('/apps/jp/customer/order/oaPay', {
            scene: 'actSignUp',
            orderId: orderId,
            productName: productName
        }).then(rsp => {
            resolve(rsp)
        })
    })
}
