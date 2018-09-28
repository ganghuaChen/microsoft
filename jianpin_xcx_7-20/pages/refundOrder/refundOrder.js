// pages/order/order.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户openid
    let that = this,
      openid = wx.getStorageSync('openid')
    wx.request({
      url: app.globalData.hostname+'home/index/shop_order',
      data: {
        openid: openid,
      },
      success: function (res) {
        console.log(99)
        console.log(res)
      // r_status    0表示待审核     1表示同意退货   2表示不同意
        let order = []
        if (res.data.result['refundstatus'] != null) {
          res.data.result['refundstatus'].forEach(function (value, index, item) {
            if (value.refundstatus == 1) {
              value["returned"] = false
              order.push(value)
            }
          })
          that.setData({
            order: order
          })
        }else{
          if (res.data.result['2'] != null){
            res.data.result['2'].forEach(function (value, index, item) {
              if (value.refundstatus == 1) {
                value["returned"] = false
                order.push(value)
              }
            })
          }
          if (res.data.result['3'] != null) {
            res.data.result['3'].forEach(function (value, index, item) {
              if(value.refundstatus == 1){
                value["returned"] = false
                order.push(value)  
              }
            })
          }
          if (res.data.result['4'] != null) {
            res.data.result['4'].forEach(function (value, index, item) {
              if(value.refundstatus == 1){
                value["returned"] = false
                order.push(value)  
              }
            })
          }
          if (res.data.result['-1'] != null) {
            res.data.result['-1'].forEach(function (value,index,item) {
              order.push(value)
            })
          }
          that.setData({
            order : order
          })
        }
      },
      fail: function(res){
        console.log(res)
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
  detailNav: function(event){
    let orderSn = event.currentTarget.dataset.ordersn
    wx.navigateTo({
      url: '../orderDetail/orderDetail?order_sn='+orderSn
    })
  },
  refundInfo: function(event){
    let orderSn = event.currentTarget.dataset.ordersn
    wx.navigateTo({
      url: '../refundInfo/refundInfo?order_sn=' + orderSn
    })
  }
})