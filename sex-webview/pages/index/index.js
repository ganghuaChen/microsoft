//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    
  },
  onShareAppMessage(options) {
    console.log(options.webViewUrl)
    
  }
})
