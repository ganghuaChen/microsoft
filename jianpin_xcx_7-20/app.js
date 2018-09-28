var aldstat = require("./utils/ald-stat.js")
var loginStatus = true;
//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    let that = this
    wx.request({
      url: 'https://xiaocx.jianpinvip.cn/home/index/goods_all', //仅为示例，并非真实的接口地址,
      data: {},
      success: function (res) {
        that.globalData.goods = res.data
      },
      fail: function (res) {
        console.log(res)
        // that.setData({
        //   imgUrls: ["http://jp.shenmikj.com/banner/1.jpg"]
        // })
      }
    })
  },
  APPID: "wx3f938bcb89d72af0",
  SECRET: "096eeaba9f5e1dfa88b2e04947e1de90",
  getUserInfo: function (cb) {
    var that = this
    if (this.globalData.userInfo) {
      typeof cb == "function" && cb(this.globalData.userInfo)
    } else {
      //调用登录接口
      if (!loginStatus ){
        wx.showModal({
          title: '授权提示',
          content: '尖品小程序需要获得授权才可正常使用',
          showCancel: false,
          success: function(res) {
            if(res.confirm){
              wx.openSetting({
                success: function (res) {
                  if (res) {
                    if (res.authSetting["scope.userInfo"] == true) {
                      loginStatus = true
                      wx.getUserInfo({
                        success: function (res) {
                          // console.log("login")
                          // console.log(loginReturn.code)
                          that.globalData.userInfo = res.userInfo
                          typeof cb == "function" && cb(that.globalData.userInfo)
                        },
                        fail: function () {
                          console.log("获取授权数据失败")
                        }
                      })
                    }
                  }
                }
              })
            }
          }
        })
        
      }else{
        wx.login({
          success: function (loginReturn) {
            wx.getUserInfo({
              success: function (res) {
                // console.log("login")
                // console.log(loginReturn.code)
                that.globalData.userInfo = res.userInfo
                typeof cb == "function" && cb(that.globalData.userInfo)
              }, fail: function (e) {
                loginStatus = false
                that.globalData.showLose = false
                wx.showModal({
                  title: '提示',
                  content: '尖品小程序需要授权才能正常使用',
                  showCancel: true,
                  success: function (res) {
                    if (res.confirm) {
                      
                    }
                    if (res.cancel) {
                      wx.openSetting({
                        success: function (res) {
                          if (res) {
                            if (res.authSetting["scope.userInfo"] == true) {
                              loginStatus = true;
                              wx.getUserInfo({
                                success: function (res) {
                                  // console.log("login")
                                  // console.log(loginReturn.code)
                                  that.globalData.userInfo = res.userInfo
                                  typeof cb == "function" && cb(that.globalData.userInfo)
                                }
                              })
                            }
                          }
                        },
                        fail: function (res) {},
                        complete: function (res) { },
                      })
                    }
                  },
                  fail: function (res) { },
                  complete: function (res) { },
                })
              }
            })
            var code = loginReturn.code;
            var openidUrl = that.globalData.hostname + "Api/Api/getOpenID";
            // 获取 openid
            wx.request({
              url: openidUrl,
              data: {
                code: code
              },
              success: function (codeReturn) {
                // console.log(codeReturn)
                var openid = codeReturn.data.result;    // openid
                // 判断 openid 是否有变化
                var openidStorage = wx.getStorageSync('openid');    // 缓存中的旧 openid
                // 小程序用户发生变化 或 首次进入小程序, openid 及 用户信息 的缓存均需要更新
                wx.setStorageSync('openid', openid);    // 更新 openid 缓存
                console.log(openid)
                that.globalData.openid = openid;
                that.updateUserInfo(cb);    // 更新用户信息
              },
              fail: function () {
                wx.showModal({
                  title: '提示',
                  content: '网络不畅',
                  showCancel: false
                });
              }
            });
          }
        });
      }
    
    }
  },
  globalData: {
    userInfo: null,
    address: null,
    hostname: "https://xiaocx.jianpinvip.cn/",
    goods: null,
    showLose:true
  },
  updateUserInfo: function (cb) {
    var that = this;
    var openid = wx.getStorageSync('openid')
    // 获取用户 微信信息
    wx.getUserInfo({
      success: function (res) {
        that.globalData.userInfo = res.userInfo;
        wx.setStorageSync('userInfo', res.userInfo);    // 更新 用户信息 缓存
        //更新会员信息
        wx.request({
          url: 'https://xiaocx.jianpinvip.cn/api/api/updateUserInfo',
          data: {
            openid: openid,
            nickname: res.userInfo.nickName,
            gender: res.userInfo.gender,
            language: res.userInfo.language,
            city: res.userInfo.city,
            province: res.userInfo.province,
            country: res.userInfo.country,
            avatarurl: res.userInfo.avatarUrl,
          },
          success: function (res) {
            console.log(res);
          }
        });
        // cb() 为 执行 回调函数(参数1, 参数2, ..., 参数n)
        typeof cb == "function" && cb(that.globalData.userInfo, that.globalData.openid);
      }
    });
  }
})