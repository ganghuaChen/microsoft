<template>
    <div class="page-room">
        <!-- <live-player src="rtmp://27896.liveplay.myqcloud.com/live/27896_a247a59788a011e892905cb9018cf0d4" mode="live" autoplay  style="width: 100vw; height: 35vh;" @error="onLiveError" @statechange="onLiveStateChange"/> -->
       <video class="record-video" id="myVideo" src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400" :danmu-list="danmuList" enable-danmu danmu-btn controls objectFit="fill"></video>
       <div class="room-info">
           <div class="room-title">
               <span class="room-state">直播中</span>
               我是房间标题我是房间标题我是房间标题我是房间标题
           </div>
           <div class="room-desc">我是房间描述我是房间描述我是房间描述我是房间描述我是房间描述我是房间描述</div>
           <div class="room-time">直播时间 <span class="time"> 2018.08.14 14:00:00 - 2018.08.15 13:00:00 </span></div>
       </div>

       <!-- <div class="room-goods">
           房间产品
       </div> -->

       <comment></comment>
    </div>
</template>
<script>
import comment from '@/components/comment'
import fly from '@/utils/fly'
export default {
    components: {
        comment
    },
    data() {
        return {
            danmuList: [{
                text: '第 1s 出现的弹幕',
                color: '#ff0000',
                time: 1
              },
              {
                text: '第 3s 出现的弹幕',
                color: '#ff00ff',
                time: 3
            }]
        }
    },

    methods: {
        onLiveError(err){
            console.log(err)
        },

        onLiveStateChange(err){
            console.log(err)
        },
        
    },
    
    mounted() {

    }
}

</script>
<style lang="less">
@import '~assets/less/color.less';
.page-room {
    background-color: #f7f8f9;
    .record-video{
        width: 100vw;
        display: block;
        margin: 0;
    }
    .room-info{
        padding: 20rpx;
        line-height: 1.8;
        background-color: #fff;
        .room-title{
            .room-state{
                display: inline-block;
                padding: 10rpx;
                line-height: 1;
                color:#fff;
                background-color: @primary;
                font-size: 80%;
                border-radius: 8rpx;
            }
        }
        .room-desc{
            margin: 20rpx 0;
            font-size: 85%;
            color: #707070;
        }
        .room-time{
            font-size: 85%;
            .time{
                color: #707070;
            }
        }
    }
}

</style>
