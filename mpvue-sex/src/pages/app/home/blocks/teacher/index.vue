<template>
    <div class="app-panel" v-if="teacherList.length>0">
        <h4 class="panel-hd vux-1px-b">
                情感导师 <span class="refresh pull-right" @click="onDataRefresh(teacherIndex, teacherList)">换一换 <i class="iconfont icon-refresh"></i></span>
            </h4>
        <div class="panel-bd">
            <ul class="teacher-list clearfix">
                <li class="list-item" v-for="(item, index) in teacherList" :key="item.id" v-if="index >= teacherIndex[0] && index <= teacherIndex[1]">
                    <div class="inner" @click="openTeacherDetail(item.id)">
                        <div class="img lazy" :style="'background-image:' + item.avatar"></div>
                        <div class="txt">
                            <h4>{{item.userName}}</h4>
                            <!-- <p>伯母传媒签约情感专家</p> -->
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
import { queryQgTeacherAll } from 'api/teacher'
export default {
    data() {
        return {
            teacherList: [],
            teacherIndex: [0, 2]
        }
    },
    methods: {
        getTeacherList() {
            queryQgTeacherAll().then(rsp => {
                this.teacherList = rsp.data
            })
        },

        onDataRefresh(dataIndex, dataList) {
            if (dataIndex[1] > dataList.length - 1) {
                this.$set(dataIndex, 0, 0)
                this.$set(dataIndex, 1, 2)
            } else {
                this.$set(dataIndex, 0, dataIndex[0] + 3)
                this.$set(dataIndex, 1, dataIndex[1] + 3)
            }
        },

        openTeacherDetail(id){
            this.$router.push( {name: 'teacher', params: {id: id}} )
        },
    },
    created() {
        this.getTeacherList()
    }
}

</script>
<style scoped lang="less">
.teacher-list {
    margin: 0 -5px;
    .list-item {
        float: left;
        width: 33.333%;
        padding: 5px;
        .inner {
            padding: 10px;
            background-color: #f7f8f9;
            border-radius: 5px;
        }
        .img {
            width: 100%;
            height: 0;
            padding-bottom: 100%;
            border-radius: 50%;
            overflow: hidden;
            background-size: cover;
            background-repeat: no-repeat;
            background-position: 50% 50%;
        }
        .txt {
            margin-top: 10px;
            h4 {
                font-size: 14px;
                text-align: center;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            p {
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                font-size: 12px;
                color: #707070;
            }
        }
    }
}

</style>
