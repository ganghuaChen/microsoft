<template>
    <div class="app-course-list">
        <ul v-if="dataList.length>0">
            <li class="list-item vux-1px-b" 
                v-for="(item,index) in dataList" :key="item.id"
                @click="openCourseDetail(item.id)">
                <div class="img" :style="'background-image:' + item.logo">
                    <i class="iconfont icon-play"></i>
                </div>
                <div class="txt">
                    <p class="name">{{item.courseName}}</p>
                    <p class="info">
                        0人在学
                        <span class="price" v-if="item.salePrice > 0">￥{{item.salePrice}}</span>
                        <span class="price" v-else>免费</span>
                    </p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>

export default{
    name: 'courseList',
    props: {
        dataList: Array
    },
    data(){
        return {

        }
    },
    methods: {
        openCourseDetail(id){
            // this.$router.push({name: 'courseDetail', params: {id: id}})
        }
    }
}
</script>

<style lang="less">
@import '~assets/less/color.less';
.app-course-list{
    padding: 10px;
    .list-item{
        display: flex;
        align-items: center;
        margin: 0 0 10px 0;
        padding-bottom: 10px;
        &:last-child{
            margin-bottom: 0;
        }
        .img{
            width: 100px;
            height: 80px;
            border-radius: 5px;
            overflow: hidden;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: 50% 50%;
            position: relative;
            .iconfont{
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);

                padding: 8px 7px 8px 9px;
                border-radius: 50%;
                line-height: 1;
                color: #fff;
                background-color: rgba(0,0,0,.5);
            }
        }
        .txt{
            flex: 1;
            padding-left: 10px;
            .name{
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                font-size: 13px;
            }
            .info{
                margin-top: 10px;
                color: #999;
                font-size: 12px;
                .price{
                    color: @primary;
                    float: right;
                }
            }
        }   
    }
}
</style>