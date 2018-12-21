<template>
  <div>
    <div class="invest_banner">
      <img src="../assets/invest/investbg.jpg" class="invest_bg"/>
    </div>
    <div class="select_plan">
      <swiper :aspect-ratio="310/640" style="width:96%;margin:0 auto;" auto @on-index-change="onSwiperItemIndexChange"
              v-model="swiperItemIndex">
        <swiper-item class="swiper-demo-img">
          <img src="../assets/invest/plan_1.jpg" @click="goInvestDetail('A')">
        </swiper-item>
        <swiper-item class="swiper-demo-img">
          <img src="../assets/invest/plan_2.jpg" @click="goInvestDetail('B')">
        </swiper-item>
        <swiper-item class="swiper-demo-img">
          <img src="../assets/invest/plan_3.jpg" @click="goInvestDetail('C')">
        </swiper-item>
        <swiper-item class="swiper-demo-img">
          <img src="../assets/invest/plan_4.jpg" @click="goInvestDetail('D')">
        </swiper-item>
        <swiper-item class="swiper-demo-img">
          <img src="../assets/invest/plan_c.jpg" @click="goInvestDetail('E')">
        </swiper-item>
      </swiper>
    </div>
    <div class="fundChart">
      <h2>智能定投金额走势</h2>
      <!--<button-tab>
        <button-tab-item @on-item-click="consoleIndex(0)">近一月</button-tab-item>
        <button-tab-item @on-item-click="consoleIndex(1)">近三月</button-tab-item>
        <button-tab-item @on-item-click="consoleIndex(2)">近半年</button-tab-item>
        <button-tab-item selected @on-item-click="consoleIndex(3)">近一年</button-tab-item>
      </button-tab>-->
      <div class="tu_box">
        <div class="tu_boxs">
          <a>累计定投成本:</a><span>{{totalCost}}元</span>
        </div>
      </div>
      <div class="tu_box">
        <div class="tu_boxs">
          <a>定投周期:</a><span>每周</span>
        </div>
        <div class="tu_boxs">
          <a>定投期数:</a><span>{{times}}期</span>
        </div>
      </div>
      <div class="tu_box">
        <div class="tu_boxs">
          <a>沪深300收益率:</a><span :class="normalReturnRate > 0 ? 'up':'down'">{{normalReturnRate}}%</span>
        </div>
        <div class="tu_boxs">
          <a>智能定投收益率:</a><span :class="returnRate > 0 ? 'up':'down'">{{returnRate}}%</span>
        </div>
      </div>
      <div class="series">
        <div class="series_box">
          <a>定投沪深300市值:</a><span class="up">{{yN_format}}元</span>
        </div>
        <div class="series_box">
          <a>智能定投市值:</a><span class="up">{{yA_format}}元</span>
        </div>
      </div>
      <div ref='chartbox' style="margin-top: 5px;width: 100%;"></div>
      <p class="endfont">注：上述收益率，非简单成本收益方式的收益率，而是考虑每期定投现金流入的时间价值后，计算年金定投方式的收益率。</p>
    </div>
    <div class="invest_content">
      <div class="invest_item">
        <div class="invest_img"><img src="../assets/invest/ivtitle1.jpg"></div>
        <div class="chart_box"><img src="../assets/invest/ivcontent1.png"/></div>
      </div>
    </div>

    <div class="invest_content">
      <div class="invest_item">
        <div class="invest_img"><img src="../assets/invest/ivtitle2.jpg"></div>
        <div class="chart_box">
          <img src="../assets/invest/ivcontent11.png"/>
        </div>
        <div class="chart_box">
          <h2>普通投资</h2>
          <p>追涨杀跌，身心俱疲</p>
          <img src="../assets/invest/putong_chart.jpg"/>
        </div>
        <div class="chart_box">
          <h2>智能定投</h2>
          <p>骑牛躲熊，精准择时</p>
          <img src="../assets/invest/ai_chart.jpg"/>
        </div>
      </div>
    </div>
    <div class="invest_content">
      <div class="invest_item">
        <div class="invest_img"><img src="../assets/invest/ivtitle3.jpg"></div>
        <div>
          <swiper :aspect-ratio="290/713" auto style="width:98%;margin:0 auto;">
            <swiper-item class="swiper-demo-img">
              <a href=""><img src="../assets/invest/story1.jpg"></a>
            </swiper-item>
            <swiper-item class="swiper-demo-img">
              <a href=""><img src="../assets/invest/story2.jpg"></a>
            </swiper-item>
            <swiper-item class="swiper-demo-img">
              <a href=""><img src="../assets/invest/story3.jpg"></a>
            </swiper-item>
          </swiper>
        </div>
        <div class="smallfont">注：以收益率最高的产品来计算，预计收益率仅供参考，不代表实际收益。</div>
      </div>
    </div>
    <div class="invest_content">
      <div class="invest_item">
        <div class="invest_img"><img src="../assets/invest/ivtitle4.jpg"></div>
        <div class="invest_img100"><img src="../assets/invest/tudui.jpg"/></div>
      </div>
    </div>
    <tabbar v-transfer-dom>
      <tabbar-item badge=" " @on-item-click="goInvest()">
        <!--<img slot="icon" src="../assets/demo/icon_nav_cell.png">-->
        <span slot="label">开启梦想计划</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<i18n>
  set bar-active-color:
  zh-CN: 设置bar颜色
</i18n>

<script>
  import {XInput, Box, Group, XButton, Swiper, SwiperItem, Tabbar, TabbarItem, TransferDom, ButtonTab, ButtonTabItem } from 'vux'
  import {getLocalStorage,setLocalStorage} from '../vuex/storage'
  import {mianUrlt9} from '../vuex/api'
  import Highcharts from 'highcharts'
  import numberComma from '../tools/number/comma'

  export default {
    directives: {
      TransferDom
    },
    components: {
      XInput,
      Group,
      Box,
      XButton,
      Swiper,
      SwiperItem,
      Tabbar,
      TabbarItem,
      ButtonTab,
      ButtonTabItem,
      TransferDom
    },
    data () {
      return {
        plan: 'A',
        swiperItemIndex: 0,
        xTradeDateList: [],
        yNormalAIList: [],
        yMonetaryAIList: [],
        yAI0001List: [],
        yN_format: '',
        yN: '',
        yM: '',
        yM_format: '',
        yA: '',
        yA_format: '',
        times: '',
        normalReturnRate:'',
        returnRate: '',
        totalCost: ''
      }
    },
    methods: {
      change (val) {
        console.log('on change', val)
      },
      adminLogin() {
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
              if (res.data.data.weiXinHeadImgUrl === undefined || res.data.data.weiXinHeadImgUrl == null) {
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
            }
            resolve(res)
          }).catch(error => {
            reject(error)
          })
          //})
        })
        return p
      },
      consoleIndex (val) {
        this.getGroupnav(val)
      },
      goInvest () {
        this.$vux.loading.show({text: '正在请求'})
        this.adminLogin().then((res) => {
          //console.log(res)
          if (res.data.retCode === '0') {
            const that = this
            if (getLocalStorage('isopen') == '0') { // 未开户
              /*this.$router.push({
                path: '/component/account',
                query: {path: this.$route.path}
              })*/
              this.$vux.confirm.show({
                title: '尚未开户',
                content: '基金交易前，需要您先开通基金账户！',
                onShow () {
                  console.log('plugin show')
                },
                onHide () {
                  console.log('plugin hide')
                },
                onCancel () {
                  that.$router.push({path: '/component/login', query: {path: that.$route.fullPath}})
                },
                onConfirm () {
                  that.$router.push({path: '/component/account', query: {path: that.$route.fullPath}})
                }
              })
            } else if (getLocalStorage('riskLevel') == null || getLocalStorage('riskLevel') == '') { // 未做风险测评
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
              this.$vux.loading.hide()
              this.$router.push({
                path: '/component/invest-step',
                query: {plan: this.plan}
              })
            }
          } else if (res.data.retCode === '990101') {
            this.$vux.loading.hide()
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
            })
          } else {
            this.$vux.loading.hide()
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
            })
          }
        })
      },
      goInvestDetail(plan) {
        this.$vux.loading.show({text: '正在请求'})
        this.adminLogin().then((res) => {
          //console.log(res)
          if (res.data.retCode === '0') {
            const that = this
            if (getLocalStorage('isopen') == '0') { // 未开户
              this.$router.push({
                path: '/component/account',
                query: {path: this.$route.path}
              })
            } else if (getLocalStorage('riskLevel') == null || getLocalStorage('riskLevel') == '') { // 未做风险测评
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
              this.$vux.loading.hide()
              this.$router.push({
                path: '/component/invest-step',
                query: {plan: this.plan}
              })
            }
          } else if (res.data.retCode === '990101') {
            this.$vux.loading.hide()
            this.$router.push({
              path: '/component/login',
              query: {path: this.plan}
            })
          } else {
            this.$vux.loading.hide()
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
            })
          }
        })
      },
      onSwiperItemIndexChange (index) {
        /* console.log('demo item change', index) */
        if (index === 0) {
          this.plan = 'A'
        } else if (index === 1) {
          this.plan = 'B'
        } else if (index === 2) {
          this.plan = 'C'
        } else if (index === 3) {
          this.plan = 'D'
        } else if (index === 4) {
          this.plan = 'E'
        } else {
          this.plan = 'A'
        }
      },
      getGroupnav (val) {
        let obj1 = {startType: val}
        this.$http.post(mianUrlt9 + '/fund/autoInvestPlanChart', obj1, {emulateJSON: true}).then(({data}) => {
          console.log(data)
          if (data.retCode === '0') {
            let ynormalAIList = data.data.ynormalAIList
            //let yMonetaryAIList = data.data.ymonetaryAIList
            let yAI0001List = data.data.yai0001List
            for (let i = 0; i < ynormalAIList.length; i++) {
              ynormalAIList[i] = Number(ynormalAIList[i])
            }
            /*for (let i = 0; i < yMonetaryAIList.length; i++) {
              yMonetaryAIList[i] = Number(yMonetaryAIList[i])
            }*/
            for (let i = 0; i < yAI0001List.length; i++) {
              yAI0001List[i] = Number(yAI0001List[i])
            }
            this.yN = numberComma(Number(data.data.ynormalAIList[(data.data.ynormalAIList.length - 1)]).toFixed(0))
            this.yN_format = this.yN > 0 ?  + this.yN : this.yN
            /*this.yM = Number(data.data.ymonetaryAIList[(data.data.ymonetaryAIList.length - 1)]).toFixed(2)
            this.yM_format = this.yM > 0 ?  + this.yM : this.yM*/
            this.yA = numberComma(Number(data.data.yai0001List[(data.data.yai0001List.length - 1)]).toFixed(0))
            this.yA_format = this.yA > 0 ?  + this.yA : this.yA
            this.yNormalAIList = ynormalAIList
            this.times = Number(data.data.periodNumList[(data.data.periodNumList.length - 1)]).toFixed(0)
            this.normalReturnRate = (Number(data.data.normalReturnRateList[(data.data.normalReturnRateList.length - 1)])*100).toFixed(2)
            this.returnRate = (Number(data.data.returnRateList[(data.data.returnRateList.length - 1)])*100).toFixed(2)
            this.totalCost = numberComma((Number(data.data.totalCostList[(data.data.totalCostList.length - 1)])).toFixed(0))
            //this.yMonetaryAIList = yMonetaryAIList
            this.yAI0001List = yAI0001List
            this.date = data.data.xtradeDateList
            this.interval = parseInt(data.data.ynormalAIList.length / 5)
            // this.textZ = '七日年化收益'
            this.drawline()
          }
        })
      },
      drawline () {
        // console.log(this.getFundnavData)
        let bar = {
          chart: {
            renderTo: 'detail-linechart',
            type: 'line',
            backgroundColor: '#fff',
            height: 270
            /* events: {
                load: function(){
                    //this.Tooltip = new Highcharts.Tooltip(this, this.options.tooltip);
                    Highcharts.myTooltip.refresh(Highcharts.series[0].data[Highcharts.series[0].data.length]);
                }
            } */

          },
          title: {
            text: null
          },
          xAxis: {
            categories: this.date,
            labels: {
              enabled: true,
              formatter: function () {
                return this.value
              }
            },
            gridLineWidth: 0,
            lineWidth: 1,
            lineColor: '#edf0f4',
            tickInterval: this.interval
            // 间隔使用长度/5
          },
          legend: {
            enabled: false
          },
          credits: {
            enabled: false
          },
          yAxis: {
            labels: {
              enabled: true,
              formatter: function () {
                return numberComma(this.value) + '元'
              }
            },
            title: {
              enabled: false
            },
            visible: true
          },
          tooltip: {
            //pointFormat: '{series.name}: <b>{point.y:,.2f}</b>',
            //shared: true
            formatter:function(){
              return this.point.category + '<br>' + this.point.series.name + ': <b>' + numberComma(Number(this.point.options.y).toFixed(2)) + '元</b>';
            }
          },
          plotOptions: {
            line: {
              marker: {
                enabled: false,
                symbol: 'circle',
                radius: 2,
                states: {
                  hover: {
                    enabled: true
                  }
                }
              }
            }
          },
          series: [{
            name: '沪深300定投',
            data: this.yNormalAIList,
            color: '#3ca5e6'
          }, {
            name: '智能定投',
            data: this.yAI0001List,
            color: '#ff5e34'
          }]
        }
        let charts = new Highcharts.chart(this.$refs.chartbox, bar)
      }
    },
    mounted () {
      this.getGroupnav(3)
      // this.getIndex = () => {
      // console.log(222)
      // this.indexList = getIndexAll()
      // console.log(this.demo01_list)
      // }
    }
  }

</script>

<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/center.less';
  @import '../styles/custom.less';

  .invest_banner {
    position: relative;
  }

  .invest_bg {
    display: block;
    width: 100%;
    height: auto;
  }

  .invest_content {
    margin-top: 10px;
    background-color: #ffffff;
  }

  .invest_box {
    width: 66.67%;
    margin: 0 auto 15px auto;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .invest_box_img {
    width: 56px;
    height: 56px;
  }

  .invest_box_right {
    flex: 1;
    margin-left: 10px;
  }

  .invest_box_right h2 {
    font-size: 16px;
    color: #222222;
  }

  .invest_box_right span {
    display: block;
    font-size: 14px;
    color: #999999;
    line-height: 1.4;
  }

  .invest_item {
    padding: 20px 10px 20px 10px;
  }

  .invest_img {
    margin-bottom: 10px;
  }

  .invest_img100 img {
    display: block;
    width: 100%;
    height: auto;
    margin: 10px auto;
  }

  .invest_img img {
    display: block;
    width: 66.67%;
    height: auto;
    margin: 0 auto;
  }

  .chart_box {
    margin: 15px;
  }

  .chart_gushi {
    margin: 15px 15px 30px 15px;
  }

  .chart_box h2 {
    font-size: 20px;
    color: #ffa014;
    text-align: center;
  }

  .chart_box p {
    font-size: 16px;
    color: #666666;
    text-align: center;
  }

  .chart_box img {
    display: block;
    width: 100%;
    height: auto;
    margin-top: 10px;
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

  .fundChart {
    margin-top: 10px;
    padding: 15px 10px;
    background-color: #fff;
  }

  .fundChart h2 {
    font-size: 18px;
    text-align: center;
    font-weight: normal;
    margin-bottom: 8px;
  }

  .series {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    margin-top: 5px;
  }
  .tu_box{
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    margin-top: 5px;
  }

  .tu_boxs {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: left;
  }

  .tu_boxs a {
    font-size: 12px;
    color: #222222;
  }

  .tu_boxs span {
    font-size: 12px;
    display: inline-block;
    margin-left: 5px;
  }
  .tu_boxs::before {
    display: inline-block;
    content: "";
    width: 10px;
    height: 10px;
    background: #FFBE00;
    border-radius: 50%;
    margin-right: 4px;
  }

  .series_box {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: left;
  }

  .series_box a {
    font-size: 12px;
    color: #222222;
  }

  .series_box span {
    font-size: 12px;
    display: inline-block;
    margin-left: 5px;
  }

  .series_box::before {
    display: inline-block;
    content: "";
    width: 10px;
    height: 10px;
    background: #3ca5e6;
    border-radius: 50%;
    margin-right: 6px;
  }

  .series_box:nth-child(2):before {
    background: #ff5e34;
  }

  .endfont {
    color: #999999;
    font-size: 12px;
  }

  .up {
    color: @redfont;
  }

  .down {
    color: @greenfont;
  }

  .vux-button-group > a.vux-button-group-current {
    color: @tabbtnFontColor;
    background: @tabbtnColor;
  }

  .smallfont {
    font-size: 14px;
    color: #999999;
    line-height: 1.5;
  }
</style>
