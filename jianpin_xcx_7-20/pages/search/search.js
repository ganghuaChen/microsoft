// pages/search/search.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    resultState: false,
    input: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {},
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
  syncInput: function (event) {
    this.setData({
      input: event.detail.value
    })
  },
  back: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  clear: function () {
    this.setData({
      input: null,
      resultState: false
    })
  },
  search: function () {
    let that = this 
    wx.request({
      url: app.globalData.hostname + 'home/index/search_goods',
      data:{
        name : that.data.input
      },
      success: function(res){
        console.log(res)
        that.setData({
          resultState: true,
          result: res.data.result,
        })
        if(res.data.status == -1){
          that.setData({
            emptyFlag: true
          })
        }else{
          that.setData({
            emptyFlag: false
          })
        }
      }
    })
  }
})