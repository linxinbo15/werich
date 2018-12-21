<template>
  <div>
    <div class='con' v-show="list.length != 0">
      <div class="box" v-for='(item,index) in list'>
        <div style="background:#fff;padding:5px 10px 0;margin:0;">
          <div>
            <div style="position: relative;"><img :src="item.urlimg" class="touxiang">
              <div class="biaoti">{{item.word}}</div>
            </div>
          </div>
          <p>{{item.plan}} <span class="code">{{item.code}}</span><span class='target'>￥{{item.dream}}</span></p>
          <ul>
            <li><span>定投基金：</span><span>{{item.fund}}</span></li>
            <li><span>下一次扣款日：</span><span>{{item.date}}</span></li>
          </ul>
          <div class='btn' @click='stop(index)'>终止计划</div>
        </div>
      </div>
    </div>
    <div class="nt_noData" @click="tiaozhuan()" v-show="list.length == 0">
      <img src="../assets/null.png">
      <h3>没有定投计划,去基金市场看看</h3>
    </div>
  </div>
</template>
<script>
  import {Toast, Confirm, numberComma} from 'vux'
  import {mianUrlt9} from '../vuex/api'

  export default {
    data() {
      return {
        list: [],
        flag: false
      }
    },
    components: {
      Toast,
      Confirm
    },
    mounted() {
      this.getplan()
    },
    methods: {
      tiaozhuan() {
        this.$router.push('/')
      },
      getplan() {
        this.$http.post(mianUrlt9 + 'fund/assetCastsurely', {
          bankFlag: 'cjqf'
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            for (let i = 0; i < res.data.data.fundCastsurelySingleList.length; i++) {
              if (res.data.data.fundCastsurelySingleList[i].sfyxScenePlan === '1') {
                let obj = {}
                if (res.data.data.fundCastsurelySingleList[i].sceneName == "养老计划") {
                  obj.urlimg = '../../static/image/plan_old.png'
                  obj.word = '养老计划'

                } else if (res.data.data.fundCastsurelySingleList[i].sceneName == "子女教育") {
                  obj.urlimg = '../../static/image/plan_edu.png'
                  obj.word = '子女教育'
                } else if (res.data.data.fundCastsurelySingleList[i].sceneName == "旅行度假") {
                  obj.urlimg = '../../static/image/plan_travel.png'
                  obj.word = '旅行度假'
                } else {
                  obj.urlimg = '../../static/image/plan_home.png'
                  obj.word = '购房置业'
                }
                obj.plan = res.data.data.fundCastsurelySingleList[i].sceneName
                obj.code = res.data.data.fundCastsurelySingleList[i].fundcode.substring(0, 6)
                obj.dream = numberComma(Number(res.data.data.fundCastsurelySingleList[i].dreamMoney))
                obj.date = res.data.data.fundCastsurelySingleList[i].nextInvestDate.substring(0, 4) + '-' + res.data.data.fundCastsurelySingleList[i].nextInvestDate.substring(4, 6) + '-' + res.data.data.fundCastsurelySingleList[i].nextInvestDate.substring(6, 8)
                obj.fund = res.data.data.fundCastsurelySingleList[i].fundname
                obj.planno = res.data.data.fundCastsurelySingleList[i].buyplanno
                this.list.push(obj)
              }

            }

          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      stop(index) {
        var planno = this.list[index].planno
        let that = this
        this.$vux.confirm.show({
          title: '确定终止计划吗?',
          content: '终止计划将使您的目标无法达成，终止后可在资产中查看资金',
          onCancel() {
            console.log('plugin cancel')
          },
          onConfirm() {
            that.$http.post(mianUrlt9 + 'fund/stopAutoInvestPlan', {
              buyPlanNo: planno
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
    }
  }
</script>
<style scoped>
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

  .con {
    padding: 10px;
  }

  .con .box {
    padding-top: 10px;
    background: url('../assets/top.png') no-repeat top;
    border: solid 1px #fff;
    border-top: none;
    border-radius: 10px;
    margin-bottom: 15px;
  }

  .con .box .biaoti {
    width: 130px;
    background: #ffa014;
    color: #fff;
    text-align: center;
    font-size: 18px;
    line-height: 30px;
    border: solid 1px #ffa014;
    border-radius: 13px;
    margin-left: 20px;

  }

  .con .box .touxiang {
    width: 40px;
    height: 40px;
    position: absolute;
    top: -5px;

  }

  .con .box .code {
    color: #808080;
    font-size: 10px;
  }

  .con .box p {
    font-size: 16px;
    line-height: 2.5;
  }

  .con .box .target {
    text-align: right;
    font-size: 16px;
    color: #4e4e4e;
    float: right;
  }

  .con .box ul li span {
    font-size: 13px;
    line-height: 2;
  }

  .con .box ul li span:nth-of-type(1) {
    color: #999;
  }

  .con .box .btn {
    margin-top: 10px;
    color: #0e75f6;
    font-size: 16px;
    line-height: 40px;
    text-align: center;
    border-top: solid 1px #edf0f4;
  }

</style>
