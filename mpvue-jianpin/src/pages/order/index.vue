<template>
    <div class="page-order-center">
        <div class="order-tab">
            <div class="tab-item" 
                v-for="item in statusList" 
                v-if="item.value !== 'closed'"
                :key="item.value" 
                @tap="onSelectTab(item.value)"
                :class="{selected: status === item.value}">{{item.label}}</div>
        </div>
        <div class="order-tab-pane">
            <div v-if="dataList.length > 0 && hasLoad">
                <div class="order-item" v-for="(order, index1) in dataList" :key="index1">
                    <div class="order-hd">
                        订单编号：{{order.id}}
                        <span class="order-status">{{order.orderStatus}}</span>
                    </div>
                    <div class="order-bd">
                        <div class="good-item" v-for="(item, index2) in order.jpOrderItemList" :key="index2">
                            <div class="thumb">
                                <img :src="item.thumb" mode="aspectFit" class="thumb-img">
                            </div>
                            <div class="info">
                                <div class="good-name">{{item.goodsName}}</div>
                                <div class="good-price">
                                    <span class="text-primary">￥{{item.salePrice}}</span>
                                    <span class="num pull-right">x{{item.quantity}}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="order-ft">
                        <div class="ft-btn" v-if="order.orderStatus === '待付款'" @tap="onCancel(order.id)">取消订单</div>
                        <div class="ft-btn" v-if="order.orderStatus === '待付款'" @tap="onPay(order)">立即付款</div>
                    </div>
                </div>
            </div>
            <div class="empty-order" v-if="dataList.length === 0 && hasLoad">
                <img src="/static/images/emptyOrder.png" mode="aspectFit" class="image">
                无订单数据
            </div>
        </div>
    </div>
</template>


<script>
    // let appInstance = getApp()
import fly from '@/utils/fly'
import orderPay from '../commit/pay'
export default {
    data(){
        return {
            dataList: [],

            status: 'all',
            statusList: [
                {
                    label: '全部',
                    value: 'all'
                },
                {
                    label: '待付款',
                    value: 'ordered'
                },
                {
                    label: '待发货',
                    value: 'paid'
                },
                {
                    label: '待收货',
                    value: 'delivered'
                },
                {
                    label: '已取消',
                    value: 'closed'
                },
                {
                    label: '已完成',
                    value: 'completed'
                }
            ],
            reasonList: ['我不想买了', '信息填写错误，重新拍', '其他原因'],

            hasLoad: false
        }
    },
    methods: {
        getOrderList(orderStatus = ''){
            let _status = orderStatus === 'all' ? '' : orderStatus
            fly.post('/apps/jp/customer/order/list', {
                orderStatus: _status,
                pageSize: 999,
                tenantId: wx.getStorageSync('tenantId')
            },{
                headers: {
                    showLoading: true
                }
            }).then(rsp => {
                this.hasLoad = true
                if(rsp.code === 200 && rsp.data && rsp.data.list){
                    rsp.data.list.forEach((item, index) => {
                        this.statusList.forEach(s => {
                            if(s.value === item.orderStatus){
                                rsp.data.list[index].orderStatus = s.label
                            }
                        })
                    })
                    this.dataList = rsp.data.list
                }
            })
        },
        onSelectTab(val){
            this.status = val
            this.getOrderList(val)
        },

        onCancel(orderId){
            let self = this
            wx.showActionSheet({
                itemList: self.reasonList,
                success: function(res) {
                    fly.post('/apps/jp/customer/order/cancel', {
                        orderId: orderId,
                        reason: self.reasonList[res.tapIndex]
                    },{
                        header: {
                            showLoading: true
                        }
                    }).then(rsp => {
                        if(rsp.code === 200){
                            self.getOrderList(self.status)
                        }
                    })
                },
                fail: function(res) {
                    console.log(res.errMsg)
                }
            })
        },
        onPay(order){
            orderPay(order.id, order.jpOrderItemList[0].goodsName).then(rsp => {
                if(rsp.code === 200 && rsp.data){
                    let data = rsp.data
                    wx.requestPayment({
                        'timeStamp': data.timeStamp,
                        'nonceStr': data.nonceStr,
                        'package': data.pkg,
                        'signType': 'MD5',
                        'paySign': data.paySign,
                        'success':function(res){
                            wx.showToast({
                                title: '支付成功',
                                icon: 'success'
                            })
                            this.getOrderList()
                        },
                        'fail':function(res){
                            wx.showToast({
                                title: '支付失败',
                                icon: 'none'
                            })
                        }
                    })
                }
            })
        }
    },
    onShow(){
        let {status} = this.$root.$mp.query
        if(status){
            this.status = status
        }
        this.getOrderList(this.status)
    }
}
</script>

<style lang="less">
@import '~assets/less/color.less';
.page-order-center{
    min-height: 100vh;
    background-color: #f7f8f9;
    .order-tab{
        display: flex;
        align-items: center;
        background-color: #fff;
        .tab-item{
            padding: 0 30rpx;
            line-height: 100rpx;
            border-bottom: 1px solid transparent;
            &.selected{
                color: @primary;
                border-bottom: 1px solid @primary;
            }
        }
    }
    .order-tab-pane{
        .order-item{
            margin: 30rpx 0;
            font-size: 14px;
            background-color: #fff;
            .order-hd{
                padding: 0 30rpx;
                line-height: 100rpx;
                
                border-bottom: 1px solid #eee;
                .order-status{
                    float: right;
                    color: @primary;
                }
            }
            .order-bd{
                padding: 0 30rpx;
                border-bottom: 1px solid #eee;
                .good-item{
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid #eee;
                    &:last-child{
                        border-bottom: none;
                    }
                    .thumb{
                    padding: 20rpx 0;
                    .thumb-img{
                        display: block;
                        width: 160rpx;
                        height: 160rpx;
                    }
                    }
                    .info{
                    flex: 1;
                    padding: 0 30rpx;
                    .good-name{

                    }
                    .good-price{
                        margin-top: 20rpx;
                    }
                    }
                }
            }
            .order-ft{
                padding: 0 30rpx;
                text-align: right;
                .ft-btn{
                    display: inline-block;
                    margin: 20rpx 0 20rpx 20rpx;
                    padding: 10rpx 20rpx;
                    border: 1px solid #eee;
                    border-radius: 2px;
                }
            }
        }

        .empty-order{
            padding: 160rpx 0;
            text-align: center;
            color: #999;
            .image{
                display: block;
                margin: 30rpx auto;
                width: 300rpx;
                height: 192rpx;
            }
        }
    }
}
</style>
