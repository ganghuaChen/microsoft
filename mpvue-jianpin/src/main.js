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
            'pages/auth/main', 
            '^pages/index/main', 
            'pages/cart/main', 
            'pages/center/main', 
            'pages/good/main', 
            'pages/activity/main', 
            'pages/myActivity/main', 
            'pages/coupon/main', 
            'pages/couponDetail/main', 
            'pages/couponVerify/main', 
            'pages/myCoupon/main', 
            'pages/commit/main', 
            'pages/commit/coupon/main', 
            'pages/order/main', 
            'pages/promotion/main', 
            'pages/address/main', 
            'pages/addressHandle/main',
        ],
        window: {
            backgroundTextStyle: 'light',
            backgroundColor: '#fff',
            navigationBarBackgroundColor: '#fff',
            navigationBarTitleText: '美橙汇',
            navigationBarTextStyle: 'black',
        },
        tabBar: {
            "borderStyle": "white",
            "color": "#9e9e9e",
            "backgroundColor": "#fff",
            "selectedColor": "#fda15a",
            "list": [{
                    "pagePath": "pages/index/main",
                    "text": "首页",
                    "iconPath": "static/images/home.png",
                    "selectedColor": "#fda15a",
                    "selectedIconPath": "static/images/home_active.png"
                },
                // {
                //     "pagePath": "pages/cart/main",
                //     "text": "购物车",
                //     "iconPath": "static/images/cart.png",
                //     "selectedColor": "#fda15a",
                //     "selectedIconPath": "static/images/cart_active.png"
                // },
                {
                    "pagePath": "pages/center/main",
                    "selectedColor": "#fda15a",
                    "text": "我的",
                    "iconPath": "static/images/center.png",
                    "selectedIconPath": "static/images/center_active.png"
                }
            ]
        }
    }
}
