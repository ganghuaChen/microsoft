import fly from '@/utils/fly'


export default function orderPay(orderId, productName){
    return new Promise(resolve => {
        fly.post('/apps/jp/customer/order/oaPay', {
            scene: 'shopping',
            orderId: orderId,
            productName: productName
        }).then(rsp => {
            resolve(rsp)
        })
    })
}
