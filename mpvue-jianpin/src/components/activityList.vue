<template>
    <div class="app-activity-list">
        <div class="activity-list">
            <div class="activity-item" v-for="(item, index) in dataList" :key="index" @tap="readDetail(item.id)">
                <div class="inner">
                    <div class="activity-img">
                        <image v-if="item.mediaType == 0" :src="item.thumbUrl" mode="aspectFill"></image>
                        <image v-if="item.mediaType == 1" src="/static/images/act_bg.png" mode="widthFix"></image>
                    </div>
                    <h2 class="activity-name">{{item.actName}}</h2>
                    <div class="activity-info">
                        <div class="activity-price">
                            <span v-if="item.payType === 'free'">免费</span>
                            <span v-else>￥{{item.price}} &ensp;<span class="origin">￥{{item.oldPrice}}</span></span>
                        </div>
                        <div class="activity-count">
                            共<span class="num">{{item.num}}</span>个名额, 已报名<span class="num">{{item.applyNum}}</span>
                            <span class="apply-btn pull-right" @tap="readDetail(item.id)">报名</span>
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
        readDetail(activityId) {
            wx.navigateTo({
                url: "../activity/main?id=" + activityId
            });
        }
    }
};

</script>
<style lang="less">
@import "~assets/less/color.less";
.app-activity-list {
    .activity-list {
        padding: 0 15rpx;
        &:after {
            content: '';
            display: table;
            clear: both;
        }
        .activity-item {
            box-sizing: border-box;
            padding-bottom: 30rpx;
            margin: 0 20rpx 30rpx;
            border-bottom: 1px solid #eee;
            &:last-child{
                margin-bottom: 0;
                border-bottom: none;
            }
            .inner {

                // border: 1rpx solid #ddd;
            }
            .activity-img {
                height: 0;
                padding-bottom: 50%;
                border-radius: 10rpx;
                overflow: hidden;
                image {
                    width: 100%;
                    background: #f4f4f4;
                }
            }
            .activity-name {
                margin: 15rpx 0 10rpx;
                font-size: 17px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .activity-info {
                flex: 1;
                line-height: 1.7;
                min-width: 0;
                .activity-price {
                    color: @primary;
                    font-size: 16px;
                    .origin{
                        text-decoration: line-through;
                        font-size: 85%;
                        color: #999;
                    }
                }
                .activity-count{
                    font-size: 14px;
                    color: #999;
                    .num{
                        color: #333;
                    }
                    .apply-btn{
                        margin-top: -15rpx;
                        padding: 2rpx 15rpx;
                        color: @primary;
                        border: 1px solid @primary;
                        border-radius: 30rpx;
                    }
                }
            }
        }
    }
}

</style>
