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


    onLaunch() {
        console.log('onLaunch')
        // wx.login({
        //     success: function(loginReturn) {
        //         if(loginReturn.code){
        //             fly.post('/miniprogram/login',{
        //                 code: loginReturn.code
        //             }).then(rsp => {
        //                 if(rsp.code === 200 && rsp.data){
        //                     try {
        //                         wx.setStorageSync('sessionId', rsp.data.sessionId)
        //                     } catch (e) {
        //                         console.log('on setStorageSync sessionId error:', e)
        //                     }
        //                     //后台登录成功
        //                     wx.getUserInfo({
        //                         withCredentials: true,
        //                         success: function(userReturn) {
        //                             console.log(userReturn)
        //                             try {
        //                                 wx.setStorageSync('userInfo', userReturn.userInfo)
        //                             } catch (e) {
        //                                 console.log('on setStorageSync userInfo error:', e)
        //                             }

        //                             fly.post('/miniprogram/saveUserInfo', userReturn).then(rsp => {
        //                                 console.log('save userInfo ok')
        //                             })
        //                         }
        //                     })
        //                 }
        //             })
        //         }
        //     }
        // })
    },
    onShow() {
        console.log('onShow')
        // wx.getUserInfo({
        //     success: function(res) {
        //         console.log(res)
        //     }
        // })
    },
    onHide() {
        console.log('onHide')
    },
}

</script>
<style lang="less">
@import '~assets/iconfont/iconfont.css';
@import '~assets/less/app.less';

</style>
