<template>
  <div>
    <div style="background-color: #1d5ffc">
      <div class="ma_headCon">
        <p>总资产(元)</p>
        <h2>{{total}}</h2>
      </div>
    </div>
    <div class='box'>
      <h3 class="ma_h3">量化策略</h3>
    </div>
      <div class="ma_nav">
        <div class="ma_content" v-for='item in strategyconfirm' @click='assdetail(item.index)'>
          <div class="ma_contL">
            <h2>{{item.name}}</h2>
            <p class="ma_contL3">持仓金额(元)：<span>{{item.money1}}</span></p>
          </div>
          <div class="ma_contR">
            <h2 :class="{'rmv':item.shouyi1 < 0 ,'add':item.shouyi1 >= 0}">{{item.shouyi}}</h2>
            <p>持有收益(元)</p>
          </div>
        </div>
        <div class="ma_content" v-for='item in strategytransit'>
          <div class="ma_contL">
            <h2>{{item.name}}({{item.code}})</h2>
            <p><span class="add">{{item.word}}</span> 申请时间：<span>{{item.updatetime}}</span></p>
          </div>
          <div class="ma_contR">
            <h2>{{item.money}}</h2>
            <p class="ma_contL3">申请份额</p>
          </div>
        </div>
        <div class="ma_content" v-for='item in strategybuytransit'>
          <div class="ma_contL">
            <h2>{{item.name}}({{item.code}})</h2>
            <p><span class="add">{{item.state}} </span> 申请金额(元)：<span>{{item.money}}</span></p>
          </div>
          <div class="ma_contR">
            <h2 class="chedan" v-show='item.seen' @click='chedan(item.index)'>撤单</h2>
            <p>{{item.buydate}}</p>
            <p>申请时间</p>
          </div>
        </div>
    </div>
    <div class="nt_noData" @click="tiaozhuan()" v-show='flag'>
      <img src="../assets/null.png">
      <h3>没有资产,去基金市场看看</h3>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import '../styles/custom.less';
  .nt_noData {
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #ffffff;
    padding: 15px;
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

  .ma_headCon {
    text-align: left;
    padding: 15px;
  }

  .ma_headCon h2 {
    color: #fff;
    font-size: 26px;
  }

  .ma_headCon p {
    color: #fff;
    font-size: 14px;
  }

  .box {
    overflow: hidden;
    background: #fff;
    padding-bottom: 8px;
    padding-top: 8px;
  }

  .box h3 {
    font-size: 18px;
    border-left: 3px solid #1d5ffc;
    margin-left: 10px;
    padding-left: 5px;
    font-weight: normal;
    color: #666;
  }

  .ma_nav {
    background: #fff;
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

  .ma_contL {
    -webkit-box-flex: 4;
    -webkit-flex: 4;
    flex: 4;
  }

  .ma_contL h2 {
    font-size: 16px;
    color: #222222;
    margin-bottom: 5px;
  }

  .ma_contL p {
    font-size: 14px;
    color: #666666;
  }


  .add {
    color: @redfont;
  }

  .rmv {
    color: @greenfont;
  }

  .ma_contR {
    -webkit-box-flex: 2;
    -webkit-flex: 2;
    flex: 2;
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

  .chedan {
    color: @redfont;
  }
</style>
<script>
  import {mianUrlt9} from '../vuex/api'
  import {Confirm, Toast,numberComma} from 'vux'

  export default {
    data () {
      return {
        total: 0,
        flag: false,
        displaystrategy: true,
        strategyconfirm: [], // 策略持仓
        strategybuytransit: [], // 策略购买在途
        strategytransit: [] // 策略其他形式在途
      }
    },
    mounted () {
      this.getasset()
    },
    components: {
      Confirm,
      Toast
    },
    methods: {
      tiaozhuan () {
        this.$router.push('/')
      },
      getasset () {
        var that = this
        this.$http.post(mianUrlt9 + 'user/myAssetInfo').then((res) => {
          if (res.data.retCode === '0') {
            if (res.data.data.strategyHoldingInfoList.length !== 0) {
              let num = 0
              for (let i = 0; i < res.data.data.strategyHoldingInfoList.length; i++) {
                let obj = {}
                obj.index = 's' + i
                obj.costmoney = Number(res.data.data.strategyHoldingInfoList[i].costMoney) // 本金
                obj.id = res.data.data.strategyHoldingInfoList[i].id // 购买主键
                obj.holdincome = res.data.data.strategyHoldingInfoList[i].holdingIncome // 持有收益
                obj.groupid = res.data.data.strategyHoldingInfoList[i].groupId // 组合代码
                obj.name = res.data.data.strategyHoldingInfoList[i].groupName
                obj.money = res.data.data.strategyHoldingInfoList[i].totalFundMarketValue // 持仓市值
                obj.money1 = numberComma(Number(res.data.data.strategyHoldingInfoList[i].totalFundMarketValue).toFixed(2)) // 持仓市值
                obj.shouyi = numberComma(Number(res.data.data.strategyHoldingInfoList[i].holdingIncome))
                obj.shouyi1 = Number(res.data.data.strategyHoldingInfoList[i].holdingIncome)
                num += Number(res.data.data.strategyHoldingInfoList[i].totalFundMarketValue)
                this.total = num.toFixed(2)
                this.strategyconfirm.push(obj)
              }
              this.total = Number(this.total).toFixed(2)
            }
            if (res.data.data.strategyInTransitInfoList.length !== 0) {
              let sflagnum = 0
              let buyStrategy = 0
              for (let j = 0; j < res.data.data.strategyInTransitInfoList.length; j++) {
                if (res.data.data.strategyInTransitInfoList[j].status === '0') {
                  let obj = {}
                  // let time = res.data.data.strategyInTransitInfoList[j].updateTime
                  obj.index = 's' + sflagnum
                  sflagnum++
                  let iscancle = res.data.data.strategyInTransitInfoList[j].isCancel
                  if (iscancle === '0') {
                    obj.seen = false
                  } else {
                    obj.seen = true
                  }
                  obj.id = res.data.data.strategyInTransitInfoList[j].id
                  obj.name = res.data.data.strategyInTransitInfoList[j].groupName
                  obj.code = res.data.data.strategyInTransitInfoList[j].groupId
                  buyStrategy += Number(res.data.data.strategyInTransitInfoList[j].costMoney)
                  obj.money = numberComma(Number(res.data.data.strategyInTransitInfoList[j].costMoney).toFixed(2))
                  obj.buydate = res.data.data.strategyInTransitInfoList[j].transactionDate
                  obj.state = '申请中'
                  this.strategybuytransit.push(obj)
                } else {
                  let obj = {}
                  obj.word = this.panduantype(res.data.data.strategyInTransitInfoList[j].status)
                  obj.name = res.data.data.strategyInTransitInfoList[j].groupName
                  obj.code = res.data.data.strategyInTransitInfoList[j].groupId
                  obj.money = numberComma(Number(res.data.data.strategyInTransitInfoList[j].marketValue).toFixed(2))
                  obj.updatetime = res.data.data.strategyInTransitInfoList[j].updateTime
                  this.strategytransit.push(obj)
                }
              }
              this.total = Number(this.total) + Number(buyStrategy)
            }
            this.total = numberComma(this.total)
            if (this.strategyconfirm.length === 0 && this.strategybuytransit.length === 0 && this.strategytransit.length === 0) {
              this.displaystrategy = false
              this.flag = true
            }
          } else if (res.data.retCode === '990101') {
            this.$vux.confirm.show({
              title: '',
              content: '您还未登录，去登录?',
              onShow () {
                console.log('plugin show')
              },
              onHide () {
                console.log('plugin hide')
              },
              onCancel () {
                that.$router.back()
              },
              onConfirm () {
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
      assdetail (index) { // 跳转到资产详情页
        // if (index.substring(0, 1) == 's') {
        let num = Number(index.substring(1, index.length))
        this.$router.push({
          path: '/component/assetdetail',
          query: {
            costmoney: this.strategyconfirm[num].costmoney,
            id: this.strategyconfirm[num].id,
            name: this.strategyconfirm[num].name,
            holdincome: this.strategyconfirm[num].holdincome,
            groupid: this.strategyconfirm[num].groupid,
            money: this.strategyconfirm[num].money
          }
        })
        // } else if (index.substring(0, 1) == 'g') {
        //   var num = Number(index.substring(1, index.length))
        //   this.$router.push({
        //     path: '/asset/assetdetail',
        //     query: { costmoney: this.groupconfirm[num].costmoney, id: this.groupconfirm[num].id, name: this.groupconfirm[num].name, holdincome: this.groupconfirm[num].holdincome, groupid: this.groupconfirm[num].groupid, money: this.groupconfirm[num].money }
        //   })
        // }
      },
      chedan (index) { // 撤单
        let that = this
        let num = Number(index.substring(1, index.length))
        // if (index.substring(0, 1) == 's') {
        let cancelid = this.strategybuytransit[num].id
        // this.strategybuytransit[num].seen = false //点击撤单后，撤单按钮隐藏
        //  } else if (index.substring(0, 1) == 'g') {
        //    var cancelid = this.groupbuytransit[num].id
        // this.groupbuytransit[num].seen = false //点击撤单后，撤单按钮隐藏
        //  }
        this.$vux.confirm.show({
          title: '',
          content: '是否确定撤单?',

          onCancel () {

          },
          onConfirm () {
            that.$http.post(mianUrlt9 + 'fund/cancellation', {
              groupFundBuyId: cancelid
            }, {emulateJSON: true}).then((res) => {
              if (res.data.retCode === '0') {
                //  if (index.substring(0, 1) == 's') {
                that.strategybuytransit[num].seen = false // 点击撤单后，撤单按钮隐藏
                that.strategybuytransit[num].state = '撤单中' // 点击撤单后，状态变为撤单中
                // } else if (index.substring(0, 1) == 'g') {
                //   this.groupbuytransit[num].seen = false //点击撤单后，撤单按钮隐藏
                //   this.groupbuytransit[num].state = "撤单中" //点击撤单后，状态变为撤单中
                // }
                that.$vux.toast.text('撤单成功', 'middle', 3000)
              } else if (res.data.retCode === '990103') {
                that.$vux.toast.text('系统正在维护，请稍后再试', 'middle', 3000)
                // if (index.substring(0, 1) == 's') {
                that.strategybuytransit[num].seen = true // 撤单不成功，撤单按钮显示
                //  } else if (index.substring(0, 1) == 'g') {
                //   this.groupbuytransit[num].seen = true //撤单不成功，撤单按钮显示
                // }
              } else if (res.data.retCode === '990104') {
                that.$vux.toast.text('服务器内部错误', 'middle', 3000)
                //  if (index.substring(0, 1) == 's') {
                that.strategybuytransit[num].seen = true // 撤单不成功，撤单按钮显示
                //  } else if (index.substring(0, 1) == 'g') {
                //    this.groupbuytransit[num].seen = true //撤单不成功，撤单按钮显示
                //  }
              } else {
                // const msg = res.data.retMsg
                that.$vux.toast.text('服务器内部错误', 'middle', 3000)
                // if (index.substring(0, 1) == 's') {
                that.strategybuytransit[num].seen = true // 撤单不成功，撤单按钮显示
                //  } else if (index.substring(0, 1) == 'g') {
                //    this.groupbuytransit[num].seen = true //撤单不成功，撤单按钮显示
                //  }
              }
            })
          }
        })
      },
      panduantype (type) { // 判断交易类型（在途）
        if (type === '3') {
          return '赎回中'
        } else if (type === '5') {
          return '撤单中'
        } else if (type === '7') {
          return '转换中'
        }
      }
    }
  }
</script>
