<template>
  <div>
    <div class="login_logo">
      <router-link :to="{path:'/'}">
        <img src="../assets/logo1.png" class="logo"/>
      </router-link>
    </div>
    <group title="绑定微信">
      <x-input title="手机号码" name="mobile" v-model="mobile" placeholder="请输入手机号码" keyboard="number"
               is-type="china-mobile"></x-input>
      <x-input title="登录密码" v-model="password" type="password" placeholder="请输入密码" :min="6" :max="16"></x-input>
    </group>
    <box gap="10px 10px">
      <x-button type="primary" :gradients="['#FF9500', '#FF9500']" @click.native="binding">绑定</x-button>
    </box>
  </div>
</template>
<script>
  import {mianUrlt9} from '../vuex/api'
  import {XInput, Box, Toast, Group, XButton} from 'vux'
  import Rsa from '../vuex/Rsa'

  export default {
    data () {
      return {
        mobile: '',
        password: ''
      }
    },
    components: {
      XInput,
      Group,
      Toast,
      Box,
      XButton
    },
    methods: {
      binding () {
        let str1 = /^1[3-9]{1}\d{9}$/
        if (this.mobile === '' || this.password === '') {
          this.$vux.toast.text('手机号和密码不能为空！', 'middle', 3000)
        } else if (!str1.test(this.mobile)) {
          this.$vux.toast.text('手机号格式不对！', 'middle', 3000)
        } else if (this.password.length < 6 || this.password.length > 16) {
          this.$vux.toast.text('密码必须大于6位小于16位！', 'middle', 3000)
        } else {
          this.$http.post(mianUrlt9 + 'user/getPublicKey', {}, {emulateJSON: true}).then((res) => {
            // console.log(res)
            if (res.data.retCode === '0') {
              let modulus = res.data.data.rsaModulus
              let exponent = res.data.data.rsaPublicExponent
              let publicKey = RSAUtils.getKeyPair(exponent, '', modulus)
              let keyPwd
              if (this.password.length !== 256) {
                keyPwd = RSAUtils.encryptedString(publicKey, this.password)
              }
              this.bindingwx(keyPwd)
            } else {
              let msg = res.data.retMsg
              this.$vux.toast.text(msg, 'middle', 3000)
            }
          })
        }
      },
      bindingwx (keyPwd) {
        this.$http.post(mianUrlt9 + 'user/bindingWeChatInfo', {
          userName: this.mobile,
          password: keyPwd
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.$vux.toast.text('绑定微信成功！', 'middle', 3000)
            this.$router.push('/')
          } else {
            let msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/center.less';
  @import '../styles/custom.less';

  .login_logo {
    padding: 25px;
    background: url(../assets/bg.png) center center;
    background-size: cover;
  }

  .center {
    margin-top: 15px;
    text-align: center;
  }

  .logo {
    display: block;
    width: 100px;
    height: auto;
    margin: 0 auto;
  }
</style>
