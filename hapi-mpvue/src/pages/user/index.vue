<template>
  <div class="container">
    <button open-type="getUserInfo" type="warn" @getuserinfo="onGetUserInfo">获取用户信息</button>

    <img :src="userInfo.avatarUrl" alt="" style="width:80px;height:80px;">

    <!-- <open-data type="userAvatarUrl" lang="zh_CN" class="avatar-image"></open-data>

    <open-data type="userNickName" lang="zh_CN"></open-data> -->
  </div>
</template>
<script>

export default {
  data() {
    return {
      userInfo: {}
    }
  },

  methods: {
    onGetUserInfo(data) {
      this.userInfo = data.mp.detail.userInfo

      const { encryptedData, iv } = data.mp.detail
      wx.login({
        timeout: 3000,
        success: res => {
          const code = res.code

          wx.request({
            url: 'http://localhost:3300/users/wxLogin',
            method: 'POST',
            data: {
              code, encryptedData, iv
            },
            success: res => {
              wx.setStorageSync('auth', res.data);
            }
          })
        }
      })
    }
  },

  mounted() {

  }
}

</script>
<style scoped>
.userinfo {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.userinfo-avatar {
  width: 128rpx;
  height: 128rpx;
  margin: 20rpx;
  border-radius: 50%;
}

.userinfo-nickname {
  color: #aaa;
}

.usermotto {
  margin-top: 150px;
}

.form-control {
  display: block;
  padding: 0 12px;
  margin-bottom: 5px;
  border: 1px solid #ccc;
}

</style>
