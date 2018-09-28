<script>
import fly from '@/utils/fly'
export default {
  created() {
    // 调用API从本地缓存中获取数据
    // const logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)

    // console.log('app created and cache logs by setStorageSync')
  },
  methods: {
    login() {
      wx.login({
        success: function(loginReturn) {
          if (loginReturn.code) {
            fly.post('/miniprogram/login', {
              code: loginReturn.code
            }).then(rsp => {
              if (rsp.code === 200 && rsp.data) {
                try {
                  wx.setStorageSync('sessionId', rsp.data.sessionId)
                  wx.setStorageSync('userId', rsp.data.id)
                } catch (e) {
                  console.log(e)
                }

                if (!wx.getStorageSync('userInfo')) {
                  wx.navigateTo({
                    url: '../auth/main'
                  })
                } else {
                  const time = 60 * 1000 * 2
                  setInterval(() => {
                    fly.get('/apps/jp/customer/getCurrCust').then(rsp => {
                      if(rsp.code === 200){
                        wx.setStorageSync('userInfo', rsp.data)
                      }
                    })
                  }, time)
                }
              }
            })
          }
        }
      })
    }
  },

  onLaunch(options) {
    this.login()

    if (options.query && options.query.tenantId) {
      wx.setStorageSync('tenantId', options.query.tenantId)

    } else {
      //默认为平台的店铺
      wx.setStorageSync('tenantId', '5001')
    }
  },
  onShow() {
    // console.log('onShow')
    // wx.getUserInfo({
    //     success: function(res) {
    //         console.log(res)
    //     }
    // })
  },
  onHide() {
    // console.log('onHide')
  },
}

</script>
<style lang="less">
@import '~assets/iconfont/iconfont.css';
@import '~assets/less/app.less';

</style>
