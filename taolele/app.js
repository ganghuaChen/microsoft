// var aldstat = require("./utils/ald-stat.js");

//app.js
App({
  onLaunch: function (options) {
    // wx.showModal({
    //   content: "onLaunch adzoneId：" + wx.getStorageSync('adzoneId'),
    //   showCancel: false
    // });
  },
  onShow: function (options){
    // wx.showModal({
    //   content: `options: ${JSON.stringify(options)}`,
    //   showCancel: false
    // });
  },
  onHide: function(options){
    // wx.showModal({
    //   content: `options: ${JSON.stringify(options)}`,
    //   showCancel: false
    // });
  },
  
  globalData:{
    adzoneId: '',
    cfg: {
      
    },
    url: {
      categories: 'https://taoll.syb16888.com/api/1.0/web/apps/taoll/customer/categories',
      allGoods: 'https://taoll.syb16888.com/api/1.0/web/apps/taoll/customer/home/items/',
      ctgGoods: 'https://taoll.syb16888.com/api/1.0/web/apps/taoll/customer/items/',
      mycode: 'https://taoll.syb16888.com/api/1.0/web/apps/taoll/customer/mycode/',

      detail: 'https://taoll.syb16888.com/api/1.0/web/apps/taoll/customer/detail/item/',
      recomend: 'https://taoll.syb16888.com/api/1.0/web/apps/taoll/customer/recommend/items/',

      setting: 'https://taoll.syb16888.com/api/1.0/web/apps/taoll/config',
      smsCode: 'https://taoll.syb16888.com/api/1.0/web/shortmessage/send'
    }
  },

})