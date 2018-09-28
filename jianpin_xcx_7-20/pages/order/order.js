// pages/order/order.js
const app = getApp(),
  hostname = app.globalData.hostname,
  that = this

Page({
  /**
   * 页面的初始数据
   */
  data: {
    tab: ["", "", "", ""]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this,
      id = Number(options.id)
    this.setData({
      id: id,
      onload: false,
      openId: wx.getStorageSync('openid')
    })
    // 获取订单
    that.refreshOrder()
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
  // 重新获取订单
  refreshOrder: function () {
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    let that = this
    // 请求订单列表
    wx.request({
      url: hostname + 'home/index/shop_order',
      data: { openid: that.data.openId, },
      success: function (res) {
        that.setData({
          orderList: res.data.result
        })
        that.orderGuide()
        if (!that.data.onLoad) {
          // 切换标签页
          that.turnToId(that.data.id)
          that.setData({ onLoad: true })
        }
        wx.hideLoading()
      }
    })
  },
  // 切换标签页
  switchTab: function (event) {
    let that = this,
      index = event.currentTarget.id
    that.turnToId(index)
  },
  // 寻找当前订单列表
  orderGuide: function () {
    let that = this,
      orderList = that.data.orderList,
      orderIndex = that.data.orderIndex
    if (orderList[orderIndex]){
      that.setData({ currentOrder: orderList[orderIndex] })
    }else{
      that.setData({ currentOrder: [] })
    }
    
  },
  // 转换成可使用的id
  turnToId: function (index) {
    let that = this,
      tab = that.data.tab,
      orderList = that.data.orderList
    tab.forEach(function (value, index) {
      tab[index] = ""
    })
    switch (Number(index)) {
      case 11:
        tab[0] = "active"
        break
      case 1:
        tab[1] = "active"
        break
      case 2:
        tab[2] = "active"
        break
      case 3:
        tab[3] = "active"
        break
    }
    that.setData({ tab: tab, orderIndex: index })
    that.orderGuide()
  },
  // 支付
  pay: function (event) {
    let orderSn = event.currentTarget.dataset.ordersn
    wx.navigateTo({
      url: '../confirmOrder/confirmOrder?order_sn=' + orderSn
    })
  },
  // 订单详情
  orderDetail: function (event) {
    let orderSn = event.currentTarget.dataset.ordersn
    wx.navigateTo({
      url: '../orderDetail/orderDetail?order_sn=' + orderSn
    })
  },
  // 退款
  refund: function (event) {
    let orderSn = event.currentTarget.dataset.ordersn
    wx.navigateTo({
      url: '../refund/refund?order_sn=' + orderSn
    })
  },
  // 取消订单
  cancelOrder: function (event) {
    let orderSn = event.currentTarget.dataset.ordersn,
      that = this
    wx.showModal({
      title: '提示',
      content: '是否取消订单',
      success: function (res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.hostname + 'home/index/cancel_order',
            data: {
              openid: that.data.openId,
              ordersn: orderSn
            },
            success: function (res) {
              console.log(res)
              wx.showToast({
                title: '取消成功',
                icon: "success"
              })
              // 更新订单信息
              that.refreshOrder()
            }
          })
        } else if (res.cancel) {
          return false
        }
      }
    })
  },
  // 确认收货
  confirmGoods: function (event) {
    let orderSn = event.currentTarget.dataset.ordersn,
      that = this
    wx.showModal({
      title:"确认收货",
      content: '确认收货后不可更改状态',      
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#999',
      confirmText: '确认收货',
      confirmColor: '#ff3965',
      success: function(res) {
        if(res.confirm){
          wx.request({
            url: app.globalData.hostname + 'home/index/goods_receipt',
            data: {
              openid: that.data.openId,
              ordersn: orderSn
            },
            success: function (res) {
              console.log(res)
              wx.showToast({
                title: '确认成功',
                icon: "success"
              })
              // 更新订单信息
              that.refreshOrder()
            }
          })
        }else if(res.cancel){
          return
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})