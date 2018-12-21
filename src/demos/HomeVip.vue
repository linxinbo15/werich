<template>
  <div>
    <div class="aibg"><router-link to="/component/invest-home"><img src="../../static/image/vip-banner.png"/></router-link></div>
    <div class="center">
      <!--<div class="aiTitle">
        <div class="aiTitle_left">量化策略推荐</div>
        <div class="aiTitle_left1">专业投研，趋势轮动</div>
        <div class="aiTitle_right"></div>
      </div>-->
      <div class="aiContent" @click="goLofr">
        <div class="ai_name">智能定投<div class="ai_flag"><img src="../assets/class2.png"/></div></div>
        <h2 class="ai_profit up">10.89%</h2>
        <p class="ai_full">预计年化收益率</p>
        <div class="star">
          <img src="../assets/star.png" class="starimg"/>
          <div class="startext">定投、选基、调仓、止损，一键操作，轻松实现目标！</div>
        </div>
      </div>
      <div class="aiContent" @click="goLofr">
        <div class="ai_name">小富即安<div class="ai_flag"><img src="../assets/class1.png"/></div></div>
        <h2 :class="Number(changedata)>0?'ai_profit up':'ai_profit down'">{{changedata1}}</h2>
        <p class="ai_full">{{mingcheng}}</p>
        <div class="star">
          <img src="../assets/star.png" class="starimg"/>
          <div class="startext">智能调整股基货基比例，牛市持股基，熊市转货基。</div>
        </div>
      </div>
      <div class="aiContent" v-for="item in groupList" @click="group(item.groupCode,item.groupName)">
        <!--<div class="ai_flag">智能模型</div>-->
        <div class="ai_name">{{item.groupName}}
          <div class="ai_flag" v-show="item.groupGrade == 1"><img src="../assets/class1.png"/></div>
          <div class="ai_flag" v-show="item.groupGrade == 2"><img src="../assets/class2.png"/></div>
          <div class="ai_flag" v-show="item.groupGrade == 3"><img src="../assets/class3.png"/></div>
        </div>
        <h2 :class="Number(item.fdReturnYearRatio)>0?'ai_profit up':'ai_profit down'" >{{(Number(item.fdReturnYearRatio)).toFixed(2)}}%</h2>
        <p class="ai_full">近一年涨幅</p>
        <div class="star">
          <img src="../assets/star.png" class="starimg"/>
          <div class="startext">{{item.groupText}}</div>
        </div>
      </div>
      <!--<div class="aiContent" @click="goSmartBeta">
        <div class="ai_name">SmartBeta<div class="ai_flag"><img src="../assets/class3.png"/></div></div>
        <h2 :class="Number(changedata_s)>0?'ai_profit up':'ai_profit down'">{{changedata1_s}}</h2>
        <p class="ai_full">{{mingcheng_s}}</p>
        <div class="star">
          <img src="../assets/star.png" class="starimg"/>
          <div class="startext">选定热门板块为策略基准，根据多因子模型进行定期权重调整。</div>
        </div>
      </div>-->
      <box gap="10px 10px">
        <x-button type="primary" @click.native="goTest">重新测评</x-button>
        <!--<x-button type="default" link="/component/register">注册</x-button>-->
      </box>
    </div>
   <!-- <div class="center">
      <img src="../assets/mf_1123.jpg" class="ad_img"/>
    </div>-->
    <!--<div class="center">
      <div class="aiTitle">
        <div class="aiTitle_left">智能组合推荐</div>
        <div class="aiTitle_left1">智能模型，行业领先</div>
        <div class="aiTitle_right"></div>
      </div>

      &lt;!&ndash; <div class="aiContent">
         <div class="ai_flag">智能模型</div>
         <div class="ai_name">智能组合005</div>
         <h2 class="ai_profit">17.66%</h2>
         <p class="ai_full">近一年涨幅</p>
         <button class="ai_btn">查看详情</button>
       </div>&ndash;&gt;
    </div>-->
    <p class="vue-version">风险提示：基金过往业绩不代表未来表现，相关数据仅供参考！</p>
    <div v-transfer-dom>
      <x-dialog v-model="showScrollBox1" class="dialog-demo">
        <p class="dialog-title">系统公告</p>
        <div class="img-box" style="height:160px;overflow:scroll;-webkit-overflow-scrolling:touch;">
          <div class="box">
            <h3>现金宝快速赎回业务暂停公告!</h3>
           <!-- <p>第一条 </p>-->
            <p>尊敬的投资者，您好。因银行系统维护，现金宝快速赎回业务从2018年6月23日9:00至6月24日8:00将暂停，普通赎回不受影响。给您带来的不便，敬请谅解！谢谢！</p>
          </div>
        </div>
        <div @click="showScrollBox1=false" style="padding:10px;">
          <x-button type="primary" :gradients="['#FF9500', '#FF9500']">确认</x-button>
        </div>
      </x-dialog>
    </div>
  </div>
</template>

<script>
import { Cell, Group, Box, Marquee, MarqueeItem, XDialog, Search, Badge, Divider, Swiper, GroupTitle, SwiperItem, XButton, Grid, GridItem, Banners, TransferDomDirective as TransferDom } from 'vux'
import { mianUrl, mianUrlt9 } from '../vuex/api'
import { getLocalStorage,setLocalStorage } from '../vuex/storage'
const pkg = require('../../package.json')
const version = pkg.version
const vueVersion = pkg.devDependencies.vue
/* const baseList = [{
  url: 'javascript:',
  img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg',
  title: '送你一朵fua'
}, {
  url: 'javascript:',
  img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg',
  title: '送你一辆车'
}, {
  url: 'javascript:',
  img: 'https://static.vux.li/demo/5.jpg', // 404
  title: '送你一次旅行',
  fallbackImg: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
}] */
export default {
  directives: {
    TransferDom
  },
  components: {
    Cell,
    Group,
    Marquee,
    Box,
    MarqueeItem,
    XDialog,
    Search,
    Badge,
    Divider,
    Swiper,
    SwiperItem,
    GroupTitle,
    XButton,
    Grid,
    GridItem
  },
  methods: {
    goTest() {
      this.$router.push({
        path: '/component/intell-vip'
      })
    },
    goLofr() {
      this.$router.push({
        path: '/component/strategy-detail',
        query: { groupCode: 'LOFR2',groupName:'小富即安' }
      })
    },
    group (val, name) {
      this.$router.push({
        path: '/component/group-detail',
        query: {groupCode: val, groupName: name}
      })
    },
    tag (str) {
      if (str === 'smart') {
        this.$router.push({
          path: '/component/smartdetail'
        })
      } else {
        this.$router.push({
          path: '/component/lofrdetail'
        })
      }
    },
    setFocus () {
      this.$refs.search.setFocus()
    },
    resultClick (item) {
      window.alert('you click the result item: ' + JSON.stringify(item))
    },
    getResult (val) {
      console.log('on-change', val)
      this.results = val ? getResult(this.value) : []
    },
    onSubmit () {
      this.$refs.search.setBlur()
      this.$vux.toast.show({
        type: 'text',
        position: 'top',
        text: 'on submit'
      })
    },
    /*onFocus () {
      this.$router.push(`/component/sreach-fund`)
    },*/
    onCancel () {
      console.log('on cancel')
    },
    onSwiperItemIndexChange (index) {
      console.log('demo item change', index)
    },
    onItemClick () {
      console.log('on item click')
    },
    /*created () {
      this.$http.post(mianUrl + '/getAllIndexAction').then(({data}) => {
        if (data.retcode === '0000') {
          for (var value in data.data) {
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
        }
      })
    },*/
    getLofr (code, num, index) {
      this.number = index
      this.$http.post(mianUrlt9 + 'fund/tacticsChart', { // 请求参数
        tacticsCode: code,
        startType: num
      }, {emulateJSON: true}).then((res) => {
        if (res.data.retCode === '0') {
          let ben = res.data.data.yfundNavReturnRatioList
          for (let i = 0; i < ben.length; i++) {
            ben[i] = Number(ben[i])
          }
          if (num === 6) {
            this.mingcheng = '成立以来'
          } else if (num === 1) {
            this.mingcheng = '近三月涨幅'
          } else if (num === 2) {
            this.mingcheng = '近六月涨幅'
          } else if (num === 3) {
            this.mingcheng = '近一年涨幅'
          }
          this.changedata1 = (Number(ben[(ben.length - 1)]) > 0 ? '+' + Number(ben[(ben.length - 1)]).toFixed(2) + '%' : Number(ben[(ben.length - 1)]).toFixed(2) + '%')
          this.changedata = Number(ben[(ben.length - 1)])
        } else {
          let msg = res.data.retMsg
          this.$vux.toast.text(msg, 'middle', 3000)
        }
      })
    },
    /*getSmart (code, num, index) {
      this.number = index
      this.$http.post(mianUrlt9 + 'fund/tacticsChart', { // 请求参数
        tacticsCode: code,
        startType: num
      }, {emulateJSON: true}).then((res) => {
        if (res.data.retCode === '0') {
          let ben = res.data.data.yfundNavReturnRatioList
          for (var i = 0; i < ben.length; i++) {
            ben[i] = Number(ben[i])
          }
          if (num === 6) {
            this.mingcheng_s = '成立以来'
          } else if (num === 1) {
            this.mingcheng_s = '近三月涨幅'
          } else if (num === 2) {
            this.mingcheng_s = '近六月涨幅'
          } else if (num === 3) {
            this.mingcheng_s = '近一年涨幅'
          }
          this.changedata1_s = (Number(ben[(ben.length - 1)]) > 0 ? '+' + Number(ben[(ben.length - 1)]).toFixed(2) + '%' : Number(ben[(ben.length - 1)]).toFixed(2) + '%')
          this.changedata_s = Number(ben[(ben.length - 1)])
        } else {
          const msg = res.data.retMsg
          this.$vux.toast.text(msg, 'middle', 3000)
        }
      })
    },*/
    getGroupList () {
      this.$http.post(mianUrlt9 + 'fund/recommendGroupList', {}, {emulateJSON: true}).then((res) => {
        // console.log(res)
        if (res.data.retCode === '0') {
          for (let i = 0; i < res.data.data.groupList.length; i++) {

              let obj = {}
              obj.fdReturnYearRatio = res.data.data.groupList[i].fdReturnYearRatio
              obj.groupBuyLimit = res.data.data.groupList[i].groupBuyLimit
              obj.groupCode = res.data.data.groupList[i].groupCode
              obj.groupName = res.data.data.groupList[i].groupName
              obj.groupText = res.data.data.groupList[i].recommendReason
              if (res.data.data.groupList[i].groupCode == "CJ1001") {
                obj.groupGrade = 3
              } else if (res.data.data.groupList[i].groupCode == "CJ1004") {
                obj.groupGrade = 2
              } else if (res.data.data.groupList[i].groupCode == "CJ1007") {
                obj.groupGrade = 1
              }
              this.groupList.push(obj)
            }
          }

      })
    }
  },
  mounted () {
    //this.created()
    this.getLofr('LOFR2', 3)
    //this.getSmart('smart1', 3)
    this.getGroupList()
  },
  data () {
    return {
      version,
      vueVersion,
      demo01_list: Banners,
      demo02_index: 1,
      demo01_index: 0,
      groupList: [],
      mingcheng: '',
      changedata1: '',
      changedata: '',
      mingcheng_s: '',
      changedata1_s: '',
      changedata_s: '',
      results: [],
      showScrollBox1: false,
      value: '',
      date: '',
      //source: this.$route.query.groupCode,
      showNotice: true,
      indexList: [],
      menulist: [{
        img: '../assets/grid_icon.png',
        title: '精选基金',
        url: '/component/choice-fund'
      }, {
        img: 'https://corp.5irich.com/images/grid_icon.png',
        title: '全部基金',
        url: '/component/all-fund'
      }, {
        img: 'https://corp.5irich.com/images/grid_icon.png',
        title: '智能组合',
        url: ''
      }, {
        img: 'https://corp.5irich.com/images/grid_icon.png',
        title: '轮动策略',
        url: ''
      }, {
        img: 'https://corp.5irich.com/images/grid_icon.png',
        title: '智能定投',
        url: ''
      }, {
        img: 'https://corp.5irich.com/images/grid_icon.png',
        title: '魔凡选基',
        url: ''
      }, {
        img: 'https://corp.5irich.com/images/grid_icon.png',
        title: '现金宝',
        url: ''
      }, {
        img: 'https://corp.5irich.com/images/grid_icon.png',
        title: '创富宝',
        url: ''
      }]
    }
  }
}
function getResult (val) {
  let rs = []
  for (let i = 0; i < 20; i++) {
    rs.push({
      title: `${val} result: ${i + 1} `,
      other: i
    })
  }
  return rs
}
</script>

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
  .center {
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

  .aibg img{
    display: block;
    width: 100%;
    height: auto;
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
  }
  .ai_full{
    font-size: 14px;
    color: #898989;
    margin-bottom: 8px;
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
