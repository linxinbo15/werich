<template>
  <div>
    <div class="margintop" v-show="step == 0">
      <div class="fundtitle">
        <div>组合名称</div>
        <div class="fundtitle_right">{{fundgroupname}}</div>
      </div>
      <group label-width="4.5em" label-margin-right="2em" label-align="right" style="margin-top: 10px;">
        <!--<cell title="基金名称" value="fundName" is-link></cell>
        <cell title="可用份额" value="availableVol1" is-link></cell>-->
        <x-input title="交易密码" v-model="trapwd" type="password" text-align="right" placeholder="请输入交易密码"></x-input>
      </group>
      <!-- <group label-width="6.5em" label-margin-right="2em" label-align="right" style="margin-top: 10px;">
         <x-input title="设置交易密码" v-model="trapwd" type="password" text-align="right" placeholder="请输入6位数字密码" :min="6" :max="6"></x-input>
         <x-input title="确认交易密码" v-model="trapwd1" type="password" text-align="right" placeholder="请再次输入6位数字密码" :min="6" :max="6"></x-input>
       </group>-->
      <div class="agree">
        <check-icon :value.sync="agree"> 我已阅读并同意</check-icon>
        <router-link class="agreecolor" to='/component/trade-agment'>《基金交易协议》</router-link>
        和
        <router-link class="agreecolor" to='/component/trade-ydagment'>《约定交易协议》</router-link>
      </div>
      <box gap="10px 10px">
        <x-button type="primary" :disabled='ables' @click.native="getPublicKey">
          一键赎回
        </x-button>
      </box>
      <div class="tips">
        15:00后交易属于下一个工作日，为了您的资金安全，交易遵守[同卡进出]原则，卖出所得款项只能回到购买所用卡中。
      </div>
    </div>
    <div class="margintop" v-show="step != 0">
      <msg title="赎回组合成功！" :description="description" :buttons="buttons" :icon="icon"></msg>
    </div>
    <toast v-model="showPositionValue" type="text" :time="800" width="18em" is-show-mask :text="toastText"
           :position="position"></toast>
  </div>
</template>

<script>
  import {
    XAddress,
    XInput,
    Cell,
    Confirm,
    CheckIcon,
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
    Msg
  } from 'vux'
  import {mianUrlt9} from '../vuex/api'
  import Rsa from '../vuex/Rsa'

  export default {
    components: {
      XInput,
      Confirm,
      Group,
      Cell,
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
        agree: true,
        position: 'default',
        toastText: '',
        showPositionValue: false,
        bankname: '',
        description: '购买成功！',
        icon: '',
        step: 0,
        trapwd: '',
        kejian: true,
        ables: false,
        bank_arr: [],
        buttons: [{
          type: 'primary',
          text: '完成',
          onClick: this.detail
        }, {
          type: 'default',
          text: '返回首页',
          link: '/'
        }],
        // uniqueid: '',
        token: '',
        groupFundBuyId: '',
        fundgroupname: '',
        able: false
      }
    },
    methods: {
      detail () {
        this.$router.push({
          path: '/component/asset',
        })
      },
      getParams () {
        // 取到路由带过来的参数
        // console.log(this.$route)
        this.groupFundBuyId = this.$route.query.groupFundBuyId
        this.fundgroupname = this.$route.query.fundgroupname
        // 将数据放在当前组件的数据内
      },
      getPublicKey () {
        if (this.trapwd === '') {
          this.toastText = '交易密码不能为空'
          this.showPosition('middle')
          return
        }
        if (this.agree === false) {
          this.toastText = '请阅读交易协议'
          this.showPosition('middle')
          return
        }
        this.ables = true
        this.$vux.loading.show({text: '赎回中'})
        this.$http.post(mianUrlt9 + 'user/getPublicKey', {}, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            let modulus = res.data.data.rsaModulus
            let exponent = res.data.data.rsaPublicExponent
            let publicKey = RSAUtils.getKeyPair(exponent, '', modulus)
            let keyPass
            if (this.trapwd.length !== 256) {
              keyPass = RSAUtils.encryptedString(publicKey, this.trapwd)
            }
            this.redeemGroup(keyPass)
          } else {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
          }
        })
      },
      showPosition (position) {
        this.position = position
        this.showPositionValue = true
      },
      redeemGroup (keyPass) {
        this.$http.post(mianUrlt9 + 'fund/groupSell', {
          groupFundBuyId: this.groupFundBuyId,
          password: keyPass
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.$vux.loading.hide()
            this.ables = false
            this.step = 1
            this.description = '您一键赎回的' + this.fundgroupname + '组合已经成功！'
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
          } else if (res.data.retCode === '990101') {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
            })
          } else {
            this.$vux.loading.hide()
            this.ables = false
            this.toastText = res.data.retMsg
            this.showPosition('middle')
          }
        })
      }
      /* getBankCardList () {
        this.$http.post(mianUrlt9 + 'user/getBankCardList',{}, { emulateJSON: true }).then((res) => {
          if (res.data.retCode == '0') {
            for (let i = 0; i < res.data.data.list.length; i++) {
              let obj = {}
              if(i == 0) {
                this.bankname = res.data.data.list[i].channelId+"||"+res.data.data.list[i].moneyAccount
              }
              obj.key = res.data.data.list[i].channelId+"||"+res.data.data.list[i].moneyAccount
              obj.value = res.data.data.list[i].channelName+"尾号"+res.data.data.list[i].depositAccount.substring(res.data.data.list[i].depositAccount.length-4,res.data.data.list[i].depositAccount.length)
              obj.channelId = res.data.data.list[i].channelId
              obj.moneyAccount = res.data.data.list[i].moneyAccount
              obj.channelName = res.data.data.list[i].channelName
              obj.depositAccount = res.data.data.list[i].depositAccount
              obj.status = res.data.data.list[i].status
              obj.id = res.data.data.list[i].id
              this.bank_arr.push(obj)
            }
            //console.log(this.bank_arr)
          } else if (res.data.retCode == '990101') {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
            this.$router.push({
              path: '/component/login',
              query: { path: this.$route.fullPath }
            })
          } else if (res.data.retCode == '990102') {
            this.toastText = res.data.data[0].field + '' + res.data.data[0].message
            this.showPosition('middle')
          } else if (res.data.retCode == '990103') {
            this.toastText = '系统正在维护，请稍后再试'
            this.showPosition('middle')
          } else if (res.data.retCode == '990104') {
            this.toastText = '服务器内部错误'
            this.showPosition('middle')
          } else {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
          }
        })
      } */
    },
    mounted () {
      this.getParams()
      // this.getBankCardList()
      // this.getuniqueid()
    }
  }
</script>

<style lang="less" scoped>
  @import '../styles/custom.less';

  .fundtitle {
    padding: 12px 20px;
    background-color: #ffffff;
    border-top: 1px solid #f2f2f2;
    border-bottom: 1px solid #f2f2f2;
    font-size: 17px;
    color: #222222;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .fundtitle_right {
    flex: 1;
    text-align: right;
  }

  .fundtitle span {
    color: #222222;
    font-size: 12px;
  }

  .share {
    font-size: 14px;
    color: #666666;
    padding: 10px;
  }

  .agree {
    padding: 10px;
    font-size: 14px;
    color: #333333;
  }

  .agreecolor {
    color: #ffa014;
  }

  .tips {
    padding: 10px;
    font-size: 12px;
    color: #999999;
    line-height: 1.5;
  }

  .process_span {
    padding: 10px;
    font-size: 12px;
    color: #888888;
    background-color: #ffffff;
    border-top: 1px solid #f2f2f2;
  }

  .margintop {
    margin-top: 10px;
    margin-bottom: 10px;
  }

  .up {
    color: @redfont;
  }

  .down {
    color: @greenfont;
  }
</style>
