<template>
    <div class="page-home">
        <div class="app-home-tab">
            <ul class="app-fixed-tab">
                <li class="tab-item" :class="{'selected': activeTabIndex === index}" v-for="(item,index) in ctgList" :key="item.id" @click="onTabSelect(index, item.id)">
                    <span>{{item.articleClassName}}</span>
                </li>
            </ul>
        </div>

        <block-banner></block-banner>
        <!-- <template v-if="activeTabIndex === 0">
            <block-banner></block-banner>
            <block-article></block-article>
            <block-course></block-course>
            <block-teacher></block-teacher>
        </template> -->
        <article-list :articleClassId="articleClassId"></article-list>
    </div>
</template>
<script>

import {queryTjArticle, queryArticleClass, queryArticleByClassId} from 'api/article'

import blockBanner from './blocks/banner'
// import blockArticle from './blocks/article'
// import blockCourse from './blocks/course'
// import blockTeacher from './blocks/teacher'

import articleList from './article'
export default {
    name: 'home',
    components: {
        articleList,
        blockBanner, 
        // blockArticle, blockCourse, blockTeacher, articleList
    },
    data() {
        return {
            ctgList: [],
            activeTabIndex: 1,
            articleClassId: '',

            isReady: false
        }
    },
    methods: {
        getCtgList(){
            queryArticleClass({}).then(rsp => {
                this.ctgList = rsp.data

                this.ctgList.unshift({
                    id: 'tj',
                    articleClassName: '推荐'
                })
            })
        },

        onTabSelect(index, articleClassId){
            sessionStorage.homeIndex = index
            sessionStorage.articleClassId = articleClassId

            this.activeTabIndex = index
            this.articleClassId = articleClassId
        },
        
    },
    
    created(){
        // if(sessionStorage.homeIndex) this.activeTabIndex = Number(sessionStorage.homeIndex)
        // if(sessionStorage.articleClassId) this.articleClassId = sessionStorage.articleClassId

        this.getCtgList()

        wx.login({
            success: function(rsp){
                console.log(rsp)
            }
        })
    }
}

</script>
<style lang="less">
@import '~assets/less/color.less';
.page-home {
    min-height: 100vh;
    background-color: #f7f8f9;
    padding-top: 46px;

    .app-panel{
        margin: 10px 0;
        padding: 0 10px;
        background-color: #fff;
        .panel-hd{
            line-height: 40px;
            .refresh{
                line-height: 40px;
                font-size: 12px;
                .iconfont{
                    font-size: 12px;
                }
            }
        }
        .panel-bd{
            padding: 10px 0;
        }
    }

    .article-list{
        .list-item{
            display: flex;
            align-items: center;
            margin: 0 0 10px 0;
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
                }
            }   
        }
    }
}

.app-home-tab {
    position: fixed;
    z-index: 2;
    top:0;
    left: 0;
    right: 0;
    height: 46px;
    max-width: 480px;
    margin: 0 auto;
    overflow-x: auto;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
    background-color: #fff;
    &::-webkit-scrollbar {
        width: 0;
        height: 0;
        background-color: transparent;
    }
    .app-fixed-tab{
        white-space: nowrap;
        .tab-item{
            display: inline-block;
            padding: 0 1em;
            text-align: center;
            &>span{
                display: inline-block;
                height: 46px;
                line-height: 44px;
                transition: .3s;
                border-bottom: 2px solid transparent;
            }
            &.selected{
                &>span{
                    border-bottom: 2px solid @primary;
                }
            }
        }
    }
}

</style>
