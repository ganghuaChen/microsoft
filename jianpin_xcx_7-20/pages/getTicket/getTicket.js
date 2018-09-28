// pages/coupon/coupon.js
var app = getApp()

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
    this.getTicket()
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
  getTicket: function () {
    let that = this
    wx.request({
      url: app.globalData.hostname + 'home/index/obtain_coupon',
      data:{
        openid : app.globalData.openid
      },
      success: function(res){
        if (res.data.result == null){
          that.setData({
            ticket: []
          })
        }else{
          that.setData({
            ticket: res.data.result
          })
        }
      }
    })
  },
  // 领取优惠券
  get: function(event){
    let couponid = Number(event.currentTarget.dataset.couponid),
      index = Number(event.currentTarget.id),
      that = this
    wx.request({
      url: app.globalData.hostname + 'home/index/receive_coupon',
      data:{
        couponid: couponid,
        openid : app.globalData.openid
      },
      success: function(res){
        wx.showToast({
          title: '领取成功',
          icon: 'success'
        })
        that.getTicket()
      }
    })
  }
})