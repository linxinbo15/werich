<template>
  <div class='mofan'>
    <img src="../assets/event/mofanbanner5.jpg">
    <img src="../assets/event/subject2.png" style="width: 250px;height: 35px;margin: 0 auto;">
    <div class='con2'>
      <div class="content">
        <div class="obj">
          <img src="../assets/event/icon1.png" style="float:right;margin-left:10px;">
          <div style="float:right;">
            <p>基金筛选</p>
            采用机器学习与因子模式相结合的方式，对全部公募基金进行优选，机器学习模型会对基金历史数据进行学习，来寻找可以区分基金收益的模式。
          </div>
        </div>
        <div class="obj">
          <img src="../assets/event/icon2.png" style="float:left;margin-right:10px;">
          <div style="float:left;">
            <p>市场预判</p>
            利用了多周期、多角度、多策略择时模型，采用机器学习来进行复合，判断未来市场涨跌的概率。
          </div>
        </div>
        <div class="obj">
          <img src="../assets/event/icon3.png" style="float:right;margin-left:10px;">
          <div style="float:right;">
            <p>资产组合</p>
            以Black-Litterman模型为基础生成最优的资产配置方案。
          </div>
        </div>
      </div>
    </div>
    <div class='con1'>
      <img src="../assets/event/subject1.png" style="width: 250px;height: 35px;margin: 0 auto;">
      <div class="list" v-for='item in list'>
        <div class="obj"><span class="name">{{item.name}}</span><span class="code">({{item.code.substring(0,6)}})</span>
          <br>
          <!--<a>爆发能力&nbsp;<span>3星</span></a>-->
          <img :src="item.imgurl" alt="">
        </div>
        <ul>
          <li>
            <h2>{{item.num}}</h2>
            <p><span>{{item.time}}</span></p>
          </li>
          <li>
            <h2>{{item.ranking}}</h2><span>同类排名</span></li>
          <li>
            <button @click='buyFundPrepose(item.code,item.name)'>立即买入</button>
          </li>
        </ul>
      </div>
    </div>
    <div class="con3">
      <img src="../assets/event/subject3.png" style="width: 250px;height: 35px;margin: 0 auto;">
      <div style="color:#b1b1be;font-size:15px;line-height: 20px;margin:10px 0;">
        <span style="color:#eec56b;font-size:16px;">模型解释：</span> 使用机器学习Adaboost模型对多个择时模型结果进行复合，结果以0到1之间的值表示，该数值越大，模型预期上涨概率越大。以上结果为简化后的-1、0和1三个值，-1表示看跌，0表示无明确趋势，1表示看涨。
        <table cellpadding="0" cellspacing="0">
          <tr style="color:#eec56b;">
            <td>资产类别</td>
            <td>择时信号</td>
          </tr>
          <tr>
            <td>A股(沪深300)</td>
            <td>-1</td>
          </tr>
          <tr>
            <td>港股</td>
            <td>1</td>
          </tr>
          <tr>
            <td>美股</td>
            <td>0</td>
          </tr>
          <tr>
            <td>黄金</td>
            <td>-1</td>
          </tr>
        </table>
      </div>
    </div>
    <toast v-model="showPositionValue" type="text" width="18em" :time="800" is-show-mask :text="toastText" :position="position">{{toastText}}
    </toast>
  </div>
</template>
<script>
import { Confirm, Toast } from 'vux'
import { mianUrlt9 } from '../vuex/api'
import { getLocalStorage } from '../vuex/storage'

export default {
  data() {
    return {
      toastText: '加入自选成功！',
      showPositionValue: false,
      position: 'default',
      list: [{
        name: '广发稳健增长',
        code: '270002.OF',
        imgurl: './static/image/hunhe.png',
        num: '9.40%',
        ranking: '20/575',
        time:'近两年收益率'
      }, {
        name: '工银瑞信金融地产',
        code: '000215.OF',
        imgurl: './static/image/hunhe.png',
        num: '16.67%',
        ranking: '133/1588',
        time:'近两年收益率'
      }, {
        name: '汇添富价值精选A',
        code: '519069.OF',
        imgurl: './static/image/hunhe.png',
        num: '11.27%',
        ranking: '49/575',
        time:'近两年收益率'
      }, {
        name: '华安核心优选',
        code: '040011.OF',
        imgurl: './static/image/QDII.png',
        num: '6.08%',
        ranking: '31/575',
        time:'近两年收益率'
      }, {
        name: '新华行业轮动',
        code: '519156.OF',
        imgurl: './static/image/hunhe.png',
        num: '12.27%',
        ranking: '901/1619',
        time:'11月收益率'
      }, {
        name: '弘德优选成长',
        code: '001256.OF',
        imgurl: './static/image/hunhe.png',
        num: '5.71%',
        ranking: '52/575',
        time:'11月收益率'
      }, {
        name: '富国沪深300',
        code: '100038.OF',
        imgurl: './static/image/gupiao.png',
        num: '4.19%',
        ranking: '8/79',
        time:'近两个月收益率'
      }, {
        name: '新华纯债添利',
        code: '519152.OF',
        imgurl: './static/image/zhaiquan.png',
        num: '11.03%',
        ranking: '793/957',
        time:'近两年收益率'
      }, {
        name: '银华信用季季红A',
        code: '000286.OF',
        imgurl: './static/image/zhaiquan.png',
        num: '14.70%',
        ranking: '328/957',
        time:'近两年收益率'
      }, {
        name: '交银双轮动AB',
        code: '519723.OF',
        imgurl: './static/image/zhaiquan.png',
        num: '10.88%',
        ranking: '108/957',
        time:'近两年收益率'
      }]
    }
  },
  components: {
    Confirm,
    Toast
  },
  methods: {
    showPosition(position) {
      this.position = position
      this.showPositionValue = true
    },
    buyFundPrepose(fundcode, fundname, chouj) {
      const that = this
      const Tel = getLocalStorage('Tel')
      const isopen = getLocalStorage('isopen')
      const riskLevel = getLocalStorage('riskLevel')
      console.log(Tel, isopen, riskLevel)
      if (Tel == null || Tel === '') {
        this.$router.push({
          path: '/component/login',
          query: { path: this.$route.fullPath }
        })
      } else if (isopen === '0') { // 未开户
        this.$router.push({
          path: '/component/account',
          query: { path: this.$route.fullPath }
        })
      } else if (riskLevel == null || riskLevel === '') { // 未做风险测评
        this.$vux.confirm.show({
          title: '风险测评',
          content: '购买基金产品前，需要对您的风险承受能力进行测评',
          onShow() {
            console.log('plugin show')
          },
          onHide() {
            console.log('plugin hide')
          },
          onCancel() {
            console.log('plugin cancel')
          },
          onConfirm() {
            that.$router.push({ path: '/component/risk-question', query: { path: that.$route.fullPath } })
          }
        })
      } else {
        const obj = {
          fundCode: fundcode.substring(0, 6)
        }
        this.$http.post(mianUrlt9 + 'fund/beforeSingleBuy', obj, { emulateJSON: true }).then((res) => {
          if (res.data.retCode === '0') {
            console.log(res)
            this.$router.push({
              path: '/component/buy-fund',
              query: {
                fundCode: res.data.data.fundCode,
                fundName: res.data.data.fundName,
                fundType: res.data.data.fundType,
                perMax22: res.data.data.perMax22,
                perMin22: res.data.data.perMin22,
                perMax24: res.data.data.perMax24,
                perMin24: res.data.data.perMin24,
                perMax20: res.data.data.perMax20,
                perMin20: res.data.data.perMin20,
                riskLevel: res.data.data.riskLevel,
                shareType: res.data.data.shareType,
                status: res.data.data.status,
                taNo: res.data.data.taNo
              }
            })
          } else if (res.data.retCode === '990101') {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
            this.$router.push({
              path: '/component/login',
              query: { path: this.$route.fullPath }
            })
          } else if (res.data.retCode === '990102') {
            this.toastText = res.data.data[0].field + '' + res.data.data[0].message
            this.showPosition('middle')
          } else if (res.data.retCode === '990103') {
            this.toastText = '系统正在维护，请稍后再试'
            this.showPosition('middle')
          } else if (res.data.retCode === '990104') {
            this.toastText = '服务器内部错误'
            this.showPosition('middle')
          } else {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
          }
        })
      }
    }
  }
}

</script>
<style lang='less'>
ol,
ul,
li {
  list-style: none outside none;
}

.mofan {
  background: #000362;
  img {
    display: block;
    width: 100%;
    height: auto;
  }
  .con2 {
    padding: 0 10px 20px;
    .content {
      margin-top: 20px;
      border: solid 2px #0973c4;
      border-radius: 5px;
      padding: 10px;
      .obj {
        overflow: hidden;
        margin-bottom: 20px;
        img {
          width: 35%;
          height: auto;
          margin-top: 10px;
        }
        div {
          width: 60%;
          color: #ccc;
          font-size: 15px;
          line-height: 20px;
          p {
            color: #eec56b;
            font-size: 16px;
            line-height: 20px;
          }
        }
      }
    }
  }
  .con1 {
    padding: 0 10px 20px;
    .list {
      background: #fff;
      /* padding: 1em; */
      margin-top: 10px;
      border: solid 1px #fff;
      border-radius: 5px;
      .obj {
        color: #333;
        padding: 8px 0 10px 10px;
        border-bottom: solid 1px #dcdfec;
        position: relative;
        .name {
          font-size: 16px;
          font-weight: 700;
          line-height: 15px;
        }
        .code {
          font-size: 14.4px;
          color: #999;
          line-height: 15px;
        }
        img {
          width: 39px;
          height: 39px;
          margin: 0;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      ul {
        overflow: hidden;
        padding: 15px;
        li {
          float: left;
        }
        li:nth-of-type(1) {
          width: 35%;
          h2 {
            font-size: 20px;
            color: #ff1e32;
          }
          p {
            border-right: solid 1px #999;
          }
          span {
            color: #999;
            font-size: 13px;
          }
        }
        li:nth-of-type(2) {
          width: 35%;
          text-align: center;
          h2 {
            color: #333;
            font-size: 18px;
            margin-bottom: 2px;
            font-weight: normal;
          }
          span {
            color: #999;
            font-size: 13px;
          }
        }
        li:nth-of-type(3) {
          width: 30%;
          text-align: center;
          button {
            color: #eec56b;
            font-size: 17px;
            margin: auto;
            padding: 10px;
            text-align: center;
            border: solid 1.5px #eec56b;
            border-radius: 5px;
            background: none;
            font-weight: 500;
          }
        }
      }
    }
  }
  .con3 {
    padding: 0 10px 20px;
    table {
      width: 100%;
      text-align: center;
      border: solid 0.3px #7b7eaf;
      margin-top: 10px;
      margin-bottom: 10px;
      td {
        border: solid 0.1px #7b7eaf;
        padding: 5px 0;
      }
    }
  }
}

</style>
