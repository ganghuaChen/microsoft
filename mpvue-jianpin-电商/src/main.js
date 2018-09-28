import Vue from 'vue'
import App from './App'
import fly from '@/utils/fly'

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()

export default {
    // 这个字段走 app.json
    config: {
        // 页面前带有 ^ 符号的，会被编译成首页，其他页面可以选填，我们会自动把 webpack entry 里面的入口页面加进去
        pages: [    
            'pages/login/main', 
            '^pages/index/main', 
            'pages/cart/main', 
            'pages/center/main', 
            'pages/good/main', 
            'pages/commit/main', 
            'pages/order/main', 
            'pages/address/main', 
            'pages/addressHandle/main',
        ],
        window: {
            backgroundTextStyle: 'light',
            backgroundColor: '#f00',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: '尖品好货',
            navigationBarTextStyle: 'black',
        },
        tabBar: {
            "borderStyle": "white",
            "color": "#9e9e9e",
            "backgroundColor": "#fff",
            "selectedColor": "#b62e33",
            "list": [{
                    "pagePath": "pages/index/main",
                    "text": "首页",
                    "iconPath": "static/images/home.png",
                    "selectedColor": "#b62e33",
                    "selectedIconPath": "static/images/home_active.png"
                },
                {
                    "pagePath": "pages/cart/main",
                    "text": "购物车",
                    "iconPath": "static/images/cart.png",
                    "selectedColor": "#b62e33",
                    "selectedIconPath": "static/images/cart_active.png"
                },
                {
                    "pagePath": "pages/center/main",
                    "selectedColor": "#b62e33",
                    "text": "我的",
                    "iconPath": "static/images/center.png",
                    "selectedIconPath": "static/images/center_active.png"
                }
            ]
        }
    }
}
