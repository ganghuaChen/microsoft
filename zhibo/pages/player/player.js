var app = getApp()
// pages/player/player.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    livePlayAddressRtmp: '',
    isPlaying: false
  },

  statechange(e) {
    console.log(e.detail.code);
    switch (e.detail.code) {
      case 2002:
        wx.showToast({ title: '连接成功', icon: 'success' });
        break;
      case 2004:
        this.setData({ startPlay: true });
        break;
      case 2103:
        wx.showToast({ title: '断开连接，正在重连', icon: 'none' });
        break;
      case -2301:
        wx.showToast({ title: '和远程服务断开连接', icon: 'none' });
        break;
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      livePlayAddressRtmp: wx.getStorageSync('livePlayAddressRtmp')
    })

    //推流时让手机保持不锁频
    // wx.setKeepScreenOn({
    //   keepScreenOn: true,
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})