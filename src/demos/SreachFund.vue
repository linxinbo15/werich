<template>
  <div>
    <div style="height:50px;">
      <search
        @result-click="resultClick"
        @on-change="getResult"
        v-model="value"
        position="absolute"
        auto-scroll-to-top
        top="50px"
        placeholder="基金简称/代码/全称"
        @on-focus="onFocus"
        @on-cancel="onCancel"
        @on-submit="onSubmit"
        ref="search"></search>
    </div>
    <scroller v-show="fundlist.length !== 0" lock-x scrollbar-y use-pullup @on-pullup-loading="load1" ref="demo1"
              :pullup-config="{loadingContent: $t('Loading...')}">
      <div class="box2">
        <div class="listTitle">{{listTitle}}</div>
        <router-link class="fundlist" v-for="(item,index) in fundlist" :key="index"
                     :to="{path:'/component/fund-detail', query:{fundcode:item.fundCode, fundname:item.fundName, fundtype:item.fundType}}">
          <div class="fundlist_left">
            <div class="fundlist_title">{{item.fundName}}<span> {{item.fundCode.slice(0,6)}}</span></div>
            <p v-if="item.fundType == '货币型' || item.fundType == '货币市场型'">万份收益：{{Number(item.fnavUnit).toFixed(4)}}</p>
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
    </scroller>
    <div v-show="fundlist.length === 0">
      <div class="box2">
        <div class="listTitle">推荐基金</div>
        <router-link class="fundlist" v-for="(item,index) in fundlistChoice" :key="index"
                     :to="{path:'/component/fund-detail', query:{fundcode:item.fundCode, fundname:item.fundName, fundtype:item.fundType}}">
          <div class="fundlist_left">
            <div class="fundlist_title">{{item.fundName}}<span> {{item.fundCode.slice(0,6)}}</span></div>
            <p v-if="item.fundType == '货币型' || item.fundType == '货币市场型'">万份收益：{{Number(item.fnavUnit).toFixed(4)}}</p>
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
    </div>
  </div>
</template>

<script>
  import {Tab, TabItem, Search, Group, Cell, XButton, Sticky, Scroller, Divider, Spinner} from 'vux'
  import {mianUrl, mianUrlt9} from '../vuex/api'

  export default {
    components: {
      Tab,
      TabItem,
      Search,
      Group,
      Cell,
      XButton,
      Sticky,
      Scroller,
      Divider,
      Spinner
    },
    data () {
      return {
        results: [],
        value: '',
        fundlist: [],
        fundlistChoice: [],
        n1: 10,
        page: 1,
        listTitle: '搜索结果',
        pageRecorders: 10,
        pullupConfig2: {
          content: '上拉加载更多',
          downContent: '松开进行加载',
          upContent: '上拉加载更多',
          loadingContent: '加载中...'
        },
        typeText: ''
      }
    },
    methods: {
      load1 () {
        setTimeout(() => {
          // this.n1 += 10
          this.page = this.page + 1
          let obj = {}
          if (this.typeText === '') {
            console.log('搜索内容为空！')
          } else {
            if (this.typeText == '创富宝') {
              this.$router.push({
                path: '/component/chuangfu'
              })
            } else {
              obj = {
                pageNum: this.page,
                pageSize: this.pageRecorders,
                information: this.typeText
              }
              if (/[0-9]+/.test(this.typeText)) {
                obj.flat = 0
              } else if (/[a-zA-Z0-9]+/.test(this.typeText)) {
                obj.flat = 4
              } else {
                obj.flat = 1
              }
            }
          }
          this.$http.post(mianUrlt9 + 'fund/fundSearch', obj, {emulateJSON: true}).then(({data}) => {
            if (data.retCode === '0') {
              if (data.data.list === undefined || data.data.list.length === 0) {
                setTimeout(() => {
                  this.$refs.demo1.disablePullup()
                }, 100)
              } else if (data.data.list.length < 10) {
                this.fundlist = this.fundlist.concat(data.data.list)
                setTimeout(() => {
                  this.$refs.demo1.disablePullup()
                  this.$refs.demo1.reset({top: 0})
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
      setFocus () {
        this.$refs.search.setFocus()
      },
      resultClick (item) {
        window.alert('you click the result item: ' + JSON.stringify(item))
      },
      getResult (val) {
        console.log('on-change', val)
        this.typeText = val
      },
      onSubmit () {
        this.$refs.search.setBlur()
        this.$vux.toast.show({
          type: 'text',
          position: 'top',
          text: '正在搜索基金'
        })
        this.sreachFund()
      },
      onFocus () {
        // console.log('on focus')
        // this.$router.push(`/component/sreach-fund`)
      },
      onCancel () {
        console.log('on cancel')
      },
      onSwiperItemIndexChange (index) {
        console.log('demo item change', index)
      },
      onItemClick () {
        console.log('on item click')
      },
      sreachFund () {
        let obj = {}
        this.page = 1
        if (this.typeText === '') {
          console.log('搜索内容为空！')
        } else {
          if(this.typeText == '创富宝') {
            this.$router.push({
              path: '/component/chuangfu'
            })
          }else {
            obj = {
              pageNum: this.page,
              pageSize: this.pageRecorders,
              information: this.typeText
            }
            if (/[0-9]+/.test(this.typeText)) {
              obj.flat = 0
            } else if (/[a-zA-Z0-9]+/.test(this.typeText)) {
              obj.flat = 4
            } else {
              obj.flat = 1
            }
          }
        }
        this.$http.post(mianUrlt9 + 'fund/fundSearch', obj, {emulateJSON: true}).then(({data}) => {
          if (data.retCode === '0') {
            if (data.data.list.length === 0 || data.data.list === undefined) {
              this.fundlist = []
            } else if (data.data.list.length < 10) {
              this.fundlist = data.data.list
              setTimeout(() => {
                this.$refs.demo1.disablePullup()
                this.$refs.demo1.reset({top: 0})
              }, 100)
            } else {
              this.fundlist = data.data.list
              setTimeout(() => {
                this.$refs.demo1.enablePullup()
                this.$refs.demo1.reset({top: 0})
              }, 100)
            }
          }
        })
      },
      getStockTypeList (stockType) {
        // console.log(stockType)
        const obj = {
          fundType: stockType
        }
        this.$http.post(mianUrlt9 + 'fund/recommendFundList', obj, {emulateJSON: true}).then(({data}) => {
          if (data.retCode === '0') {
            this.fundlistChoice = data.data.list
            // console.log(this.fundlist)
            // console.log(this.indexList)
          }
        })
      }
    },
    mounted () {
      const that = this
      that.setFocus()
      that.getStockTypeList('债券型')
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

  .fundlist_right {
    width: 25%;
  }

  .fundlist p {
    font-size: 12px;
    color: #999999;
  }

  .fundlist_title {
    font-size: @fontTitleSize;
    color: #222222;
    margin-bottom: @titileBottomMargin;
  }

  .fundlist_title span {
    font-size: 12px;
    color: #666666;
  }

  .fundlist_syl {
    font-size: @fontTitleSize;;
    font-weight: bold;
    margin-bottom: @titileBottomMargin;
  }

  .up {
    color: @redfont;
  }

  .down {
    color: @greenfont;
  }

  .listTitle {
    font-size: 14px;
    padding: 10px 15px 8px;
    border-bottom: 1px solid @ai-line-color;
  }

  .fundlist_left {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    text-align: left;
  }
</style>
