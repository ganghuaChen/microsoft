<template>
    <div class="page-center">
        <div class="board">
            <div class="avatar">
                <open-data type="userAvatarUrl" lang="zh_CN" class="avatar-image"></open-data>
            </div>
            <div class="nickname">
                <open-data type="userNickName" lang="zh_CN"></open-data>
            </div>
        </div>

        <div class="app-order">
            <h4 class="order-title" @tap="goOrderCenter('all')">我的订单 <i class="iconfont icon-arr-right pull-right"></i></h4>
            <div class="order-tab">
                <div class="tab-item" @tap="goOrderCenter('ordered')"><i class="iconfont icon-qianbao"></i> 待付款</div>
                <div class="tab-item" @tap="goOrderCenter('paid')"><i class="iconfont icon-fahuo"></i> 待发货</div>
                <div class="tab-item" @tap="goOrderCenter('delivered')"><i class="iconfont icon-huoka"></i> 待收货</div>
                <!-- <div class="tab-item" @tap="goOrderCenter('all')"><i class="iconfont icon-shouhou"></i> 售后服务</div> -->
            </div>
        </div>

        <div class="menu-list">
            <div class="menu-item" @tap="gogogo('../address/main?from=center')">
                <i class="iconfont icon-address"></i> 地址管理 <i class="iconfont icon-arr-right pull-right"></i>
            </div>
            <div class="menu-item" @tap="gogogo('../myActivity/main')">
                <i class="iconfont icon-group"></i> 我的活动 <i class="iconfont icon-arr-right pull-right"></i>
            </div>
            <div class="menu-item" @tap="gogogo('../coupon/main')">
                <i class="iconfont icon-coupon-center"></i> 领券中心 <i class="iconfont icon-arr-right pull-right"></i>
            </div>
            <div class="menu-item" @tap="gogogo('../myCoupon/main')">
                <i class="iconfont icon-my-coupon"></i> 我的优惠券 <i class="iconfont icon-arr-right pull-right"></i>
            </div>
            <div class="menu-item" @tap="gogogo('../promotion/main')">
                <i class="iconfont icon-fenxiao"></i> 我的分销 <i class="iconfont icon-arr-right pull-right"></i>
            </div>
        </div>

        <div class="menu-list" v-if="userInfo.isCouponChecker">
            <div class="menu-item" @tap="gogogo('../couponVerify/main')">
                <i class="iconfont icon-scan"></i> 核销优惠券 <i class="iconfont icon-arr-right pull-right"></i>
            </div>
        </div>
        
        <support></support>
    </div>
</template>
<script>
import support from '@/components/support'
import fly from '@/utils/fly'

export default {
    components: {
        support
    },
    data() {
        return {
            userInfo: {
                isCouponChecker: false
            }
        }
    },
    methods: {
        // getUserInfo() {
        //     try {
        //         var userInfo = wx.getStorageSync('userInfo')
        //         if (userInfo) {
        //             this.userInfo = userInfo
        //         }
        //     } catch (e) {
        //         console.log(e)
        //     }
        // },

        gogogo(url){
            wx.navigateTo({
                url: url
            })
        },

        goOrderCenter(status){
            wx.navigateTo({
                url: "../order/main?status=" + status
            })
        },

        getUserInfo(){
            fly.get('/apps/jp/customer/getCurrCust').then(rsp => {
                this.userInfo = rsp.data
            })
        }
    },
    mounted() {
        this.getUserInfo()
    }
}

</script>
<style lang="less">
@import "~assets/less/color.less";
.page-center {
    min-height: 100vh;
    background-color: #f7f8f9;
    .board{
        padding: 50rpx 0 70rpx;
        box-sizing: border-box;
        background: url("http://syb001-1253205801.file.myqcloud.com/test001/76954ebb-ff4b-49b8-8f96-1647263374b7.png") center center no-repeat;
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
            }
        }
        .nickname{
            text-align: center;
            font-size: 15px;
            color: #fff;
        }
    }

    .app-order{
        margin-top: -40rpx;
        background-color: #fff;
        border-radius: 40rpx 40rpx 0 0;
        .order-title{
            padding: 0 30rpx;
            line-height: 100rpx;
            border-bottom: 1px solid #eee;
        }
        .order-tab{
            display: flex;
            align-items: center;
            padding: 30rpx 0;
            .tab-item{
                flex: 1;
                text-align: center;
                font-size: 14px;
                color: #666;
                .iconfont{
                    font-size: 32px;
                    color: #666;
                }
            }
        }
    }

    .menu-list{
        margin: 20rpx 0;
        background-color: #fff;
        .menu-item{
            padding: 0 40rpx;
            line-height: 120rpx;
            border-bottom: 1px solid #eee;
            .iconfont{
                display: inline-block;
                vertical-align: middle;
                
                &.icon-address{
                    position: relative;
                    top: -2px;
                    font-size: 22px;
                    color: #409EFF;
                }
                &.icon-group{
                    position: relative;
                    top: -2px;
                    font-size: 22px;
                    color: @warning;
                }
                &.icon-coupon-center{
                    position: relative;
                    top: -2px;
                    font-size: 22px;
                    color: @purple;
                }
                &.icon-my-coupon{
                    position: relative;
                    top: -2px;
                    font-size: 22px;
                    color: @danger;
                }
                &.icon-scan{
                    position: relative;
                    top: -2px;
                    color: @warning;
                    font-size: 18px;
                    font-weight: bold;
                }
                &.icon-fenxiao{
                    position: relative;
                    top: -2px;
                    color: @success;
                    font-size: 18px;
                    font-weight: bold;
                }
            }
            &:last-child{
                border-bottom: none;
            }
        }
    }
}

</style>
