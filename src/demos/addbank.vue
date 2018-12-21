<template>
  <div>
    <div class="margintop">
      <group label-width="4.5em" label-margin-right="2em" label-align="right" style="margin-top: 10px;">
        <x-input title="银行卡号" placeholder="请输入银行卡号" v-model="banknumber" text-align="right"></x-input>
        <selector title="所属银行" ref="bankt" :options="bank_arr" v-model="bankname" direction="rtl"
                  @on-change="getValue('bankt')"></selector>
        <x-address title="所属省市" v-model="addressValue" raw-value :list="addressData" value-text-align="right"
                   hide-district></x-address>
      </group>

      <group label-width="4.5em" label-margin-right="2em" label-align="right" style="margin-top: 10px;">
        <x-input title="身份证号" name="mobile" v-model="sn" text-align="right" placeholder="" :disabled="snable"></x-input>
        <x-input title="手机号码" name="mobile" v-model="telephone" text-align="right" placeholder="请输入手机号码"
                 keyboard="number" is-type="china-mobile"></x-input>
        <x-input title="验证码" class="weui-vcode" v-model="validcode" v-show='kejian'>
          <x-button slot="right" type="primary" mini @click.native="getyanzheng" :disabled="able">{{word}}</x-button>
        </x-input>
      </group>
      <box gap="10px 10px">
        <x-button type="primary" @click.native='addbank()'>确认</x-button>
      </box>
    </div>
  </div>
</template>
<script>
  import {
    Step,
    StepItem,
    XAddress,
    XInput,
    Confirm,
    CheckIcon,
    ChinaAddressV4Data,
    Loading,
    Toast,
    XNumber,
    Datetime,
    Selector,
    Box,
    Group,
    XButton,
    Tabbar,
    TabbarItem,
    PopupPicker,
    Msg,
    Value2nameFilter as value2name
  } from 'vux'
  import {mianUrlt9} from '../vuex/api'
  import { CheckBankNo } from '../vuex/storage'

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
        snable: true,
        sn: '',
        telephone: '',
        validcode: '',
        addressData: ChinaAddressV4Data,
        addressValue: ['北京市', '市辖区'],
        address: '',
        bankname: '',
        bank_arr: [],
        banknumber: '',
        able: false, // 验证码可不可点标志位
        word: '获取验证码',
        bankflag: '', // 银行卡鉴权标志位
        token: '',
        kejian: true, // 短信码是否可见
        channelId: '',
        banktext: ''
      }
    },
    mounted () {
      this.getbanklist()
    },
    methods: {
      getValue (val) {
        console.log(val)
        let bank = val.split('||')
        this.channelId = bank[0]
        this.banktext = bank[1]
        // this.banktext = this.$refs[ref].getFullValue()[0].value
        // console.log(this.banktext.substring(3,))
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
      },
      getyanzheng () { // 获取验证码
        let that = this
        if (!CheckBankNo(this.banknumber, that)) { // 校验银行卡号合法性
          return false
        }
        const str1 = /^1[3-9]{1}\d{9}$/
        if (this.banknumber === '') {
          this.$vux.toast.text('请输入银行卡号', 'middle', 3000)
          return false
        }
        if (!str1.test(this.telephone)) {
          // Toast({
          //   message: ,
          //   position: 'middle',
          //   duration: 3000
          // }) //"手机号格式错误！"
          this.$vux.toast.text('手机号格式错误！', 'middle', 3000)
          return false
        }
        let seconds = 120
        this.word = '120s'
        this.able = true
        let time = setInterval(() => {
          seconds--
          that.word = seconds + 's'
          if (seconds === 0) {
            that.able = false
            that.word = '获取验证码'
            clearInterval(time)
          }
        }, 1000)
        this.$http.post(mianUrlt9 + 'user/addBankCardMsgSend', { // 请求参数
          depositAcct: this.banknumber,
          channelId: this.channelId,
          mobileNo: this.telephone
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            // clearInterval(time)
            // this.word = '获取验证码'
            this.token = res.data.data.token
            this.bankflag = 0
          } else if (res.data.retCode === '120011') { // 银行卡已签约
            // clearInterval(time)
            // this.word = '获取验证码'
            this.kejian = false
            this.bankflag = 1
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
            this.able = false
            this.word = '获取验证码'
            clearInterval(time)
          } else if (res.data.retCode === '990102') {
            // clearInterval(time)
            // this.word = '获取验证码'
            const msg = res.data.data[0].field + '' + res.data.data[0].message
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
      addbank () {
        let that = this
        if (!CheckBankNo(this.banknumber, that)) { // 校验银行卡号合法性
          return false
        }
        const str1 = /^1[3-9]{1}\d{9}$/
        if (this.banknumber === '') {
          this.$vux.toast.text('请输入银行卡号', 'middle', 3000)
          return false
        }
        if (!str1.test(this.telephone)) {
          // Toast({
          //   message: ,
          //   position: 'middle',
          //   duration: 3000
          // }) //"手机号格式错误！"
          this.$vux.toast.text('手机号格式错误！', 'middle', 3000)
          return false
        }
        if (this.kejian === true) {
          if (this.valid === '') {
            this.$vux.toast.text('验证码不能为空！', 'middle', 3000)
            return false
          }
        } else {
          this.valid === ''
        }
        this.address = value2name(this.addressValue, ChinaAddressV4Data)
        this.$http.post(mianUrlt9 + 'user/addBankCard', { // 请求参数
          channelId: this.bankname,
          depositAcct: this.banknumber,
          depositProvince: this.address.split(' ')[0],
          depositCity: this.address.split(' ')[1],
          authenticateFlag: this.bankflag,
          verificationCode: this.valid,
          mobileNo: this.telephone,
          token: this.token
          // password:keyTradepwd
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.$vux.toast.text('绑卡成功', 'middle', 3000)
            this.$router.back()
          } else if (res.data.retCode === '990102') {
            var msg = res.data.data[0].field + '' + res.data.data[0].message
            this.$vux.toast.text(msg, 'middle', 3000)
          } else if (res.data.retCode === '990103') {
            this.$vux.toast.text('系统正在维护，请稍后再试', 'middle', 3000)
          } else if (res.data.retCode === '990104') {
            this.$vux.toast.text('服务器内部错误', 'middle', 3000)
          } else {
            this.kejian = true
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      getName (value) {
        return value2name(value, ChinaAddressV4Data)
      }
    }
  }
</script>
