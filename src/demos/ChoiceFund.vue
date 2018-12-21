<template>
  <div>
    <div class="topline">
      <sticky
        scroll-box="vux_view_box_body"
        ref="sticky"
        :offset="46"
        :check-sticky-support="false"
        :disabled="disabled">
        <tab>
          <tab-item selected @on-item-click="onItemClick">货币型</tab-item>
          <tab-item @on-item-click="onItemClick">混合型</tab-item>
          <tab-item @on-item-click="onItemClick">股票型</tab-item>
          <tab-item @on-item-click="onItemClick">QDII型</tab-item>
          <tab-item @on-item-click="onItemClick">债券型</tab-item>
        </tab>
      </sticky>
    </div>
    <div>
      <router-link class="fundlist" v-for="(item,index) in fundlist" :key="index"
                   :to="{path:'/component/fund-detail', query:{fundcode:item.fundCode, fundname:item.fundName, fundtype:item.fundType}}">
        <div class="fundlist_left">
          <div class="fundlist_title">{{item.fundName}}<span> {{item.fundCode.slice(0,6)}}</span></div>
          <p v-if="item.fundType=='货币型' || item.fundType == '货币市场型'">万份收益：{{Number(item.fnavUnit).toFixed(4)}}</p>
          <p v-else>最新净值：{{Number(item.fnavUnit).toFixed(4)}}</p>
        </div>
        <div class="fundlist_right">
          <div :class="Number(item.favgReturnYear)>0?'fundlist_syl up':'fundlist_syl down'">
            {{Number(item.favgReturnYear).toFixed(2)}}%
          </div>
          <p>近一年收益</p>
        </div>
      </router-link>
    </div>
    <div class="center">
      <img src="../assets/mf_1123.jpg" class="ad_img"/>
    </div>

  </div>
</template>

<script>
  import {Tab, TabItem, Sticky, Divider, XButton, Swiper, SwiperItem} from 'vux'
  import {mianUrlt9} from '../vuex/api'

  export default {
    components: {
      Tab,
      TabItem,
      Sticky,
      Divider,
      XButton,
      Swiper,
      SwiperItem
    },
    data () {
      return {
        fundlist: [],
        disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent)
      }
    },
    methods: {
      onItemClick (index) {
        // console.log('on item click:', index)
        if (index === 0) {
          this.getStockTypeList('货币型')
        } else if (index === 1) {
          this.getStockTypeList('混合型')
        } else if (index === 2) {
          this.getStockTypeList('股票型')
        } else if (index === 3) {
          this.getStockTypeList('QDII型')
        } else if (index === 4) {
          this.getStockTypeList('债券型')
        }
      },
      getStockTypeList (stockType) {
        // console.log(stockType)
        const obj = {
          fundType: stockType
        }
        this.$http.post(mianUrlt9 + 'fund/recommendFundList', obj, {emulateJSON: true}).then(({data}) => {
          if (data.retCode === '0') {
            this.fundlist = data.data.list
            // console.log(this.fundlist)
            // console.log(this.indexList)
          }
        })
      }
    },
    mounted () {
      this.getStockTypeList('货币型')
      // this.getIndex = () => {
      // console.log(222)
      // this.indexList = getIndexAll()
      // console.log(this.demo01_list)
      // }
    }
  }
</script>

<style lang="less" scoped>
  @import '../styles/custom.less';

  .box {
    padding: 15px;
  }

  .center {
    margin-top: 15px;
    text-align: center;
  }

  .ad_img {
    display: block;
    width: 100%;
    height: auto;
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

  .tab-swiper {
    background-color: #fff;
    height: 100px;
  }

  .fundlist {
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    padding: 15px;
    background-color: #fff;
    border-bottom: 1px solid @ai-line-color;
  }

  .topline{
    border-top: 0.5px solid @ai-line-color;
  }

  .vux-tab .vux-tab-item.vux-tab-selected {
    color: @tabbtnColor;
    border-bottom: 3px solid @tabbtnColor;
  }

  .fundlist_right {
    width: 25%;
  }

  .fundlist p {
    font-size: 14px;
    color: #999999;
  }

  .fundlist_title {
    font-size: @fontTitleSize;
    color: #222222;
    margin-bottom: @titileBottomMargin;
  }

  .fundlist_title span {
    font-size: 14px;
    color: #666666;
  }

  .fundlist_syl {
    font-size: @fontTitleSize;
    font-weight: bold;
    margin-bottom: @titileBottomMargin;
  }

  .up {
    color: @redfont;
  }

  .down {
    color: @greenfont;
  }

  .fundlist_left {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: left;
  }
</style>
