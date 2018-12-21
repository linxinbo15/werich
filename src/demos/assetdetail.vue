<template>
  <div class="assdetail">
    <h2 class="assdetailh2">{{groupname}}</h2>
    <div class="list">
      <h2 class="total">{{money}}</h2>
      <p class="listp">总资产(元)</p>
      <ul class="zichan">
        <li>
          <h2
            :class="{'jian':Number(holdincomerate) < 0 ,'add':Number(holdincomerate) >= 0}">{{holdincomerate}}%</h2>
          <p>持有收益率</p>
        </li>
        <li style="border-left:solid 1px #f5f5f5;border-right:solid 1px #f5f5f5;">
          <h2 :class="{'jian':Number(holdincome) < 0 ,'add':Number(holdincome) >= 0}">{{holdincome}}</h2>
          <p>持有收益(元)</p>
        </li>
        <li>
          <h2 :class="{'jian':Number(dayIncome) < 0 ,'add':Number(dayIncome) >= 0}">{{dayIncome}}</h2>
          <p>日收益(<span>{{date}}</span>)</p>
        </li>
      </ul>
    </div>
    <div class="zichanbox">
      <h2 class="zichanboxh2">投资基金</h2>
      <div class="listbox" v-for='item in singlelist'>
        <div>
          <h2 class="list_box_title">{{item.fundname}}</h2>
          <p class="list_box_span">持仓市值：{{item.market}}元</p>
        </div>
        <div class="list_box_flex">
          <h2
            :class="{'list_box_title jian textalgin':Number(item.day) < 0 ,'list_box_title add textalgin':Number(item.day) >= 0}">
            {{item.day}}元
          </h2>
          <p class="list_box_span textalgin">日收益(元)</p>
        </div>
      </div>
    </div>
    <div class="tiao" @click='grouprecord()'><h2>收益记录</h2><img src="../assets/san1.png"></div>
    <div class='tiaobox' v-show='flag'>
      <!--<h2 class='tiao'>调仓记录</h2>-->
      <div class="tiao"><h2>调仓记录</h2><img src="../assets/san1.png"></div>
      <ul>
        <li v-for='item in tiaocang'>
          <span>{{item.date}}</span><span>{{item.name}}</span><span>{{item.proportion}}%</span>
        </li>
      </ul>
    </div>
    <tabbar v-transfer-dom>
      <tabbar-item @on-item-click="oneback()">
        <a slot="label">一键赎回</a>
      </tabbar-item>
      <tabbar-item v-show='show' :class="{'unable':isTransfer == 0 ,'able':isTransfer == 1}"
                   @on-item-click="transfer()">
        <a slot="label">一键调仓</a>
      </tabbar-item>
      <tabbar-item @on-item-click="addbuy()">
        <span slot="label">追加购买</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>
<script>
  import {mianUrlt9} from '../vuex/api'
  import {Toast, Tabbar, TabbarItem, TransferDom, numberComma} from 'vux'

  export default {
    directives: {
      TransferDom
    },
    data() {
      return {
        groupname: this.$route.query.name,
        id: this.$route.query.id,
        costmoney: this.$route.query.costmoney,
        holdincome: this.$route.query.holdincome,
        groupid: this.$route.query.groupid,
        money: numberComma(this.$route.query.money), // 持仓市值
        holdincomerate: '', // 收益率
        dayIncome: '', // 昨日收益
        date: '',
        singlelist: [], // 单只基金收益列表
        flag: true, // 策略显示调仓记录，组合不显示
        tiaocang: [], // 调仓列表，
        fundnameold: '', // 持仓基金名称
        strings: '', // 小富即安调仓信号返回信息
        isTransfer: 0, // 是否可调仓
        show: false     // 除了小富即安，组合的一键调仓按钮不显示
      }
    },
    components: {
      Toast,
      Tabbar,
      TabbarItem,
      TransferDom
    },
    mounted() {
      this.getdata()
      // if (this.groupid == 'LOFR2') {
      // this.gettiaocang()
      // this.gettransfer()
      // } else {
      // this.show = false
      // this.flag = false
      // }
    },
    methods: {
      back() {
        this.$router.back()
      },
      getdata() {
        this.$http.post(mianUrlt9 + 'user/groupHoldingDetail', {
          costMoney: this.costmoney,
          groupId: this.groupid,
          holdingIncome: this.holdincome,
          id: this.id,
          totalFundMarketValue: this.money
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.holdincomerate = res.data.data.holdingIncomeRate
            this.dayIncome = res.data.data.totalDayIncome
            this.date = res.data.data.navDate.substring(4)
            if (this.groupid === 'LOFR2') {
              this.fundnameold = res.data.data.singleInfoList[0].fundName
            }
            for (let i = 0; i < res.data.data.singleInfoList.length; i++) {
              let obj = {}
              obj.day = res.data.data.singleInfoList[i].dayIncome
              obj.fundname = res.data.data.singleInfoList[i].fundName
              obj.market = res.data.data.singleInfoList[i].fundMarketValue
              this.singlelist.push(obj)
            }
          } else if (res.data.retCode === '990103') {
            this.$vux.toast.text('系统正在维护，请稍后再试', 'middle', 3000)
          } else if (res.data.retCode === '990104') {
            this.$vux.toast.text('服务器内部错误', 'middle', 3000)
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      grouprecord() {
        this.$router.push({
          path: '/component/assetrecord',
          query: {id: this.id}
        })
      },
      gettiaocang() {
        this.$http.post(mianUrlt9 + 'fund/queryTacticsProportionInfo', {
          tacticsCode: this.groupid
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            for (let i = 0; i < res.data.data.proportionInfo.length; i++) {
              let obj = {}
              obj.date = res.data.data.proportionInfo[i].transferDate
              obj.name = res.data.data.proportionInfo[i].fundName
              obj.proportion = Number(res.data.data.proportionInfo[i].positionProportion) * 100
              this.tiaocang.push(obj)
            }
          }
        })
      },
      gettransfer() { // 获取调仓信号
        this.$http.post(mianUrlt9 + 'fund/transferSignal', {
          tacticsCode: 'LOFR2',
          groupFundBuyId: this.id
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            if (res.data.data.isTransfer === '1') {
              this.strings = res.data.data.strings
              this.isTransfer = 1
            }
          }
        })
      },
      transfer() { // 跳转调仓页面
        if (this.groupid === 'LOFR2' && this.isTransfer === 1) {
          this.$router.push({
            path: '/transfer',
            query: {fundnameold: this.fundnameold, id: this.id, strings: this.strings}
          })
        }
      },
      oneback() {
        this.$router.push({
          path: '/component/redeem-group',
          query: {groupFundBuyId: this.id, fundgroupname: this.groupname}
        })
      },
      addbuy() {
        this.$router.push({
          path: '/component/buy-group',
          query: {groupId: this.groupid, groupname: this.groupname}
        })
      }
    }
  }

</script>
<style lang="less" scoped>
  @import '../styles/custom.less';

  ol, ul, li {
    list-style: none outside none;
  }

  .assdetail .list {
    background: #fff;
    padding: 10px;
    text-align: center;
  }

  .assdetailh2 {
    font-weight: normal;
    font-size: 16px;
    text-align: left;
    line-height: 40px;
    padding-left: 15px;
    border-top: 1px solid @ai-line-color;
    border-bottom: 1px solid @ai-line-color;
    background-color: #fff;
  }

  .assdetail .list .total {
    font-size: 20px;
    color: #000;
  }

  .listp {
    font-size: 14px;
    color: #888888;
    line-height: 20px;
  }

  .assdetail .list .zichan {
    overflow: hidden;
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    flex-direction: row;
    -webkit-box-orient: horizontal;
    -moz-box-orient: horizontal;
    box-orient: horizontal;
    margin-top: 10px;
  }

  .assdetail .list .zichan li {
    text-align: center;
    flex: 1;
    -moz-box-flex: 1;
    -ms-flex: 1;
    color: #808080;
  }

  .assdetail .list .zichan li h2 {
    font-size: 20px;
    font-weight: normal;
  }

  .assdetail .list .zichan li p {
    font-size: 12px;
  }

  .zichanbox {
    background: #fff;
    margin-top: 10px;
  }

  .zichanboxh2 {
    font-size: 16px;
    line-height: 40px;
    padding: 0 15px;
    border-bottom: solid 1px #F5F5F5;
  }

  .listbox {
    overflow: hidden;
    padding: 15px;
    border-bottom: solid 1px #f5f5f5;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    background-color: #fff;
  }

  .list_box_flex {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
  }

  .list_box_title {
    font-size: 14px;
    line-height: 28px;
    font-weight: normal;
  }

  .list_box_span {
    color: #999;
    font-size: 12px;
  }

  .textalgin {
    text-align: right;
  }

  .add {
    color: @redfont;
  }

  .jian {
    color: @greenfont;
  }

  .tiao {
    background: #fff;
    margin-top: 10px;
    padding: 0px 15px;
    line-height: 42px;
    overflow: hidden;
    position: relative;
  }

  .tiao h2 {
    font-size: 16px;
    float: left;
    font-weight: normal;
  }

  .tiao span {
    font-size: 12px;
  }

  .tiao img {
    width: 7.2px;
    height: auto;
    position: absolute;
    top:50%;
    margin-top: -10px;
    right: 15px;
  }

  .assdetail .bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
  }

  .assdetail .bottom ul {
    display: -webkit-box;
    display: -webkit-flex;
    display: -ms-flexbox;
    display: flex;
    flex-direction: row;
    -webkit-box-orient: horizontal;
    -moz-box-orient: horizontal;
    box-orient: horizontal;
    width: 100%;
  }

  .assdetail .bottom ul li {
    flex: 1;
    -moz-box-flex: 1;
    -ms-flex: 1;
    font-size: 12.5px;
    text-align: center;
    line-height: 40px;
  }

  .assdetail .bottom ul li:nth-of-type(1) {
    background: #fff;
    color: #ff9900;
  }

  .assdetail .unable {
    background: #f9f9f9;
    color: #999;
  }

  .assdetail .able {
    background: #fff;
    color: #6d1786;
  }

  .assdetail .bottom ul li:nth-of-type(3) {
    background: #ff9900;
    color: #fff;
  }

  .assdetail .tiaobox {
    background: #fff;
  }

  .assdetail .tiaobox h2 {
    font-size: 16px;
  }

  .assdetail .tiaobox ul {
    font-size: 11px;
  }

  .assdetail .tiaobox ul li {
    line-height: 20px;
  }

  .assdetail .tiaobox ul li span {
    display: inline-block;
    width: 33%;
    text-align: center;
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

  .weui-tabbar__item:nth-child(3) {
    background-color: @tabbtnColor;
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
