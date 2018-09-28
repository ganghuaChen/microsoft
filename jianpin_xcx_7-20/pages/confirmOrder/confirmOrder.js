// pages/confirmOrder/confirmOrder.js
var app = getApp(),
  openId = wx.getStorageSync('openid')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mailPrice: 0,
    totalPrice: 0,
    couponPrice: 0,
    finalPrice: 0,
    index: 0,
    setCouponFlag: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
    let activity = Boolean(options.activity)
    if (activity) {
      this.setData({
        activity: true
      })
    }
    wx.showLoading({
      title: '加载中',
    })
    // 获取用户openid
    var openid = wx.getStorageSync('openid'), that = this
    // 获取用户地址
    wx.request({
      url: app.globalData.hostname + 'home/index/default_address',
      data: {
        openid: openid,
      },
      success: function (res) {
        // console.log('用户地址:', res)
        if (res.data.status == 1) {
          that.setData({
            address: res.data.result.province + res.data.result.city + res.data.result.area + res.data.result.detail,
            aid: res.data.result.id
          })
          wx.request({
            url: app.globalData.hostname + 'home/index/get_customs_info',
            data: {
              openid: openId
            },
            success: function (res) {
              // console.log(res)
              let identityList = [],
                identityIndex = 0
              res.data.result.forEach(function (value, index) {
                identityList.push(value.name)
                if (value.is_default == 1) {
                  identityIndex = index
                }
              })
              that.setData({
                identityList: identityList,
                identity: res.data.result,
                identityIndex: identityIndex,
                identityId: res.data.result[identityIndex].id
              })
            }
          })
        } else {
          that.setData({
            address: "nullnullnull"
          })
        }
      },
      fail: function (res) { }
    });
    //当单件商品时
    if (options.goodsId > 0) {
      // 获取商品信息
      // console.log("单件商品:" + options.goodsId)
      this.setData({
        goodsId: options.goodsId
      })
      // 判断商品是否是秒杀商品决定价格查询接口
      if (this.data.activity) {
        console.log("当前商品是秒杀商品")
        wx.request({
          url: app.globalData.hostname + 'home/index/seckillgoods',
          data: {
            id: options.goodsId
          },
          success: function (res) {
            let goods = []
            for (let i = res.data.result.length - 1; i >= 0; i--) {
              res.data.result[i].count = 1
              goods.push(res.data.result[i])
            }
            that.setData({
              goods: goods
            })
            wx.hideLoading()
            let goodsAll = []
            for (let i = that.data.goods.length - 1; i >= 0; i--) {
              var goodsid = that.data.goods[0].id
              var count = that.data.goods[0].count
              goodsAll.push({ goodsid, count })
            }
            that.setData({
              goodsAll: goodsAll
            })
            // 获取商品价格
            that.getPrice(res)
          }
        })
      } else {
        console.log("当前商品是普通商品")
        wx.request({
          url: app.globalData.hostname + 'home/index/goods',
          data: {
            id: options.goodsId
          },
          success: function (res) {
            let goods = []
            for (let i = res.data.result.length - 1; i >= 0; i--) {
              res.data.result[i].count = 1
              goods.push(res.data.result[i])
            }
            that.setData({
              goods: goods
            })
            wx.hideLoading()
            let goodsAll = []
            for (let i = that.data.goods.length - 1; i >= 0; i--) {
              var goodsid = that.data.goods[0].id
              var count = that.data.goods[0].count
              goodsAll.push({ goodsid, count })
            }
            that.setData({
              goodsAll: goodsAll
            })
            // 获取商品价格
            that.getPrice()
          }
        })
      }
      //根据订单获取商品和价格
    } else if (options.order_sn != null) {
      this.setData({
        arrearage: true,
        activity: true
      })
      let orderSn = options.order_sn
      wx.request({
        url: app.globalData.hostname + 'home/index/orderinfo',
        data: {
          openid: openid,
          ordersn: orderSn
        },
        success: function (res) {
          console.log(2)
          console.log(res)
          let goodsAll = []
          for (let i = 0, len = res.data.result.length; i < len; i++) {
            let goodsid = res.data.result[i].id, count = res.data.result[i].count
            goodsAll.push({ goodsid, count })
          }
          that.setData({
            goods: res.data.result,
            totalPrice: res.data.money.price,
            mailPrice: res.data.money.email,
            couponPrice: res.data.money.discount,
            finalPrice: res.data.money.paid,
            isSeckill: res.data.is_seckill,
            goodsAll: goodsAll,
            orderSn: res.data.ordersn,
            tariff: res.data.money.tariff,
            coupon: res.data.coupon
          })
          wx.hideLoading()
        }
      })
    } else {
      // 从购物车进入时，获取商品信息
      let idArr = [],
        payList = wx.getStorageSync('payList')
      for (let i = payList.length - 1; i >= 0; i--) { idArr.push(payList[i].goodsId) }
      wx.request({
        url: app.globalData.hostname + 'home/index/goods',
        data: {
          id: idArr
        },
        success: function (res) {
          let goods = []
          for (let i = 0, len = res.data.result.length; i < len; i++) {
            goods.push(res.data.result[i])
            for (let j = res.data.result.length - 1; j >= 0; j--) {
              if (goods[i].id == payList[j].goodsId) {
                goods[i].count = payList[j].count
              }
            }
          }
          that.setData({
            goods: goods
          })
          wx.hideLoading()
          let goodsAll = []
          for (let i = that.data.goods.length - 1; i >= 0; i--) {
            var goodsid = that.data.goods[i].id
            var count = that.data.goods[i].count
            goodsAll.push({ goodsid, count })
          }
          that.setData({
            goodsAll: goodsAll
          })
          // 获取商品价格
          that.getPrice()
        }
      })
    }
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
  onShow: function () {
    console.log("onShow")
    // 获取用户openid
    var openid = wx.getStorageSync('openid'), that = this
    // 获取用户地址
    wx.request({
      url: app.globalData.hostname + 'home/index/default_address',
      data: {
        openid: openid,
      },
      success: function (res) {
        // console.log('用户地址:', res)
        if (res.data.status == 1) {
          that.setData({
            address: res.data.result.province + res.data.result.city + res.data.result.area + res.data.result.detail,
            aid: res.data.result.id
          })
          wx.request({
            url: app.globalData.hostname + 'home/index/get_customs_info',
            data: {
              openid: openId
            },
            success: function (res) {
              console.log(res)
              let identityList = [],
                identityIndex = 0
              res.data.result.forEach(function (value, index) {
                identityList.push(value.name)
                if (value.is_default == 1) {
                  identityIndex = index
                }
              })
              that.setData({
                identityList: identityList,
                identity: res.data.result,
                identityIndex: identityIndex,
                identityId: res.data.result[identityIndex].id
              })
            }
          })
        } else {
          that.setData({
            address: "nullnullnull"
          })
        }
      },
      fail: function (res) { }
    });
  },
  // 计算商品价格
  getPrice: function (res) {
    if (res) {
      console.log('商品价格：', res)
      this.setData({
        totalPrice: res.data.result[0].goods_price,
        mailPrice: 0,
        couponPrice: 0,
        finalPrice: res.data.result[0].goods_price,
        tariff: res.data.result[0].tariff
      })
    } else {
      var that = this,
        openId = wx.getStorageSync('openid'),
        couponId = that.data.couponId || 0
      console.log("couponid:" + couponId)
      wx.request({
        url: app.globalData.hostname + 'home/index/goods_money',
        data: {
          goods: that.data.goodsAll,
          openid: openId,
          couponid: couponId
        },
        success: function (res) {
          console.log(couponId)
          // console.log(res)
          let coupon = []
          for (let i = 0, len = res.data.coupon.length; i < len; i++) {
            coupon.push(res.data.coupon[i].name)
          }
          that.setData({
            totalPrice: res.data.result.price,
            mailPrice: res.data.result.email,
            couponPrice: res.data.result.discount,
            finalPrice: res.data.result.paid,
            tariff: res.data.result.tariff,
            coupon: coupon,
            couponList: res.data.coupon
          })
          if (res.data.coupon.length > 0) {
            if (!that.data.couponId) {
              that.setData({
                couponId: res.data.coupon[0].id
              })
            }
            if (!that.data.setCouponFlag) {
              that.setCouponPrice()
            }
          }
        }
      })
    }
  },
  setCouponPrice: function () {
    wx.showLoading({
      title: '请稍候',
    })
    var that = this,
      openId = wx.getStorageSync('openid'),
      couponId = that.data.couponId
    console.log("couponid:" + couponId)
    wx.request({
      url: app.globalData.hostname + 'home/index/goods_money',
      data: {
        goods: that.data.goodsAll,
        openid: openId,
        couponid: couponId
      },
      success: function (res) {
        console.log("优惠券:", res.data.coupon, couponId)
        let coupon = []
        for (let i = 0, len = res.data.coupon.length; i < len; i++) {
          coupon.push(res.data.coupon[i].name)
        }
        that.setData({
          totalPrice: res.data.result.price,
          mailPrice: res.data.result.email,
          couponPrice: res.data.result.discount,
          finalPrice: res.data.result.paid,
          tariff: res.data.result.tariff
        })
        if (res.data.coupon.length > 0) {
          if (!that.data.couponId) {
            that.setData({
              couponId: res.data.coupon[0].id
            })
          }
        }
        that.setData({
          setCouponFlag: true
        })
        wx.hideLoading()
      }
    })
  },
  bindPickerChange: function (event) {
    let couponIndex = Number(event.detail.value),
      couponList = this.data.couponList,
      couponId = couponList[couponIndex].id
    console.log(couponId)
    this.setData({
      couponId: couponId,
      index: couponIndex
    })
    this.getPrice()
  },
  // 增加商品数量
  cart_add: function (e) {
    let that = this,
      goodsId = Number(e.currentTarget.dataset.goodsid),
      index = Number(e.currentTarget.id),
      goods = this.data.goods,
      goodsAll = this.data.goodsAll
    goods[index].count++
    if (goods[index].count < 200) {
      for (let i = 0, len = goodsAll.length; i < len; i++) {
        if (goodsAll[i].goodsid == goodsId) {
          goodsAll[i].count++
        }
      }
      this.setData({
        goods: goods,
        goodsAll: goodsAll
      })
      this.getPrice()
    }
  },
  // 减少商品数量
  cart_minus: function (e) {
    let that = this,
      goodsId = Number(e.currentTarget.dataset.goodsid),
      index = Number(e.currentTarget.id),
      goods = this.data.goods,
      goodsAll = this.data.goodsAll
    if (goods[index].count > 1) {
      goods[index].count--
      for (let i = 0, len = goodsAll.length; i < len; i++) {
        if (goodsAll[i].goodsid == goodsId) {
          goodsAll[i].count--
        }
      }
      this.setData({
        goods: goods,
        goodsAll: goodsAll
      })
      this.getPrice()
    }
  },
  detailNav: function (e) {
    wx.navigateTo({
      url: '../address/address?id=' + e.currentTarget.dataset.id
    })
  },
  // 去结算付款
  payment: function (e) {
    app.aldstat.sendEvent("点击付款");
    let that = this,
      openid = wx.getStorageSync('openid')
    // 判断地址是否为空
    if (that.data.address != "nullnullnull") {
      // 单件商品立即购买
      if (this.data.activity) {
        if (this.data.isSeckill == 0) {
          let couponId = that.data.couponId || 0
          // 普通商品结算
          wx.request({
            url: app.globalData.hostname + 'home/index/xiao_pay',
            data: {
              goods_all: that.data.goodsAll,
              finalPrice: that.data.finalPrice,
              openid: openid,
              ordersn: that.data.orderSn,
              couponid: couponId,
              identityid: that.data.identityId
            },
            success: function (res) {
              switch (res.data.status) {
                case -1:
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                case 2:
                  wx.showModal({
                    title: '提示',
                    content: '电话为空或者电话不正确!',
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '../address/address',
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                case 3:
                  wx.showModal({
                    title: '提示',
                    content: '用户地址不完整!',
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '../address/address',
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                case 5:
                  wx.showModal({
                    title: '提示',
                    content: '付款金额不正确,不能支付!',
                    success: function (res) {
                      if (res.confirm) {
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                case 6:
                  wx.showModal({
                    title: '提示',
                    content: '请填写我的地址',
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '../address/address',
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                default:
                  console.log(res)
                  wx.requestPayment({
                    'timeStamp': res.data.parameters.timeStamp,
                    'nonceStr': res.data.parameters.nonceStr,
                    'package': res.data.parameters.package,
                    'signType': res.data.parameters.signType,
                    'paySign': res.data.parameters.paySign,
                    success: function (res) {
                      app.aldstat.sendEvent("完成付款");
                      wx.showToast({
                        title: '支付成功',
                        success: function () {
                          wx.request({
                            url: app.globalData.hostname + 'home/index/new_ordersn',
                            data: {
                              openid: openid
                            },
                            success: function (res) {
                              if (res.data.status == 1) {
                                wx.redirectTo({
                                  url: '../orderDetail/orderDetail?order_sn=' + res.data.result,
                                })
                              }
                            }
                          })
                        }
                      })
                    },
                    fail: function (res) {
                      wx.request({
                        url: app.globalData.hostname + 'home/index/new_ordersn',
                        data: {
                          openid: openid
                        },
                        success: function (res) {
                          if (res.data.status == 1) {
                            wx.redirectTo({
                              url: '../orderDetail/orderDetail?order_sn=' + res.data.result,
                            })
                          }
                        }
                      })
                    }
                  })
                  break
              }
            }
          })
        } else {
          console.log('当前商品是秒杀商品：')
          // 秒杀商品
          let couponId = that.data.couponId || 0
          wx.request({
            url: app.globalData.hostname + 'home/Seckill/SeckillOrder',
            data: {
              id: that.data.goods[0].id,
              openid: openid,
              aid: that.data.aid,
              couponid: couponId,
              identityid: that.data.identityId,
              ordersn: that.data.orderSn
            },
            success: function (res) {
              console.log("支付秒杀商品：", res)
              // return
              switch (res.data.status) {
                case -1:
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                case -2:
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                case -3:
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                case -4:
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                case -5:
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                case -6:
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                case -7:
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                case -8:
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                case -9:
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                case -10:
                  wx.showModal({
                    title: '提示',
                    content: res.data.msg,
                    success: function (res) {
                      if (res.confirm) {
                        wx.navigateBack({
                          delta: 1
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  break
                default:
                  console.log("秒杀商品支付测试")
                  wx.requestPayment({
                    'timeStamp': res.data.parameters.timeStamp,
                    'nonceStr': res.data.parameters.nonceStr,
                    'package': res.data.parameters.package,
                    'signType': res.data.parameters.signType,
                    'paySign': res.data.parameters.paySign,
                    success: function (res) {
                      app.aldstat.sendEvent("完成付款");
                      console.log(res)
                      wx.showToast({
                        title: '支付成功',
                        success: function () {
                          wx.request({
                            url: app.globalData.hostname + 'home/index/new_ordersn',
                            data: {
                              openid: openid
                            },
                            success: function (res) {
                              console.log(res)
                              if (res.data.status == 1) {
                                wx.redirectTo({
                                  url: '../orderDetail/orderDetail?order_sn=' + res.data.result,
                                })
                              }
                            }
                          })
                        }
                      })
                    },
                    fail: function (res) {
                      app.aldstat.sendEvent("完成付款");
                      wx.request({
                        url: app.globalData.hostname + 'home/index/new_ordersn',
                        data: {
                          openid: openid
                        },
                        success: function (res) {
                          console.log(res)
                          if (res.data.status == 1) {
                            wx.redirectTo({
                              url: '../orderDetail/orderDetail?order_sn=' + res.data.result,
                            })
                          }
                        }
                      })
                    }
                  })
                  break
              }
            }
          })
        }
      } else {
        // 普通商品结算
        let couponId = that.data.couponId || 0
        that.getPrice()
        console.log(couponId)
        wx.request({
          url: app.globalData.hostname + 'home/index/xiao_pay',
          data: {
            goods_all: that.data.goodsAll,
            finalPrice: that.data.finalPrice,
            openid: openid,
            couponid: couponId,
            identityid: that.data.identityId
          },
          success: function (res) {
            console.log("res", res)
            console.log("status:", res.data.status)
            switch (res.data.status) {
              case -1:
                wx.showModal({
                  title: '提示',
                  content: res.data.msg,
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                      wx.navigateBack({
                        delta: 1
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
                break
              case 2:
                wx.showModal({
                  title: '提示',
                  content: '电话为空或者电话不正确!',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../address/address',
                      })
                    } else if (res.cancel) {
                    }
                  }
                })
                break
              case 3:
                wx.showModal({
                  title: '提示',
                  content: '用户地址不完整!',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../address/address',
                      })
                    } else if (res.cancel) {
                    }
                  }
                })
                break
              case 5:
                wx.showModal({
                  title: '提示',
                  content: '付款金额不正确,不能支付!',
                  success: function (res) {
                    if (res.confirm) {
                    } else if (res.cancel) {
                    }
                  }
                })
                break
              case 6:
                wx.showModal({
                  title: '提示',
                  content: '请填写我的地址',
                  success: function (res) {
                    if (res.confirm) {
                      wx.navigateTo({
                        url: '../address/address',
                      })
                    } else if (res.cancel) {
                    }
                  }
                })
                break
              default:
                console.log(res)
                wx.requestPayment({
                  'timeStamp': res.data.parameters.timeStamp,
                  'nonceStr': res.data.parameters.nonceStr,
                  'package': res.data.parameters.package,
                  'signType': res.data.parameters.signType,
                  'paySign': res.data.parameters.paySign,
                  success: function (res) {
                    app.aldstat.sendEvent("完成付款");
                    console.log(res)
                    wx.showToast({
                      title: '支付成功',
                      success: function () {
                        wx.request({
                          url: app.globalData.hostname + 'home/index/new_ordersn',
                          data: {
                            openid: openid
                          },
                          success: function (res) {
                            console.log(res)
                            if (res.data.status == 1) {
                              wx.redirectTo({
                                url: '../orderDetail/orderDetail?order_sn=' + res.data.result,
                              })
                            }
                          }
                        })
                      }
                    })
                    let payList = wx.getStorageSync('payList'),
                      cartList = wx.getStorageSync('cart')
                    payList.forEach(function (value, index) {
                      cartList.forEach(function (val, i) {
                        if (value.goodsId == val.goodsId) {
                          cartList.splice(i, 1)
                        }
                      })
                    })
                    wx.setStorageSync('cart', cartList)
                  },
                  fail: function (res) {
                    app.aldstat.sendEvent("完成付款");
                    wx.request({
                      url: app.globalData.hostname + 'home/index/new_ordersn',
                      data: {
                        openid: openid
                      },
                      success: function (res) {
                        console.log(res)
                        if (res.data.status == 1) {
                          wx.redirectTo({
                            url: '../orderDetail/orderDetail?order_sn=' + res.data.result,
                          })
                        }
                      }
                    })
                    let payList = wx.getStorageSync('payList'),
                      cartList = wx.getStorageSync('cart')
                    payList.forEach(function (value, index) {
                      cartList.forEach(function (val, i) {
                        if (value.goodsId == val.goodsId) {
                          cartList.splice(i, 1)
                        }
                      })
                    })
                    wx.setStorageSync('cart', cartList)
                  }
                })
                break
            }
          }
        })
      }
    } else {
      wx.showToast({
        title: '请填写地址',
        image: '../../images/warn.png'
      })
    }
  },
  changeIdentity: function (event) {
    let identityIndex = event.detail.value,
      that = this,
      id = Number(this.data.identity[identityIndex].id)
    console.log(id, openId, this.data.orderSn)
    this.setData({
      identityIndex: identityIndex,
      identityId: id
    })
  }
})