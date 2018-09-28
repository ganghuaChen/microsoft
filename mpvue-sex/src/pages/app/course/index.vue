<template>
    <div class="page-course">
        <course-list :dataList="dataList"></course-list>

        <!-- <web-view src="https://media.zjrvip.com/"></web-view> -->
    </div>
</template>

<script>
import {queryCourse} from 'api/course'

import courseList from 'components/courseList'
export default{
    name: 'course',
    components: {
        courseList
    },
    data(){
        return {
            loading: false,
            dataObj: {
                isLastPage: false,
                pageNum: 0,
                pageSize: 10,
                list: []
            },
            dataList: []
        }
    },
    methods: {
        getDataList(){
            if(!this.dataObj.isLastPage && !this.loading){
                this.loading = true
                queryCourse({
                    pageNum: ++this.dataObj.pageNum,
                    pageSize: this.dataObj.pageSize
                }).then(rsp => {
                    if(rsp.data.list){
                        if(rsp.data.list.length>0){
                            this.dataObj = rsp.data
                            this.dataList = this.dataList.concat(rsp.data.list)
                        }else{
                            this.dataObj.isLastPage = true
                        }
                    }
                    this.loading = false
                })
            }
        }
    },
    created(){
        this.getDataList()
    }
}
</script>

<style lang="less">
@import '~assets/less/color.less';
.page-course{
    min-height: 100vh;
    background-color: #f7f8f9;
    .course-list{
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
}
</style>