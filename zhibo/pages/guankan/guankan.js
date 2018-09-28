var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    liveInfo: {}
  },

  /**
   * 获取直播间信息
   */
  getLiveInfo(contentId) {
    wx.request({
      url: app.globalData.api.contentDetail + contentId,

      success: (res) => {
        if (res.data.data) {
          this.setData({
            liveInfo: res.data.data
          })
          wx.setStorageSync('livePlayAddressRtmp', res.data.data.channel.livePlayAddressRtmp)
        }
      }
    })
  },

  /**
   * 开始观看直播
   */
  goPlayer() {
    wx.navigateTo({
      url: '../player/player',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.contentId) {
      this.getLiveInfo(options.contentId)
    } else {
      this.getLiveInfo('201808022030308983')
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})