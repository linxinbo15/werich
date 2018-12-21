<template>
  <div class='assetrecord'>
    <div class="sub">
      <div class="sub_item" style="border-right: 0.5px solid #90b5fe;">日期</div>
      <div class="sub_item">日收益</div>
    </div>
    <div class='wrap'>
      <div class="con">
        <ul>
          <li v-for='item in list'>
            <span>{{item.date}}</span>
            <span :class="{'reduce':Number(item.profit) < 0 ,'add':Number(item.profit) >= 0}">{{item.profit}}元</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
  import {mianUrlt9} from '../vuex/api'
  import {Toast, Confirm} from 'vux'

  export default {
    data () {
      return {
        id: this.$route.query.id,
        list: []
      }
    },
    mounted () {
      this.getrecord()
    },
    components: {
      Toast,
      Confirm
    },
    methods: {
      getrecord () {
        var that = this
        this.$http.post(mianUrlt9 + 'user/getGroupProfitRecord', {
          groupFundBuyId: this.id
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            for (let i = 0; i < res.data.data.length; i++) {
              let obj = {}
              obj.date = res.data.data[i].navDate
              obj.profit = res.data.data[i].dailyProfit
              this.list.push(obj)
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
          } else if (res.data.retCode === '990103') {
            this.$vux.toast.text('系统正在维护，请稍后再试', 'middle', 3000)
          } else if (res.data.retCode === '990104') {
            this.$vux.toast.text('服务器内部错误', 'middle', 3000)
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      }
    }
  }

</script>
<style lang="less" scoped>
  @import '../styles/custom.less';
  .assetrecord .sub {
    font-size: 16px;
    color: #fff;
    line-height: 40px;
    background: linear-gradient(to right bottom, rgb(44, 136, 255), rgb(29, 95, 252));
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .sub_item {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: center;
  }

  .assetrecord .con {
    background: #fff;
  }

  .assetrecord .con ul li {
    font-size: 14px;
    height: 42px;
    border-top: solid 1px #f2f2f2;
    list-style: none;
  }

  .assetrecord .con ul li span {
    float: left;
    display: block;
    width: 50%;
    line-height: 42px;
    text-align: center;
  }

  .assetrecord .con ul li .reduce {
    color: @greenfont;
  }

  .assetrecord .con ul li .add {
    color: @redfont;
  }

</style>
