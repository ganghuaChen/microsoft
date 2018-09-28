<template>
    <div class="page-good-detail" v-if="isLoaded">
        <!-- 商品轮播图 -->
        <div class="good-banner">
            <!-- 轮播图 -->
            <swiper v-if="detail.mediaType === 0" :indicator-dots="true" :autoplay="true" :interval="5000" duration="500" class="swiper-banner">
                <swiper-item v-for="(item, index) in bannerImgs" :key="index" class="swiper-item">
                    <image :src="item" class="banner-image" mode="widthFix" />
                </swiper-item>
            </swiper>
            <!-- 视频介绍 goodVideo-->
            <video v-if="detail.mediaType === 1" class="good-video" :src="goodVideo" controls  objectFit="fill"></video>
            <!-- 分销按钮 -->
            <button class="btn-share" v-if="detail.tenantFee && userInfo.userType == '6'" open-type="share">赚{{detail.tenantFee}}元</button>
        </div>

        <!-- 商品价格信息 -->
        <div class="good-info">
            <div class="good-name">{{detail.goodsName}}</div>
            <div class="good-price" v-if="detail.productStocks">
                ￥{{detail.productStocks[0].goodsPrice}} <span class="origin">￥{{detail.productStocks[0].goodsOldPrice}}</span>
                <div class="count">已售<span class="text-primary">{{detail.virtuNum}}</span></div>
            </div>
        </div>

        <!-- 选择商品规格 -->
        <div class="good-stock-selector" @tap="stockVisible = true">
            <div class="good-stock">
                规格数量选择
                <i class="iconfont icon-arr-right pull-right"></i>
            </div>

            <div class="good-promise">
                服务：<span>15天无忧退换货</span> <span>48小时极速退款</span>
            </div>
        </div>
        
        <!-- 商品规格弹窗 -->
        <div class="app-good-stock" v-if="stockVisible">
            <div class="stock-mask" @tap="closeStock"></div>
            <div class="stock-container">
                <div class="stock-selected">
                    <div class="image">
                        <img :src="detail.goodsImage" alt="" class="img" mode="aspectFill">
                    </div>
                    <div class="text">
                        <div class="price" v-if="selectedGood">￥{{selectedGood.goodsPrice}}</div>
                        <div class="selected">
                            已选择：<span v-for="value in selectedObj" :key="value">{{value}}; </span>
                        </div>
                    </div>
                </div>
                <div class="stock-list" v-for="(value, key) in stockNames" :key="key">
                    <div class="item-key">{{key}}</div>
                    <div class="item-values">
                        <span class="item-value" :class="{selected: selectedObj[key] === v}" v-for="(v, i) in value" :key="i" @tap="onSelectStock(key, v)">{{v}}</span>
                    </div>
                </div>
                <div class="stock-list">
                    <div class="item-key">数量</div>
                    <div class="item-count">
                        <span class="sym sym-minus" :class="{disabled: buyNum === 1}" @tap="onMinus">-</span>
                        <input class="sym sym-num" type="number" v-model="buyNum"/>
                        <span class="sym sym-add" @tap="onAdd">+</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- 商品详情信息 -->
        <div class="good-detail">
            <h4 class="title">商品详情</h4>
            <div class="detail-imgs">
                <img v-for="item in detailImgs" :key="item" :src="item" mode="widthFix">
            </div>
        </div>
        
        
        <!-- 立即购买 -->
        <div class="bottom-handle">
            <div class="btn btn-kefu" @tap="call">
                <i class="iconfont icon-kefu"></i>
            </div>
            <!-- <div class="btn btn-cart" @tap="switchToCart">
                <i class="iconfont icon-cart"></i>
                <span class="quantity" v-if="quantity">{{quantity}}</span>
            </div>
            <div class="btn btn-add-cart" @tap="addCart">
                加入购物车
            </div> -->
            <div class="btn btn-buy" @tap="buyNow">
                立即购买
            </div>
        </div>
    </div>
</template>
<script>
import store from 'store'
import fly from '@/utils/fly'
export default {
    data(){
        return {
            detail: {},
            stockVisible: false,

            selectedObj: {},
            buyNum: 1,
            quantity: undefined,

            goodVideo: '', //商品介绍视频

            isLoaded: false, //商品详情是否已加载完成

            channelId: '', //分享人ID

            userInfo: {},
        }
    },
    computed: {
        /* 商品轮播图数组 */
        bannerImgs(){
            let arr = []
            if(this.detail.carousel) arr = this.detail.carousel.split(',')
            return arr
        },
        
        /* 商品详情图数组 */
        detailImgs(){
            let arr = []
            if(this.detail.intro && this.detail.intro.indexOf('http')>-1) arr = this.detail.intro.split(',')
            return arr
        },

        /* 商品规格 */
        productStocks(){
            return this.detail.productStocks || []
        },

        /* 规格名称 */
        stockNames(){
            let arr = this.detail.productStocks || []
            let result = {}
            arr.forEach((item,index) => {
                for(let i=1;i<=4;i++){
                    if(item['optionName'+i]){
                        if(!result[item['optionName'+i]]){
                            result[item['optionName'+i]] = []
                        }else{
                            if(result[item['optionName'+i]].indexOf(item['optionValue'+i]) < 0){
                                result[item['optionName'+i]].push(item['optionValue'+i])
                            }
                        }
                    }
                }

            })
            // console.log('stockNames:', result)
            return result
        },

        /* 已选择的商品规格 */
        selectedGood(){
            let result = null
            let selected = this.selectedObj
            this.productStocks.forEach(item => {
                let count = 0
                for(let i=1;i<=4;i++){
                    for(let key in selected){
                        if(item['optionName'+i] === key && item['optionValue'+i] === selected[key]){
                            count++
                        }
                    }
                }
                if(count === Object.keys(this.stockNames).length){
                    result = item
                }
            })
            return result
        }
    },
    methods: {
        /* 呼叫客服电话 */
        call() {
            wx.makePhoneCall({
                phoneNumber: store.kefuPhone //仅为示例，并非真实的电话号码
            });
        },

        /**
         * 跳转至购物车页面
         */
        switchToCart(){
            wx.switchTab({
                url: "../cart/main"
            })
        },

        /**
         * 添加到购物车
         */
        addCart(){
            console.log('添加到购物车')
            fly.post('/shop/cart/customer/additem', [{
                "productId": this.selectedGood.goodsId,
                "productOption": this.selectedGood.id,
                "productType": "JP",
                "quantity": this.buyNum
            }]).then(rsp => {
                if(rsp.code === 200){
                    wx.showToast({
                        title: '加入成功',
                        icon: 'success',
                        duration: 2000
                    })
                    this.quantity = rsp.data.quantity
                }
            })
        },

        /* 立即购买 */
        buyNow(){
            console.log('立即购买')
            fly.post('/shop/order/customer/buynow', {
                "channelId": this.channelId,
                "productId": this.selectedGood.goodsId,
                "productOption": this.selectedGood.id,
                "productType": "JP",
                "quantity": this.buyNum
            },{
                headers: {
                    showLoading: true
                }
            }).then(rsp => {
                if (rsp.code === 200 && rsp.data) {
                    wx.setStorageSync('_orderInfo', rsp.data)
                    wx.navigateTo({
                        url: "../commit/main"
                    })
                }
            })
        },

        /* 获取商品详情 */
        getDetail(id){
            fly.get('/apps/jp/customer/goods/detail/' + id).then(rsp => {
                if(rsp.code === 200 && rsp.data){
                    this.detail = rsp.data

                    for(let key in this.stockNames){
                        this.$set(this.selectedObj, key, this.stockNames[key][0])
                    }

                    //商品介绍为视频时获取播放地址
                    if(this.detail.carousel && this.detail.mediaType === 1){
                        fly.post('/apps/admin/jp/product/media/playurl', {
                            fileUrl: this.detail.carousel
                        }).then(rsp => {
                            if(rsp.code === 200 && rsp.data){
                                this.goodVideo = this.detail.carousel + '?' + rsp.data
                            }
                        })
                    }

                    //加载数据完成
                    this.isLoaded = true
                }
            })
        },
        /* 规格数量减一 */
        onMinus(){
            if(this.buyNum > 1){
                this.buyNum--
            }
        },
        /* 规格数量加一 */
        onAdd(){
            this.buyNum++
        },

        /* 选中某一规格 */
        onSelectStock(key, value){
            this.$set(this.selectedObj, key, value)
        },

        /* 关闭规格弹窗 */
        closeStock(){
            this.stockVisible = false
        },
    },
    onLoad(){
        this.stockVisible = false
        this.isLoaded = false
        this.buyNum = 1
        
        let {id} = this.$root.$mp.query
        this.getDetail(id)

        if(this.$root.$mp.query && this.$root.$mp.query.channelId){
            this.channelId = this.$root.$mp.query.channelId
        }
    },
    onShareAppMessage(res){
        this.userInfo = wx.getStorageSync('userInfo')
        let path = `/pages/good/main?id=${this.detail.id}`
        if(this.userInfo.userType == '6'){
            const channelId = this.userInfo.id
            path += '&channelId=' + channelId
        }
        
        console.log("分享页面路径：" + path)
        console.log("onShareAppMessage res:" + JSON.stringify(res))
        // if (res.from === 'button') {
        //   // 来自页面内转发按钮
        //   console.log(res.target)
        // }
        return {
          title: this.detail.goodsName,
          path: path,
          imageUrl: this.detail.goodsImage
        }
  
    }
}

</script>
<style lang="less">
@import '~assets/less/color.less';
.page-good-detail {
    padding-bottom: 50px;
    background-color: #f7f8f9;
    .good-banner{
        position: relative;
        .swiper-banner{
            height:80vw;
            .swiper-item{
                .banner-image{
                    display: block;
                    width:100%;
                    height: 80vw;
                }
            }
        }
        .good-video{
            display: block;
            width: 100vw;
        }
        .btn-share{
            position: absolute;
            top: 20rpx;
            right: 20rpx;
            color: #fff;
            font-size: 12px;
            background-color: rgba(0,0,0,.5);
        }
    }
    .good-info{
        margin-bottom: 20px;
        padding: 20rpx;
        line-height: 1.8;
        background-color: #fff;
        .good-name{
            font-size: 18px;
        }
        .good-price{
            line-height: 36px;
            font-size: 22px;
            color: @primary;
            font-weight: bold;
            .origin{
                text-decoration: line-through;
                font-size: 80%;
                font-weight: normal;
                color: #999;
            }
            .count{
                float: right;
                font-size: 16px;
                line-height: 36px;
                color: #999;
                font-weight: normal;
            }
        }
    }

    .good-stock-selector{
        margin: 40rpx 0;
        
        background-color: #fff;
        .good-stock{
            padding: 0 40rpx;
            line-height: 100rpx;
            border-bottom: 1px dotted #eee;
        }
        .good-promise{
            padding: 0 40rpx;
            line-height: 100rpx;
            vertical-align: middle;
            span{
                display: inline-block;
                color: #707070;
                vertical-align: middle;
                padding-left: 25rpx;
                margin-right: 20rpx;
                position: relative;
                top: -4rpx;
                font-size: 90%;
                &:before{
                    content: '';
                    position: absolute;
                    top: 40rpx;
                    left: 0;
                    width: 20rpx;
                    height: 20rpx;
                    border-radius: 50%;
                    background-color: @primary;
                }
            }
        }
    }

    .good-detail{
        background-color: #fff;
        .title{
            text-align: center;
            padding: 20rpx;
            border-bottom: 1px solid #eee;
        }
        .detail-imgs{
            img{
                display: block;
                width: 100%;
                margin: 0 auto;
            }
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


.app-good-stock{
    position: fixed;
    top: 0;
    bottom: 100rpx;
    left: 0;
    right: 0;
    .stock-mask{
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.5);
    }
    .stock-container{
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20rpx;
        background-color: #fff;
        max-height: 100%;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        .stock-selected{
            display: flex;
            align-items: flex-end;
            padding: 20rpx 0;
            .image{
                margin-right: 30rpx;
                .img{
                    display: block;
                    width: 160rpx;
                    height: 160rpx;
                }
            }   
            .text{
                flex: 1;
                line-height: 1.7;
                .price{
                    color: @primary;
                }
                .selected{

                }
            }
        }
        .stock-list{
            margin: 30rpx 20rpx;
            .item-key{
                color:#707070;
                margin-bottom: 20rpx;
            }
            .item-values{
                .item-value{
                    display: inline-block;
                    vertical-align: middle;
                    padding: 20rpx 30rpx;
                    margin-right: 30rpx;
                    border: 1px solid #eee;
                    &.selected{
                        color: @primary;
                        border: 1px solid @primary;
                    }
                }
            }

            .item-count{
                .sym{
                    display: inline-block;
                    vertical-align: middle;
                    text-align: center;
                    height: 88rpx;
                    line-height: 84rpx;
                    padding: 0 1.2em;
                }
                .sym-num{
                    width: 2.5em;
                    padding: 0 1em;
                    border-top: 1px solid #eee;
                    border-bottom: 1px solid #eee;
                }
                .sym-add{
                    font-size: 20px;
                    border: 1px solid #eee;
                    border-radius: 0 4px 4px 0;
                }
                .sym-minus{
                    font-size: 20px;
                    border: 1px solid #eee;
                    border-radius: 4px 0 0 4px;
                    &.disabled{
                        color: #ccc;
                    }
                }
            }
        }
    }
}
</style>
