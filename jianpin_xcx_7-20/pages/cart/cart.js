// pages/cart/cart.js
const openId = wx.getStorageSync('openid')

var app = getApp()
Page({
  data:{
    startX : null,
    email: null,//商品邮费
    price: null//商品总价
  },
  onLoad:function(){
    this.getCart()
    this.calcPrice()
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log(res.target)
    }
    return {
      title: '尖品',
      path: '/pages/index/index',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
    this.getCart()
    this.calcPrice()
  },
  onHide:function(){
    // 页面隐藏
  },
  getCart: function(){
    let cart = wx.getStorageSync('cart'),
    goodsIdArr = [],
    that = this
    if(cart.length > 0){
      for (let i = 0, len = cart.length; i < len; i++) {
        goodsIdArr.push(Number(cart[i].goodsId))
      }
      wx.request({
        url: app.globalData.hostname + 'home/index/goods',
        data: {
          id: goodsIdArr
        },
        success: function (res) {
          console.log(res)
          let result = res.data.result
          for (let i = result.length - 1; i >= 0; i--) {
            for (let j = result.length - 1; j >= 0; j--) {
              if (cart[i].goodsId == result[j].id) {
                cart[i].storeName = result[j].seller_name
                cart[i].imgSrc = result[j].goods_image
                cart[i].title = result[j].goods_name
                cart[i].price = result[j].goods_price
                cart[i].import = result[j].is_imported
              }
            }
          }
          that.setData({
            cart: cart
          })
        }
      })
    }
  },
  calcPrice: function(){
    let cart = wx.getStorageSync('cart'),
      goods = [],
      that = this,
      selectedCount = 0
    for (let i = 0, len = cart.length; i < len; i++) {
      // 判断是否全选
      if(cart[i].selectedFlag == true){
        goods.push({
          goodsid: Number(cart[i].goodsId),
          count: Number(cart[i].count)
        })
        selectedCount++
        if (selectedCount == len){
          this.setData({
            selectAll : true
          })
        }else{
          this.setData({
            selectAll: false
          })
        }
      }
    }
    this.setData({
      cart: cart
    })
    // wx.showLoading({
    //   title: '请稍后',
    // })
    wx.request({
      url: app.globalData.hostname+'home/index/goods_money',
      data: {
        goods: goods,
        openid: 'asdasd'
      },
      success: function (res) {
        console.log(res)
        let result = res.data.result
        that.setData({
          mailCost: result.email,
          coupon: result.discount,
          rawPrice: result.price,
          goodsPrice: result.paid,
          finalPrice: (Number(result.paid) + Number(result.email)).toFixed(2),
          tariff: result.tariff
        })
        // wx.hideLoading()
      }
    })
  },
  // 增加商品数量
  cart_add: function (e) {
    let goodsId = e.target.dataset.goodsid,
    cart = this.data.cart,
    index = null,
    that = this
    for(let i = 0,len = cart.length;i<len;i++){
      if (goodsId == cart[i].goodsId){
        index = i
        break
      }
    }
    let newCart = cart
    newCart[index].count++
    console.log(newCart)
    wx.setStorageSync('cart', newCart)
    // 请求服务器计算价格
    this.calcPrice()
  },
  // 减少商品数量
  cart_minus: function(e){
    let goodsId = e.target.dataset.goodsid,
      cart = wx.getStorageSync('cart'),
      index = null
    for (let i = 0, len = cart.length; i < len; i++) {
      if (goodsId == cart[i].goodsId) {
        index = i
        break
      }
    }
    let newCart = cart
    if (newCart[index].count>1){
      newCart[index].count--
    }else{
      newCart[index].count = 1
    }
    wx.setStorageSync('cart', newCart)
    // 请求服务器计算价格
    this.calcPrice()
  },
  touchS: function(event){
    this.setData({
      startX: event.touches[0].pageX
    })
  },
  checkActionS: function (event) {
    this.setData({
      pageStartX: event.touches[0].pageX
    })
  },
  checkActionE: function(event){
    if (this.data.pageStartX - event.changedTouches[0].pageX > 40) {
      console.log(1)
    } else {
      let newCart = this.data.cart
      // 清空选中状态
      for (let i = 0, len = newCart.length; i < len; i++) {
        newCart[i]["selected"] = ""
      }
      this.setData({
        cart: newCart
      })
    }
  },
  touchE: function(event){
    if (this.data.startX - event.changedTouches[0].pageX > 40){
      let newCart = this.data.cart
      newCart[event.currentTarget.id]["selected"] = "del_selected"
      this.setData({
        cart: newCart
      })
    }else{
      let newCart = this.data.cart
      // 清空选中状态
      for(let i = 0,len = newCart.length;i < len;i++){
        newCart[i]["selected"] = ""
      }
      this.setData({
        cart : newCart
      })
    }
  },
  del: function(event){
    let id = Number(event.target.id),
    newCart = this.data.cart
    newCart.splice(id,1)
    this.setData({
      cart : newCart
    })
    wx.setStorageSync('cart',this.data.cart)
    this.calcPrice()
  },
  // 选择商品
  select: function(e){
    let id = e.currentTarget.id,
    newCart = this.data.cart
    // 获取当前商品状态
    if (newCart[id].selectedFlag){
      newCart[id].selectedFlag = false
    }else{
      newCart[id].selectedFlag = true
    }
    wx.setStorageSync('cart', newCart)
    this.calcPrice()
  },
  selectAll: function(){
    let newCart = this.data.cart,
    selectAll = this.data.selectAll
    // 获取当前商品状态
    if(selectAll){
      for (let i = 0, len = newCart.length; i < len; i++) {
        newCart[i].selectedFlag = false
      }
      this.setData({
        selectAll: false
      })
    }else{
      for (let i = 0, len = newCart.length; i < len; i++) {
        newCart[i].selectedFlag = true
      }
      this.setData({
        selectAll: true
      })
    }
    wx.setStorageSync('cart', newCart)
    this.calcPrice()
  },
  infoNav: function(event){
    let id = Number(event.currentTarget.dataset.goodsid)
    wx.navigateTo({
      url: '../info/info?goodsId='+id
    })
  },
  goPay: function(){
    app.aldstat.sendEvent("结算购物车中的商品");
    let that = this,
    selectedArr = [],
    cart = this.data.cart
    for (let i = cart.length-1;i >= 0;i--){
      if (cart[i].selectedFlag == true){
        selectedArr.push({ goodsId:cart[i].goodsId, count:cart[i].count})
      }
    }
    if(selectedArr.length <1){
      wx.showToast({
        title: '请选择商品',
        image: "../../images/warn.png"
      })
    }else{
      wx.setStorageSync('payList', selectedArr)
      wx.navigateTo({
        url: '../confirmOrder/confirmOrder',
      })
    } 
  }
})