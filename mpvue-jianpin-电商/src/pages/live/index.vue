<template>
    <div class="page-live">
        <live-player src="rtmp://27896.liveplay.myqcloud.com/live/27896_a247a59788a011e892905cb9018cf0d4" mode="live" autoplay  style="width: 300px; height: 225px;" @error="onLiveError" @statechange="onLiveStateChange"/>
       
    </div>
</template>
<script>

import fly from '@/utils/fly'
export default {
    components: {
    },
    data() {
        return {
            
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
.page-live {
    
}

</style>
