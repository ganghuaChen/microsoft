// pages/coupon/coupon.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    
  },
  onLoad: function (options) {
    let that = this
    this.setData({
      openId: wx.getStorageSync('openid')
    })
    wx.request({
      url: app.globalData.hostname + 'home/index/user_coupon',
      data: {
        openid: that.data.openId
      },
      success: function (res) {
        console.log(res)
        if (res.data.result == null){
          that.setData({
            allTicket: [],
            enableState: "active",
            disableState: "",
            usedState: ""
          })
        }else{
          that.setData({
            allTicket: res.data.result,
            enableState: "active",
            disableState: "",
            usedState: ""
          })
        }
        that.getTicket(0)
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
  getTicket: function(index){
    switch (index) {
      case 0:
        if (this.data.allTicket[1] == undefined) {
          this.setData({
            ticket: []
          })
        } else {
          this.setData({
            ticket: this.data.allTicket[1]
          })
        }
        break
      case 1:
        if (this.data.allTicket[0] == undefined) {
          this.setData({
            ticket: []
          })
        } else {
          this.setData({
            ticket: this.data.allTicket[0]
          })
        }
        break
      case 2:
        if (this.data.allTicket[2] == undefined){
          this.setData({
            ticket: []
          })
        }else{
          this.setData({
            ticket: this.data.allTicket[2]
          })
        }
        break
    }
  },
  changeTab: function(e){
    let index = Number(e.currentTarget.id)
    switch (index) {
      case 0:
        this.setData({
          enableState: "active",
          disableState: "",
          usedState: ""
        })
        this.getTicket(0)
        break
      case 1:
        this.setData({
          enableState: "",
          disableState: "active",
          usedState: ""
        })
        this.getTicket(1)
        break
      case 2:
        this.setData({
          enableState: "",
          disableState: "",
          usedState: "active"
        })
        this.getTicket(2)
        break
    }
  }
})