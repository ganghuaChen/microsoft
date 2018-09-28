<template>
    <div class="page-user-auth">
        <div class="product">
            <img src="/static/images/logo.png" class="product-logo">
        </div>
        <div class="message">
            <h4 class="title">申请获取以下权限</h4>
            <p class="text">获取您的公开信息（昵称、头像等）</p>
        </div>
        <div class="handle">
            <button open-type="getUserInfo" type="warn" @getuserinfo="onGetUserInfo">确认授权</button>
        </div>
    </div>
</template>
<script>
import fly from '@/utils/fly'
export default {
    data() {
        return {

        }
    },
    methods: {
        onGetUserInfo(data) {
            let _info = data.mp.detail.userInfo
            console.log(data.mp.detail)
            
            try {
                // wx.setStorageSync('userInfo', _info)
                  
                fly.post('/miniprogram/saveUserInfo', data.mp.detail).then(rsp => {
                    if(rsp.code === 200){
                        fly.get('/apps/jp/customer/getCurrCust').then(rsp => {
                          if(rsp.code === 200){
                            wx.setStorageSync('userInfo', rsp.data)
                          }
                        })
                        wx.navigateBack()
                    }
                })
            } catch (e) {
                console.log(e)
            }
        }
    },
    onShow() {

    }
}

</script>
<style lang="less">
@import '~assets/less/color.less';
.page-user-auth {
    .product{
        margin: 10vh auto;
        .product-logo{
            display: block;
            margin: 0 auto;
            width: 40px;
            height: 40px;
        }
    }
    .message{
        margin: 10%;
        padding: 40rpx 0;
        line-height: 2;
        border-top: 1px solid #ccc;
        .title{
            font-size: 18px;
            color: #000;
        }
        .text{
            font-size: 14px;
            color: #707070;
        }
    }
    .handle{
        padding: 0 10%;
        button{

        }
    }
}

</style>
