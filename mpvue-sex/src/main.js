import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
  // 这个字段走 app.json
  config: {
    // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
    pages: ['^pages/app/home/main'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: '淘淘情',
      navigationBarTextStyle: 'black'
    },
    tabBar: {
          "borderStyle": "white",
          "color": "#9e9e9e",
          "backgroundColor": "#fff",
          "selectedColor": "#fa3789",
          "list": [{
                  "pagePath": "pages/app/home/main",
                  "text": "发现",
                  "iconPath": "static/img/icon_discover.png",
                  "selectedColor": "#fa3789",
                  "selectedIconPath": "static/img/icon_discover_active.png"
              },
              {
                  "pagePath": "pages/app/course/main",
                  "text": "课程",
                  "iconPath": "static/img/icon_course.png",
                  "selectedColor": "#fa3789",
                  "selectedIconPath": "static/img/icon_course_active.png"
              },
              {
                  "pagePath": "pages/app/my/main",
                  "selectedColor": "#fa3789",
                  "text": "我的",
                  "iconPath": "static/img/icon_mine.png",
                  "selectedIconPath": "static/img/icon_mine_active.png"
              }
          ]
      }
  }
}
