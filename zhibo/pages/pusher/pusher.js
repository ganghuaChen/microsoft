var app = getApp()
// pages/pusher/pusher.js
Page({
  statechange(e){
    if (e.detail.code == 1002){
      wx.showToast({
        title: '开播成功',
        icon: 'success',
        duration: 2000
      })
    }
  },
  onPushError(e){
    console.log(e.detail)
  },
  closePush(){

  },
  /**
   * 页面的初始数据
   */
  data: {
    pushAddress: '',
    waitingImage: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      pushAddress: wx.getStorageSync('livePushAddress') + '&record=mp4'
    })


    //推流时让手机保持不锁频
    // wx.setKeepScreenOn({
    //   keepScreenOn: true,
    // })
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