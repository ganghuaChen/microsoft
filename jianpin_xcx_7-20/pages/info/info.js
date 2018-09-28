// pages/info/info.js
var app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    couponState : false,
    cart :[],
    cartCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this,
      activity = Boolean(options.activity)
    this.setData({
      activity : activity
    })
    if(this.data.activity){
      console.log('当前商品是秒杀商品：',this.data.activity)
      wx.request({
        url: app.globalData.hostname +'home/index/seckillgoods',
        data: {
          id: options.goodsId
        },
        success: function (res) {
          // return
          that.setData({
            goods: res.data.result,
            goodsId: options.goodsId
          })
          that.calcCartCount()
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }else{
      wx.request({
        url: app.globalData.hostname + 'home/index/goods',
        data: {
          id: options.goodsId
        },
        success: function (res) {
          console.log(res)
          // return
          that.setData({
            goods: res.data.result,
            goodsId: options.goodsId,
            parm: res.data.result[0].parameter
          })
          that.calcCartCount()
        },
        fail: function (res) {
          console.log(res)
        }
      })
    }
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: this.data.goods[0].goods_name,
      path: '/pages/info/info?goodsId=' +this.data.goodsId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  // 预览图片
  previewImg: function(event){
    let goods = this.data.goods
    wx.previewImage({
      current: goods[0].carousel[event.target.id],
      urls: goods[0].carousel
    })
  },
  // 显示优惠信息
  showCoupon: function(){
    this.setData({
      couponState: !this.data.couponState
    })
  },
  
  addCart: function(){
    app.aldstat.sendEvent("加入购物车");
    // 获取商品ID
    let goodsId = this.data.goodsId,
    // 获取本地购物车列表
    cart = wx.getStorageSync('cart'),
    index = null
    // 判断购物车是否为空
    if (cart.length > 0){
      // 遍历判断是否存在
      for (let i = cart.length-1;i >= 0;i--){
        if (cart[i].goodsId == goodsId){
          index = i
        }
      }
      // 存在时增减数量
      if(index != null){
        cart[index].count++
        wx.setStorageSync('cart', cart)
      }else{
        // 存在时新增商品到购物车
        let goods = { goodsId: goodsId, count: 1 }
        cart.push(goods)
        wx.setStorageSync('cart', cart)
      }
    }else{
      // 新增商品到购物车
      let cart = [],
      goods = { goodsId: goodsId, count: 1 }
      cart.push(goods)
      wx.setStorageSync('cart', cart)
    }
    this.calcCartCount()
    // 提示添加成功
    wx.showToast({
      title: '添加成功',
      icon: 'success'
    })
  },
  // 计算购物车商品数量
  calcCartCount: function(){
    let cart = wx.getStorageSync('cart'),
    count = 0
    for(let i = 0,len = cart.length;i < len;i++){
      count += Number(cart[i].count)
    }
    this.setData({
      cartCount : count
    })
  },
  disableTips: function(){
    wx.showToast({
      title: '无法加入购物车',
      image: '../../images/warn.png'
    })
  },
  switchToCart: function(){
    wx.switchTab({
      url:"../cart/cart"
    })
  },
  confirm: function(){
    if (this.data.activity){
      wx.navigateTo({
        url: '../confirmOrder/confirmOrder?activity=true&goodsId=' + this.data.goodsId
      })
    }else{
      wx.navigateTo({
        url: '../confirmOrder/confirmOrder?goodsId=' + this.data.goodsId
      })
    }
  }
})