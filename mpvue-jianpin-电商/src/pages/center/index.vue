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
            <div class="menu-item" @tap="goToAddress">
                <i class="iconfont icon-address"></i> 地址管理 <i class="iconfont icon-arr-right pull-right"></i>
            </div>
        </div>
        
        <support></support>
    </div>
</template>
<script>
import support from '@/components/support'
export default {
    components: {
        support
    },
    data() {
        return {
            userInfo: {}
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

        goToAddress(){
            wx.navigateTo({
                url: "../address/main?from=center"
            })
        },

        goOrderCenter(status){
            wx.navigateTo({
                url: "../order/main?status=" + status
            })
        }
    },
    created() {
        // this.getUserInfo()
    }
}

</script>
<style lang="less">
.page-center {
    min-height: 100vh;
    background-color: #f7f8f9;
    .board{
        padding: 60rpx 0;
        box-sizing: border-box;
        background: url("http://jianpin-xiaocx-image-bucket.oss-cn-beijing.aliyuncs.com/2017/11/images/centerbg.png") center center no-repeat;
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
        }
    }

    .app-order{
        background-color: #fff;
        .order-title{
            padding: 0 40rpx;
            line-height: 120rpx;
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
        margin: 40rpx 0;
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
            }
            &:last-child{
                border-bottom: none;
            }
        }
    }
}

</style>
