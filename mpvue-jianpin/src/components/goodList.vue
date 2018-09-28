<template>
    <div class="app-good-list">
        <div class="good-list">
            <div class="good-item" v-for="(item, index) in dataList" :key="index" @tap="readDetail(item.goodId)">
                <div class="inner">
                    <div class="good-img">
                        <image :src="item.goodsImage" mode="widthFix"></image>
                    </div>
                    <div class="good-info">
                        <h2 class="good-name">{{item.goodsName}}</h2>
                        <!-- <div class="good-remark">{{item.goodsDesc}}</div> -->
                        <div class="good-price">￥{{item.goodsPrice}}
                            <span class="origin">￥{{item.goodsOldPrice}}</span>
                            <i class="iconfont icon-cart pull-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        dataList: {
            type: Array,
            default: []
        }
    },
    data: function() {
        return {};
    },
    methods: {
        readDetail(goodId) {
            wx.navigateTo({
                url: "../good/main?id=" + goodId
            });
        }
    }
};

</script>
<style lang="less">
@import "~assets/less/color.less";
.app-good-list {
    .good-list {
        padding: 0 15rpx;
        &:after {
            content: '';
            display: table;
            clear: both;
        }
        .good-item {
            box-sizing: border-box;
            width: 100%;

            padding: 15rpx;

            .inner {

                // border: 1rpx solid #ddd;
            }
            .good-img {
                height: 0;
                padding-bottom: 50%;
                border-radius: 10rpx;
                overflow: hidden;
                image {
                    width: 100%;
                    background: #f4f4f4;
                }
            }
            .good-info {
                flex: 1;
                line-height: 1.7;
                min-width: 0;
                .good-name {
                    margin: 10rpx 0;
                    font-size: 15px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .good-remark {
                    font-size: 12px;
                    color: #999;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .good-price {
                    color: @primary;
                    font-size: 16px;
                    .origin{
                        text-decoration: line-through;
                        font-size: 80%;
                        color: #999;
                    }
                    .iconfont{
                        margin-top: -6rpx;
                        font-weight: bold;
                        font-size: 120%;
                        padding: 10rpx;
                        color: #fff;
                        line-height: 1;
                        border-radius: 10rpx;
                        background-color: @primary;
                    }
                }
            }
        }
    }
}

</style>
