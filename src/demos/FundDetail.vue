<template>
  <div>
    <div class="fundHeader">
      <div class="fundTitle">
        <h2>{{fundname}}</h2>
        <p>({{fundcode.substring(0,6)}}) {{fundtype}}</p>
      </div>
      <div class="fundInfo" v-if="fundtype === '货币型' || fundtype === '货币市场型'">
        <div class="fundInfo_box right_line">
          <h2 :class="fundday > 0 ? 'up':'down'">{{fundday}}%</h2>
          <p>{{textZ}}</p>
        </div>
        <div class="fundInfo_box right_line">
          <h2 class="pt">{{fundread.managementComp}}</h2>
          <p>管理人</p>
        </div>
        <div class="fundInfo_box">
          <h2 class="pt">{{Number(funddetail.unitIncome).toFixed(2)}}</h2>
          <p>万份收益</p>
        </div>
      </div>
      <div class="fundInfo" v-else>
        <div class="fundInfo_box right_line">
          <h2 :class="fundday > 0 ? 'up':'down'">{{fundday}}%</h2>
          <p>{{textZ}}</p>
        </div>
        <div class="fundInfo_box right_line">
          <h2 class="pt">{{Number(getFunavData.unitNav).toFixed(4)}}</h2>
          <p>最新净值(元)</p>
        </div>
        <div class="fundInfo_box">
          <h2 class="pt">{{Number(getFunavData.accumulatedNav).toFixed(4)}}</h2>
          <p>累计净值(元)</p>
        </div>
      </div>
      <div class="fundInfo_full">
        <div class="fundInfo_full_box">
          <img src="../assets/ico_regenerate.png">
          <p>基金类型：{{fundtype}}</p>
        </div>
        <div class="fundInfo_full_box">
          <img src="../assets/ico_time.png">
          <p>更新日期：{{getFunavData.navDate}}</p>
        </div>
      </div>
    </div>
    <toast v-model="showPositionValue" type="text" width="18em" :time="800" is-show-mask :text="toastText"
           :position="position">{{toastText}}
    </toast>
    <div class="fundChart">
      <h2>收益率走势图</h2>
      <button-tab>
        <button-tab-item selected @on-item-click="consoleIndex(0)">近一月</button-tab-item>
        <button-tab-item @on-item-click="consoleIndex(1)">近三月</button-tab-item>
        <button-tab-item @on-item-click="consoleIndex(2)">近半年</button-tab-item>
        <button-tab-item @on-item-click="consoleIndex(3)">近一年</button-tab-item>
      </button-tab>
      <div class="series">
        <div class="series_box">
          <a>{{fundname}}</a><span :class="yf > 0 ? 'up':'down'">{{yf_format}}%</span>
        </div>
        <div class="series_box" v-show="ys != ''">
          <a>沪深300</a>
          <span :class="ys > 0 ? 'up':'down'">{{ys_format}}%</span>
        </div>
      </div>
      <div ref='chartbox' style="margin-top: 5px;"></div>
      <!--<highcharts :options="options"></highcharts>-->
      <p class="endfont">温馨提示：基金过往业绩并不代表未来收益</p>
    </div>
    <div class="detail">
      <tab v-model="index01" prevent-default @on-before-index-change="switchTabItem">
        <tab-item selected>基金详情</tab-item>
        <tab-item>基金经理</tab-item>
        <tab-item>业绩表现</tab-item>
      </tab>
      <div class="detail_box" v-show="index01 === 0">
        <div class="detail_title" v-show="fundread.fInfoBenchmark !== ''">业绩比较基准:</div>
        <p class="detail_content" v-show="fundread.fInfoBenchmark !== ''">{{fundread.benchMark}}</p>
        <div class="detail_title" v-show="fundread.fInfoInvestobject !== ''">投资范围:</div>
        <p class="detail_content" v-show="fundread.fInfoInvestobject !== ''">{{fundread.investScope}}</p>
        <div class="detail_title" v-show="fundread.fInfoInvestscope !== ''">投资目标:</div>
        <p class="detail_content" v-show="fundread.fInfoInvestscope !== ''">{{fundread.investObject}}</p>
        <div class="detail_title" v-show="fundread.fInfoInvestconception !== ''">投资理念:</div>
        <p class="detail_content" v-show="fundread.fInfoInvestconception !== ''">{{fundread.investConception}}</p>
        <div class="detail_title" v-show="fundread.fInfoDecisionBasis !== ''">决策依据:</div>
        <p class="detail_content" v-show="fundread.fInfoDecisionBasis !== ''">{{fundread.decisionBasis}}</p>
      </div>
      <div class="detail_box" v-show="index01 === 1">
        <div class="manager_box">
          <div class="headimg"><img :src="fundmanager.img"/></div>
          <div class="manager_box_right">
            <h2>{{fundmanager.managerName}}<span>{{fundmanager.managerEducation}}</span></h2>
            <p>{{fundmanager.managerResume}}</p>
          </div>
        </div>
      </div>
      <div class="detail_box" v-show="index01 === 2">
        <x-table :cell-bordered="false" :content-bordered="false" style="background-color:#fff;">
          <thead>
          <tr style="background-color: #F7F7F7">
            <th>日期</th>
            <th>收益回报</th>
            <th>同类排名</th>
            <th>同类平均</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>今年以来</td>
            <td :class="Number(performance.fAvgreturnThisyear)>0? 'up':'down'">
              {{Number(performance.fAvgreturnThisyear).toFixed(2) + '%'}}
            </td>
            <td>{{performance.fSfrankThisyeart}}</td>
            <td :class="Number(performance.fSfreturnThisyear)>0? 'up':'down'">
              {{Number(performance.fSfreturnThisyear).toFixed(2) + '%'}}
            </td>
          </tr>
          <tr>
            <td>近1月</td>
            <td :class="Number(performance.fAvgreturnMonth)>0? 'up':'down'">
              {{Number(performance.fAvgreturnMonth).toFixed(2) + '%'}}
            </td>
            <td>{{performance.fSfrankRecentmontht}}</td>
            <td :class="Number(performance.fSfreturnRecentmonth)>0? 'up':'down'">
              {{Number(performance.fSfreturnRecentmonth).toFixed(2) + '%'}}
            </td>
          </tr>
          <tr>
            <td>近3月</td>
            <td :class="Number(performance.fAvgreturnGuarter)>0? 'up':'down'">
              {{Number(performance.fAvgreturnGuarter).toFixed(2) + '%'}}
            </td>
            <td>{{performance.fSfrankRecentquartert}}</td>
            <td :class="Number(performance.fSfreturnRecentquarter)>0? 'up':'down'">
              {{Number(performance.fSfreturnRecentquarter).toFixed(2) + '%'}}
            </td>
          </tr>
          <tr>
            <td>近6月</td>
            <td :class="Number(performance.fAvgreturnHalfyear)>0? 'up':'down'">
              {{Number(performance.fAvgreturnHalfyear).toFixed(2) + '%'}}
            </td>
            <td>{{performance.fSfrankRecenthalfyeart}}</td>
            <td :class="Number(performance.fSfreturnRecenthalfyear)>0? 'up':'down'">
              {{Number(performance.fSfreturnRecenthalfyear).toFixed(2) + '%'}}
            </td>
          </tr>
          <tr>
            <td>近1年</td>
            <td :class="Number(performance.fAvgreturnYear)>0? 'up':'down'">
              {{Number(performance.fAvgreturnYear).toFixed(2) + '%'}}
            </td>
            <td>{{performance.fSfrankRecentyeart}}</td>
            <td :class="Number(performance.fSfreturnRecentyear)>0? 'up':'down'">
              {{Number(performance.fSfreturnRecentyear).toFixed(2) + '%'}}
            </td>
          </tr>
          <tr>
            <td>近3年</td>
            <td :class="Number(performance.fAvgreturnThreeyear)>0? 'up':'down'">
              {{Number(performance.fAvgreturnThreeyear).toFixed(2) + '%'}}
            </td>
            <td>{{performance.fSfrankRecentthreeyeart}}</td>
            <td :class="Number(performance.fSfreturnRecentthreeyear)>0? 'up':'down'">
              {{Number(performance.fSfreturnRecentthreeyear).toFixed(2) + '%'}}
            </td>
          </tr>
          <tr>
            <td>成立以来</td>
            <td :class="Number(performance.fAvgreturnSincefound)>0? 'up':'down'">
              {{Number(performance.fAvgreturnSincefound).toFixed(2) + '%'}}
            </td>
            <td>{{performance.fSfrankSincefoundt}}</td>
            <td :class="Number(performance.FsfreturnRincefound)>0? 'up':'down'">
              {{Number(performance.FsfreturnRincefound).toFixed(2) + '%'}}
            </td>
          </tr>
          </tbody>
        </x-table>
      </div>
    </div>
    <tabbar v-transfer-dom>
      <tabbar-item @on-item-click="addchioce">
        <!--<img slot="icon" src="../assets/demo/icon_nav_button.png">-->
        <a slot="label">加自选</a>
      </tabbar-item>
      <tabbar-item @on-item-click="buyInvestPrepose">
        <!--<img slot="icon" src="../assets/demo/icon_nav_article.png">-->
        <a slot="label">基金定投</a>
      </tabbar-item>
      <tabbar-item badge=" " @on-item-click="buyFund">
        <!--<img slot="icon" src="../assets/demo/icon_nav_cell.png">-->
        <span slot="label">立即购买</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
  import {
    Tab,
    TabItem,
    Toast,
    Loading,
    Tabbar,
    TabbarItem,
    Group,
    Cell,
    XButton,
    Sticky,
    Scroller,
    Divider,
    Spinner,
    Companies,
    ButtonTab,
    ButtonTabItem,
    XTable,
    TransferDom
  } from 'vux'
  import Highcharts from 'highcharts'
  import {mianUrl, mianUrlt9} from '../vuex/api'
  import {getLocalStorage, setLocalStorage} from '../vuex/storage'
  import {buyAllFund,buyAllInvest} from '../common/buyAllFund'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Tab,
      Toast,
      Loading,
      TabItem,
      Tabbar,
      TabbarItem,
      Group,
      Cell,
      XButton,
      Sticky,
      Scroller,
      Divider,
      Spinner,
      ButtonTab,
      ButtonTabItem,
      XTable,
      TransferDom
    },
    data() {
      return {
        results: [],
        value: 'test',
        fundlist: [],
        n1: 10,
        page: 1,
        index01: 0,
        fundComp: Companies,
        pageRecorders: 10,
        getFunavData: {},
        getFundnavData: [],
        fundname: '',
        fundcode: '',
        fundtype: '',
        typeText: '',
        fundday: '',
        navList: '',
        sh300List: '',
        fInfoYearlyroe: '',
        interval: '',
        date: '',
        fundread: '',
        fundmanager: '',
        performance: '',
        funddetail: '',
        textZ: '月涨幅',
        position: 'default',
        toastText: '加入自选成功！',
        showPositionValue: false,
        yf: '', // 走势图图例最新涨幅 基金
        ys: '', // 走势图图例最新涨幅 沪深300
        yf_format: '', // 走势图图例最新涨幅 基金 格式化
        ys_format: '', // 走势图图例最新涨幅 沪深300 格式化
        disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent)
      }
    },
    methods: {
      getParams() {
        // 取到路由带过来的参数
        // console.log(this.$route)
        let fundname = this.$route.query.fundname
        let fundcode = this.$route.query.fundcode
        let fundtype = this.$route.query.fundtype
        // 将数据放在当前组件的数据内
        this.fundname = fundname
        this.fundcode = fundcode
        this.fundtype = fundtype
      },
      showPosition(position) {
        this.position = position
        this.showPositionValue = true
      },
      consoleIndex(val) {
        if (this.fundtype === '货币型' || this.fundtype === '货币市场型') {
          this.getFundnav_huobi(val)
        } else {
          this.getFundnav(val)
        }
      },
      buyInvestPrepose() {
        buyAllInvest(this.fundcode, this)
      },
      buyFund() {
        buyAllFund(this.fundcode, this)
      },
      addchioce() {
        const obj = {fundCode: this.fundcode, fundName: this.fundname}
        this.$http.post(mianUrlt9 + 'user/addFundChoice', obj, {emulateJSON: true}).then(({data}) => {
          // console.log(data)
          if (data.retcode === '0000') {
            this.toastText = '加入自选成功！'
            this.showPosition('middle')
          } else if (data.retCode === '990101') {
            this.toastText = data.data.retMsg
            this.showPosition('middle')
            // console.log(this.$route)
            // this.$router.replace({path:'/component/login',query:{path:this.$route.path+'?fundcode='+this.fundcode+'&fundname='+this.fundname+'F&fundtype='+this.fundtype+''}})
            this.$router.push({path: '/component/login', query: {path: this.$route.fullPath}})
          } else if (data.retCode === '990102') {
            this.toastText = '参数错误！'
            this.showPosition('middle')
          } else if (data.retCode === '990103') {
            this.toastText = '系统正在维护，请稍后再试'
            this.showPosition('middle')
          } else if (data.retCode === '990104') {
            this.toastText = '服务器内部错误'
            this.showPosition('middle')
          } else {
            this.toastText = data.retMsg
            this.showPosition('middle')
          }
        })
      },
      getFunav() {
        let obj = {
          fundCode: this.fundcode
        }
        this.$http.post(mianUrlt9 + '/fund/nonMoneyFundLatestIncome', obj, {emulateJSON: true}).then(({data}) => {
          if (data.retCode === '0') {
            this.getFunavData = data.data
            this.getFunavData.navDate = this.getFunavData.navDate.substring(0, 4) + '-' + this.getFunavData.navDate.substring(4, 6) + '-' + this.getFunavData.navDate.substring(6, this.getFunavData.navDate.length)
          }
        })
      },
      getWebfixed() {
        let obj = {
          fundCode: this.fundcode
        }
        this.$http.post(mianUrlt9 + '/fund/getFundDescription', obj, {emulateJSON: true}).then(({data}) => {
          if (data.retCode === '0') {
            this.fundread = data.data
          }
        })
      },
      fundRead_huobi() {
        let obj = {fundCode: this.fundcode}
        this.$http.post(mianUrlt9 + '/fund/moneyFundLatestIncome', obj, {emulateJSON: true}).then(({data}) => {
          if (data.retCode === '0') {
            this.funddetail = data.data
          }
        })
      },
      allFundManager() {
        let obj = {fundCode: this.fundcode}
        this.$http.post(mianUrlt9 + '/fund/currentFundManager', obj, {emulateJSON: true}).then(({data}) => {
          if (data.retCode === '0') {
            let manager = data.data
            // for (let i = 0; i < data.data.length; i++) {
            // if (data.data[i].fInfoMangaerLeavedate === undefined) {
            // https://wechat.5irich.com/images/managers/7A5DB0.png
            let img1 = 'https://wechat.5irich.com/images/managers/' + manager.managerId + '.png'
            this.$http.get(img1).then(({res}) => {
              //console.log(11)
              manager.img = 'https://wechat.5irich.com/images/managers/' + manager.managerId + '.png'
            }).catch(({res}) => {
              //console.log(22)
              manager.img = 'https://wechat.5irich.com/images/managers/default.jpg'
            })
            // console.log(manager)
            // console.log(data.data[i])
            // manager.push(data.data[i])
            // }
            // }
            // console.log(manager)
            this.fundmanager = manager
            // console.log(this.fundmanager)
          }
        })
      },
      fixedsa() {
        let obj = {fundCode: this.fundcode}
        this.$http.post(mianUrlt9 + 'fund/queryPerformanceRanking', obj, {emulateJSON: true}).then(({data}) => {
          if (data.retCode === '0') {
            // console.log(data.data)
            this.performance = data.data
          }
        })
      },
      switchTabItem(index) {
        // console.log('on-before-index-change', index)
        this.$vux.loading.show({
          text: 'loading'
        })
        setTimeout(() => {
          this.$vux.loading.hide()
          this.index01 = index
        }, 1000)
      },
      getFundnav_huobi(val) {
        let obj1 = {
          fundCode: this.fundcode,
          timeType: val
        }
        if (val === 0) {
          this.textZ = '七日年化'
        } else if (val === 1) {
          this.textZ = '七日年化'
        } else if (val === 2) {
          this.textZ = '七日年化'
        } else if (val === 3) {
          this.textZ = '七日年化'
        }
        this.$http.post(mianUrlt9 + '/fund/moneyFundIncomeTrendChart', obj1, {emulateJSON: true}).then(({data}) => {
          if (data.retCode === '0') {
            let fInfoYearlyroe = data.data.yearlyRoeList
            // let sh300List = data.data.sh300List
            for (var i = 0; i < fInfoYearlyroe.length; i++) {
              fInfoYearlyroe[i] = Number(fInfoYearlyroe[i])
            }
            this.yf = Number(data.data.yearlyRoeList[(data.data.yearlyRoeList.length - 1)]).toFixed(2)
            this.yf_format = this.yf > 0 ? '+' + this.yf : this.yf
            this.fInfoYearlyroe = fInfoYearlyroe
            // this.sh300List = sh300List
            this.date = joinData(data.data.dateList)
            this.interval = parseInt(data.data.dateList.length / 2)
            this.getFundnavData = data.data
            this.fundday = Number(data.data.yearlyRoeList[(data.data.yearlyRoeList.length - 1)]).toFixed(2)
            this.drawline_huobi()
          }
        })
      },
      getFundnav(val) {
        let obj1 = {
          fundCode: this.fundcode,
          timeType: val
        }
        if (val === 0) {
          this.textZ = '月涨幅'
        } else if (val === 1) {
          this.textZ = '季涨幅'
        } else if (val === 2) {
          this.textZ = '半年涨幅'
        } else if (val === 3) {
          this.textZ = '年涨幅'
        }
        this.$http.post(mianUrlt9 + '/fund/nonMoneyFundIncomeTrendChart', obj1, {emulateJSON: true}).then(({data}) => {
          if (data.retCode === '0') {
            let navList = data.data.fundIncomeRateList
            let sh300List = data.data.sh300IncomeRateList
            for (let i = 0; i < navList.length; i++) {
              navList[i] = Number(navList[i])
            }
            for (let i = 0; i < sh300List.length; i++) {
              sh300List[i] = Number(sh300List[i])
            }
            this.yf = Number(data.data.fundIncomeRateList[(data.data.fundIncomeRateList.length - 1)]).toFixed(2)
            this.yf_format = this.yf > 0 ? '+' + this.yf : this.yf
            this.ys = Number(data.data.sh300IncomeRateList[(data.data.sh300IncomeRateList.length - 1)]).toFixed(2)
            this.ys_format = this.ys > 0 ? '+' + this.ys : this.ys
            this.navList = navList
            this.sh300List = sh300List
            this.date = joinData(data.data.navDateList)
            this.interval = parseInt(data.data.navDateList.length / 2)
            this.getFundnavData = data.data
            this.fundday = Number(data.data.fundIncomeRateList[(data.data.fundIncomeRateList.length - 1)]).toFixed(2)
            // this.textZ = '七日年化收益'
            this.drawline()
          }
        })
      },
      drawline_huobi() {
        // console.log(this.getFundnavData)
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
            name: this.fundname,
            data: this.fInfoYearlyroe,
            color: '#ff9900'
          }]
        }
        let charts = new Highcharts.chart(this.$refs.chartbox, bar)
      },
      drawline() {
        // console.log(this.getFundnavData)
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
          series: [{
            name: this.fundname,
            data: this.navList,
            color: '#ff5e34'
          }, {
            name: '沪深300',
            data: this.sh300List,
            color: '#3ca5e6'
          }]
        }
        let charts = new Highcharts.chart(this.$refs.chartbox, bar)
      }
    },
    mounted() {
      const that = this
      that.getParams()
      that.getFunav()

      that.getWebfixed()
      that.allFundManager()
      that.fixedsa()
      if (this.fundtype === '货币型' || this.fundtype === '货币市场型') {
        that.getFundnav_huobi(0)
        that.fundRead_huobi()
      } else {
        that.getFundnav(0)
      }
    },
    watch: {
      // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
      '$route': 'getParams'
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

<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/center.less';
  @import '../styles/custom.less';

  .fundHeader {
    padding: 10px 15px;
    background-color: #fff;
  }

  .fundTitle h2 {
    font-size: 16px;
    color: #222222;
    margin-bottom: 5px;
  }

  .fundDetail {
    margin-top: 10px;
    padding: 15px 10px;
    background-color: #fff;
  }

  .detail {
    margin-top: 10px;
    background-color: #ffffff;
  }

  .fundChart {
    margin-top: 10px;
    padding: 15px 10px;
    background-color: #fff;
  }

  .fundTitle p {
    font-size: 13px;
    color: #8e8e8e;
  }

  .center {
    margin-top: 15px;
    text-align: center;
  }

  .ad_img {
    display: block;
    width: 100%;
    height: auto;
  }

  .active-6-1 {
    color: rgb(252, 55, 140) !important;
    border-color: rgb(252, 55, 140) !important;
  }

  .detail_title {
    font-size: 14px;
    padding: 10px 15px 8px;
    color: #222222;
    background-color: #f2f2f2;
  }

  .detail_content {
    padding: 10px 15px 8px;
    font-size: 13px;
    color: #666;
    border-bottom: 1px solid @ai-line-color;
  }

  .manager_box {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: start;
    -webkit-align-items: flex-start;
    align-items: start;
    padding: 10px 15px;
  }

  .headimg img {
    width: 100px;
    height: auto;
  }

  .manager_box_right {
    margin-left: 10px;
  }

  .manager_box_right h2 {
    font-size: 18px;
    color: #222222;
    font-weight: normal;
  }

  .manager_box_right h2 span {
    font-size: 14px;
    color: #666666;
    font-weight: normal;
    padding-left: 10px;
  }

  .manager_box_right p {
    font-size: 13px;
    color: #999999;
    font-weight: normal;
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

  .vux-tab .vux-tab-item.vux-tab-selected {
    color: @tabbtnColor;
    border-bottom: 3px solid @tabbtnColor;
  }

  .vux-tab-ink-bar {
    position: absolute;
    height: 2px;
    bottom: 0;
    left: 0;
    background-color: @tabbtnColor;
    text-align: center;
  }

  .right_line {
    border-right: 1px solid @ai-line-color;
  }

  .fundInfo_full_box img {
    width: 16px;
    height: 16px;
  }

  .fundInfo_full_box p {
    font-size: 13px;
    margin-left: 10px;
  }

  .active-6-2 {
    color: #04be02 !important;
    border-color: #04be02 !important;
  }

  .active-6-3 {
    color: rgb(55, 174, 252) !important;
    border-color: rgb(55, 174, 252) !important;
  }

  .tab-swiper {
    background-color: #fff;
    height: 100px;
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

  .fundInfo_full {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    margin-top: 5px;
  }

  .vux-button-group > a.vux-button-group-current {
    color: @tabbtnFontColor;
    background: @tabbtnColor;
  }

  .fundlist_right {
    width: 25%;
  }

  .fundlist p {
    font-size: 12px;
    color: #999999;
  }

  .fundlist_title {
    font-size: @fontTitleSize;
    color: #222222;
    margin-bottom: @titileBottomMargin;
  }

  .fundlist_title span {
    font-size: 13px;
    color: #666666;
  }

  .fundlist_syl {
    font-size: @fontTitleSize;;
    font-weight: bold;
    margin-bottom: @titileBottomMargin;
  }

  .up {
    color: @redfont;
  }

  .down {
    color: @greenfont;
  }

  .pt {
    color: #000000;
  }

  .endfont {
    color: #999999;
    font-size: 12px;
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

  .fundInfo_box {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: center;
    margin-bottom: 10px;
  }

  .detail_box {

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

  .weui-tabbar__label a {
    font-size: 16px;
    color: #666666;
  }

  .weui-tabbar__label span {
    font-size: 16px;
    color: #ffffff;
  }

  .series_box::before {
    display: inline-block;
    content: "";
    width: 10px;
    height: 10px;
    background: @redfont;
    border-radius: 50%;
    margin-right: 6px;
  }

  .series_box:nth-child(2):before {
    background: #3ca5e6;
  }

  .fundInfo_box h2 {
    font-weight: normal;
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
    flex: 2;
  }

  .weui-tabbar__item:nth-child(3) {
    background-color: @tabbtnColor;
    flex: 2;
  }

  .fundChart h2 {
    font-size: 18px;
    text-align: center;
    font-weight: normal;
    margin-bottom: 8px;
  }

  .fundInfo_box p {
    font-size: 13px;
    color: #888888;
  }
</style>
