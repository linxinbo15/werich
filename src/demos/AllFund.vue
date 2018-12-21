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
          <tab-item selected @on-item-click="onItemClick('全部基金')">全部基金</tab-item>
          <tab-item v-for="(item,index) in fundComp" :key="index" @on-item-click="onItemClick(item.name)">
            {{item.name}}
          </tab-item>
          <!--<tab-item @on-item-click="onItemClick">混合型</tab-item>
          <tab-item @on-item-click="onItemClick">债券型</tab-item>
          <tab-item @on-item-click="onItemClick">货币型</tab-item>
          <tab-item @on-item-click="onItemClick">指数型</tab-item>
          <tab-item @on-item-click="onItemClick">QDII</tab-item>
          <tab-item @on-item-click="onItemClick">其他</tab-item>-->
        </tab>
      </sticky>
    </div>
    <scroller v-show="showList" lock-x scrollbar-y use-pullup @on-pullup-loading="load1" ref="demo1"
              :pullup-config="{loadingContent: $t('Loading...')}">
      <div class="box2">
        <router-link class="fundlist" v-for="(item,index) in fundlist" :key="index"
                     :to="{path:'/component/fund-detail', query:{fundcode:item.fundCode, fundname:item.fundName, fundtype:item.fundType}}">
          <div class="fundlist_left">
            <div class="fundlist_title">{{item.fundName}}<span> {{item.fundCode.slice(0,6)}}</span></div>
            <p v-if="item.fundType == '货币型' || item.fundType == '货币市场型'">
              万份收益：{{Number(item.fnavUnit).toFixed(4)}}</p>
            <p v-else>最新净值：{{Number(item.fnavUnit).toFixed(4)}}</p>
          </div>
          <div class="fundlist_right">
            <div :class="Number(item.favgReturnYear)>0?'fundlist_syl up':'fundlist_syl down'">
              {{Number(item.favgReturnYear).toFixed(2)}}%
            </div>
            <p>近一年收益</p>
          </div>
        </router-link>
        <!--<load-more tip="loading"></load-more>-->
      </div>
    </scroller>
    <div class="none" v-show="!showList">暂无相关基金</div>
  </div>
</template>

<script>
  import {Tab, TabItem, Group, Cell, XButton, Sticky, Scroller, Divider, Spinner, Companies} from 'vux'
  import {mianUrl, mianUrlt9} from '../vuex/api'

  export default {
    components: {
      Tab,
      TabItem,
      Group,
      Cell,
      XButton,
      Sticky,
      Scroller,
      Divider,
      Spinner
    },
    data() {
      return {
        results: [],
        value: 'test',
        fundlist: [],
        n1: 10,
        page: 1,
        fundComp: Companies,
        pageRecorders: 10,
        pullupConfig2: {
          content: '上拉加载更多',
          downContent: '松开进行加载',
          upContent: '上拉加载更多',
          loadingContent: '加载中...'
        },
        showList: true,
        typeText: '',
        disabled: typeof navigator !== 'undefined' && /iphone/i.test(navigator.userAgent) && /ucbrowser/i.test(navigator.userAgent)
      }
    },
    methods: {
      load1() {
        setTimeout(() => {
          // this.n1 += 10
          this.page = this.page + 1
          let obj = {}
          if (this.typeText === '') {
            obj = {
              pageNum: this.page,
              pageSize: this.pageRecorders,
              information:'all',
              flat:3
            }
          } else {
            obj = {
              pageNum: this.page,
              pageSize: this.pageRecorders,
              information: this.typeText,
              flat:2
            }
          }

          this.$http.post(mianUrlt9 + '/fund/fundSearch', obj, {emulateJSON: true}).then(({data}) => {
            if (data.retCode === '0') {
              if (data.data.list === undefined || data.data.list.length === 0) {
                setTimeout(() => {
                  this.$refs.demo1.disablePullup()
                }, 100)
              } else {
                this.fundlist = this.fundlist.concat(data.data.list)
                setTimeout(() => {
                  this.$refs.demo1.donePullup()
                }, 100)
              }
            }
          })
        }, 1000)
      },
      onItemClick(val) {
        // console.log('on item click:', index)
        // console.log(index)
        if (val === '全部基金') {
          this.getStockTypeList(1)
          this.typeText = ''
        } else {
          this.getStockTypeListClass(1, val)
          this.typeText = val
        }
      },
      getStockTypeListClass(page, type) {
        const obj = {
          pageNum: page,
          pageSize: this.pageRecorders,
          information:type,
          flat:2
        }
        this.$http.post(mianUrlt9 + '/fund/fundSearch', obj, {emulateJSON: true}).then(({data}) => {
          if (data.retCode === '0') {
            this.fundlist = data.data.list
            // 重置组件数据，要不看不到内容，下拉页数太多的话
            if (data.data.list.length === 0) {
              this.showList = false
            } else if (data.data.length < 10) {
              this.showList = true
              this.$refs.demo1.disablePullup()
              this.$refs.demo1.reset({top: 0})
            } else {
              setTimeout(() => {
                this.showList = true
                this.$refs.demo1.enablePullup()
                this.$refs.demo1.reset({top: 0})
              }, 100)
            }
          } else {
            this.showList = false
          }
        })
      },
      getStockTypeList(page) {
        // console.log(stockType)
        const obj = {
          pageNum: page,
          pageSize: this.pageRecorders,
          information:'all',
          flat:3
        }
        this.$http.post(mianUrlt9 + '/fund/fundSearch', obj, {emulateJSON: true}).then(({data}) => {
          if (data.retCode === '0') {
            this.fundlist = data.data.list
            // console.log(this.indexList)
          }
        })
      }
    },
    mounted() {
      const that = this
      that.getStockTypeList(1)
      // this.getIndex = () => {
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

  .box {
    padding: 15px;
  }

  .topline{
    border-top: 0.5px solid @ai-line-color;
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
    font-size: @fontTitleSize;;
    font-weight: bold;
    margin-bottom: @titileBottomMargin;
  }

  .none {
    font-size: 14px;
    color: #333333;
    text-align: center;
    padding: 10px;
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
