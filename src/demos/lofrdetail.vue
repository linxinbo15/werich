<template>
  <div class='detail'>
    <div class="c_box">
      根据模型的低频率信号把握股市的确定性高的上涨机会，在股票型基金指数和货币型基金间转换，把握阶段性收益，持有股票型基金时间较短，长期表现稳定。
    </div>
    <div class="c_des">
      <!--<div class="des_top">
        <ul style="overflow: hidden;">
          <li>
            <p class="des_num" :class="month">{{changedata1}}</p>
            <p class="zhangfu">{{mingcheng}}</p>
          </li>
          <li>
            <p class="des_num" :class="dayColor">{{navday}}</p>
            <p>日跌幅</p>
          </li>
          <li>
            <p class="des_num jingz">{{nav}}</p>
            <p>净值(<span class="date">{{navdate}}</span>)</p>
          </li>
        </ul>
      </div>-->
      <div class="fundInfo">
        <div class="fundInfo_box right_line">
          <h2 :class="month">{{changedata1}}</h2>
          <p>{{mingcheng}}</p>
        </div>
        <div class="fundInfo_box right_line">
          <h2 :class="dayColor">
            {{navday}}</h2>
          <p>日涨幅</p>
        </div>
        <div class="fundInfo_box">
          <h2 class="pt">{{Number(nav).toFixed(4)}}</h2>
          <p>累计净值({{navdate}})</p>
        </div>
      </div>
      <div class="des_bottom">
        <span>1000元起购</span>
        <span style="margin-left: 5px">低频择时</span>
        <span style="margin-left: 5px">收益稳健</span>
      </div>
    </div>
    <div class="con2">
      <p class="chartTitle">收益率走势图</p>
      <!--<ul class="time">
        <li class="dipper-date" v-for="(item,index) in tabs" :class="{active:index == number}"
            @click='getchartdata("LOFR2", item.suo, index)'>{{item.name}}
        </li>
      </ul>-->
      <button-tab>
        <button-tab-item selected @on-item-click="getchartdata('LOFR2', 6 , 0)">成立以来</button-tab-item>
        <button-tab-item @on-item-click="getchartdata('LOFR2', 1, 1)">近三月</button-tab-item>
        <button-tab-item @on-item-click="getchartdata('LOFR2', 2, 2)">近半年</button-tab-item>
        <button-tab-item @on-item-click="getchartdata('LOFR2', 3, 3)">近一年</button-tab-item>
      </button-tab>
      <ul class="detail-title">
        <li class="dipper-line-title">本产品<a class="group_data"></a><span :class="Number(changedata1_num)>0?'up':'down'">{{changedata1}}</span>
        </li>
        <li class="dipper-line-title" id="hs300">沪深300<span :class="Number(changedata2_num)>0?'up':'down'">{{changedata2}}</span>
        </li>
      </ul>
      <div ref='chartbox'></div>
      <p>温馨提示：策略过往业绩并不代表未来收益</p>
    </div>
    <tab style="margin-top: 10px;">
      <tab-item selected @on-item-click="select1">详情</tab-item>
      <tab-item @on-item-click="select1">交易说明</tab-item>
      <tab-item @on-item-click="select1">产品说明</tab-item>
      <tab-item @on-item-click="select1">调仓记录</tab-item>
    </tab>
    <group v-show="currentIndex === 0">
      <cell title="参数"></cell>
      <cell-form-preview :list='list1'></cell-form-preview>
      <cell title="投资标的" value="比例"></cell>
      <div class="test_grade1">
        <ul class="test_grade2 prop">
          <!--     <li>
            <h2>景顺长城中小盘(<span>260115</span>)</h2><span>0%</span>
            <div></div>
          </li>
          <li>
            <h2>景顺长城中小板创业板(<span>000586</span>)</h2><span>0%</span>
            <div></div>
          </li>
          <li>
            <h2>景顺长城中证500行业(<span>003318</span>)</h2><span>0%</span>
            <div></div>
          </li> -->
          <li @click="goFundDetail('景顺长城沪深300','000311.OF','股票型')">
            <h2>景顺长城沪深300(<span>000311</span>)</h2><span>0%</span>
            <div class="dtline"></div>
          </li>
          <li @click="goFundDetail('景顺长城景益货币A','000380.OF','货币型')">
            <h2>景顺长城景益货币A(<span>000380</span>)</h2><span>100%</span>
            <div class="dtline" style="width:100%;"></div>
          </li>
        </ul>
      </div>
    </group>
    <group v-show="currentIndex === 1">
      <cell title="状态及时间"></cell>
      <cell-form-preview :list='list2'></cell-form-preview>
      <cell title="费率"></cell>
      <cell-form-preview :list='list3'></cell-form-preview>
    </group>
    <div class="zcontent" v-show="currentIndex === 2">
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
    <div class="detail_box" v-show="currentIndex === 3">
        <div class="dipper1-record">
          <x-table>
            <tbody>
            <tr v-for="(item,index) in GroupTranSferList" :key="index">
              <td class="dipper1-line"><strong></strong><span></span></td>
              <td class="dipper1-date"><span>{{item.datenew}}</span></td>
              <td>
                <ul class="dipper1-record-ratio">
                  <li><p>
                    {{item.fundName}}<span>{{item.proportion}}%</span></p></li>
                </ul>
              </td>
            </tr>
            </tbody>
          </x-table>
        </div>
      </div>
    <tabbar v-transfer-dom>
      <tabbar-item>
        <!--<img slot="icon" src="../assets/demo/icon_nav_button.png">-->
        <a slot="label">1000元起</a>
      </tabbar-item>
      <tabbar-item>
        <!--<img slot="icon" src="../assets/demo/icon_nav_article.png">-->
        <a slot="label">费率4折</a>
      </tabbar-item>
      <tabbar-item badge=" " @on-item-click="tag">
        <!--<img slot="icon" src="../assets/demo/icon_nav_cell.png">-->
        <span slot="label">立即购买</span>
      </tabbar-item>
    </tabbar>


    <!--<div class="buygroup">
      <a class="startmoney">1000元起购</a>
      <a class="feilv">费率4折</a>
      <a class="buyfund" @click=''>立即购买</a>
    </div>-->
  </div>
</template>
<script>
  import HighCharts from 'highcharts'
  import {mianUrlt9} from '../vuex/api'
  import {Toast, Confirm,CellFormPreview, Cell, Group, Tab, TabItem, Tabbar, TabbarItem, TransferDom, ButtonTab, ButtonTabItem,XTable} from 'vux'
  import {getLocalStorage,setLocalStorage} from '../vuex/storage'
  import {buyAllGroup} from '../common/buyAllFund'

  export default {
    directives: {
      TransferDom
    },
    data() {
      return {
        navday: '',
        nav: '',
        navdate: '',
        mingcheng: '成立以来',
        changedata1: '',
        changedata2: '',
        changedata1_num: '',
        changedata2_num: '',
        month: 'onemonth',
        dayColor: 'day',
        tabs: [{name: '成立以来', suo: 6}, {name: '近三月', suo: 1}, {name: '近半年', suo: 2}, {name: '近一年', suo: 3}],
        number: '',
        date: '',
        ben: '',
        ys: '',
        currentIndex: 0,
        GroupTranSferList: [],
        list1: [{
          label: '成立日期',
          value: '20180523'
        }, {
          label: '历史年化收益率',
          value: '30%'
        }, {
          label: '最大回撤（近一年）',
          value: '10%'
        }, {
          label: '夏普比率',
          value: '1.55'
        }, {
          label: '起购金额',
          value: '1000'
        }, {
          label: '风险等级',
          value: '高'
        }],
        list2: [
          {
            label: '买入',
            value: ''
          }, {
            label: '1、提交申购申请',
            value: 'T日15：00之前'
          }, {
            label: '2、确认份额',
            value: 'T+1日'
          }, {
            label: '3、查看收益',
            value: 'T+2日'
          }, {
            label: '卖出',
            value: ''
          }, {
            label: '1、提交赎回申请',
            value: 'T日15：00之前'
          }, {
            label: '2、确认份额',
            value: 'T+1日'
          }, {
            label: '3、资金到账',
            value: 'T+3日'
          }
        ],
        list3: [
          {
            label: '买入',
            value: ''
          }, {
            label: '买入费用=（单只基金申购金额*申购费率）之和',
            value: ''
          }, {
            label: '卖出',
            value: ''
          }, {
            label: '卖出费用=（单只基金赎回金额*赎回费率）之和',
            value: ''
          }, {
            label: ' 注：单只基金的费率可以参照基金详情页费率',
            value: ''
          }
        ]
      }
    },
    components: {
      Toast,
      CellFormPreview,
      Confirm,
      Group,
      Cell,
      Tab,
      TabItem,
      Tabbar,
      TabbarItem,
      TransferDom,
      ButtonTab,
      ButtonTabItem,
      XTable
    },
    created() {
      this.$nextTick(() => {
        this.number = 0
      })
    },
    mounted() {
      this.getchartdata('LOFR2', 6)
      this.getmeg('LOFR2')
      this.queryCJGroupTranSferRecord()
    },
    methods: {
      goFundDetail (name, code, type) {
        this.$router.push({
          path: '/component/fund-detail',
          query: {fundcode: code, fundname: name, fundtype: type}
        })
      },
      tag() { // 判断是否登录,是否开户
        buyAllGroup('LOFR2','小富即安',this)
      },
      getmeg(code) {
        this.$http.post(mianUrlt9 + 'fund/tacticsIncome', {
          tacticsCode: code
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.navday = (Number(res.data.data.profit) > 0 ? '+' + Number((res.data.data.profit) * 100).toFixed(2) + '%' : Number((res.data.data.profit) * 100).toFixed(2) + '%')
            this.nav = Number(res.data.data.nav).toFixed(4)
            this.navdate = res.data.data.navDate.substring(4, 6) + '-' + res.data.data.navDate.substring(6, 8)
            this.list1[0].value = res.data.data.fundCreatTime
            this.list1[1].value = Number((res.data.data.returnYear) * 100).toFixed(2) + '%'
            this.list1[2].value = Number((res.data.data.maxDrawdown) * 100).toFixed(2) + '%'
            this.list1[3].value = Number(res.data.data.sharpeRatio).toFixed(2)
            if (Number(res.data.data.profit) < 0) {
              this.dayColor = 'daylv'
            } else {
              this.dayColor = 'day'
            }
          } else {
            var msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      queryCJGroupTranSferRecord () {
        let obj = {
          tacticsCode: 'LOFR2'
        }
        this.$http.post(mianUrlt9 + 'fund/queryTacticsProportionInfo', obj, {emulateJSON: true}).then(({data}) => {
          if (data.retCode === '0') {
             //console.log(data.data.proportionInfo)
            for(var x in data.data.proportionInfo){
              //console.log(x)
              var obj = {}
              obj.datenew = data.data.proportionInfo[x].transferDate
              obj.fundName = data.data.proportionInfo[x].fundName
              obj.proportion = Number(data.data.proportionInfo[x].positionProportion)*100
              this.GroupTranSferList.push(obj)
            }
          }
        })
      },
      getchartdata(code, num, index) {
        this.number = index
        this.$http.post(mianUrlt9 + 'fund/tacticsChart', { // 请求参数
          tacticsCode: code,
          startType: num
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            let date = res.data.data.xtradeDtList
            let ben = res.data.data.yfundNavReturnRatioList
            let ys = res.data.data.ysDqCloseList
            for (let i = 0; i < ben.length; i++) {
              ben[i] = Number(ben[i])
            }
            for (let i = 0; i < ys.length; i++) {
              ys[i] = Number(ys[i])
            }
            if (num === 6) {
              this.mingcheng = res.data.data.xtradeDtList[0]+'以来'
            } else if (num === 1) {
              this.mingcheng = '近三月涨幅'
            } else if (num === 2) {
              this.mingcheng = '近六月涨幅'
            } else if (num === 3) {
              this.mingcheng = '近一年涨幅'
            }
            if (Number(ben[(ben.length - 1)]) < 0) {
              this.month = 'onemonthlv'
            } else {
              this.month = 'onemonth'
            }
            this.changedata1 = (Number(ben[(ben.length - 1)]) > 0 ? '+' + Number(ben[(ben.length - 1)]).toFixed(2) + '%' : Number(ben[(ben.length - 1)]).toFixed(2) + '%')
            this.changedata1_num = Number(ben[(ben.length - 1)])
            this.changedata2 = (Number(ys[(ys.length - 1)]) > 0 ? '+' + Number(ys[(ys.length - 1)]).toFixed(2) + '%' : Number(ys[(ys.length - 1)]).toFixed(2) + '%')
            this.changedata2_num = Number(ys[(ys.length - 1)])
            this.date = date
            this.ben = ben
            this.ys = ys
            this.interval = parseInt(this.date.length / 3.5)
            this.drawline()
          } else {
            var msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      select1(index) {
        this.currentIndex = index
        //console.log(index)
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
            }
          },
          series: [{ // 指定数据列
            name: '小富即安',
            data: this.ben, // 数据
            color: '#ff9900'
          }, {
            name: '沪深300',
            data: this.ys,
            color: '#3ca5e6'
          }]
        }
        let charts = new HighCharts.chart(this.$refs.chartbox, bar)
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../styles/custom.less';

  ol, ul, li {
    list-style: none outside none;
  }

  .detail {
    color: #333;
  }

  .c_box{
    padding: 10px 15px;
    background-color: #fff;
    border-top: 1px solid @ai-line-color;
    color: @ai-btn-color;
    font-size: 14px;
  }

  .detail .c_des {
    background: #ffffff;
    padding: 15px 0;
    border-top: 1px solid @ai-line-color;
  }

  .detail .des_top > ul > li {
    float: left;
    width: 33.33%;
    color: #333333;
  }

  .detail .des_top > ul > li p {
    text-align: center;
    font-size: 14px;
  }

  .zcontent {
    padding: 10px;
    color: #666666;
    font-size: 14px;
    line-height: 2;
    background-color: #ffffff;
    border-bottom: 1px solid @ai-line-color;
  }

  .detail .jingz {
    color: #333;
  }

  .detail .des_bottom {
    margin-top: 10px;
    text-align: center;
  }

  .detail .des_bottom span {
    font-size: 12px;
    display: inline-block;
    text-align: center;
    line-height: 12px;
    border-radius: 3px;
    border: 1px solid #939393;
    color: #949494;
    padding: 3px 5px;
  }

  .detail .des_top > ul > li .des_num {
    font-size: 23.5px;
  }

  .detail .day,
  .detail .onemonth {
    color: @redfont;
  }

  .detail .daylv,
  .detail .onemonthlv {
    color: @greenfont;
  }

  .detail .con2 .time .active {
    background: #ff9900;
    color: #fff;
    border: solid 1px #ff9900;
  }

  .detail .con2 {
    text-align: center;
    margin-top: 10px;
    background: #fff;
    padding: 10px;
    position: relative;
    overflow: hidden;
  }

  .detail .con2 p:nth-of-type(1) {
    padding: 8px 0;
    color: #222222;
    font-size: 16px;
  }

  .detail .con2 .time {
    font-size: 10px;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: center;
    justify-content: center;
  }

  .detail .con2 .time li {
    flex: 1;
    padding: 6px 0;
    width: 25%;
    border: solid 1px #e5e5e5;
    color: #666;
  }

  .detail .dipper-line-title:before {
    display: inline-block;
    content: "";
    width: 6px;
    height: 6px;
    background: #ff9900;
    border-radius: 50%;
    margin-right: 6px;
  }

  .detail .dipper-line-title:nth-child(2):before {
    background: #3ca5e6;
  }

  .detail .con2 .detail-title {
    overflow: hidden;
  }

  .detail .con2 .detail-title li {
    font-size: 10px;
    float: left;
    width: 50%;
    padding: 10px 0;
    color: #666;
    text-align: center;
  }

  .detail.dipper-line-title:before {
    display: inline-block;
    content: "";
    width: 6px;
    height: 6px;
    background: @fontcolor;
    border-radius: 50%;
    margin-right: 6px;
  }

  .detail .dipper-line-title:nth-child(2):before {
    background: #3ca5e6;
  }

  .detail .dipper-line-title span {
    display: inline-block;
    margin-left: 20px;
  }

  .detail .con2 p:nth-of-type(2) {
    font-size: 10px;
    color: #ccc;
    text-align: left;
    padding-left: 10px;
  }

  .detail .dipper-increase,
  .detail .dipper-hs300 {
    color: @fontcolor;
  }

  .detail .test_title {
    width: 49%;
    font-size: 12.8px;
    line-height: 24px;
    border-bottom: 1px #f2f2f2 solid;
    display: inline-block;
  }

  .detail .test_grade2 {
    position: relative;
    overflow: hidden;
    padding: 0 10px;
    border-bottom: 1px solid #f2f2f2;
    border-top: 1px solid #f2f2f2;
  }

  .weui-cell:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .detail .prop li {
    height: 40px;
    display: -webkit-flex;
    display: flex;
    flex-direction: row;
    -webkit-align-items: center;
    align-items: center;
    -webkit-justify-content: left;
    justify-content: left;
    position: relative;
    margin-bottom: 10px;
  }

  .detail .prop li h2 {
    flex: 1;
    font-size: 14px;
    font-weight: normal;
    color: #666666;
  }

  .detail .prop li span {
    font-size: 12px;
    color: #666666;
  }

  .detail .dtline {
    position: absolute;
    height: 3px;
    background-color: #3ca5e6;
    bottom: 0;
    left: 0;
  }

  .detail .dtline1 {
    width: 50%;
    position: absolute;
    height: 3px;
    background-color: #3ca5e6;
    bottom: 0;
    left: 0;
  }

  .detail .buygroup {
    position: fixed;
    width: 100%;
    height: 50px;
    bottom: 0px;
    left: 0px;
    right: 0px;
    border-top: 1px solid @ai-line-color;
  }

  .detail .buygroup .startmoney {
    float: left;
    width: 25%;
    background-color: #ffffff;
    border-right: 1px solid #f2f2f2;
    font-size: 14px;
    color: #666666;
    line-height: 50px;
    text-align: center;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .detail .buygroup .feilv {
    float: left;
    width: 25%;
    line-height: 50px;
    font-size: 14px;
    color: #666666;
    background-color: #ffffff;
    border-right: 1px solid #f2f2f2;
    text-align: center;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .up {
    color: @redfont;
  }

  .down {
    color: @greenfont;
  }

  .detail .buygroup .buyfund {
    float: left;
    width: 50%;
    background-color: @fontcolor;
    font-size: 14px;
    color: #ffffff;
    line-height: 50px;
    text-align: center;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  .weui-tabbar {
    position: fixed !important;
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
    background-color: #ffffff;
    flex: 1;
  }

  .weui-tabbar__item:nth-child(2) {
    border-right: 1px solid @ai-line-color;
    background-color: #ffffff;
    flex: 1;
  }

  .vux-button-group > a.vux-button-group-current {
    color: @tabbtnFontColor;
    background: @tabbtnColor;
  }

  .vux-tab .vux-tab-item.vux-tab-selected {
    color: @tabbtnColor;
    border-bottom: 3px solid @tabbtnColor;
  }

  .weui-tabbar__item:nth-child(3) {
    background-color: @tabbtnColor;
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
  .fundInfo {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    border-bottom: 1px solid @ai-line-color;
    margin-top: 8px;
  }
  .fundInfo_box {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: center;
    margin-bottom: 10px;
  }
  .right_line {
    border-right: 1px solid @ai-line-color;
  }
  .fundInfo_box h2 {
    font-weight: normal;
    font-size: 22px;
  }
  .fundInfo_box p {
    font-size: 13px;
    color: #888888;
  }
  .dipper1-record {
    padding: 10px;
    border-bottom: 1px solid @ai-line-color;
    background:#fff;
  }

  .dipper1-record tbody tr td:nth-of-type(3) {
    width: 100%;
    overflow: hidden;
  }

  .dipper1-line {
    width: 1px;
    position: relative;
  }

  .dipper1-line strong {
    display: block;
    position: absolute;
    top: 23px;
    width: 1px;
    height: 100%;
    background: #ff9900;
  }

  .dipper1-line span {
    position: absolute;
    left: -5px;
    top: 23px;
    display: block;
    width: 11px;
    height: 11px;
    background: url(../assets/circle.png) no-repeat center;
  }

  .dipper1-date {
    text-align: left;
    font-size: 1em;
    line-height: 18px;
    vertical-align: top;
    padding-left: 15px;
    width: 32%;
    padding-top: 20px;
    color: #666;
  }

  .dipper1-date span {
    font-size: 14px;
    color: #222;
  }

  .dipper1-record p {
    font-weight: normal;
  }

  .dipper1-record-ratio {
    padding: 18px 0 0 10px;
    margin-bottom: 0;
  }

  .dipper1-record-ratio li {
    display: block;
    margin-bottom: 8px;
    line-height: 24px;
    border-bottom: none;
    color: #222;
  }

  .dipper1-record-ratio li p {
    font-size: 14px;
    line-height: 14px;
    text-align: left;
  }

  .dipper1-record-ratio li span {
    float: right;
    font-size: 14px;
    color: #666;
  }

  .dipper1-record tr:nth-last-child(1) .dipper1-line strong {
    background: #fff;
  }

  .vux-table td:before, .vux-table th:before {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: none;
    color: #C7C7C7;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .vux-table:after {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: none;
    color: #C7C7C7;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .vux-table td:after, .vux-table th:after {
    content: " ";
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    bottom: 0;
    border-right: none;
    color: #C7C7C7;
    -webkit-transform-origin: 100% 0;
    transform-origin: 100% 0;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
  }
</style>
