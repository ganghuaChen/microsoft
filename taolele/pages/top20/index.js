var app = getApp()

Page({
  data: {
    isSearch: false,
    searchKey: '',

    isBottom: false, //是否滚动到底部
    goods: [],
    goodData: {
      pageSize: 10,
      pageNum: 1,
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
      dialogData:{
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
  readDetail(evt) {
    let self = this
    let goodId = evt.currentTarget.dataset.id

    wx.navigateTo({
      url: `/pages/detail/index?goodId=${goodId}&adzoneId=${app.globalData.adzoneId}`
    })
  },
  //获取goods
  getGoods(pageNum = 1) {
    let pages = `?pageSize=${this.data.goodData.pageSize}&pageNum=${pageNum}&_search=zkFinalPriceWap%3C=20`
    let params = !!this.data.searchKey ? ',title==*' + encodeURIComponent(this.data.searchKey) + '*' : ''
    let url = app.globalData.url.ctgGoods + app.globalData.adzoneId + pages + params
    let self = this
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
              var num = ((item.couponInfo).match(/减(\S*)元/))[1]
              item.couponNum = num

              if (!!num) {
                item.zkFinalPriceWap = Number(item.zkFinalPriceWap - num).toFixed(2)
              }
            } catch (err) {
              // console.log(err)
            }
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
  onReachBottom(event) {
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
    this.setData({
      dialogData: {
        dialogVisible: false, //是否显示弹窗
        mycode: '',
        goodName: '',

        setting: app.globalData.cfg
      }
    })

    this.getGoods()
  }
})
