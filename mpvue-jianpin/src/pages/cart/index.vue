<template>
  <div class="page-cart">
    <div class="cart-empty" v-if="shoppingCartItems.length === 0 && hasLoad">
        <img src="/static/images/emptyCart.png" mode="aspectFit" class="empty-img">
        <div class="empty-text">您的购物车是空的</div>
    </div>

    <div class="cart-info" v-if="shoppingCartItems && shoppingCartItems.length > 0">
      <div class="hd">
          <img src="/static/images/logo.png" mode="aspectFit" class="logo-img"> 尖品好货
          <!-- <span class="pull-right">编辑</span> -->
      </div>
      <div class="bd scroll-view">
        <div class="cart-item-list">
          <div class="cart-item" v-for="item in shoppingCartItems" :key="item.id">
            <div class="check-area" @tap="onSelectOne(item)">
              <checkbox 
                :checked="item.checked" 
                name="shopCartItem"/>
            </div>
            <div class="info-area">
              <div class="inner">
                <div class="thumb">
                  <img :src="item.productObject.goodsImage" mode="aspectFit" class="thumb-img">
                </div>
                <div class="info">
                  <div class="name">{{item.productObject.goodsName}}</div>
                  <div class="stock">{{item.optionValue}}</div>
                  <div class="price-num">
                    <span class="price"> ￥{{item.productStock.goodsPrice}} </span>
                    <div class="item-count pull-right">
                        <span class="sym sym-minus" :class="{disabled: item.quantity === 1}" @tap="onMinus(item)">-</span>
                        <input class="sym sym-num" type="number" v-model="item.quantity"/>
                        <span class="sym sym-add" @tap="onAdd(item)">+</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <div class="ft">
        <div class="inner">
          <div class="all-select">
            <checkbox-group @change="onSelectAll" class="all-checkbox">
              <checkbox :value="true" :checked="isAllSelected"/>
            </checkbox-group> 全选</div>
          <div class="total">￥{{cartTotal}} </div>
          <div class="order" @tap="onOrder">结算</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fly from "@/utils/fly";
export default {
  data() {
    return {
      info: undefined,
      buyNum: 1,
      hasLoad: false,

      shoppingCartItems: []
    }
  },
  computed: {
    cartItemIds(){
      let arr = []
      this.shoppingCartItems.forEach(item => {
        if(item.checked){
          arr.push(item.id)
        }
      })
      return arr
    },
    cartTotal(){
      let num = 0
      this.shoppingCartItems.forEach(item => {
        if(item.checked){
          num += item.quantity * item.productStock.goodsPrice
        }
      })
      return num
    },
    
    allIds(){
      let arr = []
      if(this.shoppingCartItems){
        this.shoppingCartItems.forEach(item => {
          arr.push(item.id)
        })
      }
      return arr
    },
    isAllSelected(){
      let ok = true
      if(this.shoppingCartItems){
        this.shoppingCartItems.forEach(item => {
          if(!item.checked){
            ok = false
          }
        })
      }
      return ok
    }
  },
  methods: {
    onMinus(obj) {
      if (obj.quantity > 1) {
        obj.quantity--;
        this.updateQuantity(obj)
      }
    },

    onAdd(obj) {
      obj.quantity++
      this.updateQuantity(obj)
    },

    getCartInfo() {
      fly.post("/shop/cart/customer/view", {}, {
        headers: {
          showLoading: true
        }
      }).then(rsp => {

        if (rsp.code === 200 && rsp.data && rsp.data.shoppingCartItems) {
          
          rsp.data.shoppingCartItems.forEach((item, index) => {
            if(item.productStock){
              let optionValue = []
              for(let i=1; i<=4;i++){
                if(item.productStock['optionValue'+i]){
                  optionValue.push(item.productStock['optionValue'+i])
                }
              }
              rsp.data.shoppingCartItems[index].optionValue = optionValue.join('；')
            }
          })

          this.shoppingCartItems = rsp.data.shoppingCartItems

        }

        this.hasLoad = true
      })
    },

    updateQuantity(cartItem){
      fly.post("/shop/cart/customer/updateQuantity", {
        id: cartItem.id,
        quantity: cartItem.quantity
      }, {
        headers: {
          showLoading: true
        }
      }).then(rsp => {
        if (rsp.code === 200) {
          console.log('更新数量成功')
        }
      })
    },


    // 购物车checkout
    onOrder(){
      if(this.cartItemIds.length > 0){
        fly.post("/shop/order/customer/checkout", this.cartItemIds, {
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
      }else{
        wx.showToast({
          title: '您还未选择商品哦~',
          icon: 'none'
        })
      }
    },

    //选中全部商品
    onSelectAll(e){
      if(e.mp.detail.value[0]){
        this.shoppingCartItems.forEach((item,index) => {
          this.shoppingCartItems[index].checked = true
        })
      }else{
        this.shoppingCartItems.forEach((item,index) => {
          this.shoppingCartItems[index].checked = false
        })
      }
    },

    // 选中单个商品
    onSelectOne(item){
      item.checked = !item.checked
    }
  },
  onShow() {
    this.getCartInfo()
  }
}
</script>

<style lang="less">
@import "~assets/less/color.less";
.page-cart {
  min-height: 100vh;
  background-color: #f7f8f9;
  .cart-empty {
    padding-top: 40%;
    .empty-img {
      display: block;
      //   width: 300rpx;
      height: 180rpx;
      margin: 0 auto;
    }
    .empty-text {
      text-align: center;
      margin-top: 50rpx;
      font-size: 13px;
      color: #666;
    }
  }
  .cart-info {
    height: 100vh;
    display: flex;
    flex-direction: column;
    .hd {
      padding: 0 30rpx;
      line-height: 100rpx;
      border-bottom: 1px solid #eee;
      border-bottom: 0.5px solid #eee;
      background-color: #fff;
      .logo-img {
        position: relative;
        top: -2px;
        display: inline-block;
        width: 36rpx;
        height: 36rpx;
        vertical-align: middle;
      }
    }
    .bd {
      flex: 1;

      .cart-item-list {
        background-color: #fff;
        .cart-item {
          display: flex;
          align-items: center;
          .check-area {
            padding: 0 30rpx;
            .jp-check{
              font-size: 24px;
            }
          }
          .info-area {
            flex: 1;
            font-size: 14px;
            border-bottom: 1px solid #eee;
            .inner {
              display: flex;
              align-items: center;
              .thumb {
                .thumb-img {
                  display: block;
                  width: 100rpx;
                  height: 100rpx;
                }
              }
              .info {
                flex: 1;
                padding: 30rpx;
                line-height: 1.7;
                .name {
                  color: #444;
                  
                  display: -webkit-box;
                  -webkit-line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;
                }
                .stock{
                  color: #999;
                }
                .price-num {
                  margin-top: 20rpx;
                  line-height: 70rpx;
                  .price{
                      color: @primary;
                  }
                }
              }
            }
          }
          &:last-child{
            .info-area {
              
              border-bottom: none;
            }
          }
        }
      }
      .item-count {
        display: inline-block;
        .sym {
          display: inline-block;
          vertical-align: middle;
          text-align: center;
          height: 70rpx;
          line-height: 66rpx;
          padding: 0 1em;
        }
        .sym-num {
          width: 2em;
          text-align: center;
          border-top: 1px solid #eee;
          border-bottom: 1px solid #eee;
        }
        .sym-add {
          font-size: 18px;
          border: 1px solid #eee;
          border-radius: 0 4px 4px 0;
        }
        .sym-minus {
          font-size: 18px;
          border: 1px solid #eee;
          border-radius: 4px 0 0 4px;
          &.disabled {
            color: #ccc;
          }
        }
      }
    }
    .ft {
      background-color: #fff;
      .inner {
        width: 100%;
        display: flex;
        line-height: 100rpx;
        background-color: #eee;
        .all-select {
          padding: 0 30rpx;
          .all-checkbox{
              display: inline;
              position:relative;
              top:-2px;
            }
        }
        .total {
          flex: 1;
          padding-right: 30rpx;
          text-align: right;
          color: @primary;
        }
        .order {
          padding: 0 3em;
          color: #fff;
          background-color: @primary;
        }
      }
    }
  }
}
</style>
