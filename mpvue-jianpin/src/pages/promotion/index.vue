<template>
    <div class="page-my-promotion">
        <div class="board">
            <div class="avatar">
                <open-data type="userAvatarUrl" lang="zh_CN" class="avatar-image"></open-data>
            </div>
            <div class="nickname">
                <open-data type="userNickName" lang="zh_CN"></open-data>
            </div>
        </div>
        <div class="dashboard">
            <div class="data-item item1">
                <div class="value">{{totalData.orderNum}}</div>
                <div class="label">分销订单</div>
            </div>
            <div class="data-item item2">
                <div class="value">{{totalData.totalCommission}}</div>
                <div class="label">佣金</div>
            </div>
            <div class="data-item item3">
                <div class="value">{{totalData.availableWithdraw}}</div>
                <div class="label">可提现</div>
                <div class="withdraw">提现</div>
            </div>
        </div>

        <div class="data-list">
            <div class="data-item" v-for="item in dataList" :key="item.id" v-if="item.payType !== 'free'" @tap="readDetail(item)">
                <div class="thumb">
                    <span class="type type1" v-if="item.type === 'activity'">活动</span>
                    <span class="type type2" v-if="item.type === 'product'">商品</span>
                    <img :src="item.thumb" class="thumb-img" mode="widthFix">
                </div>
                <div class="info">
                    <div class="name">{{item.name}}</div>
                    <div class="rate">
                        <!-- 佣金比例<span class="num">{{item.commission}}%</span> -->
                        <span>佣金<span class="text-primary">￥{{item.commission}}</span></span>
                    </div>
                    <div class="price">
                        <span class="num">￥{{item.price}}</span>
                        <span class="apply pull-right">{{item.buyerCount}}人购买</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import fly from '@/utils/fly'
export default {
    name: 'promotion',
    data() {
        return {
            dataList: [],
            totalData: {
                availableWithdraw : 0,
                orderNum : 0,
                totalCommission : 0
            }
        }
    },
    methods: {
        queryDataList(){
            fly.post('/apps/jp/customer/distribution/list', {
                pageSize: 10
            }).then(rsp => {
                if(rsp.data && rsp.data.list){
                    this.dataList = rsp.data.list
                }
            })
        },

        queryTotal(){
            fly.post('/apps/jp/customer/distribution/statistics').then(rsp => {
                if(rsp.code === 200){
                    this.totalData = rsp.data
                }
            })
        },

        /**
         *  查看活动详情 | 商品详情
         */
        readDetail(item) {
            if(item.type === 'product'){
                wx.navigateTo({
                    url: "../good/main?id=" + item.id
                })
            }else if(item.type === 'activity'){
                wx.navigateTo({
                    url: "../activity/main?id=" + item.id
                })
            }
        }

    },
    mounted() {
        this.queryTotal()
        this.queryDataList()
    }
}

</script>
<style lang="less">
@import "~assets/less/color.less";
.page-my-promotion {
    min-height: 100vh;
    background-color: #f7f8f9;
    .board{
        padding: 50rpx 0 70rpx;
        box-sizing: border-box;
        background: url("http://syb001-1253205801.file.myqcloud.com/test001/e5b3ba7e-241d-45f2-956d-be4d5d4a442f.png") center center no-repeat;
        background-size: cover;
        .avatar{
            .avatar-image{
                display: block;
                margin: 0 auto 5px;
                width: 140rpx;
                height: 140rpx;
                border-radius: 50%;
                border: 5rpx solid #fff;
                overflow: hidden;
                // box-shadow: 0 0 0 15px rgba(255,255,255,.5), 0 0 0 15px rgba(255,255,255,1);
            }
        }
        .nickname{
            text-align: center;
            font-size: 15px;
            color: #fff;
        }
    }
    
    .dashboard{
        display: flex;
        align-items: center;
        padding: 40rpx 0;
        background-color: #fff;
        .data-item{
            flex: 1;
            text-align: center;
            line-height: 1.8;
            border-right: 1px solid #eee;
            .value{
                font-size: 18px;
            }
            .label{
                color: #999;
                font-size: 12px;
            }
            .withdraw{
                width: 4em;
                margin: 10rpx auto 0;
                padding: 4rpx 0;
                border-radius: 30rpx;
                color: @warning;
                font-size: 12px;
                border: 1px solid @warning;
            }
            &::after{
                content: '';
                display: block;
                margin:0.8em auto 0;
                width: 2em;
                height: 1px;
                background-color: @success;
            }
            &.item1{
                &::after{
                    background-color: @success;
                }
            }
            &.item2{
                &::after{
                    background-color: @warning;
                }
            }
            &.item3{
                &::after{
                    display: none;
                    // background-color: @warning;
                }
            }
        }
    }

    .data-list{
        margin-top: 20rpx;
        padding: 0 20rpx;
        background-color: #fff;
        .data-item{
            display: flex;
            align-items: center;
            padding: 20rpx 0;
            font-size: 14px;
            border-bottom: 1px solid #eee;
            .thumb{
                width: 200rpx;
                height: 200rpx;
                overflow: hidden;
                position: relative;
                .thumb-img{
                    display: block;
                    width: 100%;
                    height: 100% !important;
                }
                .type{
                    position: absolute;
                    top: -12px;
                    left: -54px;
                    padding: 40rpx 100rpx 5rpx;
                    transform: rotate(-45deg);
                    color: #fff;
                    font-size: 13px;
                    white-space: nowrap;
                    background-color: @warning;
                    &.type1{
                        background-color: #f38f3d;
                    }
                    &.type2{
                        background-color: #7bd86b;
                    }
                }
            }
            .info{
                flex: 1;
                margin-left: 20rpx;
                line-height: 1.6;
                min-width: 0;
                .name{
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                .rate{
                    margin: 20rpx 0;
                    font-size: 85%;
                    color:#999;
                    text-align: left;
                    .num{
                        color: #333;
                    }
                }
                .price{
                    .num{
                        font-size: 125%;
                        color: @primary;
                    }
                    .apply{
                        margin-top: 14rpx;
                        font-size: 12px;
                        color: #999;
                    }
                }
            }
        }
    }
}

</style>
