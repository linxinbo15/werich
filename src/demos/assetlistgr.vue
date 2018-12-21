<template>
  <div>
    <div style="background-color: #1d5ffc">
      <div class="ma_headCon">
        <p>总资产(元)</p>
        <h2>{{total}}</h2>
      </div>
    </div>
    <div class='box'>
      <h3 class="ma_h3">智能组合</h3>
    </div>
      <div class="ma_nav">
        <div class="ma_content" v-for='item in groupconfirm' @click='assdetail(item.index)'>
          <div class="ma_contL">
            <h2 >{{item.name}}</h2>
            <p>持仓金额(元)：<span>{{item.money}}</span></p>
          </div>
          <div class="ma_contR clearfix">
            <h2 :class="{'rmv':item.shouyi < 0 ,'add':item.shouyi >= 0}">{{item.shouyi}}</h2>
            <p>持有收益(元)</p>
          </div>
        </div>
        <div class="ma_content" v-for='item in grouptransit'>
          <div class="ma_contL">
            <h2>{{item.name}}({{item.code}})</h2>
            <p>申请金额(元)：<span>{{item.money}}</span></p>
          </div>
          <div class="ma_contR">
            <h2>{{item.updatetime}}</h2>
            <p>{{item.word}}</p>
          </div>
        </div>
        <div class="ma_content" v-for='(item,index) in groupbuytransit'>
          <div class="ma_contL">
            <h2>{{item.name}}({{item.code}})</h2>
            <p class="ma_contL2"><span class="add">{{item.state}}</span> 申请金额(元)：<span>{{item.money}}</span></p>
          </div>
          <div class="ma_contR">
            <h2 class="add" v-show='item.seen' @click='chedan(item.index)'>撤单</h2>
            <p>{{item.buydate}}</p>
            <p>申请时间</p>
          </div>
        </div>
        <div class="ma_content" v-for='(item,index) in groupHalfTransit'>
          <div class="ma_contL">
            <h2 class="ma_contL1">{{item.name}}({{item.code}})</h2>
            <p class="ma_Cancle unConfirm"><span class="add">{{item.word}}</span>申请时间：<span>{{item.updatetime}}</span></p>
          </div>
          <div class="ma_contR">
            <h2>{{item.marketValue}}</h2>
            <p>确认金额(元)：</p>
            <!--<p>未确认金额(元)：<span>{{item.unConfirmedAmount}}</span></p>-->
          </div>
        </div>
      </div>
    <div class="nt_noData" @click="tiaozhuan()" v-show='flag'>
      <img src="../assets/null.png">
      <h3>没有资产,去基金市场看看</h3>
    </div>
  </div>
</template>
<script>
  import {mianUrlt9} from '../vuex/api'
  import {Confirm, Toast,numberComma} from 'vux'

  export default {
    data () {
      return {
        total1: '',    //全部确认的持仓
        total2: '',   //确认部分的持仓
        total3:'',      //购买后在途的本金
        flag: false,
        displaygroup: true,
        groupconfirm: [], // 组合持仓
        groupbuytransit: [], // 组合购买在途
        groupHalfTransit: [], // 组合部分确认
        grouptransit: [] // 组合其他形式在途
      }
    },
    mounted () {
      this.getasset()
    },
    components: {
      Confirm,
      Toast
    },
    computed: {
      total () {
        if (this.total1 === '' && this.total2 === '' && this.total3 === '') {
          return '0.00'
        } else {
          return numberComma(Number(this.total1) + Number(this.total2) + Number(this.total3))
        }
      }
    },
    methods: {
      tiaozhuan () {
        this.$router.push('/')
      },
      getasset () {
        let that = this
        this.$http.post(mianUrlt9 + 'user/myAssetInfo').then((res) => {
          if (res.data.retCode === '0') {
            if (res.data.data.intelligentGroupHoldingInfoList.length !== 0) {
              let num = 0
              for (let i = 0; i < res.data.data.intelligentGroupHoldingInfoList.length; i++) {
                let obj = {}
                obj.index = 'g' + i
                obj.costmoney = Number(res.data.data.intelligentGroupHoldingInfoList[i].costMoney) // 本金
                obj.id = res.data.data.intelligentGroupHoldingInfoList[i].id // 购买主键
                obj.holdincome = numberComma(Number(res.data.data.intelligentGroupHoldingInfoList[i].holdingIncome)) // 持有收益
                obj.groupid = res.data.data.intelligentGroupHoldingInfoList[i].groupId // 组合代码
                obj.name = res.data.data.intelligentGroupHoldingInfoList[i].groupName
                obj.money = numberComma(Number(res.data.data.intelligentGroupHoldingInfoList[i].totalFundMarketValue)) // 持仓市值
                obj.shouyi =res.data.data.intelligentGroupHoldingInfoList[i].holdingIncome
                num += Number(res.data.data.intelligentGroupHoldingInfoList[i].totalFundMarketValue)
                this.total1 = num.toFixed(2)
                this.groupconfirm.push(obj)
              }
            }
            if (res.data.data.intelligentGroupInTransitInfoList.length !== 0) {
              let gflagnum = 0
              let num = 0
              for (let j = 0; j < res.data.data.intelligentGroupInTransitInfoList.length; j++) {
                if (res.data.data.intelligentGroupInTransitInfoList[j].status === '0') {
                  if (res.data.data.intelligentGroupInTransitInfoList[j].marketValue === '') {
                    let obj = {}
                    // let time = res.data.data.intelligentGroupInTransitInfoList[j].updateTime
                    obj.index = 'g' + gflagnum
                    gflagnum++
                    let iscancle = res.data.data.intelligentGroupInTransitInfoList[j].isCancel
                    if (iscancle === '0') {
                      obj.seen = false
                    } else {
                      obj.seen = true
                    }
                    obj.id = res.data.data.intelligentGroupInTransitInfoList[j].id
                    obj.name = res.data.data.intelligentGroupInTransitInfoList[j].groupName
                    obj.code = res.data.data.intelligentGroupInTransitInfoList[j].groupId
                    obj.money = res.data.data.intelligentGroupInTransitInfoList[j].costMoney
                    obj.buydate = res.data.data.intelligentGroupInTransitInfoList[j].transactionDate
                    num += Number(res.data.data.intelligentGroupInTransitInfoList[j].costMoney)
                    this.total3 = num.toFixed(2)
                    obj.state = '申请中'
                    this.groupbuytransit.push(obj)
                  } else {
                    let obj = {}
                    // let time = res.data.data.intelligentGroupInTransitInfoList[j].updateTime
                    // obj.index = "g" + gflagnum
                    // gflagnum++
                    // var iscancle = res.data.data.intelligentGroupInTransitInfoList[j].isCancel
                    // if (iscancle == '0') {
                    //   obj.seen = false
                    // } else {
                    //   obj.seen = true
                    // }
                    obj.id = res.data.data.intelligentGroupInTransitInfoList[j].id
                    obj.name = res.data.data.intelligentGroupInTransitInfoList[j].groupName
                    obj.code = res.data.data.intelligentGroupInTransitInfoList[j].groupId
                    obj.marketValue1 = Number(res.data.data.intelligentGroupInTransitInfoList[j].marketValue)
                    obj.marketValue = obj.marketValue1.toFixed(2)
                    obj.unConfirmedAmount1 = Number(res.data.data.intelligentGroupInTransitInfoList[j].unConfirmedAmount)
                    obj.unConfirmedAmount = obj.unConfirmedAmount1.toFixed(2)
                    obj.updatetime = res.data.data.intelligentGroupInTransitInfoList[j].updateTime
                    obj.buydate = res.data.data.intelligentGroupInTransitInfoList[j].transactionDate
                    num += Number(res.data.data.intelligentGroupInTransitInfoList[j].marketValue)
                    this.total2 = num.toFixed(2)
                    obj.word = '申请中'
                    this.groupHalfTransit.push(obj)
                  }
                } else {
                  if (res.data.data.intelligentGroupInTransitInfoList[j].marketValue === '') {
                    let obj = {}
                    obj.word = this.panduantype(res.data.data.intelligentGroupInTransitInfoList[j].status)
                    obj.name = res.data.data.intelligentGroupInTransitInfoList[j].groupName
                    obj.code = res.data.data.intelligentGroupInTransitInfoList[j].groupId
                    obj.money = res.data.data.intelligentGroupInTransitInfoList[j].costMoney
                    obj.updatetime = res.data.data.intelligentGroupInTransitInfoList[j].updateTime
                    this.grouptransit.push(obj)
                  } else {
                    let obj = {}
                    obj.word = this.panduantype(res.data.data.intelligentGroupInTransitInfoList[j].status)
                    obj.name = res.data.data.intelligentGroupInTransitInfoList[j].groupName
                    obj.code = res.data.data.intelligentGroupInTransitInfoList[j].groupId
                    obj.marketValue1 = Number(res.data.data.intelligentGroupInTransitInfoList[j].marketValue)
                    obj.marketValue = obj.marketValue1.toFixed(2)
                    obj.unConfirmedAmount1 = Number(res.data.data.intelligentGroupInTransitInfoList[j].unConfirmedAmount)
                    obj.unConfirmedAmount = obj.unConfirmedAmount1.toFixed(2)
                    obj.updatetime = res.data.data.intelligentGroupInTransitInfoList[j].updateTime
                    this.groupHalfTransit.push(obj)
                  }
                }
              }
            }
            if (this.groupconfirm.length === 0 && this.groupbuytransit.length === 0 && this.grouptransit.length === 0 && this.groupHalfTransit.length === 0) {
              this.displaygroup = false
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
        // var num = Number(index.substring(1, index.length))
        // this.$router.push({
        //   path: '/component/assetdetail',
        //   query: { costmoney: this.strategyconfirm[num].costmoney, id: this.strategyconfirm[num].id, name: this.strategyconfirm[num].name, holdincome: this.strategyconfirm[num].holdincome, groupid: this.strategyconfirm[num].groupid, money: this.strategyconfirm[num].money }
        // })
        // } else if (index.substring(0, 1) == 'g') {
        let num = Number(index.substring(1, index.length))
        this.$router.push({
          path: '/component/assetdetail',
          query: {
            costmoney: this.groupconfirm[num].costmoney,
            id: this.groupconfirm[num].id,
            name: this.groupconfirm[num].name,
            holdincome: this.groupconfirm[num].holdincome,
            groupid: this.groupconfirm[num].groupid,
            money: this.groupconfirm[num].money
          }
        })
        // }
      },
      chedan (index) { // 撤单
        let that = this
        let num = Number(index.substring(1, index.length))
        // if (index.substring(0, 1) == 's') {
        //  var cancelid = this.strategybuytransit[num].id
        // this.strategybuytransit[num].seen = false //点击撤单后，撤单按钮隐藏
        // } else if (index.substring(0, 1) == 'g') {
        let cancelid = this.groupbuytransit[num].id
        // this.groupbuytransit[num].seen = false //点击撤单后，撤单按钮隐藏
        // }
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
                // if (index.substring(0, 1) == 's') {
                //   this.strategybuytransit[num].seen = false //点击撤单后，撤单按钮隐藏
                //  this.strategybuytransit[num].state = "撤单中" //点击撤单后，状态变为撤单中
                //   } else if (index.substring(0, 1) == 'g') {
                that.groupbuytransit[num].seen = false // 点击撤单后，撤单按钮隐藏
                that.groupbuytransit[num].state = '撤单中' // 点击撤单后，状态变为撤单中
                // }
                that.$vux.toast.text('撤单成功', 'middle', 3000)
              } else if (res.data.retCode === '990103') {
                that.$vux.toast.text('系统正在维护，请稍后再试', 'middle', 3000)
                //  if (index.substring(0, 1) == 's') {
                //  this.strategybuytransit[num].seen = true //撤单不成功，撤单按钮显示
                //  } else if (index.substring(0, 1) == 'g') {
                that.groupbuytransit[num].seen = true // 撤单不成功，撤单按钮显示
                //   }
              } else if (res.data.retCode === '990104') {
                that.$vux.toast.text('服务器内部错误', 'middle', 3000)
                //  if (index.substring(0, 1) == 's') {
                //    this.strategybuytransit[num].seen = true //撤单不成功，撤单按钮显示
                //  } else if (index.substring(0, 1) == 'g') {
                that.groupbuytransit[num].seen = true // 撤单不成功，撤单按钮显示
                //  }
              } else {
                // const msg = res.data.retMsg
                that.$vux.toast.text('服务器内部错误', 'middle', 3000)
                //  if (index.substring(0, 1) == 's') {
                //     this.strategybuytransit[num].seen = true //撤单不成功，撤单按钮显示
                //   } else if (index.substring(0, 1) == 'g') {
                that.groupbuytransit[num].seen = true // 撤单不成功，撤单按钮显示
                //   }
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
