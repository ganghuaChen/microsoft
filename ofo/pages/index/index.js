//index.js
Page({
  data: {
    scale: 18, // 缩放级别，默认18，数值在0~18之间
    latitude: 0, // 给个默认值
    longitude: 0 // 给个默认值
  },

  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

    // 调用wx.getLocation系统API, 获取并设置当前位置经纬度
    wx.getLocation({
      type: "gcj02", // 坐标系类型
      // 获取经纬度成功回调
      success: (res) => { // es6 箭头函数，可以解绑当前作用域的this指向，使得下面的this可以绑定到Page对象
        this.setData({  // 为data对象里定义的经纬度默认值设置成获取到的真实经纬度，这样就可以在地图上显示我们的真实位置
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    });

    //设置地图控件的位置及大小，通过设备宽高定位
    wx.getSystemInfo({ // 系统API,获取系统信息，比如设备宽高
      success: (res) => {
        this.setData({
          // 定义控件数组，可以在data对象初始化为[],也可以不初始化，取决于是否需要更好的阅读
          controls: [{
            id: 1, // 给控件定义唯一id
            iconPath: '/images/location.png', // 控件图标
            position: { // 控件位置
              left: 20, // 单位px
              top: res.windowHeight - 80, // 根据设备高度设置top值，可以做到在不同设备上效果一致
              width: 50, // 控件宽度/px
              height: 50 // 控件高度/px
            },
            clickable: true // 是否可点击，默认为true,可点击
          },
          {
            id: 2,
            iconPath: '/images/use.png',
            position: {
              left: res.windowWidth / 2 - 45,
              top: res.windowHeight - 100,
              width: 90,
              height: 90
            },
            clickable: true
          },
          {
            id: 3,
            iconPath: '/images/warn.png',
            position: {
              left: res.windowWidth - 70,
              top: res.windowHeight - 80,
              width: 50,
              height: 50
            },
            clickable: true
          },
          {
            id: 4,
            iconPath: '/images/marker.png',
            position: {
              left: res.windowWidth / 2 - 11,
              top: res.windowHeight / 2 - 45,
              width: 22,
              height: 45
            },
            clickable: false
          },
          {
            id: 5,
            iconPath: '/images/avatar.png',
            position: {
              left: res.windowWidth - 68,
              top: res.windowHeight - 155,
              width: 45,
              height: 45
            },
            clickable: true
          }]
        })
      }
    });
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
    this.mapCtx = wx.createMapContext("ofoMap"); // 地图组件的id
    this.movetoPosition()
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },


  //methods
  // 定位函数，移动位置到地图中心
  movetoPosition: function () {
    this.mapCtx.moveToLocation();
  },
  // 地图控件点击事件
  bindcontroltap: function (e) {
    // 判断点击的是哪个控件 e.controlId代表控件的id，在页面加载时的第3步设置的id
    switch (e.controlId) {
      // 点击定位控件
      case 1: this.movetoPosition();
        break;
      // 点击立即用车，判断当前是否正在计费，此处只需要知道是调用扫码，后面会讲到this.timer是怎么来的
      case 2: if (this.timer === "" || this.timer === undefined) {
        // 没有在计费就扫码
        wx.scanCode({
          success: (res) => {
            // 正在获取密码通知
            wx.showLoading({
              title: '正在获取密码',
              mask: true
            })
            // 请求服务器获取密码和车号
            wx.request({
              url: 'https://www.easy-mock.com/mock/59098d007a878d73716e966f/ofodata/password',
              data: {},
              method: 'GET',
              success: function (res) {
                // 请求密码成功隐藏等待框
                wx.hideLoading();
                // 携带密码和车号跳转到密码页
                wx.redirectTo({
                  url: '../scanresult/index?password=' + res.data.data.password + '&number=' + res.data.data.number,
                  success: function (res) {
                    wx.showToast({
                      title: '获取密码成功',
                      duration: 1000
                    })
                  }
                })
              }
            })
          }
        })
        // 当前已经在计费就回退到计费页
      } else {
        wx.navigateBack({
          delta: 1
        })
      }
        break;
      // 点击保障控件，跳转到报障页
      case 3: wx.navigateTo({
        url: '../warn/index'
      });
        break;
      // 点击头像控件，跳转到个人中心
      case 5: wx.navigateTo({
        url: '../my/index'
      });
        break;
      default: break;
    }
  },
})
