<template>
  <div class="page-order-address">
    <div class="address-list" v-if="dataList && dataList.length > 0">
      <radio-group class="radio-group" @change="onChange">
      <div class="address-item" v-for="item in dataList" :key="item.id">
          <div class="left" v-if="from === 'commit'">
              <radio :value="item.id" :checked="item.checked"/>
          </div>
          
          <div class="center">
            <div class="phone">{{item.contactName}} &emsp; {{item.mobileNo}}</div>
            <div class="address">{{item.area}} {{item.detail}}</div>
          </div>
          <div class="right" @tap="openEdit(item)">
            <i class="iconfont icon-edit"></i>
          </div>
      </div>
      </radio-group>
    </div>

    <div class="address-new" @tap="openNew">
      + 新建地址
    </div>
  </div>
</template>

<script>
import fly from '@/utils/fly'
export default {
  data(){
    return {
      dataList: [],
      from: ''
    }
  },
  methods: {
    getAddressList(){
      fly.get('/apps/jp/customer/address/list',{},{
        headers: {
          showLoading: true
        }
      }).then(rsp => {
        if(rsp.code === 200 && rsp.data){
          rsp.data.forEach((item,index) => {
            rsp.data[index].checked = false
          })
          this.dataList = rsp.data
        }
      })
    },
    openNew(){
        wx.navigateTo({
            url: "../addressHandle/main?type=new"
        })
    },
    openEdit(item){
        wx.setStorageSync('addressHandle', item)
        wx.navigateTo({
              url: "../addressHandle/main?type=edit"
        })
    },

    onChange(e){
      let item = this.dataList.filter(item => {
        return item.id === e.mp.detail.value
      })
      wx.setStorageSync('selectedAddress', item[0])
      wx.navigateBack({
        delta: 1
      })
    }
  },
  onShow(){
    let {from} = this.$root.$mp.query
    this.from = from

    this.getAddressList()
  }
}
</script>

<style lang="less">
@import '~assets/less/color.less';
.page-order-address {
  padding: 20rpx;
  background-color: #fff;
  .address-list{
      .address-item{
        display: flex;
        align-items: center;
        padding: 20rpx 0;
        border-bottom: 1px solid #eee;
          .left{
            padding: 0 30rpx;
          }
          .center{
            flex: 1;
            min-width: 0;
            line-height: 2;
            .phone{

            }
            .address{
              color: #707070;
            }
          }
          .right{
              padding: 0 30rpx; 
              .iconfont{
                font-size: 22px;
                color: #333;
              }
          }
      }
  }

  .address-new{
    margin-top: 40rpx;
    line-height: 100rpx;
    text-align: center;
    color: @primary;
    font-size: 17px;
    border: 1px solid @primary;
    border-radius: 4px;
  }
}
</style>
