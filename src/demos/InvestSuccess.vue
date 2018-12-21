<template>
  <div class="invest_success">
    <div class="inbox"></div>
    <div class="weui-msg__icon-area"><i class="weui-icon_msg weui-icon-success"></i></div>
    <div class="success">恭喜您,计划设置成功!</div>
    <div class="success_box" style="margin-top: 12px;">
      <div class="success_box_top">
        <div class="box_item"><p>定投日期</p>
          <h2>{{cycle}}{{date_invest[0]}}</h2></div>
        <div class="box_item"><p>定投金额</p>
          <h2>{{money}}</h2></div>
      </div>
      <div class="success_box_center">
        <h2>定投详情</h2>
        <div class="box_item1">
          <div class="box_item1_left">计划名称</div>
          <div class="box_item1_right">{{planName}}</div>
        </div>
        <div class="box_item1">
          <div class="box_item1_left">目标金额</div>
          <div class="box_item1_right">{{dream_money}}元</div>
        </div>
        <div class="box_item1">
          <div class="box_item1_left">定投产品</div>
          <div class="box_item1_right">{{fundname}}</div>
        </div>
        <div class="box_item1">
          <div class="box_item1_left">定投期限</div>
          <div class="box_item1_right">{{term}}期</div>
        </div>
        <div class="box_item1">
          <div class="box_item1_left">预计实现时间</div>
          <div class="box_item1_right">{{zdate}}</div>
        </div>
        <!--<div class="box_item1">
          <div class="box_item1_left">扣款账户</div>
          <div class="box_item1_right">{{bankname}}</div>
        </div>-->
      </div>
      <div class="success_box_end">
        将于{{nextTradeDate}}完成第一笔扣款
      </div>
    </div>
    <tabbar>
      <tabbar-item badge=" " :link="{path: '/'}">
        <!--<img slot="icon" src="../assets/demo/icon_nav_cell.png">-->
        <span slot="label">返回首页</span>
      </tabbar-item>
      <tabbar-item badge=" " :link="{path: '/component/asset'}">
        <!--<img slot="icon" src="../assets/demo/icon_nav_cell.png">-->
        <span slot="label">查看计划</span>
      </tabbar-item>
    </tabbar>

  </div>
</template>

<i18n>
  set bar-active-color:
  zh-CN: 设置bar颜色
</i18n>

<script>
  import {
    XInput,
    Confirm,
    Loading,
    Toast,
    XNumber,
    Datetime,
    Selector,
    Box,
    Group,
    XButton,
    Swiper,
    SwiperItem,
    Tabbar,
    TabbarItem,
    PopupPicker
  } from 'vux'

  export default {
    components: {
      XInput,
      Confirm,
      Group,
      XNumber,
      Toast,
      Loading,
      Datetime,
      Box,
      XButton,
      Swiper,
      SwiperItem,
      Tabbar,
      TabbarItem,
      PopupPicker,
      Selector
    },
    data () {
      return {
        plan: 'A',
        swiperItemIndex: 0,
        zdate: '',
        cycle: '',
        date_invest: ['请选择定投日期'],
        zhis: '',
        list: [['每月', '每周', '每双周']],
        listc: [[]],
        bankname: '',
        money: '',
        fundname: '',
        aimode: false,
        planName: '',
        dream: '',
        dream_money: '',
        position: 'default',
        toastText: '',
        showPositionValue: false,
        term: '',
        nextTradeDate: ''
      }
    },
    methods: {
      getParams () {
        // 取到路由带过来的参数
        // console.log(this.$route)
        this.planName = this.$route.query.planName
        this.dream_money = this.$route.query.dream_money
        this.zdate = this.$route.query.zdate
        // this.cycle = []
        this.term = this.$route.query.term
        this.cycle = this.$route.query.cycle
        const dateinvest = this.$route.query.date_invest
        this.date_invest = []
        this.date_invest.push(dateinvest)
        this.zhis = this.$route.query.zhis
        this.bankname = this.$route.query.banktext
        this.money = this.$route.query.money
        this.nextTradeDate = this.$route.query.nextTradeDate
        this.fundname = this.$route.query.fundname
        // 将数据放在当前组件的数据内
        console.log(this.$route.query.cycle)
      }
    },
    mounted () {
      this.getParams()
      // console.log(222)
      // this.indexList = getIndexAll()
      // console.log(this.demo01_list)
      // }
    }
  }
</script>

<style lang="less" scoped>
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/center.less';
  @import '../styles/custom.less';

  .step_banner {
    position: relative;
  }

  .step_banner img {
    display: block;
    width: 100%;
    height: auto;
  }

  .inbox {
    height: 20px;
  }

  .planTitle {
    line-height: 44px;
    font-size: 16px;
    padding-left: 10px;
    color: #2c91f9;
  }

  .invest_success {
    background-color: #2c91f9;
    height: 100%;
    text-align: center;
  }

  .weui-icon_msg {
    font-size: 66px;
  }

  .weui-icon-success {
    font-size: 66px;
    color: #ffffff;
  }

  .success {
    font-size: 18px;
    color: #ffffff;
    text-align: center;
    margin-top: 10px;
  }

  .box_item1_left {
    width: 100px;
    line-height: 36px;
    font-size: 14px;
    padding-left: 20px;
    color: #808080;
    text-align: left;
    background: #ffffff url(../assets/invest/dui.png) no-repeat left center;
    background-size: 10px auto;
  }

  .box_item1_right {
    flex: 1;
    line-height: 36px;
    font-size: 14px;
    color: #222222;
    text-align: left;
  }

  .weui-tabbar__item {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    justify-content: center;
    -webkit-justify-content: center;
  }

  .weui-tabbar__item:nth-child(1) {
    background-color: #ffffff;
    flex: 1;
    height: 55px;
    border-right: 1px solid #edf0f4;
  }

  .weui-tabbar__item:nth-child(2) {
    background-color: #ffffff;
    flex: 1;
    height: 55px;
  }

  .swiper-demo-img img {
    display: block;
    width: 100%;
    height: auto;
  }

  .weui-tabbar__label span {
    font-size: 16px;
    color: #2c91f9;
  }

  .box_item1 {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    justify-content: center;
    -webkit-justify-content: center;
    /*border-bottom: 1px dotted #f4f4f4;*/
  }

  .box_item {
    flex: 1;
    padding: 12px 0;
  }

  .box_item:first-child {
    border-right: 1px dotted #c3d7f0;
  }

  .box_item p {
    text-align: center;
    font-size: 14px;
    color: #808080;
  }

  .box_item h2 {
    text-align: center;
    font-size: 16px;
    color: #222222;
  }

  .success_box {
    background-color: #ffffff;
    width: 94%;
    margin: 0 auto;
    border-radius: 10px;
  }

  .success_box_top {
    border-bottom: 1px dotted #c3d7f0;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    justify-content: center;
    -webkit-justify-content: center;
  }

  .success_box_center {
    padding: 15px;
  }

  .success_box_center h2 {
    text-align: left;
    font-size: 16px;
    font-weight: bold;
  }

  .success_box_end {
    border-top: 1px dotted #c3d7f0;
    line-height: 44px;
    font-size: 14px;
    color: #222222;
  }

  .active-6-1 {
    color: rgb(252, 55, 140) !important;
    border-color: rgb(252, 55, 140) !important;
  }

  .active-6-2 {
    color: #04be02 !important;
    border-color: #04be02 !important;
  }

  .active-6-3 {
    color: rgb(55, 174, 252) !important;
    border-color: rgb(55, 174, 252) !important;
  }

  .weui-cells__title {
    color: #222222;
  }

  .select_plan {
    background-color: #ffffff;
    margin: 10px 0;
  }

  .weui-cells {
    margin-top: 0px;
  }

  .up {
    color: @redfont;
  }

  .dream {
    border: 1px solid #cccccc;
    width: 90%;
    border-radius: 10px;
    margin: 0 auto;
    margin-bottom: 15px;
  }

  .dream input {
    height: 44px;
    line-height: 44px;
    font-size: 18px;
    color: #222222;
    border: none;
    outline: none;
    width: 100%;
    margin: 0 auto;
    text-align: center;
    border-radius: 15px;
  }

  .down {
    color: @greenfont;
  }
</style>
