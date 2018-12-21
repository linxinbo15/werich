<template>
  <div>
    <div class="banklist">
      <ul class="bank_list" v-for='item in banklist'>
        <li @click='xiaoka(item.id)' :style='item.bg'>
          <img :src='item.imgurl'>
          <div class="bankcode">
            <h2>{{item.bankname}}</h2>
            <span>{{item.accountnum}}</span>
          </div>
        </li>
      </ul>
    </div>
    <div class="nt_noData" v-show='flag'>
      <img src="../assets/null.png">
      <h3>您还没有绑定银行卡</h3>
    </div>
    <div class="btn">
      <x-button type="primary" action-type="button" @click.native="step()">添加银行卡</x-button>
    </div>
  </div>
</template>
<style scoped>
  .nt_noData {
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #ffffff;
    padding: 10px;
  }

  .nt_noData img {
    width: 42px;
    height: 42px;
    margin: 0 auto;
  }

  .nt_noData h3 {
    margin-top: 10px;
    font-size: 14px;
    font-weight: normal;
    line-height: 2;
    color: #6272af;
  }

  .banklist {
    margin-top: 10px;
    overflow: hidden;
    padding: 0 10px;
  }

  .banklist .bank_list li {
    overflow: hidden;
    height: 100px;
    /*background-color: #FF7327;*/
    border-radius: 10px;
    margin-bottom: 10px;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .banklist .bank_list li img {
    height: 70px;
    width: 70px;
    margin-left: 20px;
  }

  .banklist .bank_list li .bankcode {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: left;
    margin-left: 20px;
  }

  .banklist .bank_list li .bankcode h2 {
    font-size: 16px;
    color: #ffffff;
    font-weight: normal;
    margin-bottom: 5px;
  }

  .banklist .bank_list li .bankcode span {
    font-size: 16px;
    color: #ffffff;
    font-weight: normal;
  }

  .btn {
    width: 100%;
    text-align: center;
    position: fixed;
    bottom: 10px;
  }

  .btn .weui-btn {
    width: 95%;
  }

</style>
<script>
  import {mianUrlt9} from '../vuex/api'
  import {Toast, Confirm, XButton, Loading} from 'vux'
  import {getLocalStorage} from '../vuex/storage'
  import Rsa from '../vuex/Rsa'
  export default {
    data () {
      return {
        banklist: [],
        flag: false
      }
    },
    components: {
      Confirm,
      Toast,
      XButton,
      Loading
    },
    mounted () {
      this.get_bank()
    },
    methods: {
      step () { // 判断跳转开户页还是新增银行卡页
        if (getLocalStorage('isopen') === 0) { // 未开户
          this.$router.push({
            path: '/component/account'
          })
        } else {
          this.$router.push({
            path: '/component/addbank'
          })
        }
      },
      get_bank () {
        let that = this
        this.$http.post(mianUrlt9 + 'user/getBankCardList').then((res) => {
          if (res.data.retCode === '0') {
            let bankdata = res.data.data.list
            if (bankdata.length === 0) {
              this.flag = true
            }
            for (let i = 0; i < bankdata.length; i++) {
              let bankobj = {}
              bankobj.accountnum = bankdata[i].depositAccount.substring(0, 4) + ' ***** ' + bankdata[i].depositAccount.substring(bankdata[i].depositAccount.length - 4, bankdata[i].depositAccount.length)
              bankobj.bankname = bankdata[i].channelName
              bankobj.channel_id = bankdata[i].channelId
              bankobj.id = bankdata[i].id
              bankobj.imgurl = this.getbanktype(bankobj.channel_id).leiming
              bankobj.bg = this.getbanktype(bankobj.channel_id).bg
              this.banklist.push(bankobj)
            }
          } else if (res.data.retCode === '990102') {
            const msg = res.data.data[0].field + '' + res.data.data[0].message
            this.$vux.toast.text(msg, 'middle', 3000)
          } else if (res.data.retCode === '990103') {
            this.$vux.toast.text('系统正在维护，请稍后再试', 'middle', 3000)
          } else if (res.data.retCode === '990104') {
            this.$vux.toast.text('服务器内部错误', 'middle', 3000)
          } else if (res.data.retCode === '990101') {
            this.$vux.confirm.show({
              title: '',
              content: '您还未登录，去登录?',
              onCancel () {
                that.$router.back()
              },
              onConfirm () {
                that.$router.push({path: '/component/login'})
              }
            })
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      xiaoka (id, index) { // 销卡
        let that = this
        console.log(id)
        this.$vux.confirm.show({
          title: '',
          content: '确定要解绑该银行卡?',
          onCancel () {
            console.log('plugin cancel')
          },
          onConfirm () {
            that.$vux.confirm.prompt('', {
              title: '请输入交易密码',
              onShow () {
                that.$vux.confirm.setInputValue('')
              },
              onCancel () {
                console.log('prompt cancel')
              },
              onConfirm (value) {
                if (value === '') {
                  that.$vux.toast.text('交易密码不能为空', 'middle', 3000)
                } else {
                  that.getPublicKey(id, value)
                }
              }
            })
          }
        })
      },
      getPublicKey (id, value) {
        this.$http.post(mianUrlt9 + 'user/getPublicKey', {}, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            let modulus = res.data.data.rsaModulus
            let exponent = res.data.data.rsaPublicExponent
            let publicKey = RSAUtils.getKeyPair(exponent, '', modulus)
            let keyPwd
            if (value.length !== 256) {
              keyPwd = RSAUtils.encryptedString(publicKey, value)
            }
            this.xiaokamethod(id, keyPwd)
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      xiaokamethod (id, pwd) {
        this.$vux.loading.show()
        this.$http.post(mianUrlt9 + 'user/deleteBankCardById', {
          bankCardId: id,
          tPasswd: pwd
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.$vux.loading.hide()
            this.$vux.toast.text('银行卡解绑成功', 'middle', 3000)
            this.banklist = []
            this.get_bank()
          } else {
            this.$vux.loading.hide()
            var msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      getbanktype (channelid) {
        let obj = {}
        if (channelid === 'KQ01' || channelid === 9004) {
          // 工商
          obj.bg = 'background: -webkit-linear-gradient(left top, #fa588a , #f21655);background: linear-gradient(to bottom right, #fa588a , #f21655)'
          obj.leiming = './static/image/gs_bank.png'
          return obj
        } else if (channelid === 'KQ02' || channelid === 9005) {
          // 农业
          obj.bg = 'background: -webkit-linear-gradient(left top, #4d91f9 , #025feb);background: linear-gradient(to bottom right, #4d91f9 , #025feb)'
          obj.leiming = './static/image/ny_bank.png'
          return obj
        } else if (channelid === 'KQ03' || channelid === 9011) {
          // 中国
          obj.bg = 'background: -webkit-linear-gradient(left top, #faaf40 , #ff9900);background: linear-gradient(to bottom right, #faaf40 , #ff9900)'
          obj.leiming = './static/image/zg_bank.png'
          return obj
        } else if (channelid === 'KQ04' || channelid === 9006) {
          // 建设
          obj.bg = 'background: -webkit-linear-gradient(left top, #fa588a , #f21655);background: linear-gradient(to bottom right, #fa588a , #f21655)'
          obj.leiming = './static/image/js_bank.png'
          return obj
        } else if (channelid === 'KQ05' || channelid === 9021) {
          // 招商
          obj.bg = 'background: -webkit-linear-gradient(left top, #4d91f9 , #025feb);background: linear-gradient(to bottom right, #4d91f9 , #025feb)'
          obj.leiming = './static/image/zs_bank.png'
          return obj
        } else if (channelid === 'KQ06' || channelid === 9009) {
          // 交通
          obj.bg = 'background: -webkit-linear-gradient(left top, #faaf40 , #ff9900);background: linear-gradient(to bottom right, #faaf40 , #ff9900)'
          obj.leiming = './static/image/jt_bank.png'
          return obj
        } else if (channelid === 'KQ07' || channelid === 9017) {
          // 中信
          obj.bg = 'background: -webkit-linear-gradient(left top, #fa588a , #f21655);background: linear-gradient(to bottom right, #fa588a , #f21655)'
          obj.leiming = './static/image/zx_bank.png'
          return obj
        } else if (channelid === 'KQ08' || channelid === 9003) {
          // 浦发
          obj.bg = 'background: -webkit-linear-gradient(left top, #4d91f9 , #025feb);background: linear-gradient(to bottom right, #4d91f9 , #025feb)'
          obj.leiming = './static/image/zx_bank.png'
          return obj
        } else if (channelid === 'KQ09' || channelid === 9019) {
          // 兴业
          obj.bg = 'background: -webkit-linear-gradient(left top, #faaf40 , #ff9900);background: linear-gradient(to bottom right, #faaf40 , #ff9900)'
          obj.leiming = './static/image/xy_bank.png'
          return obj
        } else if (channelid === 'KQ10' || channelid === 9016) {
          // 广发
          obj.bg = 'background: -webkit-linear-gradient(left top, #fa588a , #f21655);background: linear-gradient(to bottom right, #fa588a , #f21655)'
          obj.leiming = './static/image/gf_bank.png'
          return obj
        } else if (channelid === 'KQ11' || channelid === 9002) {
          // 平安
          obj.bg = 'background: -webkit-linear-gradient(left top, #4d91f9 , #025feb);background: linear-gradient(to bottom right, #4d91f9 , #025feb)'
          obj.leiming = './static/image/pa_bank.png'
          return obj
        } else if (channelid === 'KQ12') {
          // 华夏
          obj.bg = 'background: -webkit-linear-gradient(left top, #faaf40 , #ff9900);background: linear-gradient(to bottom right, #faaf40 , #ff9900)'
          obj.leiming = './static/image/hx_bank.png'
          return obj
        } else if (channelid === 'KQ13' || channelid === 9001) {
          // 光大
          obj.bg = 'background: -webkit-linear-gradient(left top, #fa588a , #f21655);background: linear-gradient(to bottom right, #fa588a , #f21655)'
          obj.leiming = './static/image/gd_bank.png'
          return obj
        } else if (channelid === 'KQ14' || channelid === 9010) {
          // 民生
          obj.bg = 'background: -webkit-linear-gradient(left top, #4d91f9 , #025feb);background: linear-gradient(to bottom right, #4d91f9 , #025feb)'
          obj.leiming = './static/image/ms_bank.png'
          return obj
        } else if (channelid === 'KQ15' || channelid === 9007) {
          // 邮政
          obj.bg = 'background: -webkit-linear-gradient(left top, #faaf40 , #ff9900);background: linear-gradient(to bottom right, #faaf40 , #ff9900)'
          obj.leiming = './static/image/yz_bank.png'
          return obj
        }
      }
    }
  }
</script>
