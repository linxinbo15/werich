<template>
  <div class="assinvest">
    <div style="background-color: #1d5ffc">
      <div class="ma_headCon">
        <p>总资产(元)</p>
        <h2>{{total}}</h2>
      </div>
    </div>
    <div class="con" v-show="list.length != 0">
      <div class="box" v-for='(item,index) in list' @click='change(index)'>
        <p>{{item.plan}} <span class="code">{{item.name}}</span><span style='float:right;font-size:12px;color:#ff9900;line-height:3;' v-show='item.back'>赎回中</span><span style='float:right;font-size:12px;color:#ff9900;line-height:3;' v-show='item.sync == "0"'>定投协议已终止</span></p>
        <ul>
          <li><span>金额</span><br><span class="money">{{item.money}}元</span></li>
          <li><span>持有收益</span><br><span :class="item.shouyi>=0?'red':'green'">{{item.shouyi}}元</span></li>
          <li><span>日收益({{item.date}})</span><br><span :class="item.day>=0?'red':'green'">{{item.day}}元</span></li>
        </ul>
        <p class='target'>目标金额：{{item.dream}}元</p>
        <div class="progress">
          <x-progress :percent="Number(Number(item.percent).toFixed(2))" :show-cancel="false"></x-progress>
          <div class="bili">{{Number(item.percent).toFixed(2)}}%</div>
        </div>
      </div>
    </div>
    <div class="nt_noData" @click="tiaozhuan()" v-show="list.length == 0">
      <img src="../assets/null.png">
      <h3>没有资产,去基金市场看看</h3>
    </div>
  </div>
</template>
<script>
  import {XProgress, Box, Toast,numberComma} from 'vux'
  import {mianUrlt9} from '../vuex/api'

  export default {
    data () {
      return {
        total: 0,
        list: [],
        flag: false
      }
    },
    components: {
      XProgress,
      Box,
      Toast
    },
    mounted () {
      this.getasset()
    },
    methods: {
      tiaozhuan () {
        this.$router.push('/')
      },
      change (index) {
        if(this.list[index].back == false){
          var planno = this.list[index].planno
          var debitacc = this.list[index].debitacc
          var sync = this.list[index].sync
          this.$router.push({path: '/component/assdetailinv', query: {planno: planno , debitacc:debitacc,sync: sync}})
        }
      },
      getasset () {
        this.$http.post(mianUrlt9 + 'fund/assetCastsurely', {
          bankFlag: 'cjqf'
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            if(res.data.data.fundCastsurelyProfit !== ''){
              this.total = numberComma(Number(res.data.data.fundCastsurelyProfit.fundmarketvalue).toFixed(2))
            }
            if (res.data.data.fundCastsurelySingleList.length === 0) {
              this.flag = true
            } else {
              for (let i = 0; i < res.data.data.fundCastsurelySingleList.length; i++) {
                if(res.data.data.fundCastsurelySingleList[i].availablevol == '0.00'||res.data.data.fundCastsurelySingleList[i].availablevol == ''){
                  continue
                }
                let obj = {}
                 if(res.data.data.fundCastsurelySingleList[i].fundfrozenbalance == '0.00'||res.data.data.fundCastsurelySingleList[i].fundfrozenbalance == ''){
                   obj.back = false
                 }else{
                   obj.back = true         //显示赎回中
                 }
                obj.plan = res.data.data.fundCastsurelySingleList[i].sceneName
                obj.name = res.data.data.fundCastsurelySingleList[i].fundname
                obj.dream = numberComma(Number(res.data.data.fundCastsurelySingleList[i].dreamMoney))
                obj.planno = res.data.data.fundCastsurelySingleList[i].buyplanno
                obj.money = numberComma(Number(res.data.data.fundCastsurelySingleList[i].fundmarketvalue).toFixed(2))
                obj.shouyi = numberComma(Number(res.data.data.fundCastsurelySingleList[i].floatprofit).toFixed(2))
                obj.date = res.data.data.fundCastsurelySingleList[i].navdate.substring(4,6)+'-'+res.data.data.fundCastsurelySingleList[i].navdate.substring(6,8)
                obj.day = numberComma(Number(res.data.data.fundCastsurelySingleList[i].fundmarketvalueUd).toFixed(2))
                obj.debitacc = res.data.data.fundCastsurelySingleList[i].debitAccount
                obj.percent = (Number(res.data.data.fundCastsurelySingleList[i].fundmarketvalue)/Number(res.data.data.fundCastsurelySingleList[i].dreamMoney))*100
                obj.sync = res.data.data.fundCastsurelySingleList[i].sfyxScenePlan         //是否终止标志位
                this.list.push(obj)
              }
            }
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      }
    }
  }
</script>
<style>
  ol, ul, li {
    list-style: none outside none;
  }

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

  .assinvest .ma_headCon {
    text-align: left;
    padding: 15px;
  }

  .assinvest .ma_headCon h2 {
    color: #fff;
    font-size: 26px;
  }

  .assinvest .ma_headCon p {
    color: #fff;
    font-size: 14px;
  }

  .assinvest .con {
    padding: 10px;
  }

  .assinvest .con .box {
    padding: 15px 10px;
    background: #fff;
    border: solid 1px #fff;
    border-radius: 10px;
    margin-bottom: 10px;
  }

  .assinvest .con .box .code {
    color: #808080;
    font-size: 10px;
  }

  .assinvest .con .box p {
    font-size: 18px;
    line-height: 2;
  }

  .assinvest .con .box .target {
    text-align: right;
    font-size: 16px;
    color: #999;
    margin-top: 6px;
  }

  .assinvest .con .box ul {
    display: flex;
    text-align: center;
  }

  .assinvest .con .box ul li {
    flex: 1;
    text-align: left;
    padding-left: 5px;
  }

  .assinvest .con .box ul li span:nth-of-type(1) {
    color: #999;
    font-size: 14px;
  }

  .assinvest .con .box ul li .money {
    color: #333;
    font-size: 16px;
  }

  .assinvest .con .box ul li .red {
    color: #ff9900;
  }

  .assinvest .con .box ul li .green {
    color: #74b236;
  }

  .assinvest .con .box .progress {
    display: flex;
  }

  .assinvest .con .box .weui-progress {
    flex: 9;
  }

 .weui-progress .weui-progress__bar {
    height: 7px;
    background: #f5f8fc;
    border: solid 1px #f5f8fc;
    border-radius: 5px;
  }

 .con .box .progress .bili {
    flex: 1;
    color: #ff9900;
    font-size: 14px;
    text-align: right;
  }

  .weui-progress .weui-progress__inner-bar {
    background: #ff9900;
    border: solid 0px #ff9900;
    border-radius: 5px;
  }

</style>
