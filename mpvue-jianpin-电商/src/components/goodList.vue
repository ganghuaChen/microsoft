<template>
    <div class="app-good-list">
        <div class="good-list">
            <div class="good-item" v-for="(item, index) in dataList" :key="index" @tap="readDetail(item.id)">
                <div class="good-img">
                    <image :src="item.goodsImage" mode="aspectFill"></image>
                </div>
                <div class="good-info">
                    <h2 class="good-name">{{item.goodsName}}</h2>
                    <div class="good-remark">{{item.goodsDesc}}</div>
                    <div class="good-price">￥{{item.primaryGoodsStock.goodsPrice}}</div>
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
    .good-item {
      display: flex;
      align-items: center;
      padding: 10rpx;
      margin-bottom: 30rpx;
      border: 1rpx solid #ddd;
      &:last-child {
        margin-bottom: 0;
      }
      .good-img {
        image {
          width: 250rpx;
          height: 250rpx;
          background: #f4f4f4;
        }
      }
      .good-info {
        flex: 1;
        line-height: 1.7;
        padding: 0 10rpx 0 20rpx;
        min-width: 0;
        .good-name {
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
        }
      }
    }
  }
}
</style>