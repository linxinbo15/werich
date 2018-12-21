<template>
  <div>
    <div class="login_logo">
      <router-link :to="{path:'/'}">
        <img src="../assets/logo1.png" class="logo"/>
      </router-link>
    </div>
    <group title="用户登录">
      <x-input title="手机号码" name="mobile" v-model="mobile" placeholder="请输入手机号码" keyboard="number"
               is-type="china-mobile"></x-input>
      <x-input title="登录密码" v-model="password" type="password" placeholder="请输入密码" :min="6" :max="16"></x-input>
    </group>
    <div class="forget" @click='forget()'>忘记密码？</div>
    <box gap="10px 10px">
      <x-button type="primary" @click.native="userLogin">登录</x-button>
      <x-button type="default" link="/component/register">注册</x-button>
    </box>
    <toast v-model="showPositionValue" type="text" :time="800" width="18em" is-show-mask :text="toastText"
           :position="position"></toast>

  </div>
</template>

<i18n>
  set bar-active-color:
  zh-CN: 设置bar颜色
</i18n>

<script>
  import {XInput, Box, Toast, Group, XButton, Swiper, SwiperItem} from 'vux'
  import {mianUrl, mianUrlt9} from '../vuex/api'
  import {setLocalStorage, getLocalStorage} from '../vuex/storage'
  import Rsa from '../vuex/Rsa'

  export default {
    components: {
      XInput,
      Group,
      Toast,
      Box,
      XButton,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        fundlist: [],
        mobile: '',
        password: '',
        position: 'default',
        toastText: '加入自选成功！',
        showPositionValue: false,
        path: this.$route.query.path,
        disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent),
        device:''
      }
    },
    mounted () {
       this.getdevice()
      // this.getIndex = () => {
      // console.log(222)
      // this.indexList = getIndexAll()
      // console.log(this.demo01_list)
      // }
    },
    methods: {
      getdevice () {
        let u = navigator.userAgent
        // console.log(u)
        if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) {//安卓手机
          this.device = "android"
        } else if (u.indexOf('iPhone') > -1) {//苹果手机
           this.device = "ios"
        } else if (u.indexOf('Windows Phone') > -1) {//winphone手机
          this.device = "Windows Phone"
        }
      },
      forget () {
        this.$router.push('/component/loginforget')
      },
      change (val) {
        // console.log('on change', val)
      },
      showPosition (position) {
        this.position = position
        this.showPositionValue = true
      },
      userLogin () {
        // console.log(this.mobile)
        // console.log(this.password)
        let str1 = /^1[3-9]{1}\d{9}$/
        if (this.mobile === '' || this.password === '') {
          this.toastText = '手机号和密码不能为空！'
          this.showPosition('middle')
        } else if (!str1.test(this.mobile)) {
          this.toastText = '手机号格式不对！'
          this.showPosition('middle')
        } else if (this.password.length < 6 || this.password.length > 16) {
          this.toastText = '密码必须大于6位小于16位！'
          this.showPosition('middle')
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
              this.login(keyPwd)
            } else {
              let msg = res.data.retMsg
              this.toastText = msg
              this.showPosition('middle')
            }
          })
        }
      },
      login (keyPwd) {
        this.$http.post(mianUrlt9 + 'user/login', {
          userName: this.mobile,
          password: keyPwd,
          channelId:'wechat',
          merchantId:'cjqf'
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.getusermeg().then(() => {
              // console.log('isopen' + getCookie('isopen'))
              // 增加非居民涉税信息的补充材料
              if (getLocalStorage('isopen') === '1' && getLocalStorage('taxType') === '') {
                this.$http.post(mianUrlt9 + 'user/addUserTaxInformation', {
                  taxType: 1
                }, {emulateJSON: true}).then((res) => {
                  if (res.data.retCode === '0') {
                    setLocalStorage('taxType', 1)
                    if (this.path !== undefined) {
                      this.$router.push({
                        path: this.path,
                        //query: {result: getLocalStorage('answer')}
                      })
                    } else {
                      this.$router.push({path: '/'})
                    }
                  } else {
                    this.toastText = res.data.retMsg
                    this.showPosition('middle')
                  }
                })
              } else {
                if (this.path !== undefined) {
                  this.$router.push({
                    path: this.path,
                    //query: {result: getLocalStorage('answer')}
                  })
                } else {
                  this.$router.back()
                }
              }
            })
          } else if (res.data.retCode === '990102') {
            this.toastText = res.data.data[0].field + '' + res.data.data[0].message
            this.showPosition('middle')
          } else if (res.data.retCode === '990103') {
            this.toastText = '系统正在维护，请稍后再试'
            this.showPosition('middle')
          } else if (res.data.retCode === '990104') {
            this.toastText = '服务器内部错误'
            this.showPosition('middle')
          } else {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
          }
        })
      },
      getusermeg () {
        let p = new Promise((resolve, reject) => {
          this.$http.post(mianUrlt9 + 'user/getUserInfo', {}, {emulateJSON: true}).then((res) => {
            if (res.data.retCode === '0') {
              setLocalStorage('userName', res.data.data.userName)
              setLocalStorage('isopen', res.data.data.isOpen)
              setLocalStorage('sendTel', res.data.data.sendTel)
              setLocalStorage('sn', res.data.data.idNumber)
              setLocalStorage('Tel', res.data.data.tel)
              // console.log(res.data.data.tel)
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
            } else {
              this.toastText = res.data.retMsg
              this.showPosition('middle')
            }
          })
        })
        return p
      },
      getStockTypeList (stockType) {
        // console.log(stockType)
        const obj = {
          fdType: stockType,
          pageSize: 0
        }
        this.$http.post(mianUrl + '/products', obj, {emulateJSON: true}).then(({data}) => {
          if (data.retcode === '0000') {
            this.fundlist = data.data
            // console.log(this.indexList)
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
    background: url(../assets/logobg.png) center center;
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

  .forget {
    padding: 12px;
    font-size: 16px;
    color: #333333;
    text-align: right;
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
