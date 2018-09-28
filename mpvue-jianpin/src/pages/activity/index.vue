<template>
    <div class="page-activity-detail" v-if="isLoaded">
        <div class="activity-banner">
            <!-- 轮播图 -->
            <image v-if="detail.mediaType == 0" :src="detail.carouselUrl" class="banner-image" mode="widthFix" />
            
            <!-- 视频介绍 activityVideo-->
            <video v-if="detail.mediaType == 1" class="activity-video" :src="activityVideo" controls  objectFit="fill"></video>
        </div>

        <!-- 活动价格信息 -->
        <div class="activity-info">
            <div class="activity-name">{{detail.actName}}</div>
            <div class="activity-price">
                <span class="price" v-if="detail.payType === 'free'">免费</span>
                <span class="price" v-if="detail.payType !== 'free'">
                    ￥{{detail.price}} &ensp;<span class="origin">￥{{detail.oldPrice}}</span>
                    <span class="tag" v-if="detail.payType === 'prepaid'">预付全款</span>
                    <span class="tag" v-if="detail.payType === 'deposit'">预付订金</span>
                </span>
            </div>
            <div class="activity-count">共<span class="num">{{detail.num}}</span>个名额, 已报名<span class="num">{{detail.applyNum}}</span></div>
            <div class="activity-time">活动时间 <span class="time">{{detail.startTime}} ~ {{detail.endTime}}</span></div>
        </div>

        <div class="activity-detail">
            <div class="title">活动详情</div>
            <div class="detail-desc">
                {{detail.actDetail}}
            </div>
        </div>
        
        <!-- 报名信息窗口 -->
        <div class="dialog-apply-form" v-if="applyVisible">
            <div class="dialog-mask" @tap="closeApply"></div>
            <div class="dialog-content">
                <div class="title">填写报名信息</div>
                <div class="form">
                    <input type="text" v-model="applyForm.name" placeholder="姓名">
                    <div class="sms-input">
                        <input type="tel" v-model="applyForm.phone" placeholder="手机号码">
                        <button size="mini" @tap="onSendSms" :disabled="!smsSendAble">{{smsBtnText}}</button>
                    </div>
                    <input type="tel" v-model="applyForm.ext1" placeholder="短信验证码">
                    <input type="text" v-model="applyForm.remark" placeholder="备注说明">
                </div>
                <div class="handle">
                    <button class="cancel" size="mini" @tap="closeApply">取消</button>
                    <button class="submit" size="mini" @tap="applyNow">提交</button>
                </div>
            </div>
        </div>
        
        <!-- 立即购买 -->
        <div class="bottom-handle" v-if="applyAble">
            <div class="btn btn-kefu" @tap="call">
                <i class="iconfont icon-kefu"></i>
            </div>
            
            <div class="btn btn-buy" @tap="openApply">
                立即报名
            </div>
        </div>
    </div>
</template>
<script>
import store from 'store'
import fly from '@/utils/fly'
import activityPay from './pay'
import {smscode} from 'api/sms'
export default {
    data(){
        return {
            detail: {
                applyStatus: null
            },
           
            activityVideo: '', //活动介绍视频
            applyForm: {
                actId: '',
                name: '',
                phone: '',
                remark: '',
                ext1: '', //短信验证码
            },
            applyVisible:false,

            isLoaded: false, //活动详情是否已加载完成

            smsBtnText: '发送验证码',
            smsInterval: 0
        }
    },
    computed: {
        smsSendAble(){
            return /^1[345789]\d{9}$/.test(this.applyForm.phone) && this.smsInterval === 0
        },
        applyAble(){
            let ok = true
            if(this.detail.applyStatus === 'free' || this.detail.applyStatus === 'paid' || this.detail.applyStatus === 'unpaid'){
                ok = false
            }
            return ok
        }
    },
    methods: {
        /* 呼叫客服电话 */
        call() {
            wx.makePhoneCall({
                phoneNumber: store.kefuPhone //仅为示例，并非真实的电话号码
            });
        },

        /* 立即报名 */
        openApply(){
            this.applyVisible = true
        },

        applyNow(){
            fly.post('/apps/jp/customer/activity/apply', this.applyForm,{
                headers: {
                    showLoading: true
                }
            }).then(rsp => {
                if (rsp.code === 200 && rsp.data) {
                    let applyInfo = rsp.data
                    if(applyInfo.needPay){
                        activityPay(applyInfo.signUpNo, this.detail.actName).then(rsp => {
                            if(rsp.code === 200 && rsp.data){
                                let data = rsp.data
                                wx.requestPayment({
                                    'timeStamp': data.timeStamp,
                                    'nonceStr': data.nonceStr,
                                    'package': data.pkg,
                                    'signType': 'MD5',
                                    'paySign': data.paySign,
                                    'success':(res) => {
                                        wx.showToast({
                                            title: '支付成功',
                                            icon: 'success'
                                        })
                                        wx.navigateTo({
                                            url: '../myActivity/main'
                                        })
                                    },
                                    'fail': (res) => {
                                        wx.showToast({
                                            title: '支付失败',
                                            icon: 'none'
                                        })
                                    }
                                })
                            }
                        })
                    }else{
                        wx.showToast({
                            title: '报名成功',
                            icon: 'success'
                        })
                        wx.navigateTo({
                            url: '../myActivity/main'
                        })
                    }

                }
            })
        },

        /* 发送短信验证码 */
        onSendSms(){
            if(this.smsSendAble){
                this.smsBtnText = '已发送'
                this.smsInterval++
                let timeRest = setInterval(() => {
                    this.smsInterval++
                    if(this.smsInterval === 30){
                        this.smsInterval = 0
                        this.smsBtnText = '发送验证码'
                        clearInterval(timeRest)
                    }
                }, 1000)
                smscode(this.applyForm.phone).then(rsp => {
                    if(rsp.data){
                        wx.showToast({
                            title: '发送成功',
                            icon: 'success',
                            duration: 2000
                        })
                    }
                })
            }
        },

        /* 关闭报名弹窗 */
        closeApply(){
            this.applyVisible = false
        },

        /* 获取活动详情 */
        getDetail(id){
            fly.get('/apps/jp/customer/activity/detail/' + id).then(rsp => {
                if(rsp.code === 200 && rsp.data){
                    rsp.data.startTime = rsp.data.startTime.split(' ')[0]
                    rsp.data.endTime = rsp.data.endTime.split(' ')[0]
                    this.detail = rsp.data

                    //活动介绍为视频时获取播放地址
                    if(this.detail.carouselUrl && this.detail.mediaType == 1){
                        fly.post('/apps/admin/jp/product/media/playurl', {
                            fileUrl: this.detail.carouselUrl
                        }).then(rsp => {
                            if(rsp.code === 200 && rsp.data){
                                this.activityVideo = this.detail.carouselUrl + '?' + rsp.data
                            }
                        })
                    }

                    //加载数据完成
                    this.isLoaded = true
                }
            })
        },
        
    },
    mounted(){
        this.isLoaded = false
        this.applyVisible = false
        this.applyForm = {
            actId: '',
            name: '',
            phone: '',
            remark: '',
            ext1: '', //短信验证码
        }

        let {id} = this.$root.$mp.query

        this.applyForm.actId = id
        this.getDetail(id)
    }
}

</script>
<style lang="less">
@import '~assets/less/color.less';
.page-activity-detail {
    min-height: calc(~"100vh - 50px");
    padding-bottom: 50px;
    background-color: #f7f8f9;
    .activity-banner{

        .banner-image{
            display: block;
            width:100%;
            height: 80vw;
        }
        
        .activity-video{
            display: block;
            width: 100vw;
        }
    }
    .activity-info{
        padding: 0 20rpx;
        line-height: 1.8;
        background-color: #fff;
        .activity-name{
            padding-top: 20rpx;
            font-size: 18px;
        }
        .activity-price{
            line-height: 36px;
            font-size: 22px;
            color: @primary;
            .price{
                .origin{
                    text-decoration: line-through;
                    font-size: 75%;
                    color: #999;
                }
                .tag{
                    display: inline-block;
                    color: #fff;
                    font-size: 14px;
                    padding: 10rpx;
                    margin-left: 20rpx;
                    line-height: 1;
                    vertical-align: middle;
                    border-radius: 8rpx;
                    background-color: @warning;
                }
            }
        }
        .activity-count{
            margin: 10rpx 0;
            color: #999;
            .num{
                color: #333;
            }
        }
        .activity-time{
            padding: 20rpx 0;
            border-top: 1px solid #eee;
            .time{
                color: #999;
            }
        }
    }

    .activity-detail{
        margin-top: 10px;
        background-color: #fff;
        .title{
            text-align: left;
            padding: 30rpx 20rpx;
            border-bottom: 1px solid #eee;
        }
        .detail-desc{
            padding: 20rpx;
            line-height: 2;
            color: #666;
        }
    }
    .bottom-handle{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background-color: #fff;
        display: flex;
        align-items: center;
        border-top: 1px solid #eee;
        overflow: hidden;
        .btn{
            height: 50px;
            line-height: 50px;
            text-align: center;
            &.btn-kefu{
                width: 50px;
                border-right: 1px solid #eee;
                .iconfont{
                    font-size: 22px;
                    color: #444;
                }
            }
            &.btn-cart{
                width: 50px;
                border-right: 1px solid #eee;
                position: relative;
                .iconfont{
                    font-size: 22px;
                    color: #333;
                }
                .quantity{
                    position: absolute;
                    top: 10rpx;
                    right: 10rpx;
                    
                    width: 32rpx;
                    height: 32rpx;
                    line-height: 32rpx;
                    text-align: center;
                    border-radius: 50%;
                    background-color: @primary;
                    font-size: 11px;
                    color: #fff;
                }
            }
            &.btn-add-cart{flex: 1;}
            &.btn-buy{
                flex: 1;
                color: #fff;
                background-color: @primary;
            }
        }
        
    }
}

.dialog-apply-form{
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 20;
    .dialog-mask{
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.5);
    }
    .dialog-content{
        position: absolute;
        top: 45%;
        left: 50%;
        width: 80%;
        transform: translate(-50%, -50%);
        padding: 40rpx;
        border-radius: 10rpx;
        background-color: #fff;
        .title{
            text-align: center;
        }
        .form{
            input{
                display: block;
                margin: 20rpx 0;
                padding: 20rpx;
                border-bottom: 1px solid #eee;
            }
            .sms-input{
                position: relative;
                button{
                    position: absolute;
                    z-index: 200;
                    top: 50%;
                    right: 0;
                    transform: translate(0, -50%);
                }
            }
        }
        .handle{
            margin-top: 40rpx;
            display: flex;
            justify-content: space-around;
            button{
                display: block;
                flex: 1;
                margin: 0 40rpx;
                line-height: 80rpx;
                font-size: 15px;
            }
            .cancel{

            }
            .submit{
                color: #fff;
                background-color: @primary;
            }
        }
    }
}

</style>
