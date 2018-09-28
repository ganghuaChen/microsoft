<template>
    <div class="page-index">
        <!-- 轮播图 -->
        <div v-if="banners && banners.length>0">
            <swiper 
                :indicator-dots="true" :autoplay="true" :interval="5000" duration="500" previous-margin="0px" next-margin="0px" 
                :display-multiple-items="1" indicator-color="rgba(0,0,0,.3)" indicator-active-color="#fda15a" class="swiper-banner">
                <swiper-item v-for="(item, index) in banners" :key="index">
                    <image :src="item.bannerPicUrl" class="banner-image" mode="widthFix" @tap="readDetail(item.bannerRedirectUrl)"/>
                </swiper-item>
            </swiper>
        </div>
        
        <!-- 活动报名 -->
        <div v-if="activityList && activityList.length>0">
            <div class="good-block groups" >
                <h1 class="title">
                    活动报名
                    <div class="sub">你是驴友吗每周更新自驾活动</div>
                    <!-- <div class="btn-more">查看更多</div> -->
                </h1>
                <div class="good-container">
                    <activityList :dataList="activityList"></activityList>
                </div>
            </div>
        </div>

        <!-- 推荐商品 商品列表 -->
        <div class="good-block recommend" v-if="recommendGoods && recommendGoods.length>0">
            <h1 class="title">
                推荐商品
                <div class="sub">平台推荐最新精致好物</div>
                <!-- <div class="btn-more">查看更多</div> -->
            </h1>
            <div class="good-container">
                <goodList :dataList="recommendGoods"></goodList>
            </div>
        </div>

        <!-- 商品分组 -->
        <div v-if="groups && groups.length>0">
            <div v-for="group in groups" :key="group.id" class="good-block groups" >
                <h1 class="title">{{group.groupName}}</h1>
                <div class="good-container">
                    <goodList :dataList="group.goods"></goodList>
                </div>
            </div>
        </div>

        <support></support>

        <backTop @backTop="backTop" v-if="backTopVisible"></backTop>
    </div>
</template>
<script>
    // let appInstance = getApp()
import goodList from '@/components/goodList'
import activityList from '@/components/activityList'
import support from '@/components/support'
import backTop from '@/components/backTop'
import fly from '@/utils/fly'
export default {
    components: {
        goodList, activityList, support, backTop
    },
    data() {
        return {
            bannerImgs: [
                'http://wx001-1251494700.cossh.myqcloud.com/test001/wx_sc_image/21b007eaad3549d8bc51920ab494cb42.jpg',
                'http://wx001-1251494700.cossh.myqcloud.com/test001/wx_sc_image/21b007eaad3549d8bc51920ab494cb42.jpg',
                'http://wx001-1251494700.cossh.myqcloud.com/test001/wx_sc_image/21b007eaad3549d8bc51920ab494cb42.jpg',
                'http://wx001-1251494700.cossh.myqcloud.com/test001/wx_sc_image/21b007eaad3549d8bc51920ab494cb42.jpg',
                'http://wx001-1251494700.cossh.myqcloud.com/test001/wx_sc_image/75fa071d4fd54cf4abd9d345c274a21c.jpg'
            ],
            banners: [],

            backTopVisible: false,

            recommendGoods: [],
            groups: [],

            activityList: [], //活动
        }
    },

    methods: {
        backTop(){
            wx.pageScrollTo({
                scrollTop: 0,
                duration: 0
            })
        },

        queryDecorationInfo(){
            fly.post('/apps/jp/shop/queryDecorationInfo',{
                tenantId: wx.getStorageSync('tenantId')
            }).then(rsp => {
                if(rsp.code === 200 && rsp.data){
                    this.banners = rsp.data.banners

                    this.recommendGoods = rsp.data.goods

                    this.groups = rsp.data.groups
                }
            })
        },

        queryActivity(){
            fly.post('/apps/jp/customer/activity/list', {
                tenantId: wx.getStorageSync('tenantId'),
                pageSize: 5
            }).then(rsp => {
                if(rsp.data && rsp.data.list){
                    this.activityList = rsp.data.list
                }
            })
        },
        
        readDetail(goodId) {
            wx.navigateTo({
                url: "../good/main?id=" + goodId
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
        this.queryDecorationInfo()

        this.queryActivity()
        // wx.previewImage({
        //       current: 'http://syb001-1253205801.file.myqcloud.com/test001/c4afacc2-0527-44c6-8198-d037f186f130.jpg', // 当前显示图片的http链接
        //       urls: ['http://syb001-1253205801.file.myqcloud.com/test001/c4afacc2-0527-44c6-8198-d037f186f130.jpg'] // 需要预览的图片http链接列表
        // })
    }
}

</script>
<style lang="less">
@import '~assets/less/color.less';
.page-index {
    min-height: 100vh;
    background-color: #f7f8f9;
    .swiper-banner {
        height: 60vw;
        .banner-image {
            width: 100%;
            height: 60vw;
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
            position: relative;
            font-size: 16px;
            padding: 30rpx 130rpx 30rpx 40rpx;
            .sub{
                display: block;
                margin-top: 10rpx;
                font-size: 12px;
                color: #999;
            }
            .btn-more{
                position: absolute;
                top: 30rpx;
                right: 40rpx;
                color: @primary;
                font-size: 14px;
                line-height: 90rpx;
            }
        }
        .good-container{
            // padding: 0 30rpx;
        }
    }
}

</style>
