<template>
    <div class="app-panel home-article" v-if="articleList.length>0">
        <h4 class="panel-hd vux-1px-b">
            头条文章 
            <span class="refresh pull-right" 
                @click="onChange"> 换一换 <i class="iconfont icon-refresh"></i></span>
        </h4>
        <div class="panel-bd">
            <article-list :dataList="articleList"></article-list>
        </div>
    </div>
</template>

<script>
import {queryTjArticle, queryArticleClass, queryArticleByClassId} from 'api/article'
import articleList from 'components/articleList'
export default{
    components: {
        articleList
    },
    data(){
        return {
            articleList: [],
            articleIndex: [0, 2],
        }
    },
    methods: {
        getTjArticle(){
            queryTjArticle({size: 5}).then(rsp => {
                this.articleList = rsp.data
            })
        },

        onChange(){
            queryTjArticle({size: 5, flag: 1}).then(rsp => {
                this.articleList = rsp.data
            })
        }
    },
    created(){
        this.getTjArticle()
    }
}
</script>

<style lang="less">
.home-article{
    .app-article-list{
        padding: 0;
        .list-item{
            &:after{
                display: none;
            }
        }
    }
}
</style>