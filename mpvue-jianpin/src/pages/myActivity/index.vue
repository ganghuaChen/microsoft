<template>
    <div class="page-my-activity">
        <div v-if="dataList.length > 0 && hasLoad">
            <!-- <div class="activity-item" v-for="(item, index1) in dataList" :key="item.id">
                    <div class="activity-label">活动信息 <span class="status">{{item.payStatus}}</span></div>
                    <div class="activity-info">
                        <div class="activity-name">活动名称：{{item.actName}}</div>
                        <div class="activity-time">报名时间：{{item.applyTime}}</div>
                    </div>

                    <div class="activity-label"> 报名信息 </div>
                    <div class="activity-form">
                        <div class="form-item">姓名：{{item.name}}</div>
                        <div class="form-item">手机：{{item.phone}}</div>
                        <div class="form-item">备注：{{item.remark}}</div>
                    </div>
                    <div class="activity-handle" v-if="item.payStatus === '未支付'">
                        <div class="handle-btn" @tap="payNow(item)">立即付款</div>
                    </div>
            </div> -->
            <div class="activity-item" v-for="item in dataList" :key="item.id">
                <div class="activity-info" @tap="readDetail(item.actId)">
                    <div class="thumb">
                        <img class="img" :src="item.thumbUrl">
                    </div>
                    <div class="txt">
                        <div class="activity-name">{{item.actName}}</div>
                        <div class="activity-time">报名时间: {{item.applyTime}}</div>
                    </div>
                    <div class="link">
                        <i class="iconfont icon-arr-right"></i>
                    </div>
                </div>
                <div class="activity-form">
                    <div class="form-item"><span class="iconfont icon-form-user"></span> {{item.name}} &ensp; {{item.phone}}</div>
                    <div class="form-item"><span class="iconfont icon-xiaoxi"></span> {{item.remark}}</div>
                </div>
                <div class="activity-handle">
                    <div class="price">
                        <span class="num" v-if="item.needPayFee>0">￥{{item.needPayFee}}</span>
                        <span class="num" v-else>免费</span> x 1
                    </div>
                    <div class="status">{{item.payStatus}}</div>
                    <div class="handle-btn" v-if="item.payStatus === '未支付'" @tap="payNow(item)">立即支付</div>
                </div>
            </div>
        </div>
        <div class="empty-activity" v-if="dataList.length === 0 && hasLoad">
            <img src="/static/images/emptyOrder.png" mode="aspectFit" class="image">
            无活动数据
        </div>
    </div>
</template>

<script>
import fly from '@/utils/fly'
import activityPay from '../activity/pay'
export default{
    data(){
        return {
            dataList: [],
            hasLoad: false,
        }
    },
    methods: {
        getMyActivityList(){
            fly.post('/apps/jp/customer/activity/member/list', {
                pageSize: 999
            },{
                headers: {
                    showLoading: true
                }
            }).then(rsp => {
                this.hasLoad = true
                if(rsp.data.list && rsp.data.list.length>0){
                    rsp.data.list.forEach((item, index) => {
                        rsp.data.list[index].payStatus = this.filterStatus(rsp.data.list[index].payStatus)
                    })
                }
                this.dataList = rsp.data.list
            })
        },

        /*过滤状态*/
        filterStatus(val){
            let dict = {
                'free': '免费',
                'paid': '已支付',
                'unpaid': '未支付'
            }
            return dict[val] || val
        },

        payNow(item){
            activityPay(item.id, item.actName).then(rsp => {
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
                            this.getMyActivityList()
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
        },

        readDetail(activityId) {
            wx.navigateTo({
                url: "../activity/main?id=" + activityId
            })
        }
    },
    mounted(){
        this.getMyActivityList()
    }
}
</script>

<style lang="less">
@import '~assets/less/color.less';
.page-my-activity{
    min-height: 100vh;
    background-color: #f7f8f9;
    .activity-item{
        font-size: 14px;
        margin-top: 30rpx;
        padding: 0 30rpx;
        background-color: #fff;
        &:first-child{
            margin-top: 0;
        }
        .activity-info{
            display: flex;
            align-items: center;
            padding: 20rpx 0;
            .thumb{
                width: 120rpx;
                height: 120rpx;
                overflow: hidden;
                .img{
                    width: 100%;
                    height: 100%;
                }
            }
            .txt{
                margin: 0 20rpx;
                flex: 1;
                line-height: 1.8;
                .activity-name{
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    font-size: 15px;
                }
                .activity-time{
                    color: #707070;
                    font-size: 13px;
                }
            }
            .link{

            }
        }
    
        .activity-form{
            padding: 20rpx;
            color: #707070;
            line-height: 1.8;
            border-top: 1px solid #efefef;
            border-bottom: 1px solid #efefef;
            .form-item{

            }
        }

        .activity-handle{
            padding: 20rpx 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            .price{
                flex: 1;
                line-height: 72rpx;
                color: #999;
                font-size: 12px;
                .num{
                    color: #333;
                    font-size: 14px;
                }
            }
            .status{

            }
            .handle-btn{
                line-height: 1;
                margin-left: 20rpx;
                padding: 15rpx 20rpx;
                color: #ef5b30;
                border: 1px solid #ef5b30;
                border-radius: 30rpx;
            }
        }
        
    }

    .empty-activity{
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
</style>