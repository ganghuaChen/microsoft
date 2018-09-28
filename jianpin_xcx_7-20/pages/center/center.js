// pages/center/center.js
var app = getApp()
Page({
  data:{},
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    // 获取用户信息
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(function (userInfo) {
      //更新数据
      that.setData({
        userInfo: userInfo
      })
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
  onShow:function(){
    var that = this
    wx.getSetting({
      success: function(res) {
          app.getUserInfo(function (userInfo) {
            //更新数据
            that.setData({
              userInfo: userInfo
            })
          })       
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  }
})