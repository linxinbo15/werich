<template>
  <div>
    <div class="box_step" v-show="step!=2">
      <step v-model="step" background-color='#fbf9fe' gutter="20px">
        <step-item title="身份验证"></step-item>
        <step-item title="设置银行卡"></step-item>
        <step-item title="开户成功"></step-item>
      </step>
    </div>
    <div class="process_span" v-show="step!=2"><span>为保证您的账户资金安全，我们需要对您的身份进行实名认证，我们会安全妥善的保存您的个人信息，敬请放心！</span></div>
    <div class="margintop" v-show="step==0">
      <group label-width="4.5em" label-margin-right="2em" label-align="left" style="margin-top: 10px;">
        <x-input title="真实姓名" placeholder="请输入真实姓名" v-model="name" text-align="right"></x-input>
        <x-input title="身份证号" placeholder="请输入身份证号" v-model="Idcard" text-align="right"></x-input>
      </group>
      <box gap="10px 10px">
        <x-button type="primary" :gradients="['#FF9500', '#FF9500']" @click.native="nextStep">下一步</x-button>
      </box>
    </div>
    <div class="margintop" v-show="step==1">
      <group label-width="4.5em" label-margin-right="2em" label-align="left" style="margin-top: 10px;">
        <x-input title="银行卡号" placeholder="请输入银行卡号" v-model="banknumber" text-align="right"></x-input>
        <selector title="所属银行" ref="bankt" :options="bank_arr" v-model="bankname" direction="rtl" @on-change="getValue"></selector>
        <x-address title="所属省市" v-model="addressValue" raw-value :list="addressData" value-text-align="right" hide-district></x-address>
      </group>
      <group label-width="6.5em" label-margin-right="2em" label-align="left" style="margin-top: 10px;">
        <x-input title="设置交易密码" v-model="trapwd" type="password" text-align="right" placeholder="请输入6位数字密码" :min="6" :max="6"></x-input>
        <x-input title="确认交易密码" v-model="trapwd1" type="password" text-align="right" placeholder="请再次输入6位数字密码" :min="6" :max="6"></x-input>
      </group>
      <group label-width="4.5em" label-margin-right="2em" label-align="left" style="margin-top: 10px;">
        <x-input title="手机号码" name="mobile" v-model="telephone" text-align="right" placeholder="请输入手机号码" keyboard="number" is-type="china-mobile"></x-input>
        <x-input title="验证码" class="weui-vcode" v-model="validcode" v-show="kejian">
          <x-button slot="right" type="primary" mini @click.native="meg" :disabled="able">{{word}}</x-button>
        </x-input>
      </group>
      <div class="agree">
        <check-icon :value.sync="agree"> 我已阅读并同意 <a>《理财易站开户协议》</a></check-icon>
      </div>
      <box gap="10px 10px">
        <x-button type="primary" :disabled='ables' @click.native="getPublicKey">确认开户</x-button>
      </box>
    </div>
    <div class="margintop" v-show="step==2">
      <msg title="开户成功！" :description="description" :buttons="buttons" :icon="icon"></msg>
    </div>
    <toast v-model="showPositionValue" type="text" :time="800" width="18em" is-show-mask :text="toastText" :position="position"></toast>
  </div>
</template>

<i18n>
set bar-active-color:
  zh-CN: 设置bar颜色
</i18n>

<script>
import { Step, StepItem, XAddress, XInput, Confirm, CheckIcon, ChinaAddressV4Data, Loading, Toast, XNumber, Datetime, Selector, Box, Group, XButton, Tabbar, TabbarItem, PopupPicker, Msg, Value2nameFilter as value2name } from 'vux'
import { mianUrlt9 } from '../vuex/api'
import {IdentityCodeValid, getLocalStorage, setLocalStorage} from '../vuex/storage'
import Rsa from '../vuex/Rsa'
export default {
  components: {
    Step,
    StepItem,
    XInput,
    Confirm,
    Group,
    XNumber,
    Toast,
    Msg,
    Loading,
    Datetime,
    XAddress,
    Box,
    CheckIcon,
    XButton,
    Tabbar,
    TabbarItem,
    PopupPicker,
    Selector
  },
  data () {
    return {
      step: 0,
      name: '',
      Idcard: '',
      banknumber: '',
      trapwd: '',
      trapwd1: '',
      agree: true,
      telephone: '',
      able: false,
      word: '获取验证码',
      path: this.$route.query.path, // 接收详情页面跳转过来的路径
      position: 'default',
      toastText: '',
      showPositionValue: false,
      bankname: '',
      // banklist: ['块钱-工商银行', '块钱-中国银行'],
      addressData: ChinaAddressV4Data,
      addressValue: ['北京市', '市辖区'],
      address: '',
      validcode: '',
      description: '开户成功！',
      icon: '',
      kejian: true,
      ables: false,
      bank_arr: [],
      buttons: [{
        type: 'primary',
        text: '完成',
        onClick: this.detail
      }, {
        type: 'default',
        text: '去测评',
        link: '/component/risk-question'
      }],
      channelId: '',
      uniqueid: '',
      token: '',
      banktext: ''
    }
  },
  methods: {
    getValue (val) {
      //console.log(val)
      let bank = val.split('||')
      this.channelId = bank[0]
      this.banktext = bank[1]
      // this.banktext = this.$refs[ref].getFullValue()[0].value
      // console.log(this.banktext.substring(3,))
    },
    changeIcon () {
      if (!this.icon || this.icon === 'success') {
        this.icon = 'warn'
        return
      }
      if (this.icon === 'warn') {
        this.icon = 'info'
        return
      }
      if (this.icon === 'info') {
        this.icon = 'waiting'
        return
      }
      if (this.icon === 'waiting') {
        this.icon = 'success'
      }
    },
    getuniqueid () {
      this.$http.post(mianUrlt9 + 'fund/getUniqueId').then((res) => {
        if (res.data.retCode === '0') {
          this.uniqueid = res.data.data
        }
      })
    },
    getbanklist () {
      this.$http.post(mianUrlt9 + 'user/queryBankConfig').then((res) => {
        // console.log(res)
        if (res.data.retCode === '0') {
          this.bank_arr = []
          for (let i = 0; i < res.data.data.bankList.length; i++) {
            if (i === 0) {
              this.bankname = res.data.data.bankList[0].code + '||' + res.data.data.bankList[i].name
            }
            let obj = {}
            obj.value = res.data.data.bankList[i].name
            obj.key = res.data.data.bankList[i].code + '||' + res.data.data.bankList[i].name
            this.bank_arr.push(obj)
          }
          this.sn = res.data.data.sn
        } else if (res.data.retCode === '990102') {
          const msg = res.data.data[0].field + '' + res.data.data[0].message
          this.toastText = msg
          this.showPosition('middle')
        } else if (res.data.retCode === '990103') {
          this.toastText = '系统正在维护，请稍后再试！'
          this.showPosition('middle')
        } else if (res.data.retCode === '990104') {
          this.toastText = '服务器内部错误！'
          this.showPosition('middle')
        } else {
          const msg = res.data.retMsg
          this.toastText = msg
          this.showPosition('middle')
        }
      })
    },
    meg () { // 获取验证
      let str1 = /^1[3-8]{1}\d{9}$/
      let str2 = /^\d{6}\b/
      if (this.banknumber === '') {
        this.toastText = '请输入银行卡号'
        this.showPosition('middle')
        return false
      }
      if (this.trapwd === '') {
        this.toastText = '请输入交易密码'
        this.showPosition('middle')
        return false
      }
      if (!str2.test(this.trapwd)) {
        this.toastText = '请输入正确的交易密码'
        this.showPosition('middle')
        return false
      } else if (Number(this.trapwd[5]) - Number(this.trapwd[4]) === Number(this.trapwd[4]) - Number(this.trapwd[3]) === Number(this.trapwd[3]) - Number(this.trapwd[2]) === Number(this.trapwd[2]) - Number(this.trapwd[1]) === Number(this.trapwd[1]) - Number(this.trapwd[0])) {
        this.toastText = '交易密码过于简单，请重新设置'
        this.showPosition('middle')
        return false
      } else if (Number(this.trapwd[5]) === Number(this.trapwd[4]) === Number(this.trapwd[3]) === Number(this.trapwd[2]) === Number(this.trapwd[1])) {
        this.toastText = '交易密码过于简单，请重新设置'
        this.showPosition('middle')
        return false
      } else if (Number(this.trapwd[5]) === Number(this.trapwd[4]) && Number(this.trapwd[3]) === Number(this.trapwd[2]) && Number(this.trapwd[1]) === Number(this.trapwd[0])) {
        this.toastText = '交易密码过于简单，请重新设置'
        this.showPosition('middle')
        return false
      } else if (Number(this.trapwd[5]) === Number(this.trapwd[4]) === Number(this.trapwd[3]) && Number(this.trapwd[2]) === Number(this.trapwd[1]) === Number(this.trapwd[0])) {
        this.toastText = '交易密码过于简单，请重新设置'
        this.showPosition('middle')
        return false
      }
      if (this.trapwd !== this.trapwd1) {
        this.toastText = '两次密码不一致'
        this.showPosition('middle')
        return false
      }
      if (!str1.test(this.telephone)) {
        this.toastText = '手机号格式错误'
        this.showPosition('middle')
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
      this.$http.post(mianUrlt9 + 'user/smsAuthentication', {  // 请求参数
        certificateType: 0,
        certificateNo: this.Idcard,
        channelId: this.channelId,
        depositacct: this.banknumber,
        depositacctName: this.name,
        mobileTelNo: this.telephone
      }, { emulateJSON: true }).then((res) => {
        if (res.data.retCode === '0') {
          this.token = res.data.data.token
        } else if (res.data.retCode === '990102') {
          this.able = false
          this.word = '获取验证码'
          clearInterval(time)
          this.toastText = res.data.data[0].field + '' + res.data.data[0].message
          this.showPosition('middle')
        } else if (res.data.retCode === '120011') { // 银行卡已签约
          this.kejian = false
          this.toastText = res.data.retMsg
          this.showPosition('middle')
          this.able = false
          this.word = '获取验证码'
          clearInterval(time)
        } else if (res.data.retCode === '990103') {
          this.able = false
          this.word = '获取验证码'
          clearInterval(time)
          this.toastText = '系统正在维护，请稍后再试'
          this.showPosition('middle')
        } else if (res.data.retCode === '990104') {
          this.able = false
          this.word = '获取验证码'
          clearInterval(time)
          this.toastText = '服务器内部错误'
          this.showPosition('middle')
        } else {
          this.able = false
          this.word = '获取验证码'
          clearInterval(time)
          this.toastText = res.data.retMsg
          this.showPosition('middle')
        }
      })
    },
    getPublicKey () {
      if (this.agree === false) {
        this.toastText = '请阅读开户协议'
        this.showPosition('middle')
        return
      }
      this.$vux.loading.show({text: '正在加载'})
      this.ables = true
      this.$http.post(mianUrlt9 + 'user/getPublicKey', {}, { emulateJSON: true }).then((res) => {
        //console.log(res)
        if (res.data.retCode === '0') {
          let modulus = res.data.data.rsaModulus
          let exponent = res.data.data.rsaPublicExponent
          let publicKey = RSAUtils.getKeyPair(exponent, '', modulus)
          let keyTrapwd1
          if (this.trapwd1.length !== 256) {
            keyTrapwd1 = RSAUtils.encryptedString(publicKey, this.trapwd1)
          }
          this.openaccount(keyTrapwd1)
        } else {
          this.toastText = res.data.retMsg
          this.showPosition('middle')
        }
      })
    },
    openaccount (keyTrapwd1) {
      this.address = value2name(this.addressValue, ChinaAddressV4Data)
      // console.log(this.address)
      this.$http.post(mianUrlt9 + 'user/openAnAccount', {
        certificateType: 0,
        certificateNo: this.Idcard,
        custFullName: this.name,
        channelId: this.channelId,
        depositacct: this.banknumber,
        depositProv: this.address.split(' ')[0],
        depositCity: this.address.split(' ')[1],
        depositName: this.banktext.substring(3),
        mobileTelNo: this.telephone,
        password: keyTrapwd1,
        token: this.token,
        verificationCode: this.validcode,
        uniqueId: this.uniqueid
      }, { emulateJSON: true }).then((res) => {
        if (res.data.retCode === '0') {
          this.$vux.loading.hide()
          setLocalStorage('isopen', 1)
          this.ables = false
          this.getusermeg()
          this.step ++
        } else if (res.data.retCode === '990102') {
          this.$vux.loading.hide()
          this.ables = false
          this.toastText = res.data.data[0].field + '' + res.data.data[0].message
          this.showPosition('middle')
        } else if (res.data.retCode === '990103') {
          this.$vux.loading.hide()
          this.ables = false
          this.toastText = '系统正在维护，请稍后再试'
          this.showPosition('middle')
        } else if (res.data.retCode === '990104') {
          this.$vux.loading.hide()
          this.ables = false
          this.toastText = '服务器内部错误'
          this.showPosition('middle')
        } else {
          this.$vux.loading.hide()
          this.ables = false
          this.toastText = res.data.retMsg
          this.showPosition('middle')
        }
      })
    },
    getusermeg () {
      this.$http.post(mianUrlt9 + 'user/getUserInfo', {}, { emulateJSON: true }).then((res) => {
        if (res.data.retCode === '0') {
          setLocalStorage('userName', res.data.data.userName)
        }
      })
    },
    detail () {
      if (this.path !== undefined) {
        this.$router.push({
          path: this.path,
          query: { level: getLocalStorage('level'), x: getLocalStorage('x'), y: getLocalStorage('y'), z: getLocalStorage('z') }
        })
      } else {
        this.$router.push({ path: '/component/asset' })
      }
    },
    showPosition (position) {
      this.position = position
      this.showPositionValue = true
    },
    getName (value) {
      return value2name(value, ChinaAddressV4Data)
    },
    nextStep () {
      if (this.name === '') {
        this.toastText = '请输入姓名！'
        this.showPosition('middle')
        return false
      }
      if (this.Idcard === '') {
        this.toastText = '请输入身份证号！'
        this.showPosition('middle')
        return false
      }
      // console.log(IdentityCodeValid(this.Idcard))
      if (!IdentityCodeValid(this.Idcard)) {
        this.toastText = '请输入正确的身份证号！'
        this.showPosition('middle')
        return false
      }
      this.step ++
    }
  },
  mounted () {
    this.getbanklist()
    this.getuniqueid()
  }
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/1px.less';
@import '~vux/src/styles/center.less';
@import '../styles/custom.less';
.box_step{
  padding: 20px 10px;
  background-color: #ffffff;
}
.agree{
  padding: 12px;
  font-size: 14px;
  color: #333333;
}
.process_span{
  padding: 10px;
  font-size: 12px;
  color: #888888;
  background-color: #ffffff;
  border-top: 1px solid #f2f2f2;
}
.margintop{
  margin-top: 10px;
  margin-bottom: 10px;
}
.up{
  color: @redfont;
}
.down{
  color: @greenfont;
}
</style>
