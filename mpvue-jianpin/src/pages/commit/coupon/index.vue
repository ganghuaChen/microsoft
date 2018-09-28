<template>
    <div class="page-my-coupon coupon-list">
        <div v-if="dataList.length > 0 && hasLoad">
            <div class="coupon-item" :class="{'coupon-A': item.productScope === 'A', 'coupon-S': item.productScope === 'S', 'coupon-O': item.productScope === 'O'}" v-for="item in dataList" :key="item.id" @click="onChoose(item)">
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
                        有效期至{{item.timeEnd}}
                    </div>
                    <div class="note-info" @click="openUseRules(item.usageRules)">
                        使用说明 <span class="iconfont icon-arr-right"></span>
                    </div>
                </div>
            </div>
        </div>
        <div class="empty-activity" v-if="dataList.length === 0 && hasLoad">
            <img src="/static/images/emptyOrder.png" mode="aspectFit" class="image">
            无可用优惠券
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
            const orderInfo = wx.getStorageSync('_orderInfo')
            const item = orderInfo.shopOrderItems[0]
            const query = `?stockId=${item.productStock.id}&stockNum=${item.quantity}`
            fly.get('/apps/jp/customer/coupon/product/available/list' + query).then(rsp => {
                this.hasLoad = true
                if(rsp.data && rsp.data.length>0){
                    let list = rsp.data
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
         * 选择优惠券
         */
        onChoose(item){
            wx.setStorageSync('useCouponItem', item)
            wx.navigateBack()
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
    }
}
</script>

<style lang="less">
@import '~assets/less/color.less';
@import './style.less';

</style>