// pages/identity/identity.js
const app = getApp()
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
    let that = this
    this.setData({
      openId: wx.getStorageSync('openid')
    })
    this.getIdentity()
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
  onShow: function(){
    let that = this
    this.getIdentity()
  },
  selectDefult: function(event){
    let index = Number(event.currentTarget.id),
      identityList = this.data.identityList,
      that = this
    wx.showLoading({
      title:'加载中'
    })
    for (let i = 0, len = identityList.length;i < len ;i++){
      identityList[i].selected = ''
    }
    identityList[index]['selected'] = 'selected'
    this.setData({
      identityList: identityList,
      id: id
    })
    let id = Number(identityList[index].id)
    wx.request({
      url: app.globalData.hostname+'home/index/use_customs',
      data:{
        id: id,
        openid: that.data.openId
      },
      success: function(res){
        that.getIdentity()
      }
    })
  },
  addIdentityNav: function () {
    wx.navigateTo({
      url: '../addIdentity/addIdentity'
    })
  },
  getIdentity: function(){
    let that = this
    wx.request({
      url: app.globalData.hostname + 'home/index/get_customs_info',
      data: {
        openid: that.data.openId
      },
      success: function (res) {
        let identityList = res.data.result
        if (identityList != null && identityList != undefined && identityList.length > 0){
          for (let i = 0, len = identityList.length; i < len; i++) {
            let id = identityList[i]['identity_card'],
              newId = ''
            for (let j = 0, len = identityList[j]['identity_card'].length; j < len; j++) {
              if (j >= 3 && j <= len - 5) {
                newId += '*'
              } else {
                newId += identityList[i]['identity_card'].charAt(j)
              }
            }
            identityList[i]['selected'] = ''
            identityList[i]['identity_card'] = newId
          }
          that.setData({
            identityList: res.data.result
          })
          let defaultId = that.data.identityList[0].id
          // return
          if (that.data.identityList.length == 1) {
            wx.request({
              url: app.globalData.hostname + 'home/index/use_customs',
              data: {
                id: defaultId,
                openid: that.data.openId
              },
              success: function (res) {
                console.log("自动设置默认成功", res)
                if (that.data.identityList[0].is_default == 0) {
                  that.getIdentity()
                }
              }
            })
          }
          wx.hideLoading()
        }
      }
    })
  },
  delete: function(event){
    let id = event.currentTarget.dataset.id,
    that = this
    wx.request({
      url: app.globalData.hostname+'home/index/del_customs_info',
      data:{
        openid: that.data.openId,
        id: id
      },
      success:function(res){
        console.log(res)
        that.getIdentity()
      }
    })
  }
})