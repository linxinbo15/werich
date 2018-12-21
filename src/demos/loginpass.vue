<template>
  <div>
    <group>
      <x-input title="原登录密码" type="password" placeholder="请输入原登录密码" v-model="originlpwd"></x-input>
      <x-input title="新登录密码" type="password" placeholder="请输入新密码" v-model="newlpwd1"></x-input>
      <x-input title="请确认密码" type="password" placeholder="请确认新密码" v-model="newlpwd2"></x-input>
    </group>
    <box gap="10px 10px">
      <x-button type="primary" action-type="button" @click.native="getPublicKey">确认</x-button>
    </box>
  </div>
</template>
<script>
  import {XInput, Toast, XButton, Group, Box} from 'vux'
  import {mianUrlt9} from '../vuex/api'
  import Rsa from '../vuex/Rsa'

  export default {
    data () {
      return {
        originlpwd: '',
        newlpwd1: '',
        newlpwd2: ''
      }
    },
    components: {
      XInput,
      Toast,
      XButton,
      Group,
      Box
    },
    methods: {
      getPublicKey () {
        let str2 = /[0-9a-zA-Z]{6,16}/
        if (this.originlpwd === '' || this.newlpwd1 === '' || this.newlpwd2 === '') {
          this.$vux.toast.text('密码不能为空！', 'middle', 3000)
          return false
        }
        if (!str2.test(this.newlpwd1)) {
          this.$vux.toast.text('密码为6-16数字或字母', 'middle', 3000)
          return false
        }
        if (this.newlpwd1 !== this.newlpwd2) {
          this.$vux.toast.text('两次密码不一致', 'middle', 3000)
          return false
        }
        this.$http.post(mianUrlt9 + 'user/getPublicKey', {}, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            let modulus = res.data.data.rsaModulus
            let exponent = res.data.data.rsaPublicExponent
            let publicKey = RSAUtils.getKeyPair(exponent, '', modulus)
            let keyOriginlpwd
            let keyNewlpwd1
            if (this.originlpwd.length !== 256) {
              keyOriginlpwd = RSAUtils.encryptedString(publicKey, this.originlpwd)
            }
            if (this.newlpwd1.length !== 256) {
              keyNewlpwd1 = RSAUtils.encryptedString(publicKey, this.newlpwd1)
            }
            this.changelpwd(keyOriginlpwd, keyNewlpwd1)
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      changelpwd (keyOriginlpwd, keyNewlpwd1) {
        this.$http.post(mianUrlt9 + 'user/modifyLoginPassword', {
          newPassword: keyNewlpwd1,
          oldPassword: keyOriginlpwd
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.$vux.toast.text('登录密码修改成功', 'middle', 3000)
            this.$router.back()
          } else if (res.data.retCode === '990102') {
            const msg = res.data.data[0].field + '' + res.data.data[0].message
            this.$vux.toast.text(msg, 'middle', 3000)
          } else if (res.data.retCode === '990103') {
            this.$vux.toast.text('系统正在维护，请稍后再试', 'middle', 3000)
          } else if (res.data.retCode === '990104') {
            this.$vux.toast.text('服务器内部错误', 'middle', 3000)
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      }
    }
  }
</script>
<style scoped>
  .btn {
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 0;
  }

  .btn .weui-btn {
    width: 95%;
  }
</style>
