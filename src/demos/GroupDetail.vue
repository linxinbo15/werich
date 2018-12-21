<template>
  <div>
    <div class="fundHeader">
      <div class="fundTitle">
        <h2>{{groupName}}</h2>
        <p>({{groupCode}})</p>
      </div>
      <div class="fundInfo">
        <div class="fundInfo_box right_line">
          <h2 :class="fundday > 0 ? 'up':'down'">{{fundday}}%</h2>
          <p>{{textZ}}</p>
        </div>
        <div class="fundInfo_box right_line">
          <h2 :class="Number(groupRead.returnYearRatio) > 0 ? 'up':'down'">
            {{(Number(groupRead.returnYearRatio)*100).toFixed(2)}}%</h2>
          <p>成立以来收益(元)</p>
        </div>
        <div class="fundInfo_box">
          <h2 class="pt">{{Number(groupRead.groupNav).toFixed(4)}}</h2>
          <p>累计净值({{groupNavDate}})</p>
        </div>
      </div>
      <div class="fundInfo_full">
        <div class="fundInfo_full_box">
          <img src="../assets/ico_regenerate.png">
          <p>成立日期：{{setUpDate}}</p>
        </div>
        <div class="fundInfo_full_box">
          <img src="../assets/ico_time.png">
          <p>更新日期：{{groupNavDateAll}}</p>
        </div>
      </div>
      <div class="fundInfo_full_box1" style="margin-top: 5px;">
        <img src="../assets/ico_sugget.png">
        <p>{{groupRead.fdGroupPriorityDesc}}</p>
      </div>
    </div>
    <toast v-model="showPositionValue" type="text" width="18em" :time="800" is-show-mask :text="toastText" :position="position">{{toastText}}
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
          <a>{{groupName}}</a><span :class="yf > 0 ? 'up':'down'">{{yf_format}}%</span>
        </div>
        <div class="series_box">
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
        <tab-item selected>组合详情</tab-item>
        <tab-item>组合配比</tab-item>
        <tab-item>调仓记录</tab-item>
        <tab-item>历史净值</tab-item>
      </tab>
      <div class="detail_box" v-show="index01 === 0">
        <div class="detail_title">组合名称:</div>
        <p class="detail_content">{{groupName}}</p>
        <div class="detail_title">组合代码:</div>
        <p class="detail_content">{{groupCode}}</p>
        <div class="detail_title">申购起点:</div>
        <p class="detail_content">{{Number(groupRead.fdGroupMin).toFixed(2)}}元起购</p>
        <div class="detail_title">推荐理由:</div>
        <p class="detail_content">{{groupRead.fdGroupPriorityDesc}}</p>
        <div class="detail_title">成立日期:</div>
        <p class="detail_content">{{setUpDate}}</p>
      </div>
      <div class="detail_box" v-show="index01 === 1">
        <div ref='piebox' style="margin-top: 5px;"></div>
        <div v-for="(item,index) in groupList" :key="index" class="groupList_box" @click="goFundDetail(item.fundName,item.fundId,item.fundType)">
          <div class="groupListLeft">&#xe609;</div>
          <div class="groupListCenter">{{item.fundName}}</div>
          <div class="groupListRight">{{(Number(item.fdProportional)*100).toFixed(2)}}%</div>
        </div>
      </div>
      <div class="detail_box" v-show="index01 === 2">
        <div class="dipper1-record">
          <x-table>
            <tbody>
              <tr v-for="(item,index) in GroupTranSferList" :key="index">
                <td class="dipper1-line"><strong></strong><span></span></td>
                <td class="dipper1-date"><span>{{item.datenew}}</span></td>
                <td>
                  <ul class="dipper1-record-ratio">
                    <li v-for="(item1,index) in item.list" :key="index">
                      <p>
                        {{item1.fundName}}<span>{{item1.proportion}}%</span></p>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </x-table>
        </div>
      </div>
      <div class="detail_box" v-show="index01 === 3">
        <x-table :cell-bordered="false" :content-bordered="false" style="background-color:#fff;">
          <thead>
            <tr style="background-color: #F7F7F7">
              <th>日期</th>
              <th>净值</th>
              <th>涨跌幅</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in groupNavList" :key="index">
              <td>{{item.navDate}}</td>
              <td>{{Number(item.groupNav).toFixed(4)}}</td>
              <td :class="parseFloat(item.graCet)>0? 'up':'down'">{{item.graCet}}</td>
            </tr>
          </tbody>
        </x-table>
      </div>
    </div>
    <tabbar v-transfer-dom>
      <tabbar-item>
        <!--<img slot="icon" src="../assets/demo/icon_nav_article.png">-->
        <a slot="label">{{Number(groupRead.fdGroupMin).toFixed(0)}}元起</a>
      </tabbar-item>
      <tabbar-item>
        <!--<img slot="icon" src="../assets/demo/icon_nav_article.png">-->
        <a slot="label">费率4折</a>
      </tabbar-item>
      <tabbar-item badge=" " @on-item-click="buygroup">
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
  TransferDom,
  XTable
} from 'vux'
import Highcharts from 'highcharts'
import { mianUrlt9 } from '../vuex/api'
import { getLocalStorage, setLocalStorage } from '../vuex/storage'
import { buyAllGroup } from '../common/buyAllFund'
export default {
  directives: {
    TransferDom
  },
  components: {
    Tab,
    Toast,
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
    XTable
  },
  data() {
    return {
      results: [],
      value: 'test',
      fundlist: [],
      n1: 10,
      page: 1,
      index01: 0,
      setUpDate: '',
      fundComp: Companies,
      pageRecorders: 10,
      getFunavData: {},
      groupNavDateAll: '',
      getFundnavData: [],
      groupNavDate: '',
      groupName: '',
      groupCode: '',
      typeText: '',
      groupNavList: '',
      fundday: '',
      navList: '',
      sh300List: '',
      fInfoYearlyroe: '',
      interval: '',
      date: '',
      groupRead: '',
      GroupTranSferList: [],
      groupList: '',
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
      ys_format: '' // 走势图图例最新涨幅 沪深300 格式化
    }
  },
  methods: {
    goFundDetail(name, code, type) {
      this.$router.push({
        path: '/component/fund-detail',
        query: { fundcode: code, fundname: name, fundtype: type }
      })
    },
    getParams() {
      // 取到路由带过来的参数
      this.groupName = this.$route.query.groupName
      this.groupCode = this.$route.query.groupCode
      // 将数据放在当前组件的数据内
    },
    showPosition(position) {
      this.position = position
      this.showPositionValue = true
    },
    consoleIndex(val) {
      this.getGroupnav(val)
    },
    buygroup() {
      buyAllGroup(this.groupCode, this.groupName, this)
    },
    queryGroupHistoryNav() {
      let obj = {
        groupCode: this.groupCode,
        page: 1,
        rows: 10
      }
      this.$http.post(mianUrlt9 + 'fund/queryGroupHistoryNav', obj, { emulateJSON: true }).then(({ data }) => {
        if (data.retCode === '0') {
          this.groupNavList = data.data.list
        }
      })
    },
    queryZNGroupInfo() {
      let obj = {
        groupCode: this.groupCode
      }
      this.$http.post(mianUrlt9 + 'fund/queryZNGroupInfo', obj, { emulateJSON: true }).then(({ data }) => {
        if (data.retCode === '0') {
          this.groupRead = data.data.groupInfo
          this.groupList = data.data.list
          this.groupNavDate = data.data.groupInfo.groupNavDate.substring(4, 6) + '-' + data.data.groupInfo.groupNavDate.substring(6, data.data.groupInfo.groupNavDate.length)
          this.groupNavDateAll = data.data.groupInfo.groupNavDate.substring(0, 4) + '-' + data.data.groupInfo.groupNavDate.substring(4, 6) + '-' + data.data.groupInfo.groupNavDate.substring(6, data.data.groupInfo.groupNavDate.length)
          this.setUpDate = data.data.groupInfo.setUpDate.substring(0, 4) + '-' + data.data.groupInfo.setUpDate.substring(4, 6) + '-' + data.data.groupInfo.setUpDate.substring(6, data.data.groupInfo.setUpDate.length)
          // this.pieLine()
        } else {
          // console.log(data)
        }
      })
    },
    queryCJGroupTranSferRecord() {
      let obj = {
        groupCode: this.groupCode,
        beginDate:'20180101'
      }
      this.$http.post(mianUrlt9 + 'fund/queryGroupTransferRecord', obj, { emulateJSON: true }).then(({ data }) => {
        if (data.retCode === '0') {
          // console.log(data.data)
          // for (let i = 0; i < data.data.list.length; i++) {
          //   let obj1 = {}
          //   let strnew
          //   let end = data.data.list[i].actionText.indexOf('：')
          //   if (end === -1) {
          //     strnew = data.data.list[i].actionText
          //   }
          //   strnew = data.data.list[i].actionText.substring(end + 1, data.data.list[i].actionText.length)
          //   // console.log(data.data.list[i].annDate)
          //   let fundList = strnew.substring(0, strnew.length - 1).split('%')
          //   obj1.list = []
          //   obj1.datenew = data.data.list[i].annDate
          //   // console.log(fundList)
          //   for (let j = 0; j < fundList.length; j++) {
          //     if (fundList[j] === '') {
          //       continue
          //     }
          //     let obj2 = {}
          //     let start = fundList[j].indexOf('（')
          //     // console.log(start);
          //     obj2.fundName = fundList[j].substring(0, start)
          //     obj2.fundCode = fundList[j].substring(start + 1, start + 7)
          //     obj2.proportion = fundList[j].substring(start + 8, fundList[j].length + 1)
          //     if (obj2.fundName.indexOf('，') === 0 || obj2.fundName.indexOf(',') === 0) {
          //       obj2.fundName = obj2.fundName.substring(1, obj2.fundName.length)
          //     }
          //     obj1.list.push(obj2)
          //   }
          //   this.GroupTranSferList.push(obj1)
          // }
          for (var i in data.data) {
            let obj = {}
            obj.list = []
            obj.datenew = i
            for (var j = 0; j < data.data[i].length; j++) {
              let list1 = {}
              list1.fundName = data.data[i][j].fundName
              list1.proportion = (Number(data.data[i][j].positionProportion) * 100).toFixed(2)
              list1.fundCode = data.data[i][j].fundCode
              // list1.fundType = data.data.proportionInfo[1][i][j].fundtype
              obj.list.push(list1)
            }
            this.GroupTranSferList.push(obj)
          }
          this.GroupTranSferList = this.GroupTranSferList.reverse()
          // this.jilu = this.GroupTranSferList[this.GroupTranSferList.length - 1].list
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
    getGroupnav(val) {
      let obj1 = {
        fdGroupCode: this.groupCode,
        startType: val
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
      this.$http.post(mianUrlt9 + '/fund/groupFundChart', obj1, { emulateJSON: true }).then(({ data }) => {
        // console.log(data)
        if (data.retCode === '0') {
          let navList = data.data.yfnavTurnRatioList
          let sh300List = data.data.ysDqCloseList
          for (let i = 0; i < navList.length; i++) {
            navList[i] = Number(navList[i])
          }
          for (let i = 0; i < sh300List.length; i++) {
            sh300List[i] = Number(sh300List[i])
          }
          this.yf = Number(data.data.yfnavTurnRatioList[(data.data.yfnavTurnRatioList.length - 1)]).toFixed(2)
          this.yf_format = this.yf > 0 ? '+' + this.yf : this.yf
          this.ys = Number(data.data.ysDqCloseList[(data.data.ysDqCloseList.length - 1)]).toFixed(2)
          this.ys_format = this.ys > 0 ? '+' + this.ys : this.ys
          this.navList = navList
          this.sh300List = sh300List
          this.date = joinData(data.data.xtradeDtList)
          this.interval = parseInt(data.data.xtradeDtList.length / 2)
          this.getFundnavData = data.data
          this.fundday = Number(data.data.yfnavTurnRatioList[(data.data.yfnavTurnRatioList.length - 1)]).toFixed(2)
          // this.textZ = '七日年化收益'
          this.drawline()
        }
      })
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
    that.queryZNGroupInfo()
    that.queryGroupHistoryNav()
    that.queryCJGroupTranSferRecord()
    that.getGroupnav(0)
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
  border-top: 1px solid @ai-line-color;
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

.fundInfo_full_box1 {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: start;
  -webkit-align-items: flex-start;
  align-items: start;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
}

.groupList_box {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-align: center;
  -webkit-align-items: center;
  align-items: center;
  padding: 5px 10px;
  font-size: 14px;
  border-bottom: 1px solid @ai-line-color;
}

.groupListLeft {
  font-family: 'vux-demo';
  font-size: 20px;
  color: #f35833;
}

.groupListCenter {
  flex: 1;
  margin-left: 8px;
}

.groupListRight {
  width: 80px;
}

.fundInfo_full_box1 img {
  width: 16px;
  height: 16px;
  display: block;
  margin-top: 2px;
}

.fundInfo_full_box1 p {
  font-size: 13px;
  margin-left: 10px;
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
  border-right: 1px solid @ai-line-color;
}

.fundInfo_full_box img {
  width: 16px;
  height: 16px;
  display: block;
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
  font-size: @fontTitleSize;
  ;
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

.detail_box {}

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
  background: #ff5e34;
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
  flex: 1;
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

.vux-tab .vux-tab-item.vux-tab-selected {
  color: @tabbtnColor;
  border-bottom: 3px solid @tabbtnColor;
}

.vux-button-group>a.vux-button-group-current {
  color: @tabbtnFontColor;
  background: @tabbtnColor;
}

.dipper1-record {
  padding: 10px;
  border-bottom: 1px solid @ai-line-color;
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

.vux-table td:before,
.vux-table th:before {
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

.vux-table td:after,
.vux-table th:after {
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
