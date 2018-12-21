<template>
  <div>
    <!--<div style="padding: 10px;">
      <button-tab v-model="demo01">
        <button-tab-item @on-item-click="getGroupTradeList()">智能组合</button-tab-item>
        <button-tab-item @on-item-click="consoleIndex()">单只基金</button-tab-item>
      </button-tab>
    </div>-->
    <div class="topline">
    <tab :line-width=2 active-color='#0e75f6' v-model="index">
      <tab-item class="vux-center" v-for="(item, index) in list2" @on-item-click="onItemClick(index)" :key="index">
        {{item}}
      </tab-item>
    </tab>
    </div>
    <div class="nt_content" v-show="grouporfund == 1">
      <ul class="nt_box" v-show='datagroup.length != 0'>
        <li class="nt_cont" v-for='item in datagroup' @click="goTradeDetail(item.id,item.groupName)">
          <!--<router-link class="linktext" :to="">-->
          <div class="ma_contL clearfix">
            <div><span class="ma_contL1">{{item.groupName}}</span><span class="ma_contL2">{{item.groupCode}}</span>
            </div>
            <div class="ma_contL3"><span style="color: #ff9900">{{item.businessName}}</span><span
              style="padding-left: 5px;"> {{item.createTime}}</span></div>
          </div>
          <div class="ma_contR clearfix">
            <div class="ma_valueAdd">{{item.applyAmount}}<span class="ma_fontM">{{item.word}}</span></div>
            <div class="ma_contRb">{{item.statusText}}</div>
          </div>
          <!--</router-link>-->
        </li>
      </ul>
      <div class="nt_noData" v-show='datagroup.length == 0'>
        <img src="../assets/null.png">
        <h3>你的交易记录为空</h3>
      </div>
    </div>
    <div class="nt_content" v-show="grouporfund == 0">
      <ul class="nt_box" v-show='data.length != 0'>
        <li class="nt_cont" v-for='item in data'>
          <div class="ma_contL clearfix">
            <div class="ma_contL0"><span class="ma_contL1">{{item.name}}</span><span
              class="ma_contL2">{{item.code}}</span></div>
            <div class="ma_contL3"><span>{{item.date}}</span></div>
          </div>
          <div class="ma_contR clearfix">
            <div class="ma_valueAdd">{{item.money}}<span class="ma_fontM">{{item.word}}</span></div>
            <div class="ma_contRb">{{item.status}}</div>
          </div>
        </li>
      </ul>
      <div class="nt_noData" v-show='data.length == 0'>
        <img src="../assets/null.png">
        <h3>你的交易记录为空</h3>
      </div>
    </div>
    <!--</scroll>-->
    <toast v-model="showPositionValue" type="text" :time="800" width="18em" is-show-mask :text="toastText"
           :position="position"></toast>
  </div>
</template>

<script>
  import {Tab, TabItem, Toast, ButtonTab, ButtonTabItem, Divider} from 'vux'
  import {mianUrlt9} from '../vuex/api'

  export default {
    components: {
      Tab,
      TabItem,
      Toast,
      ButtonTab,
      ButtonTabItem,
      Divider
    },
    mounted () {
      this.getGroupTradeList()
      // this.getlist()
    },
    methods: {
      consoleIndex () {
        console.log('click demo01', this.demo01)
      },
      goTradeDetail (id, name) {
        this.$router.push({
          path: '/component/tradefund',
          query: {groupFundBuyInfoId: id, groupname: name}
        })
        // {path:'/component/trarefund',query: {groupFundBuyInfoId:item.id,groupname:item.groupName}}
      },
      onItemClick (index) {
        if (index === 0) {
          this.getGroupTradeList()
        } else if (index === 1) {
          let num = 22
          this.getFundTradeList(num)
        } else if (index === 2) {
          let num = 24
          this.getFundTradeList(num)
        } else if (index === 3) {
          let num = 36
          this.getFundTradeList(num)
        } else if (index === 4) {
          let num = 39
          this.getFundTradeList(num)
        } else if (index === 5) {
          let num = 29
          this.getFundTradeList(num)
        }
      },
      getGroupTradeList () {
        this.grouporfund = 1
        let obj = {}
        this.$http.post(mianUrlt9 + 'user/groupTradRecord', obj, {emulateJSON: true}).then((res) => {
          // console.log(res)
          if (res.data.retCode === '0') {
            this.datagroup = []
            if (res.data.data.tradeList.length === 0) {
              this.datagroup = []
            } else {
              for (let i = 0; i < res.data.data.tradeList.length; i++) {
                if (res.data.data.tradeList[i].status === '0') {
                  res.data.data.tradeList[i].statusText = '在途中'
                } else if (res.data.data.tradeList[i].status === '1') {
                  res.data.data.tradeList[i].statusText = '已完成'
                } else if (res.data.data.tradeList[i].status === '2') {
                  res.data.data.tradeList[i].statusText = '确认失败'
                } else if (res.data.data.tradeList[i].status === '5') {
                  res.data.data.tradeList[i].statusText = '已撤单'
                } else if (res.data.data.tradeList[i].status === '9') {
                  res.data.data.tradeList[i].statusText = '撤单已回款'
                } else {
                  res.data.data.tradeList[i].statusText = '已完成'
                }
                if (res.data.data.tradeList[i].applyAmount === '') {
                  res.data.data.tradeList[i].applyAmount = '全部'
                  res.data.data.tradeList[i].word = '份额'
                  res.data.data.tradeList[i].businessName = '赎回'
                } else {
                  if (res.data.data.tradeList[i].businessCode === '22') {
                    res.data.data.tradeList[i].businessName = '申购'
                    res.data.data.tradeList[i].word = '元'
                  } else if (res.data.data.tradeList[i].businessCode === '24') {
                    res.data.data.tradeList[i].businessName = '赎回'
                    res.data.data.tradeList[i].word = '份额'
                  }
                  // console.log(this.datagroup)
                }
                this.datagroup.push(res.data.data.tradeList[i])
              }
            }
          } else if (res.data.retCode === '990101') {
            this.datagroup = []
            this.toastText = res.data.retMsg
            this.showPosition('middle')
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
            })
          } else if (res.data.retCode === '990102') {
            this.datagroup = []
            this.toastText = res.data.data[0].field + '' + res.data.data[0].message
            this.showPosition('middle')
          } else if (res.data.retCode === '990103') {
            this.datagroup = []
            this.toastText = '系统正在维护，请稍后再试'
            this.showPosition('middle')
          } else if (res.data.retCode === '990104') {
            this.toastText = '服务器内部错误'
            this.showPosition('middle')
          } else {
            this.datagroup = []
            this.toastText = res.data.retMsg
            this.showPosition('middle')
          }
        })
      },
      getFundTradeList (val) {
        this.grouporfund = 0
        let num = val
        this.flag = false
        this.$http.post(mianUrlt9 + 'user/singleTradRecord', {
          businessCode: num,
          startDate: '19000101',
          endDate: '20191231',
          page: 1,
          rows: 100
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.data = []
            if (res.data.data.list.length === 0) {
              this.data = []
              this.flag = true
            }
            for (let i = 0; i < res.data.data.list.length; i++) {
              let obj = {}
              obj.code = res.data.data.list[i].fundCode
              obj.name = res.data.data.list[i].fundName
              // obj.status = this.zhuangtai(res.data.data.tradeList[i].routeFlag)
              obj.date = res.data.data.list[i].transactionDate
              if (num === 43) {
                if (res.data.data.list[i].confirmedAmount === '0.00') {
                  obj.money = res.data.data.list[i].confirmedVol
                  obj.word = '份'
                } else {
                  obj.money = res.data.data.list[i].confirmedAmount
                  obj.word = '元'
                }
                obj.status = this.zhuangtai(res.data.data.list[i].routeFlag)
              } else if (num === 22) {
                if (res.data.data.list[i].routeFlag === '1') { // 已确认
                  if (res.data.data.list[i].status === '05' || res.data.data.list[i].status === '5') {
                    obj.status = '已撤单'
                    obj.money = res.data.data.list[i].applicationAmount
                  } else if (res.data.data.list[i].status === '09' || res.data.data.list[i].status === '9') {
                    obj.status = '撤单已回款'
                    obj.money = res.data.data.list[i].applicationAmount
                  } else {
                    obj.status = this.zhuangtai(res.data.data.list[i].routeFlag)
                    obj.money = res.data.data.list[i].confirmedAmount
                  }
                  obj.word = '元'
                } else { // 在途
                  obj.status = this.zhuangtai(res.data.data.list[i].routeFlag)
                  obj.money = res.data.data.list[i].applicationAmount
                  obj.word = '元'
                }
              } else if (num === 24 || num === 36) {
                if (res.data.data.list[i].routeFlag === '1') { // 已确认
                  if (res.data.data.list[i].status === '05' || res.data.data.list[i].status === '5') {
                    obj.status = '已撤单'
                    obj.money = res.data.data.list[i].applicationVol
                    obj.word = '份'
                  } else if (res.data.data.list[i].status === '09' || res.data.data.list[i].status === '9') {
                    obj.status = '撤单已回款'
                    obj.money = res.data.data.list[i].applicationVol
                    obj.word = '份'
                  } else {
                    obj.status = this.zhuangtai(res.data.data.list[i].routeFlag)
                    obj.money = res.data.data.list[i].confirmedAmount
                    obj.word = '元'
                  }
                } else { // 在途
                  obj.status = this.zhuangtai(res.data.data.list[i].routeFlag)
                  obj.money = res.data.data.list[i].applicationVol
                  obj.word = '份'
                }
              } else {
                obj.status = this.zhuangtai(res.data.data.list[i].routeFlag)
                obj.money = res.data.data.list[i].applicationAmount
                obj.word = '元'
              }
              this.data.push(obj)
            }
          } else if (res.data.retCode === '990101') {
            this.data = []
            this.toastText = res.data.retMsg
            this.showPosition('middle')
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
            })
          } else if (res.data.retCode === '990102') {
            this.data = []
            this.toastText = res.data.data[0].field + '' + res.data.data[0].message
            this.showPosition('middle')
          } else if (res.data.retCode === '990103') {
            this.data = []
            this.toastText = '系统正在维护，请稍后再试'
            this.showPosition('middle')
          } else if (res.data.retCode === '990104') {
            this.toastText = '服务器内部错误'
            this.showPosition('middle')
          } else {
            this.data = []
            this.toastText = res.data.retMsg
            this.showPosition('middle')
          }
        })
      },
      showPosition (position) {
        this.position = position
        this.showPositionValue = true
      },
      zhuangtai (index) {
        let type = ''
        if (index === '1') {
          type = '已成功'
        } else if (index === '0') {
          type = '申请中'
        } else if (index === '2') {
          type = '交易失败'
        }
        return type
      }
    },
    data () {
      return {
        demo01: 0,
        datagroup: [],
        data: [],
        grouporfund: 1,
        list2: ['智能组合', '认/申购', '赎回', '转换', '定投', '其他'],
        index: 0,
        position: 'default',
        toastText: '加入自选成功！',
        showPositionValue: false
      }
    }
  }
</script>
<style lang='less'>
  @import '~vux/src/styles/1px.less';
  @import '../styles/custom.less';

  .nt_noData {
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #ffffff;
    padding: 10px;
    border-top: 1px solid @ai-line-color;
    border-bottom: 1px solid @ai-line-color;
  }

  .topline{
    border-top: 0.5px solid @ai-line-color;
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

  .flex-demo {
    text-align: center;
    color: #6272af;
    font-size: 16px;
    border-radius: 4px;
    background-clip: padding-box;
    padding: 10px 0;
  }

  .nt_content {
    background: #fff;
    /*margin-top: 1rem;*/
    position: relative;
    left: 0;
    overflow: hidden;
    width: 100%;
  }

  .nt_cont {
    padding: 10px;
    border-bottom: 1px solid #f5f5f5;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    color: #222222;
  }

  .ma_contL {
    -webkit-box-flex: 2;
    -webkit-flex: 2;
    flex: 2;
  }

  .ma_contR {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
  }

  .ma_contL .ma_contL1 {
    font-size: 16px;
    margin-right: 5px;
  }

  .nt_cont span {
    display: inline-block;
    font-size: 14px;
  }

  .linktext {
    color: #222222;
  }

  .ma_contL .ma_contL2 {
    font-size: 12px;
    color: #adadad;
  }

  .ma_valueAdd {
    font-size: 16px;
    margin-bottom: 5px;
    text-align: right;
  }

  .ma_valueAdd .ma_fontM {
    font-size: 14px;
  }

  .ma_contR .ma_contRb {
    font-size: 14px;
    float: right;
    color: #ff8d0a;
  }


</style>
