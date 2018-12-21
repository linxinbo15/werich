<template>
  <div>
    <div class="aibg"><img src="../../static/image/aibg.png"/></div>
    <div class="aiContent" v-for="item in groupList">
      <!--<div class="ai_flag">智能模型</div>-->
      <div class="ai_name">{{item.groupName}}
        <div class="ai_flag" v-show="item.groupGrade == 1"><img src="../assets/class1.png"/></div>
        <div class="ai_flag" v-show="item.groupGrade == 2"><img src="../assets/class2.png"/></div>
        <div class="ai_flag" v-show="item.groupGrade == 3"><img src="../assets/class3.png"/></div>
      </div>
      <h2 :class="Number(item.fdReturnYearRatio)>0?'ai_profit up':'ai_profit down'" >{{(Number(item.fdReturnYearRatio)*100).toFixed(2)}}%</h2>
      <p class="ai_full">成立以来涨幅</p>
      <div class="star">
        <img src="../assets/star.png" class="starimg"/>
        <div class="startext">{{item.groupText}}</div>
      </div>
      <div class="btn_buy" @click="buygroup(item.groupCode,item.groupName)">立即购买</div>
    </div>
  </div>
</template>
<style lang="less" scoped>
  @import '../styles/custom.less';
  .vue-version {
    text-align: left;
    font-size: 12px;
    color: #999;
    padding: 10px;
  }
  .date{
    font-size:12px;
    color: #a1afb4;
    padding-left: 20px;
    background-color: #fff;
    padding-bottom: 10px;
  }
  .weui-grids:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: none;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .swiper-demo-img img {
    display: block;
    width: 100%;
    height: auto;
  }
  .vux-indicator-right{
    position: absolute;
    right: 15px;
    bottom: 5px;
  }
  .btn_buy{
    background-color: #fff;
    border: 1px solid @ai-btn-color;
    border-radius: 5px;
    font-size: 14px;
    color: @ai-btn-color;
    line-height: 38px;
    width: 86%;
    text-align: center;
    margin: 10px auto;
  }
  .center {
    margin-top: 15px;
    text-align: center;
  }
  .vux-notice {
    color: #666;
    line-height: 40px;
  }
  .demo-icon {
    margin-right: 0px;
  }
  .vux-title {
    vertical-align: middle;
    text-align: center;
    color: #04BE02;
    display: inline-block;
    width: 75px;
    height: 75px;
    line-height: 75px;
    border-radius: 50%;
  }
  body {
    font-family: Helvetica, sans-serif;
    background-color: #fbf9fe;
  }
  .demo-tip {
    background-color: #fefcec;
    color: #f76a24;
    font-size: 12px;
    padding: 5px 10px;
    margin-top: 15px;
  }
  .grid-center {
    display: block;
    text-align: center;
    color: #666;
  }
  .weui-grid {
    position: relative;
    float: left;
    padding: 14px 10px;
    width: 33.33333333%;
    box-sizing: border-box;
  }
  .weui-grid:before {
    content: " ";
    position: absolute;
    right: 0;
    top: 0;
    width: 1px;
    bottom: 0;
    border-right: none;
    color: #D9D9D9;
    -webkit-transform-origin: 100% 0;
    transform-origin: 100% 0;
    -webkit-transform: scaleX(0.5);
    transform: scaleX(0.5);
  }
  .weui-grid:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: none;
    color: #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .weui-grids {
    background-color: #fff;
  }
  .aiTitle {
    padding: 12px 15px 8px;
    color: #242424;
    font-size: 16px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    background-color: #fff;
    border-bottom: 1px solid @ai-line-color;
  }
  .notice{
    padding: 10px;
    color: #242424;
    font-size: 14px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    background-color: #fff;
  }

  .notice:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    height: 1px;
    border-top: 1px solid @ai-line-color;
    color: @ai-line-color;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
  .notice_icon{
    width: 14px;
    height: 14px;
  }
  .notice_icon img{
    width: 14px;
    height: auto;
    display: block;
  }
  .notice_text{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: left;
    margin-left: 8px;
    margin-right: 8px;
  }

  .aibg img{
    display: block;
    width: 100%;
    height: auto;
  }

  .aiTitle_left{
    width: 100px;
    text-align: left;
  }
  .aiTitle_left1{
    font-size: 14px;
    color: #81838f;
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: right;
  }
  .hs_item{
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: center;
  }
  .hs_item p {
    color: #222222;
    font-size: 14px;
  }
  .hs_item h2 {
    font-size: 18px;
    margin-top: 5px;
    margin-bottom: 0px;
    line-height: 1;
  }
  .hs_item span {
    font-size: 12px;
  }
  .up{
    color: @redfont;
  }
  .down{
    color: @greenfont;
  }
  .aiTitle_right{
    padding-right: 13px;
    position: relative;
  }
  .aiTitle_right:after {
    content: " ";
    display: inline-block;
    height: 6px;
    width: 6px;
    border-width: 2px 2px 0 0;
    border-color: #C8C8CD;
    border-style: solid;
    -webkit-transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    transform: matrix(0.71, 0.71, -0.71, 0.71, 0, 0);
    position: relative;
    top: -2px;
    position: absolute;
    top: 50%;
    margin-top: -4px;
    right: 2px;
  }
  .ai_name{
    color: #181818;
    font-size: 20px;
    font-weight: bold;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    justify-content: center;
    -webkit-justify-content: center;
  }
  .ai_profit{
    font-size: 32px;
    font-weight: normal;
    line-height: 32px;
    margin-top: 8px;
    text-align: center;
  }
  .ai_full{
    font-size: 14px;
    color: #898989;
    margin-bottom: 8px;
    text-align: center;
  }
  .ai_btn{
    border: 1px solid @ai-btn-color;
    border-radius: 5px;
    color: @ai-font-color;
    font-size: 16px;
    width: 50%;
    margin: 0 auto;
    padding: 8px 0 7px;
    background-color: #fff;
    margin-top: 6px;
  }
  .ai_flag img{
    height: 20px;
    width: auto;
    display: block;
    margin-left: 5px;
  }
  .ad_img{
    display: block;
    width: 100%;
    height: auto;
  }
  .aiContent{
    position: relative;
    background-color: #fff;
    padding: 15px 0;
    border-bottom: 1px solid @ai-line-color;
  }
  .hsIndex {
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    background-color: #fff;
    padding: 10px 0;
  }
  .box h2 {
    font-size: 18px;
    color: #000000;
    text-align: center;
    margin-bottom: 10px;
  }

  .box h3 {
    font-size: 16px;
    color: #222222;
    margin-bottom: 10px;
    text-align: left;
  }

  .box p {
    font-size: 14px;
    color: #666666;
    line-height: 2;
    text-align: left;
  }

  .box span {
    font-size: 14px;
    display: block;
    color: #666666;
    text-indent: 1em;
    line-height: 2;
    text-align: left;
  }

  .star{
    font-size: 14px;
    color: #777777;
    width: 66.66%;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: start;
    -webkit-align-items: flex-start;
    align-items: start;
    margin: 0 auto;
    text-align: center;
  }

  .startext{
    text-align: left;
    margin-left: 5px;
  }

  .starimg{
    width: 14px;
    height: 14px;
    display: block;
    margin-top: 3px;
  }

  .dialog-title {
    line-height: 44px;
    color: #fff;
    font-size: 16px;
    background-color: #ff9900;
  }

  .box {
    padding: 15px;
  }
</style>

<script>
  import {mianUrlt9} from '../vuex/api'
  import {getLocalStorage} from '../vuex/storage'
  import {buyAllGroup} from '../common/buyAllFund'
  export default {
    methods: {
      buygroup (code, name) {
        buyAllGroup(code,name,this)
      },
      getGroupList () {
        this.$http.post(mianUrlt9 + 'fund/recommendGroupList', {}, {emulateJSON: true}).then((res) => {
          // console.log(res)
          if (res.data.retCode === '0') {
            for (let i = 0; i < res.data.data.groupList.length; i++) {
              if (res.data.data.groupList[i].groupCode == 'ct00001') {

              } else {
                let obj = {}
                obj.fdReturnYearRatio = res.data.data.groupList[i].fdReturnYearRatio
                obj.groupBuyLimit = res.data.data.groupList[i].groupBuyLimit
                obj.groupCode = res.data.data.groupList[i].groupCode
                obj.groupName = res.data.data.groupList[i].groupName
                obj.groupText = res.data.data.groupList[i].recommendReason
                if(res.data.data.groupList[i].groupCode == "CJ1001"){
                  obj.groupGrade = 3
                }else if(res.data.data.groupList[i].groupCode == "CJ1004"){
                  obj.groupGrade = 2
                }else if(res.data.data.groupList[i].groupCode == "CJ1007"){
                  obj.groupGrade = 1
                }
                this.groupList.push(obj)
              }
            }

            //this.groupList = res.data.data.list
            // console.log(this.groupList)
          } else {
            const msg = res.data.retMsg
            this.$vux.toast.text(msg, 'middle', 3000)
          }
        })
      }
    },
    mounted () {
      this.getGroupList()
    },
    data () {
      return {
        groupList: []
      }
    }
  }
</script>
