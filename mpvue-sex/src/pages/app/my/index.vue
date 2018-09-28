<template>
    <div class="page-my">
        <div class="my-info">
            <div class="user">
                <div class="avatar"><img class="lazy" :src="userInfo.headImgUrl" alt=""></div>
                <div class="name">{{userInfo.nickName}}</div>
            </div>
        </div>

        <div class="my-menus">
            <dl class="menu-list clearfix">
                <dd class="menu-item">
                    <div class="icon icon1"><i class="iconfont icon-fav"></i></div>
                    <div class="label">我的收藏</div>
                </dd>
                <dd class="menu-item">
                    <div class="icon icon2"><i class="iconfont icon-book"></i></div>
                    <div class="label">我的课程</div>
                </dd>
                <dd class="menu-item">
                    <div class="icon icon3"><i class="iconfont icon-focus"></i></div>
                    <div class="label">我的关注</div>
                </dd>
                <!-- <dd class="menu-item">
                    <div class="icon icon4"><i class="iconfont icon-tuiguang"></i></div>
                    <div class="label">分销推广</div>
                </dd>
                <dd class="menu-item disabled">
                    <div class="icon icon5"><i class="iconfont icon-gift"></i></div>
                    <div class="label">赠送课程</div>
                </dd>
                <dd class="menu-item disabled">
                    <div class="icon icon6"><i class="iconfont icon-more"></i></div>
                    <div class="label">更多</div>
                </dd> -->
            </dl>
        </div>
    </div>
</template>

<script>
export default{
    name: 'my',
    data(){
        return {
            userInfo: {
                headImgUrl: '',
                nickName: ''
            }
        }
    },
    methods: {

    },
    created(){
        // this.userInfo = this.$root.$children[0].userInfo
    }
}
</script>

<style lang="less">
.page-my{
    min-height: 100vh;
    background-color: #f7f8f9;
    .my-info{
        height: 0;
        padding-bottom: 40%;
        background: url(/static/img/bg_gr@2x.png) 0 0 no-repeat;
        background-size: cover;
        position: relative;
        .user{
            position: absolute;
            left: 50%;
            bottom: -80px;
            transform: translate(-50%, 0);
            text-align: center;
            .avatar{
                width:80px;
                height: 80px;
                margin: 0 auto;
                border-radius: 50%;
                overflow: hidden;
                box-shadow: 0 1px 2px rgba(0,0,0,.2);
                img{
                    display: block;
                    margin: 0 auto;
                    border-radius: 50%;
                }
            }
            .name{
                line-height: 40px;
            }
        }
    }

    .my-menus{
        padding: 120px 0;
        .menu-list{
            .menu-item{
                float: left;
                width: 33.333%;
                margin: 15px 0;
                text-align: center;
                &.disabled{
                    .icon{
                        color: #ccc !important;
                    }
                    .label{
                        color: #ccc !important;
                    }
                }
                .icon{
                    .iconfont{
                        font-size: 24px;
                    }
                    &.icon1{
                        color: #fb78b0;
                    }
                    &.icon2{
                        color: #51a8f8;
                    }
                    &.icon3{
                        color: #f9865e;
                    }
                    &.icon4{
                        color: #fbac41;
                    }
                    &.icon5{
                        color: #e47582;
                    }
                    &.icon6{
                        color: #77cd87;
                    }
                }
                .label{
                    margin-top: 5px;
                    font-size: 13px;
                    color: #333;
                }
            }
        }
    }
}
</style>