<template>
  <div>
    <div class="my_center"
         style="background: -webkit-linear-gradient(left top, #2c88ff , #1d5ffc); background: linear-gradient(to bottom right, #2c88ff , #1d5ffc);">
      <div>
        <img :src="imgurl" id="user_headimg">
      </div>
      <div class="my_center_left">
        <h2>{{username}},您好！</h2>
        <p>欢迎来到个人中心！</p>
      </div>
    </div>
    <div class="group_list">
      <!--<cell title="交易记录" value="" is-link link="/component/trade-record"></cell>
      title="定投计划" value="" is-link link="/component/invplan" -->
      <router-link to="/component/invplan">
        <div class="group_list_items">
          <div class="group_list_item_ico"><img src="../assets/dt_icon.png"/></div>
          <div class="group_list_item_text">定投计划</div>
          <div class="group_list_item_more"><img src="../assets/gengduo.png"/></div>
        </div>
      </router-link>
    </div>
    <div class="group_list">
      <!--<cell title="交易记录" value="" is-link link="/component/trade-record"></cell>
      title="定投计划" value="" is-link link="/component/invplan" -->
      <router-link to="/component/tradepass">
        <div class="group_list_items">
          <div class="group_list_item_ico"><img src="../assets/jy_icon.png"/></div>
          <div class="group_list_item_text">交易密码修改</div>
          <div class="group_list_item_more"><img src="../assets/gengduo.png"/></div>
        </div>
      </router-link>
      <router-link to="/component/loginpass">
        <div class="group_list_item">
          <div class="group_list_item_ico"><img src="../assets/dl_icon.png"/></div>
          <div class="group_list_item_text">登录密码修改</div>
          <div class="group_list_item_more"><img src="../assets/gengduo.png"/></div>
        </div>
      </router-link>
      <router-link to="/component/tradeforget">
        <div class="group_list_item">
          <div class="group_list_item_ico"><img src="../assets/wj_icon.png"/></div>
          <div class="group_list_item_text">忘记交易密码</div>
          <div class="group_list_item_more"><img src="../assets/gengduo.png"/></div>
        </div>
      </router-link>
    </div>
    <div class="group_list">
      <!--<cell title="交易记录" value="" is-link link="/component/trade-record"></cell>
      title="定投计划" value="" is-link link="/component/invplan" -->
      <router-link to="/component/banklist">
        <div class="group_list_items">
          <div class="group_list_item_ico"><img src="../assets/yh_icon.png"/></div>
          <div class="group_list_item_text">银行卡管理</div>
          <div class="group_list_item_more"><img src="../assets/gengduo.png"/></div>
        </div>
      </router-link>
      <router-link to="/component/risk-question">
        <div class="group_list_item">
          <div class="group_list_item_ico"><img src="../assets/fx_icon.png"/></div>
          <div class="group_list_item_text">风险测评</div>
          <div class="group_list_item_more"><img src="../assets/gengduo.png"/></div>
        </div>
      </router-link>
      <router-link to="/component/tax">
        <div class="group_list_item">
          <div class="group_list_item_ico"><img src="../assets/fx_icon.png"/></div>
          <div class="group_list_item_text">涉税信息修改</div>
          <div class="group_list_item_more"><img src="../assets/gengduo.png"/></div>
        </div>
      </router-link>
      <div class="group_list_item">
        <div class="group_list_item_ico"><img src="../assets/kf_icon.png"/></div>
        <div class="group_list_item_text">联系我们</div>
        <div class="group_list_item_text" style="text-align: right">400-6262-818</div>
        <div class="group_list_item_more"><img src="../assets/gengduo.png"/></div>
      </div>

    </div>
    <!--<group style="margin-top: 10px;" class="two">
      <cell title="交易密码修改" value="" is-link link='/component/tradepass'></cell>
      <cell title="登录密码修改" value="" is-link link='/component/loginpass'></cell>
      <cell title="忘记交易密码" value="" is-link link='/component/tradeforget'></cell>
    </group>-->
    <!--<group style="margin-top: 10px;" class="three">
      <cell title="银行卡管理" value="" is-link link='/component/banklist'></cell>
      <cell title="风险测评" value="" is-link link='/component/risk-question'></cell>
      <cell title="涉税信息修改" value="" is-link link='/component/tax'></cell>
      <cell title="联系我们" value="400-626-2818" is-link></cell>
    </group>-->
    <div class="btn" @click="loginout">
      退出登录
      <!--<x-button type="primary" action-type="button" @click.native="loginout">退出登录</x-button>-->
    </div>
    <toast v-model="showPositionValue" type="text" :time="800" width="18em" is-show-mask :text="toastText"
           :position="position"></toast>
  </div>
</template>
<script>
  import {Group, Cell, Toast, CellBox, XButton} from 'vux'
  import {mianUrlt9} from '../vuex/api'
  import {getLocalStorage} from '../vuex/storage'
  import Grid from "./Grid";

  export default {
    data() {
      return {
        username: '张三',
        position: 'default',
        toastText: '加入自选成功！',
        showPositionValue: false,
        imgurl: './static/image/header.png'
      }
    },
    mounted() {
      this.getname()
    },
    methods: {
      getname() {
        this.username = getLocalStorage('userName')
        var imgurl = getLocalStorage('weixinHeadimgurl')
        if (imgurl !== '') {
          this.imgurl = imgurl
        }
      },
      showPosition(position) {
        this.position = position
        this.showPositionValue = true
      },
      loginout() {
        this.$http.post(mianUrlt9 + 'user/logout').then((res) => {
          if (res.data.retCode === '0') {
            localStorage.clear()
            this.$router.push('/')
          } else if (res.data.retCode === '990101') {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
            this.$router.push({
              path: '/component/login',
              query: {path: this.$route.fullPath}
            })
          } else if (res.data.retCode === '990102') {
            this.toastText = res.data.data[0].field + '' + res.data.data[0].message
            this.showPosition('middle')
          } else if (res.data.retCode === '990103') {
            this.toastText = '系统正在维护，请稍后再试'
            this.showPosition('middle')
          } else if (res.data.retCode === '990104') {
            this.toastText = '服务器内部错误'
            this.showPosition('middle')
          } else {
            this.toastText = res.data.retMsg
            this.showPosition('middle')
          }
        })
      }
    },
    components: {
      Grid,
      Group,
      Cell,
      CellBox,
      XButton,
      Toast
    }
  }
</script>
<style lang="less" scoped>
  .my_center {
    overflow: hidden;
    background-color: #ffffff;
    padding: 15px 20px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .my_center::after {
    content: " ";
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    height: 1px;
    border-bottom: 1px solid #D9D9D9;
    color: #D9D9D9;
    -webkit-transform-origin: 0 100%;
    transform-origin: 0 100%;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }

  .my_center_left {
    margin-left: 10px;
    flex: 1;
  }

  .my_center_left h2 {
    font-size: 16px;
    color: #fff;
    font-weight: normal;
  }

  .my_center_left p {
    font-size: 12px;
    color: #a9bffe;
    text-align: left;
  }

  .group_list {
    position: relative;
    background-color: #fff;
    margin-top: 10px;
  }

  .group_list_items {
    height: 48px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .group_list_item {
    height: 48px;
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    -webkit-box-align: center;
    -webkit-align-items: center;
    align-items: center;
  }

  .group_list_item_text {
    -webkit-box-flex: 1;
    -webkit-flex: 1;
    flex: 1;
    margin-left: 10px;
    color: #444444;
    font-size: 16px;
  }

  .group_list_item_ico {
    width: 24px;
    height: 24px;
    margin-left: 15px;
  }

  .group_list_item_ico img {
    width: 24px;
    height: 24px;
  }

  .group_list_item_more {
    height: 24px;
    width: 24px;
    margin-right: 10px;
  }

  .group_list_item_more img {
    height: 24px;
    width: 24px;
  }

  #user_headimg {
    display: block;
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }

  .group_list_item:before {
    content: " ";
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    border-top: 1px solid #ededed;
    color: #D9D9D9;
    -webkit-transform-origin: 0 0;
    transform-origin: 0 0;
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
    left: 15px;
    right: 15px;
  }

  .btn {
    background-color: #fff;
    height: 48px;
    margin-top: 10px;
    color: #444444;
    text-align: center;
    line-height: 48px;
  }

</style>

