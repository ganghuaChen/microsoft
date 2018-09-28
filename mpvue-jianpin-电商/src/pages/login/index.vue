<template>
  <div class="page-login">

  </div>
</template>

<script>
import fly from '@/utils/fly'
export default {
  methods: {
    //   onGotUserInfo(e){
    //       console.log(e.mp.detail)
    //     //   console.log(e.detail.errMsg)
    //     //     console.log(e.detail.userInfo)
    //     //     console.log(e.detail.rawData)
    //   },
    login(){
      wx.login({
            success: function(loginReturn) {
                if(loginReturn.code){
                    fly.post('/miniprogram/login',{
                        code: loginReturn.code
                    }).then(rsp => {
                        if(rsp.code === 200 && rsp.data){
                            try {
                                wx.setStorageSync('sessionId', rsp.data.sessionId)
                            } catch (e) {
                                console.log('on setStorageSync sessionId error:', e)
                            }
                            
                            //后台登录成功
                            wx.getUserInfo({
                                // withCredentials: true,
                                success: function(userReturn) {
                                    console.log(userReturn)
                                    try {
                                        wx.setStorageSync('userInfo', userReturn.userInfo)
                                    } catch (e) {
                                        console.log('on setStorageSync userInfo error:', e)
                                    }

                                    fly.post('/miniprogram/saveUserInfo', userReturn).then(rsp => {
                                        console.log('save userInfo ok')
                                    })
                                }
                            })

                            wx.switchTab({
                              url: '../index/main'
                            })
                        }   
                    })
                }
            }
        })
    }
  },
  created(){
    this.login()

    
  }
}
</script>

<style>
.page-login {

}
</style>
