// pages/commonProblem/commonProblem.js
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
    var that = this
    wx.request({
      url: app.globalData.hostname + 'home/index/Qanda',
      success: function(res) {
        if(res.data.status == 1){
          var result = res.data.result
          console.log(result)
          that.setData({
            result:result
          })
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})