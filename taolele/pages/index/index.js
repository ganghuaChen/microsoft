var app = getApp()

Page({
  data: {
    isSearch: false,
    searchKey: '',
    phoneNo: '',

    isBottom: false, //是否滚动到底部
    goods: [],
    goodData: {
      pageSize: 10,
      pageNum: 0,
      isLastPage: false,
      total: 0
    },
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
  getMyCode(evt) {
    let self = this
    let itemId = evt.currentTarget.dataset.id
    let title = evt.currentTarget.dataset.title
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
  //查看详情
  readDetail(evt){
    let self = this
    let goodId = evt.currentTarget.dataset.id

    wx.navigateTo({
      url: `/pages/detail/index?goodId=${goodId}&adzoneId=${app.globalData.adzoneId}`
    })
  },

  onInput(event) {
    this.setData({
      phoneNo: event.detail.value
    })
  },
  //发送code
  sendCode(event) {
    let self = this
    wx.request({
      url: app.globalData.url.smsCode,
      data: {
        "userId": "wjnyjdc",
        "phoneNo": self.data.phoneNo,
        "templateId": "500"
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode === 200) {
          self.setData({
            dialogData: {
              dialogVisible: false, //是否显示弹窗
              mycode: '',
              goodName: '',
              setting: app.globalData.cfg
            }
          })
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 1000
          })
        }
      }
    })
  },

  //获取宝贝信息
  getGoods(pageNum = 1) {
    let self = this
    let pages = `?pageSize=${this.data.goodData.pageSize}&pageNum=${pageNum}`
    let params = !!this.data.searchKey ? '&_search=title==*' + encodeURIComponent(this.data.searchKey) + '*' : ''
    let url = app.globalData.url.allGoods + app.globalData.adzoneId + pages + params
    wx.showLoading({ title: '拼命加载中', mask: true })
    wx.request({
      url: url,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data && res.data.code === 200 && res.data.data && res.data.data.list) {
          res.data.data.list.forEach((item) => {
            try {
              if (item.couponInfo){
              var num = ((item.couponInfo).match(/减(\S*)元/))[1]
              item.couponNum = num
              }
            } catch (err) {}
          })
          self.setData({
            goods: self.data.goods.concat(res.data.data.list),
            goodData: res.data.data,
            isBottom: false
          })
        }
        wx.hideLoading()
      }
    })
  },

  //搜索宝贝
  searchGood: function (event) {
    let searchKey = event.detail.value
    this.setData({
      goods: [],
      searchKey: searchKey
    })
    this.getGoods()
  },

  //触底加载更多
  onReachBottom() {
    let self = this
    var pageNum = ++self.data.goodData.pageNum
    if (!self.data.isBottom && !self.data.goodData.isLastPage) {
      self.setData({
        isBottom: true
      })

      setTimeout(function () {
        self.getGoods(pageNum)
      }, 50)
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    this.setData({
      goods: [],
      goodData: {
        pageSize: 10,
        pageNum: 1,
        isLastPage: false,
        total: 0
      }
    })
    this.getGoods()
  },

  onLoad: function (options) {
    let self = this
    let scene = decodeURIComponent(options.scene)
    // wx.showModal({
    //   content: "onLoad scene: " + scene,
    //   showCancel: false
    // });
    
    if (scene && scene !== 'undefined') {
      wx.setStorageSync('adzoneId', scene)
    }

    let adzoneId = wx.getStorageSync('adzoneId')
    // let comeFrom = options.from

    wx.request({
      url: app.globalData.url.setting,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.statusCode === 200) {
          if (!adzoneId || adzoneId === 'undefined'){
            wx.setStorageSync('adzoneId', res.data.adzoneId)
          }
         
          if (!!res.data.title) {
            wx.setNavigationBarTitle({ title: res.data.title })
          }

          app.globalData.cfg = res.data
          app.globalData.adzoneId = wx.getStorageSync('adzoneId')
          setTimeout(() => {
            self.setData({
              goods: [],
              goodData: {
                pageSize: 10,
                pageNum: 0,
                isLastPage: false,
                total: 0
              }
            })
            self.getGoods(++self.data.goodData.pageNum)
          }, 50)
        }
        
      }
    })
  }

  // onShow() {
  //   if (this.data.goods.length === 0 && app.globalData.cfg.adzoneId) {
  //     this.getGoods(this.data.goodData.pageNum++)
  //   }
  // }
})
