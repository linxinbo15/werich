<template>
  <div>
    <div v-show="plan != 'E'">
      <div class="step_banner">
        <img src="../assets/invest/investbanner.jpg"/>
      </div>
      <h2 class="planTitle">{{planName}}</h2>
      <group label-width="4.5em" label-margin-right="2em" label-align="leff">
        <x-number title="目标金额" :value="dream_money" v-model="dream_money" width="120px" fillable
                  @on-change="changeMoney"></x-number>
        <datetime
          v-model="endDate"
          @on-change="changeDate"
          :start-date="start_date"
          title="实现时间"
          @on-cancel="log('cancel')"
          @on-confirm="onConfirm"
          @on-hide="log('hide', $event)"></datetime>
        <popup-picker title="定投周期" :data="list" v-model="cycle" value-text-align="right"
                      @on-change="onCycleChange"></popup-picker>
        <popup-picker title="定投日期" placeholder="Required" :data="listc" v-model="date_invest"
                      value-text-align="right"></popup-picker>
        <selector title="目标止损" :options="['10%', '11%', '12%', '13%', '14%', '15%', '16%', '17%','18%','19%','20%']"
                  v-model="zhis" direction="rtl"></selector>
        <selector title="支付卡号" ref="bankt" :options="bank_arr" v-model="bankname" direction="rtl"></selector>
      </group>
      <box gap="10px 10px" v-show="!aimode">
        <x-button type="primary" @click.native="getAIModel">提交智能模型</x-button>
      </box>
      <group label-width="4.5em" label-margin-right="2em" label-align="leff" style="margin-top: 10px;" v-show="aimode">
        <x-input title="定投产品" v-model="fundName" :disabled="true" text-align="right"></x-input>
        <x-input title="每期金额" v-model="money" :disabled="true" text-align="right"></x-input>
      </group>
      <box gap="10px 10px" v-show="aimode">
        <x-button type="primary" :disabled='ables' @click.native="showTardePassword">生成定投计划
        </x-button>
      </box>
    </div>
    <div v-show="plan == 'E'">
      <div class="step_banner">
        <img src="../assets/invest/planbg.jpg"/>
      </div>
      <h2 class="planTitle">{{planName}}</h2>
      <div class="dream">
        <input type="text" v-model="dream" placeholder="请写下你的梦想"/>
      </div>
      <div class="dream">
        <input type="text" v-model="dream_money" placeholder="实现梦想所需的金额"/>
      </div>
      <box gap="10px 10px">
        <x-button type="primary" :gradients="['#FF9500', '#FF9500']" @click.native="nextPlan">下一步</x-button>
      </box>
    </div>
    <toast v-model="showPositionValue" type="text" :time="800" width="18em" is-show-mask :text="toastText"
           :position="position"></toast>
  </div>
</template>

<i18n>
  set bar-active-color:
  zh-CN: 设置bar颜色
</i18n>

<script>
  import {
    XInput,
    Confirm,
    Loading,
    Toast,
    XNumber,
    Datetime,
    Selector,
    Box,
    Group,
    XButton,
    Swiper,
    SwiperItem,
    Tabbar,
    TabbarItem,
    PopupPicker
  } from 'vux'
  import {mianUrlt9} from '../vuex/api'
  import {getAddDate} from '../vuex/storage'
  import Rsa from '../vuex/Rsa'

  export default {
    components: {
      XInput,
      Confirm,
      Group,
      XNumber,
      Toast,
      Loading,
      Datetime,
      Box,
      XButton,
      Swiper,
      SwiperItem,
      Tabbar,
      TabbarItem,
      PopupPicker,
      Selector
    },
    data () {
      return {
        plan: 'A',
        swiperItemIndex: 0,
        zdate: '',
        cycle: ['每月'],
        date_invest: ['请选择定投日期'],
        zhis: '10%',
        list: [['每月', '每周', '每双周']],
        listc: [[]],
        bank_arr: [],
        bankname: '工商银行尾号0307',
        money: '',
        fundName: '',
        fundCode: '',
        aimode: false,
        planName: '',
        dream: '',
        dream_money: 100000,
        position: 'default',
        toastText: '',
        showPositionValue: false,
        startDate: new Date().Format('yyyy-MM-dd'),
        endDate: getAddDate(),
        start_date: getAddDate(),
        frequency: 0,
        moneyAccountId: '',
        term: '',
        password: '',
        ables: false,
        banktext: ''
      }
    },
    methods: {
      changeMoney (val) {
        this.aimode = false
      },
      onCycleChange (val) {
        // console.log(val)
        this.aimode = false
        if (val[0] === '每月') {
          this.listc = [[]]
          this.date_invest = ['1号']
          this.frequency = 0
          for (let i = 1; i <= 28; i++) {
            this.listc[0].push(i + '号')
          }
        } else if (val[0] === '每周') {
          this.listc = [[]]
          this.frequency = 1
          this.date_invest = ['周1']
          for (let i = 1; i <= 5; i++) {
            this.listc[0].push('周' + i)
          }
        } else if (val[0] === '每双周') {
          this.listc = [[]]
          this.frequency = 2
          this.date_invest = ['周1']
          for (let i = 1; i <= 5; i++) {
            this.listc[0].push('周' + i)
          }
        }
        // console.log(this.listc)
      },
      showPosition (position) {
        this.position = position
        this.showPositionValue = true
      },
      showTardePassword () {
        const _this = this
        if (this.date_invest[0] === '请选择定投日期') {
          this.toastText = '请选择定投日期！'
          this.showPosition('middle')
          return false
        }
        if (parseInt(this.money) < 100) {
          this.toastText = '定投金额小于100，请重新设置定投！'
          this.showPosition('middle')
          return false
        }
        this.$vux.confirm.prompt('请输入您的6位交易密码', {
          title: '请输入您的6位交易密码',
          onShow () {
            console.log('promt show')
            // _this.$vux.confirm.setInputValue('set input value')
          },
          onHide () {
            console.log('prompt hide')
          },
          onCancel () {
            console.log('prompt cancel')
          },
          onConfirm (msg) {
            // alert(msg)
            if (msg === '') {
              _this.toastText = '交易密码不能为空'
              _this.showPosition('middle')
              return false
            }
            _this.password = msg
            _this.ables = true
            _this.$vux.loading.show({text: '智能定投协议生成中'})
            _this.$http.post(mianUrlt9 + 'user/getPublicKey', {}, {emulateJSON: true}).then((res) => {
              if (res.data.retCode === '0') {
                let modulus = res.data.data.rsaModulus
                let exponent = res.data.data.rsaPublicExponent
                let publicKey = RSAUtils.getKeyPair(exponent, '', modulus)
                let keyPass
                if (_this.password.length !== 256) {
                  keyPass = RSAUtils.encryptedString(publicKey, _this.password)
                }
                _this.buyInvest(keyPass)
              } else {
                _this.toastText = res.data.retMsg
                _this.showPosition('middle')
              }
            })
            /* _this.$router.push({
              path: '/component/invest-success',
              query: { planName: _this.planName, dream_money: _this.dream_money, zdate: _this.endDate, cycle: _this.cycle[0], date_invest: _this.date_invest[0], zhis: _this.zhis, bankname: _this.bankname, money: _this.money, fundname: _this.fundname }
            }) */
          }
        })
      },
      buyInvest (keyPass) {
        let startDate = this.startDate.split('-')
        const startDate1 = startDate[0] + startDate[1] + startDate[2]
        let endDate = this.endDate.split('-')
        const endDate1 = endDate[0] + endDate[1] + endDate[2]
        let investn = this.date_invest[0].replace(/[^0-9]/ig, '')
        if (Number(investn) < 10) {
          investn = '0' + investn
        }
        const obj = {
          startDate: startDate1,
          endDate: endDate1,
          freqrency: this.frequency,
          investn: investn,
          targetMoney: this.dream_money,
          stopLoss: parseInt(this.zhis) / 100,
          stopProfit: 0.05,
          cycleMoney: parseInt(this.money),
          sceneName: this.planName,
          cardId: this.bankname,
          keyPass: keyPass,
          bankFlag: 'cjqf'
        }
        this.$http.post(mianUrlt9 + 'fund/autoInvest', obj, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.ables = true
            this.$router.push({
              path: '/component/invest-success',
              query: {
                planName: this.planName,
                dream_money: this.dream_money,
                nextTradeDate: res.data.data.firstinvestdate,
                term: this.term,
                zdate: this.endDate,
                cycle: this.cycle[0],
                date_invest: this.date_invest[0],
                zhis: this.zhis,
                bankname: this.bankname,
                money: this.money,
                fundname: this.fundName,
                banktext: this.banktext,
              }
            })
            // console.log(this.bank_arr)
          } else if (res.data.retCode === '990101') {
            this.$vux.loading.hide()
            this.ables = false
            this.toastText = res.data.retMsg
            this.showPosition('middle')
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
            })
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
      nextPlan () {
        if (this.dream === '' || this.dream_money === '') {
          this.toastText = '没有填写梦想和金额！'
          this.showPosition('middle')
        } else {
          this.$router.push({
            path: '/component/invest-step1',
            query: {dream: this.dream, money: this.dream_money}
          })
        }
      },
      getAIModel () {
        // console.log(this.endDate)
        this.$vux.loading.show({
          text: '模型计算中'
        })
        let dateTime = new Date(this.endDate).getTime()
        let dateTime1 = new Date()
        let diff = dateTime - dateTime1
        let day = Math.floor(diff / (1000 * 60 * 60 * 24))
        let term = ''
        if (this.frequency === 0) {
          term = Math.floor(day / 30)
        } else if (this.frequency === 1) {
          term = Math.floor(day / 7)
        } else if (this.frequency === 2) {
          term = Math.floor(day / 14)
        }
        this.term = term
        let freelv = (5/4 + Math.min(day/365.25) * 7 / 4) / 100
        let prate = Math.exp(freelv * day / term / 365.25) - 1
        this.money = Math.floor(Number(this.dream_money) / (1 + 1 / prate) / (Math.pow((1 + prate), term) - 1)) + '元'
        this.$http.post(mianUrlt9 + 'fund/LatestSign', {}, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            let fundPara = res.data.data
            console.log(fundPara)
            if (fundPara === '0.0') {
              this.fundName = '易方达天天A'
              this.fundCode = '000009.OF'
            } else {
              this.fundName = '易方达沪深300量化'
              this.fundCode = '110030.OF'
            }
            this.$vux.loading.hide()
            this.aimode = true
            // console.log(this.bank_arr)
          } else if (res.data.retCode === '990101') {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
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
      change (val) {
        console.log('on change', val)
      },
      changeDate (value) {
        // console.log(value)
        this.aimode = false
        this.endDate = value
        this.startDate = new Date().Format('yyyy-MM-dd')
      },
      log (str1, str2 = '') {
        console.log(str1, str2)
      },
      onConfirm (val) {
        // console.log('on-confirm arg', val)
        this.endDate = val
        this.startDate = new Date().Format('yyyy-MM-dd')
      },
      getParams () {
        // 取到路由带过来的参数
        // console.log(this.$route)
        let plan = this.$route.query.plan
        // 将数据放在当前组件的数据内
        if (plan === 'A') {
          this.planName = '养老计划'
        } else if (plan === 'B') {
          this.planName = '购房置业'
        } else if (plan === 'C') {
          this.planName = '子女教育'
        } else if (plan === 'D') {
          this.planName = '旅行度假'
        } else {
          this.planName = '自定义计划'
        }
        this.plan = plan
        for (let i = 1; i <= 28; i++) {
          this.listc[0].push(i + '号')
        }
      },
      getBankCardList () {
        this.$http.post(mianUrlt9 + 'user/getBankCardList', {}, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            for (let i = 0; i < res.data.data.list.length; i++) {
              if (i === 0) {
                this.bankname = res.data.data.list[i].id
              }
              if (res.data.data.list[i].status === '3') {

              } else {
                let obj = {}
                obj.key = res.data.data.list[i].id
                obj.value = res.data.data.list[i].channelName + '尾号' + res.data.data.list[i].depositAccount.substring(res.data.data.list[i].depositAccount.length - 4, res.data.data.list[i].depositAccount.length)
                /* obj.channelId = res.data.data.list[i].channelId
                obj.moneyAccount = res.data.data.list[i].moneyAccount
                obj.channelName = res.data.data.list[i].channelName
                obj.depositAccount = res.data.data.list[i].depositAccount
                obj.status = res.data.data.list[i].status
                obj.id = res.data.data.list[i].id */
                this.bank_arr.push(obj)
              }
            }
          } else if (res.data.retCode === '990101') {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
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
      }
      /* getValue (ref) {
        if (this.$refs[ref].getFullValue() == null) {

        } else {
          this.moneyAccountId = this.$refs[ref].getFullValue()[0].id
          this.banktext = this.$refs[ref].getFullValue()[0].value
        }
      } */
    },
    beforeCreate () {
      this.startDate = new Date().Format('yyyy-MM-dd')
      let startDate1 = new Date()
      let yearAdd = Number(startDate1.getFullYear()) + 1
      let zdate = startDate1.setFullYear(yearAdd)
      this.endDate = new Date(zdate).Format('yyyy-MM-dd')
      this.start_date = new Date(zdate).Format('yyyy-MM-dd')
      // console.log(this.endDate)
    },
    mounted () {
      this.getParams()
      this.getBankCardList()
    }
  }
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/center.less';
  @import '../styles/custom.less';

  .step_banner {
    position: relative;
  }

  .step_banner img {
    display: block;
    width: 100%;
    height: auto;
  }

  .planTitle {
    line-height: 44px;
    font-size: 16px;
    padding-left: 10px;
    color: #ffa014;
  }

  .weui-tabbar__item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    justify-content: center;
    -webkit-justify-content: center;
  }

  .weui-tabbar__item:nth-child(1) {
    background-color: #ffa014;
    flex: 1;
    border-bottom: 1px solid #ffa014;
  }

  .swiper-demo-img img {
    display: block;
    width: 100%;
    height: auto;
  }

  .weui-tabbar__label span {
    font-size: 16px;
    color: #ffffff;
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

  .select_plan {
    background-color: #ffffff;
    margin: 10px 0;
  }

  .weui-cells {
    margin-top: 0px;
  }

  .up {
    color: @redfont;
  }

  .dream {
    border: 1px solid #cccccc;
    width: 90%;
    border-radius: 5px;
    margin: 0 auto;
    margin-bottom: 15px;
  }

  .dream input {
    height: 44px;
    line-height: 44px;
    font-size: 16px;
    color: #222222;
    border: none;
    outline: none;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    border-radius: 5px;
  }

  .down {
    color: @greenfont;
  }
</style>
