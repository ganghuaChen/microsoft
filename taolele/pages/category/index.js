var app = getApp()
Page({
  data: {
    categories: [],
    icons: {
      '女装': '/images/meau_icon_1.png',
      '男装': '/images/meau_icon_2.png',
      '童装': '/images/meau_icon_3.png',
      '美妆': '/images/meau_icon_4.png',
      '女鞋': '/images/meau_icon_5.png',
      '男鞋': '/images/meau_icon_6.png',
      '母婴': '/images/meau_icon_7.png',
      '内衣': '/images/meau_icon_8.png',
      '运动': '/images/meau_icon_9.png',
      '箱包': '/images/meau_icon_10.png',
      '数码': '/images/meau_icon_11.png',
      '家电': '/images/meau_icon_12.png',
      '美食': '/images/meau_icon_13.png',
      '个护': '/images/meau_icon_14.png',
      '家居': '/images/meau_icon_15.png',
      '精品女装': '/images/meau_icon_16.png',
    },
    defaultIcon: '/images/meau_icon_18.png'
  },

  getCategories: function(){
    let self = this

    wx.request({
      url: app.globalData.url.categories,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data && res.data.code === 200) {
          if (app.globalData.cfg.mode === 'dev'){
            self.setData({
              categories: res.data.data.splice(0,3)
            })
          }else{
            self.setData({
              categories: res.data.data
            })
          }
        }
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  
  onLoad: function () {
    this.getCategories()
  }
})
