// pages/refundInfo/refundInfo.js
var app = getApp(),
openId = wx.getStorageSync('openid')
Page({
  /**
   * 页面的初始数据
   */
  data: {
    progressText: ['通过初审','寄出物品','卖家验货','完成退款'],
    disabled:true,
    tijiao:1
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let orderSn = options.order_sn,
    that = this
    wx.request({
      url: app.globalData.hostname +'home/index/return_info',
      data:{
        ordersn : orderSn
      },
      success :function(res){
        console.log(res)
        let progress = Number(res.data.status),
          progressText = []
        for (let i = 0; i < progress;i++){
          progressText.push(that.data.progressText[i])
        }
        if (res.data.status == 1){
          if (res.data.result.expresssn == ''){
            that.setData({
              disabled:false
            })
          }
          that.setData({
            r_address: res.data.result.address,
            r_phone: res.data.result.phone,
            r_username: res.data.result.username,
            orderSn: orderSn,
            progressText: progressText,
            express: res.data.result.express,
            mailCompany: res.data.result.express,
            expresssn: res.data.result.expresssn,
            mailNum: res.data.result.expresssn
          })
        }
        wx.hideLoading()
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
  syncMailCompany: function(event){
    let mailCompany = event.detail.value
    this.setData({
      mailCompany : mailCompany
    })
  },
  syncMailNum: function (event) {
    let mailNum = event.detail.value
    this.setData({
      mailNum: mailNum
    })
  },
  back: function(){
    wx.navigateBack({
      delta: 1
    })
  },
  updateRefundInfo : function(){
    let that = this
    var tijiao = that.data.tijiao
    console.log(that.data.orderSn, that.data.mailCompany, that.data.mailNum)
    if (tijiao == 1){
      that.setData({
        disabled:false,
        tijiao:2
      })
    }else{
      // return
      wx.request({
        url: app.globalData.hostname + 'home/index/return_email',
        data: {
          ordersn: that.data.orderSn,
          express: that.data.mailCompany,
          expresssn: that.data.mailNum
        },
        success: function (res) {
          console.log(res)
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            success: function (res) {
              setTimeout(function () {
                wx.navigateBack({
                  delta: 1
                })
              }, 1500)
            }
          })
        }
      })
    }

  }
})