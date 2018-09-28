<template>
    <div class="page-address-handle page-flex">
        <div class="bd">
            <div class="address-form">
                <div class="form-item">
                    <input type="text" v-model="addressForm.contactName" placeholder="姓名">
                </div>
                <div class="form-item">
                    <input type="text" v-model="addressForm.mobileNo" placeholder="手机号码">
                </div>
                <div class="form-item">
                    <picker class="region-picker" mode="region" @change="bindRegionChange" :value="region">
                        <span v-if="!addressForm.area" class="picker-holder"> 请选择省市区 </span>
                        <span v-else>{{addressForm.area}}</span>
                    </picker>
                </div>
                <div class="form-item">
                    <input type="text" v-model="addressForm.detail" placeholder="详细地址：如街道、楼牌号">
                </div>

                <!-- <div class="form-item set-default">
                    <switch :checked="addressForm.isDefault" @change="switchDefault"/>
                    设为默认地址
                </div> -->
            </div>
        </div>


        <div class="ft" :class="{disabled: !submitAble}" @tap="onSubmit">
            <span v-if="handleType === 'new'">立即新增</span>
            <span v-else>保存修改</span>    
        </div>
    </div>
</template>


<script>
import fly from '@/utils/fly'
export default {
    data(){
        return{
            addressForm: {
                contactName: '',
                mobileNo: '',
                area: '',
                detail: '',
                isDefault: false
            },
            region: [],

            handleType: 'new'
        }
    },
    computed: {
        submitAble(){
            return this.addressForm.contactName && this.addressForm.mobileNo && this.addressForm.area && this.addressForm.detail
        }
    },
    methods: {

        switchDefault(e){
            this.addressForm.isDefault = e.mp.detail.value
        },
        bindRegionChange(e){
            this.region = e.mp.detail.value

            this.addressForm.area = this.region.join(' - ')
        },

        onSubmit(){
            if(this.submitAble){
                fly.post('/apps/jp/customer/address/update', this.addressForm).then(rsp => {
                    if(rsp.code === 200){
                        let msg = this.handleType === 'new' ? '新增' : '修改'
                        wx.showToast({
                            title: msg + '成功',
                            icon: 'success',
                            duration: 2000
                        })
                        wx.navigateBack({
                            delta: 1
                        })
                    }
                })
            }
        }
    },
    onLoad(){
        let {type} = this.$root.$mp.query
        this.handleType = type

        if(type === 'edit'){
            this.addressForm = wx.getStorageSync('addressHandle')

            this.region = this.addressForm.area.split(' - ')
        }
    }
}
</script>

<style lang="less">
@import '~assets/less/color.less';
.page-address-handle{

    .address-form{
        .form-item{
            border-bottom: 1px solid #eee;
            input{
                display: block;
                padding: 30rpx;
            }

            .region-picker{
                padding: 34rpx 30rpx;
                .picker-holder{
                    color: #888;
                }
            }

            &.set-default{
                padding: 50rpx 0;
                border-bottom: none;
                text-align: center;
                color: #666;
            }
        }
    }

    &>.ft{
        line-height: 100rpx;
        font-size: 18px;
        color: #fff;
        text-align: center;
        background-color: @primary;
        &.disabled{
            background-color: #ccc;
        }
    }
}
</style>
