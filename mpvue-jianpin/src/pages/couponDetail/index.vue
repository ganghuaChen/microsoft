<template>
    <div class="page-coupon-detial" v-if="hasLoad">
            <div class="coupon-card">
                <div class="main">
                    <p class="name">{{detail.name}}</p>
                    <div class="price">
                        <div class="left">￥<span class="num">{{detail.amountOff}}</span></div>
                        <div class="right">
                            <p v-if="detail.amountFull">满{{detail.amountFull}}元使用</p>
                            <p>适用范围：{{detail.productScopeText}}</p>
                        </div>
                    </div>
                </div>
                <div class="addon">
                    <div class="text-row">
                        <div class="label">券&ensp;名&ensp;称</div>
                        <div class="value">{{detail.name}}</div>
                    </div>
                    <div class="text-row">
                        <div class="label">券&emsp;&emsp;号</div>
                        <div class="value">{{detail.couponCode}}</div>
                    </div>
                    <div class="text-row">
                        <div class="label">有&ensp;效&ensp;期</div>
                        <div class="value">{{detail.timeBegin}} 至 {{detail.timeEnd}}</div>
                    </div>
                    <div class="text-row">
                        <div class="label">使用规则 </div>
                        <div class="value">{{detail.usageRules}}</div>
                    </div>
                </div>
            </div>
            <div class="coupon-qrcode" v-if="qrcodeVisible">
                <h1 class="title">核销二维码</h1>
                <canvas class="qrcode-canvas" style="width: 300px; height: 300px;" canvas-id="couponQrocde"></canvas>
                <h5 class="note">付款时请出示该二维码<br>可抵扣部分费用</h5>
            </div>
    </div>
</template>

<script>
import drawQrcode from 'utils/weapp.qrcode.esm.js'
import fly from '@/utils/fly'

export default{
    data(){
        return {
            couponId: '',
            detail: {},
            hasLoad: false,
            qrcodeVisible: false
        }
    },
    methods: {
        getCouponDetail(){
            this.hasLoad = false
            fly.get('/apps/jp/customer/coupon/myown/detail/' + this.couponId).then(rsp => {
                this.hasLoad = true
                let data = rsp.data
                let userId = wx.getStorageSync('userId')
                if(data.productScope === 'O'){
                    this.qrcodeVisible = true
                    console.log(`{"id": "${data.id}", "couponCode": "${data.couponCode}", "customerId": "${userId}"}`)
                    drawQrcode({
                        width: 300,
                        height: 300,
                        canvasId: 'couponQrocde',
                        text: `{"id": "${data.id}", "couponCode": "${data.couponCode}", "customerId": "${userId}"}`
                    })
                }

                data.productScopeText = this.filterScope(data.productScope)
                data.timeBegin = data.timeBegin.split(' ')[0]
                data.timeEnd = data.timeEnd.split(' ')[0]
                this.detail = data
            })
        },

        filterScope(scope){
            let dict = {
                'A': '全场商品',
                'S': '指定商品',
                'O': '线下'
            }
            return dict[scope]
        }
    },
    mounted(){
        
    },
    onShow(){
        this.qrcodeVisible = false
    },
    onLoad(options){
        console.log(options.id)
        this.couponId = options.id
        this.getCouponDetail()
    }
}
</script>

<style lang="less">
@import '~assets/less/color.less';
.page-coupon-detial{
    min-height: 100vh;
    box-sizing: border-box;
    background-color: #f7f6fb;
    .coupon-card{
        margin-bottom:30rpx;
        font-size: 14px;
        
        .main{
            line-height: 2;
            padding: 30rpx;
            line-height: 1;
            color: #fff;
            background-color: @primary;
            position: relative;
            &:after{
                content: '';
                position: absolute;
                left: 10rpx;
                right: 10rpx;
                bottom: -6rpx;
                border-bottom: 12rpx dotted #fff;
            }
            .name{

            }
            .price{
                display: flex;
                align-items: center;
                line-height: 1.6;
                margin: 10rpx 0;
                .left{
                    .num{
                        font-size: 300%;
                        font-weight: bold;
                    }
                }
                .right{
                    flex: 1;
                    margin-left: 20rpx;
                }
            }
        }
        .addon{
            padding: 40rpx;
            font-size: 28rpx;
            line-height: 2;
            background-color: #fff;
            .text-row{
                display: flex;
                .label{
                    color: #999;
                    width: 5em;
                    text-align: justify;
                }
                .value{
                    flex: 1;
                    color: #333;
                }
            }
        }
    }
    .coupon-qrcode{
        padding: 40rpx 0 100rpx;
        text-align: center;
        .title{
            font-weight: bold;
        }
        .note{
            font-size: 26rpx;
            color: #999;
        }
        .qrcode-canvas{
            display: block;
            margin: 40rpx auto;
        }
    }
}
</style>