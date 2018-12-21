<template>
  <div>
    <group>
      <x-input title="手机号码" name="mobile" v-model="mobile" placeholder="请输入手机号码" keyboard="number"
               is-type="china-mobile"></x-input>
      <x-input title="验证码" v-model="validcode">
        <img slot="right-full-height" :src="validurl" @click='urlchange()'>
      </x-input>
      <x-input title="发送验证码" class="weui-vcode" v-model="sms">
        <x-button slot="right" type="primary" mini @click.native="getSms" :disabled="able">{{word}}</x-button>
      </x-input>
    </group>
    <group style="margin-top: 10px;">
      <x-input title="登录密码" v-model="password" type="password" placeholder="请输入不少于6位密码" :min="6" :max="16"></x-input>
      <x-input title="确认密码" v-model="passwordAgain" type="password" placeholder="请再次输入密码" :min="6" :max="16"></x-input>
    </group>
    <div class="agree">
      <check-icon :value.sync="agree"> 我已阅读并同意 <a>《用户协议》</a></check-icon>
    </div>
    <box gap="10px 10px">
      <x-button type="primary" :disabled="able1" @click.native="userRegister">注册
      </x-button>
    </box>
    <toast v-model="showPositionValue" type="text" width="18em" :time="800" is-show-mask :text="toastText"
           :position="position">{{}}
    </toast>
    <!--<toast v-model="show1" @on-hide="onHide">{{toastText}}</toast>-->
  </div>
</template>

<i18n>
  set bar-active-color:
  zh-CN: 设置bar颜色
</i18n>

<script>
  import {XInput, Box, Toast, Group, XButton, Swiper, SwiperItem, CheckIcon} from 'vux'
  import {mianUrlt9} from '../vuex/api'
  import {setLocalStorage,getLocalStorage} from '../vuex/storage'
  import Rsa from '../vuex/Rsa'

  export default {
    components: {
      XInput,
      Group,
      Toast,
      Box,
      XButton,
      Swiper,
      SwiperItem,
      CheckIcon
    },
    data() {
      return {
        fundlist: [],
        mobile: '',
        agree: true,
        validcode: '',
        sms: '',
        word: '获取验证码',
        password: '',
        passwordAgain: '',
        position: 'default',
        toastText: '加入自选成功！',
        showPositionValue: false,
        path: this.$route.query.path,
        validurl: '',
        able: false,
        show1: false,
        uniqueid: '',
        able1: false
      }
    },
    methods: {
      /* change (val) {
        // console.log('on change', val)
      }, */
      showPosition(position) {
        this.position = position
        this.showPositionValue = true
      },
      /* onHide () {

      }, */
      getSms() { // 获取短信码
        let str1 = /^1[3-9]{1}\d{9}$/
        if (!str1.test(this.mobile)) {
          this.toastText = '手机号格式不对！'
          this.showPosition('top')
        } else if (this.validcode === '' || this.validcode.length !== 4) {
          this.urlchange()
          this.toastText = '验证码格式错误！'
          this.showPosition('top')
        } else {
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
          this.$http.post(mianUrlt9 + 'registerInfo/sendRegisterPhoneCode', {
            mobile: this.mobile,
            picCode: this.validcode,
            merchantId:'CJQF'
          }, {emulateJSON: true}).then((res) => {
            if (res.data.retCode === '0') {
              this.toastText = '发送成功！'
              this.show1 = true
              this.able = false
            } else if (res.data.retCode === '990102') {
              this.toastText = res.data.data[0].field + '' + res.data.data[0].message
              this.showPosition('top')
              this.able = false
              this.word = '获取验证码'
              clearInterval(time)
            } else if (res.data.retCode === '990103') {
              this.toastText = '系统正在维护，请稍后重试！'
              this.showPosition('top')
              this.able = false
              this.word = '获取验证码'
              clearInterval(time)
            } else if (res.data.retCode === '990104') {
              this.toastText = '服务器内部错误！'
              this.showPosition('top')
              this.able = false
              this.word = '获取验证码'
              clearInterval(time)
            } else if (res.data.retCode === '101031') {
              this.toastText = res.data.retMsg
              this.showPosition('top')
              this.able = false
              this.word = '获取验证码'
              clearInterval(time)
            } else if (res.data.retCode === '101035') {
              this.toastText = res.data.retMsg
              this.showPosition('top')
              this.able = false
              this.word = '获取验证码'
              clearInterval(time)
            } else {
              this.urlchange()
              this.toastText = res.data.retMsg
              this.showPosition('top')
              this.able = false
              this.word = '获取验证码'
              clearInterval(time)
            }
          })
        }
      },
      userRegister() {
        // console.log(this.mobile)
        // onsole.log(this.password)
        this.able1 = true
        let str1 = /^1[3-9]{1}\d{9}$/
        if (this.mobile === '') {
          this.toastText = '手机号不能为空！'
          this.showPosition('middle')
          return false
        }
        if (!str1.test(this.mobile)) {
          this.toastText = '手机号格式不对！'
          this.showPosition('middle')
          return false
        }
        if (this.validcode === '' || this.validcode.length !== 4) {
          this.toastText = '验证码格式错误！'
          this.showPosition('middle')
          return false
        }
        if (this.sms === '' || this.sms.length !== 6) {
          this.toastText = '短信码不能为空！'
          this.showPosition('middle')
          return false
        }
        if (this.password === '' || this.passwordAgain === '') {
          this.toastText = '密码不能为空！'
          this.showPosition('middle')
          return false
        }
        if (this.password.length < 6 || this.password.length > 16) {
          this.toastText = '密码必须大于6位小于16位！'
          this.showPosition('middle')
          return false
        }
        if (this.password !== this.passwordAgain) {
          this.toastText = '两次输入密码不一致！'
          this.showPosition('middle')
          return false
        }
        if (this.agree !== true) {
          this.toastText = '请阅读并同意用户协议！'
          this.showPosition('middle')
          return false
        }

        this.$http.post(mianUrlt9 + 'user/getPublicKey', {}, {emulateJSON: true}).then((res) => {
          // console.log(res)
          if (res.data.retCode === '0') {
            let modulus = res.data.data.rsaModulus
            let exponent = res.data.data.rsaPublicExponent
            let publicKey = RSAUtils.getKeyPair(exponent, '', modulus)
            let keyPwd1
            let keyPwd2
            if (this.password.length !== 256) {
              keyPwd1 = RSAUtils.encryptedString(publicKey, this.password)
            }
            if (this.passwordAgain.length !== 256) {
              keyPwd2 = RSAUtils.encryptedString(publicKey, this.passwordAgain)
            }
            this.register(keyPwd1, keyPwd2)
          } else {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
          }
        })

      },
      register(keyPwd1, keyPwd2) {
        let merchantId = ''
        if(getLocalStorage('source') !== undefined && getLocalStorage('source') !== ''){
          merchantId = getLocalStorage('source')
        }
        this.$http.post(mianUrlt9 + 'registerInfo/register', {
          userName: this.mobile,
          phoneCode: this.sms,
          password: keyPwd1,
          merchantId: merchantId,
          uniqueId: this.uniqueid
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            setLocalStorage('Tel', this.phone)
            this.able1 = true
            this.getusermeg()
            this.toastText = '注册成功！'
            this.show1 = true
            this.$router.push({
              path: '/'
            })
          } else if (res.data.retCode === '990102') {
            this.able1 = false
            this.toastText = res.data.data[0].field + '' + res.data.data[0].message
            this.showPosition('middle')
          } else if (res.data.retCode === '990103') {
            this.able1 = false
            this.toastText = '系统正在维护，请稍后再试'
            this.showPosition('middle')
          } else if (res.data.retCode === '990104') {
            this.able1 = false
            this.toastText = '服务器内部错误'
            this.showPosition('middle')
          } else {
            this.able1 = false
            this.toastText = res.data.retMsg
            this.showPosition('middle')
          }
        })
      },
      getusermeg() {
        let p = new Promise((resolve, reject) => {
          this.$http.post(mianUrlt9 + 'user/getUserInfo', {}, {emulateJSON: true}).then((res) => {
            if (res.data.retCode === '0') {
              setLocalStorage('userName', res.data.data.userName)
              setLocalStorage('isopen', res.data.data.isOpen)
              setLocalStorage('sendTel', res.data.data.sendTel)
              setLocalStorage('sn', res.data.data.idNumber)
              setLocalStorage('Tel', res.data.data.tel)
              setLocalStorage('x', res.data.data.xscore)
              setLocalStorage('y', res.data.data.yscore)
              setLocalStorage('z', res.data.data.zscore)
              setLocalStorage('level', res.data.data.preferenceLevel)
              setLocalStorage('riskLevel', res.data.data.riskLevel)
              if (res.data.data.weiXinHeadImgUrl === undefined ||res.data.data.weiXinHeadImgUrl == null) {
                setLocalStorage('weixinHeadimgurl', '')
              } else {
                setLocalStorage('weixinHeadimgurl', res.data.data.weiXinHeadImgUrl)
              }
              if (res.data.data.isweixin === undefined) {
                setLocalStorage('isweixin', '')
              } else {
                setLocalStorage('isweixin', res.data.data.isweixin)
              }
              if (res.data.data.taxType === undefined) {
                res.data.data.taxType = 'underfined'
              }
              setLocalStorage('taxType', res.data.data.taxType)
              // this.getrisklevel()
              // console.log(this.$store.state.username)
              // console.log(this.$store.state.isopen)
              resolve()
            }
          })
        })
        return p
      },
      validurlchange() {
        this.validurl = mianUrlt9 + 'registerInfo/picCodeGenerate?' + 'a=' + Math.random()
      },
      urlchange() {
        this.validurl = mianUrlt9 + 'registerInfo/picCodeGenerate?' + 'a=' + Math.random()
        this.validcode = ''
      },
      getuniqueid() {
        this.$http.post(mianUrlt9 + 'fund/getUniqueId').then((res) => {
          if (res.data.retCode === '0') {
            this.uniqueid = res.data.data
            // console.log(this.uniqueid)
          }
        })
      }
    },
    mounted() {
      this.validurlchange()
      this.getuniqueid()
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

  .agree {
    padding: 12px;
    font-size: 14px;
    color: #333333;
  }

  .active-6-1 {
    color: rgb(252, 55, 140) !important;
    border-color: rgb(252, 55, 140) !important;
  }

  .active-6-2 {
    color: #04be02 !important;
    border-color: #04be02 !important;
  }

  .active-6-3 {
    color: rgb(55, 174, 252) !important;
    border-color: rgb(55, 174, 252) !important;
  }

  .weui-cells__title {
    color: #222222;
  }

  .weui-cells {
    margin-top: 0px;
  }

  .up {
    color: @redfont;
  }

  .down {
    color: @greenfont;
  }
</style>
