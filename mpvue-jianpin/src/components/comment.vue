<template>
    <div class="page-comment">
        <div class="title">评论</div>
        <div class="content">
            <div class="comment-list">
                <div class="comment-item" v-for="i in 10" :key="i">
                    <div class="avatar">
                        
                        <image mode="widthFix" src="/static/images/logo.png"></image>
                    </div>
                    <div class="info">
                        <div class="nick-name">大魔王</div>
                        <div class="send-time">8-14 14:00:05</div>
                        <div class="words">很老实的把塔林姆划到s了嘛哈哈哈哈哈哈哈哈哈哈哈哈哈哈……</div>
                    </div>
                </div>
            </div>
        </div>
        <div class="handle">
            <input class="input" placeholder="输入评论……" confirm-type="send"/>
            <!-- <textarea auto-height class="input"></textarea> -->
            
        </div>
    </div>
</template>

<script>
export default {
  
}
</script>
<style lang="less">
.page-comment{
    margin-top: 20rpx;
    padding-bottom: 100rpx;
    background-color: #fff;
    .title{
        padding: 20rpx;
        font-size: 32rpx;
        border-bottom: 1px solid #ddd;
    }
    .content{
        padding: 10rpx 20rpx;
        .comment-list{
            .comment-item{
                display: flex;
                margin: 20rpx 0;
                .avatar{
                    width: 80rpx;
                    height: 80rpx;
                    border-radius: 50%;
                    overflow: hidden;
                    image{
                        width: 100%;
                    }
                }
                .info{
                    flex: 1;
                    font-size: 28rpx;
                    padding-left: 20rpx;
                    .nick-name{
                        color: #666;
                        line-height: 40rpx;
                    }
                    .send-time{
                        line-height: 40rpx;
                        font-size: 90%;
                        color: #707070;
                    }
                    .words{
                        color: #333;
                        padding: 10rpx 0;
                        line-height: 1.8;
                    }
                }
            }
        }
    }
    .handle{
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: 100rpx;
        padding: 10rpx;
        border-top: 1px solid #ddd;
        background-color: #fff;
        box-sizing: border-box;
        .input{
            display: block;
            width: 100%;
            height: 100%;
            padding-left: 20rpx;
            padding-right: 20rpx;
            font-size: 28rpx;
            background-color: #f7f8f9;
            box-sizing: border-box;
            border-radius: 10rpx;
        }
    }
}
</style>