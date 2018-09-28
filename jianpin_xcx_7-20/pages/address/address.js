// pages/address/address.js
var china = require('../../util/china.js'),
app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    province: null,
    city: null,
    area: null,
    provinceIndex: 0,
    cityIndex: 0,
    areaIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户openid
    var openid = wx.getStorageSync('openid')
    var that = this
    this.setData({
      id : options.id
    })
    wx.request({
      url: app.globalData.hostname +'home/index/address',
      data: {
        openid: openid,
        id: options.id
      },
      success: function (res) {
        if(res.data.status == 1){
          let provinceIndex = null,
            provinceText = null,
            cityIndex = null,
            cityText = null,
            areaIndex = null,
            areaText = null
          if (res.data.result.province != '' && res.data.result.province!= undefined) {
            console.log(res.data.result.province)
            // 获取默认地址索引
            china.data["p"].forEach(function (item, index) {
              if (res.data.result.province == item) {
                provinceIndex = index
                provinceText = item
              }
            })
            // debugger
            // 获取省文本
            console.log(china.data["c"][provinceText], provinceText)
            china.data["c"][provinceText].forEach(function (item, index) {
              if (res.data.result.city == item) {
                cityIndex = index
                cityText = item
              }
            })
            china.data["a"][cityText].forEach(function (item, index) {
              if (res.data.result.area == item) {
                areaIndex = index
              }
            })
            that.setData({
              contact: res.data.result.contact,
              mobile: res.data.result.mobile,
              detail: res.data.result.detail,
              postcode: res.data.result.postcode,
              defaultProv: provinceIndex,
              defaultCity: cityIndex,
              defaultArea: areaIndex,
              provinceIndex: provinceIndex,
              cityIndex: cityIndex,
              areaIndex: areaIndex
            })
          }
          if (res.data.result.province == "" || res.data.result.province == undefined) {
            that.setData({
              newUser: true
            })
          } else {
            that.setData({
              newUser: false
            })
          }
          // 初始化省市区
          let provinces = [],
            cityArr = [],
            cities = [],
            areas = []
          // 获取用户地址
          if (that.data.newUser) {
            // 遍历省
            for (let province in china.data.p) {
              provinces.push(china.data.p[province])
            }
            // 遍历市
            that.setData({
              // 初始化默认选择北京
              province: provinces,
              city: china.data.c["北京市"],
              area: china.data.a["北京市"]
            })
            console.log(that.data)
          } else {
            let province = china.data.p,
              city = china.data.c[provinceText],
              area = china.data.a[cityText]
            that.setData({
              province: province,
              city: city,
              area: area
            })
          }
          // 获取地址
          that.catchAddress()
        }
      }
    });
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
  onReady: function () {

  },
  contentChange: function (event) {
    this.setData({
      contact: event.detail.value
    })
  },
  mobileChange: function(event){
    this.setData({
      mobile: event.detail.value
    })
  },
  detailChange: function (event) {
    this.setData({
      detail: event.detail.value
    })
  },
  postcodeChange: function (event) {
    this.setData({
      postcode: event.detail.value
    })
  },
  provinceChange: function (event) {
    let selectedValue = event.detail.value,
    selectedProvince = this.data.province[selectedValue],
    newCityList = china.data.c[selectedProvince],
    newAreaList = china.data.a[newCityList[0]]
    this.setData({
      provinceIndex : event.detail.value,
      selectedProvince : selectedProvince,
      city : newCityList,
      area : newAreaList,
      cityIndex : 0,
      areaIndex : 0
    })
    this.catchAddress()
  },
  cityChange: function(event){
    let selectedValue = event.detail.value,
    selectedCity = this.data.city[selectedValue],
    newAreaList = china.data.a[selectedCity]
    this.setData({
      cityIndex : event.detail.value,
      selectedCity : selectedCity,
      area : newAreaList
    })
    this.catchAddress()
  },
  areaChange: function(event){
    let selectedValue = event.detail.value,
    selectedArea = this.data.city[selectedValue]
    this.setData({
      areaIndex : event.detail.value,
      selectedArea : selectedArea
    })
    this.catchAddress()
  },
  address_save: function () {
    // 获取用户openid
    var openid = wx.getStorageSync('openid')
    console.log(this.data)
    // this.data.id
    // that.data.id
    var that = this
    wx.request({
      url: app.globalData.hostname+'home/index/address_save',
      data: {
        id:that.data.id,
        openid: openid,
        contact: this.data.contact,
        area: this.data.area,
        mobile: this.data.mobile,
        detail: this.data.detail,
        address: this.data.addressText,
      },
      success: function (res) {
        console.log(res)
        if(res.data == 1){
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000
          }),
          setTimeout(function(){
            wx.navigateBack({
              delta: 1
            })
          },500)
        }
        if(res.data == 2){
          wx.showToast({
            title: '失败',
            icon: 'success',
            duration: 2000
          })
        }
        if(res.data.status == -1){
          wx.showToast({
            title: res.data.msg,
            image: '../../images/warn.png',
            duration: 2000
          })
        }
      }
    });
  },
  catchAddress: function(){
    this.setData({
      addressText: this.data.province[this.data.provinceIndex] + "-" + this.data.city[this.data.cityIndex] +"-"+ this.data.area[this.data.areaIndex]
    })
  },
  goBack: function(){
    wx.navigateBack({
      delta : 1
    })
  }
})