//index.js
const app = getApp()
Page({
  data: {
    recommendImg: "http://jp.shenmikj.com/recommend/recommend.png",
    saleState: true,
    scrolltop: 0,
    empty: null,
    ready: true,
    showLose:true,
    moneyTips: "送你新手专属礼包！",
    // moneyTips1: "1000万现金余额 限时抢！",
    empty_tips1: "恭喜您，新人专属礼包",
    //empty_tips2: "已经放入您的账户，赶紧去使用吧!"
  },
  _getGoodsInfo(that){
    //that.setData({ showLose:app.globalData.showLose })
    if (app.globalData.showLose == true){
      wx.request({
        url: app.globalData.hostname + 'home/index', //仅为示例，并非真实的接口地址,
        data: {},
        success: function (res) {
          console.log(res)
          let cart = wx.getStorageSync('cart'),
            goods = res.data.goods,
            r_goods = res.data.r_goods
          goods.forEach(function (value, index) { if (value["count"] == undefined) { goods[index]["count"] = 0 } })
          if(!r_goods){
            console.log("当前无推介商品")
          }else{
            r_goods.forEach(function (e) {
              let goods = e.goods
              for (let j = 0; j < goods.length; j++) {
                goods[j].count = 0
                that.setData({
                  r_goods
                })
              }
            })
          }          
          if (cart && cart.length > 0) {
            console.log("购物车存在商品")
            for (let i = 0, len = cart.length; i < len; i++) {
              goods.forEach(function (value, index) {
                if (value.id == cart[i].goodsId) {
                  goods[index]["count"] = cart[i].count
                }
              })
              r_goods.forEach(function (value, index) {
                // if (value.id == cart[i].goodsId) {
                //   r_goods[index]["count"] = cart[i].count
                // }
                value.goods.forEach(function (e) {
                  if (e.id == cart[i].goodsId) {
                    e.count = cart[i].count
                  }
                })
              })
            }
            console.log(goods, r_goods)
          } else {
            console.log("购物车不存在商品")
            goods.forEach(function (value, index) {
              goods[index]["count"] = 0
            })
            if(r_goods){
              r_goods.forEach(function (value, index) {
                //r_goods[index]["count"] = 0
                value.goods.forEach(function (e) {
                  e.count = 0
                })
              })
            }            
          }
          that.setData({
            goods: goods,
            r_goods: r_goods,
            imgUrls: res.data.carousel
          })
        },
        fail: function (res) { console.log(res) }
      })
    }
    //红包标题文案获取
    wx.request({
      url: app.globalData.hostname + '/home/index/new_novice_packs',
      data: {},
      success: function(res) {
        var result = res.data.result
        that.setData({ moneyTips: result.title, empty_tips1:result.content })
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({ userInfo: userInfo })

      var openid = wx.getStorageSync('openid')
      wx.showToast({
        title: '加载中',
        icon: "loading",
        mask: true,
        duration: 2000,
        success: function () {
          that.setData({ openid: openid })
        }
      })
      that.setData({ ready: false })
      wx.request({
        url: app.globalData.hostname + 'home/index/new_user',
        data: { openid: openid },
        success: function (res) {
          console.log(res);
          // 红包
          if (res.data.status == 1) {
            var showSticker = res.data.coupon.result
            setTimeout(function () {
              that.setData({
                showSticker: showSticker,
                moneyState: true,
                animation: "zoomIn"
              })
            }, 700)
          }
        }
      })
    }) 
  },
  onLoad: function () {// 获取用户信息   //ajax
    var that = this
    that._getGoodsInfo(that)
  },
  forRoot:function(){
    wx.openSetting({
              success: function(res) {
                console.log("success",res)
                if (res.authSetting["scope.userInfo"] == false){
                  console.log("ss",res.authSetting["scope.userInfo"])
                }
              },
              fail: function(res) {},
              complete: function(res) {},
            })
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
  // 关闭红包
  closeMoney: function () {
    let that = this
    this.setData({ animation: "zoomOut" })
    setTimeout(function () {
      that.setData({ moneyState: false })
    }, 700)
  },
  addCart: function (e) {
    let cart = wx.getStorageSync('cart'),
      goodsId = e.currentTarget.dataset.goodsId,
      existFlag = false,
      goodsType = e.currentTarget.dataset.type,
      goods = this.data.goods,
      r_goods = this.data.r_goods

    if (cart && cart.length > 0) {
      cart.push({ "goodsId": goodsId, count: 1 })
      wx.setStorageSync('cart', cart)
    } else {
      cart = []
      cart.push({ "goodsId": goodsId, count: 1 })
      wx.setStorageSync('cart', cart)
    }

    // 判断是商品类型
    if (goodsType == "recommend") {
      goods.forEach(function (value) {
        if (goodsId == value.id) {
          if (value.count) { value.count++ } else { value["count"] = 1 }
        }
      })
    } else {
      r_goods.forEach(function (value) {
        //if (goodsId == value.id) {
          //if (value.count) { value.count++ } else { value["count"] = 1 }
          value.goods.forEach(function(e){
            if(e.id == goodsId){
              if(e.count){e.count++}else{e.count = 1}
            }
          })
      })
    }
    this.setData({ goods: goods, r_goods: r_goods })
  },
  // 引导到商品详情
  infoNav: function (event) {
    console.log(app.aldstat.debug)
    console.log(event)
    if (event.currentTarget.dataset.goodsid == 0){
      wx.navigateTo({
        url: '../activity/activity'
      })
    }else{
      let url = "../info/info?goodsId=" + event.currentTarget.dataset.goodsid
      console.log(url)
      wx.navigateTo({ url: url, })
    }

  },
  // 滚动监听
  scrollListener: function (event) {
    if (event.detail.scrollTop > 500) {
      this.setData({ topActive: "active" })
    } else {
      this.setData({ topActive: "" })
    }
  },
  // 返回顶部
  backTop: function () {
    this.setData({ scrolltop: 0 })
  },
  // 打开红包
  open: function () {
    let openId = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.hostname + 'home/index/novice_packs',
      data: {
        openid: openId
      },
      success: function (res) {
        console.log(res)
      }
    })
    this.setData({ empty: "b_money_empty" })
  },
  // 添加至购物车
  cart_add: function (e) {
    console.log("qq1")
    let goodsId = e.currentTarget.dataset.goodsid,
      goods_type = e.target.dataset.type,
      cart = wx.getStorageSync('cart'),
      goods = this.data.goods,
      r_goods = this.data.r_goods,
      existFlag = false
    // 遍历添加至本地购物车
    // 当商品存在时
    if (cart) {
      cart.forEach(function (value, index) {
        if (value.goodsId == goodsId) {
          cart[index].count++
          existFlag = true
        }
      })
    } else {
    // 当商品不存在时
      cart = []
      if (!existFlag) {
        cart.push({"goodsId":goodsId,"count":1})
      }
    }
    if (goods_type == "goods") {
      goods.forEach(function (value, index) {
        if (value.id == goodsId) { goods[index].count++ }
      })
      this.setData({
        goods: goods
      })
    } else {
      console.log("qq1")

      r_goods.forEach(function (value, index) {
        // if (value.id == goodsId) { r_goods[index].count++ }
        r_goods[index].goods.forEach(function(e){
          if (e.id == goodsId){
            e.count++
          }
        })
      })
      this.setData({
        r_goods: r_goods
      })
      console.log(r_goods)
    }
    wx.setStorageSync('cart', cart)
  },
  cart_minus: function (e) {
    let goodsId = e.currentTarget.dataset.goodsid,
      goods_type = e.target.dataset.type,
      cart = wx.getStorageSync('cart'),
      goods = this.data.goods,
      r_goods = this.data.r_goods
    // 遍历添加至本地购物车
    // 当商品存在时
    cart.forEach(function (value, index) {
      if (value.goodsId == goodsId) {
        cart[index].count--
        if (cart[index].count <= 0){
          cart.splice(index,1)
        }
      }
    })
    if (goods_type == "goods") {
      goods.forEach(function (value, index) {
        if (value.id == goodsId) { 
          goods[index].count--
          if (goods[index].count <= 0){
            goods[index].count = 0
          }
        }
      })
      this.setData({
        goods: goods
      })
    } else {
      r_goods.forEach(function (value, index) {
        // if (value.id == goodsId) {
        //   r_goods[index].count--
        //   if (r_goods[index].count <= 0) {
        //     r_goods[index].count = 0
        //   }
        // }
        value.goods.forEach(function(e){
          if(e.id == goodsId){
            e.count--
            if(e.count <= 0){
              e.count = 0
            }
          }
        })
      })
      this.setData({
        r_goods: r_goods
      })
    }
    wx.setStorageSync('cart', cart)
  },
  onShow: function(){
    let that = this
    wx.request({
      url: app.globalData.hostname + 'home/index', //仅为示例，并非真实的接口地址,
      success: function (res) {
        console.log(res)
        let cart = wx.getStorageSync('cart'),
          goods = res.data.goods,
          r_goods = res.data.r_goods
        goods.forEach(function (value, index) { if (value["count"] == undefined) { goods[index]["count"] = 0 } })
        if(!r_goods){
          console.log("当前无推介商品")
        }else{
          r_goods.forEach(function (e) {
            let goods = e.goods
            for (let j = 0; j < goods.length; j++) {
              if (goods[j].count == undefined) {
                goods[j].count = 0
              }
            }
          })
        }      
        if (cart && cart.length > 0) {
          console.log("购物车存在商品")
          for (let i = 0, len = cart.length; i < len; i++) {
            goods.forEach(function (value, index) {
              if (value.id == cart[i].goodsId) {
                goods[index]["count"] = cart[i].count
              }
            })
            r_goods.forEach(function (value, index) {
              // if (value.id == cart[i].goodsId) {
              //   r_goods[index]["count"] = cart[i].count
              // }
              value.goods.forEach(function(e){
                if (e.id == cart[i].goodsId){
                  e.count = cart[i].count
                }
              })
            })
          }
          console.log(goods, r_goods)
        } else {
          console.log("购物车不存在商品")
          goods.forEach(function (value, index) {
            goods[index]["count"] = 0
          })
          if(r_goods){
            r_goods.forEach(function (value, index) {
              //r_goods[index]["count"] = 0
              value.goods.forEach(function (e) {
                e.count = 0
              })
            })
          }          
        }
        that.setData({
          goods: goods,
          r_goods: r_goods,
          imgUrls: res.data.carousel
        })
      },
      fail: function (res) { console.log(res) }
    })
    //用户拒绝授权之后再次请求权限
    that._getGoodsInfo(that)
  }
})