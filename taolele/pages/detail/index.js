var app = getApp()

// index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    detail: {},
    recommends: [],
    dialogData: {
      dialogVisible: false, //是否显示弹窗
      mycode: '',
      goodName: '',

      setting: {}
    }
  },

  //关闭弹窗
  closeDialog() {
    this.setData({
      dialogData: {
        dialogVisible: false,
        setting: app.globalData.cfg
      }
    })
  },
  //复制
  copyCode: function () {
    let self = this
    wx.setClipboardData({
      data: self.data.dialogData.mycode,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },
  //获取code
  getMyCode() {
    let self = this
    let itemId = self.data.detail.id
    let title = self.data.detail.title
    let url = app.globalData.url.mycode + app.globalData.adzoneId + '/' + itemId
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data && res.data.code === 200) {
          self.setData({
            dialogData: {
              dialogVisible: true,
              goodName: title,
              mycode: res.data.data,
              setting: app.globalData.cfg
            }
          })
        } else {
          wx.showToast({
            title: '领取失败',
            icon: 'failed',
            duration: 2000
          })
        }
      }
    })
  },

  /**
   * 获取详情
   */
  getDetail(adzoneId, goodId){
    let self = this
    let url = app.globalData.url.detail + adzoneId + '/' + goodId
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data && res.data.code === 200 && res.data.data) {
          try{
            //去除时间的时分秒
            res.data.data.couponStartTime = res.data.data.couponStartTime.split(' ')[0]
            res.data.data.couponEndTime = res.data.data.couponEndTime.split(' ')[0]
          }catch(e){

          }
          let imgUrls = res.data.data.smallImages ? res.data.data.smallImages.split(',') : []
          self.setData({
            imgUrls: imgUrls,
            detail: res.data.data
          })
        }
      },
      fail: function(){
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    })
  },

  //查看详情
  readDetail(evt) {
    let goodId = evt.currentTarget.dataset.id
    this.getDetail(app.globalData.adzoneId, goodId)
    this.getRecommends(app.globalData.adzoneId, goodId)
    wx.pageScrollTo({
      scrollTop: 0
    })
  },

  /**
   * 获取推荐
   */
  getRecommends(adzoneId, goodId){
    let self = this
    let url = app.globalData.url.recomend + adzoneId + '/' + goodId
    wx.request({
      url: url,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data && res.data.code === 200 && res.data.data) {
          self.setData({
            recommends: res.data.data
          })
        }
      },
      fail: function () {
        wx.switchTab({
          url: '/pages/index/index'
        })
      }
    })
  },

  //预览图片
  previewImage(evt){
    wx.previewImage({
      current: evt.currentTarget.dataset.current, // 当前显示图片的http链接
      urls: this.data.imgUrls // 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let adzoneId = ''
    let goodId = ''
    if (options.scene){
      adzoneId = decodeURIComponent(options.scene).split('/')[0]
      goodId = decodeURIComponent(options.scene).split('/')[1]
      app.globalData.adzoneId = adzoneId
    } else if (options.adzoneId && options.goodId){
      adzoneId = options.adzoneId
      goodId = options.goodId
      app.globalData.adzoneId = adzoneId
    }else{
      wx.switchTab({
        url: '/pages/index/index'
      })
      return
    }

    if (adzoneId && goodId){
      this.getDetail(adzoneId, goodId)
      this.getRecommends(adzoneId, goodId)
    }
    // wx.showModal({
    //   content: "onLoad goodId: " + goodId,
    //   showCancel: false
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    console.log(options)
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