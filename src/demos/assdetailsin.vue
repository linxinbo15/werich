<template>
  <div style="background:#f3f3f3;" ref='box'>
    <ul class="adedis" ref='box1'>
      <li>
        <h2 :class='{"red": day >= 0,"green":day < 0}'>{{Number(day).toFixed(2)}}</h2>
        <p>日收益(元) </p>
      </li>
      <li>
        <h2>{{Number(chicang).toFixed(2)}}</h2>
        <p>当前持仓(元)</p>
      </li>
      <li>
        <h2 :class='{"red": Number(leiji) >= 0,"green":Number(leiji) < 0}'>{{Number(leiji).toFixed(2)}}</h2>
        <p>累计收益(元)</p>
      </li>
    </ul>
    <div style="margin-top: 10px;">
    <h2 class="chiyouword" ref='box2'>持有情况</h2>
    <div class="zuihou_box1">
      <div class="zuihou_box">
        <div class="zuihou_item">
          <h2>最新净值：</h2>
          <p>{{Number(nav).toFixed(4)}}</p>
        </div>
        <div class="zuihou_item" style="margin-left: 8px;">
          <h2>持有份额(份)：</h2>
          <p>{{Number(hold).toFixed(2)}}</p>
        </div>
      </div>
      <div class="zuihou_box">
        <div class="zuihou_item">
          <h2>成本(元)：</h2>
          <p>{{cost}}</p>
        </div>
        <div class="zuihou_item" style="margin-left: 8px;">
          <h2>累计收益(元)：</h2>
          <p :class='{"red": Number(leiji) >= 0,"green":Number(leiji) < 0}'>{{Number(leiji).toFixed(2)}}</p>
        </div>
      </div>
      <div class="zuihou_box">
        <div class="zuihou_item">
          <h2>参考市值(元)：</h2>
          <p >{{Number(chicang).toFixed(2)}}</p>
        </div>
        <div class="zuihou_item" style="margin-left: 8px;">
          <h2>累计收益率：</h2>
          <p :class='{"adespr red": Number(leijilv) >= 0,"adespr green":Number(leijilv) < 0}'>{{leijilv}}%</p>
        </div>
      </div>
    </div>
    </div>
    <!--<li id="chiyouli2">
      <div class="ademegdivl">
        <span class="adespl">成本(元)：</span>
        <span class="adespr">{{cost}}</span>
      </div>
      <div class="ademegdivr">
        <span class="adespl">累计收益(元)：</span>
        <span :class='{"adespr red": Number(leiji) >= 0,"adespr green":Number(leiji) < 0}'>{{leiji}}</span>
      </div>
    </li>
    <li id="chiyouli3">
      <div class="ademegdivl">
        <span class="adespl">参考市值(元)：</span>
        <span class="adespr">{{chicang}}</span>
      </div>
      <div class="ademegdivr">
        <span class="adespl">累计收益率：</span>
        <span :class='{"adespr red": Number(leijilv) >= 0,"adespr green":Number(leijilv) < 0}'>{{leijilv}}%</span>
      </div>
    </li>
  </div>-->
    <div style="background:#fff;">
      <tab>
        <tab-item selected @on-item-click="select1">交易记录</tab-item>
        <tab-item @on-item-click="select1">每日收益(元)</tab-item>
      </tab>


      <div class="adejilu" v-show="currentIndex === 0">
        <div class="adejilubox" v-for='item in trarecord'>
          <p class="jiludate">
            <span style="font-size:12px;">{{item.date}}</span>
            <br>
          </p>
          <ul class="jilumeg">
            <li>{{item.name}}</li>
            <li>{{item.money}}</li>
            <li class="jiluli">
              <div class="leixing">交易类型：<span>{{item.buiness}}</span></div>
              <div class="zhuangtai">交易状态：<span>{{item.status}}</span></div>
            </li>
          </ul>
        </div>
        <div v-show='trarecord.length == 0' :style="{textAlign:'center',position:'relative',padding:'15px'}">
          <p style="font-size: 14px;color: #ff9900;">暂无交易记录</p>
        </div>
      </div>
      <div class="every" v-show="currentIndex === 1">
        <ul class="meiri" v-for='item in daylist'>
          <li><p class="mrpl" style="text-align: left;">{{item.date}}</p>
            <p :class='{"mrpr red": item.profit >= 0,"mrpr green":item.profit < 0}' style="text-align: right;">{{item.profit}}元</p></li>
        </ul>
        <div v-show='daylist.length == 0' :style="{textAlign:'center',position:'relative',padding:'15px'}">
          <p style="font-size: 14px;color: #ff9900;">暂无每日收益</p>
        </div>
      </div>

    </div>
    <toast v-model="showPositionValue" type="text" :time="800" width="18em" is-show-mask :text="toastText"
           :position="position">{{toastText}}
    </toast>
    <tabbar v-transfer-dom>
      <tabbar-item @on-item-click="convertPrepose">
        <a slot="label">转换</a>
      </tabbar-item>
      <tabbar-item @on-item-click="redeemPrepose">
        <a slot="label">赎回</a>
      </tabbar-item>
      <tabbar-item @on-item-click="buyFundPrepose">
        <span slot="label">追加购买</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>
<script>
  import {mianUrlt9, getBussessName, getstatsName} from '../vuex/api'
  import {Toast, Loading, Tab, TabItem, Confirm, Tabbar, TabbarItem, TransferDom} from 'vux'
  import {getLocalStorage} from '../vuex/storage'

  export default {
    directives: {
      TransferDom
    },
    data() {
      return {
        accountid: this.$route.query.accountid,
        code: this.$route.query.groupid,
        currentIndex: 0,
        fundname: this.$route.query.name,
        fundcode: this.$route.query.groupid,
        id: this.$route.query.id,
        day: '0.00',
        chicang: '0.00',
        leiji: '0.00',
        nav: '0.00',
        hold: '0.00',
        cost: '0.00',
        leijilv: '0.00',
        trarecord: [],
        daylist: [],
        position: 'default',
        toastText: '加入自选成功！',
        showPositionValue: false,
        height: ''
      }
    },
    components: {
      Toast,
      Loading,
      Tab,
      TabItem,
      Confirm,
      Tabbar,
      TabbarItem,
      TransferDom
    },
    mounted() {
      //this.getheight()
      this.getasset()
      this.traderecord()
      this.getday()
    },
    methods: {
      /*getheight() {
        this.height = (this.$refs.box.offsetHeight - this.$refs.box1.offsetHeight - this.$refs.box2.offsetHeight - this.$refs.box3.offsetHeight - 150) + 'px'
      },*/
      showPosition(position) {
        this.position = position
        this.showPositionValue = true
      },
      convertPrepose() {
        // const that = this
        this.$vux.loading.show({
          text: '正在请求'
        })
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
            fundCode: this.fundcode.substring(0, 6),
            type:'36',
            singleOneAssetId: this.id
          }
          this.$http.post(mianUrlt9 + 'fund/beforeSingleSell', obj, {emulateJSON: true}).then((res) => {
            if (res.data.retCode === '0') {
              this.$vux.loading.hide()
              // console.log(res)
              this.$router.push({
                path: '/component/convert-fund',
                query: {
                  availableVol: res.data.data.availableVol,
                  fundName: res.data.data.fundName,
                  fundCode: res.data.data.fundCode,
                  channelId: res.data.data.channelId,
                  redeemMinVol: res.data.data.redeemMinVol,
                  redeemMaxVol: res.data.data.redeemMaxVol,
                  shareType: res.data.data.shareType,
                  taNo: res.data.data.taNo,
                  transactionAccountId: res.data.data.transactionAccountId,
                  singleOneAssetId: this.id
                }
              })
            } else if (res.data.retCode === '990101') {
              this.$vux.loading.hide()
              this.toastText = res.data.retMsg
              this.showPosition('middle')
              this.$router.push({
                path: '/component/login',
                query: {path: this.$route.fullPath}
              })
            } else if (res.data.retCode === '990102') {
              this.$vux.loading.hide()
              this.toastText = res.data.data[0].field + '' + res.data.data[0].message
              this.showPosition('middle')
            } else if (res.data.retCode === '990103') {
              this.$vux.loading.hide()
              this.toastText = '系统正在维护，请稍后再试'
              this.showPosition('middle')
            } else if (res.data.retCode === '990104') {
              this.$vux.loading.hide()
              this.toastText = '服务器内部错误'
              this.showPosition('middle')
            } else {
              this.$vux.loading.hide()
              this.toastText = res.data.retMsg
              this.showPosition('middle')
            }
          })
        }
      },
      redeemPrepose() {
        // const that = this
        this.$vux.loading.show({
          text: '正在请求'
        })
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
            fundCode: this.fundcode.substring(0, 6),
            type:'24',
            singleOneAssetId: this.id
          }
          this.$http.post(mianUrlt9 + 'fund/beforeSingleSell', obj, {emulateJSON: true}).then((res) => {
            if (res.data.retCode === '0') {
              // console.log(res)
              this.$vux.loading.hide()
              this.$router.push({
                path: '/component/redeem-fund',
                query: {
                  availableVol: res.data.data.availableVol,
                  fundName: res.data.data.fundName,
                  fundCode: res.data.data.fundCode,
                  channelId: res.data.data.channelId,
                  redeemMinVol: res.data.data.redeemMinVol,
                  redeemMaxVol: res.data.data.redeemMaxVol,
                  shareType: res.data.data.shareType,
                  taNo: res.data.data.taNo,
                  transactionAccountId: res.data.data.transactionAccountId,
                  singleOneAssetId: this.id
                }
              })
            } else if (res.data.retCode === '990101') {
              this.$vux.loading.hide()
              this.toastText = res.data.retMsg
              this.showPosition('middle')
              this.$router.push({
                path: '/component/login',
                query: {path: this.$route.fullPath}
              })
            } else if (res.data.retCode === '990102') {
              this.$vux.loading.hide()
              this.toastText = res.data.data[0].field + '' + res.data.data[0].message
              this.showPosition('middle')
            } else if (res.data.retCode === '990103') {
              this.$vux.loading.hide()
              this.toastText = '系统正在维护，请稍后再试'
              this.showPosition('middle')
            } else if (res.data.retCode === '990104') {
              this.$vux.loading.hide()
              this.toastText = '服务器内部错误'
              this.showPosition('middle')
            } else {
              this.$vux.loading.hide()
              this.toastText = res.data.retMsg
              this.showPosition('middle')
            }
          })
        }
      },
      buyFundPrepose() {
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
            fundCode: this.fundcode.substring(0, 6)
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
      select1(index) {
        this.currentIndex = index
      },
      getasset() {
        var that = this
        this.$http.post(mianUrlt9 + 'user/singleHoldingDetail', {
          fundCode: this.code,
          transactionAccountId: this.accountid
        },{emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.chicang = Number(res.data.data.fundMarketValue)
            this.day = Number(res.data.data.dayIncome)
            this.leiji = Number(res.data.data.totalIncome)
            this.nav = Number(res.data.data.nav)
            this.hold = res.data.data.holdingVol
            this.cost = res.data.data.costMoney
            this.leijilv = Number(res.data.data.totalIncomeRate).toFixed(2)
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
            var msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      traderecord() {
        this.$http.post(mianUrlt9 + 'user/singleTradeRecord', {
          fundCode: this.code,
          transactionAccountId: this.accountid
        },{emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {}
              obj.date = res.data.data[i].transactionDate
              obj.name = res.data.data[i].fundName
              obj.buiness = getBussessName(res.data.data[i].businessCode)
              obj.status = getstatsName(res.data.data[i].status)
              if (obj.buiness === '赎回' || obj.buiness == '强制调增' || obj.buiness == '强制调减' || obj.buiness == '分红') {
                if (obj.status === '已结束' || obj.status === '已确认' || obj.status === '待复核') {
                  obj.money = res.data.data[i].confirmedVol + '份'
                } else {
                  obj.money = res.data.data[i].applicationVol + '份'
                }
              } else if (obj.buiness === '转换') {
                obj.money = res.data.data[i].transferVol + '份'
              } else {
                if (obj.status === '已结束' || obj.status === '已确认' || obj.status === '已撤' || obj.status === '待复核') {
                  obj.money = res.data.data[i].confirmedAmount + '元'
                } else {
                  obj.money = res.data.data[i].applicationAmount + '元'
                }
              }
              this.trarecord.push(obj)
            }
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      getday() {
        this.$http.post(mianUrlt9 + 'user/getSingleProfitRecord', {
          fundCode: this.code,
          transactionAccountId: this.accountid
        },{emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {}
              obj.date = res.data.data[i].navDate
              obj.profit = Number(res.data.data[i].dailyProfit).toFixed(2)
              this.daylist.push(obj)
            }
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      }
    }
  }
</script>
<style lang='less' scoped>
  @import '../styles/custom.less';

  ol, ul, li {
    list-style: none outside none;
  }

  .adedis {
    padding: 20px 0;
    overflow: hidden;
    background-color: #ffffff;
    border-top: solid 1px @ai-line-color;
    border-bottom: solid 1px @ai-line-color;
  }

  .adedis li {
    float: left;
    width: 33%;
    height: 100%;
    text-align: center;
    border-right: 1px solid @ai-line-color;
  }

  .adedis li h2 {
    font-size: 20px;
  }

  .adedis li p {
    font-size: 12px;
    color: #999999;
  }

  .adedis .red, .sindetail .ademeg .red {
    color: rgb(235, 30, 50);
  }

  .adedis .green, .sindetail .ademeg .green {
    color: green;
  }

  .adedis li span {
    font-size: 18px;
    color: #000;
  }

  .chiyouword {
    font-size: 16px;
    background: #fff;
    padding: 8px 15px;
  }

  .ademeg {
    background: #fff;
    padding-bottom: 10px;
  }

  .ademeg li {
    overflow: hidden;
    padding-top: 5px;
    padding-bottom: 5px;
  }

  .ademeg li div {
    float: left;
  }

  .ademegdivl {
    width: 47%;
    /*border-right: solid 1px #e5e5e5;*/
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }

  .ademegdivl .adespl {
    padding-left: 15px;
    float: left;
    text-align: left;
    flex: 3;
    color: #666;
    font-size: 14px;
  }

  .ademegdivl .adespr {
    padding-right: 10px;
    float: right;
    text-align: right;
    flex: 1;
    color: #000;
    font-size: 14px;
  }

  .ademegdivr {
    width: 47%;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
  }

  .ademegdivr .adespl {
    padding-left: 10px;
    float: left;
    text-align: left;
    flex: 3;
    color: #666;
    font-size: 14px;
  }

  .ademegdivr .adespr {
    padding-left: 10px;
    float: right;
    text-align: right;
    flex: 1;
    color: #000;
    font-size: 14px;
  }

  .ademegdivr .red {
    color: rgb(235, 30, 50);
  }

  .ademegdivr .green {
    color: #07a168;
  }

  .adejilu {
    padding: 10px;
    overflow: hidden;
  }

  .adejilubox {
    overflow: hidden;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: start;
    -webkit-align-items: flex-start;
    align-items: flex-start;
    margin-bottom: 8px;
  }

  .jiludate {
    font-size: 14px;
    text-align: left;
    line-height: 16px;
  }

  .jilumeg {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    border: 1px solid #edf0f4;
    margin-left: 5px;
  }

  .jilumeg li {
    padding-left: 10px;
    padding-right: 10px;
    font-size: 12px;
    padding-top: 5px;
    padding-bottom: 5px;
    color: #444;
    overflow: hidden;
  }

  .jiluli{
    background-color: #edf0f4;
  }

  .jiluli .leixing {
    width: 45%;
    float: left;
    color: #666;
    font-size: 10px;
  }

  .jiluli .zhuangtai {
    width: 55%;
    float: right;
    text-align: right;
    color: #666;
    font-size: 10px;
  }

  .meiri li {
    padding-top: 10px;
    padding-bottom: 10px;
    overflow: hidden;
    border-bottom: solid 1px #edf0f4;
    font-size: 12px;
  }

  .meiri .mrpl {
    width: 50%;
    float: left;
    text-align: center;
  }

  .meiri .mrpr {
    width: 50%;
    float: left;
    text-align: center;
  }

  .red {
    color: #ff1e32;
  }

  .green {
    color: green;
  }

  .adeover {
    background: #fff;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    /*height:45px;*/
  }

  .adeover .overul {
    width: 100%;
    border-top: solid 1px #edf0f4;
    overflow: hidden;
  }

  .adeover .overul li {
    float: left;
    font-size: 14px;
    text-align: center;
    line-height: 40px;
  }

  .adeover .overul .overli1 {
    width: 24%;
  }

  .adeover .overul .overli2 {
    width: 24%;
  }

  .sindetail .adeover .overul .overli3 {
    width: 50%;
    background-color: #0e75f6;
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
    border-right: 1px solid #f2f2f2;
    background-color: #ffffff;
    flex: 1;
  }

  .weui-tabbar__item:nth-child(2) {
    border-right: 1px solid #f2f2f2;
    background-color: #ffffff;
    flex: 2;
  }

  .weui-tabbar__item:nth-child(3) {
    background-color: #0e75f6;
    flex: 2;
  }

  .weui-tabbar__label a {
    font-size: 16px;
    color: #666666;
  }

  .weui-tabbar__label span {
    font-size: 16px;
    color: #ffffff;
  }
  .zuihou_box1{
    padding: 0px 15px 10px 15px;
    background-color: #fff;
    margin-bottom: 10px;
  }

  .zuihou_box {
    padding: 0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    position: relative;
  }

  .vux-tab .vux-tab-item.vux-tab-selected {
    color: @tabbtnColor;
    border-bottom: 3px solid @tabbtnColor;
  }

  .zuihou_item {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    justify-content: space-between;
    -webkit-justify-content: space-between;
    align-items: center;
  }

  .every{
    padding: 10px;
  }

  .zuihou_item h2 {
    font-size: 14px;
    color: #999999;
    line-height: 26px;
    font-weight: normal;
  }

  .zuihou_item p {
    font-size: 14px;
    line-height: 26px;
  }
</style>
