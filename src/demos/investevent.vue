<template>
  <div class="investevent">
    <div class='banner'>
      <img src="../assets/event/bg1.png">
      <img src="../assets/event/word.png" alt="">
      <img src="../assets/event/what.png" style="margin-top:30px;">
      <img src="../assets/event/shihe.png" style="margin-top:30px;">
      <div style="padding:20px 10px;background: #f5f8fc;">
        <img src="../assets/event/meili.png">
      </div>
    </div>
    <div class='banner' style="padding:20px 10px;text-align: center;">
      <img src="../assets/event/smile.png">
      <img src="../assets/event/zhunbei.png" style="margin-top:30px;">
      <ul class='list'>
        <li style="margin-right:2%;" v-for='(item,index) in list'>
          <p>{{item.name}}</p>
          <p>{{item.code}}</p>
          <div class="box">
            <p>{{item.num}}</p>
            <p>近1年涨幅</p>
          </div>
          <button @click="buyInvestPrepose(index)">开启定投</button>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
   import {Toast,Loading} from 'vux'
  import {getLocalStorage} from '../vuex/storage'
  import {mianUrl, mianUrlt9} from '../vuex/api'
  export default {
    data () {
      return {
        list: [{
          name: '景顺长城沪深300',
          code: '000311',
          num: '29.80%'
        }, {
          name: '华安新丝路主题',
          code: '001104',
          num: '23.79%'
        }, {
          name: '南方成分精选',
          code: '202005',
          num: '21.79%'
        }, {
          name: '景顺长城量化精选',
          code: '000978',
          num: '13.99%'
        }]
      }
    },
     components: {
      Toast,
      Loading
    },
    methods:{
      buyInvestPrepose (index) {
        this.$vux.loading.show({
          text: '正在请求'
        })
        const that = this
        const Tel = getLocalStorage('Tel')
        const isopen = getLocalStorage('isopen')
        const riskLevel = getLocalStorage('riskLevel')
        // console.log(Tel,isopen,riskLevel)
        if (Tel == null || Tel === '') {
          this.$router.push({
            path: '/component/login',
            query: {path: this.$route.fullPath}
          })
        } else if (isopen === '0') { // 未开户
          this.$router.push({
            path: '/component/account',
            query: {path: this.$route.fullPath}
          })
        } else if (riskLevel == null || riskLevel === '') { // 未做风险测评
          this.$vux.confirm.show({
            title: '风险测评',
            content: '购买基金产品前，需要对您的风险承受能力进行测评',
            onShow () {
              console.log('plugin show')
            },
            onHide () {
              console.log('plugin hide')
            },
            onCancel () {
              console.log('plugin cancel')
            },
            onConfirm () {
              that.$router.push({path: '/component/risk-question', query: {path: that.$route.fullPath}})
            }
          })
        } else {
          const obj = {
            fundCode: this.list[index].code
          }
          this.$http.post(mianUrlt9 + 'fund/preGeneralInvestOpen', obj, {emulateJSON: true}).then((res) => {
            if (res.data.retCode === '0') {
              this.$vux.loading.hide()
              // console.log(res)
              this.$router.push({
                path: '/component/invest-fund',
                query: {
                  fundCode: res.data.data.fundCode,
                  fundName: res.data.data.fundName,
                  maxInvestAmount: res.data.data.maxInvestAmount,
                  minInvestAmount: res.data.data.minInvestAmount
                }
              })
            } else if (res.data.retCode === '990101') {
              this.$vux.loading.hide()
              var msg = res.data.retMsg
              this.$vux.toast.text(msg, 'middle', 3000)
              this.$router.push({
                path: '/component/login',
                query: {path: this.$route.fullPath}
              })
            } else if (res.data.retCode === '990102') {
              this.$vux.loading.hide()
              const msg = res.data.data[0].field + '' + res.data.data[0].message
              this.$vux.toast.text(msg, 'middle', 3000)
            } else if (res.data.retCode === '990103') {
              this.$vux.loading.hide()
              this.$vux.toast.text('系统正在维护，请稍后再试', 'middle', 3000)
            } else if (res.data.retCode === '990104') {
              this.$vux.loading.hide()
              this.$vux.toast.text('服务器内部错误', 'middle', 3000)
            } else if (res.data.retCode === '201007') {
              this.$vux.loading.hide()
              this.$vux.toast.text('此基金暂时不支持定投', 'middle', 3000)
            } else {
              this.$vux.loading.hide()
              var msg = res.data.retMsg
              this.$vux.toast.text(msg, 'middle', 3000)

            }
          })
        }
      },
    }
  }
</script>
<style lang="less">
  ol, ul, li {
    list-style: none outside none;
  }

  .investevent {
    .banner {
      img {
        display: block;
        width: 100%;
        height: auto;
      }
      .list {
        overflow: hidden;
        margin-top: 30px;
        li {
          float: left;
          width: 47%;
          border: solid 1px #d9dce0;
          padding-bottom: 10px;
          margin-top: 10px;
          p:nth-of-type(1) {
            color: #333;
            font-size: 18px;
            padding: 8px 0 5px;
          }
          p:nth-of-type(2) {
            color: #999;
            font-size: 12px;
          }
          .box {
            width: 80px;
            height: 80px;
            border: solid 3px #ff9900;
            margin: 10px auto;
            border-radius: 50%;
            p:nth-of-type(1) {
              color: #ff9900;
              font-size: 18px;
              font-weight: bold;
            }
            p:nth-of-type(2) {
              color: #999;
              font-size: 12px;
              margin-top: 3px;
            }
          }
          button {
            width: 65%;
            height: 30px;
            border: none;
            background: #ff9900;
            color: #fff;
            font-size: 20px;
          }
        }
      }
    }
  }
</style>
