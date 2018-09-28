<template>
    <div class="app-back-top" @tap="backTop">
        <!--返回顶部-->
        <div class="arr"></div>
    </div>
</template>
<script>
export default {
    props: {
        visible: Boolean
    },
    methods: {
        backTop() {
            this.$emit('backTop')
        }
    }
}

</script>
<style lang="less">
.app-back-top{
    position: fixed;
    bottom: 40rpx;
    right: 20rpx;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    border: 1rpx solid #ccc;
    background-color: rgba(255,255,255, .8);
    .arr{
        width: 30rpx;
        height: 30rpx;
        margin: 32rpx auto 0;
        border-top: 3rpx solid #666;
        border-left: 3rpx solid #666;
        transform: rotate(45deg);
    }
}

</style>
