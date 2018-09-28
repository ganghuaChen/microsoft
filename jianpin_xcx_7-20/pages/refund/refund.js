// pages/refund/refund.js
var app = getApp(),
openId = wx.getStorageSync('openid')
Page({
  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let refundReason = wx.getStorageSync('refundReason'),
      openid = wx.getStorageSync('openid'),
      orderSn = options.order_sn,
      that = this
    this.setData({
      orderSn: orderSn
    })
    if(refundReason != undefined&&refundReason.length > 0){
      for (let i = refundReason.length-1;i >= 0 ; i--){
        if (refundReason[i].orderSn == orderSn){
          this.setData({
            reason: refundReason[i].reason
          })
          break
        }
      }
    }
    wx.request({
      url: app.globalData.hostname + 'home/index/shop_orderdetail',
      data: {
        openid: openid,
        ordersn: orderSn
      },
      success: function (res) {
        console.log(res)
        that.setData({
          goods: res.data.result[0].goods,
          o_tariff: res.data.result[0].o_tariff,
          price: res.data.result[0].price
        })
      }
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  syncInput: function (event) {
    this.setData({
      reason: event.detail.value
    })
  },
  update: function () {
    let that = this,
        reason = that.data.reason
    if(reason != undefined &&reason != null){
      console.log(openId, that.data.reason,that.data.orderSn)
      wx.request({
        url: app.globalData.hostname + 'home/index/return_goods',
        data: {
          openid: openId,
          reason: that.data.reason,
          ordersn: that.data.orderSn
        },
        success: function(res){
          console.log(res)
          wx.showModal({
            title: '提交成功',
            content: '请等待审核通过，在退款订单中查看！',
            success: function(res){
              wx.navigateBack({
                delta: 1
              })
            }
          })
        }
      })
    }else{
      wx.showToast({
        title: '原因不能为空',
        image:"../../images/warn.png"
      })
    }
  },
  cancel: function () {
    let that = this
    if(this.data.reason){
      wx.showActionSheet({
        itemList: ['保存草稿', '放弃保存'],
        success: function (res) {
          switch (res.tapIndex){
            case 0:
            let refundReason = wx.getStorageSync('refundReason')||[]
            if(refundReason){
              let orderSn = that.data.orderSn,
              reason = that.data.reason
              refundReason.push({orderSn,reason})
              wx.setStorageSync('refundReason', refundReason)
            }else{
              let orderSn = that.data.orderSn,
                reason = that.data.reason
              refundReason.push({ orderSn, reason })
              wx.setStorageSync('refundReason', refundReason)
            }
              break
            case 1:
            wx.navigateBack({
              delta: 1
            })
          }
        }
      })
    }
  }
})