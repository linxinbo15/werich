<template>
  <div style="background:#f3f3f3">
    <div style="text-align:center;background:#fff;">
      <div class="ma_headCon">
        <a id="ma_yetGain">
          <span>{{total}}</span>
          <p>总资产(元)</p>
        </a>
      </div>
      <div class="vux-circle-demo">
        <div style='width:100px;height:100px;'>
          <x-circle :percent="Number(Number(percent).toFixed(2))" :stroke-width="6" :trail-width="6" :stroke-color="['#b821ff', '#3464ff']"
                    trail-color="#ececec">
            <span :style="sty">{{Number(percent).toFixed(2)}}%</span>
          </x-circle>
        </div>
        <p style="color:#808080;font-size:14px;line-height: 24px;">预计{{enddate}}完成目标</p>
        <p style="color:#ff5e34;font-size:14px;line-height: 24px;" v-show="sync == '0'">定投协议已终止</p>
      </div>
      <section class="ma_conH">
        <ul class="clearfix">
          <li style="border:none;">
            <p class="ma_num">{{dream}}</p>
            <p class="ma_font">目标金额(元)</p>
          </li>
          <li>
            <p :class="{'ma_num red':shouyi>=0,'ma_num green':shouyi<0}">{{Number(shouyi).toFixed(2)}}</p>
            <p class="ma_font">持有收益(元)</p>
          </li>
          <li>
            <p :class="{'ma_num red':dayshouyi>=0,'ma_num green':dayshouyi<0}">{{Number(dayshouyi).toFixed(2)}}</p>
            <p class="ma_font">日收益(元)({{dayDate}})</p>
          </li>
        </ul>
      </section>
    </div>
    <group>
      <cell title="投资基金" value="调仓记录" is-link></cell>
    </group>
    <div class="zichanbox">
      <!--<ul class="listbox" v-for='item in singlelist'>
        <li><span>{{item.fundname}}</span><span>{{item.market}}<br>日收益<a
          :class="{'jian':Number(item.day) < 0 ,'add':Number(item.day) >= 0}">{{item.day}}</a></span></li>
      </ul>-->
      <div class="listbox" v-for='item in singlelist'>
        <div>
          <div class="list_box_title">{{item.fundname}}</div>
          <div class="list_box_span">持仓市值：{{item.market}}元</div>
        </div>
        <div class="list_box_flex">
          <div
            :class="{'list_box_title jian textalgin':Number(item.day) < 0 ,'list_box_title add textalgin':Number(item.day) >= 0}">
            {{item.day}}
          </div>
          <div class="list_box_span textalgin">日收益(元)</div>
        </div>
      </div>
      <!-- <ul> -->
      <!--  <ul>
           <li><span>富国低碳环保</span><span>1000<br>日收益<a class='add'>-10</a></span></li>
       </ul> -->
    </div>
    <group>
      <cell title="交易记录" value="" is-link></cell>
    </group>
    <div class="tradebox">
      <!-- <ul>
            <li>
                <span>分红</span>
                <span>
                    <p>富国低碳环保</p>
                    <p>2018-09-09</p>
                </span>
                <span>
                  <p>16.50元</p>
                  <p>现金分红</p>
                </span>
            </li>
        </ul> -->
      <ul>
        <li v-for='item in traderecord'>
          <span>{{item.type}}</span>
          <span>
             <p>{{item.fundname}}</p>
             <p>{{item.date}}</p>
           </span>
          <span>
             <p>{{item.money}}</p>
           </span>
        </li>
      </ul>
    </div>

    <popup v-model="show13" height="270px" is-transparent :popup-style='yangshi' v-transfer-dom>
      <div style="width: 100%;background-color:#fff;height:250px;margin:0 auto;border-radius:5px;padding-top:10px;">
       <!--  <group>
          <cell title="" value="修改计划"></cell>
          <cell title="" value="暂停计划"></cell>
        </group> -->
        <div style="padding:20px 15px;">
          <!-- <x-button type="primary">修改计划</x-button> -->
          <!-- <x-button type="primary">暂停计划</x-button> -->
          <x-button type="primary" @click.native='stop()' disabled='able'>终止计划</x-button>
          <x-button @click.native="show13 = false">取消</x-button>
        </div>
      </div>
    </popup>

    <tabbar v-transfer-dom>
      <tabbar-item @on-item-click="show()">
        <a slot="label">计划管理</a>
      </tabbar-item>
      <tabbar-item @on-item-click="sell()">
        <a slot="label">一键赎回</a>
      </tabbar-item>
    </tabbar>

  </div>

</template>
<script>
  import {XCircle,Confirm, Range, Icon, Group, Cell, Toast, CellBox, XButton, Tabbar, TabbarItem, Popup,TransferDom,numberComma} from 'vux'
  import { mianUrlt9, getBussessName } from '../vuex/api'
  import ToggleText from './ToggleText'
  import {getLocalStorage} from '../vuex/storage'
  export default {
    directives: {
      TransferDom
    },
    components: {
      XCircle,
      Confirm,
      Range,
      Icon,
      Group,
      Cell,
      Toast,
      CellBox,
      XButton,
      Tabbar,
      TabbarItem,
      Popup,
      ToggleText,
      TransferDom
    },
    mounted () {
      this.getasset()
      // this.getlist()
    },
    data () {
      return {
        sty: {
          color: '#ff5e34',
          fontSize: '20px'
        },
        yangshi: {
          width: '95%',
          height: '150px',
          left: '2.5%',
          bottom: '2.5%',
          margin: '0px auto',
          borderRadius: '5px',
          paddingTop: '10px',
          position: 'fixed'
        },
        show13: false,
        total: 0,
        dream: 0,
        percent: 0,
        enddate: '2019-01-01',
        dayDate: '01-01',
        shouyi: 0,
        dayshouyi: 0,
        singlelist: [],
        traderecord: [],
        planno: this.$route.query.planno,
        debitacc:this.$route.query.debitacc,
        sync:this.$route.query.sync,          //是否终止标志位
        able:false,
        id:'',
        fundcode:''
      }
    },
    methods: {
      stop(){

        let that = this
        this.$vux.confirm.show({
          title: '确定终止计划吗?',
          content: '终止计划将使您的目标无法达成，终止后可在资产中查看资金',
          onCancel () {
            console.log('plugin cancel')
          },
          onConfirm () {
            that.$http.post(mianUrlt9 + 'fund/stopAutoInvestPlan', {
               buyPlanNo: that.planno
             }, {emulateJSON: true}).then((res) => {
                if (res.data.retCode === '0') {
                  that.$vux.toast.text('终止计划成功', 'middle', 3000)
                  that.$router.push({
                    path: '/component/invplan'
                   })
                } else {
                  const msg = res.data.retMsg
                  that.$vux.toast.text(msg, 'middle', 3000)
                }
           })
          }
        })
      },
      sell(){             //一键赎回
        const Tel = getLocalStorage('Tel')
        if (Tel == null || Tel === '') {
          this.$router.push({
            path: '/component/login',
            query: {path: this.$route.fullPath}
          })
        } else {
          const obj = {
            fundCode: this.fundcode.substring(0,6),
            buyPlanNo: this.planno,
            isAutoInvestSell:'true'
          }
          this.$http.post(mianUrlt9 + 'fund/beforeAutoInvestSell', obj, {emulateJSON: true}).then((res) => {
            if (res.data.retCode === '0') {
              // console.log(res)
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
                  singleOneAssetId: this.id,
                  isAutoInvestSell:'true'
                }
              })
            } else if (res.data.retCode === '990101') {
              this.$vux.toast.text(res.data.retMsg, 'middle', 3000)
              this.$router.push({
                path: '/component/login',
                query: {path: this.$route.fullPath}
              })
            } else if (res.data.retCode === '990102') {
              var msg = res.data.data[0].field + '' + res.data.data[0].message
              this.$vux.toast.text(msg, 'middle', 3000)
            } else if (res.data.retCode === '990103') {
              this.$vux.toast.text('系统正在维护，请稍后再试', 'middle', 3000)
            } else if (res.data.retCode === '990104') {
              this.$vux.toast.text('服务器内部错误', 'middle', 3000)
            } else {
              this.$vux.toast.text(res.data.retMsg, 'middle', 3000)
            }
          })
        }
      },
      show () {
        this.show13 = true
      },
      getasset () {
        if(this.sync == '0'){
          this.able= true
        }
        this.$http.post(mianUrlt9 + 'fund/assetCastsurely', {
          bankFlag: 'cjqf',
          buyPlanNo: this.planno
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.total = numberComma(Number(res.data.data.fundCastsurelySingleList[0].fundmarketvalue).toFixed(2))
            this.enddate = res.data.data.fundCastsurelySingleList[0].endDate.substring(0, 4) + '-' + res.data.data.fundCastsurelySingleList[0].endDate.substring(4, 6) + '-' + res.data.data.fundCastsurelySingleList[0].endDate.substring(6, 8)
            this.dream = numberComma(Number(res.data.data.fundCastsurelySingleList[0].dreamMoney))
            this.shouyi = Number(res.data.data.fundCastsurelySingleList[0].floatprofit)
            this.dayshouyi = Number(res.data.data.fundCastsurelySingleList[0].fundmarketvalueUd)
            this.dayDate = res.data.data.fundCastsurelySingleList[0].navdate.substring(4, 6) + '-' + res.data.data.fundCastsurelySingleList[0].navdate.substring(6, 8)
            this.percent = (Number(res.data.data.fundCastsurelySingleList[0].fundmarketvalue)/Number(res.data.data.fundCastsurelySingleList[0].dreamMoney))*100
            this.id = res.data.data.fundCastsurelySingleList[0].id
            this.fundcode = res.data.data.fundCastsurelySingleList[0].fundcode
              if(res.data.data.fundCastsurelySingleList[0].sfyxScenePlan === '1'){
                var obj = {}
                obj.fundname = res.data.data.fundCastsurelySingleList[0].fundname
                obj.market = Number(res.data.data.fundCastsurelySingleList[0].fundmarketvalue).toFixed(2)
                obj.day = Number(res.data.data.fundCastsurelySingleList[0].fundmarketvalueUd).toFixed(2)
                this.singlelist.push(obj)
              }

            for (let i = 0; i < res.data.data.buyRecord.length; i++) {
              let obj = {}
              obj.type = getBussessName(res.data.data.buyRecord[i].businessCode)
              obj.fundname = res.data.data.buyRecord[i].fundName
              if(res.data.data.buyRecord[i].businessCode == '43'){
                obj.money = res.data.data.buyRecord[i].confirmedVol + '份'
              }else if(res.data.data.buyRecord[i].businessCode == '44'){
                obj.money = res.data.data.buyRecord[i].confirmedVol + '份'
              }else if(res.data.data.buyRecord[i].businessCode == '45'){
                obj.money = res.data.data.buyRecord[i].confirmedVol + '份'
              }else if(res.data.data.buyRecord[i].businessCode == '39'){
                obj.money = res.data.data.buyRecord[i].applicationAmount + '元'
              }else if(res.data.data.buyRecord[i].businessCode == '24'){
                obj.money = res.data.data.buyRecord[i].confirmedVol + '份'
              }

              obj.date = res.data.data.buyRecord[i].transactionDate
              // if (obj.buiness == "赎回" || obj.buiness == "转换") {
              //   if (obj.status == "已结束" || obj.status == "已确认" || obj.status == "待复核") {
              //     obj.money = res.data.data[i].confirmedVol + '份'
              //   } else {
              //    obj.money = res.data.data[i].applicationVol + '份'
              //   }
              // } else {
              //  if (obj.status == "已结束" || obj.status == "已确认" || obj.status == "已撤" || obj.status == "待复核") {
              //    obj.money = res.data.data[i].confirmedAmount + '元'
              //  } else {
              //    obj.money = res.data.data[i].applicationAmount + '元'
              //  }
              //  }
              this.traderecord.push(obj)
            }
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      getlist () {
        this.$http.post(mianUrlt9 + 'fund/assetCastsurely', {
          bankFlag: 'cjqf'
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            for (var i = 0; i < res.data.data.fundCastsurelySingleList.length; i++) {
              if(res.data.data.fundCastsurelySingleList[i].sfyxScenePlan === '1'){
                var obj = {}
                obj.fundname = res.data.data.fundCastsurelySingleList[i].fundname
                obj.market = res.data.data.fundCastsurelySingleList[i].fundmarketvalue
                obj.day = res.data.data.fundCastsurelySingleList[i].fundmarketvalueUd
                this.singlelist.push(obj)
              }
            }
          } else {
            var msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../styles/custom.less';

  .popup0 {
    padding-bottom: 15px;
    height: 200px;
  }

  .popup1 {
    width: 100%;
    height: 100%;
  }

  .popup2 {
    padding-bottom: 15px;
    height: 400px;
  }

  .position-vertical-demo {
    background-color: #ffe26d;
    color: #000;
    text-align: center;
    padding: 15px;
  }

  .position-horizontal-demo {
    position: relative;
    height: 100%;
    .vux-close {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%) scale(4);
      color: #000;
    }
  }

  .vux-circle-demo {
    text-align: center;
  }

  .vux-circle-demo > div {
    margin: 0 auto;
  }

  ol, ul, li {
    list-style: none outside none;
  }

  .ma_headCon {
    text-align: center;
  }

  .ma_headCon a {
    display: inline-block;
    width: 90%;
    height: 90%;
  }

  .ma_headCon span {
    width: 100%;
    color: #000;
    margin-top: 15px;
    font-size: 30px;
    display: block;
  }

  .ma_headCon p {
    width: 100%;
    color: #808080;
    font-size: 12px;
    margin-bottom: 15px;
  }

  .ma_conH {
    padding: 15px 10px;
    overflow: hidden;
  }

  .ma_conH ul li .ma_num {
    font-size: 18px;
    line-height: 1.5;
  }

  .ma_conH ul li .ma_font {
    font-size: 12px;
    line-height: 1.5;
    color: #808080;
  }

  .ma_conH ul {
    display: flex;
  }

  .ma_conH ul li {
    flex: 1;
    height: 100%;
    text-align: center;
    color: #000;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
  }

  .zichanbox {
    background: #fff;
    margin-bottom: 10px;
  }

  .zichanbox ul li {
    overflow: hidden;
    padding: 10px 15px;
    border-bottom: solid 1px #f5f5f5;
  }

  .zichanbox ul li span:nth-of-type(1) {
    float: left;
    font-size: 14px;
    color: #333;
  }

  .zichanbox ul li span:nth-of-type(2) {
    float: right;
    text-align: right;
    font-size: 14px;
  }

  .tradebox {
    background: #fff;
    margin-bottom: 10px;
  }

  .tradebox ul li {
    display: flex;
    padding: 10px 15px;
    border-bottom: solid 1px #edf0f4;
  }

  .tradebox ul li span:nth-of-type(1) {
    flex: 5;
    display: inline-block;
    color: #f03250;
  }

  .tradebox ul li span:nth-of-type(2) {
    flex: 10;
    text-align: left;
  }

  .tradebox ul li span:nth-of-type(2) p:nth-of-type(2) {
    color: #808080;
    font-size: 14px;
  }

  .tradebox ul li span:nth-of-type(3) {
    flex: 6;
    text-align: right;
  }

  .tradebox ul li span:nth-of-type(3) p:nth-of-type(2) {
    color: #808080;
    font-size: 14px;
  }

  .weui-tabbar {
    background: #fff;
  }

  .weui-tabbar__item.vux-tabbar-simple {
    border-right: solid 1px #edf0f4;
  }

  .weui-tabbar__label a {
    color: #ff9900;
    font-size: 16px;
  }

  .weui-tabbar__item {
    color: #ff9900;
    font-size: 14px;
  }

  .weui-tabbar .weui-tabbar__label a {
    line-height: 50px;
  }
  .red {
    color: @redfont;
  }

  .green {
    color: @greenfont;
  }

  .popup0 {
    padding-bottom: 15px;
    height: 200px;
  }

  .popup1 {
    width: 100%;
    height: 100%;
  }

  .popup2 {
    padding-bottom: 15px;
    height: 400px;
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
    line-height: 22px;
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

  .position-vertical-demo {
    background-color: #ffe26d;
    color: #000;
    text-align: center;
    padding: 15px;
  }

  .position-horizontal-demo {
    position: relative;
    height: 100%;
    .vux-close {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%) scale(4);
      color: #000;
    }
  }
</style>
