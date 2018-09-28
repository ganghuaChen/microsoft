<script>
import './assets/iconfont/iconfont.css';

export default {
    created() {
        // 调用API从本地缓存中获取数据
        // const logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)

        console.log('app created and cache logs by setStorageSync')
    },
    onLaunch() {
        console.log('onLaunch')
    },
    onShow() {
        console.log('onShow')
        wx.getUserInfo({
            success: function(rsp) {
                console.log(rsp)
            }
        })
    },
    onHide() {
        console.log('onHide')
    },
}

</script>
<style lang="less">
@import '~assets/less/color.less';

* {
    box-sizing: border-box;
}

</style>
