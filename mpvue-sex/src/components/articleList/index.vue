<template>
    <div class="app-article-list">
        <ul v-if="dataList.length>0">
            <li class="list-item vux-1px-b" 
                v-for="(item,index) in dataList" :key="item.id"
                @click="openArticleDetail(item)">
                <div class="img" :style="'background-image:' + item.articleThumbUrl"></div>
                <div class="txt">
                    <p>{{item.articleTitle}}</p>
                    <p class="create-time">{{item.createTime}}</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
    export default{
        name: 'articleList',
        props: {
            dataList: Array
        },
        methods: {
            openArticleDetail(article){
                sessionStorage.articleDetail = JSON.stringify(article)
                // this.$router.push( {name: 'articleDetail', params: {id: article.id}} )
            }
        }
    }
</script>

<style lang="less">
.app-article-list{
    padding: 10px;
    .list-item{
        display: flex;
        align-items: center;
        margin-bottom: 10px;
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
            &>img{
                display: block;
            }
        }
        .txt{
            flex: 1;
            padding-left: 10px;
            p{
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                font-size: 13px;
                &.create-time{
                    margin-top: 15px;
                    font-size: 12px;
                    color: #999;
                    text-align: right;
                }
            }
        }   
    }
}
</style>