<template>
    <div class="app-panel" v-if="courseList.length>0">
            <h4 class="panel-hd vux-1px-b">
                课程试听 <span class="refresh pull-right" @click="getCourseList">换一换 <i class="iconfont icon-refresh"></i></span>
            </h4>
            <div class="panel-bd">
                <ul class="listen-list clearfix">
                    <li class="list-item" 
                        v-for="(item, index) in courseList" :key="item.id"
                        @click="openCourseDetail(item)">
                        <div class="img lazy" :style="'background-image:' + item.logo"></div>
                        <div class="txt">
                            <p>{{item.courseName}}</p>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
</template>

<script>
import {queryTjCourse} from 'api/course'

export default{
    data(){
        return {
            courseList: [],
        }
    },
    methods: {
        getCourseList(){
            queryTjCourse(3).then(rsp => {
                this.courseList = rsp.data
            })
        },

        openCourseDetail(course){
            sessionStorage.courseDetail = JSON.stringify(course)
            this.$router.push( {name: 'courseDetail', params: {id: course.id}} )
        }
    },
    created(){
        this.getCourseList()
    }
}
</script>

<style scoped lang="less">
.listen-list{
        margin: 0 -5px;
        display: flex;
        .list-item{
            flex: 1;
            margin: 5px;
            background-color: #f7f8f9;
            border-radius: 5px;
            .img{
                height: 100px;
                border-radius: 5px 5px 0 0;
                overflow: hidden;
                background-size: cover;
                background-repeat: no-repeat;
                background-position: 50% 50%;
            }
            .txt{
                padding: 5px;
                p{
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                    font-size: 13px;
                }
            }   
        }
    }
</style>