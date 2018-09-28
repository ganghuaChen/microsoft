// pages/mail/mail.js
var app = getApp(),
openId = wx.getStorageSync('openid')
Page({
  data: {
    company: '顺丰',
    num: 602410081599,
    companyArr: {
      '申通': 'shentong',
      '圆通': 'yuantong',
      '中通': 'zhongtong',
      '汇通': 'huitongkuaidi',
      '韵达': 'yunda',
      'aae专递': 'aae',
      '安捷': 'anjie',
      '安信达': 'anxinda',
      '彪记': 'biaoji',
      'bht': 'bht',
      '百福': 'bfdf',
      '希伊艾斯': 'cces',
      '中国东方': 'cos',
      '长宇': 'cy',
      '大田': 'dt',
      '德邦': 'db',
      'dhl': 'dhl',
      'dpex': 'dpex',
      'd速': 'ds',
      '递四方': 'disifang',
      'ems': 'ems',
      '联邦': 'fedex',
      '飞康达': 'fkd',
      '凤凰': 'fh',
      '飞快达': 'feikuaida',
      '能达': 'nengda',
      '广东邮政': 'gdyz',
      '共速达': 'gongsuda',
      '恒路': 'hl',
      '华夏龙': 'huaxialong',
      '海红网送': 'haihongwangsong',
      '海外环球': 'haiwaihuanqiu',
      '佳怡': 'jiayiwuliu',
      '京广': 'jingguang',
      '急先达': 'jxd',
      '佳吉': 'jj',
      '加运美': 'jym',
      '金大': 'jinda',
      '嘉里大通': 'jialidatong',
      '晋越': 'jinyue',
      '快捷': 'kuaijie',
      '联邦': 'lianb',
      '联昊通': 'lianhaotong',
      '龙邦': 'lb',
      '立即送': 'lijisong',
      '乐捷递': 'lejiedi',
      '民航': 'mh',
      '美国快递': 'meiguo',
      '门对门': 'menduimen',
      'ocs': 'ocs',
      '配思': 'ps',
      '全晨': 'qc',
      '全峰': 'qfkd',
      '全际通': 'quanjitong',
      '全日通': 'quanritong',
      '全一': 'quanyi',
      '如风达': 'rufengda',
      'santaisudi': 'santaisudi',
      '盛辉': 'shenghui',
      'shentong': 'shentong',
      '顺丰': 'shunfeng',
      '速尔': 'suer',
      '盛丰': 'shengfeng',
      '赛澳递': 'saiaodi',
      '天地': 'tiandi',
      '天天': 'tiantian',
      'tnt': 'tnt',
      'ups': 'ups',
      '万家': 'wanjia',
      '文捷': 'wenjie',
      '伍圆': 'wuyuan',
      '万象': 'wanxiang',
      '新邦': 'xinbang',
      '信丰': 'xinfeng',
      '星晨': 'xcjb',
      '鑫飞鸿': 'xinhongyukuaidi',
      '亚风': 'yafeng',
      '一邦': 'yibang',
      '优速': 'youshu',
      '邮政国内': 'youzhengguonei',
      '邮政国际': 'youzhengguoji',
      '远成': 'yuancheng',
      '源伟丰': 'yuanweifeng',
      '元智': 'yuanzhi',
      '运通': 'yuntong',
      '越丰': 'yuefeng',
      '源安达': 'yuananda',
      '银捷': 'yinjie',
      '宅急送': 'zhaijisong',
      '中铁': 'zhongtiekuaiyun',
      '中邮': 'zhongyou',
      '忠信达': 'zhongxinda',
      '芝麻开门': 'zhimakaimen'
    },
    identityIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // wx.showLoading({
    //   title: '加载中',
    // })
    let that = this,
      orderSn = options.order_sn,
      openid = wx.getStorageSync('openid')
      console.log(orderSn,openid)
    this.setData({
      orderSn : orderSn
    })
    wx.request({
      url: app.globalData.hostname + 'home/index/shop_orderdetail',
      data: {
        ordersn: orderSn,
        openid: openid
      },
      success: function (res) {
        wx.hideLoading()
        console.log(99)
        console.log(res)
        that.setData({
          orderInfo: res.data.result[0],
          identityId: res.data.result[0].identityid
        })
        wx.request({
          url: app.globalData.hostname +  'home/index/get_customs_info',
          data:{
            openid: openId
          },
          success:function(res){
            console.log(res)
            let identityList = [],
              identityIndex = 0
            res.data.result.forEach(function (value,index){
              identityList.push(value.name)
              if (value.id == that.data.identityId){
                identityIndex = index
              }
            })
            that.setData({
              identityList: identityList,
              identity: res.data.result,
              identityIndex: identityIndex
            })
            // 调用api查询快递信息
            let companyName = that.data.companyArr[that.data.orderInfo.express],
              r_companyName = that.data.companyArr[that.data.orderInfo.r_express]
            console.log(that.data.orderInfo.status)
            if (that.data.orderInfo.status != '取消' && that.data.orderInfo.status != '待发货' && that.data.orderInfo.status != '待付款') {
              wx.request({
                url: 'https://www.kuaidi100.com/query?type=' + companyName + '&postid=' + that.data.orderInfo.expresssn,
                success: function (res) {
                  console.log(res)
                  that.setData({
                    mailList: res.data.data
                  })
                },
                fail: function (res) {
                  console.log(res)
                }
              })
              // 退货信息
              wx.request({
                url: 'https://www.kuaidi100.com/query?type=' + r_companyName + '&postid=' + that.data.orderInfo.r_expresssn,
                success: function (res) {
                  console.log(res)
                  that.setData({
                    r_mailList: res.data.data
                  })
                },
                fail: function (res) {
                  console.log(res)
                }
              })
            }
            
          }
        })
      },
      fail: function(res){
        wx.hideLoading()
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
  changeIdentity: function(event){
    let identityIndex = event.detail.value,
    that = this,
    id = Number(this.data.identity[identityIndex].id)
    console.log(id, openId, this.data.orderSn)
    this.setData({
      identityIndex: identityIndex
    })
    // return
    wx.request({
      url: app.globalData.hostname + 'home/index/order_customs',
      data: {
        ordersn : that.data.orderSn,
        openid : openId,
        id:id  
      },
      success: function(res){
        console.log(res)
      }
    })
  }
})