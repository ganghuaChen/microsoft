<template>
  <div class="page-order-pay page-flex">
    <div class="bd">
      <div class="order-address" @tap="goAddress" v-if="address && address.id">
          <div class="left"><i class="iconfont icon-address"></i></div>
          <div class="center">
            <div class="area">{{address.area}}</div>
            <div class="detail">{{address.detail}}</div>
            <div class="phone">收件人：{{address.contactName}} {{address.mobileNo}}</div>
          </div>
          <div class="right"><i class="iconfont icon-arr-right"></i></div>
      </div>
      <div class="order-address-empty" v-else @tap="goAddress">
        <i class="iconfont icon-address"></i> 请选择收件地址
      </div>

      <div class="order-good-info" v-if="orderInfo && orderInfo.shopOrderItems">
          <div class="title">商品信息</div>
          <div class="good-list">
            <div class="good-item" v-for="item in orderInfo.shopOrderItems" :key="item.id">
              <div class="thumb">
                <img :src="item.productObject.goodsImage" mode="aspectFit" class="thumb-img">
              </div>
              <div class="info">
                <div class="good-name">{{item.productObject.goodsName}}</div>
                <div class="good-price">
                  <span class="text-primary">￥{{item.productStock.goodsPrice}}</span>
                  <span class="num pull-right">x{{item.quantity}}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="form-item" @tap="onChooseCoupon">
            <div class="label">优惠券</div>
            <div class="value" v-if="hasCoupon"> 
                <span v-if="couponInfo.amountOff">￥{{couponInfo.amountOff}}</span>
                <span v-else>请选择</span>
            </div>
            <div class="value" v-else>无可用</div>
          </div>
          <div class="form-item postage">
            <span class="label">运费</span>
            <span class="value">￥{{orderInfo.orderTotalSummary.shippingFee}}</span>
          </div>
          <div class="form-item comment">
            <span class="label">买家留言</span>
            <span class="value"><input v-model="orderInfo.remark" placeholder="选填"/></span>
          </div>
          
      </div>
    </div>

    <div class="ft">
      <div class="ft-handle">
        <div class="num">实付：￥{{finalPrice}}</div>
        <div class="btn" :class="{disabled: !payAble}" @tap="onPay">立即付款</div>
      </div>
    </div>
  </div>
</template>

<script>
import fly from '@/utils/fly'
import orderPay from './pay'
export default {
  data(){
    return {
      orderInfo: undefined,
      couponInfo: {
        amountOff: undefined
      },
      hasCoupon: false,
      address: {}
    }
  },
  computed: {
    payAble(){
      return !!this.orderInfo.addressId
    },
    finalPrice(){
        return this.couponInfo.amountOff ? (this.orderInfo.orderTotalSummary.grandTotal - this.couponInfo.amountOff) : this.orderInfo.orderTotalSummary.grandTotal
    }
  },
  methods: {
    goAddress(){
      wx.navigateTo({
        url: '../address/main?from=commit'
      })
    },

    getAddressList(){
      fly.get('/apps/jp/customer/address/list').then(rsp => {
        if(rsp.code === 200 && rsp.data){
          this.address = rsp.data[0]
        }
      })
    },

    /**
     * 选择优惠券
     */
    onChooseCoupon(){
        if(this.hasCoupon){
            wx.navigateTo({
                url: './coupon/main'
            })
        }
    },

    /**
     * 立即支付
     */
    onPay(){
      if(this.payAble){
        fly.post('/shop/order/customer/commitOrder', this.orderInfo, {
          headers: {
            showLoading: true
          }
        }).then(rsp => {
          if(rsp.code === 200 && rsp.data){

            orderPay(rsp.data.id, rsp.data.orderName).then(rsp => {
              if(rsp.code === 200 && rsp.data){
                let data = rsp.data
                wx.requestPayment({
                'timeStamp': data.timeStamp,
                'nonceStr': data.nonceStr,
                'package': data.pkg,
                'signType': 'MD5',
                'paySign': data.paySign,
                'success':function(res){
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success'
                    })
                    wx.navigateTo({
                      url: '../order/main?status=all'
                    })
                },
                'fail':function(res){
                  wx.showToast({
                    title: '支付失败',
                    icon: 'none'
                  })
                  wx.navigateTo({
                      url: '../order/main?status=ordered'
                    })
                }
              })
              }
            })
          }
        })
      }
    },

    getCouponList(){
        const item = this.orderInfo.shopOrderItems[0]
        const query = `?stockId=${item.productStock.id}&stockNum=${item.quantity}`
        fly.get('/apps/jp/customer/coupon/product/available/list' + query).then(rsp => {
            this.hasCoupon = (rsp.code === 200 && rsp.data && rsp.data.length > 0)
        })
    },
  },
  onShow(){
    if(wx.getStorageSync('_orderInfo')){
        this.orderInfo = wx.getStorageSync('_orderInfo')

        this.orderInfo.paymentMethodType = 'wx'
        this.orderInfo.tenantId = wx.getStorageSync('tenantId')

        this.getCouponList()
        if(wx.getStorageSync('useCouponItem')){
            this.couponInfo = wx.getStorageSync('useCouponItem')
            this.orderInfo.couponId = this.couponInfo.id
            this.hasCoupon = true
        }

        if(wx.getStorageSync('selectedAddress')){
          this.address = wx.getStorageSync('selectedAddress')
          this.orderInfo.addressId = this.address.id
          this.orderInfo.shippingAddress = this.address.area + this.address.detail
          this.orderInfo.buyerName = this.address.contactName
          this.orderInfo.buyerPhone = this.address.mobileNo
        }else{
          // this.getAddressList()
        }
    }else{
      wx.navigateBack() 
    }
  }
}
</script>

<style lang="less">
@import "~assets/less/color.less";
.page-order-pay {
  min-height: 100vh;
  background-color: #f7f8f9;
  .order-address{
    display: flex;
    align-items: center;
    padding: 30rpx 0;
    background-color: #fff;
    .left{
      padding: 0 30rpx;
      .iconfont{
        font-size: 24px;
      }
    }
    .center{
      flex: 1;
      line-height: 1.8;
      .area{
        color: #666;
      }
      .detail{
        color: #999;
      }
      .phone{
        color: #666;
      }
    }
    .right{
      padding: 0 30rpx;
      .iconfont{
        font-size: 20px;
      }
    }
  }
  .order-address-empty{
    padding: 100rpx 0;
    text-align: center;
    color: #707070;
    line-height: 2;
    background-color: #fff;
    .iconfont{
      font-size: 20px;
    }
  }

  .order-good-info{
    padding-left: 30rpx;
    margin: 30rpx 0;
    background-color: #fff;
    .title{
      line-height: 100rpx;
      border-bottom: 1px solid #eee;
    }
    .good-list{
      .good-item{
        display: flex;
        align-items: center;
        border-bottom: 1px solid #eee;
        .thumb{
          padding: 20rpx 0;
          .thumb-img{
            display: block;
            width: 160rpx;
            height: 160rpx;
          }
        }
        .info{
          flex: 1;
          padding: 0 30rpx;
          .good-name{

          }
          .good-price{
            margin-top: 20rpx;
          }
        }
      }
    }

    .form-item{
      display: flex;
      align-items: center;
      padding-right: 30rpx;
      line-height: 100rpx;
      border-bottom: 1px solid #eee;
      .label{
        padding-right: 20rpx;
      }
      .value{
        flex: 1;
        text-align: right;
        input{
          display: block;
          width: 100%;
        }
      }
    }
  }

  .ft-handle{
    display: flex;
      align-items: center;
      background-color: #fff;
    .num{
      flex: 1;
      line-height: 100rpx;
      color: @primary;
      padding: 0 30rpx;
    }
    .btn{
      padding: 0 2em;
      line-height: 100rpx;
      color: #fff;
      background-color: @primary;
      &.disabled{
        background-color: #ccc;
      }
    } 
  }
}
</style>
