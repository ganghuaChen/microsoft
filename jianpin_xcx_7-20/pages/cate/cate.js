// pages/cate/cate.js
var app = getApp()

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
    wx.request({
      url: app.globalData.hostname + 'home/index/cate_all',
      success: function (res) {
        var result = res.data.result
        for (let i = 0, len = res.data.result.length; i < len; i++) {
          if (i == 0) {
            result[i]["active"] = "active"
            let id = result[i][id]
          } else {
            result[i]["active"] = ""
          }
        }
        that.setData({
          cate: result,
          cateId: result[0].id
        })
        that.selectCate()
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
  selectCate: function (event) {
    let cateId = null,
    index = null
    if (event != undefined){
      cateId =  event.currentTarget.dataset.cateid
      index = event.currentTarget.id
    }else{
      cateId = this.data.cate[0].id
      index = 0
    }
    let cate = this.data.cate,
      that = this
    for(let i = 0,len = cate.length;i < len;i++){
      if (i == index){
        cate[index]['active'] = 'active'
      }else{
        cate[i]['active'] = ''
      }
    }
    this.setData({
      cate: cate
    })
    wx.request({
      url: app.globalData.hostname + 'home/index/goods_cate',
      data: {
        id: cateId
      },
      success: function (res) {
        that.setData({
          goods: res.data.result
        })
      }
    })
  }
})