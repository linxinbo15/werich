<template>
  <div style="height:100%;">
    <div v-transfer-dom>
      <loading v-model="isLoading"></loading>
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="menus" v-model="showMenu" @on-click-menu="changeLocale"></actionsheet>
    </div>

    <drawer
      width="200px;"
      :show.sync="drawerVisibility"
      :show-mode="showModeValue"
      :placement="showPlacementValue"
      :drawer-style="{'background-color':'#ffffff', width: '200px'}">

      <!-- drawer content -->
      <div slot="drawer">
        <!--<group title="关于创金启富" style="margin-top:20px;">
          <cell title="公司介绍" link="https://corp.5irich.com/" value="详情" @click.native="drawerVisibility = false"></cell>
          <cell title="创金智投" link="https://corp.5irich.com/richai.html" @click.native="drawerVisibility = false"></cell>
          <cell title="创金资管" link="https://corp.5irich.com/manager.html" value="详情" @click.native="drawerVisibility = false"></cell>
        </group>-->
        <div>
          <div class="comp_logo">
            <div class="comp_logo_icon"><img slot="icon" src="../static/image/logo_com.png"></div>
            <h2>创金启富</h2>
          </div>
          <div>
            <router-link to="https://corp.5irich.com/">
              <div class="comp_list">
                <div class="comp_list_ico"><img src="../static/image/comp1.png"></div>
                <div class="comp_list_text">公司介绍</div>
              </div>
            </router-link>
            <router-link to="https://corp.5irich.com/richai.html">
              <div class="comp_list">
                <div class="comp_list_ico"><img src="../static/image/comp2.png"></div>
                <div class="comp_list_text">创金智投</div>
              </div>
            </router-link>
            <router-link to="https://corp.5irich.com/manager.html">
              <div class="comp_list">
                <div class="comp_list_ico"><img src="../static/image/comp3.png"></div>
                <div class="comp_list_text">创金资管</div>
              </div>
            </router-link>
          </div>
          <div class="comp_end">
            北京创金启富基金销售有限公司<br>
            许可证号：000000315
          </div>
        </div>

        <!--<group title="showMode">
          <radio v-model="showMode" :options="['push', 'overlay']" @on-change="onShowModeChange"></radio>
        </group>
        <group title="placement">
          <radio v-model="showPlacement" :options="['left', 'right']" @on-change="onPlacementChange"></radio>
        </group>-->
      </div>

      <!-- main content -->
      <view-box ref="viewBox" body-padding-top="46px" body-padding-bottom="50px">

        <x-header slot="header"
                  style="width:100%;position:absolute;left:0;top:0;z-index:100;"
                  :left-options="leftOptions"
                  :right-options="rightOptions"
                  :title="title"
                  :transition="headerTransition"
                  :bg='bg'
                  :titlecolor='titlecolor'
                  @on-click-more="onClickMore">
          <span v-if="route.path === '/' || route.path === '/component/drawer'" slot="overwrite-left"
                @click="drawerVisibility = !drawerVisibility">
            <x-icon type="navicon"  size="32" style="fill:#000;position:relative;top:-6px;left:-3px;"></x-icon>
          </span>
          <a slot="right" @click="onSreach" class="sreach" v-show="!issearch">&#xe62f;</a>
        </x-header>

        <!-- remember to import BusPlugin in main.js if you use components: x-img and sticky -->
        <transition
          @after-enter="$vux.bus && $vux.bus.$emit('vux:after-view-enter')"
          :name="viewTransition" :css="!!direction">
          <router-view class="router-view"></router-view>
        </transition>

        <tabbar class="vux-demo-tabbar" icon-class="vux-center" v-show="!isTabbarDemo" slot="bottom">
          <tabbar-item :link="{path:'/'}" :selected="route.path === '/'">
            <span class="demo-icon-22 vux-demo-tabbar-icon-home" slot="icon" style="position:relative;top: -2px;">&#xe65b;</span>
            <span slot="label">首页</span>
          </tabbar-item>
          <tabbar-item @on-item-click="goChoice" :selected="route.path === '/component/addchoice'" badge=" ">
            <span class="demo-icon-22" slot="icon">&#xe660;</span>
            <span slot="label"><span>自选</span></span>
          </tabbar-item>
          <tabbar-item :link="{path:'/component/advance'}" :selected="route.path === '/component/advance'">
            <span class="demo-icon-22" slot="icon">&#xe65f;</span>
            <span slot="label"><span>高端理财</span></span>
          </tabbar-item>
          <tabbar-item @on-item-click="goAsset" :selected="route.path === '/component/my'" badge=" ">
            <span class="demo-icon-22" slot="icon">&#xe668;</span>
            <span slot="label"><span>我的</span></span>
          </tabbar-item>
        </tabbar>

      </view-box>
    </drawer>
  </div>
</template>

<script>
  import {
    Radio,
    Group,
    Cell,
    Badge,
    Drawer,
    Actionsheet,
    ButtonTab,
    ButtonTabItem,
    ViewBox,
    XHeader,
    Tabbar,
    TabbarItem,
    Loading,
    TransferDom
  } from 'vux'
  import {mapState, mapActions} from 'vuex'
  import {setLocalStorage,getLocalStorage} from 'vuex/storage'
  import {mianUrlt9} from 'vuex/api'

  export default {
    directives: {
      TransferDom
    },
    components: {
      Radio,
      Group,
      Cell,
      Badge,
      Drawer,
      ButtonTab,
      ButtonTabItem,
      ViewBox,
      XHeader,
      Tabbar,
      TabbarItem,
      Loading,
      Actionsheet
    },
    methods: {
      goChoice() {
        this.$http.post(mianUrlt9 + 'user/getUserInfo', {}, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            setLocalStorage('userName', res.data.data.userName)
            setLocalStorage('isopen', res.data.data.isOpen)
            setLocalStorage('sendTel', res.data.data.sendTel)
            setLocalStorage('sn', res.data.data.idNumber)
            setLocalStorage('Tel', res.data.data.tel)
            // console.log(res.data.data.tel)
            setLocalStorage('x', res.data.data.xscore)
            setLocalStorage('y', res.data.data.yscore)
            setLocalStorage('z', res.data.data.zscore)
            setLocalStorage('level', res.data.data.preferenceLevel)
            setLocalStorage('riskLevel', res.data.data.riskLevel)
            if (res.data.data.weiXinHeadImgUrl === undefined || res.data.data.weiXinHeadImgUrl == null) {
              setLocalStorage('weixinHeadimgurl', '')
            } else {
              setLocalStorage('weixinHeadimgurl', res.data.data.weiXinHeadImgUrl)
            }
            if (res.data.data.isweixin === undefined) {
              setLocalStorage('isweixin', '')
            } else {
              setLocalStorage('isweixin', res.data.data.isweixin)
            }
            if (res.data.data.taxType === undefined) {
              res.data.data.taxType = 'underfined'
            }
            setLocalStorage('taxType', res.data.data.taxType)
            this.$router.push({
              path: '/component/addchoice',
              query: {path: this.$route.fullPath}
            })
          } else if (res.data.retCode === '990101') {
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
            })
          } else {
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
            })
          }
        })
      },
      onSreach() {
        this.$router.push(`/component/sreach-fund`)
      },
      goAsset() {
        this.$http.post(mianUrlt9 + 'user/getUserInfo', {}, {emulateJSON: true}).then((res) => {
          if (res.data.retCode === '0') {
            setLocalStorage('userName', res.data.data.userName)
            setLocalStorage('isopen', res.data.data.isOpen)
            setLocalStorage('sendTel', res.data.data.sendTel)
            setLocalStorage('sn', res.data.data.idNumber)
            setLocalStorage('Tel', res.data.data.tel)
            // console.log(res.data.data.tel)
            setLocalStorage('x', res.data.data.xscore)
            setLocalStorage('y', res.data.data.yscore)
            setLocalStorage('z', res.data.data.zscore)
            setLocalStorage('level', res.data.data.preferenceLevel)
            setLocalStorage('riskLevel', res.data.data.riskLevel)
            if (res.data.data.weiXinHeadImgUrl === undefined || res.data.data.weiXinHeadImgUrl == null) {
              setLocalStorage('weixinHeadimgurl', '')
            } else {
              setLocalStorage('weixinHeadimgurl', res.data.data.weiXinHeadImgUrl)
            }
            if (res.data.data.isweixin === undefined) {
              setLocalStorage('isweixin', '')
            } else {
              setLocalStorage('isweixin', res.data.data.isweixin)
            }
            if (res.data.data.taxType === undefined) {
              res.data.data.taxType = 'underfined'
            }
            setLocalStorage('taxType', res.data.data.taxType)
            const that = this
            if (getLocalStorage('isopen') == '0') { // 未开户
              /*this.$router.push({
                path: '/component/account',
                query: {path: this.$route.path}
              })*/
              this.$vux.confirm.show({
                title: '尚未开户',
                content: '查询资产前，需要您先开通基金账户！',
                onShow () {
                  console.log('plugin show')
                },
                onHide () {
                  console.log('plugin hide')
                },
                onCancel () {
                  that.$router.push({path: '/component/login', query: {path: '/component/asset'}})
                },
                onConfirm () {
                  that.$router.push({path: '/component/account', query: {path: that.$route.fullPath}})
                }
              })
            } /*else if (getLocalStorage('riskLevel') == null || getLocalStorage('riskLevel') == '') { // 未做风险测评
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
            } */else {
              this.$router.push({
                path: '/component/asset',
                query: {path: this.$route.fullPath}
              })
            }
          } else if (res.data.retCode === '990101') {
            this.$router.push({
              path: '/component/login',
              query: {path: '/component/asset'}
            })
          } else {
            this.$router.push({
              path: '/component/login',
              query: {path: '/component/asset'}
            })
          }
        })
      },
      onShowModeChange(val) {
        /** hide drawer before changing showMode **/
        this.drawerVisibility = false
        setTimeout(one => {
          this.showModeValue = val
        }, 400)
      },
      onPlacementChange(val) {
        /** hide drawer before changing position **/
        this.drawerVisibility = false
        setTimeout(one => {
          this.showPlacementValue = val
        }, 400)
      },
      onClickMore() {
        this.showMenu = true
      },
      changeLocale(locale) {
        //console.log(locale)
        if(locale == 'share') {
          this.$router.push({
            path: '/component/service'
          })
        } else if(locale == 'phone') {

        } else if (locale == 'out') {
          this.$http.post(mianUrlt9 + 'user/logout').then((res) => {
            if (res.data.retCode === '0') {
              localStorage.clear()
              this.$router.push('/')
            } else if (res.data.retCode === '990101') {
              this.$vux.toast.text(res.data.retMsg, 'middle', 3000)
              this.$router.push({
                path: '/component/login',
                query: {path: this.$route.fullPath}
              })
            } else if (res.data.retCode === '990102') {
              this.$vux.toast.text(res.data.data[0].field + '' + res.data.data[0].message, 'middle', 3000)
            } else if (res.data.retCode === '990103') {
              this.$vux.toast.text('系统正在维护，请稍后再试', 'middle', 3000)
            } else if (res.data.retCode === '990104') {
              this.$vux.toast.text('服务器内部错误', 'middle', 3000)
            } else {
              this.$vux.toast.text(res.data.retMsg, 'middle', 3000)
            }
          })
        }
      //}
        //this.$i18n.set(locale) 切换中英文以后有用
        //this.$locale.set(locale) 切换中英文以后有用
      },
      ...mapActions([
        'updateDemoPosition'
      ])
    },
    mounted() {
      this.handler = () => {
        if (this.path === '/demo') {
          this.box = document.querySelector('#demo_list_box')
          this.updateDemoPosition(this.box.scrollTop)
        }
      }
      // this.isTabbarDemoAuto()
    },
    beforeDestroy() {
      this.box && this.box.removeEventListener('scroll', this.handler, false)
    },
    watch: {
      path(path) {
        if (path === '/component/demo') {
          this.$router.replace('/demo')
          return
        }
        if (path === '/demo') {
          setTimeout(() => {
            this.box = document.querySelector('#demo_list_box')
            if (this.box) {
              this.box.removeEventListener('scroll', this.handler, false)
              this.box.addEventListener('scroll', this.handler, false)
            }
          }, 1000)
        } else {
          this.box && this.box.removeEventListener('scroll', this.handler, false)
        }
      }
    },
    computed: {
      ...mapState({
        route: state => state.route,
        path: state => state.route.path,
        deviceready: state => state.app.deviceready,
        demoTop: state => state.vux.demoScrollTop,
        isLoading: state => state.vux.isLoading,
        direction: state => state.vux.direction
      }),
      bg() {               //设置智能组合详情页标题栏背景颜色
        if (/zuhedetail/.test(this.route.path) || /intro/.test(this.route.path)) {
          return '#021f4d'
        } else {
          return '#fff'
        }
      },
      titlecolor() {      //设置智能组合详情页标题栏字体颜色
        if (/zuhedetail/.test(this.route.path) || /intro/.test(this.route.path)) {
          return '#fff'
        } else {
          return '#000'
        }
      },
      isTabbarDemo() {
        if (/fund-detail/.test(this.route.path)) {
          return true
        } else if (/tabbar/.test(this.route.path)) {
          return true
        } else if (/login/.test(this.route.path)) {
          return true
        } else if (/register/.test(this.route.path)) {
          return true
        } else if (/invest-home/.test(this.route.path)) {
          return true
        } else if (/invest-step/.test(this.route.path)) {
          return true
        } else if (/intell-test/.test(this.route.path)) {
          return true
        } else if (/zuhedetail/.test(this.route.path)) {
          return true
        } else if (/smartdetail/.test(this.route.path)) {
          return true
        } else if (/lofrdetail/.test(this.route.path)) {
          return true
        } else if (/efund/.test(this.route.path)) {
          return true
        } else if (/invest-success/.test(this.route.path)) {
          return true
        } else if (/account/.test(this.route.path)) {
          return true
        } else if (/assetliststr/.test(this.route.path)) {
          return true
        } else if (/assetlistgr/.test(this.route.path)) {
          return true
        } else if (/assetlistsin/.test(this.route.path)) {
          return true
        } else if (/assetdetail/.test(this.route.path)) {
          return true
        } else if (/assetrecord/.test(this.route.path)) {
          return true
        } else if (/assdetailxian/.test(this.route.path)) {
          return true
        } else if (/assdetailsin/.test(this.route.path)) {
          return true
        } else if (/assinvest/.test(this.route.path)) {
          return true
        } else if (/assdetailinv/.test(this.route.path)) {
          return true
        } else if (/my/.test(this.route.path)) {
          return true
        } else if (/tradepass/.test(this.route.path)) {
          return true
        } else if (/loginpass/.test(this.route.path)) {
          return true
        } else if (/banklist/.test(this.route.path)) {
          return true
        } else if (/tradeforget/.test(this.route.path)) {
          return true
        } else if (/loginforget/.test(this.route.path)) {
          return true
        } else if (/buy-fund/.test(this.route.path)) {
          return true
        } else if (/buy-group/.test(this.route.path)) {
          return true
        } else if (/risk-question/.test(this.route.path)) {
          return true
        } else if (/trade-agment/.test(this.route.path)) {
          return true
        } else if (/trade-ydagment/.test(this.route.path)) {
          return true
        } else if (/invest-fund/.test(this.route.path)) {
          return true
        } else if (/convert-fund/.test(this.route.path)) {
          return true
        } else if (/redeem-fund/.test(this.route.path)) {
          return true
        } else if (/addbank/.test(this.route.path)) {
          return true
        } else if (/bindingwx/.test(this.route.path)) {
          return true
        } else if (/redeem-cash/.test(this.route.path)) {
          return true
        } else if (/redeem-group/.test(this.route.path)) {
          return true
        } else if (/group-detail/.test(this.route.path)) {
          return true
        } else if (/trade-record/.test(this.route.path)) {
          return true
        } else if (/tradefund/.test(this.route.path)) {
          return true
        } else if (/invplan/.test(this.route.path)) {
          return true
        } else if (/intro/.test(this.route.path)) {
          return true
        } else if (/home-vip/.test(this.route.path)) {
          return true
        } else if (/intell-vip/.test(this.route.path)) {
          return true
        } else if (/chuangfu/.test(this.route.path)) {
          return true
        } else if (/service/.test(this.route.path)) {
          return true
        } else {
          return false
        }
      },
      issearch() {
        if (/component/.test(this.route.path)) {
          return true
        } else {
          return false
        }
      },
      isShowBar() {
        if (/component/.test(this.path)) {
          return true
        }
        return false
      },
      leftOptions() {
        return {
          showBack: this.route.path !== '/'
        }
      },
      rightOptions() {
        return {
          showMore: true
        }
      },
      headerTransition() {
        if (!this.direction) return ''
        return this.direction === 'forward' ? 'vux-header-fade-in-right' : 'vux-header-fade-in-left'
      },
      componentName() {
        if (this.route.path) {
          const parts = this.route.path.split('/')
          if (/component/.test(this.route.path) && parts[2]) return parts[2]
        }
      },
      isDemo() {
        return /component|demo/.test(this.route.path)
      },
      title() {
        if (this.route.path === '/') return '创金智投'
        if (this.route.path === '/component/home-vip') return '创金智投VIP产品'
        if (this.route.path === '/component/intell-vip') return '创金智投VIP'
        /* if (this.route.path === '/project/donate') return 'Donate'
        if (this.route.path === '/demo') return '组件列表' */
        if (this.route.path === '/component/choice-fund') return '精选基金'
        if (this.route.path === '/component/service') return '智能客服'
        if (this.route.path === '/component/all-fund') return '全部基金'
        if (this.route.path === '/component/intell-test') return '智能测评'
        if (this.route.path === '/component/zuhedetail') return '智能组合'
        if (this.route.path === '/component/strategy-list') return '智能策略'
        if (this.route.path === '/component/strategy-detail') return '策略详情'
        if (this.route.path === '/component/smartdetail') return 'SmartBeta'
        if (this.route.path === '/component/lofrdetail') return '小富即安'
        if (this.route.path === '/component/spring') return '春暖花开理财季'
        if (this.route.path === '/component/duanwu') return '端午理财'
        if (this.route.path === '/component/summer') return '夏日理财'
        if (this.route.path === '/component/steady') return '稳健理财'
        if (this.route.path === '/component/warm') return '暖心理财'
        if (this.route.path === '/component/sep') return '定投给你满满爱'
        if (this.route.path === '/component/mofan') return '12月摩凡'
        if (this.route.path === '/component/efund') return '现金宝'
        if (this.route.path === '/component/mofantotal') return '用TA赚钱——摩凡'
        if (this.route.path === '/component/investevent') return '基金定投'
        if (this.route.path === '/component/safe') return '安全保障'
        if (this.route.path === '/component/sreach-fund') return '搜索基金'
        if (this.route.path === '/component/fund-detail') return '基金详情'
        if (this.route.path === '/component/login') return '用户登录'
        if (this.route.path === '/component/register') return '用户注册'
        if (this.route.path === '/component/invest-home') return '智能定投'
        if (this.route.path === '/component/invest-step') return '创建智能定投'
        if (this.route.path === '/component/invest-step1') return '创建智能定投'
        if (this.route.path === '/component/invest-success') return '定投计划成功'
        if (this.route.path === '/component/account') return '开户'
        if (this.route.path === '/component/asset') return '我的资产'
        if (this.route.path === '/component/assetliststr') return '策略资产'
        if (this.route.path === '/component/assetlistgr') return '组合资产'
        if (this.route.path === '/component/assetlistsin') return '单只基金资产'
        if (this.route.path === '/component/assetdetail') return '资产详情'
        if (this.route.path === '/component/assdetailxian') return '现金宝'
        if (this.route.path === '/component/assdetailsin') return '资产详情'
        if (this.route.path === '/component/assetrecord') return '收益记录'
        if (this.route.path === '/component/assinvest') return '定投资产'
        if (this.route.path === '/component/assdetailinv') return '定投资产详情'
        if (this.route.path === '/component/addchoice') return '我的自选'
        if (this.route.path === '/component/my') return '个人中心'
        if (this.route.path === '/component/tradepass') return '交易密码修改'
        if (this.route.path === '/component/loginpass') return '登录密码修改'
        if (this.route.path === '/component/loginforget') return '忘记登录密码'
        if (this.route.path === '/component/tradeforget') return '忘记交易密码'
        if (this.route.path === '/component/banklist') return '银行卡管理'
        if (this.route.path === '/component/addbank') return '新增银行卡'
        if (this.route.path === '/component/bindingwx') return '绑定微信'
        if (this.route.path === '/component/buy-fund') return '基金购买'
        if (this.route.path === '/component/buy-group') return '智能组合购买'
        if (this.route.path === '/component/advance' || this.route.path === '/component/advanceobj') return '高端理财'
        if (this.route.path === '/component/risk-question') return '投资风险测评'
        if (this.route.path === '/component/trade-agment') return '基金交易协议'
        if (this.route.path === '/component/trade-ydagment') return '约定交易协议'
        if (this.route.path === '/component/invest-fund') return '基金定投'
        if (this.route.path === '/component/redeem-fund') return '基金赎回'
        if (this.route.path === '/component/convert-fund') return '基金转换'
        if (this.route.path === '/component/redeem-cash') return '现金宝转出'
        if (this.route.path === '/component/redeem-group') return '组合赎回'
        if (this.route.path === '/component/group-detail') return '组合详情'
        if (this.route.path === '/component/tax') return '涉税信息补全'
        if (this.route.path === '/component/trade-record') return '交易记录'
        if (this.route.path === '/component/tradefund') return '组合交易记录'
        if (this.route.path === '/component/invplan') return '我的计划'
        if (this.route.path === '/component/intro') return '智能投顾'
        if (this.route.path === '/component/group-list') return '定制组合'
        if (this.route.path === '/component/chuangfu') return '创富宝'
        return this.componentName ? `Demo/${this.componentName}` : '基础组件'
      },
      viewTransition() {
        if (!this.direction) return ''
        return 'vux-pop-' + (this.direction === 'forward' ? 'in' : 'out')
      }
    },
    data() {
      return {
        showMenu: false,
        //bg:'#fff',
        // isTabbarDemo: false,
        menus: {
          'language.noop': '<span class="menu-title">更多功能</span>',
          'share': '智能客服',
          'phone': '客服电话:400-6262-818',
          'out': '退出登录'
        },
        drawerVisibility: false,
        showMode: 'push',
        showModeValue: 'push',
        showPlacement: 'left',
        showPlacementValue: 'left'
      }
    }
  }
</script>

<style lang="less">
  @import '~vux/src/styles/reset.less';
  @import '~vux/src/styles/1px.less';
  @import '~vux/src/styles/tap.less';

  body {
    background-color: #fbf9fe;
  }

  html, body {
    height: 100%;
    width: 100%;
    overflow-x: hidden;
  }

  .demo-icon-22 {
    font-family: 'vux-demo';
    font-size: 22px;
    color: #888;
  }

  .sreach {
    font-family: 'vux-demo';
    font-size: 22px;
    color: #888;
  }

  .weui-tabbar.vux-demo-tabbar {
    /** backdrop-filter: blur(10px);
    background-color: none;
    background: rgba(247, 247, 250, 0.5);**/
  }

  .vux-demo-tabbar .weui-bar__item_on .demo-icon-22 {
    color: #FF9900;
  }

  .vux-demo-tabbar .weui-tabbar_item.weui-bar__item_on .vux-demo-tabbar-icon-home {
    color: rgb(53, 73, 94);
  }

  .demo-icon-22:before {
    content: attr(icon);
  }

  .vux-demo-tabbar-component {
    background-color: #FF9900;
    color: #fff;
    border-radius: 7px;
    padding: 0 4px;
    line-height: 14px;
  }

  .weui-tabbar__icon + .weui-tabbar__label {
    margin-top: 0 !important;
  }

  .vux-demo-header-box {
    z-index: 100;
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
  }

  /*@font-face {
    font-family: 'vux-demo';  !* project id 70323 *!
    src: url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.eot');
    src: url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.eot?#iefix') format('embedded-opentype'),
    url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.woff') format('woff'),
    url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.ttf') format('truetype'),
    url('https://at.alicdn.com/t/font_h1fz4ogaj5cm1jor.svg#iconfont') format('svg');
  }*/

  @font-face {
    font-family: 'vux-demo';  /* project id 70323 */
    src: url('/static/ali/iconfont.eot');
    src: url('/static/ali/iconfont.eot?#iefix') format('embedded-opentype'),
    url('/static/ali/iconfont.woff') format('woff'),
    url('/static/ali/iconfont.ttf') format('truetype'),
    url('/static/ali/iconfont.svg#iconfont') format('svg');
  }

  .demo-icon {
    font-family: 'vux-demo';
    font-size: 20px;
    color: #04BE02;
  }

  .demo-icon-big {
    font-size: 28px;
  }

  .demo-icon:before {
    content: attr(icon);
  }

  .router-view {
    width: 100%;
    top: 46px;
  }

  .vux-pop-out-enter-active,
  .vux-pop-out-leave-active,
  .vux-pop-in-enter-active,
  .vux-pop-in-leave-active {
    will-change: transform;
    transition: all 500ms;
    height: 100%;
    top: 46px;
    position: absolute;
    backface-visibility: hidden;
    perspective: 1000;
  }

  .vux-pop-out-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .vux-pop-out-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .vux-pop-in-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .vux-pop-in-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .vux-header .vux-header-right a {
    float: right !important;
    margin-right: 8px;
    color: #000;
  }

  .menu-title {
    color: #888;
  }

  .comp_logo {
    height: 160px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    flex-direction: column;
    -webkit-flex-direction: column;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
    justify-content: center;
    -webkit-justify-content: center;
  }

  .comp_list {
    height: 48px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .comp_list:after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    border-bottom: 1px solid #ededed;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .comp_end {
    position: absolute;
    left: 0px;
    bottom: 15px;
    right: 0px;
    font-size: 12px;
    color: #676767;
    line-height: 1.5;
    text-align: center;
  }

  /*.comp{
    position: relative;
    height: 100%;
  }*/
  .comp_logo {
    background: #3b6ef0 url(/static/image/logobg.png) no-repeat right bottom;
    background-size: 100% 100%;
  }

  .comp_logo_icon {
    width: 75px;
    height: 75px;
  }

  .comp_logo_icon img {
    display: block;
    width: 75px;
    height: 75px;
  }

  .comp_logo h2 {
    font-size: 18px;
    font-weight: normal;
    color: #fff;
    margin-top: 8px;
  }

  .comp_list_ico {
    margin-left: 15px;
  }

  .comp_list_ico img {
    width: 20px;
    height: 16px;
    display: block;
  }

  .comp_list_text {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    margin-left: 10px;
    color: #444444;
    font-size: 16px;
  }
</style>
