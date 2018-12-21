<template>
  <div class="xianjinbao">
    <!--  <div class="adeheader">
       <ul class="adedis5 tdata_bg">
         <li class="adecurr right_line">
           <h3>总金额(元)</h3>
           <span>{{total}}</span>
         </li> -->
    <!--  <li class="adeyester right_line" >
         <h3>昨日收益(元)</h3>
         <span>{{yester}}</span>
     </li> -->
    <!--       <li class="adetotal">
            <h3>累计收益(元)</h3>
            <span class="ma_valueAdd">{{leiji}}</span>
          </li>
        </ul>

      </div> -->
    <div
      style="background: -webkit-linear-gradient(left top, #2c88ff , #1d5ffc); background: linear-gradient(to bottom right, #2c88ff , #1d5ffc);">
      <div class="ma_yetGain">
        <span>{{total}}</span>
        <p>总金额(元)</p>
      </div>
      <section class="ma_conH">
        <ul class="clearfix">
          <li>
            <p>{{leiji}}</p>
            <p>累计收益(元)</p>
          </li>
          <li>
            <p>{{wan}}</p>
            <p>万份收益(元)</p>
          </li>
          <li>
            <p>{{seven}}</p>
            <p>七日年化(%)</p>
          </li>
        </ul>
      </section>
    </div>
    <!--     <div class="adechange">
          <ul class="adechnav1">
            <li><span>更新日期：</span><a class="getdate">{{date1}}</a></li>
          </ul>
          <ul class="adedis6 tdata_bg">
            <li class="qirinian right_line">
              <h3>七日年化(%)</h3>
              <span class="ma_valueAdd">{{seven}}%</span>
            </li>
            <li class="wanshouyi">
              <h3>万份收益(元)</h3>
              <span class="ma_valueAdd">{{wan}}</span>
            </li>
          </ul>
          <ul class="adedis7 tdata_bg" style="border-top: 1px solid #e5e5e5">
            <li>
              <span class="right_line">T+0赎回</span>
            </li>
            <li class="">
              <span>低风险</span>
            </li>
          </ul>
        </div> -->
    <div class="con2">
      <p class="chartTitle">收益率走势图</p>
      <div class="detail-linechart" ref='chartbox'></div>
      <ul class="time">
        <li class="dipper-date" v-for="(item,index) in tabs" :class="{active:index === number}"
            @click='getchartdata(item.suo,index)'>{{item.name}}
        </li>
      </ul>
    </div>
    <tabbar v-transfer-dom>
      <tabbar-item @on-item-click='redeemCash(cashAccountid)'>
        <a slot="label">转出</a>
      </tabbar-item>
      <tabbar-item @on-item-click='cashFundBuy'>
        <a slot="label">转入</a>
      </tabbar-item>
    </tabbar>
  </div>
</template>
<script>
  import {mianUrlt9, mianUrl} from '../vuex/api'
  import HighCharts from 'highcharts'
  import {Toast, Tabbar, TabbarItem, TransferDom, numberComma} from 'vux'
  import {getLocalStorage} from '../vuex/storage'

  export default {
    directives: {
      TransferDom
    },
    data() {
      return {
        tabs: [{name: '近一月', suo: 0}, {name: '近三月', suo: 1}, {name: '近六月', suo: 2}, {name: '成立以来', suo: 6}],
        number: 0,
        total: this.$route.query.total,
        leiji: this.$route.query.profit,
        cashAccountid: this.$route.query.cashAccountid,
        seven: '0.00',
        wan: '0.00',
        date1: '2018-01-01',
        date: ''
      }
    },
    components: {
      Toast,
      Tabbar,
      TabbarItem,
      TransferDom
    },
    mounted() {
      this.getmeg()
      this.getchartdata(0, 0)
      // this.count()
    },
    methods: {
      getmeg() {
        //this.total = this.$route.query.total
        this.$http.post(mianUrlt9 + 'fund/moneyFundLatestIncome', { // 请求参数
          fundCode: '000662.OF'
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.seven = Number(res.data.data.yearlyRoe).toFixed(2)
            this.wan = res.data.data.unitIncome
            this.date1 = res.data.data.navDate
          }
        })
      },
      getchartdata(index, num) {
        this.number = num
        this.$http.post(mianUrlt9 + 'fund/moneyFundIncomeTrendChart', { // 请求参数
          fundCode: '000662.OF',
          timeType: index
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            let date = res.data.data.dateList
            let ben = res.data.data.yearlyRoeList
            for (let i = 0; i < ben.length; i++) {
              ben[i] = Number(ben[i])
            }
            // if(Number(ben[(ben.length - 1)]) < 0){
            //   this.month = 'onemonthlv'
            // }else{
            //   this.month = 'onemonth'
            // }
            // this.changedata1 = (Number(ben[(ben.length - 1)]) > 0 ? '+' + Number(ben[(ben.length - 1)]).toFixed(2) + '%' : Number(ben[(ben.length - 1)]).toFixed(2) + '%')
            // this.changedata2 = (Number(ys[(ys.length - 1)]) > 0 ? '+' + Number(ys[(ys.length - 1)]).toFixed(2) + '%' : Number(ys[(ys.length - 1)]).toFixed(2) + '%')
            this.date = date
            this.ben = ben
            this.interval = parseInt(this.date.length / 3.5)
            this.drawline()
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      cashFundBuy() {  //转入
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
              const msg = res.data.retMsg
              this.$vux.toast.text(msg, 'middle', 3000)
              this.$router.push({
                path: '/component/login',
                query: {path: this.$route.fullPath}
              })
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
        }
      },
      redeemCash(id) {          //转出
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
            type:'24',
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
              const msg = res.data.retMsg
              this.$vux.toast.text(msg, 'middle', 3000)
              this.$router.push({
                path: '/component/login',
                query: {path: this.$route.fullPath}
              })
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
        }
      },
      drawline() {
        let bar = {
          chart: {
            type: 'line', // 指定图表的类型，默认是折线图（line）
            height: 200
          },
          credits: {
            enabled: false
          }, // 去掉地址
          legend: {
            enabled: false
          },
          title: {
            text: null // 指定图表标题
          },
          xAxis: {
            categories: this.date, // 指定x轴分组
            gridLineWidth: 0,
            lineWidth: 1,
            lineColor: '#edf0f4',
            tickInterval: this.interval
          },
          yAxis: {
            labels: {
              enabled: true,
              formatter: function () {
                return this.value + '%'
              }
            },
            title: {
              enabled: false
            },
            visible: true
          },
          plotOptions: {
            column: {
              colorByPoint: true
            },
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
          series: [{ // 指定数据列
            name: '现金宝',
            data: this.ben, // 数据
            color: '#346cdb'
          }]
        }
        let charts = new HighCharts.chart(this.$refs.chartbox, bar)
      }
    }
  }
</script>
<style scoped>
  ol, ul, li {
    list-style: none outside none;
  }

  .xianjinbao .ma_yetGain {
    text-align: center;
    padding: 20px 0;
  }

  .xianjinbao .ma_yetGain a {
    display: inline-block;
    width: 90%;
    height: 90%;
  }

  .xianjinbao .ma_yetGain span {
    color: #fff;
    font-size: 26px;
  }

  .xianjinbao .ma_yetGain p {
    color: #73aefc;
    font-size: 16px;
  }

  .xianjinbao .ma_conH {
    padding: 10px 10px 15px;
    overflow: hidden;
    background: #1a7cf7;
  }

  .xianjinbao .ma_conH ul {
    display: flex;
    display: -webkit-flex;
  }

  .xianjinbao .ma_conH ul li {
    flex: 1;
    text-align: center;
  }

  .xianjinbao .ma_conH ul li p:nth-of-type(1) {
    color: #fff;
    font-size: 16px;
  }

  .xianjinbao .ma_conH ul li p:nth-of-type(2) {
    color: #73aefc;
    font-size: 14px;
  }

  .xianjinbao .con2 .detail-linechart {
    margin-top: 20px;
    padding: 0 10px;
  }

  .xianjinbao .adedis5 {
    padding-top: 20px;
    padding-bottom: 20px;
    overflow: hidden;
    background: #fff;
  }

  .xianjinbao .adedis5 li {
    float: left;
    font-size: 11px;
    width: 49%;
    height: 100%;
    text-align: center;
    color: #333;
    line-height: 16px;
  }

  .xianjinbao .adedis5 li h3 {
    font-size: 14px;
    color: #666;
    margin: 0;
  }

  .xianjinbao .adedis5 li span {
    font-size: 15px;
    display: block;
    margin-top: 10px;
  }

  .xianjinbao .right_line {
    border-right: 1px solid #e5e5e5;
  }

  .xianjinbao .adechange {
    margin-top: 10px;
    background: #fff;
  }

  .xianjinbao .adechange .adechnav1 {
    width: 100%;
    border-bottom: 1px solid #edf0f4;
    overflow: hidden;
  }

  .xianjinbao .adechange .adechnav1 li {
    width: 100%;
    line-height: 30px;
    text-align: left;
    float: left;
    color: #666;
    font-size: 14px;
  }

  .xianjinbao .adechange .adechnav1 li span {
    margin-left: 10px;
  }

  .xianjinbao .adedis6 {
    padding-top: 20px;
    padding-bottom: 20px;
    overflow: hidden;
  }

  .xianjinbao .adedis6 li {
    float: left;
    font-size: 14px;
    width: 49%;
    height: 100%;
    text-align: center;
    color: #333;
    line-height: 16px;
  }

  .xianjinbao .adedis6 li h3 {
    font-size: 14px;
    color: #666;
    margin: 0;
  }

  .xianjinbao .adedis6 li span {
    font-size: 14px;
    display: block;
    margin-top: 10px;
  }

  .xianjinbao .ma_valueAdd {
    font-size: 1.4px;
    color: #ff4b5b;
    text-align: center;
  }

  .xianjinbao .adedis7 {
    overflow: hidden;
    background: #fff;
  }

  .xianjinbao .adedis7 li {
    float: left;
    font-size: 12px;
    width: 49%;
    height: 100%;
    text-align: center;
    color: #999;
    line-height: 16px;
  }

  .xianjinbao .adedis7 li span {
    font-size: 12px;
    display: block;
    margin-top: 5px;
    margin-bottom: 5px;
  }

  .xianjinbao .con2 {
    text-align: center;
    margin-top: 8px;
    background: #fff;
  }

  .xianjinbao .con2 p:nth-of-type(1) {
    padding: 10px 0;
    color: #393939;
    font-size: 16px;
    border-bottom: solid 1px #eaeaea;
  }

  .xianjinbao .con2 .time {
    display: flex;
    display: -webkit-flex;
  }

  .xianjinbao .con2 .time li {
    text-align: center;
    padding: 10px 0;
    border: solid 1px #e9e9e9;
    color: #949496;
    font-size: 12px;
    flex: 1;

  }

  .xianjinbao .con2 .time .active {
    color: #454545;
    border-top: none;
    border-left: none;
    border-right: none;
  }

  .xianjinbao .adeover {
    background: #ff9900;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .xianjinbao .adeover .overul1 {
    width: 100%;
    overflow: hidden;
  }

  .xianjinbao .adeover .overul1 .overli2 {
    width: 49%;
  }

  .xianjinbao .adeover .overul1 li {
    float: left;
    padding-top: 6px;
    padding-bottom: 6px;
    font-size: 16px;
    text-align: center;
    background-color: #f90;
    color: #fff;
  }

  .xianjinbao .adeover .overul1 .overli3 {
    width: 49%;
  }

  .weui-tabbar {
    background: #0e75f6;
  }

  .weui-tabbar .weui-tabbar__item:nth-of-type(1) {
    background: #fff;
  }

  .weui-tabbar .weui-tabbar__item:nth-of-type(1) a {
    color: #0782f9;
  }

  .weui-tabbar .weui-tabbar__label a {
    font-size: 16px;
    color: #fff;
    line-height: 50px;
  }

  .weui-tabbar .weui-tabbar__item:nth-of-type(1) {
    border-right: solid 1px #fff;
  }

</style>
