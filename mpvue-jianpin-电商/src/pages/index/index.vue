<template>
    <div class="page-index">
        <!-- 轮播图 -->
        <swiper :indicator-dots="true" :autoplay="true" :interval="5000" duration="500" class="swiper-banner">
            <swiper-item v-for="(item, index) in bannerImgs" :key="index">
                <image :src="item" class="banner-image" mode="aspectFill" />
            </swiper-item>
        </swiper>
        <!-- 无忧退款 -->
        <div class="promise">
            <div class="item">
                <icon type="success" size="15" color="#b62e33"/> 15天无忧退换货
            </div>
            <div class="item">
                <icon type="success" size="15" color="#b62e33"/> 48小时快速退款
            </div>
        </div>

        <!-- 爆款推荐 商品列表 -->
        <div class="good-block recommend" v-if="recommendGoods && recommendGoods.length>0">
            <h1 class="title">爆款推荐</h1>
            <div class="good-container">
                <goodList :dataList="recommendGoods"></goodList>
            </div>
        </div>

        <!-- 最热商品 -->
        <div class="good-block groups" v-if="hotGoods && hotGoods.length>0">
            <h1 class="title">最热商品</h1>
            <div class="good-container">
                <goodList :dataList="hotGoods"></goodList>
            </div>
        </div>

        <!-- 最新商品 -->
        <div class="good-block groups" v-if="lastestGoods && lastestGoods.length>0">
            <h1 class="title">最新商品</h1>
            <div class="good-container">
                <goodList :dataList="lastestGoods"></goodList>
            </div>
        </div>

        <support></support>

        <backTop @backTop="backTop" v-if="backTopVisible"></backTop>
    </div>
</template>
<script>
import goodList from '@/components/goodList'
import support from '@/components/support'
import backTop from '@/components/backTop'
import fly from '@/utils/fly'
export default {
    components: {
        goodList, support, backTop
    },
    data() {
        return {
            bannerImgs: [
                'http://jianpin-img.pinzvip.com/2017/11/banner/banner001.png',
                'http://jianpin-img.pinzvip.com/2017/11/banner/banner002.png'
            ],

            backTopVisible: false,

            hotGoods: [],
            lastestGoods: [],
            recommendGoods: []
        }
    },

    methods: {
        backTop(){
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
            })
        },

        getHotGoods(){
            fly.get('/apps/jp/customer/goods/hot/list',{
                pageSize: 10
            }).then(rsp => {
                if(rsp.code === 200 && rsp.data && rsp.data.list){
                    this.hotGoods = rsp.data.list
                }
            })
        },

        getLastestGoods(){
            fly.get('/apps/jp/customer/goods/latest/list',{
                pageSize: 10
            }).then(rsp => {
                if(rsp.code === 200 && rsp.data && rsp.data.list){
                    this.lastestGoods = rsp.data.list
                }
            })
        },

        getRecommendGoods(){
            
            fly.get('/apps/jp/customer/goods/recommend/list',{
                pageSize: 10
            }).then(rsp => {
                if(rsp.code === 200 && rsp.data && rsp.data.list){
                    this.recommendGoods = rsp.data.list
                }
            })
        }
    },
    onPageScroll(event){
        if(event.scrollTop > 100){
            this.backTopVisible = true
        }else{
            this.backTopVisible = false
        }
    },
    mounted() {
        this.getRecommendGoods()

        this.getHotGoods()

        this.getLastestGoods()
    }
}

</script>
<style lang="less">
@import '~assets/less/color.less';
.page-index {
    min-height: 100vh;
    background-color: #f7f8f9;
    .swiper-banner {
        height: 420rpx;
        .banner-image {
            width: 100%;
            height: 420rpx;
        }
    }
    .promise{
        display: flex;
        padding: 20rpx 0;
        background-color: #fff;
        .item{
            flex: 1;
            text-align: center;
            font-size: 14px;
            color: @primary;
            icon{
                position: relative;
                top: -2px;
                vertical-align: middle;
            }
        }
    }
    .good-block{
        margin: 30rpx 0;
        padding-bottom: 30rpx;
        background-color: #fff;
        .title{
            line-height: 100rpx;
            text-align: center;
            font-size: 16px;
        }
        .good-container{
            padding: 0 30rpx;
        }
    }
}

</style>
