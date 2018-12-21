<template>
  <div>
    <!--<div style="padding: 10px;">
      <button-tab v-model="demo01">
        <button-tab-item @on-item-click="getGroupTradeList()">智能组合</button-tab-item>
        <button-tab-item @on-item-click="consoleIndex()">单只基金</button-tab-item>
      </button-tab>
    </div>-->
    <div class="grouptitle">{{groupname}} 组合交易详情</div>
    <div class="nt_content">
      <ul class="nt_box">
        <li class="nt_cont" v-for='item in data'>
          <div class="ma_contL clearfix">
            <div><span class="ma_contL1">{{item.name}}</span><span class="ma_contL2">{{item.code}}</span></div>
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
  import {Tab, Toast, ButtonTab, ButtonTabItem, Divider} from 'vux'
  import {mianUrlt9} from '../vuex/api'

  export default {
    components: {
      Tab,
      Toast,
      ButtonTab,
      ButtonTabItem,
      Divider
    },
    mounted () {
      this.getParams()
      this.getFundTradeListRead()
      // this.getlist()
    },
    methods: {
      getParams () {
        // 取到路由带过来的参数
        // console.log(this.$route)
        let groupFundBuyInfoId = this.$route.query.groupFundBuyInfoId
        let groupname = this.$route.query.groupname
        // let fundtype = this.$route.query.fundtype
        // 将数据放在当前组件的数据内
        this.groupFundBuyInfoId = groupFundBuyInfoId
        this.groupname = groupname
        // this.fundtype = fundtype
      },
      getFundTradeListRead () {
        // this.flag = false
        let obj1 = {groupFundBuyInfoId: this.groupFundBuyInfoId}
        this.$http.post(mianUrlt9 + 'user/groupRecordSingleInfo', obj1, {emulateJSON: true}).then((res) => {
          // console.log(res)
          if (res.data.retCode === '0') {
            this.data = []
            if (res.data.data.tradeList.length === 0) {
              this.data = []
              this.flag = true
            }
            for (let i = 0; i < res.data.data.tradeList.length; i++) {
              let obj = {}
              obj.code = res.data.data.tradeList[i].fundCode
              obj.name = res.data.data.tradeList[i].fundName
              let num = res.data.data.tradeList[i].businessCode
              // obj.status = this.zhuangtai(res.data.data.tradeList[i].routeFlag)
              obj.date = res.data.data.tradeList[i].transactionDate
              if (num === '43') {
                if (res.data.data.tradeList[i].confirmedAmount === '0.00') {
                  obj.money = res.data.data.tradeList[i].confirmedVol
                  obj.word = '份'
                } else {
                  obj.money = res.data.data.tradeList[i].confirmedAmount
                  obj.word = '元'
                }
                obj.status = this.zhuangtai(res.data.data.tradeList[i].routeFlag)
              } else if (num === '22') {
                if (res.data.data.tradeList[i].routeFlag === '1') { // 已确认
                  if (res.data.data.tradeList[i].status === '05' || res.data.data.tradeList[i].status === '5') {
                    obj.status = '已撤单'
                    obj.money = res.data.data.tradeList[i].applicationAmount
                  } else if (res.data.data.tradeList[i].status === '09' || res.data.data.tradeList[i].status === '9') {
                    obj.status = '撤单已回款'
                    obj.money = res.data.data.tradeList[i].applicationAmount
                  } else {
                    obj.status = this.zhuangtai(res.data.data.tradeList[i].routeFlag)
                    obj.money = res.data.data.tradeList[i].applicationAmount
                  }
                  obj.word = '元'
                } else { // 在途
                  obj.status = this.zhuangtai(res.data.data.tradeList[i].routeFlag)
                  obj.money = res.data.data.tradeList[i].applicationAmount
                  obj.word = '元'
                }
              } else if (num === '24' || num === '36') {
                if (res.data.data.tradeList[i].routeFlag === '1') { // 已确认
                  if (res.data.data.tradeList[i].status === '05' || res.data.data.tradeList[i].status === '5') {
                    obj.status = '已撤单'
                    obj.money = res.data.data.tradeList[i].applicationVol
                    obj.word = '份'
                  } else if (res.data.data.tradeList[i].status === '09' || res.data.data.tradeList[i].status === '9') {
                    obj.status = '撤单已回款'
                    obj.money = res.data.data.tradeList[i].applicationVol
                    obj.word = '份'
                  } else {
                    obj.status = this.zhuangtai(res.data.data.tradeList[i].routeFlag)
                    obj.money = res.data.data.tradeList[i].confirmedAmount
                    obj.word = '元'
                  }
                } else { // 在途
                  obj.status = this.zhuangtai(res.data.data.tradeList[i].routeFlag)
                  obj.money = res.data.data.tradeList[i].applicationVol
                  obj.word = '份'
                }
              } else {
                obj.status = this.zhuangtai(res.data.data.tradeList[i].routeFlag)
                obj.money = res.data.data.tradeList[i].applicationAmount
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
        groupFundBuyInfoId: '',
        groupname: '',
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
    border-bottom: 1px solid @ai-line-color;
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

  .grouptitle {
    padding: 10px;
    font-size: 16px;
    color: #0e75f6;
    background-color: #fff;
    border-top: 1px solid @ai-line-color;
    border-bottom: 2px solid #0e75f6;
  }


</style>
