<template>
    <div class="page-my-coupon coupon-list">
        <div v-if="dataList.length > 0 && hasLoad">
            <div class="coupon-item" :class="{'coupon-A': item.productScope === 'A', 'coupon-S': item.productScope === 'S', 'coupon-O': item.productScope === 'O'}" v-for="item in dataList" :key="item.id">
                <div class="left">
                    <div class="price">
                        ￥<span class="num">{{item.amountOff}}</span>
                    </div>
                    <div class="full"> 满{{item.amountFull}}元使用</div>
                    <!-- <div class="button" @click="readDetail(item.id)">查看详情</div> -->
                </div>
                <div class="right">
                    <div class="name-info">
                        <span class="scope">{{item.productScopeText}}</span>
                        {{item.name}}
                    </div>
                    <div class="time-info">
                        有效期至{{item.timeEnd}} <span class="btn-detail pull-right" @click="readDetail(item.id)">详情</span>
                    </div>
                    <div class="note-info" @click="openUseRules(item.usageRules)">
                        使用说明 <span class="iconfont icon-arr-right"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="empty-activity" v-if="dataList.length === 0 && hasLoad">
            <img src="/static/images/emptyOrder.png" mode="aspectFit" class="image">
            无优惠券
        </div>
    </div>
</template>

<script>
import fly from '@/utils/fly'

export default{
    data(){
        return {
            dataList: [],
            hasLoad: false,
        }
    },
    methods: {
        getMyCouponList(){
            fly.get('/apps/jp/customer/coupon/myown/list').then(rsp => {
                this.hasLoad = true
                if(rsp.data.list && rsp.data.list.length>0){
                    let list = rsp.data.list
                    list.forEach((item,index) => {
                        list[index].productScopeText = this.filterScope(item.productScope)
                        list[index].rate = ((item.receiveCount/item.totalCount) * 100)
                        list[index].remainCount = item.totalCount - item.receiveCount
                        list[index].timeBegin = item.timeBegin.split(' ')[0]
                        list[index].timeEnd = item.timeEnd.split(' ')[0]
                    })

                    this.dataList = list
                }
            })
        },

        filterScope(scope){
            let dict = {
                'A': '全场商品',
                'S': '指定商品',
                'O': '线下商品'
            }
            return dict[scope]
        },

        readDetail(id){
            wx.navigateTo({
                url: '../couponDetail/main?id=' + id
            })
        },

        /**
         * 打开使用说明
         */
        openUseRules(text){
            let _text = text
            if(!text) _text = '无使用限制'
            wx.showModal({
                title: '使用说明',
                content: _text,
                showCancel: false,
            })
        }
    },
    mounted(){
        this.getMyCouponList()
    },
    onLoad(options){
        console.log(options)
    }
}
</script>

<style lang="less">
@import '~assets/less/color.less';
@import './style.less';
.page-my-coupon{
    padding: 30rpx 0;
    min-height: 100vh;
    box-sizing: border-box;
    background-color: #f7f8f9;

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