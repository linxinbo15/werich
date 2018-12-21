<template>
  <div class="asset">
    <div
      style="background: -webkit-linear-gradient(left top, #2c88ff , #1d5ffc); background: linear-gradient(to bottom right, #2c88ff , #1d5ffc);">
      <div>
        <a class="ma_moni" @click='setmy'>
          <img :src="imgurl" class='ma_userhead'>
          <p class="ma_name">个人中心</p>
        </a>
        <a class='trade' @click='settrade'>交易记录</a>
      </div>
      <div class="ma_headCon">
        <a id="ma_yetGain">
          <span>{{total}}</span>
          <p>总资产(元)</p>
        </a>
      </div>
      <section class="ma_conH">
        <ul class="clearfix">
          <li id="ma_totalVal">
            <p class="ma_num">{{day}}</p>
            <p class="ma_font">昨日收益(元)</p>
          </li>
          <li style="border:none;">
            <p class="ma_num" id="ma_accEarn">{{sum}}</p>
            <p class="ma_font">累计收益(元)</p>
          </li>
        </ul>
      </section>
    </div>
    <toast v-model="showPositionValue" type="text" width="18em" :time="800" is-show-mask :text="toastText"
           :position="position">{{toastText}}
    </toast>
    <p style="padding:10px;color:#ff9900;font-size: 16px;" v-show='weixinShow' @click='weixin'>还未绑定微信，去绑定？</p>
    <!--     <div class="group">
          <div class="cashtitle"><h3 class="ma_h3">现金宝</h3></div>
          <ul class="xianjinbao">
            <li>
              <div @click="assdetail()"><span>持有金额(元)</span><br><span>{{xianjinbao}}</span></div>
            </li>
            <li>
              <x-button type="primary" :disabled='dis' action-type="button" @click.native="redeemCash(cashAccountid)">转出
              </x-button>
              <x-button type="primary" action-type="button" @click.native="cashFundBuy">转入</x-button>
            </li>
          </ul>
        </div> -->
    <!--     <div class="group1" style="margin-top: 10px;">
          <div class="cashtitle"><h3 class="ma_h3">基金精选</h3></div>
          <grid :cols="2" :show-lr-borders="false">
            <grid-item link="/component/assetliststr" label="">
              <img slot="icon" src="../assets/grid_icon4.png">
              <div class="box">
                <h2 :class='{"red":strategy>=0,"green":strategy<0}'>{{strategy}}</h2>
                <p>量化策略</p>
              </div>
            </grid-item>
            <grid-item link="/component/assetlistgr" label="">
              <img slot="icon" src="../assets/grid_icon3.png">
              <div class="box">
                <h2 :class='{"red":group>=0,"green":group<0}'>{{group}}</h2>
                <p>智能组合</p>
              </div>
            </grid-item>
            <grid-item link="/component/assinvest" label="">
              <img slot="icon" src="../assets/grid_icon5.png">
              <div class="box">
                <h2 :class='{"red":invest>=0,"green":invest<0}'>{{invest}}</h2>
                <p>智能定投</p>
              </div>
            </grid-item>
            <grid-item link="/component/assetlistsin" label="">
              <img slot="icon" src="../assets/grid_icon1.png">
              <div class="box">
                <h2 :class='{"red":single>=0,"green":single<0}'>{{single}}</h2>
                <p>基金优选</p>
              </div>
            </grid-item>
          </grid>
        </div> -->
    <div>
      <ul class='newlist'>
        <li @click='grdetail()'>
          <h2>智能组合</h2>
          <div class="flag_arrow"><img src="../../static/image/arrow.png"></div>
          <div style="margin-top: 2px;">
            <span>金额：{{grouptotal}}元</span>
            <span>累计收益：<a :class='{"red":Number(group_num)>=0,"green":Number(group_num)<0}'>{{group}}元</a></span>
          </div>
        </li>
        <li @click='invdetail()'>
          <h2>智能定投</h2>
          <div class="flag_arrow"><img src="../../static/image/arrow.png"></div>
          <div style="margin-top: 2px;">
            <span>金额：{{invtotal}}元</span>
            <span>累计收益：<a :class='{"red":Number(invshouyi_num)>=0,"green":Number(invshouyi_num)<0}'>{{invshouyi}}元</a></span>
          </div>
        </li>
        <li @click='strdetail()'>
          <h2>智能策略</h2>
          <div class="flag_arrow"><img src="../../static/image/arrow.png"></div>
          <div style="margin-top: 2px;">
            <span>金额：{{strtotal}}元</span>
            <span>累计收益：<a :class='{"red":Number(strategy_num)>=0,"green":Number(strategy_num)<0}'>{{strategy}}元</a></span>
          </div>
        </li>
        <li @click='singledetail()'>
          <h2>基金优选</h2>
          <div class="flag_arrow"><img src="../../static/image/arrow.png"></div>
          <div style="margin-top: 2px;">
            <span>金额：{{singletotal}}元</span>
            <span>累计收益：<a :class='{"red":Number(single_num)>=0,"green":Number(single_num)<0}'>{{single}}元</a></span>
          </div>
        </li>
        <li @click="assdetail()">
          <h2>现金宝</h2>
          <div class="flag_arrow"><img src="../../static/image/arrow.png"></div>
          <div style="margin-top: 2px;">
            <span>金额：{{xianjinbao}}元</span>
            <span>累计收益：<a :class='{"red":Number(profit)>=0,"green":Number(profit)<0}'>{{profit}}元</a></span>
          </div>
        </li>
      </ul>
    </div>
    <!--     <div class="setup" @click='setmy'>
          <div class="seticon">&#xe62d;</div>
          <div class="settext">我的服务</div>
        </div> -->

  </div>
</template>
<script>
  import {mianUrlt9} from '../vuex/api'
  import {Confirm, Toast, Grid, GridItem, XButton, numberComma} from 'vux'
  import {getLocalStorage, setLocalStorage} from '../vuex/storage'

  export default {
    data() {
      return {
        total: '0.00',
        sum: '0.00',
        day: '0.00',
        yester: '',
        xianjinbao: '0.00',    // 现金宝持仓市值
        strtotal: '0.00',     //策略持仓市值
        strategy: '0.00',
        strategy_num: '0.00',
        grouptotal: '0.00',   //组合持仓市值
        group: '0.00',
        group_num: '0.00',
        invest: '0.00',
        singletotal: '0.00',  //单只持仓市值
        single: '0.00',   //单只累计收益
        single_num: '0.00',
        dis: false,
        profit: 0,      // 现金宝累计收益
        profit_num: 0,
        position: 'default',
        toastText: '加入自选成功！',
        showPositionValue: false,
        cashAccountid: '',
        weixinShow: false,
        imgurl: './static/image/header.png',
        invtotal: 0.00,
        invshouyi: 0.00,
        invshouyi_num: 0.00
      }
    },
    components: {
      Confirm,
      Toast,
      Grid,
      GridItem,
      XButton
    },
    mounted() {
      this.getUserInfo()
      //this.getimgurl()
      this.getasset()
      this.getinvasset()
      this.testweixin()
    },
    methods: {
      getUserInfo() {
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
            let imgurl = getLocalStorage('weixinHeadimgurl')
            if (imgurl !== '') {
              this.imgurl = imgurl
            }
          } else if (res.data.retCode === '990101') {
            this.$vux.confirm.show({
              title: '',
              content: '您还未登录，去登录?',
              onShow() {
                console.log('plugin show')
              },
              onHide() {
                console.log('plugin hide')
              },
              onCancel() {
                this.$router.back()
              },
              onConfirm() {
                console.log('plugin confirm')
                this.$router.push({
                  path: '/component/login'
                })
              }
            })
          } else {
            this.$vux.confirm.show({
              title: '',
              content: '您还未登录，去登录?',
              onShow() {
                console.log('plugin show')
              },
              onHide() {
                console.log('plugin hide')
              },
              onCancel() {
                this.$router.back()
              },
              onConfirm() {
                console.log('plugin confirm')
                this.$router.push({
                  path: '/component/login'
                })
              }
            })
          }
        })

      },
      singledetail() {
        this.$router.push('/component/assetlistsin')
      },
      strdetail() {
        this.$router.push('/component/assetliststr')
      },
      invdetail() {
        this.$router.push('/component/assinvest')
      },
      grdetail() {
        this.$router.push('/component/assetlistgr')
      },
      /*getimgurl() {
        var imgurl = getLocalStorage('weixinHeadimgurl')
        if (imgurl !== '') {
          this.imgurl = imgurl
        }
      },*/
      setmy() {
        this.$router.push({
          path: '/component/my',
          query: {path: this.$route.fullPath}
        })
      },
      settrade() {
        this.$router.push({
          path: '/component/trade-record'
        })
      },
      weixin() {
        this.$router.push('/component/bindingwx')
      },
      testweixin() {
        let isweixin = getLocalStorage('isweixin')
        if (isweixin === '0') {
          this.weixinShow = true
        } else {
          this.weixinShow = false
        }
      },
      getinvasset() {            //获取定投资产
        this.$http.post(mianUrlt9 + 'fund/assetCastsurely', {
          bankFlag: 'cjqf'
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            if (res.data.data.fundCastsurelyProfit !== '') {
              this.invtotal = numberComma(Number(res.data.data.fundCastsurelyProfit.fundmarketvalue).toFixed(2))
            }
            let shouyi = 0
            for (let i = 0; i < res.data.data.fundCastsurelySingleList.length; i++) {
              shouyi += Number(res.data.data.fundCastsurelySingleList[i].floatprofit)
            }
            this.invshouyi_num = shouyi
            if (Number(shouyi) > 0) {
              this.invshouyi = '+' + numberComma(Number(shouyi).toFixed(2))
            } else {
              this.invshouyi = numberComma(Number(shouyi).toFixed(2))
            }
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      redeemCash(id) {
        // const that = this
        const Tel = getLocalStorage('Tel')
        const isopen = getLocalStorage('isopen')
        const riskLevel = getLocalStorage('riskLevel')
        console.log(Tel, isopen, riskLevel)
        if (Tel == null || Tel === '') {
          this.$router.push({
            path: '/component/login',
            query: {path: this.$route.fullPath}
          })
        } else if (isopen === '0') { // 未开户
          this.$router.push({
            path: '/component/account',
            query: {path: this.$route.fullPath}
          })
        } else {
          const obj = {
            fundCode: '000662',
            singleOneAssetId: this.cashAccountid
          }
          this.$http.post(mianUrlt9 + 'fund/beforeSingleSell', obj, {emulateJSON: true}).then((res) => {
            if (res.data.retCode === '0') {
              // console.log(res)
              this.$router.push({
                path: '/component/redeem-cash',
                query: {
                  channelId: res.data.data.channelId,
                  fundCode: res.data.data.fundCode,
                  singleOneAssetId: id,
                  availableVol: res.data.data.availableVol,
                  fundName: res.data.data.fundName,
                  redeemMinVol: res.data.data.redeemMinVol,
                  redeemMaxVol: res.data.data.redeemMaxVol,
                  shareType: res.data.data.shareType,
                  taNo: res.data.data.taNo,
                  transactionAccountId: res.data.data.transactionAccountId
                }
              })
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
      },
      showPosition(position) {
        this.position = position
        this.showPositionValue = true
      },
      cashFundBuy() {
        const that = this
        const Tel = getLocalStorage('Tel')
        const isopen = getLocalStorage('isopen')
        const riskLevel = getLocalStorage('riskLevel')
        console.log(Tel, isopen, riskLevel)
        if (Tel == null || Tel === '') {
          this.$router.push({
            path: '/component/login',
            query: {path: this.$route.fullPath}
          })
        } else if (isopen === '0') { // 未开户
          this.$router.push({
            path: '/component/account',
            query: {path: this.$route.fullPath}
          })
        } else if (riskLevel == null || riskLevel === '') { // 未做风险测评
          this.$vux.confirm.show({
            title: '风险测评',
            content: '购买基金产品前，需要对您的风险承受能力进行测评',
            onShow() {
              console.log('plugin show')
            },
            onHide() {
              console.log('plugin hide')
            },
            onCancel() {
              console.log('plugin cancel')
            },
            onConfirm() {
              that.$router.push({path: '/component/risk-question', query: {path: that.$route.fullPath}})
            }
          })
        } else {
          const obj = {
            fundCode: '000662'
          }
          this.$http.post(mianUrlt9 + 'fund/beforeSingleBuy', obj, {emulateJSON: true}).then((res) => {
            if (res.data.retCode === '0') {
              console.log(res)
              this.$router.push({
                path: '/component/buy-fund',
                query: {
                  fundCode: res.data.data.fundCode,
                  fundName: res.data.data.fundName,
                  fundType: res.data.data.fundType,
                  perMax22: res.data.data.perMax22,
                  perMin22: res.data.data.perMin22,
                  perMax24: res.data.data.perMax24,
                  perMin24: res.data.data.perMin24,
                  perMax20: res.data.data.perMax20,
                  perMin20: res.data.data.perMin20,
                  riskLevel: res.data.data.riskLevel,
                  shareType: res.data.data.shareType,
                  status: res.data.data.status,
                  taNo: res.data.data.taNo
                }
              })
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
      },
      getasset() {
        var that = this
        this.$http.post(mianUrlt9 + 'user/myAssetInfo', {}, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.total = numberComma(Number(res.data.data.totalAssets))
            this.sum = numberComma(Number(res.data.data.sumProfit))
            this.day = numberComma(Number(res.data.data.lastDayProfit).toFixed(2))
            var length = res.data.data.lastDate.length
            this.yester = res.data.data.lastDate.substring(length - 4, length - 2) + '-' + res.data.data.lastDate.substring(length - 2)
            if (res.data.data.hqbHoldingList.length !== 0) {
              let fundCash = 0
              for (var i = 0; i < res.data.data.hqbHoldingList.length; i++) {
                fundCash += Number(res.data.data.hqbHoldingList[i].fundMarketValue)
                this.profit += Number(res.data.data.hqbHoldingList[i].floatProfit)
              }
              if (this.profit >= 0) {
                this.profit = "+" + this.profit
              }
              this.xianjinbao = Number(fundCash).toFixed(2)
              this.cashAccountid = res.data.data.hqbHoldingList[0].id
            }
            if (res.data.data.hqbInTransitList.length !== 0) {
              let xianjinbao1 = 0.00
              for (var i = 0; i < res.data.data.hqbInTransitList.length; i++) {
                if(res.data.data.hqbInTransitList[i].status == '02' || res.data.data.hqbInTransitList[i].status == '06') {
                  xianjinbao1 += Number(res.data.data.hqbInTransitList[i].applicationAmount)
                }
              }
              //console.log(xianjinbao1)
              this.xianjinbao = Number(this.xianjinbao) + Number(xianjinbao1)
            }
            //console.log(this.xianjinbao)
            this.xianjinbao = numberComma(Number(this.xianjinbao).toFixed(2))
            if(res.data.data.hqbHoldingList.length == 0 && res.data.data.hqbInTransitList.length == 0) {
              this.dis = true
            }
            if (res.data.data.strategyHoldingInfoList.length !== 0) {
              let num = 0
              let avail = 0
              for (let i = 0; i < res.data.data.strategyHoldingInfoList.length; i++) {
                if (res.data.data.strategyHoldingInfoList[i].holdingIncome !== '' && res.data.data.strategyHoldingInfoList[i].holdingIncome !== '0.00') {
                  num += Number(res.data.data.strategyHoldingInfoList[i].holdingIncome)
                }
                if (res.data.data.strategyHoldingInfoList[i].totalFundMarketValue !== '') {
                  avail += Number(res.data.data.strategyHoldingInfoList[i].totalFundMarketValue)
                }
              }
              this.strategy_num =  num
              if (num >= 0) {
                this.strategy = '+' + numberComma(num.toFixed(2))
              } else {
                this.strategy = numberComma(num.toFixed(2))
              }
              this.strtotal = Number(avail).toFixed(2)
            }
            if(res.data.data.strategyInTransitInfoList.length !== 0) {
              let strtotal1 = 0
              for (let i = 0; i < res.data.data.strategyInTransitInfoList.length; i++) {
                if (res.data.data.strategyInTransitInfoList[i].costMoney !== '') {
                  strtotal1 += Number(res.data.data.strategyInTransitInfoList[i].costMoney)
                }
              }
              this.strtotal = Number(this.strtotal) + Number(strtotal1)
            }
            this.strtotal = numberComma(Number(this.strtotal).toFixed(2))
            if (res.data.data.intelligentGroupHoldingInfoList.length !== 0) {
              let num = 0
              let avail = 0
              for (let i = 0; i < res.data.data.intelligentGroupHoldingInfoList.length; i++) {
                if (res.data.data.intelligentGroupHoldingInfoList[i].holdingIncome !== '' && res.data.data.intelligentGroupHoldingInfoList[i].holdingIncome !== '0.00') {
                  num += Number(res.data.data.intelligentGroupHoldingInfoList[i].holdingIncome)
                }
                if (res.data.data.intelligentGroupHoldingInfoList[i].totalFundMarketValue !== '') {
                  avail += Number(res.data.data.intelligentGroupHoldingInfoList[i].totalFundMarketValue)
                }
              }
              this.group_num = num
              if (num >= 0) {
                this.group = '+' + numberComma(num.toFixed(2))
              } else {
                this.group = numberComma(num.toFixed(2))
              }
              this.grouptotal = Number(avail).toFixed(2)
            }
            if(res.data.data.intelligentGroupInTransitInfoList !== '' && res.data.data.intelligentGroupInTransitInfoList.length !== 0) {
              let grouptotal1 = 0
              for (let i = 0; i < res.data.data.intelligentGroupInTransitInfoList.length; i++) {
                if (res.data.data.intelligentGroupInTransitInfoList[i].costMoney !== '') {
                  grouptotal1 += Number(res.data.data.intelligentGroupInTransitInfoList[i].costMoney)
                }
              }
              this.grouptotal = Number(this.grouptotal) + Number(grouptotal1)
            }
            this.grouptotal = numberComma(Number(this.grouptotal).toFixed(2))
            if (res.data.data.singleHoldingList.length !== 0) {
              let num = 0
              let avail = 0
              for (let i = 0; i < res.data.data.singleHoldingList.length; i++) {
                if (res.data.data.singleHoldingList[i].floatProfit !== '' && res.data.data.singleHoldingList[i].floatProfit !== '0.00') {
                  num += Number(res.data.data.singleHoldingList[i].floatProfit)
                }
                if (res.data.data.singleHoldingList[i].availableVol !== '0.00') {
                  avail += Number(res.data.data.singleHoldingList[i].fundMarketValue)
                }
              }
              this.single_num = num
              if (num >= 0) {
                this.single = '+' + numberComma(num.toFixed(2))
              } else {
                this.single = numberComma(num.toFixed(2))
              }
              this.singletotal = Number(avail).toFixed(2)
            }
            if(res.data.data.singleInTransitList.length !== 0) {
              let singletotal1 = 0
              for (let i = 0; i < res.data.data.singleInTransitList.length; i++) {
                if (res.data.data.singleInTransitList[i].applicationAmount !== '0.00') {
                  singletotal1 += Number(res.data.data.singleInTransitList[i].applicationAmount)
                }
              }
              this.singletotal = Number(this.singletotal) + Number(singletotal1)
              //console.log(this.singletotal)
            }
            this.singletotal = numberComma(Number(this.singletotal).toFixed(2))
          } else if (res.data.retCode === '990101') {
            that.$vux.confirm.show({
              title: '',
              content: '您还未登录，去登录?',
              onShow() {
                console.log('plugin show')
              },
              onHide() {
                console.log('plugin hide')
              },
              onCancel() {
                that.$router.back()
              },
              onConfirm() {
                console.log('plugin confirm')
                that.$router.push({
                  path: '/component/login'
                })
              }
            })
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      assdetail() {
        if (this.dis === false) {
          this.$router.push({
            path: '/component/assdetailxian',
            query: {profit: this.profit, total: this.xianjinbao, cashAccountid: this.cashAccountid}
          })
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../styles/custom.less';

  ol, ul, li {
    list-style: none outside none;
  }

  .setup {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    height: 48px;
    border-top: 1px solid @ai-line-color;
    border-bottom: 1px solid @ai-line-color;
    background-color: #fff;
    margin-top: 10px;
  }

  .seticon {
    font-family: 'vux-demo';
    font-size: 24px;
    color: #0a6fff;
    margin-left: 15px;
  }

  .settext {
    margin-left: 10px;
    font-size: 16px;
    color: #222;
  }

  .group {
    background-color: #fff;
    border-bottom: 1px solid @ai-line-color;
  }

  .group1 {
    background-color: #fff;
  }

  .asset .ma_headCon {
    text-align: center;
  }

  .asset .ma_moni {
    color: #fff;
    float: left;
    margin-top: 8px;
    font-size: 12px;
    padding-left: 10px;
    overflow: hidden;
  }

  .asset .ma_moni .ma_userhead {
    float: left;
    width: 30px;
    height: 30px;
    display: block;
    margin: 0 auto;
    border-radius: 50%;
  }

  .asset .ma_moni .ma_name {
    float: left;
    padding-left: 10px;
    line-height: 30px;
  }

  .asset .trade {
    color: #fff;
    float: right;
    margin-top: 8px;
    font-size: 12px;
    line-height: 30px;
    padding-right: 10px;
  }

  .asset .ma_headCon a {
    display: inline-block;
    width: 90%;
    height: 90%;
  }

  .asset .ma_headCon span {
    width: 100%;
    color: #fff;
    margin-top: 15px;
    font-size: 30px;
    display: block;
  }

  .asset .ma_headCon p {
    width: 100%;
    color: #fff;
    font-size: 12.4px;
    margin-bottom: 15px;
  }

  .asset .ma_conH {
    padding: 10px 10px 15px;
    overflow: hidden;
  }

  .asset .ma_conH ul li .ma_num {
    font-size: 16px;
    line-height: 1.5;
    font-weight: bold;
  }

  .asset .ma_conH ul li .ma_font {
    font-size: 12px;
    line-height: 1.5;
  }

  .asset .ma_conH ul li {
    float: left;
    width: 49%;
    height: 100%;
    text-align: center;
    color: #fff;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-right: 0.5px solid #90b5fe;
  }

  .cashtitle {
    padding: 8px 0;
    border-bottom: 1px solid @ai-line-color;
  }

  .asset .ma_h3 {
    font-size: 16px;
    border-left: 3px solid #ff9900;
    margin-left: 10px;
    padding-left: 10px;
    color: #666;
  }

  .asset .newlist {
    padding: 0 10px;
    background: #fff;
  }

  .asset .newlist h2 {
    padding-left: 30px;
    font-size: 16px;
    font-weight: normal;
  }

  .asset .newlist li {
    padding: 10px 0;
    border-bottom: solid 1px #f2f2f2;
    position: relative;
  }

  .asset .newlist li img {
    width: 8px;
    height: 13px;
    float: right;
  }

  .asset .newlist li span {
    color: #999;
    font-size: 14px;
  }

  .asset .newlist li span:nth-of-type(1) {
    padding-left: 30px;
  }

  .asset .newlist li span:nth-of-type(2) {
    float: right;
    padding-right: 20px;
  }

  .asset .newlist li:nth-of-type(1) h2 {
    background: url(../../static/image/zuhe_icon@2x.png) no-repeat center left;
    background-size: 20px 20px;
  }

  .asset .newlist li:nth-of-type(2) h2 {
    background: url(../../static/image/dingtou_icon@2x.png) no-repeat center left;
    background-size: 20px 20px;
  }

  .asset .newlist li:nth-of-type(3) h2 {
    background: url(../../static/image/celuo_icon@2x.png) no-repeat center left;
    background-size: 20px 20px;
  }

  .asset .newlist li:nth-of-type(4) h2 {
    background: url(../../static/image/youxuan_icon@2x.png) no-repeat center left;
    background-size: 20px 20px;
  }

  .asset .newlist li:nth-of-type(5) h2 {
    background: url(../../static/image/bao_icon@2x.png) no-repeat center left;
    background-size: 20px 20px;
  }

  .weui-grids:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: none;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .asset .xianjinbao {
    padding: 10px;
    overflow: hidden;
    text-align: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }

  .asset .xianjinbao li:nth-of-type(1) {
    flex: 1;
    color: #666;
  }

  .asset .xianjinbao li:nth-of-type(2) {
    flex: 1;
    text-align: center;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;

  }

  .asset .xianjinbao li:nth-of-type(2) .weui-btn {
    flex: 1;
    font-size: 12px;
    margin: 10px;
  }

  .weui-grid {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    padding: 10px 20px;
  }

  .asset .box {
    text-align: left;
    color: #666;
    flex: 1;
    margin-left: 10px;
  }

  .asset .box h2 {
    font-size: 16px;
    margin-bottom: 0;
    margin-top: 0;
  }

  .asset .box p {
    font-size: 14px;
    color: #333;
    margin-bottom: 0;
    margin-top: 0;
  }

  .asset .red {
    color: #ff5e34;
  }

  .asset .green {
    color: #49a04b;
  }

  .flag_arrow {
    position: absolute;
    width: 13px;
    height: 13px;
    top: 50%;
    right: 0px;
    margin-top: -7.5px;
  }
</style>
