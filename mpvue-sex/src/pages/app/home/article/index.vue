<template>
    <div class="page-index-article">
        文章列表
        <article-list :dataList="dataList"></article-list>
    </div>
</template>

<script>
import {queryArticleByClassId} from 'api/article'

import articleList from 'components/articleList'
export default {
    name: '',
    props: {
        articleClassId: String
    },
    components: {
        articleList
    },
    data() {
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
    watch: {
        articleClassId(val){
            this.dataList = []
            this.dataObj = {
                isLastPage: false,
                pageNum: 0,
                pageSize: 10,
                list: []
            }
            this.getArticleList()
        }
    },
    methods: {
        getArticleList(){
            if(!this.dataObj.isLastPage && !this.loading){
                this.loading = true
                queryArticleByClassId(this.articleClassId, {
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
        },
    },
    created() {
        this.getArticleList()
    }
}
</script>

<style lang="less">
@import '~assets/less/color.less';
.page-index-article{
    padding: 10px;
    .article-list{
        .list-item{
            padding-bottom: 10px;

            .create-time{
                text-align: right;
                margin-top: 15px;
                font-size: 12px;
                color: #999;
            }
        }
    }
}
</style>