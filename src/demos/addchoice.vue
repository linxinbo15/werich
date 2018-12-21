<template>
  <div class="choice">
    <!--<div class="hsIndex" :show-lr-borders="false" :show-vertical-dividers="false" v-show="indexList.length != 0">
      <div link="/component/cell" class="hs_item" v-for="item in indexList">
        <p>{{item.s_info_windcode}}</p>
        <h2 :class="Number(item.s_dq_change)>0?'up':'down'">{{Number(item.s_dq_close).toFixed(2)}}</h2>
        <span :class="Number(item.s_dq_change)>0?'up':'down'">{{Number(item.s_dq_change)>0?'+'+item.s_dq_change.toFixed(2):item.s_dq_change.toFixed(2)}} {{Number(item.s_dq_pctchange)>0?'+'+item.s_dq_pctchange.toFixed(2):item.s_dq_pctchange.toFixed(2)}}%</span>
      </div>
    </div>
    <p class='date'>数据截止到 {{date}}</p>-->
    <div>
      <flexbox>
        <flexbox-item style="text-align: left">
          <div class="flex-demo">基金名称</div>
        </flexbox-item>
        <flexbox-item>
          <div class="flex-demo">最新净值</div>
        </flexbox-item>
        <flexbox-item>
          <div class="flex-demo">涨跌幅</div>
        </flexbox-item>
      </flexbox>
      <swipeout v-show='!flag'>
        <swipeout-item :threshold="1" underlay-color="#ccc" v-for='(item,index) in fundlist' :key="index">
          <div slot="right-menu">
            <swipeout-button @click.native="onButtonClick('delete',index)" background-color="#ff0000">删除</swipeout-button>
          </div>
          <div slot="content" class="demo-content vux-1px-tb" @click="goFundDetail(item.name,item.code,item.type)">
            <!-- {{$t('threshold = 0.5')}} -->
            <flexbox>
              <flexbox-item>
                <div class="flex-demo" style="text-align:left;padding-left:10px;">
                  <p class='name'>{{item.name}}</p>
                  <p class='code'>{{item.code}}</p>
                </div>
              </flexbox-item>
              <flexbox-item>
                <div class="flex-demo">{{item.nav}}</div>
              </flexbox-item>
              <flexbox-item>
                <div class="flex-demo"><a :class='{"btn red":Number(item.gain) >= 0,"btn green":Number(item.gain) < 0}'>{{item.gain}}%</a>
                </div>
              </flexbox-item>
            </flexbox>
          </div>
        </swipeout-item>
      </swipeout>
      <div class="nt_noData" @click="tiaozhuan()" v-show='flag'>
        <img src="../assets/null.png">
        <h3>没有自选,去基金市场看看</h3>
      </div>
    </div>
  </div>
</template>
<script>
  import {mianUrl, mianUrlt9} from '../vuex/api'
  import {Flexbox, FlexboxItem, GroupTitle, Swipeout, SwipeoutItem, SwipeoutButton, XButton, Toast, Confirm} from 'vux'

  export default {
    data () {
      return {
        indexList: [],
        date: '',
        fundlist: [],
        flag: false
      }
    },
    components: {
      Flexbox,
      FlexboxItem,
      GroupTitle,
      Swipeout,
      SwipeoutItem,
      SwipeoutButton,
      XButton,
      Toast,
      Confirm
    },
    mounted () {
      //this.created()
      this.getlist()
    },
    methods: {
      goFundDetail (name, code, type) {
        this.$router.push({
          path: '/component/fund-detail',
          query: {fundcode: code, fundname: name, fundtype: type}
        })
      },
      tiaozhuan () {
        this.$router.push('/component/all-fund')
      },
      onButtonClick (type, index) {
        var id = this.fundlist[index].id
        this.$http.post(mianUrlt9 + 'user/deleteFundChoice', {
          id: id
        }, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            this.$vux.toast.text('删除成功', 'middle', 3000)
            this.fundlist.splice(index, 1)
          } else {
            var msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      },
      handleEvents (type) {
        console.log('event: ', type)
      },
      created () {
        this.$http.post(mianUrl + '/getAllIndexAction').then(({data}) => {
          if (data.retcode === '0000') {
            for (var value in data.data) {
              // console.log(value)
              if (data.data[value].s_info_windcode === '399001.SZ') {
                data.data[value].s_info_windcode = '深证成指'
              } else if (data.data[value].s_info_windcode === '399006.SZ') {
                data.data[value].s_info_windcode = '创业板指'
              } else if (data.data[value].s_info_windcode === '000300.SH') {
                data.data[value].s_info_windcode = '沪深300'
              }
            }
            this.indexList = data.data
            this.date = data.data[0].trade_dt
            // console.log(this.indexList)
          }
        })
      },
      getlist () {
        var that = this
        this.$http.post(mianUrlt9 + 'user/queryFundChoice').then((res) => {
          if (res.data.retCode === '0') {
            if (res.data.data.fundChoiceList.length === 0) {
              this.flag = true
            } else {
              for (var i = 0; i < res.data.data.fundChoiceList.length; i++) {
                var obj = {}
                obj.id = res.data.data.fundChoiceList[i].id
                obj.name = res.data.data.fundChoiceList[i].fundName
                obj.code = res.data.data.fundChoiceList[i].fundCode
                obj.nav = res.data.data.fundChoiceList[i].fundNav
                obj.type = res.data.data.fundChoiceList[i].fundType
                if (Number(res.data.data.fundChoiceList[i].fundGains) > 0) {
                  obj.gain = '+' + res.data.data.fundChoiceList[i].fundGains
                } else {
                  obj.gain = res.data.data.fundChoiceList[i].fundGains
                }
                this.fundlist.push(obj)
              }
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
            var msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      }

    }
  }

</script>
<style lang='less' scoped>
  @import '~vux/src/styles/1px.less';
  @import '../styles/custom.less';

  .choice .nt_noData {
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    background-color: #ffffff;
    padding: 10px;
  }



  .choice .nt_noData img {
    width: 42px;
    height: 42px;
    margin: 0 auto;
  }

  .choice .nt_noData h3 {
    margin-top: 10px;
    font-size: 14px;
    font-weight: normal;
    line-height: 2;
    color: #6272af;
  }

  .vux-flexbox .vux-flexbox-item:first-child {
    -webkit-box-flex: 2;
    flex: 2;
    -webkit-flex: 2;
    min-width: 20px;
  }

  .flex-demo {
    text-align: left;
    color: #6272af;
    font-size: 16px;
    border-radius: 4px;
    background-clip: padding-box;
    padding: 10px 0 10px 10px;
  }


  .choice .hsIndex {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    background-color: #fff;
    padding: 10px 0;
    border-top: 0.5px solid @ai-line-color;
  }

  .vux-1px-tb:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: none;
    color: #C7C7C7;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .vux-1px-tb:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid @ai-line-color;
    color: @ai-line-color;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .vux-flex-row{
    position: relative;
  }

  .vux-flex-row:after{
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid @ai-line-color;
    color: @ai-line-color;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .choice .center {
    margin-top: 15px;
    text-align: center;
  }

  .choice .hs_item {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: center;
  }

  .choice .hs_item p {
    color: #222222;
    font-size: 14px;
  }

  .choice .hs_item h2 {
    font-size: 18px;
    margin-top: 5px;
    margin-bottom: 0px;
    line-height: 1;
  }

  .choice .hs_item span {
    font-size: 12px;
  }

  .choice .up {
    color: @redfont;
  }

  .choice .down {
    color: @greenfont;
  }

  .choice .date {
    font-size: 12px;
    color: #a1afb4;
    padding-left: 20px;
    background-color: #fff;
    padding-bottom: 10px;
  }

  .choice .btn {
    display: inline-block;
    width: 60px;
    font-size: 14px;
    color: #fff;
    line-height: 30px;
    text-align: center;
    border-radius: 5px;
  }

  .choice .name {
    color: #333;
    font-size: 16px;
  }

  .choice .code {
    color: #a1afb4;
    font-size: 12px;
  }

  .choice .red {
    background-color: #FD0000;
  }

  .choice .green {
    background-color: #07a168;
  }
</style>
