<template>
  <div class="single">
    <div style="background-color: #1d5ffc">
      <div class="ma_headCon">
        <p>总资产(元)</p>
        <h2>{{total}}</h2>
      </div>
    </div>
    <div class='box'>
      <h3 class="ma_h3">基金优选</h3>
    </div>
    <div class="ma_nav">
      <!--<ul class="ma_comb ma_nav">-->
      <div class="ma_content" v-for='(item,index) in singleConfirm' @click='assdetail(index)'>
        <div class="ma_contL">
          <h2>{{item.name}}</h2>
          <p>持仓金额(元)：<span :class="Number(item.money)>0?'up':'down'">{{item.money1}} 元</span></p>
        </div>
        <div class="ma_contR">
          <h2 :class="Number(item.shouyi)>0?'up':'down'">{{item.shouyi1}}</h2>
          <p class="ma_contRb">累计收益(元)</p>
        </div>
      </div>
      <!--       <div class="ma_content" v-for='item in singleTransit'>
              <div class="ma_contL">
                <h2>{{item.name}}<span class="ma_contL2"></span></h2>
                <p class="ma_contL3">申请金额(元)：<span>{{item.money}}</span></p>
              </div>
              <div class="ma_contR">
                <h2>{{item.word}}</h2>
                <p>申请时间：<span>{{item.buydate}}</span></p>
              </div>
            </div> -->
      <div class="ma_content" v-for='(item,index) in singlebuyTransit'>
        <div class="ma_contL">
          <h2>{{item.name}}<span class="ma_contL2"></span></h2>
          <p class="ma_contL3">申请金额(元)：<span>{{item.money1}}</span></p>
        </div>
        <div class="ma_contR">
          <h2 @click='chedan(index)' :class='{"color":item.word == "撤单"}'>{{item.word}}</h2>
          <p>{{item.buydate}}</p>
          <p>申请时间</p>
        </div>
      </div>
      <div class="ma_content" v-for='(item,index) in singlebackTransit'>
        <div class="ma_contL">
          <h2>{{item.name}}<span class="ma_contL2"></span></h2>
          <p class="ma_contL3">申请赎回份额(份)：<span>{{item.appliShare}}</span></p>
        </div>
        <div class="ma_contR">
          <h2 @click='chedanback(index)' :class='{"color":item.word == "撤单"}'>{{item.word}}</h2>
          <p>{{item.buydate}}</p>
          <p>申请时间</p>
        </div>
      </div>
      <div class="ma_content" v-for='item in singleTransitF'>
        <div class="ma_contL">
          <h2>{{item.name}}<span class="ma_contL2">{{item.code}}</span></h2>
          <p>申请份额(份)：<span>{{item.share}}</span></p>
        </div>
        <div class="ma_contR">
          <h2>{{item.word}}</h2>
          <p>{{item.buydate}}</p>
          <p>申请时间</p>
        </div>
      </div>
      <!--</ul>-->
    </div>
    <div class="nt_noData" @click="tiaozhuan()" v-show='flag'>
      <img src="../assets/null.png">
      <h3>没有资产,去基金市场看看</h3>
    </div>
  </div>
</template>
<script>
  import {mianUrlt9} from '../vuex/api'
  import {Confirm, Toast, numberComma} from 'vux'

  export default {
    data() {
      return {
        total: 0,
        flag: false,
        displaySingle: true,
        singleConfirm: [], // 单只持仓
        singleTransit: [], // 单只在途
        singleTransitF: [],
        singlebuyTransit: [], // 单只购买在途
        singlebackTransit: [],  // 单只赎回在途
        cancle: false,    // 初始撤单按钮不显示
        apply: true       // 初始显示申请中状态

      }
    },
    mounted() {
      this.getasset()
    },
    components: {
      Confirm,
      Toast
    },
    methods: {
      tiaozhuan() {
        this.$router.push('/')
      },
      chedanback(index) {       // 赎回撤单
        let that = this
        if (this.singlebackTransit[index].word === '赎回中' || this.singlebackTransit[index].word === '撤单中') {
          return
        }
        this.$vux.confirm.show({
          title: '',
          content: '确定撤单吗?',
          onCancel() {

          },
          onConfirm() {
            let serialNo = that.singlebackTransit[index].serialNo
            let accountid = that.singlebackTransit[index].accountid
            let appliShare = that.singlebackTransit[index].appliShare
            let code = that.singlebackTransit[index].code
            that.$http.post(mianUrlt9 + 'fund/singleCancellation', {
              applicationShare: appliShare,
              appSheetSerialNo: serialNo,
              transactionAccountId: accountid,
              fundCode: code
            }, {emulateJSON: true}).then((res) => {
              if (res.data.retCode === '0') {
                that.$vux.toast.text('撤单成功！', 'middle', 3000)
                that.singlebackTransit[index].word = '撤单中'
              } else {
                const msg = res.data.retMsg
                that.$vux.toast.text(msg, 'middle', 3000)
              }
            })
          }
        })
      },
      chedan(index) {             // 购买撤单
        let that = this
        if (this.singlebuyTransit[index].word === '申请中' || this.singlebuyTransit[index].word === '撤单中') {
          return
        }
        this.$vux.confirm.show({
          title: '',
          content: '确定撤单吗?',
          onCancel() {

          },
          onConfirm() {
            let cancelid = that.singlebuyTransit[index].accountid
            console.log(cancelid)
            that.$http.post(mianUrlt9 + 'fund/singleCancellation', {
              appSheetSerialNo: cancelid
            }, {emulateJSON: true}).then((res) => {
              if (res.data.retCode === '0') {
                that.$vux.toast.text('撤单成功！', 'middle', 3000)
                that.singlebuyTransit[index].word = '撤单中'
              } else {
                const msg = res.data.retMsg
                that.$vux.toast.text(msg, 'middle', 3000)
              }
            })
          }
        })
      },

      getasset() {
        var that = this
        this.$http.post(mianUrlt9 + 'user/myAssetInfo').then((res) => {
          if (res.data.retCode === '0') {
            if (res.data.data.singleHoldingList.length !== 0) {
              for (let i = 0; i < res.data.data.singleHoldingList.length; i++) {
                let obj = {}
                obj.holdincome = res.data.data.singleHoldingList[i].floatProfit // 持有收益
                obj.id = res.data.data.singleHoldingList[i].id // 资产id
                obj.code = res.data.data.singleHoldingList[i].fundCode // 基金代码
                obj.name = res.data.data.singleHoldingList[i].fundName
                obj.accountid = res.data.data.singleHoldingList[i].transactionAccountId
                obj.money = Number(res.data.data.singleHoldingList[i].fundMarketValue).toFixed(2) // 持仓市值
                obj.shouyi = Number(res.data.data.singleHoldingList[i].floatProfit).toFixed(2)
                obj.money1 = numberComma(Number(res.data.data.singleHoldingList[i].fundMarketValue).toFixed(2)) // 持仓市值
                obj.shouyi1 = numberComma(Number(res.data.data.singleHoldingList[i].floatProfit).toFixed(2))
                this.total += Number(res.data.data.singleHoldingList[i].fundMarketValue)
                this.singleConfirm.push(obj)
              }
              this.total = Number(this.total).toFixed(2)
            }
            if (res.data.data.singleInTransitList.length !== 0) {
              let buyfund = 0
              for (let j = 0; j < res.data.data.singleInTransitList.length; j++) {
                if (res.data.data.singleInTransitList[j].businessCode === '36') {
                  let obj = {}
                  obj.word = this.panduantypeSingle(res.data.data.singleInTransitList[j].businessCode)
                  obj.id = res.data.data.singleInTransitList[j].appSheetSerialNo
                  obj.name = res.data.data.singleInTransitList[j].fundName
                  obj.code = res.data.data.singleInTransitList[j].fundCode
                  obj.share1 = Number(res.data.data.singleInTransitList[j].applicationShare)
                  obj.share = obj.share1.toFixed(2)
                  obj.buydate1 = res.data.data.singleInTransitList[j].createTime
                  obj.buydate = obj.buydate1.slice(0, 4) + obj.buydate1.slice(5, 7) + obj.buydate1.slice(8, 10)
                  this.singleTransitF.push(obj)
                } else if (res.data.data.singleInTransitList[j].businessCode === '22') {
                  let obj = {}
                  if (res.data.data.singleInTransitList[j].isCancel === '1') {    // 可以撤单
                    obj.word = '撤单'
                  } else {
                    obj.word = '申请中'
                  }
                  buyfund += Number(res.data.data.singleInTransitList[j].applicationAmount)
                  obj.name = res.data.data.singleInTransitList[j].fundName
                  obj.code = res.data.data.singleInTransitList[j].fundCode
                  // obj.id = res.data.data.singleInTransitList[j].appSheetSerialNo
                  obj.money1 = numberComma(Number(res.data.data.singleInTransitList[j].applicationAmount).toFixed(2))
                  obj.buydate1 = res.data.data.singleInTransitList[j].createTime
                  obj.buydate = obj.buydate1.slice(0, 4) + obj.buydate1.slice(5, 7) + obj.buydate1.slice(8, 10)
                  obj.accountid = res.data.data.singleInTransitList[j].appSheetSerialNo
                  this.singlebuyTransit.push(obj)
                } else if (res.data.data.singleInTransitList[j].businessCode === '24') {
                  let obj = {}
                  if (res.data.data.singleInTransitList[j].isCancel === '1') {    // 可以撤单
                    obj.word = '撤单'
                  } else {
                    obj.word = '赎回中'
                  }
                  obj.name = res.data.data.singleInTransitList[j].fundName
                  obj.code = res.data.data.singleInTransitList[j].fundCode   // 撤单参数
                  obj.appliShare = res.data.data.singleInTransitList[j].applicationShare    // 撤单参数
                  obj.buydate1 = res.data.data.singleInTransitList[j].createTime
                  obj.buydate = obj.buydate1.slice(0, 4) + obj.buydate1.slice(5, 7) + obj.buydate1.slice(8, 10)
                  obj.serialNo = res.data.data.singleInTransitList[j].appSheetSerialNo   // 撤单参数
                  obj.accountid = res.data.data.singleInTransitList[j].transactionAccountId  // 撤单参数
                  this.singlebackTransit.push(obj)
                } else {
                  let obj = {}
                  obj.word = this.panduantypeSingle(res.data.data.singleInTransitList[j].businessCode)
                  obj.id = res.data.data.singleInTransitList[j].appSheetSerialNo
                  obj.name = res.data.data.singleInTransitList[j].fundName
                  obj.code = res.data.data.singleInTransitList[j].fundCode
                  obj.money1 = numberComma(Number(res.data.data.singleInTransitList[j].applicationAmount).toFixed(2))
                  obj.buydate1 = res.data.data.singleInTransitList[j].createTime
                  obj.buydate = obj.buydate1.slice(0, 4) + obj.buydate1.slice(5, 7) + obj.buydate1.slice(8, 10)
                  this.singleTransitF.push(obj)
                }
              }
              this.total = Number(Number(this.total) + Number(buyfund)).toFixed(2)
            }
            this.total = numberComma(this.total)
            if (this.singleConfirm.length === 0 && this.singleTransit.length === 0 && this.singleTransitF.length === 0 && this.singlebuyTransit.length === 0 && this.singlebackTransit.length === 0) {
              this.displaySingle = false
              this.flag = true
            }
          } else if (res.data.retCode === '990101') {
            this.$vux.confirm.show({
              title: '',
              content: '您还未登录，去登录?',
              onShow() {
                console.log('plugin show')
              },
              onHide() {
                console.log('plugin hide')
              },
              onCancel() {
                that.$router.back()
              },
              onConfirm() {
                console.log('plugin confirm')
                that.$router.push({
                  path: '/component/login'
                })
              }
            })
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      assdetail(index) { // 跳转到资产详情页
        // if (index.substring(0, 1) == 's') {
        // var num = Number(index.substring(1, index.length))
        // this.$router.push({
        //   path: '/component/assetdetail',
        //   query: { costmoney: this.strategyconfirm[num].costmoney, id: this.strategyconfirm[num].id, name: this.strategyconfirm[num].name, holdincome: this.strategyconfirm[num].holdincome, groupid: this.strategyconfirm[num].groupid, money: this.strategyconfirm[num].money }
        // })
        // } else if (index.substring(0, 1) == 'g') {
        this.$router.push({
          path: '/component/assdetailsin',
          query: {
            costmoney: this.singleConfirm[index].costmoney,
            name: this.singleConfirm[index].name,
            holdincome: this.singleConfirm[index].holdincome,
            groupid: this.singleConfirm[index].code,
            accountid: this.singleConfirm[index].accountid,
            money: this.singleConfirm[index].money,
            id: this.singleConfirm[index].id
          }
        })
        // }
      },
      panduantypeSingle(type) {
        if (type === '20' || type === '22') {
          return '申请中'
        } else if (type === '24') {
          return '赎回中'
        } else if (type === '36') {
          return '转换中'
        }
      }
    }
  }
</script>
<style lang="less" scoped>
  @import '../styles/custom.less';

  .nt_noData {
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #ffffff;
    padding: 10px;
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

  .single .ma_headCon {
    text-align: left;
    padding: 15px;
  }

  .single .ma_headCon h2 {
    color: #fff;
    font-size: 26px;
  }

  .single .ma_headCon p {
    color: #fff;
    font-size: 14px;
  }

  .single .box {
    overflow: hidden;
    background: #fff;
    padding-top: 8px;
    padding-bottom: 8px;
  }

  .single .box h3 {
    font-size: 18px;
    border-left: 3px solid #1d5ffc;
    margin-left: 10px;
    padding-left: 5px;
    font-weight: normal;
    color: #666;
  }

  .ma_nav {
    border-top: 1px solid #f5f5f5;
  }

  .ma_content {
    padding: 15px;
    border-bottom: 1px solid #f5f5f5;
    overflow: hidden;
    background: #fff;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .ma_content .ma_contL {
    flex: 4
  }

  .ma_content .ma_contR {
    flex: 2
  }

  .up {
    color: @redfont;
  }

  .down {
    color: @greenfont;
  }

  /*.ma_contL {
    flex: 1;
  }*/

  .ma_contL h2 {
    font-size: 16px;
    color: #222222;
    margin-bottom: 5px;
  }

  .ma_contL p {
    font-size: 14px;
    color: #666666;
  }

  .ma_contR h2 {
    text-align: right;
    font-size: 14px;
    margin-bottom: 5px;
  }

  .ma_contR p {
    text-align: right;
    font-size: 14px;
    color: #666666;
  }

  .ma_contR {
    flex: 1;
  }

  .color {
    color: #ff9900;
    font-weight: normal;
    font-size: 12px;
  }
</style>
