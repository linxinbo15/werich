<template>
  <div>
    <group>
      <x-input title="原交易密码" type="password" placeholder="请输入原交易密码" v-model="originpwd"></x-input>
      <x-input title="新交易密码" type="password" placeholder="请输入新密码" v-model="newpwd1"></x-input>
      <x-input title="请确认密码" type="password" placeholder="请确认新密码" v-model="newpwd2"></x-input>
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
        originpwd: '',
        newpwd1: '',
        newpwd2: ''
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
        var str1 = /^\d{6}\b/
        if (this.originpwd === '' || this.newpwd1 === '' || this.newpwd2 === '') {
          this.$vux.toast.text('密码不能为空！', 'middle', 3000)
          return false
        }
        if (!str1.test(this.newpwd1)) {
          this.$vux.toast.text('密码为6位数字！', 'middle', 3000)
          return false
        } else if (Number(this.newpwd1[5]) - Number(this.newpwd1[4]) === Number(this.newpwd1[4]) - Number(this.newpwd1[3]) === Number(this.newpwd1[3]) - Number(this.newpwd1[2]) === Number(this.newpwd1[2]) - Number(this.newpwd1[1]) === Number(this.newpwd1[1]) - Number(this.newpwd1[0])) {
          this.$vux.toast.text('您设置的交易密码过于简单，请重新设置', 'middle', 3000)
          return false
        } else if (Number(this.newpwd1[5]) === Number(this.newpwd1[4]) === Number(this.newpwd1[3]) === Number(this.newpwd1[2]) === Number(this.newpwd1[1])) {
          this.$vux.toast.text('您设置的交易密码过于简单，请重新设置', 'middle', 3000)
          return false
        } else if (Number(this.newpwd1[5]) === Number(this.newpwd1[4]) && Number(this.newpwd1[3]) === Number(this.newpwd1[2]) && Number(this.newpwd1[1]) === Number(this.newpwd1[0])) {
          this.$vux.toast.text('您设置的交易密码过于简单，请重新设置', 'middle', 3000)
          return false
        } else if (Number(this.newpwd1[5]) === Number(this.newpwd1[4]) === Number(this.newpwd1[3]) && Number(this.newpwd1[2]) === Number(this.newpwd1[1]) === Number(this.newpwd1[0])) {
          this.$vux.toast.text('您设置的交易密码过于简单，请重新设置', 'middle', 3000)
          return false
        }
        if (this.newpwd1 !== this.newpwd2) {
          this.$vux.toast.text('两次密码不一致', 'middle', 3000)
          return false
        }
        this.$http.post(mianUrlt9 + 'user/getPublicKey', {}, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            let modulus = res.data.data.rsaModulus
            let exponent = res.data.data.rsaPublicExponent
            let publicKey = RSAUtils.getKeyPair(exponent, '', modulus)
            let keyOriginpwd
            let keyNewpwd1
            if (this.originpwd.length !== 256) {
              keyOriginpwd = RSAUtils.encryptedString(publicKey, this.originpwd)
            }
            if (this.newpwd1.length !== 256) {
              keyNewpwd1 = RSAUtils.encryptedString(publicKey, this.newpwd1)
            }
            this.changtpwd(keyOriginpwd, keyNewpwd1)
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      changtpwd (keyOriginpwd, keyNewpwd1) {
        this.$http.post(mianUrlt9 + 'user/modifyTradePassword', {
          newPassword: keyNewpwd1,
          oldPassword: keyOriginpwd
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.$vux.toast.text('交易密码修改成功', 'middle', 3000)
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
