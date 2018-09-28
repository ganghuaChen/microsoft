<template>
    <div class="page-coupon-verify">
        <button class="verify-btn" @click="openScan" type="primary">开始核销</button>
        
        <div class="result" v-if="couponForm && couponForm.id">
            <!-- <icon type="success" size="40" color="green"/> -->
            <h1 class="title">核销信息如下</h1>
            <p class="row">id: <span class="value">{{couponForm.id}}</span></p>
            <p class="row">couponCode: <span class="value">{{couponForm.couponCode}}</span></p>
            <p class="row">customerId: <span class="value">{{couponForm.customerId}}</span></p>
        </div>
    </div>
</template>

<script>
import fly from '@/utils/fly'

export default{
    data(){
        return {
            
            hasLoad: false,
            couponForm: {},

        }
    },
    methods: {
        /**
         * 提交核销
         * @param  {[Object]} obj [description]
         */
        postVerify(obj){
            fly.post('/apps/jp/customer/coupon/verify', obj).then(rsp => {
                if(rsp.code === 200){
                    wx.showToast({
                        title: '核销成功',
                        icon: 'success',
                        duration: 3000
                    })
                }
            })
        },

        /**
         * 打开扫码
         */
        openScan(){
            let self = this
            wx.scanCode({
                onlyFromCamera: true,
                scanType: ['qrCode'],
                success: (res) => {
                    console.log(res)
                    console.log(res.result)
                    
                    const obj = JSON.parse(res.result)
                    self.couponForm = obj

                    if(obj.customerId){
                        self.postVerify(obj)
                    }else{
                        wx.showToast({
                            title: '非法二维码',
                            duration: 3000
                        })
                    }
                },
                fail: (err) => {
                    console.log(err)
                },
                complete: () => {

                }
            })
        }
    },
    mounted(){
        
    }
}
</script>

<style lang="less">
@import '~assets/less/color.less';
.page-coupon-verify{
    .verify-btn{
        margin: 10vh auto;
        width: 80%;
    }
    .result{
        padding: 0 10%;
        line-height: 2;
        color: #333;
        
        .title{
            margin: 10rpx 0;
            border-bottom: 6rpx solid @success;
            font-size: 18px;
        }
        .row{
            color: #999;
            .value{
                color: #000;
            }
        }
    }
}
</style>