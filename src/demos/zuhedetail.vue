<template>
  <div class='zuhe_detail' style="background:#F2F2F2;height:100%;">
    <div :style="{marginBottom:'60px',marginTop:'10px'}">
      <div class='test_result'>
        <div id="leida" ref='leida'></div>
        <div class="result" @click="reassessment">重新测评</div>
      </div>
      <div class="test_grade_ai">
      <div class="groupCode">{{groupname}}</div>
        <div class="grade">
          <h2>{{shouyi}}</h2>
          <p>历史年化收益</p>
        </div>
        <div class='dtj' :style='{left:dis}'></div>
        <range :step="1" :range-bar-height="5" :min="1" :max="10" v-model='rangevalue' :style="{marginRight: '20px',marginLeft: '20px',marginTop:'35px'}" @on-change="rangevalueChange">
          <div slot="start">1</div>
          <div slot="end">10</div>
        </range>
        <div class="gradeline_end">
          <div class="gradetext">风险等级:<a style="color:#FF5B28">{{level}}</a>级</div>
        </div>
      </div>
      <div class="test_grade_ai">
        <!-- <div class="groupCode">组合名称：{{groupname}}</div> -->
        <ul class="z_scale">
          <li class="span1"> 投资标的</li>
          <li class="span2">比例</li>
        </ul>
        <ul class="prop" v-for='item in biaodi'>
          <li @click="goFundDetail(item.fundname,item.fundCode,item.fundType)">
            <h2>{{item.fundname}}({{item.daima}})</h2><span>{{item.bili}}%</span>
            <div class="dtline" :style='{width:item.bili+"%"}'></div>
          </li>
        </ul>
      </div>
      <div class="con2">
        <p class="chartTitle">收益率走势图</p>
        <!-- <ul class="time">
          <li class="dipper-date" v-for="(item,index) in tabs" :class="{active:index == number}"
              @click='getchartdata1(item.suo, index)'>{{item.name}}
          </li>
        </ul> -->
      <button-tab>
        <button-tab-item selected @on-item-click="getchartdata1(6, 0)">成立以来</button-tab-item>
        <button-tab-item @on-item-click="getchartdata1(1, 1)">一季</button-tab-item>
        <button-tab-item @on-item-click="getchartdata1(2, 2)">半年</button-tab-item>
        <button-tab-item @on-item-click="getchartdata1(3, 3)">一年</button-tab-item>
      </button-tab>
        <ul class="detail-title">
          <li class="dipper-line-title">本产品<a class="group_data"></a><span class="dipper-increase" :class="changedata3>0?'up':'down'">{{changedata1}}</span>
          </li>
          <li class="dipper-line-title" id="hs300">业绩基准<span class="dipper-hs300" :class="changedata4>0?'up':'down'">{{changedata2}}</span></li>
        </ul>
        <p class="p2" v-show="level==1">业绩基准：90%中证全债指数+10%沪深300指数</p>
        <p class="p2" v-show="level==2">业绩基准：80%中证全债指数+20%沪深300指数</p>
        <p class="p2" v-show="level==3">业绩基准：70%中证全债指数+30%沪深300指数</p>
        <p class="p2" v-show="level==4">业绩基准：60%中证全债指数+40%沪深300指数</p>
        <p class="p2" v-show="level==5">业绩基准：50%中证全债指数+50%沪深300指数</p>
        <p class="p2" v-show="level==6">业绩基准：40%中证全债指数+60%沪深300指数</p>
        <p class="p2" v-show="level==7">业绩基准：30%中证全债指数+70%沪深300指数</p>
        <p class="p2" v-show="level==8">业绩基准：20%中证全债指数+80%沪深300指数</p>
        <p class="p2" v-show="level==9">业绩基准：10%中证全债指数+90%沪深300指数</p>
        <p class="p2" v-show="level==10">业绩基准：100%沪深300指数</p>
        <div ref='chartbox1'></div>
        <p class="p3">温馨提示：智能组合过往业绩并不代表未来收益</p>
      </div>
      <div class="function">
        <ul class="z_tab">
          <li v-for="(item,index) in Ztab" :class="{select:index === currentIndex}" @click="select1(index)">{{item}}
          </li>
        </ul>
      </div>
      <div class="functiontext1" v-show="currentIndex === 0">{{des}}</div>
      <div class="functiontext1" v-show="currentIndex === 1">
        <p style="font-weight: 600;font-size:14px;line-height: 28px;background: #fff;padding-left:10px;">状态及时间</p>
        <h3 style="padding-left:10px;font-size: 12px;line-height: 24px;background-color:#f2f2f2;">买入</h3>
        <ul class="trade_in z_oul">
          <li>
            <span>1提交申购申请</span>
            <span>T日15:00点之前</span>
          </li>
          <li>
            <span>2确认份额</span>
            <span>T+2日内</span>
          </li>
          <li>
            <span>3查看收益</span>
            <span>T+3日内</span>
          </li>
        </ul>
        <h3 style="padding-left:10px;font-size: 12px;line-height: 24px;background-color:#f2f2f2;">卖出</h3>
        <ul class="trade_out z_oul trade_in">
          <li>
            <span>1提交赎回申请</span>
            <span>T日15:00点之前</span>
          </li>
          <li>
            <span>2确认份额</span>
            <span>T+2日内</span>
          </li>
          <li>
            <span>3资金到账</span>
            <span>T+9日内</span>
          </li>
          <li style="background-color:#fff;">
            注：T日为交易日，15:00之后的交易顺延一个交易日。
          </li>
        </ul>
        <h3 style="padding-left:10px;font-size: 14px;line-height: 30px;background-color: #fff;">费率</h3>
        <ul class="trade_details z_oulB trade_in">
          <li class="z_bIn" style="background-color:#f2f2f2;">
            买入
          </li>
          <li class="z_bD">
            买入费用=（单只基金申购金额*申购费率）之和
          </li>
          <li class="z_bIn" style="background-color:#f2f2f2;">
            卖出
          </li>
          <li class="z_bD">
            卖出费用=（单只基金赎回金额*赎回费率）之和
          </li>
          <li class="z_bZ">
            注：单只基金的费率可以参照基金详情页费率
          </li>
        </ul>
      </div>
      <div class="functiontext1 agreements" v-show="currentIndex === 2">
        <p>
          1.投资者购买投资组合即视同投资者约定交易业务规则和投资组合策略交易规则。投资者首次购买投资组合时，全部资金将按照投资组合当前持仓基金比例进行购买。
        </p>
        <p>
          2.投资者申购或赎回投资组合时，不支持当日撤单操作。
        </p>
        <p>
          3.投资组合策略为基金组合策略，根据不同投资者风险偏好构建不同基金组合，并根据市场行情判断对组合进行动态调仓。
        </p>
        <p>
          4.投资组合采用基金转换的方式进行组合调仓，调仓的判断在每日收盘之后生成。当判断需要根据市场对投资组合进行调仓时，当前组合中的某一只或多只基金将转换为其他适合市场的基金。
        </p>
        <p>
          5.投资者在购买投资组合时，因为投资者银行卡余额不足的原因造成部分成交的情况，认定投资者购买成功。
        </p>
      </div>
    </div>
   <!--  <div class="buygroup">
      <a class="startmoney">1000元起购</a>
      <a class="feilv">费率4折</a>
      <a class="buyfund" @click='buygroup()'>立即购买</a>
    </div> -->
    <tabbar v-transfer-dom>
      <tabbar-item>
        <a slot="label">1000元起</a>
      </tabbar-item>
      <tabbar-item>
        <a slot="label">费率<span style="color:#FE5B35;">4折</span></a>
      </tabbar-item>
      <tabbar-item @on-item-click="buygroup">
        <span slot="label">立即购买</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>
<script>
  import {mianUrlt9} from '../vuex/api'
  import {setLocalStorage, getLocalStorage} from '../vuex/storage'
  import HighCharts from 'highcharts'
  import HighchartsMore from 'highcharts/highcharts-more'
  import {Range,Confirm,Toast,Tabbar, TabbarItem, TransferDom, ButtonTab, ButtonTabItem} from 'vux'
  import {buyAllGroup} from '../common/buyAllFund'

  HighchartsMore(HighCharts)
  export default {
    directives: {
      TransferDom
    },
    data () {
      return {
        gaodu1: 400,
        dis: '9%',
        rangevalue: 0,
        shouyi: 0.00,
        groupname: 'GRobot018',
        groupcode: '',
        biaodi: '',
        number: '',
        tabs: [{name: '成立以来', suo: 6}, {name: '一季', suo: 1}, {name: '半年', suo: 2}, {name: '一年', suo: 3}],
        date: '',
        ben: '',
        ys: '',
        interval: '',
        changedata1: '',
        changedata2: '',
        changedata3: '',
        changedata4: '',
        Ztab: ['推荐理由', '交易说明', '协议说明'],
        des: '',
        currentIndex: 0,
        x: this.$route.query.x,
        y: this.$route.query.y,
        z: this.$route.query.z,
        level: this.$route.query.level,
        levelgen: '',
        canshu: this.$route.query.result
      }
    },
    components: {
      Range,
      Toast,
      Confirm,
      Tabbar,
      TabbarItem,
      TransferDom,
      ButtonTab,
      ButtonTabItem
      // Scroll
    },
    mounted () {
      this.panduan()
    },
    methods: {
      goFundDetail (name, code, type) {
        this.$router.push({
          path: '/component/fund-detail',
          query: {fundcode: code, fundname: name, fundtype: type}
        })
      },
      reassessment() {
        this.$router.push({
          path: '/component/intell-test'
        })
      },
      rangevalueChange () {
        //console.log(this.rangevalue)
        this.level = this.rangevalue
        let levelchange = ''
        if (this.rangevalue < 10) {
          levelchange = '0' + this.rangevalue + this.levelgen
        } else {
          levelchange = this.rangevalue + this.levelgen
        }
        this.querygroup(levelchange)
      },
      panduan () {
        if (this.canshu !== undefined) {
          this.getleida()
        } else {
          this.querygroup(this.level)
          this.levelgen = this.level.substring(2)
          if (this.level.substring(0, 1) === '0') {
            this.level = this.level.substring(1, 2)
          } else {
            this.level = this.level.substring(0, 2)
          }
          // this.level = this.level.substring(1, 2)
          this.dis = ((Number(this.level)) * 9) - 2 + '%'
          this.rangevalue = Number(this.level)
          //console.log(this.level)
          this.drawleida(Number(this.x), Number(this.z), Number(this.y))
        }
      },
      getleida () {
        this.$http.post(mianUrlt9 + 'fund/groupIntelligentMatch', {
          answer: this.canshu
        },{ emulateJSON: true }).then((res) => {
          let data = res.data
          let level = data.data.level
          let x = Number(data.data.X)
          let y = Number(data.data.Y)
          let z = Number(data.data.Z)
          this.x = x
          this.y = y
          this.z = z
          if (level.length === 7) {
            level = level.substring(1)
          }
          if (level.substring(0, 1) === '0') {
            this.level = level.substring(1, 2)
          } else {
            this.level = level.substring(0, 2)
          }
          // this.level = level.substring(1, 2)
          this.levelgen = level.substring(2)
          this.dis = ((Number(this.level) - 1) * 9) - 2 + '%'
          this.rangevalue = Number(this.level)
          // console.log(this.dis)
          if (getLocalStorage('Tel') !== null) {
            this.save_score(x, y, z, level)
          }
          this.drawleida(x, z, y)
          this.querygroup(level)
        })
      },
      drawleida (x, z, y) { // 画雷达图
        let leida = {
          chart: {
            polar: true,
            type: 'line',
            backgroundColor: null,
            marginTop: 50
          },
          title: {text: ''},
          pane: {
            size: '150'
          },
          xAxis: {
            categories: ['风险偏好', '理财需求', '风险承受力'],
            tickmarkPlacement: 'on',
            lineWidth: 0,
            gridLineColor: '#4e6188',
            lineColor: '#4e6188',
            labels: {
              style: {
                color: '#fff', // 颜色
                fontSize: '13px' // 字体
              }
            }
          },
          yAxis: {
            gridLineInterpolation: 'polygon',
            lineWidth: 2,
            min: 0,
            gridLineColor: '#4e6188',
            lineColor: '#4e6188',
            labels: {
              style: {
                color: 'transparent' // 颜色
              }
            }
          },
          credits: {
            enabled: false // 不显示LOGO
          },
          legend: {
            enabled: false
          },
          plotOptions: {
            area: {
              dataLabels: {
                enabled: true,
                style: {
                  fontWeight: 'normal',
                  fontSize: '14px',
                  color: 'rgb(45, 240, 255)'
                }
              }
            }
          },
          tooltip: {
            shared: true,
            pointFormat: '<span><b>{point.y:,.0f}</b><br/>'
          },
          series: [{
            type: 'area',
            data: [x, z, y],
            color: 'rgba(45, 240, 255, 0.2)',
            pointPlacement: 'on',
            marker: {
              fillColor: 'rgb(45, 240, 255)'
            }
          }]
        }
        let charts = new HighCharts.chart(this.$refs.leida, leida)
      },
      save_score (x, y, z, level) { // 保存答题分数
        this.$http.post(mianUrlt9 + 'fund/savePreferenceQuestion', {
          bankflag: 'CEB',
          level: level,
          xScore: x,
          yScore: y,
          zScore: z
        },{ emulateJSON: true }).then((res) => {
          if (res.data.retCode === '0') {
            // this.changelevel(level)
            // this.changex(x)
            // this.changey(y)
            // this.changez(z)
            setLocalStorage('level', level)
            setLocalStorage('x', x)
            setLocalStorage('y', y)
            setLocalStorage('z', z)
          }
        })
      },
      querygroup (level) {
        this.$http.post(mianUrlt9 + 'fund/groupBasicInfo', {
          groupLevel: level,
          bankflag: 'CEB'
        },{ emulateJSON: true }).then((res) => {
          let data = res.data
          this.shouyi = data.data.fdGroupBenchMark
          this.groupname = data.data.fdGroupName
          this.des = data.data.fdGroupPriorityDesc
          let code = data.data.fdGroupCode
          this.groupcode = code
          this.getbiaodi(code)
          this.getchartdata1(6, 0)
        })
      },
      getbiaodi (code) {
        this.$http.post(mianUrlt9 + 'fund/groupProportion', {
          groupId: code
        },{ emulateJSON: true }).then((res) => {
          let data = res.data.data
          let arr = []
          // console.log(data)
          for (let i = 0; i < data.length; i++) {
            let obj = {}
            obj.fundname = data[i].fundName
            obj.bili = (parseFloat(data[i].fdProportional) * 100).toFixed(2)
            obj.daima = data[i].fundId.substring(0, 6)
            obj.fundCode = data[i].fundId
            obj.fundType = data[i].fundType
            arr.push(obj)
          }
          this.biaodi = arr
        })
      },
      getchartdata1 (num, index) {
        this.number = index
        this.$http.post(mianUrlt9 + 'fund/groupFundChart', {
          fdGroupCode: this.groupcode,
          startType: num,
          benchmarkType: '1'
        },{ emulateJSON: true }).then((res) => {
          let data = res.data
          let date = data.data.xtradeDtList
          let ben = data.data.yfnavTurnRatioList
          let ys = data.data.ysDqCloseList
          for (let i = 0; i < ben.length; i++) {
            ben[i] = Number(ben[i])
          }
          for (let i = 0; i < ys.length; i++) {
            ys[i] = Number(ys[i])
          }
          this.changedata3 = Number(ben[(ben.length - 1)])
          this.changedata4 = Number(ys[(ys.length - 1)])
          this.changedata1 = (Number(ben[(ben.length - 1)]) > 0 ? '+' + Number(ben[(ben.length - 1)]).toFixed(2) + '%' : Number(ben[(ben.length - 1)]).toFixed(2) + '%')
          this.changedata2 = (Number(ys[(ys.length - 1)]) > 0 ? '+' + Number(ys[(ys.length - 1)]).toFixed(2) + '%' : Number(ys[(ys.length - 1)]).toFixed(2) + '%')
          this.date = date
          this.ben = ben
          this.ys = ys
          this.interval = parseInt(this.date.length / 3.5)
          this.drawline()
        }, function () {
          // console.log(1)
        })
      },
      drawline () {
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
            categories: joinData(this.date),
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
          tooltip: {
            pointFormat: '{series.name}收益率：{point.y}%',
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
          series: [{ // 指定数据列
            name: this.groupname,
            data: this.ben, // 数据
            color: '#FF5B28'
          }, {
            name: '业绩基准',
            data: this.ys,
            color: '#6A9BFD'
          }]
        }
        let charts = new HighCharts.chart(this.$refs.chartbox1, bar)
      },
      buygroup () {
        buyAllGroup(this.groupcode,this.groupname,this)
      },
      select1 (index) {
        this.currentIndex = index
      },
      back () {
        this.$router.push({
          path: '/'
        })
      },
      testagain () {
        this.$router.push({
          path: '/test'
        })
      }
    }
  }
  function joinData (data) {
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
<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/center.less';
  @import '../styles/custom.less';

  ol, ul, li {
    list-style: none outside none;
  }

  .zuhe_detail {
    color: #333;
    background: #fff;
  }

  .groupCode {
    font-size: 16px;
    line-height: 30px;
    font-weight: bold;
    text-align: center;
  }

  .result{
    position: absolute;
    font-size: 14px;
    color: #fff;
    right: 15px;
    width: 80px;
    top: 15px;
    text-align: right;
  }

  .zuhe_detail .backright_span {
    font-size: 14px;
    line-height: 40px;
    position: absolute;
    right: 10px;
    top: 0;
    color: #6d1786;
  }

  .zuhe_detail .test_result {
    background: url('../assets/resultbg.png') no-repeat center center;
    background-size: cover;
    margin-top: -10px;
    position: relative;
  }

  .zuhe_detail #leida {
    overflow: hidden;
    width: 100%;
    margin: 0 auto;
    height: 180px;
  }

  .zuhe_detail .test_grade_ai {
    padding: 10px;
    position: relative;
    overflow: hidden;
    background-color: #ffffff;
    margin-top: 10px;
  }

  .zuhe_detail .grade h2 {
    font-size: 26px;
    color: #F7662E;
    text-align: center;

  }

  .zuhe_slide-enter-active,
  .zuhe_slide-leave-active {
    transition: all 0.3s
  }

  .zuhe_detail .grade p {
    font-size: 12px;
    color: #666666;
    text-align: center;
  }

  .zuhe_detail .dtj {
    position: absolute;
    height: 25px;
    width: 25px;
    /*top: 1rem;*/
    background: url(../assets/tj.png) no-repeat center center;
    background-size: 100% auto;
  }

  .zuhe_detail .mt-range {
    margin-top: 20px;
  }

  .zuhe_detail .mt-range-runway {
    border-top-color: #ff9900;
  }

  .zuhe_detail .rang-bar {
    background-color: #ff9900;
  }

  .zuhe_detail .gradeline_end {
    margin-top: 20px;
    text-align: center;
  }

  .zuhe_detail .z_scale {
    width: 100%;
    font-size: 14px;
    overflow: hidden;
  }

  .zuhe_detail .z_scale li {
    width: 50%;
    line-height: 32px;
    border-bottom: 1px solid #f2f2f2;
  }

  .zuhe_detail .z_scale .span1 {
    float: left;
    text-align: left;
  }

  .zuhe_detail .z_scale .span2 {
    float: right;
    text-align: right;
  }

  .zuhe_detail .prop li {
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: left;
    position: relative;
    border-bottom: 3px solid #fafafa;
  }

  .zuhe_detail .prop li h2 {
    flex: 1;
    font-size: 14px;
    color: #666666;
    font-weight: normal;
  }

  .zuhe_detail .prop li span {
    display: inline-block;
    font-size: 14px;
    color: #666666;
  }

  .zuhe_detail .dtline {
    position: absolute;
    height: 3px;
    background-color: #65A0F8;
    bottom: 0;
    left: 0;
  }

  .zuhe_detail .con2 {
    text-align: center;
    margin-top: 8px;
    background: #fff;
    padding: 10px;
    overflow: hidden;
  }

  .zuhe_detail .con2 p:nth-of-type(1) {
    padding: 8px 0;
    color: #333;
    font-size: 15px;
  }

  .p3 {
    color: #ccc;
    font-size: 13px;
    text-align: left;
    padding-left: 10px;
  }
  .p2 {
    color: #222;
    font-size: 13px;
    text-align: left;
    padding-left: 10px;
  }

  .zuhe_detail .con2 .time {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    border:solid 1px #e5e5e5;
    border-radius:20%;
  }

  .zuhe_detail .con2 .time li {
    flex: 1;
    padding: 6px 0;
    font-size: 13px;
    width: 25%;
    border: solid 1px #e5e5e5;
    color: #666;
  }

  .zuhe_detail .con2 .time .active {
    background: @fontcolor;
    color: #fff;
    border: solid 1px @fontcolor;
  }

  .zuhe_detail .con2 .detail-title li {
    float: left;
    font-size: 13px;
    width: 50%;
    padding: 10px 0;
    color: #666;
    text-align: center;
  }

  .zuhe_detail .dipper-line-title:before {
    display: inline-block;
    content: "";
    width: 6px;
    height: 6px;
    background: #FF5B38;
    border-radius: 50%;
    margin-right: 6px;
  }

  .zuhe_detail .dipper-line-title:nth-child(2):before {
    background: #5D93F8;
  }

  .zuhe_detail .dipper-line-title span {
    display: inline-block;
    margin-left: 20px;
  }

  .zuhe_detail .buygroup {
    position: fixed;
    width: 100%;
    height: 51px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    z-index: 20;
  }

  .zuhe_detail .buygroup .startmoney {
    float: left;
    width: 25%;
    background-color: #ffffff;
    border-right: 1px solid #f2f2f2;
    border-top: 1px solid #f2f2f2;
    font-size: 14px;
    color: #666666;
    line-height: 51px;
    text-align: center;
    box-sizing: border-box;
  }

  .zuhe_detail .buygroup .feilv {
    float: left;
    width: 25%;
    line-height: 51px;
    font-size: 14px;
    color: #666666;
    background-color: #ffffff;
    border-right: 1px solid #f2f2f2;
    border-top: 1px solid #f2f2f2;
    text-align: center;
    box-sizing: border-box;
  }

  .zuhe_detail .buygroup .buyfund {
    float: left;
    width: 50%;
    background-color: @fontcolor;
    font-size: 16px;
    color: #ffffff;
    line-height: 51px;
    text-align: center;
    box-sizing: border-box;
  }

  .zuhe_detail .function {
    margin-top: 10px;
    background-color: #ffffff;
    overflow: hidden;
  }

  .zuhe_detail .function ul {
    width: 100%;
    overflow: hidden;
  }

  .zuhe_detail .function .z_tab li {
    float: left;
    width: 33.33%;
    font-size: 16px;
    line-height: 37px;
    box-sizing: border-box;
    height: 37px;
    color: #404040;
    text-align: center;
    border-bottom: 1px solid #d8dce0;
  }

  .zuhe_detail .function ul li.select {
    color: #0E76F3;
    border-bottom: 2px solid #0E76F3;
  }

  .zuhe_detail .functiontext1 {
    font-size: 12px;
    color: #666;
    background: #fff;
    padding: 10px;
    margin-bottom: 10px;
    line-height: 2;
  }

  .zuhe_detail .trade_in li {
    font-size: 12px;
    line-height: 22px;
    overflow: hidden;
    padding: 0 10px;
  }

  .zuhe_detail .trade_in li span {
    width: 50%;
    display: block;
    float: left;
  }

  .zuhe_detail .agreements {
    overflow: hidden;
    background: #fff;
    padding: 10px;
  }

  .zuhe_detail .agreements p {
    font-size: 12px;
    margin-bottom: 5px;
    line-height: 20px;
  }

  .zuhe_slide-enter,
  .zuhe_slide-leave-to {
    transform: translate3d(0, 100%, 0)
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
    flex: 1;
  }
  .weui-tabbar__item:nth-child(2) .weui-tabbar__label{
    font-size: 14px;
    line-height: 20px;
 }
  .weui-tabbar__item:nth-child(3) {
    background-color: #0E75F6;
    flex: 2;
  }
  .vux-tabbar-simple .weui-tabbar__label {
    font-size: 14px;
    line-height: 20px;
  }
  .weui-tabbar__label a {
    font-size: 14px;
    color: #666666;
    line-height:20px;
  }

  .up{
    color: @redfont;
  }
  .down{
    color: @greenfont;
  }

  .weui-tabbar__label span {
    font-size: 14px;
    color: #ffffff;
  }
  .vux-button-group > a.vux-button-group-current {
    color: #fff;
    background: #0E75F6;
}
</style>
