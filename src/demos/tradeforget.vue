<template>
  <div>
    <group>
      <x-input title="手机号码:" :max="13" is-type="china-mobile" placeholder="请输入注册手机号" v-model="phone"></x-input>
      <x-input title="验证码:" placeholder='字母不区分大小写' v-model='validcode'>
        <img slot="right-full-height" :src='validurl' @click='urlchange()'>
      </x-input>
      <x-input title="验证号码:" class="weui-vcode" v-model='valid' placeholder='请输入短信验证码'>
        <x-button slot="right" type="primary" mini @click.native='getvalid()' :disabled='able'>{{word}}</x-button>
      </x-input>
      <x-input title="交易密码:" type="password" placeholder="请输入6位数字密码" v-model='tpwd1'></x-input>
      <x-input title="确认密码:" type="password" placeholder="请确认6位数字密码" v-model='tpwd2'></x-input>
    </group>
    <box gap="10px 10px">
      <x-button type="primary" action-type="button" @click.native="getPublicKey">确认</x-button>
    </box>
  </div>
</template>
<script>
  import {XInput, Group, XButton, Cell, Toast, Box} from 'vux'
  import {mianUrlt9} from '../vuex/api'
  import Rsa from '../vuex/Rsa'

  export default {
    data () {
      return {
        phone: '',
        valid: '',
        tpwd1: '',
        tpwd2: '',
        word: '获取验证码',
        validcode: '', // 图片验证码
        validurl: '',
        able: false // 验证码可不可点标志位
      }
    },
    mounted () {
      this.validurlchange()
    },
    components: {
      XInput,
      XButton,
      Group,
      Cell,
      Toast,
      Box
    },
    methods: {
      validurlchange () { // 获取图片验证码的图片
        this.validurl = mianUrlt9 + 'registerInfo/picCodeGenerate?' + 'a=' + Math.random()
      },
      urlchange () { // 更换图片
        this.validurl = mianUrlt9 + 'registerInfo/picCodeGenerate?' + 'a=' + Math.random()
        this.validcode = ''
      },
      getvalid () { // 调短信接口
        let str1 = /^1[3-9]{1}\d{9}$/
        if (!str1.test(this.phone)) {
          this.$vux.toast.text('手机号格式错误！', 'middle', 3000)
          return false
        }
        if (this.validcode === '') {
          this.urlchange()
          this.$vux.toast.text('验证码不能为空！', 'middle', 3000)
          return false
        } else if (this.validcode.length !== 4) {
          this.urlchange()
          this.$vux.toast.text('验证码格式错误！', 'middle', 3000)
          return false
        }
        let seconds = 120
        this.word = '120s'
        this.able = true
        let that = this
        let time = setInterval(() => {
          seconds--
          that.word = seconds + 's'
          if (seconds === 0) {
            that.able = false
            that.word = '获取验证码'
            clearInterval(time)
          }
        }, 1000)
        this.$http.post(mianUrlt9 + 'user/sendFindTradePasswordCode', {
          mobile: this.phone,
          picCode: this.validcode,
          merchantId:'CJQF'
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            // clearInterval(time)
            // this.word = '获取验证码'
          } else if (res.data.retCode === '990102') {
            // clearInterval(time)
            // this.word = '获取验证码'
            var msg = res.data.data[0].field + '' + res.data.data[0].message
            this.$vux.toast.text(msg, 'middle', 3000)
            this.able = false
            this.word = '获取验证码'
            clearInterval(time)
          } else if (res.data.retCode === '990103') {
            // clearInterval(time)
            // this.word = '获取验证码'
            this.$vux.toast.text('系统正在维护，请稍后再试', 'middle', 3000)
            this.able = false
            this.word = '获取验证码'
            clearInterval(time)
          } else if (res.data.retCode === '990104') {
            // clearInterval(time)
            // this.word = '获取验证码'
            this.$vux.toast.text('服务器内部错误', 'middle', 3000)
            this.able = false
            this.word = '获取验证码'
            clearInterval(time)
          } else if (res.data.retCode === '101031') {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
            this.able = false
            this.word = '获取验证码'
            clearInterval(time)
          } else {
            // clearInterval(time)
            // this.word = '获取验证码'
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
            this.able = false
            this.word = '获取验证码'
            clearInterval(time)
          }
        })
      },
      getPublicKey () {
        let str1 = /^1[3-9]{1}\d{9}$/
        let fdstr = /^\d{6}\b/
        if (!str1.test(this.phone)) {
          // "手机号格式错误！"
          this.$vux.toast.text('手机号格式错误！', 'middle', 3000)
          return false
        }
        if (this.valid === '') {
          this.$vux.toast.text('验证码不能为空！', 'middle', 3000)
          return false
        }
        if (this.tpwd1 === '' || this.tpwd2 === '') {
          this.$vux.toast.text('密码不能为空！', 'middle', 3000)
          return false
        }
        if (!fdstr.test(this.tpwd1)) {
          this.$vux.toast.text('密码为6位数字！', 'middle', 3000)
          return false
        } else if (Number(this.tpwd1[5]) - Number(this.tpwd1[4]) === Number(this.tpwd1[4]) - Number(this.tpwd1[3]) === Number(this.tpwd1[3]) - Number(this.tpwd1[2]) === Number(this.tpwd1[2]) - Number(this.tpwd1[1]) === Number(this.tpwd1[1]) - Number(this.tpwd1[0])) {
          this.$vux.toast.text('您设置的交易密码过于简单，请重新设置', 'middle', 3000)
          return false
        } else if (Number(this.tpwd1[5]) === Number(this.tpwd1[4]) === Number(this.tpwd1[3]) === Number(this.tpwd1[2]) === Number(this.tpwd1[1])) {
          this.$vux.toast.text('您设置的交易密码过于简单，请重新设置', 'middle', 3000)
          return false
        } else if (Number(this.tpwd1[5]) === Number(this.tpwd1[4]) && Number(this.tpwd1[3]) === Number(this.tpwd1[2]) && Number(this.tpwd1[1]) === Number(this.tpwd1[0])) {
          this.$vux.toast.text('您设置的交易密码过于简单，请重新设置', 'middle', 3000)
          return false
        } else if (Number(this.tpwd1[5]) === Number(this.tpwd1[4]) === Number(this.tpwd1[3]) && Number(this.tpwd1[2]) === Number(this.tpwd1[1]) === Number(this.tpwd1[0])) {
          this.$vux.toast.text('您设置的交易密码过于简单，请重新设置', 'middle', 3000)
          return false
        }
        if (this.tpwd1 !== this.tpwd2) {
          this.$vux.toast.text('两次密码不一致', 'middle', 3000)
          return false
        }
        this.$http.post(mianUrlt9 + 'user/getPublicKey', {}, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            let modulus = res.data.data.rsaModulus
            let exponent = res.data.data.rsaPublicExponent
            let publicKey = RSAUtils.getKeyPair(exponent, '', modulus)
            let keyTpwd1
            if (this.tpwd1.length !== 256) {
              keyTpwd1 = RSAUtils.encryptedString(publicKey, this.tpwd1)
            }
            this.resettpwd(keyTpwd1)
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      resettpwd (keyTpwd1) {
        this.$http.post(mianUrlt9 + 'user/resetTradePassword', {
          password: keyTpwd1,
          smsCode: this.valid,
          mobile: this.phone
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.$vux.toast.text('交易密码重置成功', 'middle', 3000)
            this.$router.back()
          } else if (res.data.retCode === '990102') {
            var msg = res.data.data[0].field + '' + res.data.data[0].message
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
