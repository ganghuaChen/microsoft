<template>
    <div class="page-coupon-list">
        <div v-if="dataList.length > 0 && hasLoad">
            <div class="coupon-item" :class="{'coupon-A': item.productScope === 'A', 'coupon-S': item.productScope === 'S', 'coupon-O': item.productScope === 'O'}" v-for="item in dataList" :key="item.id">
                <div class="left">
                    <div class="name-info">
                        <span class="scope">{{item.productScopeText}}</span>
                        {{item.name}}
                    </div>
                    <div class="price-info">
                        ￥<span class="num">{{item.amountOff}}</span> <span class="full"> 满{{item.amountFull}}元使用</span>
                    </div>
                    <div class="note-info" @click="openUseRules(item.usageRules)">
                        使用说明 <span class="iconfont icon-arr-right"></span>
                    </div>
                </div>
                <div class="right">
                    <div class="remain">剩余 <br> <span class="num">{{item.remainCount}}</span> 张</div>
                    <div class="button" @click="onReceive(item)">立即领取</div>
                </div>
            </div>
        </div>
        <div class="empty-coupon" v-if="dataList.length === 0 && hasLoad">
            <img src="/static/images/emptyOrder.png" mode="aspectFit" class="image">
            无优惠券数据
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
        getCouponList(){
            fly.get('/apps/jp/customer/coupon/list').then(rsp => {
                this.hasLoad = true
                if(rsp.data.list && rsp.data.list.length>0){
                    let list = rsp.data.list
                    list.forEach((item,index) => {
                        // list[index].productScope = this.filterScope(item.productScope)
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
                'S': '部分商品',
                'O': '线下商品'
            }
            return dict[scope]
        },

        /**
         * 领取优惠券
         */
        onReceive(item){
            fly.get('/apps/jp/customer/coupon/get/' + item.id).then(rsp => {
                if(rsp.code === 200){
                    wx.showToast({
                        title: '领取成功',
                        icon: 'success',
                        duration: 2000
                    })
                    item.remainCount--
                }
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
        this.getCouponList()
    },
    onLoad(options){
        if (options.tenantId) {
          wx.setStorageSync('tenantId', options.tenantId)
        }
    }
}
</script>

<style lang="less">
@import '~assets/less/color.less';
@import './style.less';

</style>