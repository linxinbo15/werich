<template>
  <div class="efund">
    <div class="con1" style="border-top: 1px solid #f2f2f2;">
      <ul class="fund-e asset_content">
        <li>
          <p class="qiri">{{seven}}</p>
          <p>七日年化收益率</p>
        </li>
        <li style="border:none;">
          <p class="wan">{{wan}}</p>
          <p>万份收益</p>
        </li>
      </ul>
      <div class="fundInfo_full">
        <div class="fundInfo_full_box">
          <img src="../assets/ico_regenerate.png">
          <p>基金类型：货币型</p>
        </div>
        <div class="fundInfo_full_box">
          <img src="../assets/ico_time.png">
          <p>更新日期：{{newtime}}</p>
        </div>
      </div>
      <!--<ul class="ul2">
       <li>基金类型：<span class="create">货币型</span></li>
       <li>更新日期：<span class="update">{{newtime}}</span></li>
     </ul>-->
    </div>
    <div class="con2">
      <p class="chartTitle1">收益计算器</p>
      <div class="fund-e-input"><span>买入金额：</span>
        <input type="number" class="money" placeholder="10000.00元" v-model='money'>
      </div>
      <div class="jisuan">
        <a class="jisuanbtn" @click='count()'>计算收益</a>
        <h2>一天收益<span class="result"> {{Number(result).toFixed(2)}}</span> 元</h2>
      </div>
    </div>
    <div class="con2">
      <p class="chartTitle">收益率走势图</p>
      <ul class="time">
        <li class="dipper-date" v-for="(item,index) in tabs" :class="{active:index === number}" @click='getchartdata(item.suo,index)'>{{item.name}}
        </li>
      </ul>
      <div class="series">
        <div class="series_box">
          <a>现金宝</a><span :class="yf > 0 ? 'up':'down'">{{yf_format}}%</span>
        </div>
        <div class="series_box" v-show="ys != ''">
          <a>沪深300</a>
          <span :class="ys > 0 ? 'up':'down'">{{ys_format}}%</span>
        </div>
      </div>
      <div class="detail-linechart" ref='chartbox'></div>
    </div>
    <div class="con-e">
      <ul>
        <li class="htitle yeji">产品介绍<span>现金宝产品优势</span></li>
        <li class="jibenxx" id="JS">
          <div class="column-e clearfix">
            <h2 class="title">创金现金宝</h2>
            <div style="overflow: hidden">
              <div class="column-e-left"><img src="../assets/event/kuaisu.png" class="e-img"></div>
              <div class="column-e-right">
                <h2>低风险、稳收益、快速赎回</h2>
                <span>它可以解决用户活期理财收益低的痛点,现金宝是由创金启富和银华基金合作的货币基金产品</span>
              </div>
            </div>
          </div>
          <div class="column-e clearfix">
            <h2 class="title">收益对比</h2>
            <img src="../assets/event/e-charts.png" class="e-charts">
          </div>
          <div class="column-e clearfix">
            <h2 class="title">优势</h2>
            <ul class="youshi">
              <li><i class="ico4"></i>
                <h2>投资门槛低</h2><span>10元起购</span></li>
              <li><i class="ico3"></i>
                <h2>收益日结</h2><span>存一天，收益一天</span></li>
              <li><i class="ico2"></i>
                <h2>随时提现</h2><span>T+0实时提现</span></li>
              <li><i class="ico1"></i>
                <h2>安全保障</h2><span>民生银行监管</span></li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
    <div class="con-e">
      <ul>
        <li class="htitle zuhe">产品说明<span>产品提示和购买风险说明</span></li>
        <li class="gonggao_read" id="SM">
          <div class="column-e clearfix">
            <h2 class="title">什么是创金现金宝?</h2>
            <div class="e-font">
              <h2>是货币基金快速赎回业务，又称“货币基金D+0赎回”</h2>
              <span>是指投资者在业务开放时间，通过本公司网站代销平台申请货币基金快速赎回业务，经过基金注册登记机构确认后，银华基金管理有限公司为投资者办理基金份额过户到货币基金快速赎回业务专用账户，并向投资者快速垫付与申请份额相对的款项，赎回份额确认后，对应的赎回款用于归还银华基金管理有限公司的已垫付款。</span>
            </div>
          </div>
          <div class="column-e clearfix">
            <h2 class="title">提示</h2>
            <div class="e-font">
              <h2>投资者申购：</h2>
              <span>D日申购份额的投资者，若D日为非交易日，则申请将被视为下一个交易日T日的申购申请，并于T+2日方可进行快速赎回操作。</span>
              <h2>投资者赎回：</h2>
              <span>投资者发起快速赎回申请，对于所持有的银华活钱宝F的基金份额每笔申请份额下限为0.01份。D日赎回，随时到账，投资者的快速赎回申请不得撤销。</span>
            </div>
          </div>
          <div class="column-e clearfix">
            <h2 class="title">风险提示</h2>
            <div class="e-font">
              <span>1. 银华活钱宝货币F（000662）基金以往的经营业绩不代表基金的未来业绩，投资者谨慎操作，风险自担。<br>
2.使用银华活钱宝货币F（000662）快速转出业务时，不排除由于网络或银行业务限制等原因，造成资金未能及时到账，请合理安排您的转出时间。<br>
3.以上提到银华活钱宝货币F（000662）收益率为近7日年化收益率，数据来源万德数据。</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <toast v-model="showPositionValue" type="text" width="18em" :time="800" is-show-mask :text="toastText" :position="position">{{toastText}}
    </toast>
    <tabbar v-transfer-dom>
      <tabbar-item badge=" " @on-item-click="cashFundBuy">
        <!--<img slot="icon" src="../assets/demo/icon_nav_cell.png">-->
        <span slot="label">立即购买</span>
      </tabbar-item>
    </tabbar>
    <!--<ul class="e-btn">
      <li class="ljbuy" @click="cashFundBuy">立即购买</li>
    </ul>-->
  </div>
</template>
<script>
import { mianUrl, mianUrlt9 } from '../vuex/api'
import HighCharts from 'highcharts'
import { Toast, TransferDom, Tabbar, TabbarItem } from 'vux'
import { getLocalStorage } from '../vuex/storage'
import { buyAllFund } from '../common/buyAllFund'

export default {
  directives: {
    TransferDom
  },
  data() {
    return {
      tabs: [{ name: '近一月', suo: 0 }, { name: '近三月', suo: 1 }, { name: '近六月', suo: 2 }, { name: '成立以来', suo: 6 }],
      number: 0,
      ben: '',
      date: '',
      interval: '',
      seven: '',
      wan: '',
      newtime: '',
      money: '',
      result: '',
      yf: '',
      yf_format: '',
      ys: '',
      ys_format: '',
      position: 'default',
      toastText: '加入自选成功！',
      showPositionValue: false
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
    this.count()
  },
  methods: {
    showPosition(position) {
      this.position = position
      this.showPositionValue = true
    },
    cashFundBuy() {
      buyAllFund('000662', this)
    },
    count() {
      this.result = parseFloat(this.wan) * (parseFloat(this.money) / 10000)
    },
    getmeg() {
      this.$http.post(mianUrlt9 + 'fund/moneyFundLatestIncome', { // 请求参数
        fundCode: '000662.OF'
      }, { emulateJSON: true }).then((res) => {
        if (res.data.retCode === '0') {
          // this.newtime = this.gettime(res.data.data[0].fInfoEnddate)
          this.newtime = res.data.data.navDate
          this.wan = Number(res.data.data.unitIncome).toFixed(2)
          this.seven = this.zhuanhuan(res.data.data.yearlyRoe)
          this.result = parseFloat(this.wan) * (10000 / 10000)
        }
      })
    },
    gettime(time) {
      if (time == null || time.length !== 8) {
        return ''
      } else {
        let yyyy = time.substring(0, 4)
        let mm = time.substring(4, 6)
        let dd = time.substring(6, 8)
        return yyyy + '-' + mm + '-' + dd
      }
    },
    zhuanhuan(string) {
      let string1 = Number(string).toFixed(2) + '%'
      return string1
    },
    getchartdata(index, num) {
      this.number = num
      this.$http.post(mianUrlt9 + 'fund/moneyFundIncomeTrendChart', { // 请求参数
        fundCode: '000662.OF',
        timeType: index
      }, { emulateJSON: true }).then((res) => {
        if (res.data.retCode === '0') {
          let date = res.data.data.dateList
          let ben = res.data.data.yearlyRoeList
          for (let i = 0; i < ben.length; i++) {
            ben[i] = Number(ben[i])
          }
          this.yf = Number(res.data.data.yearlyRoeList[(res.data.data.yearlyRoeList.length - 1)]).toFixed(2)
          this.yf_format = this.yf > 0 ? '+' + this.yf : this.yf
          this.date = joinData(date)
          this.ben = ben
          this.interval = parseInt(this.date.length / 3.5)
          this.drawline()
        } else {
          const msg = res.data.retMsg
          this.$vux.toast.text(msg, 'middle', 3000)
        }
      })
    },
    drawline() {
      let bar = {
        chart: {
          renderTo: 'detail-linechart',
          type: 'line',
          backgroundColor: '#fff',
          height: 200
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
            formatter: function() {
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
            formatter: function() {
              return this.value + '%'
            }
          },
          title: {
            enabled: false
          },
          visible: true
        },
        tooltip: {
          pointFormat: '{series.name}-收益率：{point.y}%',
          crosshairs: 1
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
          name: '现金宝',
          data: this.ben,
          color: '#ff5e34'
        }]
      }
      let charts = new HighCharts.chart(this.$refs.chartbox, bar)
    }
  }
}

function joinData(data) {
  if (data == null) {
    data = ''
  } else {
    for (let i = 0; i < data.length; i++) {
      let n = ''
      if (data[i].substring(4, 5) === '-') {
        n = data[i]
      } else {
        n = data[i].substring(0, 4) + '-' + data[i].substring(4, 6) + '-' + data[i].substring(6, data[i].length)
      }
      // console.log(n);
      data[i] = n
    }
  }
  return data
}

</script>
<style lang='less' scoped>
@import '../styles/custom.less';

ol,
ul,
li {
  list-style: none outside none;
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

.series_box {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  text-align: center;
}

.series_box a {
  font-size: 13px;
  color: #222222;
}

.series_box span {
  font-size: 13px;
  display: inline-block;
  margin-left: 5px;
}

.up {
  color: @redfont;
}

.down {
  color: @greenfont;
}

.fundInfo_full {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  margin-top: 5px;
}

.fundInfo_full_box {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}

.right_line {
  border-right: 1px solid #f2f2f2;
}

.fundInfo_full_box img {
  width: 16px;
  height: 16px;
}

.fundInfo_full_box p {
  font-size: 13px;
  margin-left: 10px;
}

.efund {
  .con1 {
    padding: 10px;
    background: #fff;
    .fund-e {
      overflow: hidden;
      border-bottom: solid 1px #f2f2f2;
      padding-bottom: 15px;
      li {
        float: left;
        width: 49%;
        text-align: center;
        border-right: solid 1px #f2f2f2;
        p:nth-of-type(1) {
          font-size: 28px;
          color: #ff3300;
        }
        p:nth-of-type(2) {
          font-size: 12px;
          color: #666;
        }
      }
    }
  }
  .con2 {
    text-align: center;
    margin-top: 8px;
    background: #fff;
    padding: 10px;
    p:nth-of-type(1) {
      padding: 8px 0;
      color: #222222;
      font-size: 18px;
    }
    .fund-e-input {
      background-color: #edf0f4;
      height: 35px;
      border-radius: 5px;
      padding: 5px 10px;
      span {
        display: block;
        width: 30%;
        float: left;
        font-size: 15px;
        line-height: 12.5px;
        text-align: left;
        margin-top: 10px;
      }
      input {
        float: right;
        width: 60%;
        height: 15px;
        text-align: right;
        border: none;
        outline: none;
        background-color: #edf0f4;
        margin-top: 10px;
      }
    }
    .time {
      overflow: hidden;
      li {
        float: left;
        padding: 4px 0;
        width: 24%;
        border: solid 1px #e5e5e5;
        color: #666;
        font-size: 10px;
        margin-right: -1px;
      }
      .active {
        background: #0e75f6;
        color: #fff;
        border: solid 1px #0e75f6;
      }
    }
    .jisuan {
      margin-top: 10px;
      overflow: hidden;
      a {
        float: left;
        width: 30%;
        height: 36px;
        background-color: #ff3300;
        color: #fff;
        display: block;
        border-radius: 5px;
        font-size: 14px;
        line-height: 36px;
      }
      h2 {
        width: 50%;
        float: right;
        text-align: right;
        font-size: 14px;
        height: 30px;
        line-height: 30px;
        font-weight: normal;
        span {
          color: #ff3300;
          font-size: 24px;
        }
      }
    }
  }
  .con-e {
    margin-top: 8px;
    background: #fff;
    padding: 10px;
    .htitle {
      font-size: 16px;
      border-bottom: solid 1px #F0F0F0;
      color: #222222;
      line-height: 40px;
      span {
        font-size: 14px;
        color: #666666;
        float: right;
      }
    }
    .column-e {
      padding: 10px 0;
      background-color: #fff;
      border-bottom: 1px solid #f2f2f2;
      .title {
        font-size: 16px;
        color: #333;
        font-weight: bold;
        text-align: center;
        line-height: 40px;
      }
      .column-e-left {
        float: left;
        width: 40%;
        .e-img {
          display: block;
          width: 100%;
          height: auto;
          margin: 10px auto 0 auto;
        }
      }
      .column-e-right {
        margin-left: 40%;
        h2 {
          font-size: 16px;
          color: #222222;
          font-weight: normal;
          margin-top: 20px;
        }
        span {
          font-size: 14px;
          color: #666666;
          line-height: 2;
        }
      }
      .e-charts {
        display: block;
        width: 100%;
        height: auto;
        margin: 0 auto;
      }
      .youshi {
        overflow: hidden;
        li {
          float: left;
          width: 25%;
          overflow: hidden;
          h2 {
            text-align: center;
            color: #222222;
            font-size: 16px;
            font-weight: bold;
            margin-top: 10px;
          }
          span {
            text-align: center;
            color: #666666;
            font-size: 12px;
            display: block;
            margin-top: 5px;
          }
          .ico4 {
            display: block;
            margin: 0 auto;
            width: 45px;
            height: 50px;
            background: url(../assets/event/e-ico4.png) no-repeat center center;
            background-size: 100% auto;
          }
          .ico3 {
            display: block;
            margin: 0 auto;
            width: 45px;
            height: 50px;
            background: url(../assets/event/e-ico3.png) no-repeat center center;
            background-size: 100% auto;
          }
          .ico2 {
            display: block;
            margin: 0 auto;
            width: 45px;
            height: 50px;
            background: url(../assets/event/e-ico2.png) no-repeat center center;
            background-size: 100% auto;
          }
          .ico1 {
            display: block;
            margin: 0 auto;
            width: 45px;
            height: 50px;
            background: url(../assets/event/e-ico1.png) no-repeat center center;
            background-size: 100% auto;
          }
        }
      }
      .e-font {
        h2 {
          font-size: 16px;
          color: #333333;
          margin: 0 0 10px 0;
          font-weight: normal;
        }
        span {
          font-size: 14px;
          color: #999999;
          line-height: 2;
          margin-bottom: 10px;
          display: block;
        }
      }
    }
  }
  .e-btn {
    width: 100%;
    overflow: hidden;
    position: fixed;
    bottom: 0;
    left: 0;
    background: #fff;
    border-top: solid 1px #F0F0F0;
    li {
      width: 100%;
      float: left;
      line-height: 48px;
      text-align: center;
      color: #fff;
      font-size: 16px;
      background-color: #ff9900;
    }
  }
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
  border-right: 1px solid @ai-line-color;
  background-color: #0e75f6;
  flex: 1;
}

.weui-tabbar__label a {
  font-size: 16px;
  color: #666666;
}

.weui-tabbar__label span {
  font-size: 16px;
  color: #ffffff;
}

</style>
