// pages/identity/identity.js
const app = getApp(),
openId = wx.getStorageSync('openid')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    frontImg: "",
    // backImg: "",
    frontImgTemp:'',
    // backImgTemp: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(openId)
    wx.request({
      url: app.globalData.hostname +'home/index/get_customs_info',
      data:{
        openid : openId
      },
      success: function(res){
        console.log(res)
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
  syncName: function (event) {
    let name = event.detail.value
    this.setData({
      userName: name
    })
  },
  syncIdNum: function (event) {
    let idNum = event.detail.value
    this.setData({
      idNum: idNum
    })
  },
  chooseImg: function(event){
    let that = this,
    imgType = event.currentTarget.dataset.img
    if (this.data[imgType] == ''){
      wx.chooseImage({
        count: 1,
        sizeType: ['compressed'],
        success: function (res) {
          if (imgType == "frontImg") {
            wx.showLoading({
              title: '上传中',
            })
            let tempFilePaths = res.tempFilePaths
            that.setData({
              frontImgTemp: tempFilePaths[0]
            })
            wx.uploadFile({
              url: app.globalData.hostname + 'api/api/imgUpload',
              filePath: tempFilePaths[0],
              name: 'file',
              success: function(res){
                that.setData({
                  frontImg: res.data
                })
                wx.hideLoading()
              },
              fail: function(res){
                console.log(res)
              }
            })
          } else {
            that.setData({
              // backImgTemp: res.tempFilePaths[0],
              // backImg: res.tempFilePaths[0]
            })
            wx.hideLoading()
          }
        },
      })
    }
  },
  delImg: function(event){
    let type = event.currentTarget.dataset.img
    if (type == 'frontImg') {
      this.setData({
        frontImgTemp: '',
        frontImg: ''
      })
    } else {
      this.setData({
        backImgTemp: '',
        backImg: ''
      })
    }
  },
  update: function(){
    let that = this
    if (this.data.userName == undefined || this.data.userName == null || this.data.userName == ''){
      wx.showModal({
        title: '提示',
        content: '请输入真实姓名！',
        showCancel: false
      })
      return
    } else if (this.data.idNum == undefined || this.data.idNum == null || this.data.idNum == ''){
      wx.showModal({
        title: '提示',
        content: '请输入真实身份证号码！',
        showCancel: false
      })
      return
    } else if (this.data.frontImg == undefined || this.data.frontImg == null || this.data.frontImg == ''){
      wx.showModal({
        title: '提示',
        content: '请选择要上传的照片！',
        showCancel: false
      })
      return
    }else{
      wx.request({
        url: app.globalData.hostname + 'home/index/customs_info',
        data: {
          openid :openId,
          username : that.data.userName,
          identity_card: that.data.idNum,
          pic: that.data.frontImg
        },
        success: function(res){
          if (res.data.status == 1){
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000,
              success:function(){
                wx.navigateBack({
                  delta :1
                })
              }
            })
          }else{
            wx.showModal({
              title: '提示',
              content: res.data.msg,
              showCancel: false,
              success:function(res){
                if(res.confirm){
                  return
                }
              }
            })
          }
        }
      })
    }
  }
})